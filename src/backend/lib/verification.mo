import Text "mo:core/Text";
import Char "mo:core/Char";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import OutCall "mo:caffeineai-http-outcalls/outcall";

module {
  public type VerificationResult = {
    #ok : { amountBurned : Nat };
    #err : Text;
  };

  /// Return the RPC endpoint URL for a given chain identifier.
  /// Return the RPC endpoint URL for a given chain identifier.
  /// Ethereum gets a primary + two fallback URLs separated by '|'.
  public func rpcUrlForChain(chain : Text) : ?Text {
    switch (chain) {
      case ("ethereum") { ?"https://ethereum.publicnode.com|https://rpc.ankr.com/eth|https://eth.drpc.org|https://cloudflare-eth.com" };
      case ("arbitrum") { ?"https://arb1.arbitrum.io/rpc" };
      case ("polygon")  { ?"https://polygon-rpc.com" };
      case ("optimism") { ?"https://mainnet.optimism.io" };
      case ("base")     { ?"https://mainnet.base.org|https://1rpc.io/base|https://base.publicnode.com" };
      case ("celo")     { ?"https://forno.celo.org|https://rpc.ankr.com/celo|https://celo.drpc.org|https://celo.meowrpc.com" };
      case (_)          { null };
    };
  };

  /// Build the JSON-RPC POST body for eth_getTransactionReceipt.
  public func buildRpcRequestBody(txHash : Text) : Text {
    // Normalise: lowercase, ensure 0x prefix
    let lower = txHash.toLower();
    let normalised = if (lower.size() >= 2) {
      let arr = lower.toArray();
      if (arr[0] == '0' and arr[1] == 'x') lower
      else "0x" # lower
    } else { "0x" # lower };
    "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getTransactionReceipt\",\"params\":[\"" # normalised # "\"],\"id\":1}";
  };

  /// Build the JSON-RPC POST body for eth_getTransactionByHash (AKK-4).
  /// Unlike the receipt, this returns the TRANSACTION object itself, including
  /// the `from` (sender), `to` and `input` (calldata) fields — everything the
  /// fee-binding check needs.
  public func buildTxByHashRequestBody(txHash : Text) : Text {
    let lower = txHash.toLower();
    let normalised = if (lower.size() >= 2) {
      let arr = lower.toArray();
      if (arr[0] == '0' and arr[1] == 'x') lower
      else "0x" # lower
    } else { "0x" # lower };
    "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getTransactionByHash\",\"params\":[\"" # normalised # "\"],\"id\":1}";
  };

  // ── Char-array helpers ────────────────────────────────────────────────────

  /// Build Text from a sub-range [from, to) of a char array.
  func sliceChars(arr : [Char], from : Nat, to : Nat) : Text {
    if (to <= from) { return "" };
    let safe_to = if (to > arr.size()) arr.size() else to;
    var buf : Text = "";
    var i = from;
    while (i < safe_to) {
      buf #= Text.fromChar(arr[i]);
      i += 1;
    };
    buf;
  };

  /// Find the first occurrence of `needle` in `haystack` (char array) starting at `start`.
  func indexOfText(haystack : [Char], start : Nat, needle : Text) : ?Nat {
    let needleChars = needle.toArray();
    let nLen = needleChars.size();
    let hLen = haystack.size();
    if (nLen == 0) { return ?start };
    if (hLen < nLen) { return null };
    var i = start;
    label outer while (i + nLen <= hLen) {
      var j = 0;
      var match_ = true;
      label inner while (j < nLen) {
        if (haystack[i + j] != needleChars[j]) {
          match_ := false;
          j := nLen; // break inner
        } else {
          j += 1;
        };
      };
      if (match_) { return ?i };
      i += 1;
    };
    null;
  };

  /// Extract the JSON string value for a key, handling both `"key":"value"` and `"key": "value"` forms.
  func extractStringField(arr : [Char], from : Nat, key : Text) : ?Text {
    let needle = "\"" # key # "\"";
    switch (indexOfText(arr, from, needle)) {
      case null { null };
      case (?kStart) {
        // skip past the key
        var i = kStart + needle.size();
        // skip optional whitespace
        while (i < arr.size() and (arr[i] == ' ' or arr[i] == '\t')) { i += 1 };
        // expect colon
        if (i >= arr.size() or arr[i] != ':') { null }
        else {
          i += 1;
          // skip optional whitespace after colon
          while (i < arr.size() and (arr[i] == ' ' or arr[i] == '\t')) { i += 1 };
          // expect opening quote for string value
          if (i >= arr.size() or arr[i] != '\"') { null }
          else {
            let valStart = i + 1;
            var j = valStart;
            while (j < arr.size() and arr[j] != '\"') { j += 1 };
            if (j >= arr.size()) { null }
            else { ?sliceChars(arr, valStart, j) };
          };
        };
      };
    };
  };

  /// Extract the transaction status from the JSON response.
  /// Handles string values ("0x1", "0x0") and integer values (1, 0).
  /// Returns ?"0x1" for success, ?"0x0" for failure, null if not found.
  /// Extract the transaction status from the JSON response.
  /// Handles all RPC response variants:
  ///   - Quoted hex strings: "0x1", "0x0", "0X1" etc.
  ///   - Unquoted hex strings: 0x1, 0x0
  ///   - Bare integers: 1, 0
  ///   - Boolean literals: true, false
  ///   - null value: treated as "pending" → returns null so the caller can retry
  /// Returns ?("0x1") for success, ?("0x0") for explicit failure, null if absent/pending.
  func extractStatusField(arr : [Char]) : ?Text {
    let needle = "\"status\"";
    switch (indexOfText(arr, 0, needle)) {
      case null { null };
      case (?kStart) {
        var i = kStart + needle.size();
        // skip optional whitespace
        while (i < arr.size() and (arr[i] == ' ' or arr[i] == '\t')) { i += 1 };
        // expect colon
        if (i >= arr.size() or arr[i] != ':') { return null };
        i += 1;
        // skip optional whitespace after colon
        while (i < arr.size() and (arr[i] == ' ' or arr[i] == '\t')) { i += 1 };
        if (i >= arr.size()) { return null };

        if (arr[i] == '\"') {
          // Quoted string value: "0x1", "0x0", "0X1", "1" etc.
          let valStart = i + 1;
          var j = valStart;
          while (j < arr.size() and arr[j] != '\"') { j += 1 };
          if (j >= arr.size()) { return null };
          let raw = sliceChars(arr, valStart, j);
          // Normalise to "0x1" / "0x0"
          let lc = raw.toLower();
          if (lc == "0x1" or lc == "1") { ?"0x1" }
          else if (lc == "0x0" or lc == "0") { ?"0x0" }
          else {
            // Non-zero hex like "0xb", "0xff" etc. all count as success
            if (lc.size() >= 3) { ?"0x1" } else { ?"0x0" }
          };
        } else if (arr[i] == 'n') {
          // null → transaction pending, let caller retry
          null
        } else if (arr[i] == 't') {
          // boolean true → success
          ?"0x1"
        } else if (arr[i] == 'f') {
          // boolean false → failure
          ?"0x0"
        } else {
          // Unquoted value: scan until a delimiter (comma, space, }, ])
          let valStart = i;
          var j = i;
          while (j < arr.size() and arr[j] != ',' and arr[j] != '}' and arr[j] != ']' and arr[j] != ' ' and arr[j] != '\t' and arr[j] != '\n' and arr[j] != '\r') {
            j += 1;
          };
          let raw = sliceChars(arr, valStart, j).toLower();
          // "0x1", "1", non-zero hex → success; "0x0", "0" → failure
          if (raw == "0x1" or raw == "1") { ?"0x1" }
          else if (raw == "0x0" or raw == "0") { ?"0x0" }
          else if (raw.size() >= 3) { ?"0x1" }  // any longer non-zero hex
          else { null }  // unrecognised → treat as absent
        };
      };
    };
  };

  /// Check whether the JSON contains `"key":null`.
  func fieldIsNull(arr : [Char], key : Text) : Bool {
    // Match both `"result":null` and `"result": null`
    let needle1 = "\"" # key # "\":null";
    let needle2 = "\"" # key # "\": null";
    switch (indexOfText(arr, 0, needle1)) {
      case null {
        switch (indexOfText(arr, 0, needle2)) {
          case null { false };
          case _ { true };
        };
      };
      case _ { true };
    };
  };

  func normAddr(addr : Text) : Text { addr.toLower() };

  let NULL_ADDRESS : Text = "0x0000000000000000000000000000000000000000";
  let DEAD_ADDRESS : Text = "0x000000000000000000000000000000000000dead";

  let TRANSFER_TOPIC0 : Text = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  // KlimaDAO Retirement Aggregator `AggregatorRetired` event signature:
  //   AggregatorRetired(uint8,address,string,address,string,string,address,uint256,uint256,uint8,uint256)
  // Emitted by retireCreditViaKlima when a carbon retirement succeeds on Base.
  // Verified live on-chain: topic1/topic2 = retiringAddress/beneficiaryAddress,
  // data carries retiringEntityString/beneficiaryString/retirementMessage,
  // and the last uint256 word (cost) holds the retired credit-token amount.
  let CARBON_RETIRED_TOPIC0 : Text = "0x6fc64daccb3e984a15ddc33e89be48bb68d451d2b125e3c84fe8aa218018ab9c";

  // Klima Protocol Aggregation Approval Manager — the contract that pulls the
  // user's kVCM during retireCreditViaKlima. The burn amount is the sum of
  // kVCM Transfer logs whose destination is this address.
  let AAM_ADDRESS : Text = "0x1c24239309398220883207681602bff4d10fbde1";

  /// Parse a hex string (with optional "0x" prefix) to Nat.
  func hexToNat(hex : Text) : Nat {
    var result : Nat = 0;
    var skipping = true;
    var skipCount = 0;
    for (c in hex.toIter()) {
      // Skip leading "0x" or "0X"
      if (skipping and skipCount < 2 and (c == '0' or c == 'x' or c == 'X')) {
        if (c == 'x' or c == 'X') { skipping := false };
        skipCount += 1;
      } else {
        skipping := false;
        let digit : Nat = switch (c) {
          case '0' { 0 }; case '1' { 1 }; case '2' { 2 }; case '3' { 3 };
          case '4' { 4 }; case '5' { 5 }; case '6' { 6 }; case '7' { 7 };
          case '8' { 8 }; case '9' { 9 };
          case 'a' { 10 }; case 'b' { 11 }; case 'c' { 12 }; case 'd' { 13 };
          case 'e' { 14 }; case 'f' { 15 };
          case 'A' { 10 }; case 'B' { 11 }; case 'C' { 12 }; case 'D' { 13 };
          case 'E' { 14 }; case 'F' { 15 };
          case _ { 0 };
        };
        result := result * 16 + digit;
      };
    };
    result;
  };

  /// Decode the last 20 bytes (40 hex chars) of a padded ABI address topic.
  func topicToAddress(topic : Text) : Text {
    let arr = topic.toArray();
    let len = arr.size();
    // The raw hex (without 0x) is 64 chars; last 40 are the address
    let hexStart : Nat = if (len >= 2 and arr[0] == '0' and (arr[1] == 'x' or arr[1] == 'X')) 2 else 0;
    let hexLen : Nat = if (len >= hexStart) len - hexStart else 0;
    if (hexLen >= 40) {
      "0x" # sliceChars(arr, len - 40, len)
    } else {
      "0x" # sliceChars(arr, hexStart, len)
    };
  };

  // ── AKK-4 / AKK-8 fee-binding payload ────────────────────────────────────
  //
  // The frontend attaches calldata to the platform-fee transaction:
  //   data = 0x || byte(len) || principal-text bytes || 32-byte burn tx hash
  // (principal-text = canonical lowercase `Principal.toText()` form, ASCII).
  // The backend decodes this from eth_getTransactionByHash `input` and enforces
  // the fee → burn → claimant binding. Textual comparison avoids trapping
  // Principal.fromText — canonical toText forms compare byte-exactly.

  /// Parse the fee-binding payload from a transaction `input` hex string.
  /// Returns null when the calldata is absent/empty (unbound fee tx).
  public func parseFeeBinding(inputHex : Text) : ?{ principalText : Text; burnHash : Text } {
    // Strip optional 0x prefix, lowercase
    let lower = inputHex.toLower();
    let hex = if (lower.size() >= 2 and lower.toArray()[0] == '0' and lower.toArray()[1] == 'x') {
      sliceChars(lower.toArray(), 2, lower.size())
    } else { lower };
    if (hex.size() < 2) { return null }; // empty calldata
    let bytes = hexToBytes(hex);
    if (bytes.size() < 1 + 5 + 32) { return null }; // too short to hold any payload
    let len : Nat = bytes[0].toNat();
    if (len < 5 or len > 63) { return null }; // implausible principal length
    if (bytes.size() != 1 + len + 32) { return null }; // exact layout required
    // Principal text = ASCII bytes 1..len
    var principalText = "";
    var i = 1;
    while (i <= len) {
      principalText #= Text.fromChar(Char.fromNat32(bytes[i].toNat32()));
      i += 1;
    };
    // Burn hash = last 32 bytes as lowercase hex
    var burnHash = "";
    i := 1 + len;
    while (i < bytes.size()) {
      burnHash #= byteToHex(bytes[i]);
      i += 1;
    };
    ?{ principalText; burnHash }
  };

  /// Decode a lowercase hex string (no 0x prefix) into bytes. Invalid input
  /// returns an empty array (payload layout checks then reject it).
  func hexToBytes(hex : Text) : [Nat8] {
    let arr = hex.toArray();
    if (arr.size() % 2 != 0) { return [] };
    let out = Array.tabulate(arr.size() / 2, func(idx : Nat) : Nat8 {
      let hi = hexDigitVal(arr[idx * 2]);
      let lo = hexDigitVal(arr[idx * 2 + 1]);
      if (hi == 0xFF or lo == 0xFF) { 0xFF } else { hi * 16 + lo };
    });
    // Reject if any nibble was invalid (0xFF marker)
    var ok = true;
    for (b in out.values()) {
      if (b == 0xFF) { ok := false };
    };
    if (ok) out else [];
  };

  func hexDigitVal(c : Char) : Nat8 {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
      case 'a' 10; case 'b' 11; case 'c' 12; case 'd' 13; case 'e' 14; case 'f' 15;
      case _ 0xFF;
    };
  };

  func byteToHex(b : Nat8) : Text {
    let hexChars = "0123456789abcdef";
    let hi = Nat8.toNat(b / 16);
    let lo = Nat8.toNat(b % 16);
    Text.fromChar(hexChars.toArray()[hi]) # Text.fromChar(hexChars.toArray()[lo]);
  };

  /// Extract the next quoted string from `arr` starting at `from`.
  /// Returns (value, nextSearchPos) or null.
  func nextQuoted(arr : [Char], from : Nat) : ?(Text, Nat) {
    var i = from;
    while (i < arr.size() and arr[i] != '\"') { i += 1 };
    if (i >= arr.size()) { return null };
    let valStart = i + 1;
    var j = valStart;
    while (j < arr.size() and arr[j] != '\"') { j += 1 };
    if (j >= arr.size()) { return null };
    ?(sliceChars(arr, valStart, j), j + 1);
  };

  type LogParseResult = { #ok : { toAddr : Text; dataHex : Text }; #err : Text };

  /// Search the JSON logs array for a Transfer log from `tokenAddress` that burns tokens.
  /// Handles both `"key":"value"` and `"key": "value"` spacing variants.
  func findBurnTransferLog(arr : [Char], tokenAddress : Text) : LogParseResult {
    let jsonLen = arr.size();
    let normToken = normAddr(tokenAddress);

    // Find start of logs array: "logs":[ or "logs": [
    let logsNeedle1 = "\"logs\":["; 
    let logsNeedle2 = "\"logs\": [";
    let logsStart : ?Nat = switch (indexOfText(arr, 0, logsNeedle1)) {
      case (?pos) { ?(pos + logsNeedle1.size()) };
      case null {
        switch (indexOfText(arr, 0, logsNeedle2)) {
          case (?pos) { ?(pos + logsNeedle2.size()) };
          case null { null };
        };
      };
    };

    let logsBodyStart = switch (logsStart) {
      case null {
        // No "logs" array found — fall back to scanning whole response
        0;
      };
      case (?s) { s };
    };

    // Scan for TRANSFER_TOPIC0 occurrences within the logs section
    var searchFrom : Nat = logsBodyStart;

    label search loop {
      switch (indexOfText(arr, searchFrom, TRANSFER_TOPIC0)) {
        case null { break search };
        case (?topicPos) {
          // Walk backward from topicPos to find the opening '{' of this log object
          var logObjStart : Nat = topicPos;
          var depth : Int = 0;
          var i : Int = topicPos.toInt() - 1;
          var found = false;
          label walkBack while (i >= 0) {
            let c = arr[i.toNat()];
            if (c == '}') { depth += 1 }
            else if (c == '{') {
              if (depth == 0) {
                logObjStart := i.toNat();
                found := true;
                i := -1; // break
              } else {
                depth -= 1;
              };
            };
            i -= 1;
          };

          if (not found) {
            searchFrom := topicPos + TRANSFER_TOPIC0.size();
          } else {
            // Walk forward from topicPos to find the matching closing '}' of this log object
            var logObjEnd : Nat = jsonLen;
            var depth2 : Nat = 1;
            var j = logObjStart + 1;
            label walkFwd while (j < jsonLen) {
              if (arr[j] == '{') { depth2 += 1 }
              else if (arr[j] == '}') {
                if (depth2 == 1) { logObjEnd := j + 1; j := jsonLen } // break
                else { depth2 -= 1 };
              };
              j += 1;
            };

            let logArr = arr.sliceToArray(logObjStart.toInt(), logObjEnd.toInt());

            // Verify token address (case-insensitive)
            switch (extractStringField(logArr, 0, "address")) {
              case null {
                searchFrom := topicPos + TRANSFER_TOPIC0.size();
              };
              case (?addr) {
                if (normAddr(addr) != normToken) {
                  searchFrom := topicPos + TRANSFER_TOPIC0.size();
                } else {
                  // Found the right token — parse topics array
                  let topicsNeedle1 = "\"topics\":["; 
                  let topicsNeedle2 = "\"topics\": [";
                  let tBodyStart : ?Nat = switch (indexOfText(logArr, 0, topicsNeedle1)) {
                    case (?p) { ?(p + topicsNeedle1.size()) };
                    case null {
                      switch (indexOfText(logArr, 0, topicsNeedle2)) {
                        case (?p) { ?(p + topicsNeedle2.size()) };
                        case null { null };
                      };
                    };
                  };

                  switch (tBodyStart) {
                    case null {
                      return #err("Transfer log missing topics array");
                    };
                    case (?tStart) {
                      // Extract topic[0] (Transfer sig), topic[1] (from), topic[2] (to)
                      switch (nextQuoted(logArr, tStart)) {
                        case null {
                          return #err("Topics array is empty or malformed");
                        };
                        case (?(t0, after0)) {
                          if (normAddr(t0) != normAddr(TRANSFER_TOPIC0)) {
                            searchFrom := topicPos + TRANSFER_TOPIC0.size();
                          } else {
                            switch (nextQuoted(logArr, after0)) {
                              case null {
                                return #err("Transfer topics missing topic[1] (from address)");
                              };
                              case (?(_, after1)) {
                                switch (nextQuoted(logArr, after1)) {
                                  case null {
                                    return #err("Transfer topics missing topic[2] (to address)");
                                  };
                                  case (?(t2, _)) {
                                    let toAddr = topicToAddress(t2);
                                    // Extract data field from the log object
                                    // data field contains the uint256 amount for ERC-20 Transfer
                                    switch (extractStringField(logArr, 0, "data")) {
                                      case null {
                                        return #err("Transfer log data field not found in JSON");
                                      };
                                      case (?dataHex) {
                                        // Validate data is non-empty
                                        let hexSize = dataHex.size();
                                        let stripped = if (hexSize >= 2 and
                                            dataHex.toArray()[0] == '0' and
                                            (dataHex.toArray()[1] == 'x' or dataHex.toArray()[1] == 'X'))
                                          { hexSize - 2 : Nat } else { hexSize };
                                        if (stripped == 0) {
                                          return #err("Transfer log data field is empty (no amount encoded)");
                                        };
                                        return #ok({ toAddr; dataHex });
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
    #err("No ERC-20 Transfer log found for token " # tokenAddress);
  };

  /// Parse the JSON RPC response and verify the burn.
  /// Returns #err("PENDING") when the transaction is not yet mined/indexed (retriable).
  /// Returns #err("TX_FAILED") when the receipt exists but status=0 (explicit on-chain failure).
  /// All other #err values are definitive verification failures.
  public func parseRpcResponse(jsonResponse : Text, expectedToken : Text, _chain : Text) : VerificationResult {
    let arr = jsonResponse.toArray();

    if (jsonResponse.contains(#text "\"error\"")) {
      // RPC-level errors (rate-limit, node unavailable, etc.) are transient.
      // Return PENDING so the background timer retries rather than failing the claim.
      return #err("PENDING");
    };

    if (fieldIsNull(arr, "result")) {
      // result:null means the node has no receipt yet — tx not mined
      return #err("PENDING");
    };

    switch (extractStatusField(arr)) {
      case null {
        // Status field absent — transaction receipt may not be finalised yet
        return #err("PENDING");
      };
      case (?status) {
        if (status == "0x0") {
          // Receipt exists with status=0: tx was explicitly reverted/failed on-chain
          return #err("TX_FAILED");
        } else if (status != "0x1") {
          return #err("Transaction did not succeed (status=" # status # ")");
        };
      };
    };

    switch (findBurnTransferLog(arr, expectedToken)) {
      case (#err(msg)) { #err(msg) };
      case (#ok({ toAddr; dataHex })) {
        let normTo = normAddr(toAddr);
        if (normTo != NULL_ADDRESS and normTo != DEAD_ADDRESS) {
          return #err("Transfer destination is not a valid burn address (got " # toAddr # ")");
        };
        let amount = hexToNat(dataHex);
        if (amount == 0) {
          return #err("Burn amount is zero");
        };
        #ok({ amountBurned = amount });
      };
    };
  };

  // ── AKK-4 / AKK-8 fee-binding verification ───────────────────────────────
  //
  // The platform-fee tx doubles as the claim binding: its calldata carries
  // (claimant principal text, burn tx hash), its sender must equal the burn
  // tx sender, and its recipient must equal the configured fee wallet. All
  // three facts come from eth_getTransactionByHash over public RPC — no
  // trust in the claimant beyond their own wallet signatures.

  public type TxByHash = {
    from : Text; // lowercase sender address
    to : Text; // lowercase recipient address
    input : Text; // raw calldata hex ("" when absent)
  };
  public type TxByHashResult = { #ok : TxByHash; #err : Text };

  /// Fetch a transaction object by hash across the chain's RPC fallbacks.
  /// Returns #err("PENDING") when the tx is unknown (not yet indexed by any
  /// fallback) or every endpoint errored; #err(definitive) only for structural
  /// problems in an otherwise-successful response.
  public func fetchTxByHash(
    txHash : Text,
    chain : Text,
    transformFn : shared query OutCall.TransformationInput -> async OutCall.TransformationOutput,
  ) : async TxByHashResult {
    let rpcUrlOpt = rpcUrlForChain(chain);
    let rpcUrlsRaw = switch (rpcUrlOpt) { case null { return #err("Unsupported chain: " # chain) }; case (?u) { u } };
    let rpcUrlList = rpcUrlsRaw.split(#char '|').toArray();
    let body = buildTxByHashRequestBody(txHash);

    var response : Text = "";
    var gotValidResponse = false;
    var i = 0;
    while (i < rpcUrlList.size() and not gotValidResponse) {
      try {
        let candidate = await OutCall.httpPostRequest(
          rpcUrlList[i],
          [{ name = "Content-Type"; value = "application/json" }],
          body,
          transformFn,
        );
        if (not candidate.contains(#text "\"error\"")) {
          // A result:null here means THIS node hasn't indexed the tx yet —
          // try the next fallback before concluding PENDING.
          if (not fieldIsNull(candidate.toArray(), "result")) {
            // JSON-RPC shape guard: an HTTP-200 NON-JSON error page (e.g. a
            // dead endpoint's "error code: 521" or a Cloudflare 504 HTML
            // page) contains neither "error": nor "result":null — without
            // this check it used to be accepted as a valid response and the
            // missing `from` field then produced a DEFINITIVE
            // "BINDING_FAIL: tx missing `from`" that killed healthy claims
            // (observed 2026-08-28: llamarpc outage murdered claim
            // 0xe615f0cb… while every on-chain fact was correct). A response
            // without any JSON-RPC marker is a dead endpoint, not data.
            if (candidate.contains(#text "\"jsonrpc\"") or candidate.contains(#text "\"result\"")) {
              response := candidate;
              gotValidResponse := true;
            };
          };
        };
      } catch (_) {};
      i += 1;
    };
    if (not gotValidResponse) { return #err("PENDING") };

    let arr = response.toArray();
    if (fieldIsNull(arr, "result")) {
      // Unknown hash at this node — treat like not-yet-indexed so callers retry
      return #err("PENDING");
    };

    let fromAddr = switch (extractStringField(arr, 0, "from")) {
      case null { return #err("tx missing `from` field") };
      case (?f) { normAddr(f) };
    };
    let toAddr = switch (extractStringField(arr, 0, "to")) {
      case null { return #err("tx missing `to` field") };
      case (?t) { normAddr(t) };
    };
    let inputData = switch (extractStringField(arr, 0, "input")) {
      case null {
        // Legacy/spec-variant nodes name the calldata field `data` (some Celo /
        // Optimism infra returns only `data`) — fall back before giving up.
        switch (extractStringField(arr, 0, "data")) {
          case null { "" };
          case (?d) { d };
        };
      };
      case (?d) { d };
    };
    // Anomalous-empty guard: a tx response that carried a result but yielded
    // NO calldata is untrustworthy — platform-fee txs ALWAYS carry the
    // 96-byte binding payload, so empty input here means the endpoint served
    // a truncated/partial object. Returning it as #ok produced the
    // definitive "BINDING_FAIL: fee tx carries no binding payload" on
    // healthy claims (observed on Celo 2026-08-29, claim 0xe7b3ff…: all
    // on-chain facts perfect, fee FeePaid from collector, binding decoded
    // byte-perfect from a direct probe — while the backend's fetch saw no
    // input). Signal PENDING instead so the caller retries the next
    // endpoint / cycle. (Plain value transfers legitimately have empty
    // input, but this fetcher is only used for fee/burn txs, which always
    // carry calldata or are plain dead-address transfers — the burn-side
    // parse treats empty as fatal too. Retrying is always safe.)
    if (inputData.size() < 2) {
      return #err("PENDING");
    };
    return #ok({ from = fromAddr; to = toAddr; input = inputData });
  };

  /// Verify the fee tx binds the burn to the claimant (AKK-4 + AKK-8).
  /// Checks, in order:
  ///   1. fee tx status == success (via the standard receipt parse)
  ///   2. fee tx `to` == configured fee recipient
  ///   3. fee tx sender == burn tx sender           (same wallet)
  ///   4. fee tx calldata == (claimant principal, burn tx hash)
  /// Any mismatch is a definitive failure; only genuine PENDING states retry.
  public func verifyFeeBinding(feeTx : TxByHash, burnTx : TxByHash, expectedTo : Text, expectedPrincipalText : Text, expectedBurnHash : Text) : { #ok; #err : Text } {
    // 2. recipient must be the configured fee wallet
    if (feeTx.to != normAddr(expectedTo)) {
      return #err("BINDING_FAIL: fee tx recipient is not the configured fee wallet");
    };
    // 3. same wallet must have sent the burn
    if (feeTx.from != burnTx.from) {
      return #err("BINDING_FAIL: fee tx sender differs from burn tx sender");
    };
    // 4. calldata must name this claimant and this exact burn
    switch (parseFeeBinding(feeTx.input)) {
      case null { return #err("BINDING_FAIL: fee tx carries no binding payload") };
      case (?binding) {
        if (binding.principalText != expectedPrincipalText) {
          return #err("BINDING_FAIL: fee tx principal does not match the claimant");
        };
        if (binding.burnHash != (if (expectedBurnHash.size() >= 2 and expectedBurnHash.toArray()[0] == '0' and expectedBurnHash.toArray()[1] == 'x') {
          sliceChars(expectedBurnHash.toArray(), 2, expectedBurnHash.size())
        } else { expectedBurnHash }).toLower()) {
          return #err("BINDING_FAIL: fee tx names a different burn transaction");
        };
      };
    };
    #ok;
  };

  // ── AKK-4 Option B: FeePaid event from the FeeCollector contract ──────────
  //
  // The FeeCollector contract emits, for every payment it accepts:
  //   event FeePaid(address indexed payer, bytes binding, uint256 value);
  // topic0 = keccak256("FeePaid(address,bytes,uint256)")
  // VERIFIED AGAINST LIVE CHAIN DATA 2026-08-28: the real receipt from the
  // deployed collector carries topic0 0x6306705606f6bb80eb21422af69622d33b086a
  // 84411f822776f54f64b5daa027 — this constant now equals it byte-for-byte.
  // (Original commit shipped keccak("FeePaid(address,address,bytes,uint256)")
  // — a phantom 4-param signature — which the parser could never match.)
  let FEEPAID_TOPIC0 : Text = "0x6306705606f6bb80eb21422af69622d33b086a84411f822776f54f64b5daa027";

  /// Check whether the fee-tx receipt JSON contains a `FeePaid` log emitted BY
  /// the collector contract (`collector` address field) with topic[1] (payer)
  /// equal to `expectedPayer`. Both addresses compare case-insensitively.
  /// Absent/ambiguous receipts simply return false — the caller decides
  /// whether that is definitive (check armed) or ignorable (check off).
  public func feePaidLogPresent(jsonResponse : Text, collector : Text, expectedPayer : Text) : Bool {
    let arr = jsonResponse.toArray();
    let normCollector = normAddr(collector);
    let normPayer = normAddr(expectedPayer);

    let logsNeedle1 = "\"logs\":[";
    let logsNeedle2 = "\"logs\": [";
    let logsBodyStart : Nat = switch (indexOfText(arr, 0, logsNeedle1)) {
      case (?pos) { pos + logsNeedle1.size() };
      case null {
        switch (indexOfText(arr, 0, logsNeedle2)) {
          case (?pos) { pos + logsNeedle2.size() };
          case null { 0 };
        };
      };
    };

    var searchFrom : Nat = logsBodyStart;
    label search loop {
      switch (indexOfText(arr, searchFrom, FEEPAID_TOPIC0)) {
        case null { break search };
        case (?topicPos) {
          // Walk backward from topicPos to find the opening '{' of this log object
          var logObjStart : Nat = topicPos;
          var depth : Int = 0;
          var i : Int = topicPos.toInt() - 1;
          var found = false;
          label walkBack while (i >= 0) {
            let c = arr[i.toNat()];
            if (c == '}') { depth += 1 }
            else if (c == '{') {
              if (depth == 0) {
                logObjStart := i.toNat();
                found := true;
                i := -1; // break
              } else {
                depth -= 1;
              };
            };
            i -= 1;
          };

          if (not found) {
            searchFrom := topicPos + FEEPAID_TOPIC0.size();
          } else {
            // Walk forward to the matching closing '}' of this log object
            var logObjEnd : Nat = arr.size();
            var depth2 : Nat = 1;
            var j = logObjStart + 1;
            label walkFwd while (j < arr.size()) {
              if (arr[j] == '{') { depth2 += 1 }
              else if (arr[j] == '}') {
                if (depth2 == 1) { logObjEnd := j + 1; j := arr.size() } // break
                else { depth2 -= 1 };
              };
              j += 1;
            };

            let logArr = arr.sliceToArray(logObjStart.toInt(), logObjEnd.toInt());

            // The emitting contract must be the collector itself
            let emitterOk = switch (extractStringField(logArr, 0, "address")) {
              case null { false };
              case (?a) { normAddr(a) == normCollector };
            };
            if (emitterOk) {
              // topics array: [0] = FeePaid sig, [1] = payer (indexed address)
              let tNeedle1 = "\"topics\":[";
              let tNeedle2 = "\"topics\": [";
              let tStart : ?Nat = switch (indexOfText(logArr, 0, tNeedle1)) {
                case (?p) { ?(p + tNeedle1.size()) };
                case null {
                  switch (indexOfText(logArr, 0, tNeedle2)) {
                    case (?p) { ?(p + tNeedle2.size()) };
                    case null { null };
                  };
                };
              };
              switch (tStart) {
                case null {
                  searchFrom := topicPos + FEEPAID_TOPIC0.size();
                };
                case (?ts) {
                  switch (nextQuoted(logArr, ts)) {
                    case null {
                      searchFrom := topicPos + FEEPAID_TOPIC0.size();
                    };
                    case (?(t0, after0)) {
                      if (normAddr(t0) != normAddr(FEEPAID_TOPIC0)) {
                        searchFrom := topicPos + FEEPAID_TOPIC0.size();
                      } else {
                        switch (nextQuoted(logArr, after0)) {
                          case null {
                            searchFrom := topicPos + FEEPAID_TOPIC0.size();
                          };
                          case (?(t1, _)) {
                            if (topicToAddress(t1) == normPayer) {
                              return true;
                            };
                            searchFrom := topicPos + FEEPAID_TOPIC0.size();
                          };
                        };
                      };
                    };
                  };
                };
              };
            } else {
              searchFrom := topicPos + FEEPAID_TOPIC0.size();
            };
          };
        };
      };
    };
    false;
  };

  type RetirementLogResult = { #ok : Nat; #err : Text };

  /// Find the KlimaDAO Retirement Aggregator `CarbonRetired` event log in the
  /// transaction receipt and extract the `retiredAmount` (the last uint256 word
  /// of the ABI-encoded event data). Returns #ok(amount) on success.
  func findRetirementLog(arr : [Char]) : RetirementLogResult {
    let jsonLen = arr.size();

    // Find start of logs array: "logs":[ or "logs": [
    let logsNeedle1 = "\"logs\":[";
    let logsNeedle2 = "\"logs\": [";
    let logsStart : ?Nat = switch (indexOfText(arr, 0, logsNeedle1)) {
      case (?pos) { ?(pos + logsNeedle1.size()) };
      case null {
        switch (indexOfText(arr, 0, logsNeedle2)) {
          case (?pos) { ?(pos + logsNeedle2.size()) };
          case null { null };
        };
      };
    };

    let logsBodyStart = switch (logsStart) {
      case null { 0 };
      case (?s) { s };
    };

    var searchFrom : Nat = logsBodyStart;

    label search loop {
      switch (indexOfText(arr, searchFrom, CARBON_RETIRED_TOPIC0)) {
        case null { break search };
        case (?topicPos) {
          // Walk backward from topicPos to find the opening '{' of this log object
          var logObjStart : Nat = topicPos;
          var depth : Int = 0;
          var i : Int = topicPos.toInt() - 1;
          var found = false;
          label walkBack while (i >= 0) {
            let c = arr[i.toNat()];
            if (c == '}') { depth += 1 }
            else if (c == '{') {
              if (depth == 0) {
                logObjStart := i.toNat();
                found := true;
                i := -1; // break
              } else {
                depth -= 1;
              };
            };
            i -= 1;
          };

          if (not found) {
            searchFrom := topicPos + CARBON_RETIRED_TOPIC0.size();
          } else {
            // Walk forward from logObjStart to find the matching closing '}' of this log object
            var logObjEnd : Nat = jsonLen;
            var depth2 : Nat = 1;
            var j = logObjStart + 1;
            label walkFwd while (j < jsonLen) {
              if (arr[j] == '{') { depth2 += 1 }
              else if (arr[j] == '}') {
                if (depth2 == 1) { logObjEnd := j + 1; j := jsonLen } // break
                else { depth2 -= 1 };
              };
              j += 1;
            };

            let logArr = arr.sliceToArray(logObjStart.toInt(), logObjEnd.toInt());

            // Extract the ABI-encoded data field. The CarbonRetired event data is:
            //   carbonBridge (uint8), retiringEntityString (string), beneficiaryString (string),
            //   retirementMessage (string), poolToken (address), retiredAmount (uint256)
            // retiredAmount is the last 32-byte word (64 hex chars) of the data.
            switch (extractStringField(logArr, 0, "data")) {
              case null {
                return #err("CarbonRetired log data field not found in JSON");
              };
              case (?dataHex) {
                let hexSize = dataHex.size();
                let stripped = if (hexSize >= 2 and
                    dataHex.toArray()[0] == '0' and
                    (dataHex.toArray()[1] == 'x' or dataHex.toArray()[1] == 'X'))
                  { hexSize - 2 : Nat } else { hexSize };
                if (stripped < 64) {
                  return #err("CarbonRetired data field too short (no retiredAmount encoded)");
                };
                let amountHex = sliceChars(dataHex.toArray(), hexSize - 64, hexSize);
                let amount = hexToNat(amountHex);
                if (amount == 0) {
                  return #err("Retired amount is zero");
                };
                return #ok(amount);
              };
            };
          };
        };
      };
    };
    #err("No AggregatorRetired retirement log found");
  };

  /// Sum all ERC-20 Transfer logs of `tokenAddress` whose destination is the
  /// Klima AAM (the contract that pulls the user's kVCM during retirement).
  /// Returns #ok(sum) when at least one such transfer exists.
  func sumAamTransfers(arr : [Char], tokenAddress : Text) : { #ok : Nat; #err : Text } {
    let jsonLen = arr.size();
    let normToken = normAddr(tokenAddress);
    let normAam = normAddr(AAM_ADDRESS);

    let logsNeedle1 = "\"logs\":[";
    let logsNeedle2 = "\"logs\": [";
    let logsStart : ?Nat = switch (indexOfText(arr, 0, logsNeedle1)) {
      case (?pos) { ?(pos + logsNeedle1.size()) };
      case null {
        switch (indexOfText(arr, 0, logsNeedle2)) {
          case (?pos) { ?(pos + logsNeedle2.size()) };
          case null { null };
        };
      };
    };
    let logsBodyStart = switch (logsStart) { case null { 0 }; case (?s) { s }; };

    var searchFrom : Nat = logsBodyStart;
    var total : Nat = 0;

    label search loop {
      switch (indexOfText(arr, searchFrom, TRANSFER_TOPIC0)) {
        case null { break search };
        case (?topicPos) {
          var logObjStart : Nat = topicPos;
          var depth : Int = 0;
          var i : Int = topicPos.toInt() - 1;
          var found = false;
          label walkBack while (i >= 0) {
            let ch = arr[i.toNat()];
            if (ch == '}') { depth += 1 }
            else if (ch == '{') {
              if (depth == 0) { logObjStart := i.toNat(); found := true; i := -1 }
              else { depth -= 1 };
            };
            i -= 1;
          };
          if (not found) {
            searchFrom := topicPos + TRANSFER_TOPIC0.size();
          } else {
            var logObjEnd : Nat = jsonLen;
            var depth2 : Nat = 1;
            var j = logObjStart + 1;
            label walkFwd while (j < jsonLen) {
              if (arr[j] == '{') { depth2 += 1 }
              else if (arr[j] == '}') {
                if (depth2 == 1) { logObjEnd := j + 1; j := jsonLen }
                else { depth2 -= 1 };
              };
              j += 1;
            };
            let logArr = arr.sliceToArray(logObjStart.toInt(), logObjEnd.toInt());

            let addrMatch = switch (extractStringField(logArr, 0, "address")) {
              case null { false };
              case (?addr) { normAddr(addr) == normToken };
            };
            if (addrMatch) {
              let tNeedle1 = "\"topics\":[";
              let tNeedle2 = "\"topics\": [";
              let tStart : ?Nat = switch (indexOfText(logArr, 0, tNeedle1)) {
                case (?p) { ?(p + tNeedle1.size()) };
                case null {
                  switch (indexOfText(logArr, 0, tNeedle2)) {
                    case (?p) { ?(p + tNeedle2.size()) };
                    case null { null };
                  };
                };
              };
              let toAddr : Text = switch (tStart) {
                case null { "" };
                case (?ts) {
                  switch (nextQuoted(logArr, ts)) {
                    case null { "" };
                    case (?(_, after0)) {
                      switch (nextQuoted(logArr, after0)) {
                        case null { "" };
                        case (?(_, after1)) {
                          switch (nextQuoted(logArr, after1)) {
                            case null { "" };
                            case (?(t2, _)) { topicToAddress(t2) };
                          };
                        };
                      };
                    };
                  };
                };
              };
              if (normAddr(toAddr) == normAam) {
                let amount = switch (extractStringField(logArr, 0, "data")) {
                  case null { 0 };
                  case (?d) { hexToNat(d) };
                };
                total += amount;
              };
            };
            searchFrom := topicPos + TRANSFER_TOPIC0.size();
          };
        };
      };
    };

    if (total > 0) { #ok(total) } else {
      #err("No " # tokenAddress # " transfer to AAM found in retirement receipt")
    };
  };

  /// Parse the JSON RPC response and verify a KlimaDAO Retirement Aggregator
  /// retirement receipt (retireCreditViaKlima) on the Base chain.
  /// A kVCM burn claim is confirmed only when the on-chain retirement succeeded:
  /// the receipt must have status 0x1 AND contain an AggregatorRetired event log.
  /// The burned amount credited is the kVCM actually pulled from the user
  /// (sum of expectedToken Transfer logs into the AAM).
  /// Returns #err("PENDING") when the transaction is not yet mined/indexed (retriable).
  /// Returns #err("TX_FAILED") when the receipt exists but status=0 (explicit on-chain failure).
  /// All other #err values are definitive verification failures.
  public func parseRetirementResponse(jsonResponse : Text, expectedToken : Text, _chain : Text) : VerificationResult {
    let arr = jsonResponse.toArray();

    if (jsonResponse.contains(#text "\"error\"")) {
      // RPC-level errors (rate-limit, node unavailable, etc.) are transient.
      return #err("PENDING");
    };

    if (fieldIsNull(arr, "result")) {
      // result:null means the node has no receipt yet — tx not mined
      return #err("PENDING");
    };

    switch (extractStatusField(arr)) {
      case null {
        // Status field absent — transaction receipt may not be finalised yet
        return #err("PENDING");
      };
      case (?status) {
        if (status == "0x0") {
          // Receipt exists with status=0: tx was explicitly reverted/failed on-chain
          return #err("TX_FAILED");
        } else if (status != "0x1") {
          return #err("Transaction did not succeed (status=" # status # ")");
        };
      };
    };

    switch (findRetirementLog(arr)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(_retiredAmount)) {
        // The retirement event proves the burn happened on-chain; credit the
        // user for the kVCM that was actually pulled from them.
        switch (sumAamTransfers(arr, expectedToken)) {
          case (#err(msg)) { #err(msg) };
          case (#ok(amount)) { #ok({ amountBurned = amount }) };
        };
      };
    };
  };
};
