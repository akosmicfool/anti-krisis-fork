import Text "mo:core/Text";
import Array "mo:core/Array";

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
      case ("base")     { ?"https://mainnet.base.org|https://base.llamarpc.com|https://1rpc.io/base|https://base.publicnode.com" };
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

  // KlimaDAO Retirement Aggregator `CarbonRetired` event signature:
  //   CarbonRetired(uint8,address,string,address,string,string,address,address,uint256)
  // Emitted by retireCreditViaKlima when a carbon credit retirement succeeds on-chain.
  let CARBON_RETIRED_TOPIC0 : Text = "0xfe5de47ce4dfc6726ac148d8360e76dc174cb29266cc2d4812babc2ec680d212";

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
    #err("No CarbonRetired retirement log found");
  };

  /// Parse the JSON RPC response and verify a KlimaDAO Retirement Aggregator
  /// retirement receipt (retireCreditViaKlima) on the Base chain.
  /// A kVCM burn claim is confirmed only when the on-chain retirement succeeded:
  /// the receipt must have status 0x1 AND contain a CarbonRetired event log with
  /// a non-zero retiredAmount.
  /// Returns #err("PENDING") when the transaction is not yet mined/indexed (retriable).
  /// Returns #err("TX_FAILED") when the receipt exists but status=0 (explicit on-chain failure).
  /// All other #err values are definitive verification failures.
  public func parseRetirementResponse(jsonResponse : Text, _expectedToken : Text, _chain : Text) : VerificationResult {
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
      case (#ok(amount)) {
        #ok({ amountBurned = amount });
      };
    };
  };
};
