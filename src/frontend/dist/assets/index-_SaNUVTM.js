import { ej as parseAbiParameter$1, ek as modifiers, el as parseStructs, em as isStructSignature, en as InvalidAbiParameterError, eo as toBytes, bu as getAddress, bM as pad, bC as keccak256, ep as slice, aG as concat, eq as toRlp, er as InvalidHexValueError, bV as hexToBytes, es as createCursor, et as bytesToHex, ay as BaseError, aJ as isHex, dN as size, eu as createHasher, ev as HashMD, ew as rotl, ex as clean, ey as toHex, c4 as sliceHex, ez as validate, eA as decodeAbiParameters, eB as unwrap, bx as numberToHex, eC as recoverAddress, db as hashMessage, dc as hashTypedData, eD as wrap, aC as isAddressEqual, c2 as hexToNumber, eE as InvalidSerializedTransactionTypeError, eF as InvalidSerializedTransactionError, b_ as hexToBigInt, eG as assertTransactionEIP1559, eH as assertTransactionEIP2930, eI as toBlobSidecars, eJ as assertTransactionEIP4844, eK as assertTransactionEIP7702, eL as assertTransactionLegacy, eM as InvalidLegacyVError, bK as isAddress, bL as InvalidAddressError, c3 as trim, eN as padHex, eO as parseUnits, eP as etherUnits, eQ as gweiUnits, eR as extract, eS as formatTransactionRequest, eT as encodeDeployData, bZ as sendTransaction, eU as checksumAddress, c0 as parseAccount, c6 as getAction, c5 as AccountNotFoundError, eV as assertRequest, eW as recoverAuthorizationAddress, c7 as getChainId, eX as assertCurrentChain, bT as LruMap, eY as waitForTransactionReceipt, eZ as TransactionReceiptRevertedError, e_ as prepareTransactionRequest, e$ as defaultParameters, f0 as sendRawTransactionSync, f1 as AccountTypeNotSupportedError, b$ as getTransactionError, f2 as getTypesForEIP712Domain, f3 as validateTypedData, f4 as serializeTypedData, f5 as writeContract, dP as readContract, f6 as simulateContract, f7 as createContractEventFilter, f8 as getContractEvents, f9 as watchContractEvent, fa as estimateContractGas, d_ as createClient, fb as signMessage, fc as sendRawTransaction, fd as fillTransaction, fe as UrlRequiredError, ff as createTransport, bB as RpcRequestError, fg as AbiConstructorNotFoundError, fh as AbiConstructorParamsNotFoundError, fi as commitmentToVersionedHash, fj as EnsInvalidChainIdError, cb as secp256k1, fk as serializeTransaction, fl as defineChain, d1 as createPublicClient, d2 as http, fm as AbiDecodingDataSizeInvalidError, fn as AbiDecodingDataSizeTooSmallError, fo as AbiDecodingZeroDataError, fp as AbiEncodingArrayLengthMismatchError, fq as AbiEncodingBytesSizeMismatchError, bI as AbiEncodingLengthMismatchError, fr as AbiErrorInputsNotFoundError, fs as AbiErrorNotFoundError, ft as AbiErrorSignatureNotFoundError, fu as AbiEventNotFoundError, fv as AbiEventSignatureEmptyTopicsError, fw as AbiEventSignatureNotFoundError, fx as AbiFunctionNotFoundError, fy as AbiFunctionOutputsNotFoundError, fz as AbiFunctionSignatureNotFoundError, fA as AccountStateConflictError, fB as AtomicReadyWalletRejectedUpgradeError, bY as AtomicityNotSupportedError, fC as BaseFeeScalarError, fD as BlockNotFoundError, fE as BundleTooLargeError, bQ as BytesSizeMismatchError, fF as CallExecutionError, fG as ChainDisconnectedError, fH as ChainDoesNotSupportContract, fI as ChainMismatchError, fJ as ChainNotFoundError, fK as CircularReferenceError, fL as ClientChainNotConfiguredError, dV as ContractFunctionExecutionError, dU as ContractFunctionRevertedError, dT as ContractFunctionZeroDataError, fM as CounterfactualDeploymentFailedError, fN as DecodeLogDataMismatch, fO as DecodeLogTopicsMismatch, fP as DuplicateIdError, fQ as Eip1559FeesNotSupportedError, fR as EnsAvatarInvalidNftUriError, fS as EnsAvatarUnsupportedNamespaceError, fT as EnsAvatarUriResolutionError, fU as EstimateGasExecutionError, fV as ExecutionRevertedError, fW as FeeCapTooHighError, fX as FeeCapTooLowError, fY as FeeConflictError, fZ as FilterTypeNotSupportedError, aI as HttpRequestError, f_ as InsufficientFundsError, f$ as IntegerOutOfRangeError, g0 as InternalRpcError, g1 as IntrinsicGasTooHighError, g2 as IntrinsicGasTooLowError, g3 as InvalidAbiDecodingTypeError, g4 as InvalidAbiEncodingTypeError, g5 as InvalidAbiItemError, g6 as InvalidAbiParametersError, g7 as InvalidAbiTypeParameterError, g8 as InvalidArrayError, g9 as InvalidBytesBooleanError, ga as InvalidChainIdError, gb as InvalidDecimalNumberError, gc as InvalidDefinitionTypeError, gd as InvalidDomainError, ge as InvalidFunctionModifierError, gf as InvalidHexBooleanError, gg as InvalidInputRpcError, gh as InvalidModifierError, gi as InvalidParameterError, gj as InvalidParamsRpcError, gk as InvalidParenthesisError, gl as InvalidPrimaryTypeError, gm as InvalidRequestRpcError, gn as InvalidSerializableTransactionError, go as InvalidSignatureError, gp as InvalidStorageKeySizeError, gq as InvalidStructSignatureError, gr as InvalidStructTypeError, gs as JsonRpcVersionUnsupportedError, gt as LimitExceededRpcError, gu as MaxFeePerGasTooLowError, gv as MethodNotFoundRpcError, gw as MethodNotSupportedRpcError, gx as NonceMaxValueError, gy as NonceTooHighError, gz as NonceTooLowError, gA as ParseRpcError, gB as ProviderDisconnectedError, gC as ProviderRpcError$1, gD as RawContractError, gE as ResourceNotFoundRpcError, bF as ResourceUnavailableRpcError, gF as RpcError, gG as SizeExceedsPaddingSizeError, gH as SizeOverflowError, gI as SliceOffsetOutOfBoundsError, aQ as SocketClosedError, gJ as SolidityProtectedKeywordError, gK as StateAssignmentConflictError, bv as SwitchChainError, aO as TimeoutError, gL as TipAboveFeeCapError, gM as TransactionExecutionError, gN as TransactionNotFoundError, gO as TransactionReceiptNotFoundError, gP as TransactionRejectedRpcError, gQ as TransactionTypeNotSupportedError, gR as UnauthorizedProviderError, gS as UnknownBundleIdError, gT as UnknownNodeError, gU as UnknownRpcError, gV as UnknownSignatureError, gW as UnknownTypeError, gX as UnsupportedChainIdError, bX as UnsupportedNonOptionalCapabilityError, bS as UnsupportedPackedAbiType, gY as UnsupportedProviderMethodError, bA as UserRejectedRequestError, gZ as WaitForTransactionReceiptTimeoutError, aS as WebSocketRequestError, g_ as blobsToCommitments, g$ as blobsToProofs, h0 as boolToBytes, bN as boolToHex, h1 as bytesToBigInt, h2 as bytesToBool, h3 as bytesToNumber, h4 as bytesToRlp, h5 as bytesToString, h6 as commitmentsToVersionedHashes, h7 as concatBytes, bJ as concatHex, bt as custom, aB as decodeErrorResult, h8 as decodeEventLog, h9 as decodeFunctionData, ha as decodeFunctionResult, hb as defineBlock, hc as defineTransaction, hd as defineTransactionReceipt, he as defineTransactionRequest, hf as deploylessCallViaBytecodeBytecode, hg as deploylessCallViaFactoryBytecode, hh as domainSeparator, aH as encodeAbiParameters, hi as encodeErrorResult, hj as encodeEventTopics, bW as encodeFunctionData, hk as encodeFunctionResult, hl as erc1155Abi, hm as erc20Abi, hn as erc20Abi_bytes32, ho as erc4626Abi, hp as erc6492SignatureValidatorAbi, hq as erc6492SignatureValidatorByteCode, hr as erc721Abi, hs as ethAddress, ht as extendSchema, hu as fallback, hv as formatBlock, hw as formatEther, dS as formatGwei, dY as formatLog, hx as formatTransaction, dZ as formatTransactionReceipt, dp as formatUnits, hy as fromBytes, by as fromHex, hz as getAbiItem, hA as getChainContractAddress, hB as getContractError, hC as toEventSelector, hD as toSignature, hE as toFunctionSelector, hF as getTransactionType, hG as hashDomain, hH as hashStruct, hI as hexToBool, hJ as hexToRlp, hK as hexToString, hL as labelhash, hM as maxInt104, hN as maxInt112, hO as maxInt120, hP as maxInt128, hQ as maxInt136, hR as maxInt144, hS as maxInt152, hT as maxInt16, hU as maxInt160, hV as maxInt168, hW as maxInt176, hX as maxInt184, hY as maxInt192, hZ as maxInt200, h_ as maxInt208, h$ as maxInt216, i0 as maxInt224, i1 as maxInt232, i2 as maxInt24, i3 as maxInt240, i4 as maxInt248, i5 as maxInt256, i6 as maxInt32, i7 as maxInt40, i8 as maxInt48, i9 as maxInt56, ia as maxInt64, ib as maxInt72, ic as maxInt8, id as maxInt80, ie as maxInt88, ig as maxInt96, ih as maxUint104, ii as maxUint112, ij as maxUint120, ik as maxUint128, il as maxUint136, im as maxUint144, io as maxUint152, ip as maxUint16, iq as maxUint160, ir as maxUint168, is as maxUint176, it as maxUint184, iu as maxUint192, iv as maxUint200, iw as maxUint208, ix as maxUint216, iy as maxUint224, iz as maxUint232, iA as maxUint24, iB as maxUint240, iC as maxUint248, iD as maxUint256, iE as maxUint32, iF as maxUint40, iG as maxUint48, iH as maxUint56, iI as maxUint64, iJ as maxUint72, iK as maxUint8, iL as maxUint80, iM as maxUint88, iN as maxUint96, iO as minInt104, iP as minInt112, iQ as minInt120, iR as minInt128, iS as minInt136, iT as minInt144, iU as minInt152, iV as minInt16, iW as minInt160, iX as minInt168, iY as minInt176, iZ as minInt184, i_ as minInt192, i$ as minInt200, j0 as minInt208, j1 as minInt216, j2 as minInt224, j3 as minInt232, j4 as minInt24, j5 as minInt240, j6 as minInt248, j7 as minInt256, j8 as minInt32, j9 as minInt40, ja as minInt48, jb as minInt56, jc as minInt64, jd as minInt72, je as minInt8, jf as minInt80, jg as minInt88, jh as minInt96, ji as multicall3Abi, jj as namehash, jk as numberToBytes, jl as padBytes, dQ as parseAbi, jm as parseAbiItem, jn as parseAbiParameters, jo as parseEventLogs, jp as prepareEncodeFunctionData, jq as presignMessagePrefix, jr as publicActions, js as recoverPublicKey, jt as rpcSchema, ju as rpcTransactionType, jv as serializeAccessList, jw as serializeSignature, jx as setErrorConfig, jy as sha256, jz as shouldThrow, jA as sliceBytes, jB as stringToBytes, bD as stringToHex, aA as stringify, jC as toBlobs, jD as toSignatureHash, jE as toPrefixedMessage, jF as transactionType, jG as weiUnits, jH as withCache, bE as withRetry, aN as withTimeout, jI as zeroAddress } from "./index-DqUaPUte.js";
import { e as erc6492MagicBytes, a as sendCalls, w as waitForCallsStatus, p as prepareAuthorization, g as getCallsStatus, B as BundleFailedError, W as WaitForCallsStatusTimeoutError, c as createNonceManager, b as encodePacked, d as parseSignature, n as nonceManager, s as serializeErc6492Signature, z as zeroHash } from "./parseSignature-BNDUQgjW.js";
import { g as getWebSocketRpcClient, a as getSocket } from "./compat-CF_6u_h6.js";
import { ccipRequest, offchainLookup, offchainLookupAbiItem, offchainLookupSignature } from "./ccip-Ct_2ILly.js";
function parseAbiParameter(param) {
  let abiParameter;
  if (typeof param === "string")
    abiParameter = parseAbiParameter$1(param, {
      modifiers
    });
  else {
    const structs = parseStructs(param);
    const length = param.length;
    for (let i = 0; i < length; i++) {
      const signature = param[i];
      if (isStructSignature(signature))
        continue;
      abiParameter = parseAbiParameter$1(signature, { modifiers, structs });
      break;
    }
  }
  if (!abiParameter)
    throw new InvalidAbiParameterError({ param });
  return abiParameter;
}
function isBytes(value) {
  if (!value)
    return false;
  if (typeof value !== "object")
    return false;
  if (!("BYTES_PER_ELEMENT" in value))
    return false;
  return value.BYTES_PER_ELEMENT === 1 && value.constructor.name === "Uint8Array";
}
function getContractAddress(opts) {
  if (opts.opcode === "CREATE2")
    return getCreate2Address(opts);
  return getCreateAddress(opts);
}
function getCreateAddress(opts) {
  const from = toBytes(getAddress(opts.from));
  let nonce = toBytes(opts.nonce);
  if (nonce[0] === 0)
    nonce = new Uint8Array([]);
  return getAddress(`0x${keccak256(toRlp([from, nonce], "bytes")).slice(26)}`);
}
function getCreate2Address(opts) {
  const from = toBytes(getAddress(opts.from));
  const salt = pad(isBytes(opts.salt) ? opts.salt : toBytes(opts.salt), {
    size: 32
  });
  const bytecodeHash = (() => {
    if ("bytecodeHash" in opts) {
      if (isBytes(opts.bytecodeHash))
        return opts.bytecodeHash;
      return toBytes(opts.bytecodeHash);
    }
    return keccak256(opts.bytecode, "bytes");
  })();
  return getAddress(slice(keccak256(concat([toBytes("0xff"), from, salt, bytecodeHash])), 12));
}
function extractChain({ chains, id }) {
  return chains.find((chain) => chain.id === id);
}
function fromRlp(value, to = "hex") {
  const bytes = (() => {
    if (typeof value === "string") {
      if (value.length > 3 && value.length % 2 !== 0)
        throw new InvalidHexValueError(value);
      return hexToBytes(value);
    }
    return value;
  })();
  const cursor = createCursor(bytes, {
    recursiveReadLimit: Number.POSITIVE_INFINITY
  });
  const result = fromRlpCursor(cursor, to);
  return result;
}
function fromRlpCursor(cursor, to = "hex") {
  if (cursor.bytes.length === 0)
    return to === "hex" ? bytesToHex(cursor.bytes) : cursor.bytes;
  const prefix = cursor.readByte();
  if (prefix < 128)
    cursor.decrementPosition(1);
  if (prefix < 192) {
    const length2 = readLength(cursor, prefix, 128);
    const bytes = cursor.readBytes(length2);
    return to === "hex" ? bytesToHex(bytes) : bytes;
  }
  const length = readLength(cursor, prefix, 192);
  return readList(cursor, length, to);
}
function readLength(cursor, prefix, offset) {
  if (offset === 128 && prefix < 128)
    return 1;
  if (prefix <= offset + 55)
    return prefix - offset;
  if (prefix === offset + 55 + 1)
    return cursor.readUint8();
  if (prefix === offset + 55 + 2)
    return cursor.readUint16();
  if (prefix === offset + 55 + 3)
    return cursor.readUint24();
  if (prefix === offset + 55 + 4)
    return cursor.readUint32();
  throw new BaseError("Invalid RLP prefix");
}
function readList(cursor, length, to) {
  const position = cursor.position;
  const value = [];
  while (cursor.position - position < length)
    value.push(fromRlpCursor(cursor, to));
  return value;
}
function isHash(hash) {
  return isHex(hash) && size(hash) === 32;
}
const Rho160 = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]);
const Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
const Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
const idxLR = /* @__PURE__ */ (() => {
  const L = [Id160];
  const R = [Pi160];
  const res = [L, R];
  for (let i = 0; i < 4; i++)
    for (let j of res)
      j.push(j[i].map((k) => Rho160[k]));
  return res;
})();
const idxL = /* @__PURE__ */ (() => idxLR[0])();
const idxR = /* @__PURE__ */ (() => idxLR[1])();
const shifts160 = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((i) => Uint8Array.from(i));
const shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
const shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
const Kl160 = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
const Kr160 = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
const BUF_160 = /* @__PURE__ */ new Uint32Array(16);
class RIPEMD160 extends HashMD {
  constructor() {
    super(64, 20, 8, true);
    this.h0 = 1732584193 | 0;
    this.h1 = 4023233417 | 0;
    this.h2 = 2562383102 | 0;
    this.h3 = 271733878 | 0;
    this.h4 = 3285377520 | 0;
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      BUF_160[i] = view.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group], hbr = Kr160[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL160[group], sr = shiftsR160[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    clean(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
}
const ripemd160$2 = /* @__PURE__ */ createHasher(() => new RIPEMD160());
const ripemd160$1 = ripemd160$2;
function ripemd160(value, to_) {
  const to = to_ || "hex";
  const bytes = ripemd160$1(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
function isErc6492Signature(signature) {
  return sliceHex(signature, -32) === erc6492MagicBytes;
}
function isErc8010Signature(signature) {
  return validate(signature);
}
function parseErc6492Signature(signature) {
  if (!isErc6492Signature(signature))
    return { signature };
  const [address, data, signature_] = decodeAbiParameters([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], signature);
  return { address, data, signature: signature_ };
}
function parseErc8010Signature(signature) {
  if (!isErc8010Signature(signature))
    return { signature };
  const { authorization: authorization_ox, to, ...rest } = unwrap(signature);
  return {
    authorization: {
      address: authorization_ox.address,
      chainId: authorization_ox.chainId,
      nonce: Number(authorization_ox.nonce),
      r: numberToHex(authorization_ox.r, { size: 32 }),
      s: numberToHex(authorization_ox.s, { size: 32 }),
      yParity: authorization_ox.yParity
    },
    ...to ? { address: to } : {},
    ...rest
  };
}
async function recoverMessageAddress({ message, signature }) {
  return recoverAddress({ hash: hashMessage(message), signature });
}
async function recoverTypedDataAddress(parameters) {
  const { domain, message, primaryType, signature, types } = parameters;
  return recoverAddress({
    hash: hashTypedData({
      domain,
      message,
      primaryType,
      types
    }),
    signature
  });
}
function serializeErc8010Signature(parameters) {
  const { address, data, signature, to = "hex" } = parameters;
  const signature_ = wrap({
    authorization: {
      address: parameters.authorization.address,
      chainId: parameters.authorization.chainId,
      nonce: BigInt(parameters.authorization.nonce),
      r: BigInt(parameters.authorization.r),
      s: BigInt(parameters.authorization.s),
      yParity: parameters.authorization.yParity
    },
    data,
    signature,
    to: address
  });
  if (to === "hex")
    return signature_;
  return hexToBytes(signature_);
}
async function verifyHash({ address, hash, signature }) {
  return isAddressEqual(getAddress(address), await recoverAddress({ hash, signature }));
}
async function verifyMessage({ address, message, signature }) {
  return isAddressEqual(getAddress(address), await recoverMessageAddress({ message, signature }));
}
async function verifyTypedData(parameters) {
  const { address, domain, message, primaryType, signature, types } = parameters;
  return isAddressEqual(getAddress(address), await recoverTypedDataAddress({
    domain,
    message,
    primaryType,
    signature,
    types
  }));
}
function getSerializedTransactionType(serializedTransaction) {
  const serializedType = sliceHex(serializedTransaction, 0, 1);
  if (serializedType === "0x04")
    return "eip7702";
  if (serializedType === "0x03")
    return "eip4844";
  if (serializedType === "0x02")
    return "eip1559";
  if (serializedType === "0x01")
    return "eip2930";
  if (serializedType !== "0x" && hexToNumber(serializedType) >= 192)
    return "legacy";
  throw new InvalidSerializedTransactionTypeError({ serializedType });
}
function parseTransaction(serializedTransaction) {
  const type = getSerializedTransactionType(serializedTransaction);
  if (type === "eip1559")
    return parseTransactionEIP1559(serializedTransaction);
  if (type === "eip2930")
    return parseTransactionEIP2930(serializedTransaction);
  if (type === "eip4844")
    return parseTransactionEIP4844(serializedTransaction);
  if (type === "eip7702")
    return parseTransactionEIP7702(serializedTransaction);
  return parseTransactionLegacy(serializedTransaction);
}
function parseTransactionEIP7702(serializedTransaction) {
  const transactionArray = toTransactionArray(serializedTransaction);
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, v, r, s] = transactionArray;
  if (transactionArray.length !== 10 && transactionArray.length !== 13)
    throw new InvalidSerializedTransactionError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to,
        value,
        data,
        accessList,
        authorizationList,
        ...transactionArray.length > 9 ? {
          v,
          r,
          s
        } : {}
      },
      serializedTransaction,
      type: "eip7702"
    });
  const transaction = {
    chainId: hexToNumber(chainId),
    type: "eip7702"
  };
  if (isHex(to) && to !== "0x")
    transaction.to = to;
  if (isHex(gas) && gas !== "0x")
    transaction.gas = hexToBigInt(gas);
  if (isHex(data) && data !== "0x")
    transaction.data = data;
  if (isHex(nonce))
    transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
  if (isHex(value) && value !== "0x")
    transaction.value = hexToBigInt(value);
  if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
  if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = parseAccessList(accessList);
  if (authorizationList.length !== 0 && authorizationList !== "0x")
    transaction.authorizationList = parseAuthorizationList(authorizationList);
  assertTransactionEIP7702(transaction);
  const signature = transactionArray.length === 13 ? parseEIP155Signature(transactionArray) : void 0;
  return { ...signature, ...transaction };
}
function parseTransactionEIP4844(serializedTransaction) {
  const transactionOrWrapperArray = toTransactionArray(serializedTransaction);
  const hasNetworkWrapper = transactionOrWrapperArray.length === 4;
  const transactionArray = hasNetworkWrapper ? transactionOrWrapperArray[0] : transactionOrWrapperArray;
  const wrapperArray = hasNetworkWrapper ? transactionOrWrapperArray.slice(1) : [];
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, maxFeePerBlobGas, blobVersionedHashes, v, r, s] = transactionArray;
  const [blobs, commitments, proofs] = wrapperArray;
  if (!(transactionArray.length === 11 || transactionArray.length === 14))
    throw new InvalidSerializedTransactionError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to,
        value,
        data,
        accessList,
        ...transactionArray.length > 9 ? {
          v,
          r,
          s
        } : {}
      },
      serializedTransaction,
      type: "eip4844"
    });
  const transaction = {
    blobVersionedHashes,
    chainId: hexToNumber(chainId),
    to,
    type: "eip4844"
  };
  if (isHex(gas) && gas !== "0x")
    transaction.gas = hexToBigInt(gas);
  if (isHex(data) && data !== "0x")
    transaction.data = data;
  if (isHex(nonce))
    transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
  if (isHex(value) && value !== "0x")
    transaction.value = hexToBigInt(value);
  if (isHex(maxFeePerBlobGas) && maxFeePerBlobGas !== "0x")
    transaction.maxFeePerBlobGas = hexToBigInt(maxFeePerBlobGas);
  if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
  if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = parseAccessList(accessList);
  if (blobs && commitments && proofs)
    transaction.sidecars = toBlobSidecars({
      blobs,
      commitments,
      proofs
    });
  assertTransactionEIP4844(transaction);
  const signature = transactionArray.length === 14 ? parseEIP155Signature(transactionArray) : void 0;
  return { ...signature, ...transaction };
}
function parseTransactionEIP1559(serializedTransaction) {
  const transactionArray = toTransactionArray(serializedTransaction);
  const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, v, r, s] = transactionArray;
  if (!(transactionArray.length === 9 || transactionArray.length === 12))
    throw new InvalidSerializedTransactionError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        to,
        value,
        data,
        accessList,
        ...transactionArray.length > 9 ? {
          v,
          r,
          s
        } : {}
      },
      serializedTransaction,
      type: "eip1559"
    });
  const transaction = {
    chainId: hexToNumber(chainId),
    type: "eip1559"
  };
  if (isHex(to) && to !== "0x")
    transaction.to = to;
  if (isHex(gas) && gas !== "0x")
    transaction.gas = hexToBigInt(gas);
  if (isHex(data) && data !== "0x")
    transaction.data = data;
  if (isHex(nonce))
    transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
  if (isHex(value) && value !== "0x")
    transaction.value = hexToBigInt(value);
  if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
    transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
  if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
    transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = parseAccessList(accessList);
  assertTransactionEIP1559(transaction);
  const signature = transactionArray.length === 12 ? parseEIP155Signature(transactionArray) : void 0;
  return { ...signature, ...transaction };
}
function parseTransactionEIP2930(serializedTransaction) {
  const transactionArray = toTransactionArray(serializedTransaction);
  const [chainId, nonce, gasPrice, gas, to, value, data, accessList, v, r, s] = transactionArray;
  if (!(transactionArray.length === 8 || transactionArray.length === 11))
    throw new InvalidSerializedTransactionError({
      attributes: {
        chainId,
        nonce,
        gasPrice,
        gas,
        to,
        value,
        data,
        accessList,
        ...transactionArray.length > 8 ? {
          v,
          r,
          s
        } : {}
      },
      serializedTransaction,
      type: "eip2930"
    });
  const transaction = {
    chainId: hexToNumber(chainId),
    type: "eip2930"
  };
  if (isHex(to) && to !== "0x")
    transaction.to = to;
  if (isHex(gas) && gas !== "0x")
    transaction.gas = hexToBigInt(gas);
  if (isHex(data) && data !== "0x")
    transaction.data = data;
  if (isHex(nonce))
    transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
  if (isHex(value) && value !== "0x")
    transaction.value = hexToBigInt(value);
  if (isHex(gasPrice) && gasPrice !== "0x")
    transaction.gasPrice = hexToBigInt(gasPrice);
  if (accessList.length !== 0 && accessList !== "0x")
    transaction.accessList = parseAccessList(accessList);
  assertTransactionEIP2930(transaction);
  const signature = transactionArray.length === 11 ? parseEIP155Signature(transactionArray) : void 0;
  return { ...signature, ...transaction };
}
function parseTransactionLegacy(serializedTransaction) {
  const transactionArray = fromRlp(serializedTransaction, "hex");
  const [nonce, gasPrice, gas, to, value, data, chainIdOrV_, r, s] = transactionArray;
  if (!(transactionArray.length === 6 || transactionArray.length === 9))
    throw new InvalidSerializedTransactionError({
      attributes: {
        nonce,
        gasPrice,
        gas,
        to,
        value,
        data,
        ...transactionArray.length > 6 ? {
          v: chainIdOrV_,
          r,
          s
        } : {}
      },
      serializedTransaction,
      type: "legacy"
    });
  const transaction = {
    type: "legacy"
  };
  if (isHex(to) && to !== "0x")
    transaction.to = to;
  if (isHex(gas) && gas !== "0x")
    transaction.gas = hexToBigInt(gas);
  if (isHex(data) && data !== "0x")
    transaction.data = data;
  if (isHex(nonce))
    transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
  if (isHex(value) && value !== "0x")
    transaction.value = hexToBigInt(value);
  if (isHex(gasPrice) && gasPrice !== "0x")
    transaction.gasPrice = hexToBigInt(gasPrice);
  assertTransactionLegacy(transaction);
  if (transactionArray.length === 6)
    return transaction;
  const chainIdOrV = isHex(chainIdOrV_) && chainIdOrV_ !== "0x" ? hexToBigInt(chainIdOrV_) : 0n;
  if (s === "0x" && r === "0x") {
    if (chainIdOrV > 0)
      transaction.chainId = Number(chainIdOrV);
    return transaction;
  }
  const v = chainIdOrV;
  const chainId = Number((v - 35n) / 2n);
  if (chainId > 0)
    transaction.chainId = chainId;
  else if (v !== 27n && v !== 28n)
    throw new InvalidLegacyVError({ v });
  transaction.v = v;
  transaction.s = s;
  transaction.r = r;
  transaction.yParity = v % 2n === 0n ? 1 : 0;
  return transaction;
}
function toTransactionArray(serializedTransaction) {
  return fromRlp(`0x${serializedTransaction.slice(4)}`, "hex");
}
function parseAccessList(accessList_) {
  const accessList = [];
  for (let i = 0; i < accessList_.length; i++) {
    const [address, storageKeys] = accessList_[i];
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    accessList.push({
      address,
      storageKeys: storageKeys.map((key) => isHash(key) ? key : trim(key))
    });
  }
  return accessList;
}
function parseAuthorizationList(serializedAuthorizationList) {
  const authorizationList = [];
  for (let i = 0; i < serializedAuthorizationList.length; i++) {
    const [chainId, address, nonce, yParity, r, s] = serializedAuthorizationList[i];
    authorizationList.push({
      address,
      chainId: chainId === "0x" ? 0 : hexToNumber(chainId),
      nonce: nonce === "0x" ? 0 : hexToNumber(nonce),
      ...parseEIP155Signature([yParity, r, s])
    });
  }
  return authorizationList;
}
function parseEIP155Signature(transactionArray) {
  const signature = transactionArray.slice(-3);
  const v = signature[0] === "0x" || hexToBigInt(signature[0]) === 0n ? 27n : 28n;
  return {
    r: padHex(signature[1], { size: 32 }),
    s: padHex(signature[2], { size: 32 }),
    v,
    yParity: v === 27n ? 0 : 1
  };
}
function parseEther(ether, unit = "wei") {
  return parseUnits(ether, etherUnits[unit]);
}
function parseGwei(ether, unit = "wei") {
  return parseUnits(ether, gweiUnits[unit]);
}
async function dropTransaction(client, { hash }) {
  await client.request({
    method: `${client.mode}_dropTransaction`,
    params: [hash]
  });
}
async function dumpState(client) {
  return client.request({
    method: `${client.mode}_dumpState`
  });
}
async function getAutomine(client) {
  if (client.mode === "ganache")
    return await client.request({
      method: "eth_mining"
    });
  return await client.request({
    method: `${client.mode}_getAutomine`
  });
}
async function getTxpoolContent(client) {
  return await client.request({
    method: "txpool_content"
  });
}
async function getTxpoolStatus(client) {
  const { pending, queued } = await client.request({
    method: "txpool_status"
  });
  return {
    pending: hexToNumber(pending),
    queued: hexToNumber(queued)
  };
}
async function impersonateAccount(client, { address }) {
  await client.request({
    method: `${client.mode}_impersonateAccount`,
    params: [address]
  });
}
async function increaseTime(client, { seconds }) {
  return await client.request({
    method: "evm_increaseTime",
    params: [numberToHex(seconds)]
  });
}
async function inspectTxpool(client) {
  return await client.request({
    method: "txpool_inspect"
  });
}
async function loadState(client, { state }) {
  await client.request({
    method: `${client.mode}_loadState`,
    params: [state]
  });
}
async function mine(client, { blocks, interval }) {
  if (client.mode === "ganache")
    await client.request({
      method: "evm_mine",
      params: [{ blocks: numberToHex(blocks) }]
    });
  else
    await client.request({
      method: `${client.mode}_mine`,
      params: [numberToHex(blocks), numberToHex(interval || 0)]
    });
}
async function removeBlockTimestampInterval(client) {
  await client.request({
    method: `${client.mode}_removeBlockTimestampInterval`
  });
}
async function reset(client, { blockNumber, jsonRpcUrl } = {}) {
  await client.request({
    method: `${client.mode}_reset`,
    params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }]
  });
}
async function revert(client, { id }) {
  await client.request({
    method: "evm_revert",
    params: [id]
  });
}
async function sendUnsignedTransaction(client, args) {
  var _a, _b, _c;
  const { accessList, data, from, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, ...rest } = args;
  const chainFormat = (_c = (_b = (_a = client.chain) == null ? void 0 : _a.formatters) == null ? void 0 : _b.transactionRequest) == null ? void 0 : _c.format;
  const format = chainFormat || formatTransactionRequest;
  const request = format({
    // Pick out extra data that might exist on the chain's transaction request type.
    ...extract(rest, { format: chainFormat }),
    accessList,
    data,
    from,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value
  }, "sendUnsignedTransaction");
  const hash = await client.request({
    method: "eth_sendUnsignedTransaction",
    params: [request]
  });
  return hash;
}
async function setAutomine(client, enabled) {
  if (client.mode === "ganache") {
    if (enabled)
      await client.request({ method: "miner_start" });
    else
      await client.request({ method: "miner_stop" });
  } else
    await client.request({
      method: "evm_setAutomine",
      params: [enabled]
    });
}
async function setBalance(client, { address, value }) {
  if (client.mode === "ganache")
    await client.request({
      method: "evm_setAccountBalance",
      params: [address, numberToHex(value)]
    });
  else
    await client.request({
      method: `${client.mode}_setBalance`,
      params: [address, numberToHex(value)]
    });
}
async function setBlockGasLimit(client, { gasLimit }) {
  await client.request({
    method: "evm_setBlockGasLimit",
    params: [numberToHex(gasLimit)]
  });
}
async function setBlockTimestampInterval(client, { interval }) {
  const interval_ = (() => {
    if (client.mode === "hardhat")
      return interval * 1e3;
    return interval;
  })();
  await client.request({
    method: `${client.mode}_setBlockTimestampInterval`,
    params: [interval_]
  });
}
async function setCode(client, { address, bytecode }) {
  if (client.mode === "ganache")
    await client.request({
      method: "evm_setAccountCode",
      params: [address, bytecode]
    });
  else
    await client.request({
      method: `${client.mode}_setCode`,
      params: [address, bytecode]
    });
}
async function setCoinbase(client, { address }) {
  await client.request({
    method: `${client.mode}_setCoinbase`,
    params: [address]
  });
}
async function setIntervalMining(client, { interval }) {
  const interval_ = (() => {
    if (client.mode === "hardhat")
      return interval * 1e3;
    return interval;
  })();
  await client.request({
    method: "evm_setIntervalMining",
    params: [interval_]
  });
}
async function setLoggingEnabled(client, enabled) {
  await client.request({
    method: `${client.mode}_setLoggingEnabled`,
    params: [enabled]
  });
}
async function setMinGasPrice(client, { gasPrice }) {
  await client.request({
    method: `${client.mode}_setMinGasPrice`,
    params: [numberToHex(gasPrice)]
  });
}
async function setNextBlockBaseFeePerGas(client, { baseFeePerGas }) {
  await client.request({
    method: `${client.mode}_setNextBlockBaseFeePerGas`,
    params: [numberToHex(baseFeePerGas)]
  });
}
async function setNextBlockTimestamp(client, { timestamp }) {
  await client.request({
    method: "evm_setNextBlockTimestamp",
    params: [numberToHex(timestamp)]
  });
}
async function setNonce(client, { address, nonce }) {
  await client.request({
    method: `${client.mode}_setNonce`,
    params: [address, numberToHex(nonce)]
  });
}
async function setRpcUrl(client, jsonRpcUrl) {
  await client.request({
    method: `${client.mode}_setRpcUrl`,
    params: [jsonRpcUrl]
  });
}
async function setStorageAt(client, { address, index, value }) {
  await client.request({
    method: `${client.mode}_setStorageAt`,
    params: [
      address,
      typeof index === "number" ? numberToHex(index) : index,
      value
    ]
  });
}
async function snapshot(client) {
  return await client.request({
    method: "evm_snapshot"
  });
}
async function stopImpersonatingAccount(client, { address }) {
  await client.request({
    method: `${client.mode}_stopImpersonatingAccount`,
    params: [address]
  });
}
async function addChain(client, { chain }) {
  const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
  await client.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: numberToHex(id),
        chainName: name,
        nativeCurrency,
        rpcUrls: rpcUrls.default.http,
        blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
      }
    ]
  }, { dedupe: true, retryCount: 0 });
}
function deployContract(walletClient, parameters) {
  const { abi, args, bytecode, ...request } = parameters;
  const calldata = encodeDeployData({ abi, args, bytecode });
  return sendTransaction(walletClient, {
    ...request,
    ...request.authorizationList ? { to: null } : {},
    data: calldata
  });
}
async function getAddresses(client) {
  var _a;
  if (((_a = client.account) == null ? void 0 : _a.type) === "local")
    return [client.account.address];
  const addresses = await client.request({ method: "eth_accounts" }, { dedupe: true });
  return addresses.map((address) => checksumAddress(address));
}
async function getCapabilities(client, parameters = {}) {
  const { account = client.account, chainId } = parameters;
  const account_ = account ? parseAccount(account) : void 0;
  const params = chainId ? [account_ == null ? void 0 : account_.address, [numberToHex(chainId)]] : [account_ == null ? void 0 : account_.address];
  const capabilities_raw = await client.request({
    method: "wallet_getCapabilities",
    params
  });
  const capabilities = {};
  for (const [chainId2, capabilities_] of Object.entries(capabilities_raw)) {
    capabilities[Number(chainId2)] = {};
    for (let [key, value] of Object.entries(capabilities_)) {
      if (key === "addSubAccount")
        key = "unstable_addSubAccount";
      capabilities[Number(chainId2)][key] = value;
    }
  }
  return typeof chainId === "number" ? capabilities[chainId] : capabilities;
}
async function getPermissions(client) {
  const permissions = await client.request({ method: "wallet_getPermissions" }, { dedupe: true });
  return permissions;
}
async function requestAddresses(client) {
  const addresses = await client.request({ method: "eth_requestAccounts" }, { dedupe: true, retryCount: 0 });
  return addresses.map((address) => getAddress(address));
}
async function requestPermissions(client, permissions) {
  return client.request({
    method: "wallet_requestPermissions",
    params: [permissions]
  }, { retryCount: 0 });
}
async function sendCallsSync(client, parameters) {
  const { chain = client.chain } = parameters;
  const timeout = parameters.timeout ?? Math.max(((chain == null ? void 0 : chain.blockTime) ?? 0) * 3, 5e3);
  const result = await getAction(client, sendCalls, "sendCalls")(parameters);
  const status = await getAction(client, waitForCallsStatus, "waitForCallsStatus")({
    ...parameters,
    id: result.id,
    timeout
  });
  return status;
}
const supportsWalletNamespace = new LruMap(128);
async function sendTransactionSync(client, parameters) {
  var _a, _b, _c, _d, _e;
  const { account: account_ = client.account, assertChainId = true, chain = client.chain, accessList, authorizationList, blobs, data, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : (_a = client.dataSuffix) == null ? void 0 : _a.value, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, pollingInterval, throwOnReceiptRevert, type, value, ...rest } = parameters;
  const timeout = parameters.timeout ?? Math.max(((chain == null ? void 0 : chain.blockTime) ?? 0) * 3, 5e3);
  if (typeof account_ === "undefined")
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/sendTransactionSync"
    });
  const account = account_ ? parseAccount(account_) : null;
  try {
    assertRequest(parameters);
    const to = await (async () => {
      if (parameters.to)
        return parameters.to;
      if (parameters.to === null)
        return void 0;
      if (authorizationList && authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: authorizationList[0]
        }).catch(() => {
          throw new BaseError("`to` is required. Could not infer from `authorizationList`.");
        });
      return void 0;
    })();
    if ((account == null ? void 0 : account.type) === "json-rpc" || account === null) {
      let chainId;
      if (chain !== null) {
        chainId = await getAction(client, getChainId, "getChainId")({});
        if (assertChainId)
          assertCurrentChain({
            currentChainId: chainId,
            chain
          });
      }
      const chainFormat = (_d = (_c = (_b = client.chain) == null ? void 0 : _b.formatters) == null ? void 0 : _c.transactionRequest) == null ? void 0 : _d.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        accessList,
        account,
        authorizationList,
        blobs,
        chainId,
        data: data ? concat([data, dataSuffix ?? "0x"]) : data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        type,
        value
      }, "sendTransaction");
      const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
      const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
      const hash = await (async () => {
        try {
          return await client.request({
            method,
            params: [request]
          }, { retryCount: 0 });
        } catch (e) {
          if (isWalletNamespaceSupported === false)
            throw e;
          const error = e;
          if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") {
            return await client.request({
              method: "wallet_sendTransaction",
              params: [request]
            }, { retryCount: 0 }).then((hash2) => {
              supportsWalletNamespace.set(client.uid, true);
              return hash2;
            }).catch((e2) => {
              const walletNamespaceError = e2;
              if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
                supportsWalletNamespace.set(client.uid, false);
                throw error;
              }
              throw walletNamespaceError;
            });
          }
          throw error;
        }
      })();
      const receipt = await getAction(client, waitForTransactionReceipt, "waitForTransactionReceipt")({
        checkReplacement: false,
        hash,
        pollingInterval,
        timeout
      });
      if (throwOnReceiptRevert && receipt.status === "reverted")
        throw new TransactionReceiptRevertedError({ receipt });
      return receipt;
    }
    if ((account == null ? void 0 : account.type) === "local") {
      const request = await getAction(client, prepareTransactionRequest, "prepareTransactionRequest")({
        account,
        accessList,
        authorizationList,
        blobs,
        chain,
        data: data ? concat([data, dataSuffix ?? "0x"]) : data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        nonceManager: account.nonceManager,
        parameters: [...defaultParameters, "sidecars"],
        type,
        value,
        ...rest,
        to
      });
      const serializer = (_e = chain == null ? void 0 : chain.serializers) == null ? void 0 : _e.transaction;
      const serializedTransaction = await account.signTransaction(request, {
        serializer
      });
      return await getAction(client, sendRawTransactionSync, "sendRawTransactionSync")({
        serializedTransaction,
        throwOnReceiptRevert,
        timeout: parameters.timeout
      });
    }
    if ((account == null ? void 0 : account.type) === "smart")
      throw new AccountTypeNotSupportedError({
        metaMessages: [
          "Consider using the `sendUserOperation` Action instead."
        ],
        docsPath: "/docs/actions/bundler/sendUserOperation",
        type: "smart"
      });
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/actions/wallet/sendTransactionSync",
      type: account == null ? void 0 : account.type
    });
  } catch (err) {
    if (err instanceof AccountTypeNotSupportedError)
      throw err;
    throw getTransactionError(err, {
      ...parameters,
      account,
      chain: parameters.chain || void 0
    });
  }
}
async function showCallsStatus(client, parameters) {
  const { id } = parameters;
  await client.request({
    method: "wallet_showCallsStatus",
    params: [id]
  });
  return;
}
async function signAuthorization(client, parameters) {
  const { account: account_ = client.account } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/eip7702/signAuthorization"
    });
  const account = parseAccount(account_);
  if (!account.signAuthorization)
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/eip7702/signAuthorization",
      metaMessages: [
        "The `signAuthorization` Action does not support JSON-RPC Accounts."
      ],
      type: account.type
    });
  const authorization = await prepareAuthorization(client, parameters);
  return account.signAuthorization(authorization);
}
async function signTransaction(client, parameters) {
  var _a, _b, _c, _d;
  const { account: account_ = client.account, chain = client.chain, ...transaction } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTransaction"
    });
  const account = parseAccount(account_);
  assertRequest({
    account,
    ...parameters
  });
  const chainId = await getAction(client, getChainId, "getChainId")({});
  if (chain !== null)
    assertCurrentChain({
      currentChainId: chainId,
      chain
    });
  const formatters = (chain == null ? void 0 : chain.formatters) || ((_a = client.chain) == null ? void 0 : _a.formatters);
  const format = ((_b = formatters == null ? void 0 : formatters.transactionRequest) == null ? void 0 : _b.format) || formatTransactionRequest;
  if (account.signTransaction)
    return account.signTransaction({
      ...transaction,
      account,
      chainId
    }, { serializer: (_d = (_c = client.chain) == null ? void 0 : _c.serializers) == null ? void 0 : _d.transaction });
  return await client.request({
    method: "eth_signTransaction",
    params: [
      {
        ...format({
          ...transaction,
          account
        }, "signTransaction"),
        chainId: numberToHex(chainId),
        from: account.address
      }
    ]
  }, { retryCount: 0 });
}
async function signTypedData(client, parameters) {
  const { account: account_ = client.account, domain, message, primaryType } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTypedData"
    });
  const account = parseAccount(account_);
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({ domain, message, primaryType, types });
  if (account.signTypedData)
    return account.signTypedData({ domain, message, primaryType, types });
  const typedData = serializeTypedData({ domain, message, primaryType, types });
  return client.request({
    method: "eth_signTypedData_v4",
    params: [account.address, typedData]
  }, { retryCount: 0 });
}
async function switchChain(client, { id }) {
  await client.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: numberToHex(id)
      }
    ]
  }, { retryCount: 0 });
}
async function watchAsset(client, params) {
  const added = await client.request({
    method: "wallet_watchAsset",
    params
  }, { retryCount: 0 });
  return added;
}
async function writeContractSync(client, parameters) {
  return writeContract.internal(client, sendTransactionSync, "sendTransactionSync", parameters);
}
function getContract({ abi, address, client: client_ }) {
  const client = client_;
  const [publicClient, walletClient] = (() => {
    if (!client)
      return [void 0, void 0];
    if ("public" in client && "wallet" in client)
      return [client.public, client.wallet];
    if ("public" in client)
      return [client.public, void 0];
    if ("wallet" in client)
      return [void 0, client.wallet];
    return [client, client];
  })();
  const hasPublicClient = publicClient !== void 0 && publicClient !== null;
  const hasWalletClient = walletClient !== void 0 && walletClient !== null;
  const contract = {};
  let hasReadFunction = false;
  let hasWriteFunction = false;
  let hasEvent = false;
  for (const item of abi) {
    if (item.type === "function")
      if (item.stateMutability === "view" || item.stateMutability === "pure")
        hasReadFunction = true;
      else
        hasWriteFunction = true;
    else if (item.type === "event")
      hasEvent = true;
    if (hasReadFunction && hasWriteFunction && hasEvent)
      break;
  }
  if (hasPublicClient) {
    if (hasReadFunction)
      contract.read = new Proxy({}, {
        get(_, functionName) {
          return (...parameters) => {
            const { args, options } = getFunctionParameters(parameters);
            return getAction(publicClient, readContract, "readContract")({
              abi,
              address,
              functionName,
              args,
              ...options
            });
          };
        }
      });
    if (hasWriteFunction)
      contract.simulate = new Proxy({}, {
        get(_, functionName) {
          return (...parameters) => {
            const { args, options } = getFunctionParameters(parameters);
            return getAction(publicClient, simulateContract, "simulateContract")({
              abi,
              address,
              functionName,
              args,
              ...options
            });
          };
        }
      });
    if (hasEvent) {
      contract.createEventFilter = new Proxy({}, {
        get(_, eventName) {
          return (...parameters) => {
            const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
            const { args, options } = getEventParameters(parameters, abiEvent);
            return getAction(publicClient, createContractEventFilter, "createContractEventFilter")({
              abi,
              address,
              eventName,
              args,
              ...options
            });
          };
        }
      });
      contract.getEvents = new Proxy({}, {
        get(_, eventName) {
          return (...parameters) => {
            const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
            const { args, options } = getEventParameters(parameters, abiEvent);
            return getAction(publicClient, getContractEvents, "getContractEvents")({
              abi,
              address,
              eventName,
              args,
              ...options
            });
          };
        }
      });
      contract.watchEvent = new Proxy({}, {
        get(_, eventName) {
          return (...parameters) => {
            const abiEvent = abi.find((x) => x.type === "event" && x.name === eventName);
            const { args, options } = getEventParameters(parameters, abiEvent);
            return getAction(publicClient, watchContractEvent, "watchContractEvent")({
              abi,
              address,
              eventName,
              args,
              ...options
            });
          };
        }
      });
    }
  }
  if (hasWalletClient) {
    if (hasWriteFunction)
      contract.write = new Proxy({}, {
        get(_, functionName) {
          return (...parameters) => {
            const { args, options } = getFunctionParameters(parameters);
            return getAction(walletClient, writeContract, "writeContract")({
              abi,
              address,
              functionName,
              args,
              ...options
            });
          };
        }
      });
  }
  if (hasPublicClient || hasWalletClient) {
    if (hasWriteFunction)
      contract.estimateGas = new Proxy({}, {
        get(_, functionName) {
          return (...parameters) => {
            const { args, options } = getFunctionParameters(parameters);
            const client2 = publicClient ?? walletClient;
            return getAction(client2, estimateContractGas, "estimateContractGas")({
              abi,
              address,
              functionName,
              args,
              ...options,
              account: options.account ?? walletClient.account
            });
          };
        }
      });
  }
  contract.address = address;
  contract.abi = abi;
  return contract;
}
function getFunctionParameters(values) {
  const hasArgs = values.length && Array.isArray(values[0]);
  const args = hasArgs ? values[0] : [];
  const options = (hasArgs ? values[1] : values[0]) ?? {};
  return { args, options };
}
function getEventParameters(values, abiEvent) {
  let hasArgs = false;
  if (Array.isArray(values[0]))
    hasArgs = true;
  else if (values.length === 1) {
    hasArgs = abiEvent.inputs.some((x) => x.indexed);
  } else if (values.length === 2) {
    hasArgs = true;
  }
  const args = hasArgs ? values[0] : void 0;
  const options = (hasArgs ? values[1] : values[0]) ?? {};
  return { args, options };
}
function testActions({ mode }) {
  return (client_) => {
    const client = client_.extend(() => ({
      mode
    }));
    return {
      dropTransaction: (args) => dropTransaction(client, args),
      dumpState: () => dumpState(client),
      getAutomine: () => getAutomine(client),
      getTxpoolContent: () => getTxpoolContent(client),
      getTxpoolStatus: () => getTxpoolStatus(client),
      impersonateAccount: (args) => impersonateAccount(client, args),
      increaseTime: (args) => increaseTime(client, args),
      inspectTxpool: () => inspectTxpool(client),
      loadState: (args) => loadState(client, args),
      mine: (args) => mine(client, args),
      removeBlockTimestampInterval: () => removeBlockTimestampInterval(client),
      reset: (args) => reset(client, args),
      revert: (args) => revert(client, args),
      sendUnsignedTransaction: (args) => sendUnsignedTransaction(client, args),
      setAutomine: (args) => setAutomine(client, args),
      setBalance: (args) => setBalance(client, args),
      setBlockGasLimit: (args) => setBlockGasLimit(client, args),
      setBlockTimestampInterval: (args) => setBlockTimestampInterval(client, args),
      setCode: (args) => setCode(client, args),
      setCoinbase: (args) => setCoinbase(client, args),
      setIntervalMining: (args) => setIntervalMining(client, args),
      setLoggingEnabled: (args) => setLoggingEnabled(client, args),
      setMinGasPrice: (args) => setMinGasPrice(client, args),
      setNextBlockBaseFeePerGas: (args) => setNextBlockBaseFeePerGas(client, args),
      setNextBlockTimestamp: (args) => setNextBlockTimestamp(client, args),
      setNonce: (args) => setNonce(client, args),
      setRpcUrl: (args) => setRpcUrl(client, args),
      setStorageAt: (args) => setStorageAt(client, args),
      snapshot: () => snapshot(client),
      stopImpersonatingAccount: (args) => stopImpersonatingAccount(client, args)
    };
  };
}
function createTestClient(parameters) {
  const { key = "test", name = "Test Client", mode } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "testClient"
  });
  return client.extend((config) => ({
    mode,
    ...testActions({ mode })(config)
  }));
}
function walletActions(client) {
  return {
    addChain: (args) => addChain(client, args),
    deployContract: (args) => deployContract(client, args),
    fillTransaction: (args) => fillTransaction(client, args),
    getAddresses: () => getAddresses(client),
    getCallsStatus: (args) => getCallsStatus(client, args),
    getCapabilities: (args) => getCapabilities(client, args),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client),
    prepareAuthorization: (args) => prepareAuthorization(client, args),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    requestAddresses: () => requestAddresses(client),
    requestPermissions: (args) => requestPermissions(client, args),
    sendCalls: (args) => sendCalls(client, args),
    sendCallsSync: (args) => sendCallsSync(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
    sendTransaction: (args) => sendTransaction(client, args),
    sendTransactionSync: (args) => sendTransactionSync(client, args),
    showCallsStatus: (args) => showCallsStatus(client, args),
    signAuthorization: (args) => signAuthorization(client, args),
    signMessage: (args) => signMessage(client, args),
    signTransaction: (args) => signTransaction(client, args),
    signTypedData: (args) => signTypedData(client, args),
    switchChain: (args) => switchChain(client, args),
    waitForCallsStatus: (args) => waitForCallsStatus(client, args),
    watchAsset: (args) => watchAsset(client, args),
    writeContract: (args) => writeContract(client, args),
    writeContractSync: (args) => writeContractSync(client, args)
  };
}
function createWalletClient(parameters) {
  const { key = "wallet", name = "Wallet Client", transport } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: "walletClient"
  });
  return client.extend(walletActions);
}
function webSocket(url, config = {}) {
  const { keepAlive, key = "webSocket", methods, name = "WebSocket JSON-RPC", reconnect, retryDelay } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    var _a;
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || ((_a = chain == null ? void 0 : chain.rpcUrls.default.webSocket) == null ? void 0 : _a[0]);
    const wsRpcClientOpts = { keepAlive, reconnect };
    if (!url_)
      throw new UrlRequiredError();
    return createTransport({
      key,
      methods,
      name,
      async request({ method, params }) {
        const body = { method, params };
        const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
        const { error, result } = await rpcClient.requestAsync({
          body,
          timeout
        });
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "webSocket"
    }, {
      getSocket() {
        return getSocket(url_);
      },
      getRpcClient() {
        return getWebSocketRpcClient(url_, wsRpcClientOpts);
      },
      async subscribe({ params, onData, onError }) {
        const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
        const { result: subscriptionId } = await new Promise((resolve, reject) => rpcClient.request({
          body: {
            method: "eth_subscribe",
            params
          },
          onError(error) {
            reject(error);
            onError == null ? void 0 : onError(error);
            return;
          },
          onResponse(response) {
            if (response.error) {
              reject(response.error);
              onError == null ? void 0 : onError(response.error);
              return;
            }
            if (typeof response.id === "number") {
              resolve(response);
              return;
            }
            if (response.method !== "eth_subscription")
              return;
            onData(response.params);
          }
        }));
        return {
          subscriptionId,
          async unsubscribe() {
            return new Promise((resolve) => rpcClient.request({
              body: {
                method: "eth_unsubscribe",
                params: [subscriptionId]
              },
              onResponse: resolve
            }));
          }
        };
      }
    });
  };
}
class ProviderRpcError extends Error {
  constructor(code, message) {
    super(message);
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = code;
    this.details = message;
  }
}
const docsPath = "/docs/contract/decodeDeployData";
function decodeDeployData(parameters) {
  const { abi, bytecode, data } = parameters;
  if (data === bytecode)
    return { bytecode };
  const description = abi.find((x) => "type" in x && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath });
  const args = decodeAbiParameters(description.inputs, `0x${data.replace(bytecode, "")}`);
  return { args, bytecode };
}
function fromBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const length = blobs.reduce((length2, blob) => length2 + blob.length, 0);
  const data = createCursor(new Uint8Array(length));
  let active = true;
  for (const blob of blobs) {
    const cursor = createCursor(blob);
    while (active && cursor.position < blob.length) {
      cursor.incrementPosition(1);
      let consume = 31;
      if (blob.length - cursor.position < 31)
        consume = blob.length - cursor.position;
      for (const _ in Array.from({ length: consume })) {
        const byte = cursor.readByte();
        const isTerminator = byte === 128 && !cursor.inspectBytes(cursor.remaining).includes(128);
        if (isTerminator) {
          active = false;
          break;
        }
        data.pushByte(byte);
      }
    }
  }
  const trimmedData = data.bytes.slice(0, data.position);
  return to === "hex" ? bytesToHex(trimmedData) : trimmedData;
}
function sidecarsToVersionedHashes(parameters) {
  const { sidecars, version } = parameters;
  const to = parameters.to ?? (typeof sidecars[0].blob === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const { commitment } of sidecars) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version
    }));
  }
  return hashes;
}
const SLIP44_MSB = 2147483648;
function toCoinType(chainId) {
  if (chainId === 1)
    return 60n;
  if (chainId >= SLIP44_MSB || chainId < 0)
    throw new EnsInvalidChainIdError({ chainId });
  return BigInt((2147483648 | chainId) >>> 0);
}
function defineKzg({ blobToKzgCommitment, computeBlobKzgProof }) {
  return {
    blobToKzgCommitment,
    computeBlobKzgProof
  };
}
function setupKzg(parameters, path) {
  try {
    parameters.loadTrustedSetup(path);
  } catch (e) {
    const error = e;
    if (!error.message.includes("trusted setup is already loaded"))
      throw error;
  }
  return defineKzg(parameters);
}
function compactSignatureToSignature({ r, yParityAndS }) {
  const yParityAndS_bytes = hexToBytes(yParityAndS);
  const yParity = yParityAndS_bytes[0] & 128 ? 1 : 0;
  const s = yParityAndS_bytes;
  if (yParity === 1)
    s[0] &= 127;
  return { r, s: bytesToHex(s), yParity };
}
function parseCompactSignature(signatureHex) {
  const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
  return {
    r: numberToHex(r, { size: 32 }),
    yParityAndS: numberToHex(s, { size: 32 })
  };
}
async function recoverTransactionAddress(parameters) {
  const { serializedTransaction, signature: signature_ } = parameters;
  const transaction = parseTransaction(serializedTransaction);
  const signature = signature_ ?? {
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
    yParity: transaction.yParity
  };
  const serialized = serializeTransaction({
    ...transaction,
    r: void 0,
    s: void 0,
    v: void 0,
    yParity: void 0,
    sidecars: void 0
  });
  return await recoverAddress({
    hash: keccak256(serialized),
    signature
  });
}
function serializeCompactSignature({ r, yParityAndS }) {
  return `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(yParityAndS)).toCompactHex()}`;
}
function signatureToCompactSignature(signature) {
  const { r, s, v, yParity } = signature;
  const yParity_ = Number(yParity ?? v - 27n);
  let yParityAndS = s;
  if (yParity_ === 1) {
    const bytes = hexToBytes(s);
    bytes[0] |= 128;
    yParityAndS = bytesToHex(bytes);
  }
  return { r, yParityAndS };
}
const _esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbiConstructorNotFoundError,
  AbiConstructorParamsNotFoundError,
  AbiDecodingDataSizeInvalidError,
  AbiDecodingDataSizeTooSmallError,
  AbiDecodingZeroDataError,
  AbiEncodingArrayLengthMismatchError,
  AbiEncodingBytesSizeMismatchError,
  AbiEncodingLengthMismatchError,
  AbiErrorInputsNotFoundError,
  AbiErrorNotFoundError,
  AbiErrorSignatureNotFoundError,
  AbiEventNotFoundError,
  AbiEventSignatureEmptyTopicsError,
  AbiEventSignatureNotFoundError,
  AbiFunctionNotFoundError,
  AbiFunctionOutputsNotFoundError,
  AbiFunctionSignatureNotFoundError,
  AccountStateConflictError,
  AtomicReadyWalletRejectedUpgradeError,
  AtomicityNotSupportedError,
  BaseError,
  BaseFeeScalarError,
  BlockNotFoundError,
  BundleFailedError,
  BundleTooLargeError,
  BytesSizeMismatchError,
  CallExecutionError,
  ChainDisconnectedError,
  ChainDoesNotSupportContract,
  ChainMismatchError,
  ChainNotFoundError,
  CircularReferenceError,
  ClientChainNotConfiguredError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  CounterfactualDeploymentFailedError,
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
  DuplicateIdError,
  EIP1193ProviderRpcError: ProviderRpcError,
  Eip1559FeesNotSupportedError,
  EnsAvatarInvalidNftUriError,
  EnsAvatarUnsupportedNamespaceError,
  EnsAvatarUriResolutionError,
  EnsInvalidChainIdError,
  EstimateGasExecutionError,
  ExecutionRevertedError,
  FeeCapTooHighError,
  FeeCapTooLowError,
  FeeConflictError,
  FilterTypeNotSupportedError,
  HttpRequestError,
  InsufficientFundsError,
  IntegerOutOfRangeError,
  InternalRpcError,
  IntrinsicGasTooHighError,
  IntrinsicGasTooLowError,
  InvalidAbiDecodingTypeError,
  InvalidAbiEncodingTypeError,
  InvalidAbiItemError,
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiTypeParameterError,
  InvalidAddressError,
  InvalidArrayError,
  InvalidBytesBooleanError,
  InvalidChainIdError,
  InvalidDecimalNumberError,
  InvalidDefinitionTypeError,
  InvalidDomainError,
  InvalidFunctionModifierError,
  InvalidHexBooleanError,
  InvalidHexValueError,
  InvalidInputRpcError,
  InvalidLegacyVError,
  InvalidModifierError,
  InvalidParameterError,
  InvalidParamsRpcError,
  InvalidParenthesisError,
  InvalidPrimaryTypeError,
  InvalidRequestRpcError,
  InvalidSerializableTransactionError,
  InvalidSerializedTransactionError,
  InvalidSerializedTransactionTypeError,
  InvalidSignatureError,
  InvalidStorageKeySizeError,
  InvalidStructSignatureError,
  InvalidStructTypeError,
  JsonRpcVersionUnsupportedError,
  LimitExceededRpcError,
  MaxFeePerGasTooLowError,
  MethodNotFoundRpcError,
  MethodNotSupportedRpcError,
  NonceMaxValueError,
  NonceTooHighError,
  NonceTooLowError,
  ParseRpcError,
  ProviderDisconnectedError,
  ProviderRpcError: ProviderRpcError$1,
  RawContractError,
  ResourceNotFoundRpcError,
  ResourceUnavailableRpcError,
  RpcError,
  RpcRequestError,
  SizeExceedsPaddingSizeError,
  SizeOverflowError,
  SliceOffsetOutOfBoundsError,
  SocketClosedError,
  SolidityProtectedKeywordError,
  StateAssignmentConflictError,
  SwitchChainError,
  TimeoutError,
  TipAboveFeeCapError,
  TransactionExecutionError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  TransactionRejectedRpcError,
  TransactionTypeNotSupportedError,
  UnauthorizedProviderError,
  UnknownBundleIdError,
  UnknownNodeError,
  UnknownRpcError,
  UnknownSignatureError,
  UnknownTypeError,
  UnsupportedChainIdError,
  UnsupportedNonOptionalCapabilityError,
  UnsupportedPackedAbiType,
  UnsupportedProviderMethodError,
  UrlRequiredError,
  UserRejectedRequestError,
  WaitForCallsStatusTimeoutError,
  WaitForTransactionReceiptTimeoutError,
  WebSocketRequestError,
  assertCurrentChain,
  assertRequest,
  assertTransactionEIP1559,
  assertTransactionEIP2930,
  assertTransactionLegacy,
  blobsToCommitments,
  blobsToProofs,
  boolToBytes,
  boolToHex,
  bytesToBigInt,
  bytesToBool,
  bytesToHex,
  bytesToNumber,
  bytesToRlp,
  bytesToString,
  ccipFetch: ccipRequest,
  ccipRequest,
  checksumAddress,
  commitmentToVersionedHash,
  commitmentsToVersionedHashes,
  compactSignatureToHex: serializeCompactSignature,
  compactSignatureToSignature,
  concat,
  concatBytes,
  concatHex,
  createClient,
  createNonceManager,
  createPublicClient,
  createTestClient,
  createTransport,
  createWalletClient,
  custom,
  decodeAbiParameters,
  decodeDeployData,
  decodeErrorResult,
  decodeEventLog,
  decodeFunctionData,
  decodeFunctionResult,
  defineBlock,
  defineChain,
  defineKzg,
  defineTransaction,
  defineTransactionReceipt,
  defineTransactionRequest,
  deploylessCallViaBytecodeBytecode,
  deploylessCallViaFactoryBytecode,
  domainSeparator,
  encodeAbiParameters,
  encodeDeployData,
  encodeErrorResult,
  encodeEventTopics,
  encodeFunctionData,
  encodeFunctionResult,
  encodePacked,
  erc1155Abi,
  erc20Abi,
  erc20Abi_bytes32,
  erc4626Abi,
  erc6492SignatureValidatorAbi,
  erc6492SignatureValidatorByteCode,
  erc721Abi,
  ethAddress,
  etherUnits,
  extendSchema,
  extractChain,
  fallback,
  formatBlock,
  formatEther,
  formatGwei,
  formatLog,
  formatTransaction,
  formatTransactionReceipt,
  formatTransactionRequest,
  formatUnits,
  fromBlobs,
  fromBytes,
  fromHex,
  fromRlp,
  getAbiItem,
  getAddress,
  getChainContractAddress,
  getContract,
  getContractAddress,
  getContractError,
  getCreate2Address,
  getCreateAddress,
  getEventSelector: toEventSelector,
  getEventSignature: toSignature,
  getFunctionSelector: toFunctionSelector,
  getFunctionSignature: toSignature,
  getSerializedTransactionType,
  getTransactionType,
  getTypesForEIP712Domain,
  gweiUnits,
  hashDomain,
  hashMessage,
  hashStruct,
  hashTypedData,
  hexToBigInt,
  hexToBool,
  hexToBytes,
  hexToCompactSignature: parseCompactSignature,
  hexToNumber,
  hexToRlp,
  hexToSignature: parseSignature,
  hexToString,
  http,
  isAddress,
  isAddressEqual,
  isBytes,
  isErc6492Signature,
  isErc8010Signature,
  isHash,
  isHex,
  keccak256,
  labelhash,
  maxInt104,
  maxInt112,
  maxInt120,
  maxInt128,
  maxInt136,
  maxInt144,
  maxInt152,
  maxInt16,
  maxInt160,
  maxInt168,
  maxInt176,
  maxInt184,
  maxInt192,
  maxInt200,
  maxInt208,
  maxInt216,
  maxInt224,
  maxInt232,
  maxInt24,
  maxInt240,
  maxInt248,
  maxInt256,
  maxInt32,
  maxInt40,
  maxInt48,
  maxInt56,
  maxInt64,
  maxInt72,
  maxInt8,
  maxInt80,
  maxInt88,
  maxInt96,
  maxUint104,
  maxUint112,
  maxUint120,
  maxUint128,
  maxUint136,
  maxUint144,
  maxUint152,
  maxUint16,
  maxUint160,
  maxUint168,
  maxUint176,
  maxUint184,
  maxUint192,
  maxUint200,
  maxUint208,
  maxUint216,
  maxUint224,
  maxUint232,
  maxUint24,
  maxUint240,
  maxUint248,
  maxUint256,
  maxUint32,
  maxUint40,
  maxUint48,
  maxUint56,
  maxUint64,
  maxUint72,
  maxUint8,
  maxUint80,
  maxUint88,
  maxUint96,
  minInt104,
  minInt112,
  minInt120,
  minInt128,
  minInt136,
  minInt144,
  minInt152,
  minInt16,
  minInt160,
  minInt168,
  minInt176,
  minInt184,
  minInt192,
  minInt200,
  minInt208,
  minInt216,
  minInt224,
  minInt232,
  minInt24,
  minInt240,
  minInt248,
  minInt256,
  minInt32,
  minInt40,
  minInt48,
  minInt56,
  minInt64,
  minInt72,
  minInt8,
  minInt80,
  minInt88,
  minInt96,
  multicall3Abi,
  namehash,
  nonceManager,
  numberToBytes,
  numberToHex,
  offchainLookup,
  offchainLookupAbiItem,
  offchainLookupSignature,
  pad,
  padBytes,
  padHex,
  parseAbi,
  parseAbiItem,
  parseAbiParameter,
  parseAbiParameters,
  parseCompactSignature,
  parseErc6492Signature,
  parseErc8010Signature,
  parseEther,
  parseEventLogs,
  parseGwei,
  parseSignature,
  parseTransaction,
  parseUnits,
  prepareEncodeFunctionData,
  presignMessagePrefix,
  publicActions,
  recoverAddress,
  recoverMessageAddress,
  recoverPublicKey,
  recoverTransactionAddress,
  recoverTypedDataAddress,
  ripemd160,
  rpcSchema,
  rpcTransactionType,
  serializeAccessList,
  serializeCompactSignature,
  serializeErc6492Signature,
  serializeErc8010Signature,
  serializeSignature,
  serializeTransaction,
  serializeTypedData,
  setErrorConfig,
  setupKzg,
  sha256,
  shouldThrow,
  sidecarsToVersionedHashes,
  signatureToCompactSignature,
  signatureToHex: serializeSignature,
  size,
  slice,
  sliceBytes,
  sliceHex,
  stringToBytes,
  stringToHex,
  stringify,
  testActions,
  toBlobSidecars,
  toBlobs,
  toBytes,
  toCoinType,
  toEventHash: toSignatureHash,
  toEventSelector,
  toEventSignature: toSignature,
  toFunctionHash: toSignatureHash,
  toFunctionSelector,
  toFunctionSignature: toSignature,
  toHex,
  toPrefixedMessage,
  toRlp,
  transactionType,
  trim,
  universalSignatureValidatorAbi: erc6492SignatureValidatorAbi,
  universalSignatureValidatorByteCode: erc6492SignatureValidatorByteCode,
  validateTypedData,
  verifyHash,
  verifyMessage,
  verifyTypedData,
  walletActions,
  webSocket,
  weiUnits,
  withCache,
  withRetry,
  withTimeout,
  zeroAddress,
  zeroHash
}, Symbol.toStringTag, { value: "Module" }));
export {
  _esm as _
};
