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
      let price = parseDexScreenerPrice(primaryJson, normAddr);
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

    let fallbackPrice = parseDexScreenerPrice(searchJson, normAddr);
    if (fallbackPrice > 0.0) {
      priceCache.add(normAddr, fallbackPrice);
      #ok(fallbackPrice)
    } else {
      Debug.print("[price-oracle] Both endpoints returned no price for: " # normAddr);
      #err("Price unavailable — no price data returned by DexScreener. Please try again later.")
    };
  };

  /// Parse DexScreener API JSON and return the USD price of `wantedAddr`,
  /// taken from the pair with the HIGHEST LIQUIDITY among the pairs where the
  /// queried token is the BASE token.
  ///
  /// DexScreener's pair-level priceUsd is the BASE token's price. A pair that
  /// merely quotes AGAINST the wanted token prices some other token in terms
  /// of it and says nothing about the wanted token's USD value. The previous
  /// implementation scanned the whole document for any "priceUsd" and paired
  /// it with whichever "usd" number sat within ±2000 chars — a $1.91-liquidity
  /// dust pair quoting IN kVCM therefore priced kVCM at $0.9749 (real ~$0.014)
  /// and over-credited a claim ~11x on 2026-08-28. Pair segmentation (segments
  /// bounded by successive "baseToken" markers) plus base-token filtering
  /// removes both failure modes deterministically.
  func parseDexScreenerPrice(json : Text, wantedAddr : Text) : Float {
    if (containsText(json, "\"pairs\":[]") or containsText(json, "\"pairs\": []")) {
      return 0.0;
    };

    let arr = json.toArray();
    let n = arr.size();

    // Pass 1: positions of every "baseToken" marker — each begins a pair segment.
    let marker = "\"baseToken\"";
    let maxPairs = 64;
    let segStarts : [var Nat] = Array.tabulate(maxPairs, func _ = 0).toVarArray();
    var segCount = 0;
    var scanPos = 0;
    let mArr = marker.toArray();
    label scanLoop while (scanPos < n and segCount < maxPairs) {
      switch (indexOfChars(arr, scanPos, mArr)) {
        case null { scanPos := n };
        case (?at) {
          segStarts[segCount] := at;
          segCount += 1;
          scanPos := at + mArr.size();
        };
      };
    };
    if (segCount == 0) { return 0.0 };

    // Pass 2: per segment — base address, priceUsd, liquidity.usd.
    let addrKey = "\"address\":\"";
    let priceKey1 = "\"priceUsd\":\"";
    let priceKey2 = "\"priceUsd\": \"";
    let liqKey1 = "\"usd\":";
    let liqKey2 = "\"usd\": ";

    var bestPrice : Float = 0.0;
    var bestLiquidity : Float = 0.0;

    var i = 0;
    while (i < segCount) {
      let segStart = segStarts[i];
      let segEnd = if (i + 1 < segCount) segStarts[i + 1] else n;

      // Base token address (first "address":" inside the segment header)
      var segAddr = "";
      switch (indexOfChars(arr, segStart, addrKey.toArray())) {
        case (?p) {
          if (p < segEnd) {
            let valStart = p + addrKey.size();
            var e = valStart;
            while (e < segEnd and arr[e] != '\"') { e += 1 };
            if (e < segEnd) { segAddr := textFromSlice(arr, valStart, e) };
          };
        };
        case null {};
      };

      if (segAddr.size() > 0 and segAddr.toLower() == wantedAddr.toLower()) {
        // priceUsd within this pair's segment only
        var priceEnd : Nat = 0;
        var foundPrice = false;
        switch (indexOfChars(arr, segStart, priceKey1.toArray())) {
          case (?p) {
            if (p < segEnd) { priceEnd := p + priceKey1.size(); foundPrice := true };
          };
          case null {};
        };
        if (not foundPrice) {
          switch (indexOfChars(arr, segStart, priceKey2.toArray())) {
            case (?p) {
              if (p < segEnd) { priceEnd := p + priceKey2.size(); foundPrice := true };
            };
            case null {};
          };
        };
        var priceText = "";
        if (foundPrice) {
          var e2 = priceEnd;
          while (e2 < segEnd and arr[e2] != '\"') { e2 += 1 };
          if (e2 < segEnd) { priceText := textFromSlice(arr, priceEnd, e2) };
        };

        // liquidity.usd: FIRST "usd": inside the pair segment (volume/txns
        // carry no "usd" label in the DexScreener pair shape).
        var liqEnd : Nat = 0;
        var foundLiq = false;
        switch (indexOfChars(arr, segStart, liqKey1.toArray())) {
          case (?p) {
            if (p < segEnd) { liqEnd := p + liqKey1.size(); foundLiq := true };
          };
          case null {};
        };
        if (not foundLiq) {
          switch (indexOfChars(arr, segStart, liqKey2.toArray())) {
            case (?p) {
              if (p < segEnd) { liqEnd := p + liqKey2.size(); foundLiq := true };
            };
            case null {};
          };
        };
        var liqText = "";
        if (foundLiq) {
          var e3 = liqEnd;
          while (e3 < segEnd and arr[e3] != ',' and arr[e3] != '}' and arr[e3] != ' ' and arr[e3] != ']') { e3 += 1 };
          liqText := textFromSlice(arr, liqEnd, e3);
        };

        switch (parseFloat(priceText)) {
          case (?p) {
            if (p > 0.0) {
              let liq = switch (parseFloat(liqText)) {
                case (?l) { if (l < 0.0) { 0.0 } else { l } };
                case null { 0.0 };
              };
              if (liq > bestLiquidity) {
                bestLiquidity := liq;
                bestPrice := p;
              };
            };
          };
          case null {};
        };
      };
      i += 1;
    };
    bestPrice;
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
