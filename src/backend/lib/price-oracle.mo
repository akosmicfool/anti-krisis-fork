import Int "mo:core/Int";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Text "mo:core/Text";
import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Array "mo:core/Array";

module {
  /// http_transform for price oracle outcalls — strips non-deterministic headers.
  /// Must be registered as a query function on the actor.
  public func transformPriceResponse(input : OutCall.TransformationInput) : OutCall.TransformationOutput {
    { input.response with headers = [] };
  };

  /// Fetch real-time USD price for a token from DexScreener.
  /// Returns #ok(price) on success, or #err(reason) if the fetch fails or price cannot be parsed.
  /// tokenAddress: checksummed or lowercase EVM address
  /// chain: "base", "ethereum", "arbitrum", etc. (used for logging only; DexScreener is chain-agnostic)
  public func fetchTokenPrice(
    tokenAddress : Text,
    _chain       : Text,
    priceCache   : Map.Map<Text, Float>,
    transformFn  : shared query OutCall.TransformationInput -> async OutCall.TransformationOutput
  ) : async { #ok : Float; #err : Text } {
    let normAddr = tokenAddress.toLower();

    // ── Primary endpoint: /latest/dex/tokens/<address> ────────────────────
    let primaryJson = try {
      await OutCall.httpGetRequest(
        "https://api.dexscreener.com/latest/dex/tokens/" # normAddr,
        [],
        transformFn
      );
    } catch (_e) {
      Debug.print("[price-oracle] Primary endpoint network error for: " # normAddr);
      ""; // empty string signals failure without short-circuiting
    };

    if (primaryJson != "") {
      let price = parseDexScreenerPrice(primaryJson);
      if (price > 0.0) {
        priceCache.add(normAddr, price);
        return #ok(price);
      };
    };

    // ── Fallback endpoint: /latest/dex/search?q=<address> ────────────────
    Debug.print("[price-oracle] Primary returned no price for " # normAddr # " — trying search fallback");
    let searchJson = try {
      await OutCall.httpGetRequest(
        "https://api.dexscreener.com/latest/dex/search?q=" # normAddr,
        [],
        transformFn
      );
    } catch (_e) {
      Debug.print("[price-oracle] Search fallback network error for: " # normAddr);
      return #err("Price unavailable — network error. Please try again later.");
    };

    let fallbackPrice = parseDexScreenerPrice(searchJson);
    if (fallbackPrice > 0.0) {
      priceCache.add(normAddr, fallbackPrice);
      #ok(fallbackPrice)
    } else {
      Debug.print("[price-oracle] Both endpoints returned no price for: " # normAddr);
      #err("Price unavailable — no price data returned by DexScreener. Please try again later.")
    };
  };

  /// Parse DexScreener API JSON to extract pairs[0].priceUsd.
  /// Handles both `"priceUsd":"` and `"priceUsd": "` spacing variants.
  /// Returns 0.0 when the field is absent, pairs is empty, or unparseable.
  /// Parse DexScreener API JSON to extract the best priceUsd.
  /// "Best" means: among all pairs with a non-zero priceUsd, pick the one
  /// with the highest liquidity.usd — this matches the frontend pickBestPair logic.
  /// Returns 0.0 when the field is absent, pairs is empty, or unparseable.
  func parseDexScreenerPrice(json : Text) : Float {
    // Guard: if pairs array is empty ([]) return 0 immediately
    if (containsText(json, "\"pairs\":[]") or containsText(json, "\"pairs\": []")) {
      return 0.0;
    };

    let arr = json.toArray();
    let n = arr.size();

    // We scan the entire JSON for all "priceUsd":"..." occurrences and the
    // nearest "liquidity":{"usd":...} that precedes or follows each priceUsd
    // within the same pair object.  To keep this simple and allocation-free we
    // do two passes:
    //   Pass 1 – collect all (position, priceUsd) hits.
    //   Pass 2 – for each hit, scan backwards from that position for the
    //            nearest "usd":  value (which is the liquidity.usd of that pair).
    // Then return the priceUsd of the hit whose liquidity.usd is highest.

    // ── Pass 1: find all priceUsd values ────────────────────────────────────
    // We store up to 64 (position, price) pairs — more than enough for real responses.
    let maxHits = 64;
    let hitPositions : [var Nat]  = Array.tabulate(maxHits, func _ = 0).toVarArray();
    let hitPrices    : [var Float] = Array.tabulate(maxHits, func _ = 0.0).toVarArray();
    var hitCount     = 0;

    let needle1 = "\"priceUsd\":\"";
    let needle2 = "\"priceUsd\": \"";
    let nArr1 = needle1.toArray();
    let nArr2 = needle2.toArray();

    var pos = 0;
    while (pos < n and hitCount < maxHits) {
      // Try needle1 first, then needle2
      var matchOpt : ?{ at : Nat; needleLen : Nat } = null;
      switch (indexOfChars(arr, pos, nArr1)) {
        case (?found) { matchOpt := ?{ at = found; needleLen = nArr1.size() } };
        case null {
          switch (indexOfChars(arr, pos, nArr2)) {
            case (?found) { matchOpt := ?{ at = found; needleLen = nArr2.size() } };
            case null {};
          };
        };
      };
      switch (matchOpt) {
        case null { pos := n }; // no more hits
        case (?{ at; needleLen }) {
          let valStart = at + needleLen;
          var end = valStart;
          while (end < n and arr[end] != '\"') { end += 1 };
          if (end < n) {
            let priceText = textFromSlice(arr, valStart, end);
            switch (parseFloat(priceText)) {
              case (?p) {
                if (p > 0.0) {
                  hitPositions[hitCount] := at;
                  hitPrices[hitCount]    := p;
                  hitCount += 1;
                };
              };
              case null {};
            };
          };
          pos := at + needleLen + 1; // advance past this hit
        };
      };
    };

    if (hitCount == 0) { return 0.0 };
    if (hitCount == 1) { return hitPrices[0] };

    // ── Pass 2: find liquidity.usd nearest to each hit ──────────────────────
    // We look for "\"usd\":" near each priceUsd position (within ±2000 chars)
    // to get the liquidity value for that pair.
    let liqNeedle1 = "\"usd\":";
    let liqNeedle2 = "\"usd\": ";
    let lArr1 = liqNeedle1.toArray();
    let lArr2 = liqNeedle2.toArray();

    var bestPrice    : Float = hitPrices[0];
    var bestLiquidity : Float = 0.0;

    // Seed bestLiquidity from the first hit
    bestLiquidity := findNearestUsd(arr, n, hitPositions[0], lArr1, lArr2);

    var h = 1;
    while (h < hitCount) {
      let liq = findNearestUsd(arr, n, hitPositions[h], lArr1, lArr2);
      if (liq > bestLiquidity) {
        bestLiquidity := liq;
        bestPrice     := hitPrices[h];
      };
      h += 1;
    };

    bestPrice;
  };

  /// Scan near `pos` (±2000 chars) in `arr` for the nearest "\"usd\":" value.
  /// Returns 0.0 if not found. Used to read the liquidity.usd of a pair.
  func findNearestUsd(arr : [Char], n : Nat, pos : Nat, lArr1 : [Char], lArr2 : [Char]) : Float {
    let window : Nat = 2000;
    let scanStart : Nat = if (pos > window) Int.abs(pos.toInt() - window.toInt()) else 0;
    let scanEnd   : Nat = if (pos + window < n) pos + window else n;
    // Narrow arr slice is simulated by passing scanStart as the start offset
    // and only searching up to scanEnd
    let tryNeedle = func(needle : [Char]) : ?Float {
      let nLen = needle.size();
      let hLen = arr.size();
      if (nLen == 0 or hLen < nLen) { return null };
      var i = scanStart;
      var found : ?Float = null;
      label outer while (i + nLen <= scanEnd) {
        var j = 0;
        var ok = true;
        label inner while (j < nLen) {
          if (arr[i + j] != needle[j]) {
            ok := false;
            j := nLen;
          } else { j += 1 };
        };
        if (ok) {
          let valStart = i + nLen;
          // skip optional whitespace after colon
          var k = valStart;
          while (k < scanEnd and (arr[k] == ' ' or arr[k] == '\t')) { k += 1 };
          var end = k;
          // number ends at comma, }, ], or whitespace
          while (end < scanEnd and arr[end] != ',' and arr[end] != '}' and arr[end] != ']' and arr[end] != ' ' and arr[end] != '\n' and arr[end] != '\t') {
            end += 1;
          };
          let numText = textFromSlice(arr, k, end);
          switch (parseFloat(numText)) {
            case (?f) { found := ?f; i := scanEnd }; // stop at first hit
            case null {};
          };
        };
        if (found == null) { i += 1 };
      };
      found;
    };
    switch (tryNeedle(lArr1)) {
      case (?f) { f };
      case null {
        switch (tryNeedle(lArr2)) {
          case (?f) { f };
          case null { 0.0 };
        };
      };
    };
  };

  /// Simple substring containment check.
  func containsText(haystack : Text, needle : Text) : Bool {
    switch (indexOfChars(haystack.toArray(), 0, needle.toArray())) {
      case null { false };
      case _ { true };
    };
  };

  // ── Internal helpers ─────────────────────────────────────────────────────

  func textFromSlice(arr : [Char], from : Nat, to : Nat) : Text {
    var buf = "";
    var i = from;
    while (i < to and i < arr.size()) {
      buf #= Text.fromChar(arr[i]);
      i += 1;
    };
    buf;
  };

  func indexOfChars(haystack : [Char], start : Nat, needle : [Char]) : ?Nat {
    let nLen = needle.size();
    let hLen = haystack.size();
    if (nLen == 0) { return ?start };
    if (hLen < nLen) { return null };
    var i = start;
    label outer while (i + nLen <= hLen) {
      var j = 0;
      var ok = true;
      label inner while (j < nLen) {
        if (haystack[i + j] != needle[j]) {
          ok := false;
          j := nLen;
        } else { j += 1 };
      };
      if (ok) { return ?i };
      i += 1;
    };
    null;
  };

  /// Parse a decimal float string (e.g. "0.0034") to Float.
  /// Supports optional leading minus, digits, and a single decimal point.
  func parseFloat(s : Text) : ?Float {
    if (s.size() == 0) { return null };
    let arr = s.toArray();
    var i = 0;
    var negative = false;
    if (arr.size() > 0 and arr[0] == '-') { negative := true; i := 1 };
    var intPart : Float = 0.0;
    var fracPart : Float = 0.0;
    var fracDiv : Float = 1.0;
    var seenDot = false;
    var seenDigit = false;
    while (i < arr.size()) {
      let c = arr[i];
      if (c == '.') {
        if (seenDot) { return null };
        seenDot := true;
      } else {
        let dOpt : ?Nat = switch (c) {
          case '0' { ?0 }; case '1' { ?1 }; case '2' { ?2 }; case '3' { ?3 };
          case '4' { ?4 }; case '5' { ?5 }; case '6' { ?6 }; case '7' { ?7 };
          case '8' { ?8 }; case '9' { ?9 }; case _ { null };
        };
        switch (dOpt) {
          case null { return null };
          case (?d) {
            seenDigit := true;
            let df = d.toInt().toFloat();
            if (seenDot) {
              fracDiv *= 10.0;
              fracPart := fracPart + df / fracDiv;
            } else {
              intPart := intPart * 10.0 + df;
            };
          };
        };
      };
      i += 1;
    };
    if (not seenDigit) { return null };
    let result = intPart + fracPart;
    ?(if (negative) { -result } else { result });
  };
};
