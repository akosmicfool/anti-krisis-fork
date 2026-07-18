const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-D4HxNKwF.js","assets/index-DqUaPUte.js","assets/index-kPqGAi2-.css"])))=>i.map(i=>d[i]);
import { dJ as getAugmentedNamespace, jK as bases, dI as commonjsGlobal, jL as safeJsonParse, jM as safeJsonStringify, jN as cjs, jO as getWindowMetadata_1, jP as getDocument_1, jQ as getNavigator_1, jR as C$3, jS as detect, jT as getLocation_1, dL as getDefaultExportFromCjs, jU as IEvents, dK as eventsExports, jV as isWsUrl, jW as cjs$1, jX as isLocalhostUrl, jY as formatJsonRpcError, jZ as parseConnectionError, j_ as i$1, j$ as h$2, k0 as isJsonRpcError, k1 as formatJsonRpcRequest, k2 as r$2, k3 as getBigIntRpcId, k4 as o, k5 as isJsonRpcRequest, k6 as isJsonRpcResponse, k7 as formatJsonRpcResult, k8 as Gg, k9 as isJsonRpcResult, ka as payloadId, kb as f$4, aR as __vitePreload } from "./index-DqUaPUte.js";
var queryString = {};
var strictUriEncode = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (x3) => `%${x3.charCodeAt(0).toString(16).toUpperCase()}`);
var token = "%[a-f0-9]{2}";
var singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
var multiMatcher = new RegExp("(" + token + ")+", "gi");
function decodeComponents(components, split) {
  try {
    return [decodeURIComponent(components.join(""))];
  } catch (err) {
  }
  if (components.length === 1) {
    return components;
  }
  split = split || 1;
  var left = components.slice(0, split);
  var right = components.slice(split);
  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}
function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch (err) {
    var tokens = input.match(singleMatcher) || [];
    for (var i2 = 1; i2 < tokens.length; i2++) {
      input = decodeComponents(tokens, i2).join("");
      tokens = input.match(singleMatcher) || [];
    }
    return input;
  }
}
function customDecodeURIComponent(input) {
  var replaceMap = {
    "%FE%FF": "��",
    "%FF%FE": "��"
  };
  var match = multiMatcher.exec(input);
  while (match) {
    try {
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch (err) {
      var result = decode(match[0]);
      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }
    match = multiMatcher.exec(input);
  }
  replaceMap["%C2"] = "�";
  var entries = Object.keys(replaceMap);
  for (var i2 = 0; i2 < entries.length; i2++) {
    var key2 = entries[i2];
    input = input.replace(new RegExp(key2, "g"), replaceMap[key2]);
  }
  return input;
}
var decodeUriComponent = function(encodedURI) {
  if (typeof encodedURI !== "string") {
    throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
  }
  try {
    encodedURI = encodedURI.replace(/\+/g, " ");
    return decodeURIComponent(encodedURI);
  } catch (err) {
    return customDecodeURIComponent(encodedURI);
  }
};
var splitOnFirst = (string2, separator) => {
  if (!(typeof string2 === "string" && typeof separator === "string")) {
    throw new TypeError("Expected the arguments to be of type `string`");
  }
  if (separator === "") {
    return [string2];
  }
  const separatorIndex = string2.indexOf(separator);
  if (separatorIndex === -1) {
    return [string2];
  }
  return [
    string2.slice(0, separatorIndex),
    string2.slice(separatorIndex + separator.length)
  ];
};
var filterObj = function(obj, predicate) {
  var ret = {};
  var keys = Object.keys(obj);
  var isArr = Array.isArray(predicate);
  for (var i2 = 0; i2 < keys.length; i2++) {
    var key2 = keys[i2];
    var val = obj[key2];
    if (isArr ? predicate.indexOf(key2) !== -1 : predicate(key2, val, obj)) {
      ret[key2] = val;
    }
  }
  return ret;
};
(function(exports$1) {
  const strictUriEncode$1 = strictUriEncode;
  const decodeComponent = decodeUriComponent;
  const splitOnFirst$1 = splitOnFirst;
  const filterObject = filterObj;
  const isNullOrUndefined = (value) => value === null || value === void 0;
  const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
  function encoderForArrayFormat(options) {
    switch (options.arrayFormat) {
      case "index":
        return (key2) => (result, value) => {
          const index = result.length;
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [...result, [encode2(key2, options), "[", index, "]"].join("")];
          }
          return [
            ...result,
            [encode2(key2, options), "[", encode2(index, options), "]=", encode2(value, options)].join("")
          ];
        };
      case "bracket":
        return (key2) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [...result, [encode2(key2, options), "[]"].join("")];
          }
          return [...result, [encode2(key2, options), "[]=", encode2(value, options)].join("")];
        };
      case "colon-list-separator":
        return (key2) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [...result, [encode2(key2, options), ":list="].join("")];
          }
          return [...result, [encode2(key2, options), ":list=", encode2(value, options)].join("")];
        };
      case "comma":
      case "separator":
      case "bracket-separator": {
        const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
        return (key2) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          value = value === null ? "" : value;
          if (result.length === 0) {
            return [[encode2(key2, options), keyValueSep, encode2(value, options)].join("")];
          }
          return [[result, encode2(value, options)].join(options.arrayFormatSeparator)];
        };
      }
      default:
        return (key2) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [...result, encode2(key2, options)];
          }
          return [...result, [encode2(key2, options), "=", encode2(value, options)].join("")];
        };
    }
  }
  function parserForArrayFormat(options) {
    let result;
    switch (options.arrayFormat) {
      case "index":
        return (key2, value, accumulator) => {
          result = /\[(\d*)\]$/.exec(key2);
          key2 = key2.replace(/\[\d*\]$/, "");
          if (!result) {
            accumulator[key2] = value;
            return;
          }
          if (accumulator[key2] === void 0) {
            accumulator[key2] = {};
          }
          accumulator[key2][result[1]] = value;
        };
      case "bracket":
        return (key2, value, accumulator) => {
          result = /(\[\])$/.exec(key2);
          key2 = key2.replace(/\[\]$/, "");
          if (!result) {
            accumulator[key2] = value;
            return;
          }
          if (accumulator[key2] === void 0) {
            accumulator[key2] = [value];
            return;
          }
          accumulator[key2] = [].concat(accumulator[key2], value);
        };
      case "colon-list-separator":
        return (key2, value, accumulator) => {
          result = /(:list)$/.exec(key2);
          key2 = key2.replace(/:list$/, "");
          if (!result) {
            accumulator[key2] = value;
            return;
          }
          if (accumulator[key2] === void 0) {
            accumulator[key2] = [value];
            return;
          }
          accumulator[key2] = [].concat(accumulator[key2], value);
        };
      case "comma":
      case "separator":
        return (key2, value, accumulator) => {
          const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
          const isEncodedArray = typeof value === "string" && !isArray && decode2(value, options).includes(options.arrayFormatSeparator);
          value = isEncodedArray ? decode2(value, options) : value;
          const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode2(item, options)) : value === null ? value : decode2(value, options);
          accumulator[key2] = newValue;
        };
      case "bracket-separator":
        return (key2, value, accumulator) => {
          const isArray = /(\[\])$/.test(key2);
          key2 = key2.replace(/\[\]$/, "");
          if (!isArray) {
            accumulator[key2] = value ? decode2(value, options) : value;
            return;
          }
          const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode2(item, options));
          if (accumulator[key2] === void 0) {
            accumulator[key2] = arrayValue;
            return;
          }
          accumulator[key2] = [].concat(accumulator[key2], arrayValue);
        };
      default:
        return (key2, value, accumulator) => {
          if (accumulator[key2] === void 0) {
            accumulator[key2] = value;
            return;
          }
          accumulator[key2] = [].concat(accumulator[key2], value);
        };
    }
  }
  function validateArrayFormatSeparator(value) {
    if (typeof value !== "string" || value.length !== 1) {
      throw new TypeError("arrayFormatSeparator must be single character string");
    }
  }
  function encode2(value, options) {
    if (options.encode) {
      return options.strict ? strictUriEncode$1(value) : encodeURIComponent(value);
    }
    return value;
  }
  function decode2(value, options) {
    if (options.decode) {
      return decodeComponent(value);
    }
    return value;
  }
  function keysSorter(input) {
    if (Array.isArray(input)) {
      return input.sort();
    }
    if (typeof input === "object") {
      return keysSorter(Object.keys(input)).sort((a3, b2) => Number(a3) - Number(b2)).map((key2) => input[key2]);
    }
    return input;
  }
  function removeHash(input) {
    const hashStart = input.indexOf("#");
    if (hashStart !== -1) {
      input = input.slice(0, hashStart);
    }
    return input;
  }
  function getHash(url) {
    let hash3 = "";
    const hashStart = url.indexOf("#");
    if (hashStart !== -1) {
      hash3 = url.slice(hashStart);
    }
    return hash3;
  }
  function extract(input) {
    input = removeHash(input);
    const queryStart = input.indexOf("?");
    if (queryStart === -1) {
      return "";
    }
    return input.slice(queryStart + 1);
  }
  function parseValue(value, options) {
    if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
      value = Number(value);
    } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
      value = value.toLowerCase() === "true";
    }
    return value;
  }
  function parse(query, options) {
    options = Object.assign({
      decode: true,
      sort: true,
      arrayFormat: "none",
      arrayFormatSeparator: ",",
      parseNumbers: false,
      parseBooleans: false
    }, options);
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const formatter = parserForArrayFormat(options);
    const ret = /* @__PURE__ */ Object.create(null);
    if (typeof query !== "string") {
      return ret;
    }
    query = query.trim().replace(/^[?#&]/, "");
    if (!query) {
      return ret;
    }
    for (const param of query.split("&")) {
      if (param === "") {
        continue;
      }
      let [key2, value] = splitOnFirst$1(options.decode ? param.replace(/\+/g, " ") : param, "=");
      value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode2(value, options);
      formatter(decode2(key2, options), value, ret);
    }
    for (const key2 of Object.keys(ret)) {
      const value = ret[key2];
      if (typeof value === "object" && value !== null) {
        for (const k2 of Object.keys(value)) {
          value[k2] = parseValue(value[k2], options);
        }
      } else {
        ret[key2] = parseValue(value, options);
      }
    }
    if (options.sort === false) {
      return ret;
    }
    return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key2) => {
      const value = ret[key2];
      if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
        result[key2] = keysSorter(value);
      } else {
        result[key2] = value;
      }
      return result;
    }, /* @__PURE__ */ Object.create(null));
  }
  exports$1.extract = extract;
  exports$1.parse = parse;
  exports$1.stringify = (object, options) => {
    if (!object) {
      return "";
    }
    options = Object.assign({
      encode: true,
      strict: true,
      arrayFormat: "none",
      arrayFormatSeparator: ","
    }, options);
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const shouldFilter = (key2) => options.skipNull && isNullOrUndefined(object[key2]) || options.skipEmptyString && object[key2] === "";
    const formatter = encoderForArrayFormat(options);
    const objectCopy = {};
    for (const key2 of Object.keys(object)) {
      if (!shouldFilter(key2)) {
        objectCopy[key2] = object[key2];
      }
    }
    const keys = Object.keys(objectCopy);
    if (options.sort !== false) {
      keys.sort(options.sort);
    }
    return keys.map((key2) => {
      const value = object[key2];
      if (value === void 0) {
        return "";
      }
      if (value === null) {
        return encode2(key2, options);
      }
      if (Array.isArray(value)) {
        if (value.length === 0 && options.arrayFormat === "bracket-separator") {
          return encode2(key2, options) + "[]";
        }
        return value.reduce(formatter(key2), []).join("&");
      }
      return encode2(key2, options) + "=" + encode2(value, options);
    }).filter((x3) => x3.length > 0).join("&");
  };
  exports$1.parseUrl = (url, options) => {
    options = Object.assign({
      decode: true
    }, options);
    const [url_, hash3] = splitOnFirst$1(url, "#");
    return Object.assign(
      {
        url: url_.split("?")[0] || "",
        query: parse(extract(url), options)
      },
      options && options.parseFragmentIdentifier && hash3 ? { fragmentIdentifier: decode2(hash3, options) } : {}
    );
  };
  exports$1.stringifyUrl = (object, options) => {
    options = Object.assign({
      encode: true,
      strict: true,
      [encodeFragmentIdentifier]: true
    }, options);
    const url = removeHash(object.url).split("?")[0] || "";
    const queryFromUrl = exports$1.extract(object.url);
    const parsedQueryFromUrl = exports$1.parse(queryFromUrl, { sort: false });
    const query = Object.assign(parsedQueryFromUrl, object.query);
    let queryString2 = exports$1.stringify(query, options);
    if (queryString2) {
      queryString2 = `?${queryString2}`;
    }
    let hash3 = getHash(object.url);
    if (object.fragmentIdentifier) {
      hash3 = `#${options[encodeFragmentIdentifier] ? encode2(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
    }
    return `${url}${queryString2}${hash3}`;
  };
  exports$1.pick = (input, filter, options) => {
    options = Object.assign({
      parseFragmentIdentifier: true,
      [encodeFragmentIdentifier]: false
    }, options);
    const { url, query, fragmentIdentifier } = exports$1.parseUrl(input, options);
    return exports$1.stringifyUrl({
      url,
      query: filterObject(query, filter),
      fragmentIdentifier
    }, options);
  };
  exports$1.exclude = (input, filter, options) => {
    const exclusionFilter = Array.isArray(filter) ? (key2) => !filter.includes(key2) : (key2, value) => !filter(key2, value);
    return exports$1.pick(input, exclusionFilter, options);
  };
})(queryString);
var chacha20poly1305 = {};
var chacha = {};
var binary = {};
var int = {};
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  function imulShim(a3, b2) {
    var ah2 = a3 >>> 16 & 65535, al = a3 & 65535;
    var bh2 = b2 >>> 16 & 65535, bl = b2 & 65535;
    return al * bl + (ah2 * bl + al * bh2 << 16 >>> 0) | 0;
  }
  exports$1.mul = Math.imul || imulShim;
  function add5(a3, b2) {
    return a3 + b2 | 0;
  }
  exports$1.add = add5;
  function sub(a3, b2) {
    return a3 - b2 | 0;
  }
  exports$1.sub = sub;
  function rotl(x3, n2) {
    return x3 << n2 | x3 >>> 32 - n2;
  }
  exports$1.rotl = rotl;
  function rotr(x3, n2) {
    return x3 << 32 - n2 | x3 >>> n2;
  }
  exports$1.rotr = rotr;
  function isIntegerShim(n2) {
    return typeof n2 === "number" && isFinite(n2) && Math.floor(n2) === n2;
  }
  exports$1.isInteger = Number.isInteger || isIntegerShim;
  exports$1.MAX_SAFE_INTEGER = 9007199254740991;
  exports$1.isSafeInteger = function(n2) {
    return exports$1.isInteger(n2) && (n2 >= -exports$1.MAX_SAFE_INTEGER && n2 <= exports$1.MAX_SAFE_INTEGER);
  };
})(int);
Object.defineProperty(binary, "__esModule", { value: true });
var int_1 = int;
function readInt16BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
}
binary.readInt16BE = readInt16BE;
function readUint16BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
}
binary.readUint16BE = readUint16BE;
function readInt16LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
}
binary.readInt16LE = readInt16LE;
function readUint16LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset + 1] << 8 | array[offset]) >>> 0;
}
binary.readUint16LE = readUint16LE;
function writeUint16BE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(2);
  }
  if (offset === void 0) {
    offset = 0;
  }
  out[offset + 0] = value >>> 8;
  out[offset + 1] = value >>> 0;
  return out;
}
binary.writeUint16BE = writeUint16BE;
binary.writeInt16BE = writeUint16BE;
function writeUint16LE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(2);
  }
  if (offset === void 0) {
    offset = 0;
  }
  out[offset + 0] = value >>> 0;
  out[offset + 1] = value >>> 8;
  return out;
}
binary.writeUint16LE = writeUint16LE;
binary.writeInt16LE = writeUint16LE;
function readInt32BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
}
binary.readInt32BE = readInt32BE;
function readUint32BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
}
binary.readUint32BE = readUint32BE;
function readInt32LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
}
binary.readInt32LE = readInt32LE;
function readUint32LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
}
binary.readUint32LE = readUint32LE;
function writeUint32BE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(4);
  }
  if (offset === void 0) {
    offset = 0;
  }
  out[offset + 0] = value >>> 24;
  out[offset + 1] = value >>> 16;
  out[offset + 2] = value >>> 8;
  out[offset + 3] = value >>> 0;
  return out;
}
binary.writeUint32BE = writeUint32BE;
binary.writeInt32BE = writeUint32BE;
function writeUint32LE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(4);
  }
  if (offset === void 0) {
    offset = 0;
  }
  out[offset + 0] = value >>> 0;
  out[offset + 1] = value >>> 8;
  out[offset + 2] = value >>> 16;
  out[offset + 3] = value >>> 24;
  return out;
}
binary.writeUint32LE = writeUint32LE;
binary.writeInt32LE = writeUint32LE;
function readInt64BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var hi2 = readInt32BE(array, offset);
  var lo = readInt32BE(array, offset + 4);
  return hi2 * 4294967296 + lo - (lo >> 31) * 4294967296;
}
binary.readInt64BE = readInt64BE;
function readUint64BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var hi2 = readUint32BE(array, offset);
  var lo = readUint32BE(array, offset + 4);
  return hi2 * 4294967296 + lo;
}
binary.readUint64BE = readUint64BE;
function readInt64LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var lo = readInt32LE(array, offset);
  var hi2 = readInt32LE(array, offset + 4);
  return hi2 * 4294967296 + lo - (lo >> 31) * 4294967296;
}
binary.readInt64LE = readInt64LE;
function readUint64LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var lo = readUint32LE(array, offset);
  var hi2 = readUint32LE(array, offset + 4);
  return hi2 * 4294967296 + lo;
}
binary.readUint64LE = readUint64LE;
function writeUint64BE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  writeUint32BE(value / 4294967296 >>> 0, out, offset);
  writeUint32BE(value >>> 0, out, offset + 4);
  return out;
}
binary.writeUint64BE = writeUint64BE;
binary.writeInt64BE = writeUint64BE;
function writeUint64LE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  writeUint32LE(value >>> 0, out, offset);
  writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
  return out;
}
binary.writeUint64LE = writeUint64LE;
binary.writeInt64LE = writeUint64LE;
function readUintBE(bitLength, array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  if (bitLength % 8 !== 0) {
    throw new Error("readUintBE supports only bitLengths divisible by 8");
  }
  if (bitLength / 8 > array.length - offset) {
    throw new Error("readUintBE: array is too short for the given bitLength");
  }
  var result = 0;
  var mul5 = 1;
  for (var i2 = bitLength / 8 + offset - 1; i2 >= offset; i2--) {
    result += array[i2] * mul5;
    mul5 *= 256;
  }
  return result;
}
binary.readUintBE = readUintBE;
function readUintLE(bitLength, array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  if (bitLength % 8 !== 0) {
    throw new Error("readUintLE supports only bitLengths divisible by 8");
  }
  if (bitLength / 8 > array.length - offset) {
    throw new Error("readUintLE: array is too short for the given bitLength");
  }
  var result = 0;
  var mul5 = 1;
  for (var i2 = offset; i2 < offset + bitLength / 8; i2++) {
    result += array[i2] * mul5;
    mul5 *= 256;
  }
  return result;
}
binary.readUintLE = readUintLE;
function writeUintBE(bitLength, value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(bitLength / 8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  if (bitLength % 8 !== 0) {
    throw new Error("writeUintBE supports only bitLengths divisible by 8");
  }
  if (!int_1.isSafeInteger(value)) {
    throw new Error("writeUintBE value must be an integer");
  }
  var div = 1;
  for (var i2 = bitLength / 8 + offset - 1; i2 >= offset; i2--) {
    out[i2] = value / div & 255;
    div *= 256;
  }
  return out;
}
binary.writeUintBE = writeUintBE;
function writeUintLE(bitLength, value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(bitLength / 8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  if (bitLength % 8 !== 0) {
    throw new Error("writeUintLE supports only bitLengths divisible by 8");
  }
  if (!int_1.isSafeInteger(value)) {
    throw new Error("writeUintLE value must be an integer");
  }
  var div = 1;
  for (var i2 = offset; i2 < offset + bitLength / 8; i2++) {
    out[i2] = value / div & 255;
    div *= 256;
  }
  return out;
}
binary.writeUintLE = writeUintLE;
function readFloat32BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getFloat32(offset);
}
binary.readFloat32BE = readFloat32BE;
function readFloat32LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getFloat32(offset, true);
}
binary.readFloat32LE = readFloat32LE;
function readFloat64BE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getFloat64(offset);
}
binary.readFloat64BE = readFloat64BE;
function readFloat64LE(array, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getFloat64(offset, true);
}
binary.readFloat64LE = readFloat64LE;
function writeFloat32BE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(4);
  }
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
  view.setFloat32(offset, value);
  return out;
}
binary.writeFloat32BE = writeFloat32BE;
function writeFloat32LE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(4);
  }
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
  view.setFloat32(offset, value, true);
  return out;
}
binary.writeFloat32LE = writeFloat32LE;
function writeFloat64BE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
  view.setFloat64(offset, value);
  return out;
}
binary.writeFloat64BE = writeFloat64BE;
function writeFloat64LE(value, out, offset) {
  if (out === void 0) {
    out = new Uint8Array(8);
  }
  if (offset === void 0) {
    offset = 0;
  }
  var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
  view.setFloat64(offset, value, true);
  return out;
}
binary.writeFloat64LE = writeFloat64LE;
var wipe$1 = {};
Object.defineProperty(wipe$1, "__esModule", { value: true });
function wipe(array) {
  for (var i2 = 0; i2 < array.length; i2++) {
    array[i2] = 0;
  }
  return array;
}
wipe$1.wipe = wipe;
Object.defineProperty(chacha, "__esModule", { value: true });
var binary_1 = binary;
var wipe_1$3 = wipe$1;
var ROUNDS = 20;
function core(out, input, key2) {
  var j02 = 1634760805;
  var j1 = 857760878;
  var j2 = 2036477234;
  var j3 = 1797285236;
  var j4 = key2[3] << 24 | key2[2] << 16 | key2[1] << 8 | key2[0];
  var j5 = key2[7] << 24 | key2[6] << 16 | key2[5] << 8 | key2[4];
  var j6 = key2[11] << 24 | key2[10] << 16 | key2[9] << 8 | key2[8];
  var j7 = key2[15] << 24 | key2[14] << 16 | key2[13] << 8 | key2[12];
  var j8 = key2[19] << 24 | key2[18] << 16 | key2[17] << 8 | key2[16];
  var j9 = key2[23] << 24 | key2[22] << 16 | key2[21] << 8 | key2[20];
  var j10 = key2[27] << 24 | key2[26] << 16 | key2[25] << 8 | key2[24];
  var j11 = key2[31] << 24 | key2[30] << 16 | key2[29] << 8 | key2[28];
  var j12 = input[3] << 24 | input[2] << 16 | input[1] << 8 | input[0];
  var j13 = input[7] << 24 | input[6] << 16 | input[5] << 8 | input[4];
  var j14 = input[11] << 24 | input[10] << 16 | input[9] << 8 | input[8];
  var j15 = input[15] << 24 | input[14] << 16 | input[13] << 8 | input[12];
  var x02 = j02;
  var x1 = j1;
  var x22 = j2;
  var x3 = j3;
  var x4 = j4;
  var x5 = j5;
  var x6 = j6;
  var x7 = j7;
  var x8 = j8;
  var x9 = j9;
  var x10 = j10;
  var x11 = j11;
  var x12 = j12;
  var x13 = j13;
  var x14 = j14;
  var x15 = j15;
  for (var i2 = 0; i2 < ROUNDS; i2 += 2) {
    x02 = x02 + x4 | 0;
    x12 ^= x02;
    x12 = x12 >>> 32 - 16 | x12 << 16;
    x8 = x8 + x12 | 0;
    x4 ^= x8;
    x4 = x4 >>> 32 - 12 | x4 << 12;
    x1 = x1 + x5 | 0;
    x13 ^= x1;
    x13 = x13 >>> 32 - 16 | x13 << 16;
    x9 = x9 + x13 | 0;
    x5 ^= x9;
    x5 = x5 >>> 32 - 12 | x5 << 12;
    x22 = x22 + x6 | 0;
    x14 ^= x22;
    x14 = x14 >>> 32 - 16 | x14 << 16;
    x10 = x10 + x14 | 0;
    x6 ^= x10;
    x6 = x6 >>> 32 - 12 | x6 << 12;
    x3 = x3 + x7 | 0;
    x15 ^= x3;
    x15 = x15 >>> 32 - 16 | x15 << 16;
    x11 = x11 + x15 | 0;
    x7 ^= x11;
    x7 = x7 >>> 32 - 12 | x7 << 12;
    x22 = x22 + x6 | 0;
    x14 ^= x22;
    x14 = x14 >>> 32 - 8 | x14 << 8;
    x10 = x10 + x14 | 0;
    x6 ^= x10;
    x6 = x6 >>> 32 - 7 | x6 << 7;
    x3 = x3 + x7 | 0;
    x15 ^= x3;
    x15 = x15 >>> 32 - 8 | x15 << 8;
    x11 = x11 + x15 | 0;
    x7 ^= x11;
    x7 = x7 >>> 32 - 7 | x7 << 7;
    x1 = x1 + x5 | 0;
    x13 ^= x1;
    x13 = x13 >>> 32 - 8 | x13 << 8;
    x9 = x9 + x13 | 0;
    x5 ^= x9;
    x5 = x5 >>> 32 - 7 | x5 << 7;
    x02 = x02 + x4 | 0;
    x12 ^= x02;
    x12 = x12 >>> 32 - 8 | x12 << 8;
    x8 = x8 + x12 | 0;
    x4 ^= x8;
    x4 = x4 >>> 32 - 7 | x4 << 7;
    x02 = x02 + x5 | 0;
    x15 ^= x02;
    x15 = x15 >>> 32 - 16 | x15 << 16;
    x10 = x10 + x15 | 0;
    x5 ^= x10;
    x5 = x5 >>> 32 - 12 | x5 << 12;
    x1 = x1 + x6 | 0;
    x12 ^= x1;
    x12 = x12 >>> 32 - 16 | x12 << 16;
    x11 = x11 + x12 | 0;
    x6 ^= x11;
    x6 = x6 >>> 32 - 12 | x6 << 12;
    x22 = x22 + x7 | 0;
    x13 ^= x22;
    x13 = x13 >>> 32 - 16 | x13 << 16;
    x8 = x8 + x13 | 0;
    x7 ^= x8;
    x7 = x7 >>> 32 - 12 | x7 << 12;
    x3 = x3 + x4 | 0;
    x14 ^= x3;
    x14 = x14 >>> 32 - 16 | x14 << 16;
    x9 = x9 + x14 | 0;
    x4 ^= x9;
    x4 = x4 >>> 32 - 12 | x4 << 12;
    x22 = x22 + x7 | 0;
    x13 ^= x22;
    x13 = x13 >>> 32 - 8 | x13 << 8;
    x8 = x8 + x13 | 0;
    x7 ^= x8;
    x7 = x7 >>> 32 - 7 | x7 << 7;
    x3 = x3 + x4 | 0;
    x14 ^= x3;
    x14 = x14 >>> 32 - 8 | x14 << 8;
    x9 = x9 + x14 | 0;
    x4 ^= x9;
    x4 = x4 >>> 32 - 7 | x4 << 7;
    x1 = x1 + x6 | 0;
    x12 ^= x1;
    x12 = x12 >>> 32 - 8 | x12 << 8;
    x11 = x11 + x12 | 0;
    x6 ^= x11;
    x6 = x6 >>> 32 - 7 | x6 << 7;
    x02 = x02 + x5 | 0;
    x15 ^= x02;
    x15 = x15 >>> 32 - 8 | x15 << 8;
    x10 = x10 + x15 | 0;
    x5 ^= x10;
    x5 = x5 >>> 32 - 7 | x5 << 7;
  }
  binary_1.writeUint32LE(x02 + j02 | 0, out, 0);
  binary_1.writeUint32LE(x1 + j1 | 0, out, 4);
  binary_1.writeUint32LE(x22 + j2 | 0, out, 8);
  binary_1.writeUint32LE(x3 + j3 | 0, out, 12);
  binary_1.writeUint32LE(x4 + j4 | 0, out, 16);
  binary_1.writeUint32LE(x5 + j5 | 0, out, 20);
  binary_1.writeUint32LE(x6 + j6 | 0, out, 24);
  binary_1.writeUint32LE(x7 + j7 | 0, out, 28);
  binary_1.writeUint32LE(x8 + j8 | 0, out, 32);
  binary_1.writeUint32LE(x9 + j9 | 0, out, 36);
  binary_1.writeUint32LE(x10 + j10 | 0, out, 40);
  binary_1.writeUint32LE(x11 + j11 | 0, out, 44);
  binary_1.writeUint32LE(x12 + j12 | 0, out, 48);
  binary_1.writeUint32LE(x13 + j13 | 0, out, 52);
  binary_1.writeUint32LE(x14 + j14 | 0, out, 56);
  binary_1.writeUint32LE(x15 + j15 | 0, out, 60);
}
function streamXOR(key2, nonce, src, dst, nonceInplaceCounterLength) {
  if (nonceInplaceCounterLength === void 0) {
    nonceInplaceCounterLength = 0;
  }
  if (key2.length !== 32) {
    throw new Error("ChaCha: key size must be 32 bytes");
  }
  if (dst.length < src.length) {
    throw new Error("ChaCha: destination is shorter than source");
  }
  var nc;
  var counterLength;
  if (nonceInplaceCounterLength === 0) {
    if (nonce.length !== 8 && nonce.length !== 12) {
      throw new Error("ChaCha nonce must be 8 or 12 bytes");
    }
    nc = new Uint8Array(16);
    counterLength = nc.length - nonce.length;
    nc.set(nonce, counterLength);
  } else {
    if (nonce.length !== 16) {
      throw new Error("ChaCha nonce with counter must be 16 bytes");
    }
    nc = nonce;
    counterLength = nonceInplaceCounterLength;
  }
  var block = new Uint8Array(64);
  for (var i2 = 0; i2 < src.length; i2 += 64) {
    core(block, nc, key2);
    for (var j2 = i2; j2 < i2 + 64 && j2 < src.length; j2++) {
      dst[j2] = src[j2] ^ block[j2 - i2];
    }
    incrementCounter(nc, 0, counterLength);
  }
  wipe_1$3.wipe(block);
  if (nonceInplaceCounterLength === 0) {
    wipe_1$3.wipe(nc);
  }
  return dst;
}
chacha.streamXOR = streamXOR;
function stream(key2, nonce, dst, nonceInplaceCounterLength) {
  if (nonceInplaceCounterLength === void 0) {
    nonceInplaceCounterLength = 0;
  }
  wipe_1$3.wipe(dst);
  return streamXOR(key2, nonce, dst, dst, nonceInplaceCounterLength);
}
chacha.stream = stream;
function incrementCounter(counter, pos, len) {
  var carry = 1;
  while (len--) {
    carry = carry + (counter[pos] & 255) | 0;
    counter[pos] = carry & 255;
    carry >>>= 8;
    pos++;
  }
  if (carry > 0) {
    throw new Error("ChaCha: counter overflow");
  }
}
var poly1305 = {};
var constantTime = {};
Object.defineProperty(constantTime, "__esModule", { value: true });
function select(subject, resultIfOne, resultIfZero) {
  return ~(subject - 1) & resultIfOne | subject - 1 & resultIfZero;
}
constantTime.select = select;
function lessOrEqual(a3, b2) {
  return (a3 | 0) - (b2 | 0) - 1 >>> 31 & 1;
}
constantTime.lessOrEqual = lessOrEqual;
function compare(a3, b2) {
  if (a3.length !== b2.length) {
    return 0;
  }
  var result = 0;
  for (var i2 = 0; i2 < a3.length; i2++) {
    result |= a3[i2] ^ b2[i2];
  }
  return 1 & result - 1 >>> 8;
}
constantTime.compare = compare;
function equal(a3, b2) {
  if (a3.length === 0 || b2.length === 0) {
    return false;
  }
  return compare(a3, b2) !== 0;
}
constantTime.equal = equal;
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  var constant_time_12 = constantTime;
  var wipe_12 = wipe$1;
  exports$1.DIGEST_LENGTH = 16;
  var Poly1305 = (
    /** @class */
    function() {
      function Poly13052(key2) {
        this.digestLength = exports$1.DIGEST_LENGTH;
        this._buffer = new Uint8Array(16);
        this._r = new Uint16Array(10);
        this._h = new Uint16Array(10);
        this._pad = new Uint16Array(8);
        this._leftover = 0;
        this._fin = 0;
        this._finished = false;
        var t02 = key2[0] | key2[1] << 8;
        this._r[0] = t02 & 8191;
        var t1 = key2[2] | key2[3] << 8;
        this._r[1] = (t02 >>> 13 | t1 << 3) & 8191;
        var t2 = key2[4] | key2[5] << 8;
        this._r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        var t3 = key2[6] | key2[7] << 8;
        this._r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        var t4 = key2[8] | key2[9] << 8;
        this._r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this._r[5] = t4 >>> 1 & 8190;
        var t5 = key2[10] | key2[11] << 8;
        this._r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        var t6 = key2[12] | key2[13] << 8;
        this._r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        var t7 = key2[14] | key2[15] << 8;
        this._r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this._r[9] = t7 >>> 5 & 127;
        this._pad[0] = key2[16] | key2[17] << 8;
        this._pad[1] = key2[18] | key2[19] << 8;
        this._pad[2] = key2[20] | key2[21] << 8;
        this._pad[3] = key2[22] | key2[23] << 8;
        this._pad[4] = key2[24] | key2[25] << 8;
        this._pad[5] = key2[26] | key2[27] << 8;
        this._pad[6] = key2[28] | key2[29] << 8;
        this._pad[7] = key2[30] | key2[31] << 8;
      }
      Poly13052.prototype._blocks = function(m3, mpos, bytes) {
        var hibit = this._fin ? 0 : 1 << 11;
        var h02 = this._h[0], h1 = this._h[1], h22 = this._h[2], h3 = this._h[3], h4 = this._h[4], h5 = this._h[5], h6 = this._h[6], h7 = this._h[7], h8 = this._h[8], h9 = this._h[9];
        var r02 = this._r[0], r1 = this._r[1], r2 = this._r[2], r3 = this._r[3], r4 = this._r[4], r5 = this._r[5], r6 = this._r[6], r7 = this._r[7], r8 = this._r[8], r9 = this._r[9];
        while (bytes >= 16) {
          var t02 = m3[mpos + 0] | m3[mpos + 1] << 8;
          h02 += t02 & 8191;
          var t1 = m3[mpos + 2] | m3[mpos + 3] << 8;
          h1 += (t02 >>> 13 | t1 << 3) & 8191;
          var t2 = m3[mpos + 4] | m3[mpos + 5] << 8;
          h22 += (t1 >>> 10 | t2 << 6) & 8191;
          var t3 = m3[mpos + 6] | m3[mpos + 7] << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          var t4 = m3[mpos + 8] | m3[mpos + 9] << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          var t5 = m3[mpos + 10] | m3[mpos + 11] << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          var t6 = m3[mpos + 12] | m3[mpos + 13] << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          var t7 = m3[mpos + 14] | m3[mpos + 15] << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          var c2 = 0;
          var d02 = c2;
          d02 += h02 * r02;
          d02 += h1 * (5 * r9);
          d02 += h22 * (5 * r8);
          d02 += h3 * (5 * r7);
          d02 += h4 * (5 * r6);
          c2 = d02 >>> 13;
          d02 &= 8191;
          d02 += h5 * (5 * r5);
          d02 += h6 * (5 * r4);
          d02 += h7 * (5 * r3);
          d02 += h8 * (5 * r2);
          d02 += h9 * (5 * r1);
          c2 += d02 >>> 13;
          d02 &= 8191;
          var d1 = c2;
          d1 += h02 * r1;
          d1 += h1 * r02;
          d1 += h22 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c2 = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c2 += d1 >>> 13;
          d1 &= 8191;
          var d22 = c2;
          d22 += h02 * r2;
          d22 += h1 * r1;
          d22 += h22 * r02;
          d22 += h3 * (5 * r9);
          d22 += h4 * (5 * r8);
          c2 = d22 >>> 13;
          d22 &= 8191;
          d22 += h5 * (5 * r7);
          d22 += h6 * (5 * r6);
          d22 += h7 * (5 * r5);
          d22 += h8 * (5 * r4);
          d22 += h9 * (5 * r3);
          c2 += d22 >>> 13;
          d22 &= 8191;
          var d3 = c2;
          d3 += h02 * r3;
          d3 += h1 * r2;
          d3 += h22 * r1;
          d3 += h3 * r02;
          d3 += h4 * (5 * r9);
          c2 = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c2 += d3 >>> 13;
          d3 &= 8191;
          var d4 = c2;
          d4 += h02 * r4;
          d4 += h1 * r3;
          d4 += h22 * r2;
          d4 += h3 * r1;
          d4 += h4 * r02;
          c2 = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c2 += d4 >>> 13;
          d4 &= 8191;
          var d5 = c2;
          d5 += h02 * r5;
          d5 += h1 * r4;
          d5 += h22 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c2 = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r02;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c2 += d5 >>> 13;
          d5 &= 8191;
          var d6 = c2;
          d6 += h02 * r6;
          d6 += h1 * r5;
          d6 += h22 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c2 = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r02;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c2 += d6 >>> 13;
          d6 &= 8191;
          var d7 = c2;
          d7 += h02 * r7;
          d7 += h1 * r6;
          d7 += h22 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c2 = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r02;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c2 += d7 >>> 13;
          d7 &= 8191;
          var d8 = c2;
          d8 += h02 * r8;
          d8 += h1 * r7;
          d8 += h22 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c2 = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r02;
          d8 += h9 * (5 * r9);
          c2 += d8 >>> 13;
          d8 &= 8191;
          var d9 = c2;
          d9 += h02 * r9;
          d9 += h1 * r8;
          d9 += h22 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c2 = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r02;
          c2 += d9 >>> 13;
          d9 &= 8191;
          c2 = (c2 << 2) + c2 | 0;
          c2 = c2 + d02 | 0;
          d02 = c2 & 8191;
          c2 = c2 >>> 13;
          d1 += c2;
          h02 = d02;
          h1 = d1;
          h22 = d22;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this._h[0] = h02;
        this._h[1] = h1;
        this._h[2] = h22;
        this._h[3] = h3;
        this._h[4] = h4;
        this._h[5] = h5;
        this._h[6] = h6;
        this._h[7] = h7;
        this._h[8] = h8;
        this._h[9] = h9;
      };
      Poly13052.prototype.finish = function(mac, macpos) {
        if (macpos === void 0) {
          macpos = 0;
        }
        var g3 = new Uint16Array(10);
        var c2;
        var mask;
        var f3;
        var i2;
        if (this._leftover) {
          i2 = this._leftover;
          this._buffer[i2++] = 1;
          for (; i2 < 16; i2++) {
            this._buffer[i2] = 0;
          }
          this._fin = 1;
          this._blocks(this._buffer, 0, 16);
        }
        c2 = this._h[1] >>> 13;
        this._h[1] &= 8191;
        for (i2 = 2; i2 < 10; i2++) {
          this._h[i2] += c2;
          c2 = this._h[i2] >>> 13;
          this._h[i2] &= 8191;
        }
        this._h[0] += c2 * 5;
        c2 = this._h[0] >>> 13;
        this._h[0] &= 8191;
        this._h[1] += c2;
        c2 = this._h[1] >>> 13;
        this._h[1] &= 8191;
        this._h[2] += c2;
        g3[0] = this._h[0] + 5;
        c2 = g3[0] >>> 13;
        g3[0] &= 8191;
        for (i2 = 1; i2 < 10; i2++) {
          g3[i2] = this._h[i2] + c2;
          c2 = g3[i2] >>> 13;
          g3[i2] &= 8191;
        }
        g3[9] -= 1 << 13;
        mask = (c2 ^ 1) - 1;
        for (i2 = 0; i2 < 10; i2++) {
          g3[i2] &= mask;
        }
        mask = ~mask;
        for (i2 = 0; i2 < 10; i2++) {
          this._h[i2] = this._h[i2] & mask | g3[i2];
        }
        this._h[0] = (this._h[0] | this._h[1] << 13) & 65535;
        this._h[1] = (this._h[1] >>> 3 | this._h[2] << 10) & 65535;
        this._h[2] = (this._h[2] >>> 6 | this._h[3] << 7) & 65535;
        this._h[3] = (this._h[3] >>> 9 | this._h[4] << 4) & 65535;
        this._h[4] = (this._h[4] >>> 12 | this._h[5] << 1 | this._h[6] << 14) & 65535;
        this._h[5] = (this._h[6] >>> 2 | this._h[7] << 11) & 65535;
        this._h[6] = (this._h[7] >>> 5 | this._h[8] << 8) & 65535;
        this._h[7] = (this._h[8] >>> 8 | this._h[9] << 5) & 65535;
        f3 = this._h[0] + this._pad[0];
        this._h[0] = f3 & 65535;
        for (i2 = 1; i2 < 8; i2++) {
          f3 = (this._h[i2] + this._pad[i2] | 0) + (f3 >>> 16) | 0;
          this._h[i2] = f3 & 65535;
        }
        mac[macpos + 0] = this._h[0] >>> 0;
        mac[macpos + 1] = this._h[0] >>> 8;
        mac[macpos + 2] = this._h[1] >>> 0;
        mac[macpos + 3] = this._h[1] >>> 8;
        mac[macpos + 4] = this._h[2] >>> 0;
        mac[macpos + 5] = this._h[2] >>> 8;
        mac[macpos + 6] = this._h[3] >>> 0;
        mac[macpos + 7] = this._h[3] >>> 8;
        mac[macpos + 8] = this._h[4] >>> 0;
        mac[macpos + 9] = this._h[4] >>> 8;
        mac[macpos + 10] = this._h[5] >>> 0;
        mac[macpos + 11] = this._h[5] >>> 8;
        mac[macpos + 12] = this._h[6] >>> 0;
        mac[macpos + 13] = this._h[6] >>> 8;
        mac[macpos + 14] = this._h[7] >>> 0;
        mac[macpos + 15] = this._h[7] >>> 8;
        this._finished = true;
        return this;
      };
      Poly13052.prototype.update = function(m3) {
        var mpos = 0;
        var bytes = m3.length;
        var want;
        if (this._leftover) {
          want = 16 - this._leftover;
          if (want > bytes) {
            want = bytes;
          }
          for (var i2 = 0; i2 < want; i2++) {
            this._buffer[this._leftover + i2] = m3[mpos + i2];
          }
          bytes -= want;
          mpos += want;
          this._leftover += want;
          if (this._leftover < 16) {
            return this;
          }
          this._blocks(this._buffer, 0, 16);
          this._leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this._blocks(m3, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (var i2 = 0; i2 < bytes; i2++) {
            this._buffer[this._leftover + i2] = m3[mpos + i2];
          }
          this._leftover += bytes;
        }
        return this;
      };
      Poly13052.prototype.digest = function() {
        if (this._finished) {
          throw new Error("Poly1305 was finished");
        }
        var mac = new Uint8Array(16);
        this.finish(mac);
        return mac;
      };
      Poly13052.prototype.clean = function() {
        wipe_12.wipe(this._buffer);
        wipe_12.wipe(this._r);
        wipe_12.wipe(this._h);
        wipe_12.wipe(this._pad);
        this._leftover = 0;
        this._fin = 0;
        this._finished = true;
        return this;
      };
      return Poly13052;
    }()
  );
  exports$1.Poly1305 = Poly1305;
  function oneTimeAuth(key2, data) {
    var h3 = new Poly1305(key2);
    h3.update(data);
    var digest9 = h3.digest();
    h3.clean();
    return digest9;
  }
  exports$1.oneTimeAuth = oneTimeAuth;
  function equal2(a3, b2) {
    if (a3.length !== exports$1.DIGEST_LENGTH || b2.length !== exports$1.DIGEST_LENGTH) {
      return false;
    }
    return constant_time_12.equal(a3, b2);
  }
  exports$1.equal = equal2;
})(poly1305);
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  var chacha_1 = chacha;
  var poly1305_1 = poly1305;
  var wipe_12 = wipe$1;
  var binary_12 = binary;
  var constant_time_12 = constantTime;
  exports$1.KEY_LENGTH = 32;
  exports$1.NONCE_LENGTH = 12;
  exports$1.TAG_LENGTH = 16;
  var ZEROS = new Uint8Array(16);
  var ChaCha20Poly1305 = (
    /** @class */
    function() {
      function ChaCha20Poly13052(key2) {
        this.nonceLength = exports$1.NONCE_LENGTH;
        this.tagLength = exports$1.TAG_LENGTH;
        if (key2.length !== exports$1.KEY_LENGTH) {
          throw new Error("ChaCha20Poly1305 needs 32-byte key");
        }
        this._key = new Uint8Array(key2);
      }
      ChaCha20Poly13052.prototype.seal = function(nonce, plaintext, associatedData, dst) {
        if (nonce.length > 16) {
          throw new Error("ChaCha20Poly1305: incorrect nonce length");
        }
        var counter = new Uint8Array(16);
        counter.set(nonce, counter.length - nonce.length);
        var authKey = new Uint8Array(32);
        chacha_1.stream(this._key, counter, authKey, 4);
        var resultLength = plaintext.length + this.tagLength;
        var result;
        if (dst) {
          if (dst.length !== resultLength) {
            throw new Error("ChaCha20Poly1305: incorrect destination length");
          }
          result = dst;
        } else {
          result = new Uint8Array(resultLength);
        }
        chacha_1.streamXOR(this._key, counter, plaintext, result, 4);
        this._authenticate(result.subarray(result.length - this.tagLength, result.length), authKey, result.subarray(0, result.length - this.tagLength), associatedData);
        wipe_12.wipe(counter);
        return result;
      };
      ChaCha20Poly13052.prototype.open = function(nonce, sealed, associatedData, dst) {
        if (nonce.length > 16) {
          throw new Error("ChaCha20Poly1305: incorrect nonce length");
        }
        if (sealed.length < this.tagLength) {
          return null;
        }
        var counter = new Uint8Array(16);
        counter.set(nonce, counter.length - nonce.length);
        var authKey = new Uint8Array(32);
        chacha_1.stream(this._key, counter, authKey, 4);
        var calculatedTag = new Uint8Array(this.tagLength);
        this._authenticate(calculatedTag, authKey, sealed.subarray(0, sealed.length - this.tagLength), associatedData);
        if (!constant_time_12.equal(calculatedTag, sealed.subarray(sealed.length - this.tagLength, sealed.length))) {
          return null;
        }
        var resultLength = sealed.length - this.tagLength;
        var result;
        if (dst) {
          if (dst.length !== resultLength) {
            throw new Error("ChaCha20Poly1305: incorrect destination length");
          }
          result = dst;
        } else {
          result = new Uint8Array(resultLength);
        }
        chacha_1.streamXOR(this._key, counter, sealed.subarray(0, sealed.length - this.tagLength), result, 4);
        wipe_12.wipe(counter);
        return result;
      };
      ChaCha20Poly13052.prototype.clean = function() {
        wipe_12.wipe(this._key);
        return this;
      };
      ChaCha20Poly13052.prototype._authenticate = function(tagOut, authKey, ciphertext, associatedData) {
        var h3 = new poly1305_1.Poly1305(authKey);
        if (associatedData) {
          h3.update(associatedData);
          if (associatedData.length % 16 > 0) {
            h3.update(ZEROS.subarray(associatedData.length % 16));
          }
        }
        h3.update(ciphertext);
        if (ciphertext.length % 16 > 0) {
          h3.update(ZEROS.subarray(ciphertext.length % 16));
        }
        var length = new Uint8Array(8);
        if (associatedData) {
          binary_12.writeUint64LE(associatedData.length, length);
        }
        h3.update(length);
        binary_12.writeUint64LE(ciphertext.length, length);
        h3.update(length);
        var tag = h3.digest();
        for (var i2 = 0; i2 < tag.length; i2++) {
          tagOut[i2] = tag[i2];
        }
        h3.clean();
        wipe_12.wipe(tag);
        wipe_12.wipe(length);
      };
      return ChaCha20Poly13052;
    }()
  );
  exports$1.ChaCha20Poly1305 = ChaCha20Poly1305;
})(chacha20poly1305);
var hkdf = {};
var hmac$2 = {};
var hash$3 = {};
Object.defineProperty(hash$3, "__esModule", { value: true });
function isSerializableHash(h3) {
  return typeof h3.saveState !== "undefined" && typeof h3.restoreState !== "undefined" && typeof h3.cleanSavedState !== "undefined";
}
hash$3.isSerializableHash = isSerializableHash;
Object.defineProperty(hmac$2, "__esModule", { value: true });
var hash_1 = hash$3;
var constant_time_1 = constantTime;
var wipe_1$2 = wipe$1;
var HMAC = (
  /** @class */
  function() {
    function HMAC2(hash3, key2) {
      this._finished = false;
      this._inner = new hash3();
      this._outer = new hash3();
      this.blockSize = this._outer.blockSize;
      this.digestLength = this._outer.digestLength;
      var pad2 = new Uint8Array(this.blockSize);
      if (key2.length > this.blockSize) {
        this._inner.update(key2).finish(pad2).clean();
      } else {
        pad2.set(key2);
      }
      for (var i2 = 0; i2 < pad2.length; i2++) {
        pad2[i2] ^= 54;
      }
      this._inner.update(pad2);
      for (var i2 = 0; i2 < pad2.length; i2++) {
        pad2[i2] ^= 54 ^ 92;
      }
      this._outer.update(pad2);
      if (hash_1.isSerializableHash(this._inner) && hash_1.isSerializableHash(this._outer)) {
        this._innerKeyedState = this._inner.saveState();
        this._outerKeyedState = this._outer.saveState();
      }
      wipe_1$2.wipe(pad2);
    }
    HMAC2.prototype.reset = function() {
      if (!hash_1.isSerializableHash(this._inner) || !hash_1.isSerializableHash(this._outer)) {
        throw new Error("hmac: can't reset() because hash doesn't implement restoreState()");
      }
      this._inner.restoreState(this._innerKeyedState);
      this._outer.restoreState(this._outerKeyedState);
      this._finished = false;
      return this;
    };
    HMAC2.prototype.clean = function() {
      if (hash_1.isSerializableHash(this._inner)) {
        this._inner.cleanSavedState(this._innerKeyedState);
      }
      if (hash_1.isSerializableHash(this._outer)) {
        this._outer.cleanSavedState(this._outerKeyedState);
      }
      this._inner.clean();
      this._outer.clean();
    };
    HMAC2.prototype.update = function(data) {
      this._inner.update(data);
      return this;
    };
    HMAC2.prototype.finish = function(out) {
      if (this._finished) {
        this._outer.finish(out);
        return this;
      }
      this._inner.finish(out);
      this._outer.update(out.subarray(0, this.digestLength)).finish(out);
      this._finished = true;
      return this;
    };
    HMAC2.prototype.digest = function() {
      var out = new Uint8Array(this.digestLength);
      this.finish(out);
      return out;
    };
    HMAC2.prototype.saveState = function() {
      if (!hash_1.isSerializableHash(this._inner)) {
        throw new Error("hmac: can't saveState() because hash doesn't implement it");
      }
      return this._inner.saveState();
    };
    HMAC2.prototype.restoreState = function(savedState) {
      if (!hash_1.isSerializableHash(this._inner) || !hash_1.isSerializableHash(this._outer)) {
        throw new Error("hmac: can't restoreState() because hash doesn't implement it");
      }
      this._inner.restoreState(savedState);
      this._outer.restoreState(this._outerKeyedState);
      this._finished = false;
      return this;
    };
    HMAC2.prototype.cleanSavedState = function(savedState) {
      if (!hash_1.isSerializableHash(this._inner)) {
        throw new Error("hmac: can't cleanSavedState() because hash doesn't implement it");
      }
      this._inner.cleanSavedState(savedState);
    };
    return HMAC2;
  }()
);
hmac$2.HMAC = HMAC;
function hmac$1(hash3, key2, data) {
  var h3 = new HMAC(hash3, key2);
  h3.update(data);
  var digest9 = h3.digest();
  h3.clean();
  return digest9;
}
hmac$2.hmac = hmac$1;
hmac$2.equal = constant_time_1.equal;
Object.defineProperty(hkdf, "__esModule", { value: true });
var hmac_1 = hmac$2;
var wipe_1$1 = wipe$1;
var HKDF = (
  /** @class */
  function() {
    function HKDF2(hash3, key2, salt, info) {
      if (salt === void 0) {
        salt = new Uint8Array(0);
      }
      this._counter = new Uint8Array(1);
      this._hash = hash3;
      this._info = info;
      var okm = hmac_1.hmac(this._hash, salt, key2);
      this._hmac = new hmac_1.HMAC(hash3, okm);
      this._buffer = new Uint8Array(this._hmac.digestLength);
      this._bufpos = this._buffer.length;
    }
    HKDF2.prototype._fillBuffer = function() {
      this._counter[0]++;
      var ctr = this._counter[0];
      if (ctr === 0) {
        throw new Error("hkdf: cannot expand more");
      }
      this._hmac.reset();
      if (ctr > 1) {
        this._hmac.update(this._buffer);
      }
      if (this._info) {
        this._hmac.update(this._info);
      }
      this._hmac.update(this._counter);
      this._hmac.finish(this._buffer);
      this._bufpos = 0;
    };
    HKDF2.prototype.expand = function(length) {
      var out = new Uint8Array(length);
      for (var i2 = 0; i2 < out.length; i2++) {
        if (this._bufpos === this._buffer.length) {
          this._fillBuffer();
        }
        out[i2] = this._buffer[this._bufpos++];
      }
      return out;
    };
    HKDF2.prototype.clean = function() {
      this._hmac.clean();
      wipe_1$1.wipe(this._buffer);
      wipe_1$1.wipe(this._counter);
      this._bufpos = 0;
    };
    return HKDF2;
  }()
);
var HKDF_1 = hkdf.HKDF = HKDF;
var random = {};
var system = {};
var browser$1 = {};
Object.defineProperty(browser$1, "__esModule", { value: true });
browser$1.BrowserRandomSource = void 0;
const QUOTA = 65536;
class BrowserRandomSource {
  constructor() {
    this.isAvailable = false;
    this.isInstantiated = false;
    const browserCrypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
    if (browserCrypto && browserCrypto.getRandomValues !== void 0) {
      this._crypto = browserCrypto;
      this.isAvailable = true;
      this.isInstantiated = true;
    }
  }
  randomBytes(length) {
    if (!this.isAvailable || !this._crypto) {
      throw new Error("Browser random byte generator is not available.");
    }
    const out = new Uint8Array(length);
    for (let i2 = 0; i2 < out.length; i2 += QUOTA) {
      this._crypto.getRandomValues(out.subarray(i2, i2 + Math.min(out.length - i2, QUOTA)));
    }
    return out;
  }
}
browser$1.BrowserRandomSource = BrowserRandomSource;
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var node = {};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
Object.defineProperty(node, "__esModule", { value: true });
node.NodeRandomSource = void 0;
const wipe_1 = wipe$1;
class NodeRandomSource {
  constructor() {
    this.isAvailable = false;
    this.isInstantiated = false;
    if (typeof commonjsRequire !== "undefined") {
      const nodeCrypto = require$$0$1;
      if (nodeCrypto && nodeCrypto.randomBytes) {
        this._crypto = nodeCrypto;
        this.isAvailable = true;
        this.isInstantiated = true;
      }
    }
  }
  randomBytes(length) {
    if (!this.isAvailable || !this._crypto) {
      throw new Error("Node.js random byte generator is not available.");
    }
    let buffer = this._crypto.randomBytes(length);
    if (buffer.length !== length) {
      throw new Error("NodeRandomSource: got fewer bytes than requested");
    }
    const out = new Uint8Array(length);
    for (let i2 = 0; i2 < out.length; i2++) {
      out[i2] = buffer[i2];
    }
    (0, wipe_1.wipe)(buffer);
    return out;
  }
}
node.NodeRandomSource = NodeRandomSource;
Object.defineProperty(system, "__esModule", { value: true });
system.SystemRandomSource = void 0;
const browser_1 = browser$1;
const node_1 = node;
class SystemRandomSource {
  constructor() {
    this.isAvailable = false;
    this.name = "";
    this._source = new browser_1.BrowserRandomSource();
    if (this._source.isAvailable) {
      this.isAvailable = true;
      this.name = "Browser";
      return;
    }
    this._source = new node_1.NodeRandomSource();
    if (this._source.isAvailable) {
      this.isAvailable = true;
      this.name = "Node";
      return;
    }
  }
  randomBytes(length) {
    if (!this.isAvailable) {
      throw new Error("System random byte generator is not available.");
    }
    return this._source.randomBytes(length);
  }
}
system.SystemRandomSource = SystemRandomSource;
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  exports$1.randomStringForEntropy = exports$1.randomString = exports$1.randomUint32 = exports$1.randomBytes = exports$1.defaultRandomSource = void 0;
  const system_1 = system;
  const binary_12 = binary;
  const wipe_12 = wipe$1;
  exports$1.defaultRandomSource = new system_1.SystemRandomSource();
  function randomBytes(length, prng = exports$1.defaultRandomSource) {
    return prng.randomBytes(length);
  }
  exports$1.randomBytes = randomBytes;
  function randomUint32(prng = exports$1.defaultRandomSource) {
    const buf = randomBytes(4, prng);
    const result = (0, binary_12.readUint32LE)(buf);
    (0, wipe_12.wipe)(buf);
    return result;
  }
  exports$1.randomUint32 = randomUint32;
  const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  function randomString(length, charset = ALPHANUMERIC, prng = exports$1.defaultRandomSource) {
    if (charset.length < 2) {
      throw new Error("randomString charset is too short");
    }
    if (charset.length > 256) {
      throw new Error("randomString charset is too long");
    }
    let out = "";
    const charsLen = charset.length;
    const maxByte = 256 - 256 % charsLen;
    while (length > 0) {
      const buf = randomBytes(Math.ceil(length * 256 / maxByte), prng);
      for (let i2 = 0; i2 < buf.length && length > 0; i2++) {
        const randomByte = buf[i2];
        if (randomByte < maxByte) {
          out += charset.charAt(randomByte % charsLen);
          length--;
        }
      }
      (0, wipe_12.wipe)(buf);
    }
    return out;
  }
  exports$1.randomString = randomString;
  function randomStringForEntropy(bits, charset = ALPHANUMERIC, prng = exports$1.defaultRandomSource) {
    const length = Math.ceil(bits / (Math.log(charset.length) / Math.LN2));
    return randomString(length, charset, prng);
  }
  exports$1.randomStringForEntropy = randomStringForEntropy;
})(random);
var sha256 = {};
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  var binary_12 = binary;
  var wipe_12 = wipe$1;
  exports$1.DIGEST_LENGTH = 32;
  exports$1.BLOCK_SIZE = 64;
  var SHA2562 = (
    /** @class */
    function() {
      function SHA2563() {
        this.digestLength = exports$1.DIGEST_LENGTH;
        this.blockSize = exports$1.BLOCK_SIZE;
        this._state = new Int32Array(8);
        this._temp = new Int32Array(64);
        this._buffer = new Uint8Array(128);
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        this.reset();
      }
      SHA2563.prototype._initState = function() {
        this._state[0] = 1779033703;
        this._state[1] = 3144134277;
        this._state[2] = 1013904242;
        this._state[3] = 2773480762;
        this._state[4] = 1359893119;
        this._state[5] = 2600822924;
        this._state[6] = 528734635;
        this._state[7] = 1541459225;
      };
      SHA2563.prototype.reset = function() {
        this._initState();
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        return this;
      };
      SHA2563.prototype.clean = function() {
        wipe_12.wipe(this._buffer);
        wipe_12.wipe(this._temp);
        this.reset();
      };
      SHA2563.prototype.update = function(data, dataLength) {
        if (dataLength === void 0) {
          dataLength = data.length;
        }
        if (this._finished) {
          throw new Error("SHA256: can't update because hash was finished.");
        }
        var dataPos = 0;
        this._bytesHashed += dataLength;
        if (this._bufferLength > 0) {
          while (this._bufferLength < this.blockSize && dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }
          if (this._bufferLength === this.blockSize) {
            hashBlocks(this._temp, this._state, this._buffer, 0, this.blockSize);
            this._bufferLength = 0;
          }
        }
        if (dataLength >= this.blockSize) {
          dataPos = hashBlocks(this._temp, this._state, data, dataPos, dataLength);
          dataLength %= this.blockSize;
        }
        while (dataLength > 0) {
          this._buffer[this._bufferLength++] = data[dataPos++];
          dataLength--;
        }
        return this;
      };
      SHA2563.prototype.finish = function(out) {
        if (!this._finished) {
          var bytesHashed = this._bytesHashed;
          var left = this._bufferLength;
          var bitLenHi = bytesHashed / 536870912 | 0;
          var bitLenLo = bytesHashed << 3;
          var padLength = bytesHashed % 64 < 56 ? 64 : 128;
          this._buffer[left] = 128;
          for (var i2 = left + 1; i2 < padLength - 8; i2++) {
            this._buffer[i2] = 0;
          }
          binary_12.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
          binary_12.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
          hashBlocks(this._temp, this._state, this._buffer, 0, padLength);
          this._finished = true;
        }
        for (var i2 = 0; i2 < this.digestLength / 4; i2++) {
          binary_12.writeUint32BE(this._state[i2], out, i2 * 4);
        }
        return this;
      };
      SHA2563.prototype.digest = function() {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
      };
      SHA2563.prototype.saveState = function() {
        if (this._finished) {
          throw new Error("SHA256: cannot save finished state");
        }
        return {
          state: new Int32Array(this._state),
          buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
          bufferLength: this._bufferLength,
          bytesHashed: this._bytesHashed
        };
      };
      SHA2563.prototype.restoreState = function(savedState) {
        this._state.set(savedState.state);
        this._bufferLength = savedState.bufferLength;
        if (savedState.buffer) {
          this._buffer.set(savedState.buffer);
        }
        this._bytesHashed = savedState.bytesHashed;
        this._finished = false;
        return this;
      };
      SHA2563.prototype.cleanSavedState = function(savedState) {
        wipe_12.wipe(savedState.state);
        if (savedState.buffer) {
          wipe_12.wipe(savedState.buffer);
        }
        savedState.bufferLength = 0;
        savedState.bytesHashed = 0;
      };
      return SHA2563;
    }()
  );
  exports$1.SHA256 = SHA2562;
  var K2 = new Int32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  function hashBlocks(w2, v3, p3, pos, len) {
    while (len >= 64) {
      var a3 = v3[0];
      var b2 = v3[1];
      var c2 = v3[2];
      var d3 = v3[3];
      var e = v3[4];
      var f3 = v3[5];
      var g3 = v3[6];
      var h3 = v3[7];
      for (var i2 = 0; i2 < 16; i2++) {
        var j2 = pos + i2 * 4;
        w2[i2] = binary_12.readUint32BE(p3, j2);
      }
      for (var i2 = 16; i2 < 64; i2++) {
        var u3 = w2[i2 - 2];
        var t1 = (u3 >>> 17 | u3 << 32 - 17) ^ (u3 >>> 19 | u3 << 32 - 19) ^ u3 >>> 10;
        u3 = w2[i2 - 15];
        var t2 = (u3 >>> 7 | u3 << 32 - 7) ^ (u3 >>> 18 | u3 << 32 - 18) ^ u3 >>> 3;
        w2[i2] = (t1 + w2[i2 - 7] | 0) + (t2 + w2[i2 - 16] | 0);
      }
      for (var i2 = 0; i2 < 64; i2++) {
        var t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f3 ^ ~e & g3) | 0) + (h3 + (K2[i2] + w2[i2] | 0) | 0) | 0;
        var t2 = ((a3 >>> 2 | a3 << 32 - 2) ^ (a3 >>> 13 | a3 << 32 - 13) ^ (a3 >>> 22 | a3 << 32 - 22)) + (a3 & b2 ^ a3 & c2 ^ b2 & c2) | 0;
        h3 = g3;
        g3 = f3;
        f3 = e;
        e = d3 + t1 | 0;
        d3 = c2;
        c2 = b2;
        b2 = a3;
        a3 = t1 + t2 | 0;
      }
      v3[0] += a3;
      v3[1] += b2;
      v3[2] += c2;
      v3[3] += d3;
      v3[4] += e;
      v3[5] += f3;
      v3[6] += g3;
      v3[7] += h3;
      pos += 64;
      len -= 64;
    }
    return pos;
  }
  function hash3(data) {
    var h3 = new SHA2562();
    h3.update(data);
    var digest9 = h3.digest();
    h3.clean();
    return digest9;
  }
  exports$1.hash = hash3;
})(sha256);
var x25519 = {};
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  exports$1.sharedKey = exports$1.generateKeyPair = exports$1.generateKeyPairFromSeed = exports$1.scalarMultBase = exports$1.scalarMult = exports$1.SHARED_KEY_LENGTH = exports$1.SECRET_KEY_LENGTH = exports$1.PUBLIC_KEY_LENGTH = void 0;
  const random_1 = random;
  const wipe_12 = wipe$1;
  exports$1.PUBLIC_KEY_LENGTH = 32;
  exports$1.SECRET_KEY_LENGTH = 32;
  exports$1.SHARED_KEY_LENGTH = 32;
  function gf2(init3) {
    const r2 = new Float64Array(16);
    if (init3) {
      for (let i2 = 0; i2 < init3.length; i2++) {
        r2[i2] = init3[i2];
      }
    }
    return r2;
  }
  const _9 = new Uint8Array(32);
  _9[0] = 9;
  const _121665 = gf2([56129, 1]);
  function car25519(o2) {
    let c2 = 1;
    for (let i2 = 0; i2 < 16; i2++) {
      let v3 = o2[i2] + c2 + 65535;
      c2 = Math.floor(v3 / 65536);
      o2[i2] = v3 - c2 * 65536;
    }
    o2[0] += c2 - 1 + 37 * (c2 - 1);
  }
  function sel25519(p3, q2, b2) {
    const c2 = ~(b2 - 1);
    for (let i2 = 0; i2 < 16; i2++) {
      const t = c2 & (p3[i2] ^ q2[i2]);
      p3[i2] ^= t;
      q2[i2] ^= t;
    }
  }
  function pack25519(o2, n2) {
    const m3 = gf2();
    const t = gf2();
    for (let i2 = 0; i2 < 16; i2++) {
      t[i2] = n2[i2];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (let j2 = 0; j2 < 2; j2++) {
      m3[0] = t[0] - 65517;
      for (let i2 = 1; i2 < 15; i2++) {
        m3[i2] = t[i2] - 65535 - (m3[i2 - 1] >> 16 & 1);
        m3[i2 - 1] &= 65535;
      }
      m3[15] = t[15] - 32767 - (m3[14] >> 16 & 1);
      const b2 = m3[15] >> 16 & 1;
      m3[14] &= 65535;
      sel25519(t, m3, 1 - b2);
    }
    for (let i2 = 0; i2 < 16; i2++) {
      o2[2 * i2] = t[i2] & 255;
      o2[2 * i2 + 1] = t[i2] >> 8;
    }
  }
  function unpack25519(o2, n2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = n2[2 * i2] + (n2[2 * i2 + 1] << 8);
    }
    o2[15] &= 32767;
  }
  function add5(o2, a3, b2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = a3[i2] + b2[i2];
    }
  }
  function sub(o2, a3, b2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = a3[i2] - b2[i2];
    }
  }
  function mul5(o2, a3, b2) {
    let v3, c2, t02 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b02 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7], b8 = b2[8], b9 = b2[9], b10 = b2[10], b11 = b2[11], b12 = b2[12], b13 = b2[13], b14 = b2[14], b15 = b2[15];
    v3 = a3[0];
    t02 += v3 * b02;
    t1 += v3 * b1;
    t2 += v3 * b22;
    t3 += v3 * b3;
    t4 += v3 * b4;
    t5 += v3 * b5;
    t6 += v3 * b6;
    t7 += v3 * b7;
    t8 += v3 * b8;
    t9 += v3 * b9;
    t10 += v3 * b10;
    t11 += v3 * b11;
    t12 += v3 * b12;
    t13 += v3 * b13;
    t14 += v3 * b14;
    t15 += v3 * b15;
    v3 = a3[1];
    t1 += v3 * b02;
    t2 += v3 * b1;
    t3 += v3 * b22;
    t4 += v3 * b3;
    t5 += v3 * b4;
    t6 += v3 * b5;
    t7 += v3 * b6;
    t8 += v3 * b7;
    t9 += v3 * b8;
    t10 += v3 * b9;
    t11 += v3 * b10;
    t12 += v3 * b11;
    t13 += v3 * b12;
    t14 += v3 * b13;
    t15 += v3 * b14;
    t16 += v3 * b15;
    v3 = a3[2];
    t2 += v3 * b02;
    t3 += v3 * b1;
    t4 += v3 * b22;
    t5 += v3 * b3;
    t6 += v3 * b4;
    t7 += v3 * b5;
    t8 += v3 * b6;
    t9 += v3 * b7;
    t10 += v3 * b8;
    t11 += v3 * b9;
    t12 += v3 * b10;
    t13 += v3 * b11;
    t14 += v3 * b12;
    t15 += v3 * b13;
    t16 += v3 * b14;
    t17 += v3 * b15;
    v3 = a3[3];
    t3 += v3 * b02;
    t4 += v3 * b1;
    t5 += v3 * b22;
    t6 += v3 * b3;
    t7 += v3 * b4;
    t8 += v3 * b5;
    t9 += v3 * b6;
    t10 += v3 * b7;
    t11 += v3 * b8;
    t12 += v3 * b9;
    t13 += v3 * b10;
    t14 += v3 * b11;
    t15 += v3 * b12;
    t16 += v3 * b13;
    t17 += v3 * b14;
    t18 += v3 * b15;
    v3 = a3[4];
    t4 += v3 * b02;
    t5 += v3 * b1;
    t6 += v3 * b22;
    t7 += v3 * b3;
    t8 += v3 * b4;
    t9 += v3 * b5;
    t10 += v3 * b6;
    t11 += v3 * b7;
    t12 += v3 * b8;
    t13 += v3 * b9;
    t14 += v3 * b10;
    t15 += v3 * b11;
    t16 += v3 * b12;
    t17 += v3 * b13;
    t18 += v3 * b14;
    t19 += v3 * b15;
    v3 = a3[5];
    t5 += v3 * b02;
    t6 += v3 * b1;
    t7 += v3 * b22;
    t8 += v3 * b3;
    t9 += v3 * b4;
    t10 += v3 * b5;
    t11 += v3 * b6;
    t12 += v3 * b7;
    t13 += v3 * b8;
    t14 += v3 * b9;
    t15 += v3 * b10;
    t16 += v3 * b11;
    t17 += v3 * b12;
    t18 += v3 * b13;
    t19 += v3 * b14;
    t20 += v3 * b15;
    v3 = a3[6];
    t6 += v3 * b02;
    t7 += v3 * b1;
    t8 += v3 * b22;
    t9 += v3 * b3;
    t10 += v3 * b4;
    t11 += v3 * b5;
    t12 += v3 * b6;
    t13 += v3 * b7;
    t14 += v3 * b8;
    t15 += v3 * b9;
    t16 += v3 * b10;
    t17 += v3 * b11;
    t18 += v3 * b12;
    t19 += v3 * b13;
    t20 += v3 * b14;
    t21 += v3 * b15;
    v3 = a3[7];
    t7 += v3 * b02;
    t8 += v3 * b1;
    t9 += v3 * b22;
    t10 += v3 * b3;
    t11 += v3 * b4;
    t12 += v3 * b5;
    t13 += v3 * b6;
    t14 += v3 * b7;
    t15 += v3 * b8;
    t16 += v3 * b9;
    t17 += v3 * b10;
    t18 += v3 * b11;
    t19 += v3 * b12;
    t20 += v3 * b13;
    t21 += v3 * b14;
    t22 += v3 * b15;
    v3 = a3[8];
    t8 += v3 * b02;
    t9 += v3 * b1;
    t10 += v3 * b22;
    t11 += v3 * b3;
    t12 += v3 * b4;
    t13 += v3 * b5;
    t14 += v3 * b6;
    t15 += v3 * b7;
    t16 += v3 * b8;
    t17 += v3 * b9;
    t18 += v3 * b10;
    t19 += v3 * b11;
    t20 += v3 * b12;
    t21 += v3 * b13;
    t22 += v3 * b14;
    t23 += v3 * b15;
    v3 = a3[9];
    t9 += v3 * b02;
    t10 += v3 * b1;
    t11 += v3 * b22;
    t12 += v3 * b3;
    t13 += v3 * b4;
    t14 += v3 * b5;
    t15 += v3 * b6;
    t16 += v3 * b7;
    t17 += v3 * b8;
    t18 += v3 * b9;
    t19 += v3 * b10;
    t20 += v3 * b11;
    t21 += v3 * b12;
    t22 += v3 * b13;
    t23 += v3 * b14;
    t24 += v3 * b15;
    v3 = a3[10];
    t10 += v3 * b02;
    t11 += v3 * b1;
    t12 += v3 * b22;
    t13 += v3 * b3;
    t14 += v3 * b4;
    t15 += v3 * b5;
    t16 += v3 * b6;
    t17 += v3 * b7;
    t18 += v3 * b8;
    t19 += v3 * b9;
    t20 += v3 * b10;
    t21 += v3 * b11;
    t22 += v3 * b12;
    t23 += v3 * b13;
    t24 += v3 * b14;
    t25 += v3 * b15;
    v3 = a3[11];
    t11 += v3 * b02;
    t12 += v3 * b1;
    t13 += v3 * b22;
    t14 += v3 * b3;
    t15 += v3 * b4;
    t16 += v3 * b5;
    t17 += v3 * b6;
    t18 += v3 * b7;
    t19 += v3 * b8;
    t20 += v3 * b9;
    t21 += v3 * b10;
    t22 += v3 * b11;
    t23 += v3 * b12;
    t24 += v3 * b13;
    t25 += v3 * b14;
    t26 += v3 * b15;
    v3 = a3[12];
    t12 += v3 * b02;
    t13 += v3 * b1;
    t14 += v3 * b22;
    t15 += v3 * b3;
    t16 += v3 * b4;
    t17 += v3 * b5;
    t18 += v3 * b6;
    t19 += v3 * b7;
    t20 += v3 * b8;
    t21 += v3 * b9;
    t22 += v3 * b10;
    t23 += v3 * b11;
    t24 += v3 * b12;
    t25 += v3 * b13;
    t26 += v3 * b14;
    t27 += v3 * b15;
    v3 = a3[13];
    t13 += v3 * b02;
    t14 += v3 * b1;
    t15 += v3 * b22;
    t16 += v3 * b3;
    t17 += v3 * b4;
    t18 += v3 * b5;
    t19 += v3 * b6;
    t20 += v3 * b7;
    t21 += v3 * b8;
    t22 += v3 * b9;
    t23 += v3 * b10;
    t24 += v3 * b11;
    t25 += v3 * b12;
    t26 += v3 * b13;
    t27 += v3 * b14;
    t28 += v3 * b15;
    v3 = a3[14];
    t14 += v3 * b02;
    t15 += v3 * b1;
    t16 += v3 * b22;
    t17 += v3 * b3;
    t18 += v3 * b4;
    t19 += v3 * b5;
    t20 += v3 * b6;
    t21 += v3 * b7;
    t22 += v3 * b8;
    t23 += v3 * b9;
    t24 += v3 * b10;
    t25 += v3 * b11;
    t26 += v3 * b12;
    t27 += v3 * b13;
    t28 += v3 * b14;
    t29 += v3 * b15;
    v3 = a3[15];
    t15 += v3 * b02;
    t16 += v3 * b1;
    t17 += v3 * b22;
    t18 += v3 * b3;
    t19 += v3 * b4;
    t20 += v3 * b5;
    t21 += v3 * b6;
    t22 += v3 * b7;
    t23 += v3 * b8;
    t24 += v3 * b9;
    t25 += v3 * b10;
    t26 += v3 * b11;
    t27 += v3 * b12;
    t28 += v3 * b13;
    t29 += v3 * b14;
    t30 += v3 * b15;
    t02 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c2 = 1;
    v3 = t02 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t02 = v3 - c2 * 65536;
    v3 = t1 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t1 = v3 - c2 * 65536;
    v3 = t2 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t2 = v3 - c2 * 65536;
    v3 = t3 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t3 = v3 - c2 * 65536;
    v3 = t4 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t4 = v3 - c2 * 65536;
    v3 = t5 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t5 = v3 - c2 * 65536;
    v3 = t6 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t6 = v3 - c2 * 65536;
    v3 = t7 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t7 = v3 - c2 * 65536;
    v3 = t8 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t8 = v3 - c2 * 65536;
    v3 = t9 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t9 = v3 - c2 * 65536;
    v3 = t10 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t10 = v3 - c2 * 65536;
    v3 = t11 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t11 = v3 - c2 * 65536;
    v3 = t12 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t12 = v3 - c2 * 65536;
    v3 = t13 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t13 = v3 - c2 * 65536;
    v3 = t14 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t14 = v3 - c2 * 65536;
    v3 = t15 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t15 = v3 - c2 * 65536;
    t02 += c2 - 1 + 37 * (c2 - 1);
    c2 = 1;
    v3 = t02 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t02 = v3 - c2 * 65536;
    v3 = t1 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t1 = v3 - c2 * 65536;
    v3 = t2 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t2 = v3 - c2 * 65536;
    v3 = t3 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t3 = v3 - c2 * 65536;
    v3 = t4 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t4 = v3 - c2 * 65536;
    v3 = t5 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t5 = v3 - c2 * 65536;
    v3 = t6 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t6 = v3 - c2 * 65536;
    v3 = t7 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t7 = v3 - c2 * 65536;
    v3 = t8 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t8 = v3 - c2 * 65536;
    v3 = t9 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t9 = v3 - c2 * 65536;
    v3 = t10 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t10 = v3 - c2 * 65536;
    v3 = t11 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t11 = v3 - c2 * 65536;
    v3 = t12 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t12 = v3 - c2 * 65536;
    v3 = t13 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t13 = v3 - c2 * 65536;
    v3 = t14 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t14 = v3 - c2 * 65536;
    v3 = t15 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t15 = v3 - c2 * 65536;
    t02 += c2 - 1 + 37 * (c2 - 1);
    o2[0] = t02;
    o2[1] = t1;
    o2[2] = t2;
    o2[3] = t3;
    o2[4] = t4;
    o2[5] = t5;
    o2[6] = t6;
    o2[7] = t7;
    o2[8] = t8;
    o2[9] = t9;
    o2[10] = t10;
    o2[11] = t11;
    o2[12] = t12;
    o2[13] = t13;
    o2[14] = t14;
    o2[15] = t15;
  }
  function square(o2, a3) {
    mul5(o2, a3, a3);
  }
  function inv25519(o2, inp) {
    const c2 = gf2();
    for (let i2 = 0; i2 < 16; i2++) {
      c2[i2] = inp[i2];
    }
    for (let i2 = 253; i2 >= 0; i2--) {
      square(c2, c2);
      if (i2 !== 2 && i2 !== 4) {
        mul5(c2, c2, inp);
      }
    }
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = c2[i2];
    }
  }
  function scalarMult(n2, p3) {
    const z3 = new Uint8Array(32);
    const x3 = new Float64Array(80);
    const a3 = gf2(), b2 = gf2(), c2 = gf2(), d3 = gf2(), e = gf2(), f3 = gf2();
    for (let i2 = 0; i2 < 31; i2++) {
      z3[i2] = n2[i2];
    }
    z3[31] = n2[31] & 127 | 64;
    z3[0] &= 248;
    unpack25519(x3, p3);
    for (let i2 = 0; i2 < 16; i2++) {
      b2[i2] = x3[i2];
    }
    a3[0] = d3[0] = 1;
    for (let i2 = 254; i2 >= 0; --i2) {
      const r2 = z3[i2 >>> 3] >>> (i2 & 7) & 1;
      sel25519(a3, b2, r2);
      sel25519(c2, d3, r2);
      add5(e, a3, c2);
      sub(a3, a3, c2);
      add5(c2, b2, d3);
      sub(b2, b2, d3);
      square(d3, e);
      square(f3, a3);
      mul5(a3, c2, a3);
      mul5(c2, b2, e);
      add5(e, a3, c2);
      sub(a3, a3, c2);
      square(b2, a3);
      sub(c2, d3, f3);
      mul5(a3, c2, _121665);
      add5(a3, a3, d3);
      mul5(c2, c2, a3);
      mul5(a3, d3, f3);
      mul5(d3, b2, x3);
      square(b2, e);
      sel25519(a3, b2, r2);
      sel25519(c2, d3, r2);
    }
    for (let i2 = 0; i2 < 16; i2++) {
      x3[i2 + 16] = a3[i2];
      x3[i2 + 32] = c2[i2];
      x3[i2 + 48] = b2[i2];
      x3[i2 + 64] = d3[i2];
    }
    const x32 = x3.subarray(32);
    const x16 = x3.subarray(16);
    inv25519(x32, x32);
    mul5(x16, x16, x32);
    const q2 = new Uint8Array(32);
    pack25519(q2, x16);
    return q2;
  }
  exports$1.scalarMult = scalarMult;
  function scalarMultBase(n2) {
    return scalarMult(n2, _9);
  }
  exports$1.scalarMultBase = scalarMultBase;
  function generateKeyPairFromSeed(seed) {
    if (seed.length !== exports$1.SECRET_KEY_LENGTH) {
      throw new Error(`x25519: seed must be ${exports$1.SECRET_KEY_LENGTH} bytes`);
    }
    const secretKey = new Uint8Array(seed);
    const publicKey = scalarMultBase(secretKey);
    return {
      publicKey,
      secretKey
    };
  }
  exports$1.generateKeyPairFromSeed = generateKeyPairFromSeed;
  function generateKeyPair2(prng) {
    const seed = (0, random_1.randomBytes)(32, prng);
    const result = generateKeyPairFromSeed(seed);
    (0, wipe_12.wipe)(seed);
    return result;
  }
  exports$1.generateKeyPair = generateKeyPair2;
  function sharedKey(mySecretKey, theirPublicKey, rejectZero = false) {
    if (mySecretKey.length !== exports$1.PUBLIC_KEY_LENGTH) {
      throw new Error("X25519: incorrect secret key length");
    }
    if (theirPublicKey.length !== exports$1.PUBLIC_KEY_LENGTH) {
      throw new Error("X25519: incorrect public key length");
    }
    const result = scalarMult(mySecretKey, theirPublicKey);
    if (rejectZero) {
      let zeros = 0;
      for (let i2 = 0; i2 < result.length; i2++) {
        zeros |= result[i2];
      }
      if (zeros === 0) {
        throw new Error("X25519: invalid shared key");
      }
    }
    return result;
  }
  exports$1.sharedKey = sharedKey;
})(x25519);
function allocUnsafe(size = 0) {
  if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) {
    return globalThis.Buffer.allocUnsafe(size);
  }
  return new Uint8Array(size);
}
function concat(arrays, length) {
  if (!length) {
    length = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return output;
}
function createCodec(name, prefix, encode2, decode2) {
  return {
    name,
    prefix,
    encoder: {
      name,
      prefix,
      encode: encode2
    },
    decoder: { decode: decode2 }
  };
}
const string = createCodec("utf8", "u", (buf) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
const ascii = createCodec("ascii", "a", (buf) => {
  let string2 = "a";
  for (let i2 = 0; i2 < buf.length; i2++) {
    string2 += String.fromCharCode(buf[i2]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf = allocUnsafe(str.length);
  for (let i2 = 0; i2 < str.length; i2++) {
    buf[i2] = str.charCodeAt(i2);
  }
  return buf;
});
const BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
function fromString(string2, encoding = "utf8") {
  const base2 = BASES[encoding];
  if (!base2) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(string2, "utf8");
  }
  return base2.decoder.decode(`${base2.prefix}${string2}`);
}
function toString(array, encoding = "utf8") {
  const base2 = BASES[encoding];
  if (!base2) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
  }
  return base2.encoder.encode(array).substring(1);
}
var elliptic = {};
const version = "6.6.1";
const require$$0 = {
  version
};
var utils$m = {};
var bn$1 = { exports: {} };
bn$1.exports;
(function(module) {
  (function(module2, exports$1) {
    function assert2(val, msg) {
      if (!val) throw new Error(msg || "Assertion failed");
    }
    function inherits2(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
    function BN2(number, base2, endian) {
      if (BN2.isBN(number)) {
        return number;
      }
      this.negative = 0;
      this.words = null;
      this.length = 0;
      this.red = null;
      if (number !== null) {
        if (base2 === "le" || base2 === "be") {
          endian = base2;
          base2 = 10;
        }
        this._init(number || 0, base2 || 10, endian || "be");
      }
    }
    if (typeof module2 === "object") {
      module2.exports = BN2;
    } else {
      exports$1.BN = BN2;
    }
    BN2.BN = BN2;
    BN2.wordSize = 26;
    var Buffer2;
    try {
      if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
        Buffer2 = window.Buffer;
      } else {
        Buffer2 = require$$0$1.Buffer;
      }
    } catch (e) {
    }
    BN2.isBN = function isBN(num) {
      if (num instanceof BN2) {
        return true;
      }
      return num !== null && typeof num === "object" && num.constructor.wordSize === BN2.wordSize && Array.isArray(num.words);
    };
    BN2.max = function max(left, right) {
      if (left.cmp(right) > 0) return left;
      return right;
    };
    BN2.min = function min(left, right) {
      if (left.cmp(right) < 0) return left;
      return right;
    };
    BN2.prototype._init = function init3(number, base2, endian) {
      if (typeof number === "number") {
        return this._initNumber(number, base2, endian);
      }
      if (typeof number === "object") {
        return this._initArray(number, base2, endian);
      }
      if (base2 === "hex") {
        base2 = 16;
      }
      assert2(base2 === (base2 | 0) && base2 >= 2 && base2 <= 36);
      number = number.toString().replace(/\s+/g, "");
      var start = 0;
      if (number[0] === "-") {
        start++;
        this.negative = 1;
      }
      if (start < number.length) {
        if (base2 === 16) {
          this._parseHex(number, start, endian);
        } else {
          this._parseBase(number, base2, start);
          if (endian === "le") {
            this._initArray(this.toArray(), base2, endian);
          }
        }
      }
    };
    BN2.prototype._initNumber = function _initNumber(number, base2, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 67108864) {
        this.words = [number & 67108863];
        this.length = 1;
      } else if (number < 4503599627370496) {
        this.words = [
          number & 67108863,
          number / 67108864 & 67108863
        ];
        this.length = 2;
      } else {
        assert2(number < 9007199254740992);
        this.words = [
          number & 67108863,
          number / 67108864 & 67108863,
          1
        ];
        this.length = 3;
      }
      if (endian !== "le") return;
      this._initArray(this.toArray(), base2, endian);
    };
    BN2.prototype._initArray = function _initArray(number, base2, endian) {
      assert2(typeof number.length === "number");
      if (number.length <= 0) {
        this.words = [0];
        this.length = 1;
        return this;
      }
      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i2 = 0; i2 < this.length; i2++) {
        this.words[i2] = 0;
      }
      var j2, w2;
      var off = 0;
      if (endian === "be") {
        for (i2 = number.length - 1, j2 = 0; i2 >= 0; i2 -= 3) {
          w2 = number[i2] | number[i2 - 1] << 8 | number[i2 - 2] << 16;
          this.words[j2] |= w2 << off & 67108863;
          this.words[j2 + 1] = w2 >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j2++;
          }
        }
      } else if (endian === "le") {
        for (i2 = 0, j2 = 0; i2 < number.length; i2 += 3) {
          w2 = number[i2] | number[i2 + 1] << 8 | number[i2 + 2] << 16;
          this.words[j2] |= w2 << off & 67108863;
          this.words[j2 + 1] = w2 >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j2++;
          }
        }
      }
      return this.strip();
    };
    function parseHex4Bits(string2, index) {
      var c2 = string2.charCodeAt(index);
      if (c2 >= 65 && c2 <= 70) {
        return c2 - 55;
      } else if (c2 >= 97 && c2 <= 102) {
        return c2 - 87;
      } else {
        return c2 - 48 & 15;
      }
    }
    function parseHexByte(string2, lowerBound, index) {
      var r2 = parseHex4Bits(string2, index);
      if (index - 1 >= lowerBound) {
        r2 |= parseHex4Bits(string2, index - 1) << 4;
      }
      return r2;
    }
    BN2.prototype._parseHex = function _parseHex(number, start, endian) {
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i2 = 0; i2 < this.length; i2++) {
        this.words[i2] = 0;
      }
      var off = 0;
      var j2 = 0;
      var w2;
      if (endian === "be") {
        for (i2 = number.length - 1; i2 >= start; i2 -= 2) {
          w2 = parseHexByte(number, start, i2) << off;
          this.words[j2] |= w2 & 67108863;
          if (off >= 18) {
            off -= 18;
            j2 += 1;
            this.words[j2] |= w2 >>> 26;
          } else {
            off += 8;
          }
        }
      } else {
        var parseLength = number.length - start;
        for (i2 = parseLength % 2 === 0 ? start + 1 : start; i2 < number.length; i2 += 2) {
          w2 = parseHexByte(number, start, i2) << off;
          this.words[j2] |= w2 & 67108863;
          if (off >= 18) {
            off -= 18;
            j2 += 1;
            this.words[j2] |= w2 >>> 26;
          } else {
            off += 8;
          }
        }
      }
      this.strip();
    };
    function parseBase(str, start, end, mul5) {
      var r2 = 0;
      var len = Math.min(str.length, end);
      for (var i2 = start; i2 < len; i2++) {
        var c2 = str.charCodeAt(i2) - 48;
        r2 *= mul5;
        if (c2 >= 49) {
          r2 += c2 - 49 + 10;
        } else if (c2 >= 17) {
          r2 += c2 - 17 + 10;
        } else {
          r2 += c2;
        }
      }
      return r2;
    }
    BN2.prototype._parseBase = function _parseBase(number, base2, start) {
      this.words = [0];
      this.length = 1;
      for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base2) {
        limbLen++;
      }
      limbLen--;
      limbPow = limbPow / base2 | 0;
      var total = number.length - start;
      var mod = total % limbLen;
      var end = Math.min(total, total - mod) + start;
      var word = 0;
      for (var i2 = start; i2 < end; i2 += limbLen) {
        word = parseBase(number, i2, i2 + limbLen, base2);
        this.imuln(limbPow);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      if (mod !== 0) {
        var pow = 1;
        word = parseBase(number, i2, number.length, base2);
        for (i2 = 0; i2 < mod; i2++) {
          pow *= base2;
        }
        this.imuln(pow);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      this.strip();
    };
    BN2.prototype.copy = function copy(dest) {
      dest.words = new Array(this.length);
      for (var i2 = 0; i2 < this.length; i2++) {
        dest.words[i2] = this.words[i2];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };
    BN2.prototype.clone = function clone() {
      var r2 = new BN2(null);
      this.copy(r2);
      return r2;
    };
    BN2.prototype._expand = function _expand(size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };
    BN2.prototype.strip = function strip() {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };
    BN2.prototype._normSign = function _normSign() {
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };
    BN2.prototype.inspect = function inspect6() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var zeros = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ];
    var groupSizes = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ];
    var groupBases = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    BN2.prototype.toString = function toString2(base2, padding) {
      base2 = base2 || 10;
      padding = padding | 0 || 1;
      var out;
      if (base2 === 16 || base2 === "hex") {
        out = "";
        var off = 0;
        var carry = 0;
        for (var i2 = 0; i2 < this.length; i2++) {
          var w2 = this.words[i2];
          var word = ((w2 << off | carry) & 16777215).toString(16);
          carry = w2 >>> 24 - off & 16777215;
          off += 2;
          if (off >= 26) {
            off -= 26;
            i2--;
          }
          if (carry !== 0 || i2 !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      if (base2 === (base2 | 0) && base2 >= 2 && base2 <= 36) {
        var groupSize = groupSizes[base2];
        var groupBase = groupBases[base2];
        out = "";
        var c2 = this.clone();
        c2.negative = 0;
        while (!c2.isZero()) {
          var r2 = c2.modn(groupBase).toString(base2);
          c2 = c2.idivn(groupBase);
          if (!c2.isZero()) {
            out = zeros[groupSize - r2.length] + r2 + out;
          } else {
            out = r2 + out;
          }
        }
        if (this.isZero()) {
          out = "0" + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      assert2(false, "Base should be between 2 and 36");
    };
    BN2.prototype.toNumber = function toNumber() {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 67108864;
      } else if (this.length === 3 && this.words[2] === 1) {
        ret += 4503599627370496 + this.words[1] * 67108864;
      } else if (this.length > 2) {
        assert2(false, "Number can only safely store up to 53 bits");
      }
      return this.negative !== 0 ? -ret : ret;
    };
    BN2.prototype.toJSON = function toJSON2() {
      return this.toString(16);
    };
    BN2.prototype.toBuffer = function toBuffer(endian, length) {
      assert2(typeof Buffer2 !== "undefined");
      return this.toArrayLike(Buffer2, endian, length);
    };
    BN2.prototype.toArray = function toArray2(endian, length) {
      return this.toArrayLike(Array, endian, length);
    };
    BN2.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert2(byteLength <= reqLength, "byte array longer than desired length");
      assert2(reqLength > 0, "Requested array length <= 0");
      this.strip();
      var littleEndian = endian === "le";
      var res = new ArrayType(reqLength);
      var b2, i2;
      var q2 = this.clone();
      if (!littleEndian) {
        for (i2 = 0; i2 < reqLength - byteLength; i2++) {
          res[i2] = 0;
        }
        for (i2 = 0; !q2.isZero(); i2++) {
          b2 = q2.andln(255);
          q2.iushrn(8);
          res[reqLength - i2 - 1] = b2;
        }
      } else {
        for (i2 = 0; !q2.isZero(); i2++) {
          b2 = q2.andln(255);
          q2.iushrn(8);
          res[i2] = b2;
        }
        for (; i2 < reqLength; i2++) {
          res[i2] = 0;
        }
      }
      return res;
    };
    if (Math.clz32) {
      BN2.prototype._countBits = function _countBits(w2) {
        return 32 - Math.clz32(w2);
      };
    } else {
      BN2.prototype._countBits = function _countBits(w2) {
        var t = w2;
        var r2 = 0;
        if (t >= 4096) {
          r2 += 13;
          t >>>= 13;
        }
        if (t >= 64) {
          r2 += 7;
          t >>>= 7;
        }
        if (t >= 8) {
          r2 += 4;
          t >>>= 4;
        }
        if (t >= 2) {
          r2 += 2;
          t >>>= 2;
        }
        return r2 + t;
      };
    }
    BN2.prototype._zeroBits = function _zeroBits(w2) {
      if (w2 === 0) return 26;
      var t = w2;
      var r2 = 0;
      if ((t & 8191) === 0) {
        r2 += 13;
        t >>>= 13;
      }
      if ((t & 127) === 0) {
        r2 += 7;
        t >>>= 7;
      }
      if ((t & 15) === 0) {
        r2 += 4;
        t >>>= 4;
      }
      if ((t & 3) === 0) {
        r2 += 2;
        t >>>= 2;
      }
      if ((t & 1) === 0) {
        r2++;
      }
      return r2;
    };
    BN2.prototype.bitLength = function bitLength() {
      var w2 = this.words[this.length - 1];
      var hi2 = this._countBits(w2);
      return (this.length - 1) * 26 + hi2;
    };
    function toBitArray(num) {
      var w2 = new Array(num.bitLength());
      for (var bit = 0; bit < w2.length; bit++) {
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        w2[bit] = (num.words[off] & 1 << wbit) >>> wbit;
      }
      return w2;
    }
    BN2.prototype.zeroBits = function zeroBits() {
      if (this.isZero()) return 0;
      var r2 = 0;
      for (var i2 = 0; i2 < this.length; i2++) {
        var b2 = this._zeroBits(this.words[i2]);
        r2 += b2;
        if (b2 !== 26) break;
      }
      return r2;
    };
    BN2.prototype.byteLength = function byteLength() {
      return Math.ceil(this.bitLength() / 8);
    };
    BN2.prototype.toTwos = function toTwos(width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };
    BN2.prototype.fromTwos = function fromTwos(width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };
    BN2.prototype.isNeg = function isNeg() {
      return this.negative !== 0;
    };
    BN2.prototype.neg = function neg4() {
      return this.clone().ineg();
    };
    BN2.prototype.ineg = function ineg() {
      if (!this.isZero()) {
        this.negative ^= 1;
      }
      return this;
    };
    BN2.prototype.iuor = function iuor(num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }
      for (var i2 = 0; i2 < num.length; i2++) {
        this.words[i2] = this.words[i2] | num.words[i2];
      }
      return this.strip();
    };
    BN2.prototype.ior = function ior(num) {
      assert2((this.negative | num.negative) === 0);
      return this.iuor(num);
    };
    BN2.prototype.or = function or2(num) {
      if (this.length > num.length) return this.clone().ior(num);
      return num.clone().ior(this);
    };
    BN2.prototype.uor = function uor(num) {
      if (this.length > num.length) return this.clone().iuor(num);
      return num.clone().iuor(this);
    };
    BN2.prototype.iuand = function iuand(num) {
      var b2;
      if (this.length > num.length) {
        b2 = num;
      } else {
        b2 = this;
      }
      for (var i2 = 0; i2 < b2.length; i2++) {
        this.words[i2] = this.words[i2] & num.words[i2];
      }
      this.length = b2.length;
      return this.strip();
    };
    BN2.prototype.iand = function iand(num) {
      assert2((this.negative | num.negative) === 0);
      return this.iuand(num);
    };
    BN2.prototype.and = function and(num) {
      if (this.length > num.length) return this.clone().iand(num);
      return num.clone().iand(this);
    };
    BN2.prototype.uand = function uand(num) {
      if (this.length > num.length) return this.clone().iuand(num);
      return num.clone().iuand(this);
    };
    BN2.prototype.iuxor = function iuxor(num) {
      var a3;
      var b2;
      if (this.length > num.length) {
        a3 = this;
        b2 = num;
      } else {
        a3 = num;
        b2 = this;
      }
      for (var i2 = 0; i2 < b2.length; i2++) {
        this.words[i2] = a3.words[i2] ^ b2.words[i2];
      }
      if (this !== a3) {
        for (; i2 < a3.length; i2++) {
          this.words[i2] = a3.words[i2];
        }
      }
      this.length = a3.length;
      return this.strip();
    };
    BN2.prototype.ixor = function ixor(num) {
      assert2((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };
    BN2.prototype.xor = function xor(num) {
      if (this.length > num.length) return this.clone().ixor(num);
      return num.clone().ixor(this);
    };
    BN2.prototype.uxor = function uxor(num) {
      if (this.length > num.length) return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };
    BN2.prototype.inotn = function inotn(width) {
      assert2(typeof width === "number" && width >= 0);
      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;
      this._expand(bytesNeeded);
      if (bitsLeft > 0) {
        bytesNeeded--;
      }
      for (var i2 = 0; i2 < bytesNeeded; i2++) {
        this.words[i2] = ~this.words[i2] & 67108863;
      }
      if (bitsLeft > 0) {
        this.words[i2] = ~this.words[i2] & 67108863 >> 26 - bitsLeft;
      }
      return this.strip();
    };
    BN2.prototype.notn = function notn(width) {
      return this.clone().inotn(width);
    };
    BN2.prototype.setn = function setn(bit, val) {
      assert2(typeof bit === "number" && bit >= 0);
      var off = bit / 26 | 0;
      var wbit = bit % 26;
      this._expand(off + 1);
      if (val) {
        this.words[off] = this.words[off] | 1 << wbit;
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }
      return this.strip();
    };
    BN2.prototype.iadd = function iadd(num) {
      var r2;
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r2 = this.isub(num);
        this.negative ^= 1;
        return this._normSign();
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r2 = this.isub(num);
        num.negative = 1;
        return r2._normSign();
      }
      var a3, b2;
      if (this.length > num.length) {
        a3 = this;
        b2 = num;
      } else {
        a3 = num;
        b2 = this;
      }
      var carry = 0;
      for (var i2 = 0; i2 < b2.length; i2++) {
        r2 = (a3.words[i2] | 0) + (b2.words[i2] | 0) + carry;
        this.words[i2] = r2 & 67108863;
        carry = r2 >>> 26;
      }
      for (; carry !== 0 && i2 < a3.length; i2++) {
        r2 = (a3.words[i2] | 0) + carry;
        this.words[i2] = r2 & 67108863;
        carry = r2 >>> 26;
      }
      this.length = a3.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      } else if (a3 !== this) {
        for (; i2 < a3.length; i2++) {
          this.words[i2] = a3.words[i2];
        }
      }
      return this;
    };
    BN2.prototype.add = function add5(num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }
      if (this.length > num.length) return this.clone().iadd(num);
      return num.clone().iadd(this);
    };
    BN2.prototype.isub = function isub(num) {
      if (num.negative !== 0) {
        num.negative = 0;
        var r2 = this.iadd(num);
        num.negative = 1;
        return r2._normSign();
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }
      var cmp = this.cmp(num);
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }
      var a3, b2;
      if (cmp > 0) {
        a3 = this;
        b2 = num;
      } else {
        a3 = num;
        b2 = this;
      }
      var carry = 0;
      for (var i2 = 0; i2 < b2.length; i2++) {
        r2 = (a3.words[i2] | 0) - (b2.words[i2] | 0) + carry;
        carry = r2 >> 26;
        this.words[i2] = r2 & 67108863;
      }
      for (; carry !== 0 && i2 < a3.length; i2++) {
        r2 = (a3.words[i2] | 0) + carry;
        carry = r2 >> 26;
        this.words[i2] = r2 & 67108863;
      }
      if (carry === 0 && i2 < a3.length && a3 !== this) {
        for (; i2 < a3.length; i2++) {
          this.words[i2] = a3.words[i2];
        }
      }
      this.length = Math.max(this.length, i2);
      if (a3 !== this) {
        this.negative = 1;
      }
      return this.strip();
    };
    BN2.prototype.sub = function sub(num) {
      return this.clone().isub(num);
    };
    function smallMulTo(self2, num, out) {
      out.negative = num.negative ^ self2.negative;
      var len = self2.length + num.length | 0;
      out.length = len;
      len = len - 1 | 0;
      var a3 = self2.words[0] | 0;
      var b2 = num.words[0] | 0;
      var r2 = a3 * b2;
      var lo = r2 & 67108863;
      var carry = r2 / 67108864 | 0;
      out.words[0] = lo;
      for (var k2 = 1; k2 < len; k2++) {
        var ncarry = carry >>> 26;
        var rword = carry & 67108863;
        var maxJ = Math.min(k2, num.length - 1);
        for (var j2 = Math.max(0, k2 - self2.length + 1); j2 <= maxJ; j2++) {
          var i2 = k2 - j2 | 0;
          a3 = self2.words[i2] | 0;
          b2 = num.words[j2] | 0;
          r2 = a3 * b2 + rword;
          ncarry += r2 / 67108864 | 0;
          rword = r2 & 67108863;
        }
        out.words[k2] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k2] = carry | 0;
      } else {
        out.length--;
      }
      return out.strip();
    }
    var comb10MulTo = function comb10MulTo2(self2, num, out) {
      var a3 = self2.words;
      var b2 = num.words;
      var o2 = out.words;
      var c2 = 0;
      var lo;
      var mid;
      var hi2;
      var a02 = a3[0] | 0;
      var al0 = a02 & 8191;
      var ah0 = a02 >>> 13;
      var a1 = a3[1] | 0;
      var al1 = a1 & 8191;
      var ah1 = a1 >>> 13;
      var a22 = a3[2] | 0;
      var al2 = a22 & 8191;
      var ah2 = a22 >>> 13;
      var a32 = a3[3] | 0;
      var al3 = a32 & 8191;
      var ah3 = a32 >>> 13;
      var a4 = a3[4] | 0;
      var al4 = a4 & 8191;
      var ah4 = a4 >>> 13;
      var a5 = a3[5] | 0;
      var al5 = a5 & 8191;
      var ah5 = a5 >>> 13;
      var a6 = a3[6] | 0;
      var al6 = a6 & 8191;
      var ah6 = a6 >>> 13;
      var a7 = a3[7] | 0;
      var al7 = a7 & 8191;
      var ah7 = a7 >>> 13;
      var a8 = a3[8] | 0;
      var al8 = a8 & 8191;
      var ah8 = a8 >>> 13;
      var a9 = a3[9] | 0;
      var al9 = a9 & 8191;
      var ah9 = a9 >>> 13;
      var b02 = b2[0] | 0;
      var bl0 = b02 & 8191;
      var bh0 = b02 >>> 13;
      var b1 = b2[1] | 0;
      var bl1 = b1 & 8191;
      var bh1 = b1 >>> 13;
      var b22 = b2[2] | 0;
      var bl2 = b22 & 8191;
      var bh2 = b22 >>> 13;
      var b3 = b2[3] | 0;
      var bl3 = b3 & 8191;
      var bh3 = b3 >>> 13;
      var b4 = b2[4] | 0;
      var bl4 = b4 & 8191;
      var bh4 = b4 >>> 13;
      var b5 = b2[5] | 0;
      var bl5 = b5 & 8191;
      var bh5 = b5 >>> 13;
      var b6 = b2[6] | 0;
      var bl6 = b6 & 8191;
      var bh6 = b6 >>> 13;
      var b7 = b2[7] | 0;
      var bl7 = b7 & 8191;
      var bh7 = b7 >>> 13;
      var b8 = b2[8] | 0;
      var bl8 = b8 & 8191;
      var bh8 = b8 >>> 13;
      var b9 = b2[9] | 0;
      var bl9 = b9 & 8191;
      var bh9 = b9 >>> 13;
      out.negative = self2.negative ^ num.negative;
      out.length = 19;
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = mid + Math.imul(ah0, bl0) | 0;
      hi2 = Math.imul(ah0, bh0);
      var w02 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w02 >>> 26) | 0;
      w02 &= 67108863;
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = mid + Math.imul(ah1, bl0) | 0;
      hi2 = Math.imul(ah1, bh0);
      lo = lo + Math.imul(al0, bl1) | 0;
      mid = mid + Math.imul(al0, bh1) | 0;
      mid = mid + Math.imul(ah0, bl1) | 0;
      hi2 = hi2 + Math.imul(ah0, bh1) | 0;
      var w1 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
      w1 &= 67108863;
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = mid + Math.imul(ah2, bl0) | 0;
      hi2 = Math.imul(ah2, bh0);
      lo = lo + Math.imul(al1, bl1) | 0;
      mid = mid + Math.imul(al1, bh1) | 0;
      mid = mid + Math.imul(ah1, bl1) | 0;
      hi2 = hi2 + Math.imul(ah1, bh1) | 0;
      lo = lo + Math.imul(al0, bl2) | 0;
      mid = mid + Math.imul(al0, bh2) | 0;
      mid = mid + Math.imul(ah0, bl2) | 0;
      hi2 = hi2 + Math.imul(ah0, bh2) | 0;
      var w2 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
      w2 &= 67108863;
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = mid + Math.imul(ah3, bl0) | 0;
      hi2 = Math.imul(ah3, bh0);
      lo = lo + Math.imul(al2, bl1) | 0;
      mid = mid + Math.imul(al2, bh1) | 0;
      mid = mid + Math.imul(ah2, bl1) | 0;
      hi2 = hi2 + Math.imul(ah2, bh1) | 0;
      lo = lo + Math.imul(al1, bl2) | 0;
      mid = mid + Math.imul(al1, bh2) | 0;
      mid = mid + Math.imul(ah1, bl2) | 0;
      hi2 = hi2 + Math.imul(ah1, bh2) | 0;
      lo = lo + Math.imul(al0, bl3) | 0;
      mid = mid + Math.imul(al0, bh3) | 0;
      mid = mid + Math.imul(ah0, bl3) | 0;
      hi2 = hi2 + Math.imul(ah0, bh3) | 0;
      var w3 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
      w3 &= 67108863;
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = mid + Math.imul(ah4, bl0) | 0;
      hi2 = Math.imul(ah4, bh0);
      lo = lo + Math.imul(al3, bl1) | 0;
      mid = mid + Math.imul(al3, bh1) | 0;
      mid = mid + Math.imul(ah3, bl1) | 0;
      hi2 = hi2 + Math.imul(ah3, bh1) | 0;
      lo = lo + Math.imul(al2, bl2) | 0;
      mid = mid + Math.imul(al2, bh2) | 0;
      mid = mid + Math.imul(ah2, bl2) | 0;
      hi2 = hi2 + Math.imul(ah2, bh2) | 0;
      lo = lo + Math.imul(al1, bl3) | 0;
      mid = mid + Math.imul(al1, bh3) | 0;
      mid = mid + Math.imul(ah1, bl3) | 0;
      hi2 = hi2 + Math.imul(ah1, bh3) | 0;
      lo = lo + Math.imul(al0, bl4) | 0;
      mid = mid + Math.imul(al0, bh4) | 0;
      mid = mid + Math.imul(ah0, bl4) | 0;
      hi2 = hi2 + Math.imul(ah0, bh4) | 0;
      var w4 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
      w4 &= 67108863;
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = mid + Math.imul(ah5, bl0) | 0;
      hi2 = Math.imul(ah5, bh0);
      lo = lo + Math.imul(al4, bl1) | 0;
      mid = mid + Math.imul(al4, bh1) | 0;
      mid = mid + Math.imul(ah4, bl1) | 0;
      hi2 = hi2 + Math.imul(ah4, bh1) | 0;
      lo = lo + Math.imul(al3, bl2) | 0;
      mid = mid + Math.imul(al3, bh2) | 0;
      mid = mid + Math.imul(ah3, bl2) | 0;
      hi2 = hi2 + Math.imul(ah3, bh2) | 0;
      lo = lo + Math.imul(al2, bl3) | 0;
      mid = mid + Math.imul(al2, bh3) | 0;
      mid = mid + Math.imul(ah2, bl3) | 0;
      hi2 = hi2 + Math.imul(ah2, bh3) | 0;
      lo = lo + Math.imul(al1, bl4) | 0;
      mid = mid + Math.imul(al1, bh4) | 0;
      mid = mid + Math.imul(ah1, bl4) | 0;
      hi2 = hi2 + Math.imul(ah1, bh4) | 0;
      lo = lo + Math.imul(al0, bl5) | 0;
      mid = mid + Math.imul(al0, bh5) | 0;
      mid = mid + Math.imul(ah0, bl5) | 0;
      hi2 = hi2 + Math.imul(ah0, bh5) | 0;
      var w5 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
      w5 &= 67108863;
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = mid + Math.imul(ah6, bl0) | 0;
      hi2 = Math.imul(ah6, bh0);
      lo = lo + Math.imul(al5, bl1) | 0;
      mid = mid + Math.imul(al5, bh1) | 0;
      mid = mid + Math.imul(ah5, bl1) | 0;
      hi2 = hi2 + Math.imul(ah5, bh1) | 0;
      lo = lo + Math.imul(al4, bl2) | 0;
      mid = mid + Math.imul(al4, bh2) | 0;
      mid = mid + Math.imul(ah4, bl2) | 0;
      hi2 = hi2 + Math.imul(ah4, bh2) | 0;
      lo = lo + Math.imul(al3, bl3) | 0;
      mid = mid + Math.imul(al3, bh3) | 0;
      mid = mid + Math.imul(ah3, bl3) | 0;
      hi2 = hi2 + Math.imul(ah3, bh3) | 0;
      lo = lo + Math.imul(al2, bl4) | 0;
      mid = mid + Math.imul(al2, bh4) | 0;
      mid = mid + Math.imul(ah2, bl4) | 0;
      hi2 = hi2 + Math.imul(ah2, bh4) | 0;
      lo = lo + Math.imul(al1, bl5) | 0;
      mid = mid + Math.imul(al1, bh5) | 0;
      mid = mid + Math.imul(ah1, bl5) | 0;
      hi2 = hi2 + Math.imul(ah1, bh5) | 0;
      lo = lo + Math.imul(al0, bl6) | 0;
      mid = mid + Math.imul(al0, bh6) | 0;
      mid = mid + Math.imul(ah0, bl6) | 0;
      hi2 = hi2 + Math.imul(ah0, bh6) | 0;
      var w6 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
      w6 &= 67108863;
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = mid + Math.imul(ah7, bl0) | 0;
      hi2 = Math.imul(ah7, bh0);
      lo = lo + Math.imul(al6, bl1) | 0;
      mid = mid + Math.imul(al6, bh1) | 0;
      mid = mid + Math.imul(ah6, bl1) | 0;
      hi2 = hi2 + Math.imul(ah6, bh1) | 0;
      lo = lo + Math.imul(al5, bl2) | 0;
      mid = mid + Math.imul(al5, bh2) | 0;
      mid = mid + Math.imul(ah5, bl2) | 0;
      hi2 = hi2 + Math.imul(ah5, bh2) | 0;
      lo = lo + Math.imul(al4, bl3) | 0;
      mid = mid + Math.imul(al4, bh3) | 0;
      mid = mid + Math.imul(ah4, bl3) | 0;
      hi2 = hi2 + Math.imul(ah4, bh3) | 0;
      lo = lo + Math.imul(al3, bl4) | 0;
      mid = mid + Math.imul(al3, bh4) | 0;
      mid = mid + Math.imul(ah3, bl4) | 0;
      hi2 = hi2 + Math.imul(ah3, bh4) | 0;
      lo = lo + Math.imul(al2, bl5) | 0;
      mid = mid + Math.imul(al2, bh5) | 0;
      mid = mid + Math.imul(ah2, bl5) | 0;
      hi2 = hi2 + Math.imul(ah2, bh5) | 0;
      lo = lo + Math.imul(al1, bl6) | 0;
      mid = mid + Math.imul(al1, bh6) | 0;
      mid = mid + Math.imul(ah1, bl6) | 0;
      hi2 = hi2 + Math.imul(ah1, bh6) | 0;
      lo = lo + Math.imul(al0, bl7) | 0;
      mid = mid + Math.imul(al0, bh7) | 0;
      mid = mid + Math.imul(ah0, bl7) | 0;
      hi2 = hi2 + Math.imul(ah0, bh7) | 0;
      var w7 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
      w7 &= 67108863;
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = mid + Math.imul(ah8, bl0) | 0;
      hi2 = Math.imul(ah8, bh0);
      lo = lo + Math.imul(al7, bl1) | 0;
      mid = mid + Math.imul(al7, bh1) | 0;
      mid = mid + Math.imul(ah7, bl1) | 0;
      hi2 = hi2 + Math.imul(ah7, bh1) | 0;
      lo = lo + Math.imul(al6, bl2) | 0;
      mid = mid + Math.imul(al6, bh2) | 0;
      mid = mid + Math.imul(ah6, bl2) | 0;
      hi2 = hi2 + Math.imul(ah6, bh2) | 0;
      lo = lo + Math.imul(al5, bl3) | 0;
      mid = mid + Math.imul(al5, bh3) | 0;
      mid = mid + Math.imul(ah5, bl3) | 0;
      hi2 = hi2 + Math.imul(ah5, bh3) | 0;
      lo = lo + Math.imul(al4, bl4) | 0;
      mid = mid + Math.imul(al4, bh4) | 0;
      mid = mid + Math.imul(ah4, bl4) | 0;
      hi2 = hi2 + Math.imul(ah4, bh4) | 0;
      lo = lo + Math.imul(al3, bl5) | 0;
      mid = mid + Math.imul(al3, bh5) | 0;
      mid = mid + Math.imul(ah3, bl5) | 0;
      hi2 = hi2 + Math.imul(ah3, bh5) | 0;
      lo = lo + Math.imul(al2, bl6) | 0;
      mid = mid + Math.imul(al2, bh6) | 0;
      mid = mid + Math.imul(ah2, bl6) | 0;
      hi2 = hi2 + Math.imul(ah2, bh6) | 0;
      lo = lo + Math.imul(al1, bl7) | 0;
      mid = mid + Math.imul(al1, bh7) | 0;
      mid = mid + Math.imul(ah1, bl7) | 0;
      hi2 = hi2 + Math.imul(ah1, bh7) | 0;
      lo = lo + Math.imul(al0, bl8) | 0;
      mid = mid + Math.imul(al0, bh8) | 0;
      mid = mid + Math.imul(ah0, bl8) | 0;
      hi2 = hi2 + Math.imul(ah0, bh8) | 0;
      var w8 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
      w8 &= 67108863;
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = mid + Math.imul(ah9, bl0) | 0;
      hi2 = Math.imul(ah9, bh0);
      lo = lo + Math.imul(al8, bl1) | 0;
      mid = mid + Math.imul(al8, bh1) | 0;
      mid = mid + Math.imul(ah8, bl1) | 0;
      hi2 = hi2 + Math.imul(ah8, bh1) | 0;
      lo = lo + Math.imul(al7, bl2) | 0;
      mid = mid + Math.imul(al7, bh2) | 0;
      mid = mid + Math.imul(ah7, bl2) | 0;
      hi2 = hi2 + Math.imul(ah7, bh2) | 0;
      lo = lo + Math.imul(al6, bl3) | 0;
      mid = mid + Math.imul(al6, bh3) | 0;
      mid = mid + Math.imul(ah6, bl3) | 0;
      hi2 = hi2 + Math.imul(ah6, bh3) | 0;
      lo = lo + Math.imul(al5, bl4) | 0;
      mid = mid + Math.imul(al5, bh4) | 0;
      mid = mid + Math.imul(ah5, bl4) | 0;
      hi2 = hi2 + Math.imul(ah5, bh4) | 0;
      lo = lo + Math.imul(al4, bl5) | 0;
      mid = mid + Math.imul(al4, bh5) | 0;
      mid = mid + Math.imul(ah4, bl5) | 0;
      hi2 = hi2 + Math.imul(ah4, bh5) | 0;
      lo = lo + Math.imul(al3, bl6) | 0;
      mid = mid + Math.imul(al3, bh6) | 0;
      mid = mid + Math.imul(ah3, bl6) | 0;
      hi2 = hi2 + Math.imul(ah3, bh6) | 0;
      lo = lo + Math.imul(al2, bl7) | 0;
      mid = mid + Math.imul(al2, bh7) | 0;
      mid = mid + Math.imul(ah2, bl7) | 0;
      hi2 = hi2 + Math.imul(ah2, bh7) | 0;
      lo = lo + Math.imul(al1, bl8) | 0;
      mid = mid + Math.imul(al1, bh8) | 0;
      mid = mid + Math.imul(ah1, bl8) | 0;
      hi2 = hi2 + Math.imul(ah1, bh8) | 0;
      lo = lo + Math.imul(al0, bl9) | 0;
      mid = mid + Math.imul(al0, bh9) | 0;
      mid = mid + Math.imul(ah0, bl9) | 0;
      hi2 = hi2 + Math.imul(ah0, bh9) | 0;
      var w9 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
      w9 &= 67108863;
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = mid + Math.imul(ah9, bl1) | 0;
      hi2 = Math.imul(ah9, bh1);
      lo = lo + Math.imul(al8, bl2) | 0;
      mid = mid + Math.imul(al8, bh2) | 0;
      mid = mid + Math.imul(ah8, bl2) | 0;
      hi2 = hi2 + Math.imul(ah8, bh2) | 0;
      lo = lo + Math.imul(al7, bl3) | 0;
      mid = mid + Math.imul(al7, bh3) | 0;
      mid = mid + Math.imul(ah7, bl3) | 0;
      hi2 = hi2 + Math.imul(ah7, bh3) | 0;
      lo = lo + Math.imul(al6, bl4) | 0;
      mid = mid + Math.imul(al6, bh4) | 0;
      mid = mid + Math.imul(ah6, bl4) | 0;
      hi2 = hi2 + Math.imul(ah6, bh4) | 0;
      lo = lo + Math.imul(al5, bl5) | 0;
      mid = mid + Math.imul(al5, bh5) | 0;
      mid = mid + Math.imul(ah5, bl5) | 0;
      hi2 = hi2 + Math.imul(ah5, bh5) | 0;
      lo = lo + Math.imul(al4, bl6) | 0;
      mid = mid + Math.imul(al4, bh6) | 0;
      mid = mid + Math.imul(ah4, bl6) | 0;
      hi2 = hi2 + Math.imul(ah4, bh6) | 0;
      lo = lo + Math.imul(al3, bl7) | 0;
      mid = mid + Math.imul(al3, bh7) | 0;
      mid = mid + Math.imul(ah3, bl7) | 0;
      hi2 = hi2 + Math.imul(ah3, bh7) | 0;
      lo = lo + Math.imul(al2, bl8) | 0;
      mid = mid + Math.imul(al2, bh8) | 0;
      mid = mid + Math.imul(ah2, bl8) | 0;
      hi2 = hi2 + Math.imul(ah2, bh8) | 0;
      lo = lo + Math.imul(al1, bl9) | 0;
      mid = mid + Math.imul(al1, bh9) | 0;
      mid = mid + Math.imul(ah1, bl9) | 0;
      hi2 = hi2 + Math.imul(ah1, bh9) | 0;
      var w10 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
      w10 &= 67108863;
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = mid + Math.imul(ah9, bl2) | 0;
      hi2 = Math.imul(ah9, bh2);
      lo = lo + Math.imul(al8, bl3) | 0;
      mid = mid + Math.imul(al8, bh3) | 0;
      mid = mid + Math.imul(ah8, bl3) | 0;
      hi2 = hi2 + Math.imul(ah8, bh3) | 0;
      lo = lo + Math.imul(al7, bl4) | 0;
      mid = mid + Math.imul(al7, bh4) | 0;
      mid = mid + Math.imul(ah7, bl4) | 0;
      hi2 = hi2 + Math.imul(ah7, bh4) | 0;
      lo = lo + Math.imul(al6, bl5) | 0;
      mid = mid + Math.imul(al6, bh5) | 0;
      mid = mid + Math.imul(ah6, bl5) | 0;
      hi2 = hi2 + Math.imul(ah6, bh5) | 0;
      lo = lo + Math.imul(al5, bl6) | 0;
      mid = mid + Math.imul(al5, bh6) | 0;
      mid = mid + Math.imul(ah5, bl6) | 0;
      hi2 = hi2 + Math.imul(ah5, bh6) | 0;
      lo = lo + Math.imul(al4, bl7) | 0;
      mid = mid + Math.imul(al4, bh7) | 0;
      mid = mid + Math.imul(ah4, bl7) | 0;
      hi2 = hi2 + Math.imul(ah4, bh7) | 0;
      lo = lo + Math.imul(al3, bl8) | 0;
      mid = mid + Math.imul(al3, bh8) | 0;
      mid = mid + Math.imul(ah3, bl8) | 0;
      hi2 = hi2 + Math.imul(ah3, bh8) | 0;
      lo = lo + Math.imul(al2, bl9) | 0;
      mid = mid + Math.imul(al2, bh9) | 0;
      mid = mid + Math.imul(ah2, bl9) | 0;
      hi2 = hi2 + Math.imul(ah2, bh9) | 0;
      var w11 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
      w11 &= 67108863;
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = mid + Math.imul(ah9, bl3) | 0;
      hi2 = Math.imul(ah9, bh3);
      lo = lo + Math.imul(al8, bl4) | 0;
      mid = mid + Math.imul(al8, bh4) | 0;
      mid = mid + Math.imul(ah8, bl4) | 0;
      hi2 = hi2 + Math.imul(ah8, bh4) | 0;
      lo = lo + Math.imul(al7, bl5) | 0;
      mid = mid + Math.imul(al7, bh5) | 0;
      mid = mid + Math.imul(ah7, bl5) | 0;
      hi2 = hi2 + Math.imul(ah7, bh5) | 0;
      lo = lo + Math.imul(al6, bl6) | 0;
      mid = mid + Math.imul(al6, bh6) | 0;
      mid = mid + Math.imul(ah6, bl6) | 0;
      hi2 = hi2 + Math.imul(ah6, bh6) | 0;
      lo = lo + Math.imul(al5, bl7) | 0;
      mid = mid + Math.imul(al5, bh7) | 0;
      mid = mid + Math.imul(ah5, bl7) | 0;
      hi2 = hi2 + Math.imul(ah5, bh7) | 0;
      lo = lo + Math.imul(al4, bl8) | 0;
      mid = mid + Math.imul(al4, bh8) | 0;
      mid = mid + Math.imul(ah4, bl8) | 0;
      hi2 = hi2 + Math.imul(ah4, bh8) | 0;
      lo = lo + Math.imul(al3, bl9) | 0;
      mid = mid + Math.imul(al3, bh9) | 0;
      mid = mid + Math.imul(ah3, bl9) | 0;
      hi2 = hi2 + Math.imul(ah3, bh9) | 0;
      var w12 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
      w12 &= 67108863;
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = mid + Math.imul(ah9, bl4) | 0;
      hi2 = Math.imul(ah9, bh4);
      lo = lo + Math.imul(al8, bl5) | 0;
      mid = mid + Math.imul(al8, bh5) | 0;
      mid = mid + Math.imul(ah8, bl5) | 0;
      hi2 = hi2 + Math.imul(ah8, bh5) | 0;
      lo = lo + Math.imul(al7, bl6) | 0;
      mid = mid + Math.imul(al7, bh6) | 0;
      mid = mid + Math.imul(ah7, bl6) | 0;
      hi2 = hi2 + Math.imul(ah7, bh6) | 0;
      lo = lo + Math.imul(al6, bl7) | 0;
      mid = mid + Math.imul(al6, bh7) | 0;
      mid = mid + Math.imul(ah6, bl7) | 0;
      hi2 = hi2 + Math.imul(ah6, bh7) | 0;
      lo = lo + Math.imul(al5, bl8) | 0;
      mid = mid + Math.imul(al5, bh8) | 0;
      mid = mid + Math.imul(ah5, bl8) | 0;
      hi2 = hi2 + Math.imul(ah5, bh8) | 0;
      lo = lo + Math.imul(al4, bl9) | 0;
      mid = mid + Math.imul(al4, bh9) | 0;
      mid = mid + Math.imul(ah4, bl9) | 0;
      hi2 = hi2 + Math.imul(ah4, bh9) | 0;
      var w13 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
      w13 &= 67108863;
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = mid + Math.imul(ah9, bl5) | 0;
      hi2 = Math.imul(ah9, bh5);
      lo = lo + Math.imul(al8, bl6) | 0;
      mid = mid + Math.imul(al8, bh6) | 0;
      mid = mid + Math.imul(ah8, bl6) | 0;
      hi2 = hi2 + Math.imul(ah8, bh6) | 0;
      lo = lo + Math.imul(al7, bl7) | 0;
      mid = mid + Math.imul(al7, bh7) | 0;
      mid = mid + Math.imul(ah7, bl7) | 0;
      hi2 = hi2 + Math.imul(ah7, bh7) | 0;
      lo = lo + Math.imul(al6, bl8) | 0;
      mid = mid + Math.imul(al6, bh8) | 0;
      mid = mid + Math.imul(ah6, bl8) | 0;
      hi2 = hi2 + Math.imul(ah6, bh8) | 0;
      lo = lo + Math.imul(al5, bl9) | 0;
      mid = mid + Math.imul(al5, bh9) | 0;
      mid = mid + Math.imul(ah5, bl9) | 0;
      hi2 = hi2 + Math.imul(ah5, bh9) | 0;
      var w14 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
      w14 &= 67108863;
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = mid + Math.imul(ah9, bl6) | 0;
      hi2 = Math.imul(ah9, bh6);
      lo = lo + Math.imul(al8, bl7) | 0;
      mid = mid + Math.imul(al8, bh7) | 0;
      mid = mid + Math.imul(ah8, bl7) | 0;
      hi2 = hi2 + Math.imul(ah8, bh7) | 0;
      lo = lo + Math.imul(al7, bl8) | 0;
      mid = mid + Math.imul(al7, bh8) | 0;
      mid = mid + Math.imul(ah7, bl8) | 0;
      hi2 = hi2 + Math.imul(ah7, bh8) | 0;
      lo = lo + Math.imul(al6, bl9) | 0;
      mid = mid + Math.imul(al6, bh9) | 0;
      mid = mid + Math.imul(ah6, bl9) | 0;
      hi2 = hi2 + Math.imul(ah6, bh9) | 0;
      var w15 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
      w15 &= 67108863;
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = mid + Math.imul(ah9, bl7) | 0;
      hi2 = Math.imul(ah9, bh7);
      lo = lo + Math.imul(al8, bl8) | 0;
      mid = mid + Math.imul(al8, bh8) | 0;
      mid = mid + Math.imul(ah8, bl8) | 0;
      hi2 = hi2 + Math.imul(ah8, bh8) | 0;
      lo = lo + Math.imul(al7, bl9) | 0;
      mid = mid + Math.imul(al7, bh9) | 0;
      mid = mid + Math.imul(ah7, bl9) | 0;
      hi2 = hi2 + Math.imul(ah7, bh9) | 0;
      var w16 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
      w16 &= 67108863;
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = mid + Math.imul(ah9, bl8) | 0;
      hi2 = Math.imul(ah9, bh8);
      lo = lo + Math.imul(al8, bl9) | 0;
      mid = mid + Math.imul(al8, bh9) | 0;
      mid = mid + Math.imul(ah8, bl9) | 0;
      hi2 = hi2 + Math.imul(ah8, bh9) | 0;
      var w17 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
      w17 &= 67108863;
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = mid + Math.imul(ah9, bl9) | 0;
      hi2 = Math.imul(ah9, bh9);
      var w18 = (c2 + lo | 0) + ((mid & 8191) << 13) | 0;
      c2 = (hi2 + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
      w18 &= 67108863;
      o2[0] = w02;
      o2[1] = w1;
      o2[2] = w2;
      o2[3] = w3;
      o2[4] = w4;
      o2[5] = w5;
      o2[6] = w6;
      o2[7] = w7;
      o2[8] = w8;
      o2[9] = w9;
      o2[10] = w10;
      o2[11] = w11;
      o2[12] = w12;
      o2[13] = w13;
      o2[14] = w14;
      o2[15] = w15;
      o2[16] = w16;
      o2[17] = w17;
      o2[18] = w18;
      if (c2 !== 0) {
        o2[19] = c2;
        out.length++;
      }
      return out;
    };
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }
    function bigMulTo(self2, num, out) {
      out.negative = num.negative ^ self2.negative;
      out.length = self2.length + num.length;
      var carry = 0;
      var hncarry = 0;
      for (var k2 = 0; k2 < out.length - 1; k2++) {
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 67108863;
        var maxJ = Math.min(k2, num.length - 1);
        for (var j2 = Math.max(0, k2 - self2.length + 1); j2 <= maxJ; j2++) {
          var i2 = k2 - j2;
          var a3 = self2.words[i2] | 0;
          var b2 = num.words[j2] | 0;
          var r2 = a3 * b2;
          var lo = r2 & 67108863;
          ncarry = ncarry + (r2 / 67108864 | 0) | 0;
          lo = lo + rword | 0;
          rword = lo & 67108863;
          ncarry = ncarry + (lo >>> 26) | 0;
          hncarry += ncarry >>> 26;
          ncarry &= 67108863;
        }
        out.words[k2] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k2] = carry;
      } else {
        out.length--;
      }
      return out.strip();
    }
    function jumboMulTo(self2, num, out) {
      var fftm = new FFTM();
      return fftm.mulp(self2, num, out);
    }
    BN2.prototype.mulTo = function mulTo(num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }
      return res;
    };
    function FFTM(x3, y3) {
      this.x = x3;
      this.y = y3;
    }
    FFTM.prototype.makeRBT = function makeRBT(N2) {
      var t = new Array(N2);
      var l2 = BN2.prototype._countBits(N2) - 1;
      for (var i2 = 0; i2 < N2; i2++) {
        t[i2] = this.revBin(i2, l2, N2);
      }
      return t;
    };
    FFTM.prototype.revBin = function revBin(x3, l2, N2) {
      if (x3 === 0 || x3 === N2 - 1) return x3;
      var rb = 0;
      for (var i2 = 0; i2 < l2; i2++) {
        rb |= (x3 & 1) << l2 - i2 - 1;
        x3 >>= 1;
      }
      return rb;
    };
    FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N2) {
      for (var i2 = 0; i2 < N2; i2++) {
        rtws[i2] = rws[rbt[i2]];
        itws[i2] = iws[rbt[i2]];
      }
    };
    FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N2, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N2);
      for (var s2 = 1; s2 < N2; s2 <<= 1) {
        var l2 = s2 << 1;
        var rtwdf = Math.cos(2 * Math.PI / l2);
        var itwdf = Math.sin(2 * Math.PI / l2);
        for (var p3 = 0; p3 < N2; p3 += l2) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;
          for (var j2 = 0; j2 < s2; j2++) {
            var re2 = rtws[p3 + j2];
            var ie2 = itws[p3 + j2];
            var ro2 = rtws[p3 + j2 + s2];
            var io2 = itws[p3 + j2 + s2];
            var rx = rtwdf_ * ro2 - itwdf_ * io2;
            io2 = rtwdf_ * io2 + itwdf_ * ro2;
            ro2 = rx;
            rtws[p3 + j2] = re2 + ro2;
            itws[p3 + j2] = ie2 + io2;
            rtws[p3 + j2 + s2] = re2 - ro2;
            itws[p3 + j2 + s2] = ie2 - io2;
            if (j2 !== l2) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;
              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };
    FFTM.prototype.guessLen13b = function guessLen13b(n2, m3) {
      var N2 = Math.max(m3, n2) | 1;
      var odd = N2 & 1;
      var i2 = 0;
      for (N2 = N2 / 2 | 0; N2; N2 = N2 >>> 1) {
        i2++;
      }
      return 1 << i2 + 1 + odd;
    };
    FFTM.prototype.conjugate = function conjugate(rws, iws, N2) {
      if (N2 <= 1) return;
      for (var i2 = 0; i2 < N2 / 2; i2++) {
        var t = rws[i2];
        rws[i2] = rws[N2 - i2 - 1];
        rws[N2 - i2 - 1] = t;
        t = iws[i2];
        iws[i2] = -iws[N2 - i2 - 1];
        iws[N2 - i2 - 1] = -t;
      }
    };
    FFTM.prototype.normalize13b = function normalize13b(ws3, N2) {
      var carry = 0;
      for (var i2 = 0; i2 < N2 / 2; i2++) {
        var w2 = Math.round(ws3[2 * i2 + 1] / N2) * 8192 + Math.round(ws3[2 * i2] / N2) + carry;
        ws3[i2] = w2 & 67108863;
        if (w2 < 67108864) {
          carry = 0;
        } else {
          carry = w2 / 67108864 | 0;
        }
      }
      return ws3;
    };
    FFTM.prototype.convert13b = function convert13b(ws3, len, rws, N2) {
      var carry = 0;
      for (var i2 = 0; i2 < len; i2++) {
        carry = carry + (ws3[i2] | 0);
        rws[2 * i2] = carry & 8191;
        carry = carry >>> 13;
        rws[2 * i2 + 1] = carry & 8191;
        carry = carry >>> 13;
      }
      for (i2 = 2 * len; i2 < N2; ++i2) {
        rws[i2] = 0;
      }
      assert2(carry === 0);
      assert2((carry & -8192) === 0);
    };
    FFTM.prototype.stub = function stub(N2) {
      var ph2 = new Array(N2);
      for (var i2 = 0; i2 < N2; i2++) {
        ph2[i2] = 0;
      }
      return ph2;
    };
    FFTM.prototype.mulp = function mulp(x3, y3, out) {
      var N2 = 2 * this.guessLen13b(x3.length, y3.length);
      var rbt = this.makeRBT(N2);
      var _2 = this.stub(N2);
      var rws = new Array(N2);
      var rwst = new Array(N2);
      var iwst = new Array(N2);
      var nrws = new Array(N2);
      var nrwst = new Array(N2);
      var niwst = new Array(N2);
      var rmws = out.words;
      rmws.length = N2;
      this.convert13b(x3.words, x3.length, rws, N2);
      this.convert13b(y3.words, y3.length, nrws, N2);
      this.transform(rws, _2, rwst, iwst, N2, rbt);
      this.transform(nrws, _2, nrwst, niwst, N2, rbt);
      for (var i2 = 0; i2 < N2; i2++) {
        var rx = rwst[i2] * nrwst[i2] - iwst[i2] * niwst[i2];
        iwst[i2] = rwst[i2] * niwst[i2] + iwst[i2] * nrwst[i2];
        rwst[i2] = rx;
      }
      this.conjugate(rwst, iwst, N2);
      this.transform(rwst, iwst, rmws, _2, N2, rbt);
      this.conjugate(rmws, _2, N2);
      this.normalize13b(rmws, N2);
      out.negative = x3.negative ^ y3.negative;
      out.length = x3.length + y3.length;
      return out.strip();
    };
    BN2.prototype.mul = function mul5(num) {
      var out = new BN2(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };
    BN2.prototype.mulf = function mulf(num) {
      var out = new BN2(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };
    BN2.prototype.imul = function imul(num) {
      return this.clone().mulTo(num, this);
    };
    BN2.prototype.imuln = function imuln(num) {
      assert2(typeof num === "number");
      assert2(num < 67108864);
      var carry = 0;
      for (var i2 = 0; i2 < this.length; i2++) {
        var w2 = (this.words[i2] | 0) * num;
        var lo = (w2 & 67108863) + (carry & 67108863);
        carry >>= 26;
        carry += w2 / 67108864 | 0;
        carry += lo >>> 26;
        this.words[i2] = lo & 67108863;
      }
      if (carry !== 0) {
        this.words[i2] = carry;
        this.length++;
      }
      this.length = num === 0 ? 1 : this.length;
      return this;
    };
    BN2.prototype.muln = function muln(num) {
      return this.clone().imuln(num);
    };
    BN2.prototype.sqr = function sqr() {
      return this.mul(this);
    };
    BN2.prototype.isqr = function isqr() {
      return this.imul(this.clone());
    };
    BN2.prototype.pow = function pow(num) {
      var w2 = toBitArray(num);
      if (w2.length === 0) return new BN2(1);
      var res = this;
      for (var i2 = 0; i2 < w2.length; i2++, res = res.sqr()) {
        if (w2[i2] !== 0) break;
      }
      if (++i2 < w2.length) {
        for (var q2 = res.sqr(); i2 < w2.length; i2++, q2 = q2.sqr()) {
          if (w2[i2] === 0) continue;
          res = res.mul(q2);
        }
      }
      return res;
    };
    BN2.prototype.iushln = function iushln(bits) {
      assert2(typeof bits === "number" && bits >= 0);
      var r2 = bits % 26;
      var s2 = (bits - r2) / 26;
      var carryMask = 67108863 >>> 26 - r2 << 26 - r2;
      var i2;
      if (r2 !== 0) {
        var carry = 0;
        for (i2 = 0; i2 < this.length; i2++) {
          var newCarry = this.words[i2] & carryMask;
          var c2 = (this.words[i2] | 0) - newCarry << r2;
          this.words[i2] = c2 | carry;
          carry = newCarry >>> 26 - r2;
        }
        if (carry) {
          this.words[i2] = carry;
          this.length++;
        }
      }
      if (s2 !== 0) {
        for (i2 = this.length - 1; i2 >= 0; i2--) {
          this.words[i2 + s2] = this.words[i2];
        }
        for (i2 = 0; i2 < s2; i2++) {
          this.words[i2] = 0;
        }
        this.length += s2;
      }
      return this.strip();
    };
    BN2.prototype.ishln = function ishln(bits) {
      assert2(this.negative === 0);
      return this.iushln(bits);
    };
    BN2.prototype.iushrn = function iushrn(bits, hint, extended) {
      assert2(typeof bits === "number" && bits >= 0);
      var h3;
      if (hint) {
        h3 = (hint - hint % 26) / 26;
      } else {
        h3 = 0;
      }
      var r2 = bits % 26;
      var s2 = Math.min((bits - r2) / 26, this.length);
      var mask = 67108863 ^ 67108863 >>> r2 << r2;
      var maskedWords = extended;
      h3 -= s2;
      h3 = Math.max(0, h3);
      if (maskedWords) {
        for (var i2 = 0; i2 < s2; i2++) {
          maskedWords.words[i2] = this.words[i2];
        }
        maskedWords.length = s2;
      }
      if (s2 === 0) ;
      else if (this.length > s2) {
        this.length -= s2;
        for (i2 = 0; i2 < this.length; i2++) {
          this.words[i2] = this.words[i2 + s2];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }
      var carry = 0;
      for (i2 = this.length - 1; i2 >= 0 && (carry !== 0 || i2 >= h3); i2--) {
        var word = this.words[i2] | 0;
        this.words[i2] = carry << 26 - r2 | word >>> r2;
        carry = word & mask;
      }
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }
      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }
      return this.strip();
    };
    BN2.prototype.ishrn = function ishrn(bits, hint, extended) {
      assert2(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };
    BN2.prototype.shln = function shln(bits) {
      return this.clone().ishln(bits);
    };
    BN2.prototype.ushln = function ushln(bits) {
      return this.clone().iushln(bits);
    };
    BN2.prototype.shrn = function shrn(bits) {
      return this.clone().ishrn(bits);
    };
    BN2.prototype.ushrn = function ushrn(bits) {
      return this.clone().iushrn(bits);
    };
    BN2.prototype.testn = function testn(bit) {
      assert2(typeof bit === "number" && bit >= 0);
      var r2 = bit % 26;
      var s2 = (bit - r2) / 26;
      var q2 = 1 << r2;
      if (this.length <= s2) return false;
      var w2 = this.words[s2];
      return !!(w2 & q2);
    };
    BN2.prototype.imaskn = function imaskn(bits) {
      assert2(typeof bits === "number" && bits >= 0);
      var r2 = bits % 26;
      var s2 = (bits - r2) / 26;
      assert2(this.negative === 0, "imaskn works only with positive numbers");
      if (this.length <= s2) {
        return this;
      }
      if (r2 !== 0) {
        s2++;
      }
      this.length = Math.min(s2, this.length);
      if (r2 !== 0) {
        var mask = 67108863 ^ 67108863 >>> r2 << r2;
        this.words[this.length - 1] &= mask;
      }
      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }
      return this.strip();
    };
    BN2.prototype.maskn = function maskn(bits) {
      return this.clone().imaskn(bits);
    };
    BN2.prototype.iaddn = function iaddn(num) {
      assert2(typeof num === "number");
      assert2(num < 67108864);
      if (num < 0) return this.isubn(-num);
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) < num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }
        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }
      return this._iaddn(num);
    };
    BN2.prototype._iaddn = function _iaddn(num) {
      this.words[0] += num;
      for (var i2 = 0; i2 < this.length && this.words[i2] >= 67108864; i2++) {
        this.words[i2] -= 67108864;
        if (i2 === this.length - 1) {
          this.words[i2 + 1] = 1;
        } else {
          this.words[i2 + 1]++;
        }
      }
      this.length = Math.max(this.length, i2 + 1);
      return this;
    };
    BN2.prototype.isubn = function isubn(num) {
      assert2(typeof num === "number");
      assert2(num < 67108864);
      if (num < 0) return this.iaddn(-num);
      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }
      this.words[0] -= num;
      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        for (var i2 = 0; i2 < this.length && this.words[i2] < 0; i2++) {
          this.words[i2] += 67108864;
          this.words[i2 + 1] -= 1;
        }
      }
      return this.strip();
    };
    BN2.prototype.addn = function addn(num) {
      return this.clone().iaddn(num);
    };
    BN2.prototype.subn = function subn(num) {
      return this.clone().isubn(num);
    };
    BN2.prototype.iabs = function iabs() {
      this.negative = 0;
      return this;
    };
    BN2.prototype.abs = function abs() {
      return this.clone().iabs();
    };
    BN2.prototype._ishlnsubmul = function _ishlnsubmul(num, mul5, shift) {
      var len = num.length + shift;
      var i2;
      this._expand(len);
      var w2;
      var carry = 0;
      for (i2 = 0; i2 < num.length; i2++) {
        w2 = (this.words[i2 + shift] | 0) + carry;
        var right = (num.words[i2] | 0) * mul5;
        w2 -= right & 67108863;
        carry = (w2 >> 26) - (right / 67108864 | 0);
        this.words[i2 + shift] = w2 & 67108863;
      }
      for (; i2 < this.length - shift; i2++) {
        w2 = (this.words[i2 + shift] | 0) + carry;
        carry = w2 >> 26;
        this.words[i2 + shift] = w2 & 67108863;
      }
      if (carry === 0) return this.strip();
      assert2(carry === -1);
      carry = 0;
      for (i2 = 0; i2 < this.length; i2++) {
        w2 = -(this.words[i2] | 0) + carry;
        carry = w2 >> 26;
        this.words[i2] = w2 & 67108863;
      }
      this.negative = 1;
      return this.strip();
    };
    BN2.prototype._wordDiv = function _wordDiv(num, mode) {
      var shift = this.length - num.length;
      var a3 = this.clone();
      var b2 = num;
      var bhi = b2.words[b2.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b2 = b2.ushln(shift);
        a3.iushln(shift);
        bhi = b2.words[b2.length - 1] | 0;
      }
      var m3 = a3.length - b2.length;
      var q2;
      if (mode !== "mod") {
        q2 = new BN2(null);
        q2.length = m3 + 1;
        q2.words = new Array(q2.length);
        for (var i2 = 0; i2 < q2.length; i2++) {
          q2.words[i2] = 0;
        }
      }
      var diff = a3.clone()._ishlnsubmul(b2, 1, m3);
      if (diff.negative === 0) {
        a3 = diff;
        if (q2) {
          q2.words[m3] = 1;
        }
      }
      for (var j2 = m3 - 1; j2 >= 0; j2--) {
        var qj = (a3.words[b2.length + j2] | 0) * 67108864 + (a3.words[b2.length + j2 - 1] | 0);
        qj = Math.min(qj / bhi | 0, 67108863);
        a3._ishlnsubmul(b2, qj, j2);
        while (a3.negative !== 0) {
          qj--;
          a3.negative = 0;
          a3._ishlnsubmul(b2, 1, j2);
          if (!a3.isZero()) {
            a3.negative ^= 1;
          }
        }
        if (q2) {
          q2.words[j2] = qj;
        }
      }
      if (q2) {
        q2.strip();
      }
      a3.strip();
      if (mode !== "div" && shift !== 0) {
        a3.iushrn(shift);
      }
      return {
        div: q2 || null,
        mod: a3
      };
    };
    BN2.prototype.divmod = function divmod(num, mode, positive) {
      assert2(!num.isZero());
      if (this.isZero()) {
        return {
          div: new BN2(0),
          mod: new BN2(0)
        };
      }
      var div, mod, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        if (mode !== "div") {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.iadd(num);
          }
        }
        return {
          div,
          mod
        };
      }
      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        return {
          div,
          mod: res.mod
        };
      }
      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);
        if (mode !== "div") {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.isub(num);
          }
        }
        return {
          div: res.div,
          mod
        };
      }
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN2(0),
          mod: this
        };
      }
      if (num.length === 1) {
        if (mode === "div") {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }
        if (mode === "mod") {
          return {
            div: null,
            mod: new BN2(this.modn(num.words[0]))
          };
        }
        return {
          div: this.divn(num.words[0]),
          mod: new BN2(this.modn(num.words[0]))
        };
      }
      return this._wordDiv(num, mode);
    };
    BN2.prototype.div = function div(num) {
      return this.divmod(num, "div", false).div;
    };
    BN2.prototype.mod = function mod(num) {
      return this.divmod(num, "mod", false).mod;
    };
    BN2.prototype.umod = function umod(num) {
      return this.divmod(num, "mod", true).mod;
    };
    BN2.prototype.divRound = function divRound(num) {
      var dm = this.divmod(num);
      if (dm.mod.isZero()) return dm.div;
      var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod.cmp(half);
      if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };
    BN2.prototype.modn = function modn(num) {
      assert2(num <= 67108863);
      var p3 = (1 << 26) % num;
      var acc = 0;
      for (var i2 = this.length - 1; i2 >= 0; i2--) {
        acc = (p3 * acc + (this.words[i2] | 0)) % num;
      }
      return acc;
    };
    BN2.prototype.idivn = function idivn(num) {
      assert2(num <= 67108863);
      var carry = 0;
      for (var i2 = this.length - 1; i2 >= 0; i2--) {
        var w2 = (this.words[i2] | 0) + carry * 67108864;
        this.words[i2] = w2 / num | 0;
        carry = w2 % num;
      }
      return this.strip();
    };
    BN2.prototype.divn = function divn(num) {
      return this.clone().idivn(num);
    };
    BN2.prototype.egcd = function egcd(p3) {
      assert2(p3.negative === 0);
      assert2(!p3.isZero());
      var x3 = this;
      var y3 = p3.clone();
      if (x3.negative !== 0) {
        x3 = x3.umod(p3);
      } else {
        x3 = x3.clone();
      }
      var A2 = new BN2(1);
      var B2 = new BN2(0);
      var C3 = new BN2(0);
      var D2 = new BN2(1);
      var g3 = 0;
      while (x3.isEven() && y3.isEven()) {
        x3.iushrn(1);
        y3.iushrn(1);
        ++g3;
      }
      var yp = y3.clone();
      var xp = x3.clone();
      while (!x3.isZero()) {
        for (var i2 = 0, im = 1; (x3.words[0] & im) === 0 && i2 < 26; ++i2, im <<= 1) ;
        if (i2 > 0) {
          x3.iushrn(i2);
          while (i2-- > 0) {
            if (A2.isOdd() || B2.isOdd()) {
              A2.iadd(yp);
              B2.isub(xp);
            }
            A2.iushrn(1);
            B2.iushrn(1);
          }
        }
        for (var j2 = 0, jm = 1; (y3.words[0] & jm) === 0 && j2 < 26; ++j2, jm <<= 1) ;
        if (j2 > 0) {
          y3.iushrn(j2);
          while (j2-- > 0) {
            if (C3.isOdd() || D2.isOdd()) {
              C3.iadd(yp);
              D2.isub(xp);
            }
            C3.iushrn(1);
            D2.iushrn(1);
          }
        }
        if (x3.cmp(y3) >= 0) {
          x3.isub(y3);
          A2.isub(C3);
          B2.isub(D2);
        } else {
          y3.isub(x3);
          C3.isub(A2);
          D2.isub(B2);
        }
      }
      return {
        a: C3,
        b: D2,
        gcd: y3.iushln(g3)
      };
    };
    BN2.prototype._invmp = function _invmp(p3) {
      assert2(p3.negative === 0);
      assert2(!p3.isZero());
      var a3 = this;
      var b2 = p3.clone();
      if (a3.negative !== 0) {
        a3 = a3.umod(p3);
      } else {
        a3 = a3.clone();
      }
      var x1 = new BN2(1);
      var x22 = new BN2(0);
      var delta = b2.clone();
      while (a3.cmpn(1) > 0 && b2.cmpn(1) > 0) {
        for (var i2 = 0, im = 1; (a3.words[0] & im) === 0 && i2 < 26; ++i2, im <<= 1) ;
        if (i2 > 0) {
          a3.iushrn(i2);
          while (i2-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }
            x1.iushrn(1);
          }
        }
        for (var j2 = 0, jm = 1; (b2.words[0] & jm) === 0 && j2 < 26; ++j2, jm <<= 1) ;
        if (j2 > 0) {
          b2.iushrn(j2);
          while (j2-- > 0) {
            if (x22.isOdd()) {
              x22.iadd(delta);
            }
            x22.iushrn(1);
          }
        }
        if (a3.cmp(b2) >= 0) {
          a3.isub(b2);
          x1.isub(x22);
        } else {
          b2.isub(a3);
          x22.isub(x1);
        }
      }
      var res;
      if (a3.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x22;
      }
      if (res.cmpn(0) < 0) {
        res.iadd(p3);
      }
      return res;
    };
    BN2.prototype.gcd = function gcd(num) {
      if (this.isZero()) return num.abs();
      if (num.isZero()) return this.abs();
      var a3 = this.clone();
      var b2 = num.clone();
      a3.negative = 0;
      b2.negative = 0;
      for (var shift = 0; a3.isEven() && b2.isEven(); shift++) {
        a3.iushrn(1);
        b2.iushrn(1);
      }
      do {
        while (a3.isEven()) {
          a3.iushrn(1);
        }
        while (b2.isEven()) {
          b2.iushrn(1);
        }
        var r2 = a3.cmp(b2);
        if (r2 < 0) {
          var t = a3;
          a3 = b2;
          b2 = t;
        } else if (r2 === 0 || b2.cmpn(1) === 0) {
          break;
        }
        a3.isub(b2);
      } while (true);
      return b2.iushln(shift);
    };
    BN2.prototype.invm = function invm(num) {
      return this.egcd(num).a.umod(num);
    };
    BN2.prototype.isEven = function isEven() {
      return (this.words[0] & 1) === 0;
    };
    BN2.prototype.isOdd = function isOdd() {
      return (this.words[0] & 1) === 1;
    };
    BN2.prototype.andln = function andln(num) {
      return this.words[0] & num;
    };
    BN2.prototype.bincn = function bincn(bit) {
      assert2(typeof bit === "number");
      var r2 = bit % 26;
      var s2 = (bit - r2) / 26;
      var q2 = 1 << r2;
      if (this.length <= s2) {
        this._expand(s2 + 1);
        this.words[s2] |= q2;
        return this;
      }
      var carry = q2;
      for (var i2 = s2; carry !== 0 && i2 < this.length; i2++) {
        var w2 = this.words[i2] | 0;
        w2 += carry;
        carry = w2 >>> 26;
        w2 &= 67108863;
        this.words[i2] = w2;
      }
      if (carry !== 0) {
        this.words[i2] = carry;
        this.length++;
      }
      return this;
    };
    BN2.prototype.isZero = function isZero() {
      return this.length === 1 && this.words[0] === 0;
    };
    BN2.prototype.cmpn = function cmpn(num) {
      var negative = num < 0;
      if (this.negative !== 0 && !negative) return -1;
      if (this.negative === 0 && negative) return 1;
      this.strip();
      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }
        assert2(num <= 67108863, "Number is too big");
        var w2 = this.words[0] | 0;
        res = w2 === num ? 0 : w2 < num ? -1 : 1;
      }
      if (this.negative !== 0) return -res | 0;
      return res;
    };
    BN2.prototype.cmp = function cmp(num) {
      if (this.negative !== 0 && num.negative === 0) return -1;
      if (this.negative === 0 && num.negative !== 0) return 1;
      var res = this.ucmp(num);
      if (this.negative !== 0) return -res | 0;
      return res;
    };
    BN2.prototype.ucmp = function ucmp(num) {
      if (this.length > num.length) return 1;
      if (this.length < num.length) return -1;
      var res = 0;
      for (var i2 = this.length - 1; i2 >= 0; i2--) {
        var a3 = this.words[i2] | 0;
        var b2 = num.words[i2] | 0;
        if (a3 === b2) continue;
        if (a3 < b2) {
          res = -1;
        } else if (a3 > b2) {
          res = 1;
        }
        break;
      }
      return res;
    };
    BN2.prototype.gtn = function gtn(num) {
      return this.cmpn(num) === 1;
    };
    BN2.prototype.gt = function gt2(num) {
      return this.cmp(num) === 1;
    };
    BN2.prototype.gten = function gten(num) {
      return this.cmpn(num) >= 0;
    };
    BN2.prototype.gte = function gte(num) {
      return this.cmp(num) >= 0;
    };
    BN2.prototype.ltn = function ltn(num) {
      return this.cmpn(num) === -1;
    };
    BN2.prototype.lt = function lt2(num) {
      return this.cmp(num) === -1;
    };
    BN2.prototype.lten = function lten(num) {
      return this.cmpn(num) <= 0;
    };
    BN2.prototype.lte = function lte(num) {
      return this.cmp(num) <= 0;
    };
    BN2.prototype.eqn = function eqn(num) {
      return this.cmpn(num) === 0;
    };
    BN2.prototype.eq = function eq6(num) {
      return this.cmp(num) === 0;
    };
    BN2.red = function red(num) {
      return new Red(num);
    };
    BN2.prototype.toRed = function toRed(ctx) {
      assert2(!this.red, "Already a number in reduction context");
      assert2(this.negative === 0, "red works only with positives");
      return ctx.convertTo(this)._forceRed(ctx);
    };
    BN2.prototype.fromRed = function fromRed() {
      assert2(this.red, "fromRed works only with numbers in reduction context");
      return this.red.convertFrom(this);
    };
    BN2.prototype._forceRed = function _forceRed(ctx) {
      this.red = ctx;
      return this;
    };
    BN2.prototype.forceRed = function forceRed(ctx) {
      assert2(!this.red, "Already a number in reduction context");
      return this._forceRed(ctx);
    };
    BN2.prototype.redAdd = function redAdd(num) {
      assert2(this.red, "redAdd works only with red numbers");
      return this.red.add(this, num);
    };
    BN2.prototype.redIAdd = function redIAdd(num) {
      assert2(this.red, "redIAdd works only with red numbers");
      return this.red.iadd(this, num);
    };
    BN2.prototype.redSub = function redSub(num) {
      assert2(this.red, "redSub works only with red numbers");
      return this.red.sub(this, num);
    };
    BN2.prototype.redISub = function redISub(num) {
      assert2(this.red, "redISub works only with red numbers");
      return this.red.isub(this, num);
    };
    BN2.prototype.redShl = function redShl(num) {
      assert2(this.red, "redShl works only with red numbers");
      return this.red.shl(this, num);
    };
    BN2.prototype.redMul = function redMul(num) {
      assert2(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };
    BN2.prototype.redIMul = function redIMul(num) {
      assert2(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };
    BN2.prototype.redSqr = function redSqr() {
      assert2(this.red, "redSqr works only with red numbers");
      this.red._verify1(this);
      return this.red.sqr(this);
    };
    BN2.prototype.redISqr = function redISqr() {
      assert2(this.red, "redISqr works only with red numbers");
      this.red._verify1(this);
      return this.red.isqr(this);
    };
    BN2.prototype.redSqrt = function redSqrt() {
      assert2(this.red, "redSqrt works only with red numbers");
      this.red._verify1(this);
      return this.red.sqrt(this);
    };
    BN2.prototype.redInvm = function redInvm() {
      assert2(this.red, "redInvm works only with red numbers");
      this.red._verify1(this);
      return this.red.invm(this);
    };
    BN2.prototype.redNeg = function redNeg() {
      assert2(this.red, "redNeg works only with red numbers");
      this.red._verify1(this);
      return this.red.neg(this);
    };
    BN2.prototype.redPow = function redPow(num) {
      assert2(this.red && !num.red, "redPow(normalNum)");
      this.red._verify1(this);
      return this.red.pow(this, num);
    };
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function MPrime(name, p3) {
      this.name = name;
      this.p = new BN2(p3, 16);
      this.n = this.p.bitLength();
      this.k = new BN2(1).iushln(this.n).isub(this.p);
      this.tmp = this._tmp();
    }
    MPrime.prototype._tmp = function _tmp() {
      var tmp = new BN2(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };
    MPrime.prototype.ireduce = function ireduce(num) {
      var r2 = num;
      var rlen;
      do {
        this.split(r2, this.tmp);
        r2 = this.imulK(r2);
        r2 = r2.iadd(this.tmp);
        rlen = r2.bitLength();
      } while (rlen > this.n);
      var cmp = rlen < this.n ? -1 : r2.ucmp(this.p);
      if (cmp === 0) {
        r2.words[0] = 0;
        r2.length = 1;
      } else if (cmp > 0) {
        r2.isub(this.p);
      } else {
        if (r2.strip !== void 0) {
          r2.strip();
        } else {
          r2._strip();
        }
      }
      return r2;
    };
    MPrime.prototype.split = function split(input, out) {
      input.iushrn(this.n, 0, out);
    };
    MPrime.prototype.imulK = function imulK(num) {
      return num.imul(this.k);
    };
    function K256() {
      MPrime.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    inherits2(K256, MPrime);
    K256.prototype.split = function split(input, output) {
      var mask = 4194303;
      var outLen = Math.min(input.length, 9);
      for (var i2 = 0; i2 < outLen; i2++) {
        output.words[i2] = input.words[i2];
      }
      output.length = outLen;
      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;
      for (i2 = 10; i2 < input.length; i2++) {
        var next = input.words[i2] | 0;
        input.words[i2 - 10] = (next & mask) << 4 | prev >>> 22;
        prev = next;
      }
      prev >>>= 22;
      input.words[i2 - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };
    K256.prototype.imulK = function imulK(num) {
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;
      var lo = 0;
      for (var i2 = 0; i2 < num.length; i2++) {
        var w2 = num.words[i2] | 0;
        lo += w2 * 977;
        num.words[i2] = lo & 67108863;
        lo = w2 * 64 + (lo / 67108864 | 0);
      }
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };
    function P224() {
      MPrime.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    inherits2(P224, MPrime);
    function P192() {
      MPrime.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    inherits2(P192, MPrime);
    function P25519() {
      MPrime.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    inherits2(P25519, MPrime);
    P25519.prototype.imulK = function imulK(num) {
      var carry = 0;
      for (var i2 = 0; i2 < num.length; i2++) {
        var hi2 = (num.words[i2] | 0) * 19 + carry;
        var lo = hi2 & 67108863;
        hi2 >>>= 26;
        num.words[i2] = lo;
        carry = hi2;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };
    BN2._prime = function prime(name) {
      if (primes[name]) return primes[name];
      var prime2;
      if (name === "k256") {
        prime2 = new K256();
      } else if (name === "p224") {
        prime2 = new P224();
      } else if (name === "p192") {
        prime2 = new P192();
      } else if (name === "p25519") {
        prime2 = new P25519();
      } else {
        throw new Error("Unknown prime " + name);
      }
      primes[name] = prime2;
      return prime2;
    };
    function Red(m3) {
      if (typeof m3 === "string") {
        var prime = BN2._prime(m3);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert2(m3.gtn(1), "modulus must be greater than 1");
        this.m = m3;
        this.prime = null;
      }
    }
    Red.prototype._verify1 = function _verify1(a3) {
      assert2(a3.negative === 0, "red works only with positives");
      assert2(a3.red, "red works only with red numbers");
    };
    Red.prototype._verify2 = function _verify2(a3, b2) {
      assert2((a3.negative | b2.negative) === 0, "red works only with positives");
      assert2(
        a3.red && a3.red === b2.red,
        "red works only with red numbers"
      );
    };
    Red.prototype.imod = function imod(a3) {
      if (this.prime) return this.prime.ireduce(a3)._forceRed(this);
      return a3.umod(this.m)._forceRed(this);
    };
    Red.prototype.neg = function neg4(a3) {
      if (a3.isZero()) {
        return a3.clone();
      }
      return this.m.sub(a3)._forceRed(this);
    };
    Red.prototype.add = function add5(a3, b2) {
      this._verify2(a3, b2);
      var res = a3.add(b2);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.iadd = function iadd(a3, b2) {
      this._verify2(a3, b2);
      var res = a3.iadd(b2);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };
    Red.prototype.sub = function sub(a3, b2) {
      this._verify2(a3, b2);
      var res = a3.sub(b2);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.isub = function isub(a3, b2) {
      this._verify2(a3, b2);
      var res = a3.isub(b2);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };
    Red.prototype.shl = function shl(a3, num) {
      this._verify1(a3);
      return this.imod(a3.ushln(num));
    };
    Red.prototype.imul = function imul(a3, b2) {
      this._verify2(a3, b2);
      return this.imod(a3.imul(b2));
    };
    Red.prototype.mul = function mul5(a3, b2) {
      this._verify2(a3, b2);
      return this.imod(a3.mul(b2));
    };
    Red.prototype.isqr = function isqr(a3) {
      return this.imul(a3, a3.clone());
    };
    Red.prototype.sqr = function sqr(a3) {
      return this.mul(a3, a3);
    };
    Red.prototype.sqrt = function sqrt(a3) {
      if (a3.isZero()) return a3.clone();
      var mod3 = this.m.andln(3);
      assert2(mod3 % 2 === 1);
      if (mod3 === 3) {
        var pow = this.m.add(new BN2(1)).iushrn(2);
        return this.pow(a3, pow);
      }
      var q2 = this.m.subn(1);
      var s2 = 0;
      while (!q2.isZero() && q2.andln(1) === 0) {
        s2++;
        q2.iushrn(1);
      }
      assert2(!q2.isZero());
      var one = new BN2(1).toRed(this);
      var nOne = one.redNeg();
      var lpow = this.m.subn(1).iushrn(1);
      var z3 = this.m.bitLength();
      z3 = new BN2(2 * z3 * z3).toRed(this);
      while (this.pow(z3, lpow).cmp(nOne) !== 0) {
        z3.redIAdd(nOne);
      }
      var c2 = this.pow(z3, q2);
      var r2 = this.pow(a3, q2.addn(1).iushrn(1));
      var t = this.pow(a3, q2);
      var m3 = s2;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i2 = 0; tmp.cmp(one) !== 0; i2++) {
          tmp = tmp.redSqr();
        }
        assert2(i2 < m3);
        var b2 = this.pow(c2, new BN2(1).iushln(m3 - i2 - 1));
        r2 = r2.redMul(b2);
        c2 = b2.redSqr();
        t = t.redMul(c2);
        m3 = i2;
      }
      return r2;
    };
    Red.prototype.invm = function invm(a3) {
      var inv = a3._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };
    Red.prototype.pow = function pow(a3, num) {
      if (num.isZero()) return new BN2(1).toRed(this);
      if (num.cmpn(1) === 0) return a3.clone();
      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN2(1).toRed(this);
      wnd[1] = a3;
      for (var i2 = 2; i2 < wnd.length; i2++) {
        wnd[i2] = this.mul(wnd[i2 - 1], a3);
      }
      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }
      for (i2 = num.length - 1; i2 >= 0; i2--) {
        var word = num.words[i2];
        for (var j2 = start - 1; j2 >= 0; j2--) {
          var bit = word >> j2 & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }
          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }
          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i2 !== 0 || j2 !== 0)) continue;
          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }
      return res;
    };
    Red.prototype.convertTo = function convertTo(num) {
      var r2 = num.umod(this.m);
      return r2 === num ? r2.clone() : r2;
    };
    Red.prototype.convertFrom = function convertFrom(num) {
      var res = num.clone();
      res.red = null;
      return res;
    };
    BN2.mont = function mont2(num) {
      return new Mont(num);
    };
    function Mont(m3) {
      Red.call(this, m3);
      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - this.shift % 26;
      }
      this.r = new BN2(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);
      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits2(Mont, Red);
    Mont.prototype.convertTo = function convertTo(num) {
      return this.imod(num.ushln(this.shift));
    };
    Mont.prototype.convertFrom = function convertFrom(num) {
      var r2 = this.imod(num.mul(this.rinv));
      r2.red = null;
      return r2;
    };
    Mont.prototype.imul = function imul(a3, b2) {
      if (a3.isZero() || b2.isZero()) {
        a3.words[0] = 0;
        a3.length = 1;
        return a3;
      }
      var t = a3.imul(b2);
      var c2 = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u3 = t.isub(c2).iushrn(this.shift);
      var res = u3;
      if (u3.cmp(this.m) >= 0) {
        res = u3.isub(this.m);
      } else if (u3.cmpn(0) < 0) {
        res = u3.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.mul = function mul5(a3, b2) {
      if (a3.isZero() || b2.isZero()) return new BN2(0)._forceRed(this);
      var t = a3.mul(b2);
      var c2 = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u3 = t.isub(c2).iushrn(this.shift);
      var res = u3;
      if (u3.cmp(this.m) >= 0) {
        res = u3.isub(this.m);
      } else if (u3.cmpn(0) < 0) {
        res = u3.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.invm = function invm(a3) {
      var res = this.imod(a3._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(module, commonjsGlobal);
})(bn$1);
var bnExports = bn$1.exports;
var minimalisticAssert = assert$f;
function assert$f(val, msg) {
  if (!val)
    throw new Error(msg || "Assertion failed");
}
assert$f.equal = function assertEqual(l2, r2, msg) {
  if (l2 != r2)
    throw new Error(msg || "Assertion failed: " + l2 + " != " + r2);
};
var utils$l = {};
(function(exports$1) {
  var utils2 = exports$1;
  function toArray2(msg, enc) {
    if (Array.isArray(msg))
      return msg.slice();
    if (!msg)
      return [];
    var res = [];
    if (typeof msg !== "string") {
      for (var i2 = 0; i2 < msg.length; i2++)
        res[i2] = msg[i2] | 0;
      return res;
    }
    if (enc === "hex") {
      msg = msg.replace(/[^a-z0-9]+/ig, "");
      if (msg.length % 2 !== 0)
        msg = "0" + msg;
      for (var i2 = 0; i2 < msg.length; i2 += 2)
        res.push(parseInt(msg[i2] + msg[i2 + 1], 16));
    } else {
      for (var i2 = 0; i2 < msg.length; i2++) {
        var c2 = msg.charCodeAt(i2);
        var hi2 = c2 >> 8;
        var lo = c2 & 255;
        if (hi2)
          res.push(hi2, lo);
        else
          res.push(lo);
      }
    }
    return res;
  }
  utils2.toArray = toArray2;
  function zero22(word) {
    if (word.length === 1)
      return "0" + word;
    else
      return word;
  }
  utils2.zero2 = zero22;
  function toHex3(msg) {
    var res = "";
    for (var i2 = 0; i2 < msg.length; i2++)
      res += zero22(msg[i2].toString(16));
    return res;
  }
  utils2.toHex = toHex3;
  utils2.encode = function encode2(arr, enc) {
    if (enc === "hex")
      return toHex3(arr);
    else
      return arr;
  };
})(utils$l);
(function(exports$1) {
  var utils2 = exports$1;
  var BN2 = bnExports;
  var minAssert = minimalisticAssert;
  var minUtils = utils$l;
  utils2.assert = minAssert;
  utils2.toArray = minUtils.toArray;
  utils2.zero2 = minUtils.zero2;
  utils2.toHex = minUtils.toHex;
  utils2.encode = minUtils.encode;
  function getNAF2(num, w2, bits) {
    var naf = new Array(Math.max(num.bitLength(), bits) + 1);
    var i2;
    for (i2 = 0; i2 < naf.length; i2 += 1) {
      naf[i2] = 0;
    }
    var ws3 = 1 << w2 + 1;
    var k2 = num.clone();
    for (i2 = 0; i2 < naf.length; i2++) {
      var z3;
      var mod = k2.andln(ws3 - 1);
      if (k2.isOdd()) {
        if (mod > (ws3 >> 1) - 1)
          z3 = (ws3 >> 1) - mod;
        else
          z3 = mod;
        k2.isubn(z3);
      } else {
        z3 = 0;
      }
      naf[i2] = z3;
      k2.iushrn(1);
    }
    return naf;
  }
  utils2.getNAF = getNAF2;
  function getJSF2(k1, k2) {
    var jsf = [
      [],
      []
    ];
    k1 = k1.clone();
    k2 = k2.clone();
    var d1 = 0;
    var d22 = 0;
    var m8;
    while (k1.cmpn(-d1) > 0 || k2.cmpn(-d22) > 0) {
      var m14 = k1.andln(3) + d1 & 3;
      var m24 = k2.andln(3) + d22 & 3;
      if (m14 === 3)
        m14 = -1;
      if (m24 === 3)
        m24 = -1;
      var u1;
      if ((m14 & 1) === 0) {
        u1 = 0;
      } else {
        m8 = k1.andln(7) + d1 & 7;
        if ((m8 === 3 || m8 === 5) && m24 === 2)
          u1 = -m14;
        else
          u1 = m14;
      }
      jsf[0].push(u1);
      var u22;
      if ((m24 & 1) === 0) {
        u22 = 0;
      } else {
        m8 = k2.andln(7) + d22 & 7;
        if ((m8 === 3 || m8 === 5) && m14 === 2)
          u22 = -m24;
        else
          u22 = m24;
      }
      jsf[1].push(u22);
      if (2 * d1 === u1 + 1)
        d1 = 1 - d1;
      if (2 * d22 === u22 + 1)
        d22 = 1 - d22;
      k1.iushrn(1);
      k2.iushrn(1);
    }
    return jsf;
  }
  utils2.getJSF = getJSF2;
  function cachedProperty2(obj, name, computer) {
    var key2 = "_" + name;
    obj.prototype[name] = function cachedProperty3() {
      return this[key2] !== void 0 ? this[key2] : this[key2] = computer.call(this);
    };
  }
  utils2.cachedProperty = cachedProperty2;
  function parseBytes2(bytes) {
    return typeof bytes === "string" ? utils2.toArray(bytes, "hex") : bytes;
  }
  utils2.parseBytes = parseBytes2;
  function intFromLE(bytes) {
    return new BN2(bytes, "hex", "le");
  }
  utils2.intFromLE = intFromLE;
})(utils$m);
var brorand = { exports: {} };
var r$1;
brorand.exports = function rand(len) {
  if (!r$1)
    r$1 = new Rand(null);
  return r$1.generate(len);
};
function Rand(rand3) {
  this.rand = rand3;
}
brorand.exports.Rand = Rand;
Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};
Rand.prototype._rand = function _rand(n2) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n2);
  var res = new Uint8Array(n2);
  for (var i2 = 0; i2 < res.length; i2++)
    res[i2] = this.rand.getByte();
  return res;
};
if (typeof self === "object") {
  if (self.crypto && self.crypto.getRandomValues) {
    Rand.prototype._rand = function _rand2(n2) {
      var arr = new Uint8Array(n2);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    Rand.prototype._rand = function _rand2(n2) {
      var arr = new Uint8Array(n2);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };
  } else if (typeof window === "object") {
    Rand.prototype._rand = function() {
      throw new Error("Not implemented yet");
    };
  }
} else {
  try {
    var crypto$1 = require$$0$1;
    if (typeof crypto$1.randomBytes !== "function")
      throw new Error("Not supported");
    Rand.prototype._rand = function _rand2(n2) {
      return crypto$1.randomBytes(n2);
    };
  } catch (e) {
  }
}
var brorandExports = brorand.exports;
var curve = {};
var BN$7 = bnExports;
var utils$k = utils$m;
var getNAF = utils$k.getNAF;
var getJSF = utils$k.getJSF;
var assert$e = utils$k.assert;
function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN$7(conf.p, 16);
  this.red = conf.prime ? BN$7.red(conf.prime) : BN$7.mont(this.p);
  this.zero = new BN$7(0).toRed(this.red);
  this.one = new BN$7(1).toRed(this.red);
  this.two = new BN$7(2).toRed(this.red);
  this.n = conf.n && new BN$7(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);
  this._bitLength = this.n ? this.n.bitLength() : 0;
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
var base = BaseCurve;
BaseCurve.prototype.point = function point() {
  throw new Error("Not implemented");
};
BaseCurve.prototype.validate = function validate() {
  throw new Error("Not implemented");
};
BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p3, k2) {
  assert$e(p3.precomputed);
  var doubles = p3._getDoubles();
  var naf = getNAF(k2, 1, this._bitLength);
  var I2 = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
  I2 /= 3;
  var repr = [];
  var j2;
  var nafW;
  for (j2 = 0; j2 < naf.length; j2 += doubles.step) {
    nafW = 0;
    for (var l2 = j2 + doubles.step - 1; l2 >= j2; l2--)
      nafW = (nafW << 1) + naf[l2];
    repr.push(nafW);
  }
  var a3 = this.jpoint(null, null, null);
  var b2 = this.jpoint(null, null, null);
  for (var i2 = I2; i2 > 0; i2--) {
    for (j2 = 0; j2 < repr.length; j2++) {
      nafW = repr[j2];
      if (nafW === i2)
        b2 = b2.mixedAdd(doubles.points[j2]);
      else if (nafW === -i2)
        b2 = b2.mixedAdd(doubles.points[j2].neg());
    }
    a3 = a3.add(b2);
  }
  return a3.toP();
};
BaseCurve.prototype._wnafMul = function _wnafMul(p3, k2) {
  var w2 = 4;
  var nafPoints = p3._getNAFPoints(w2);
  w2 = nafPoints.wnd;
  var wnd = nafPoints.points;
  var naf = getNAF(k2, w2, this._bitLength);
  var acc = this.jpoint(null, null, null);
  for (var i2 = naf.length - 1; i2 >= 0; i2--) {
    for (var l2 = 0; i2 >= 0 && naf[i2] === 0; i2--)
      l2++;
    if (i2 >= 0)
      l2++;
    acc = acc.dblp(l2);
    if (i2 < 0)
      break;
    var z3 = naf[i2];
    assert$e(z3 !== 0);
    if (p3.type === "affine") {
      if (z3 > 0)
        acc = acc.mixedAdd(wnd[z3 - 1 >> 1]);
      else
        acc = acc.mixedAdd(wnd[-z3 - 1 >> 1].neg());
    } else {
      if (z3 > 0)
        acc = acc.add(wnd[z3 - 1 >> 1]);
      else
        acc = acc.add(wnd[-z3 - 1 >> 1].neg());
    }
  }
  return p3.type === "affine" ? acc.toP() : acc;
};
BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len, jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;
  var max = 0;
  var i2;
  var j2;
  var p3;
  for (i2 = 0; i2 < len; i2++) {
    p3 = points[i2];
    var nafPoints = p3._getNAFPoints(defW);
    wndWidth[i2] = nafPoints.wnd;
    wnd[i2] = nafPoints.points;
  }
  for (i2 = len - 1; i2 >= 1; i2 -= 2) {
    var a3 = i2 - 1;
    var b2 = i2;
    if (wndWidth[a3] !== 1 || wndWidth[b2] !== 1) {
      naf[a3] = getNAF(coeffs[a3], wndWidth[a3], this._bitLength);
      naf[b2] = getNAF(coeffs[b2], wndWidth[b2], this._bitLength);
      max = Math.max(naf[a3].length, max);
      max = Math.max(naf[b2].length, max);
      continue;
    }
    var comb = [
      points[a3],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      points[b2]
      /* 7 */
    ];
    if (points[a3].y.cmp(points[b2].y) === 0) {
      comb[1] = points[a3].add(points[b2]);
      comb[2] = points[a3].toJ().mixedAdd(points[b2].neg());
    } else if (points[a3].y.cmp(points[b2].y.redNeg()) === 0) {
      comb[1] = points[a3].toJ().mixedAdd(points[b2]);
      comb[2] = points[a3].add(points[b2].neg());
    } else {
      comb[1] = points[a3].toJ().mixedAdd(points[b2]);
      comb[2] = points[a3].toJ().mixedAdd(points[b2].neg());
    }
    var index = [
      -3,
      /* -1 -1 */
      -1,
      /* -1 0 */
      -5,
      /* -1 1 */
      -7,
      /* 0 -1 */
      0,
      /* 0 0 */
      7,
      /* 0 1 */
      5,
      /* 1 -1 */
      1,
      /* 1 0 */
      3
      /* 1 1 */
    ];
    var jsf = getJSF(coeffs[a3], coeffs[b2]);
    max = Math.max(jsf[0].length, max);
    naf[a3] = new Array(max);
    naf[b2] = new Array(max);
    for (j2 = 0; j2 < max; j2++) {
      var ja2 = jsf[0][j2] | 0;
      var jb = jsf[1][j2] | 0;
      naf[a3][j2] = index[(ja2 + 1) * 3 + (jb + 1)];
      naf[b2][j2] = 0;
      wnd[a3] = comb;
    }
  }
  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (i2 = max; i2 >= 0; i2--) {
    var k2 = 0;
    while (i2 >= 0) {
      var zero = true;
      for (j2 = 0; j2 < len; j2++) {
        tmp[j2] = naf[j2][i2] | 0;
        if (tmp[j2] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k2++;
      i2--;
    }
    if (i2 >= 0)
      k2++;
    acc = acc.dblp(k2);
    if (i2 < 0)
      break;
    for (j2 = 0; j2 < len; j2++) {
      var z3 = tmp[j2];
      if (z3 === 0)
        continue;
      else if (z3 > 0)
        p3 = wnd[j2][z3 - 1 >> 1];
      else if (z3 < 0)
        p3 = wnd[j2][-z3 - 1 >> 1].neg();
      if (p3.type === "affine")
        acc = acc.mixedAdd(p3);
      else
        acc = acc.add(p3);
    }
  }
  for (i2 = 0; i2 < len; i2++)
    wnd[i2] = null;
  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};
function BasePoint(curve2, type) {
  this.curve = curve2;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;
BasePoint.prototype.eq = function eq() {
  throw new Error("Not implemented");
};
BasePoint.prototype.validate = function validate2() {
  return this.curve.validate(this);
};
BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils$k.toArray(bytes, enc);
  var len = this.p.byteLength();
  if ((bytes[0] === 4 || bytes[0] === 6 || bytes[0] === 7) && bytes.length - 1 === 2 * len) {
    if (bytes[0] === 6)
      assert$e(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 7)
      assert$e(bytes[bytes.length - 1] % 2 === 1);
    var res = this.point(
      bytes.slice(1, 1 + len),
      bytes.slice(1 + len, 1 + 2 * len)
    );
    return res;
  } else if ((bytes[0] === 2 || bytes[0] === 3) && bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 3);
  }
  throw new Error("Unknown point format");
};
BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};
BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x3 = this.getX().toArray("be", len);
  if (compact)
    return [this.getY().isEven() ? 2 : 3].concat(x3);
  return [4].concat(x3, this.getY().toArray("be", len));
};
BasePoint.prototype.encode = function encode(enc, compact) {
  return utils$k.encode(this._encode(compact), enc);
};
BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;
  var precomputed = {
    doubles: null,
    naf: null,
    beta: null
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;
  return this;
};
BasePoint.prototype._hasDoubles = function _hasDoubles(k2) {
  if (!this.precomputed)
    return false;
  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;
  return doubles.points.length >= Math.ceil((k2.bitLength() + 1) / doubles.step);
};
BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;
  var doubles = [this];
  var acc = this;
  for (var i2 = 0; i2 < power; i2 += step) {
    for (var j2 = 0; j2 < step; j2++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step,
    points: doubles
  };
};
BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  var res = [this];
  var max = (1 << wnd) - 1;
  var dbl5 = max === 1 ? null : this.dbl();
  for (var i2 = 1; i2 < max; i2++)
    res[i2] = res[i2 - 1].add(dbl5);
  return {
    wnd,
    points: res
  };
};
BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};
BasePoint.prototype.dblp = function dblp(k2) {
  var r2 = this;
  for (var i2 = 0; i2 < k2; i2++)
    r2 = r2.dbl();
  return r2;
};
var inherits_browser = { exports: {} };
if (typeof Object.create === "function") {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
var inherits_browserExports = inherits_browser.exports;
var utils$j = utils$m;
var BN$6 = bnExports;
var inherits$3 = inherits_browserExports;
var Base$2 = base;
var assert$d = utils$j.assert;
function ShortCurve(conf) {
  Base$2.call(this, "short", conf);
  this.a = new BN$6(conf.a, 16).toRed(this.red);
  this.b = new BN$6(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();
  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits$3(ShortCurve, Base$2);
var short = ShortCurve;
ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new BN$6(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new BN$6(conf.lambda, 16);
  } else {
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert$d(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new BN$6(vec.a, 16),
        b: new BN$6(vec.b, 16)
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }
  return {
    beta,
    lambda,
    basis
  };
};
ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  var red = num === this.p ? this.red : BN$6.mont(num);
  var tinv = new BN$6(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();
  var s2 = new BN$6(3).toRed(red).redNeg().redSqrt().redMul(tinv);
  var l1 = ntinv.redAdd(s2).fromRed();
  var l2 = ntinv.redSub(s2).fromRed();
  return [l1, l2];
};
ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
  var u3 = lambda;
  var v3 = this.n.clone();
  var x1 = new BN$6(1);
  var y1 = new BN$6(0);
  var x22 = new BN$6(0);
  var y22 = new BN$6(1);
  var a02;
  var b02;
  var a1;
  var b1;
  var a22;
  var b2;
  var prevR;
  var i2 = 0;
  var r2;
  var x3;
  while (u3.cmpn(0) !== 0) {
    var q2 = v3.div(u3);
    r2 = v3.sub(q2.mul(u3));
    x3 = x22.sub(q2.mul(x1));
    var y3 = y22.sub(q2.mul(y1));
    if (!a1 && r2.cmp(aprxSqrt) < 0) {
      a02 = prevR.neg();
      b02 = x1;
      a1 = r2.neg();
      b1 = x3;
    } else if (a1 && ++i2 === 2) {
      break;
    }
    prevR = r2;
    v3 = u3;
    u3 = r2;
    x22 = x1;
    x1 = x3;
    y22 = y1;
    y1 = y3;
  }
  a22 = r2.neg();
  b2 = x3;
  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a22.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a22 = a02;
    b2 = b02;
  }
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a22.negative) {
    a22 = a22.neg();
    b2 = b2.neg();
  }
  return [
    { a: a1, b: b1 },
    { a: a22, b: b2 }
  ];
};
ShortCurve.prototype._endoSplit = function _endoSplit(k2) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v22 = basis[1];
  var c1 = v22.b.mul(k2).divRound(this.n);
  var c2 = v1.b.neg().mul(k2).divRound(this.n);
  var p1 = c1.mul(v1.a);
  var p22 = c2.mul(v22.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v22.b);
  var k1 = k2.sub(p1).sub(p22);
  var k22 = q1.add(q2).neg();
  return { k1, k2: k22 };
};
ShortCurve.prototype.pointFromX = function pointFromX(x3, odd) {
  x3 = new BN$6(x3, 16);
  if (!x3.red)
    x3 = x3.toRed(this.red);
  var y22 = x3.redSqr().redMul(x3).redIAdd(x3.redMul(this.a)).redIAdd(this.b);
  var y3 = y22.redSqrt();
  if (y3.redSqr().redSub(y22).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var isOdd = y3.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y3 = y3.redNeg();
  return this.point(x3, y3);
};
ShortCurve.prototype.validate = function validate3(point5) {
  if (point5.inf)
    return true;
  var x3 = point5.x;
  var y3 = point5.y;
  var ax = this.a.redMul(x3);
  var rhs = x3.redSqr().redMul(x3).redIAdd(ax).redIAdd(this.b);
  return y3.redSqr().redISub(rhs).cmpn(0) === 0;
};
ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1;
  var ncoeffs = this._endoWnafT2;
  for (var i2 = 0; i2 < points.length; i2++) {
    var split = this._endoSplit(coeffs[i2]);
    var p3 = points[i2];
    var beta = p3._getBeta();
    if (split.k1.negative) {
      split.k1.ineg();
      p3 = p3.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }
    npoints[i2 * 2] = p3;
    npoints[i2 * 2 + 1] = beta;
    ncoeffs[i2 * 2] = split.k1;
    ncoeffs[i2 * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i2 * 2, jacobianResult);
  for (var j2 = 0; j2 < i2 * 2; j2++) {
    npoints[j2] = null;
    ncoeffs[j2] = null;
  }
  return res;
};
function Point$2(curve2, x3, y3, isRed) {
  Base$2.BasePoint.call(this, curve2, "affine");
  if (x3 === null && y3 === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN$6(x3, 16);
    this.y = new BN$6(y3, 16);
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits$3(Point$2, Base$2.BasePoint);
ShortCurve.prototype.point = function point2(x3, y3, isRed) {
  return new Point$2(this, x3, y3, isRed);
};
ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point$2.fromJSON(this, obj, red);
};
Point$2.prototype._getBeta = function _getBeta2() {
  if (!this.curve.endo)
    return;
  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;
  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve2 = this.curve;
    var endoMul = function(p3) {
      return curve2.point(p3.x.redMul(curve2.endo.beta), p3.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};
Point$2.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [this.x, this.y];
  return [this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  }];
};
Point$2.fromJSON = function fromJSON(curve2, obj, red) {
  if (typeof obj === "string")
    obj = JSON.parse(obj);
  var res = curve2.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;
  function obj2point(obj2) {
    return curve2.point(obj2[0], obj2[1], red);
  }
  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [res].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [res].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};
Point$2.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return "<EC Point Infinity>";
  return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
Point$2.prototype.isInfinity = function isInfinity() {
  return this.inf;
};
Point$2.prototype.add = function add(p3) {
  if (this.inf)
    return p3;
  if (p3.inf)
    return this;
  if (this.eq(p3))
    return this.dbl();
  if (this.neg().eq(p3))
    return this.curve.point(null, null);
  if (this.x.cmp(p3.x) === 0)
    return this.curve.point(null, null);
  var c2 = this.y.redSub(p3.y);
  if (c2.cmpn(0) !== 0)
    c2 = c2.redMul(this.x.redSub(p3.x).redInvm());
  var nx = c2.redSqr().redISub(this.x).redISub(p3.x);
  var ny = c2.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};
Point$2.prototype.dbl = function dbl() {
  if (this.inf)
    return this;
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);
  var a3 = this.curve.a;
  var x22 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c2 = x22.redAdd(x22).redIAdd(x22).redIAdd(a3).redMul(dyinv);
  var nx = c2.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c2.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};
Point$2.prototype.getX = function getX() {
  return this.x.fromRed();
};
Point$2.prototype.getY = function getY() {
  return this.y.fromRed();
};
Point$2.prototype.mul = function mul(k2) {
  k2 = new BN$6(k2, 16);
  if (this.isInfinity())
    return this;
  else if (this._hasDoubles(k2))
    return this.curve._fixedNafMul(this, k2);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([this], [k2]);
  else
    return this.curve._wnafMul(this, k2);
};
Point$2.prototype.mulAdd = function mulAdd(k1, p22, k2) {
  var points = [this, p22];
  var coeffs = [k1, k2];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};
Point$2.prototype.jmulAdd = function jmulAdd(k1, p22, k2) {
  var points = [this, p22];
  var coeffs = [k1, k2];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};
Point$2.prototype.eq = function eq2(p3) {
  return this === p3 || this.inf === p3.inf && (this.inf || this.x.cmp(p3.x) === 0 && this.y.cmp(p3.y) === 0);
};
Point$2.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;
  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p3) {
      return p3.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};
Point$2.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);
  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};
function JPoint(curve2, x3, y3, z3) {
  Base$2.BasePoint.call(this, curve2, "jacobian");
  if (x3 === null && y3 === null && z3 === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN$6(0);
  } else {
    this.x = new BN$6(x3, 16);
    this.y = new BN$6(y3, 16);
    this.z = new BN$6(z3, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);
  this.zOne = this.z === this.curve.one;
}
inherits$3(JPoint, Base$2.BasePoint);
ShortCurve.prototype.jpoint = function jpoint(x3, y3, z3) {
  return new JPoint(this, x3, y3, z3);
};
JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);
  return this.curve.point(ax, ay);
};
JPoint.prototype.neg = function neg2() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
JPoint.prototype.add = function add2(p3) {
  if (this.isInfinity())
    return p3;
  if (p3.isInfinity())
    return this;
  var pz2 = p3.z.redSqr();
  var z22 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u22 = p3.x.redMul(z22);
  var s1 = this.y.redMul(pz2.redMul(p3.z));
  var s2 = p3.y.redMul(z22.redMul(this.z));
  var h3 = u1.redSub(u22);
  var r2 = s1.redSub(s2);
  if (h3.cmpn(0) === 0) {
    if (r2.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }
  var h22 = h3.redSqr();
  var h32 = h22.redMul(h3);
  var v3 = u1.redMul(h22);
  var nx = r2.redSqr().redIAdd(h32).redISub(v3).redISub(v3);
  var ny = r2.redMul(v3.redISub(nx)).redISub(s1.redMul(h32));
  var nz = this.z.redMul(p3.z).redMul(h3);
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.mixedAdd = function mixedAdd(p3) {
  if (this.isInfinity())
    return p3.toJ();
  if (p3.isInfinity())
    return this;
  var z22 = this.z.redSqr();
  var u1 = this.x;
  var u22 = p3.x.redMul(z22);
  var s1 = this.y;
  var s2 = p3.y.redMul(z22).redMul(this.z);
  var h3 = u1.redSub(u22);
  var r2 = s1.redSub(s2);
  if (h3.cmpn(0) === 0) {
    if (r2.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }
  var h22 = h3.redSqr();
  var h32 = h22.redMul(h3);
  var v3 = u1.redMul(h22);
  var nx = r2.redSqr().redIAdd(h32).redISub(v3).redISub(v3);
  var ny = r2.redMul(v3.redISub(nx)).redISub(s1.redMul(h32));
  var nz = this.z.redMul(h3);
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.dblp = function dblp2(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();
  var i2;
  if (this.curve.zeroA || this.curve.threeA) {
    var r2 = this;
    for (i2 = 0; i2 < pow; i2++)
      r2 = r2.dbl();
    return r2;
  }
  var a3 = this.curve.a;
  var tinv = this.curve.tinv;
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();
  var jyd = jy.redAdd(jy);
  for (i2 = 0; i2 < pow; i2++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c2 = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a3.redMul(jz4));
    var t1 = jx.redMul(jyd2);
    var nx = c2.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c2.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i2 + 1 < pow)
      jz4 = jz4.redMul(jyd4);
    jx = nx;
    jz = nz;
    jyd = dny;
  }
  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};
JPoint.prototype.dbl = function dbl2() {
  if (this.isInfinity())
    return this;
  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};
JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  if (this.zOne) {
    var xx = this.x.redSqr();
    var yy = this.y.redSqr();
    var yyyy = yy.redSqr();
    var s2 = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s2 = s2.redIAdd(s2);
    var m3 = xx.redAdd(xx).redIAdd(xx);
    var t = m3.redSqr().redISub(s2).redISub(s2);
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    nx = t;
    ny = m3.redMul(s2.redISub(t)).redISub(yyyy8);
    nz = this.y.redAdd(this.y);
  } else {
    var a3 = this.x.redSqr();
    var b2 = this.y.redSqr();
    var c2 = b2.redSqr();
    var d3 = this.x.redAdd(b2).redSqr().redISub(a3).redISub(c2);
    d3 = d3.redIAdd(d3);
    var e = a3.redAdd(a3).redIAdd(a3);
    var f3 = e.redSqr();
    var c8 = c2.redIAdd(c2);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);
    nx = f3.redISub(d3).redISub(d3);
    ny = e.redMul(d3.redISub(nx)).redISub(c8);
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  if (this.zOne) {
    var xx = this.x.redSqr();
    var yy = this.y.redSqr();
    var yyyy = yy.redSqr();
    var s2 = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s2 = s2.redIAdd(s2);
    var m3 = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    var t = m3.redSqr().redISub(s2).redISub(s2);
    nx = t;
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m3.redMul(s2.redISub(t)).redISub(yyyy8);
    nz = this.y.redAdd(this.y);
  } else {
    var delta = this.z.redSqr();
    var gamma = this.y.redSqr();
    var beta = this.x.redMul(gamma);
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype._dbl = function _dbl() {
  var a3 = this.curve.a;
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();
  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();
  var c2 = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a3.redMul(jz4));
  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c2.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);
  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c2.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var xx = this.x.redSqr();
  var yy = this.y.redSqr();
  var zz = this.z.redSqr();
  var yyyy = yy.redSqr();
  var m3 = xx.redAdd(xx).redIAdd(xx);
  var mm = m3.redSqr();
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  var ee2 = e.redSqr();
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  var u3 = m3.redIAdd(e).redSqr().redISub(mm).redISub(ee2).redISub(t);
  var yyu4 = yy.redMul(u3);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee2).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  var ny = this.y.redMul(u3.redMul(t.redISub(u3)).redISub(e.redMul(ee2)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee2);
  return this.curve.jpoint(nx, ny, nz);
};
JPoint.prototype.mul = function mul2(k2, kbase) {
  k2 = new BN$6(k2, kbase);
  return this.curve._wnafMul(this, k2);
};
JPoint.prototype.eq = function eq3(p3) {
  if (p3.type === "affine")
    return this.eq(p3.toJ());
  if (this === p3)
    return true;
  var z22 = this.z.redSqr();
  var pz2 = p3.z.redSqr();
  if (this.x.redMul(pz2).redISub(p3.x.redMul(z22)).cmpn(0) !== 0)
    return false;
  var z3 = z22.redMul(this.z);
  var pz3 = pz2.redMul(p3.z);
  return this.y.redMul(pz3).redISub(p3.y.redMul(z3)).cmpn(0) === 0;
};
JPoint.prototype.eqXToP = function eqXToP(x3) {
  var zs2 = this.z.redSqr();
  var rx = x3.toRed(this.curve.red).redMul(zs2);
  if (this.x.cmp(rx) === 0)
    return true;
  var xc = x3.clone();
  var t = this.curve.redN.redMul(zs2);
  for (; ; ) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;
    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};
JPoint.prototype.inspect = function inspect2() {
  if (this.isInfinity())
    return "<EC JPoint Infinity>";
  return "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
JPoint.prototype.isInfinity = function isInfinity2() {
  return this.z.cmpn(0) === 0;
};
var BN$5 = bnExports;
var inherits$2 = inherits_browserExports;
var Base$1 = base;
var utils$i = utils$m;
function MontCurve(conf) {
  Base$1.call(this, "mont", conf);
  this.a = new BN$5(conf.a, 16).toRed(this.red);
  this.b = new BN$5(conf.b, 16).toRed(this.red);
  this.i4 = new BN$5(4).toRed(this.red).redInvm();
  this.two = new BN$5(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits$2(MontCurve, Base$1);
var mont = MontCurve;
MontCurve.prototype.validate = function validate4(point5) {
  var x3 = point5.normalize().x;
  var x22 = x3.redSqr();
  var rhs = x22.redMul(x3).redAdd(x22.redMul(this.a)).redAdd(x3);
  var y3 = rhs.redSqrt();
  return y3.redSqr().cmp(rhs) === 0;
};
function Point$1(curve2, x3, z3) {
  Base$1.BasePoint.call(this, curve2, "projective");
  if (x3 === null && z3 === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new BN$5(x3, 16);
    this.z = new BN$5(z3, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
  }
}
inherits$2(Point$1, Base$1.BasePoint);
MontCurve.prototype.decodePoint = function decodePoint2(bytes, enc) {
  return this.point(utils$i.toArray(bytes, enc), 1);
};
MontCurve.prototype.point = function point3(x3, z3) {
  return new Point$1(this, x3, z3);
};
MontCurve.prototype.pointFromJSON = function pointFromJSON2(obj) {
  return Point$1.fromJSON(this, obj);
};
Point$1.prototype.precompute = function precompute2() {
};
Point$1.prototype._encode = function _encode2() {
  return this.getX().toArray("be", this.curve.p.byteLength());
};
Point$1.fromJSON = function fromJSON2(curve2, obj) {
  return new Point$1(curve2, obj[0], obj[1] || curve2.one);
};
Point$1.prototype.inspect = function inspect3() {
  if (this.isInfinity())
    return "<EC Point Infinity>";
  return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
Point$1.prototype.isInfinity = function isInfinity3() {
  return this.z.cmpn(0) === 0;
};
Point$1.prototype.dbl = function dbl3() {
  var a3 = this.x.redAdd(this.z);
  var aa2 = a3.redSqr();
  var b2 = this.x.redSub(this.z);
  var bb = b2.redSqr();
  var c2 = aa2.redSub(bb);
  var nx = aa2.redMul(bb);
  var nz = c2.redMul(bb.redAdd(this.curve.a24.redMul(c2)));
  return this.curve.point(nx, nz);
};
Point$1.prototype.add = function add3() {
  throw new Error("Not supported on Montgomery curve");
};
Point$1.prototype.diffAdd = function diffAdd(p3, diff) {
  var a3 = this.x.redAdd(this.z);
  var b2 = this.x.redSub(this.z);
  var c2 = p3.x.redAdd(p3.z);
  var d3 = p3.x.redSub(p3.z);
  var da2 = d3.redMul(a3);
  var cb = c2.redMul(b2);
  var nx = diff.z.redMul(da2.redAdd(cb).redSqr());
  var nz = diff.x.redMul(da2.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};
Point$1.prototype.mul = function mul3(k2) {
  var t = k2.clone();
  var a3 = this;
  var b2 = this.curve.point(null, null);
  var c2 = this;
  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
    bits.push(t.andln(1));
  for (var i2 = bits.length - 1; i2 >= 0; i2--) {
    if (bits[i2] === 0) {
      a3 = a3.diffAdd(b2, c2);
      b2 = b2.dbl();
    } else {
      b2 = a3.diffAdd(b2, c2);
      a3 = a3.dbl();
    }
  }
  return b2;
};
Point$1.prototype.mulAdd = function mulAdd2() {
  throw new Error("Not supported on Montgomery curve");
};
Point$1.prototype.jumlAdd = function jumlAdd() {
  throw new Error("Not supported on Montgomery curve");
};
Point$1.prototype.eq = function eq4(other) {
  return this.getX().cmp(other.getX()) === 0;
};
Point$1.prototype.normalize = function normalize() {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};
Point$1.prototype.getX = function getX2() {
  this.normalize();
  return this.x.fromRed();
};
var utils$h = utils$m;
var BN$4 = bnExports;
var inherits$1 = inherits_browserExports;
var Base = base;
var assert$c = utils$h.assert;
function EdwardsCurve(conf) {
  this.twisted = (conf.a | 0) !== 1;
  this.mOneA = this.twisted && (conf.a | 0) === -1;
  this.extended = this.mOneA;
  Base.call(this, "edwards", conf);
  this.a = new BN$4(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new BN$4(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new BN$4(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);
  assert$c(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) === 1;
}
inherits$1(EdwardsCurve, Base);
var edwards = EdwardsCurve;
EdwardsCurve.prototype._mulA = function _mulA(num) {
  if (this.mOneA)
    return num.redNeg();
  else
    return this.a.redMul(num);
};
EdwardsCurve.prototype._mulC = function _mulC(num) {
  if (this.oneC)
    return num;
  else
    return this.c.redMul(num);
};
EdwardsCurve.prototype.jpoint = function jpoint2(x3, y3, z3, t) {
  return this.point(x3, y3, z3, t);
};
EdwardsCurve.prototype.pointFromX = function pointFromX2(x3, odd) {
  x3 = new BN$4(x3, 16);
  if (!x3.red)
    x3 = x3.toRed(this.red);
  var x22 = x3.redSqr();
  var rhs = this.c2.redSub(this.a.redMul(x22));
  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x22));
  var y22 = rhs.redMul(lhs.redInvm());
  var y3 = y22.redSqrt();
  if (y3.redSqr().redSub(y22).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var isOdd = y3.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y3 = y3.redNeg();
  return this.point(x3, y3);
};
EdwardsCurve.prototype.pointFromY = function pointFromY(y3, odd) {
  y3 = new BN$4(y3, 16);
  if (!y3.red)
    y3 = y3.toRed(this.red);
  var y22 = y3.redSqr();
  var lhs = y22.redSub(this.c2);
  var rhs = y22.redMul(this.d).redMul(this.c2).redSub(this.a);
  var x22 = lhs.redMul(rhs.redInvm());
  if (x22.cmp(this.zero) === 0) {
    if (odd)
      throw new Error("invalid point");
    else
      return this.point(this.zero, y3);
  }
  var x3 = x22.redSqrt();
  if (x3.redSqr().redSub(x22).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  if (x3.fromRed().isOdd() !== odd)
    x3 = x3.redNeg();
  return this.point(x3, y3);
};
EdwardsCurve.prototype.validate = function validate5(point5) {
  if (point5.isInfinity())
    return true;
  point5.normalize();
  var x22 = point5.x.redSqr();
  var y22 = point5.y.redSqr();
  var lhs = x22.redMul(this.a).redAdd(y22);
  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x22).redMul(y22)));
  return lhs.cmp(rhs) === 0;
};
function Point(curve2, x3, y3, z3, t) {
  Base.BasePoint.call(this, curve2, "projective");
  if (x3 === null && y3 === null && z3 === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new BN$4(x3, 16);
    this.y = new BN$4(y3, 16);
    this.z = z3 ? new BN$4(z3, 16) : this.curve.one;
    this.t = t && new BN$4(t, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    if (this.t && !this.t.red)
      this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;
    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      if (!this.zOne)
        this.t = this.t.redMul(this.z.redInvm());
    }
  }
}
inherits$1(Point, Base.BasePoint);
EdwardsCurve.prototype.pointFromJSON = function pointFromJSON3(obj) {
  return Point.fromJSON(this, obj);
};
EdwardsCurve.prototype.point = function point4(x3, y3, z3, t) {
  return new Point(this, x3, y3, z3, t);
};
Point.fromJSON = function fromJSON3(curve2, obj) {
  return new Point(curve2, obj[0], obj[1], obj[2]);
};
Point.prototype.inspect = function inspect4() {
  if (this.isInfinity())
    return "<EC Point Infinity>";
  return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
Point.prototype.isInfinity = function isInfinity4() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
};
Point.prototype._extDbl = function _extDbl() {
  var a3 = this.x.redSqr();
  var b2 = this.y.redSqr();
  var c2 = this.z.redSqr();
  c2 = c2.redIAdd(c2);
  var d3 = this.curve._mulA(a3);
  var e = this.x.redAdd(this.y).redSqr().redISub(a3).redISub(b2);
  var g3 = d3.redAdd(b2);
  var f3 = g3.redSub(c2);
  var h3 = d3.redSub(b2);
  var nx = e.redMul(f3);
  var ny = g3.redMul(h3);
  var nt2 = e.redMul(h3);
  var nz = f3.redMul(g3);
  return this.curve.point(nx, ny, nz, nt2);
};
Point.prototype._projDbl = function _projDbl() {
  var b2 = this.x.redAdd(this.y).redSqr();
  var c2 = this.x.redSqr();
  var d3 = this.y.redSqr();
  var nx;
  var ny;
  var nz;
  var e;
  var h3;
  var j2;
  if (this.curve.twisted) {
    e = this.curve._mulA(c2);
    var f3 = e.redAdd(d3);
    if (this.zOne) {
      nx = b2.redSub(c2).redSub(d3).redMul(f3.redSub(this.curve.two));
      ny = f3.redMul(e.redSub(d3));
      nz = f3.redSqr().redSub(f3).redSub(f3);
    } else {
      h3 = this.z.redSqr();
      j2 = f3.redSub(h3).redISub(h3);
      nx = b2.redSub(c2).redISub(d3).redMul(j2);
      ny = f3.redMul(e.redSub(d3));
      nz = f3.redMul(j2);
    }
  } else {
    e = c2.redAdd(d3);
    h3 = this.curve._mulC(this.z).redSqr();
    j2 = e.redSub(h3).redSub(h3);
    nx = this.curve._mulC(b2.redISub(e)).redMul(j2);
    ny = this.curve._mulC(e).redMul(c2.redISub(d3));
    nz = e.redMul(j2);
  }
  return this.curve.point(nx, ny, nz);
};
Point.prototype.dbl = function dbl4() {
  if (this.isInfinity())
    return this;
  if (this.curve.extended)
    return this._extDbl();
  else
    return this._projDbl();
};
Point.prototype._extAdd = function _extAdd(p3) {
  var a3 = this.y.redSub(this.x).redMul(p3.y.redSub(p3.x));
  var b2 = this.y.redAdd(this.x).redMul(p3.y.redAdd(p3.x));
  var c2 = this.t.redMul(this.curve.dd).redMul(p3.t);
  var d3 = this.z.redMul(p3.z.redAdd(p3.z));
  var e = b2.redSub(a3);
  var f3 = d3.redSub(c2);
  var g3 = d3.redAdd(c2);
  var h3 = b2.redAdd(a3);
  var nx = e.redMul(f3);
  var ny = g3.redMul(h3);
  var nt2 = e.redMul(h3);
  var nz = f3.redMul(g3);
  return this.curve.point(nx, ny, nz, nt2);
};
Point.prototype._projAdd = function _projAdd(p3) {
  var a3 = this.z.redMul(p3.z);
  var b2 = a3.redSqr();
  var c2 = this.x.redMul(p3.x);
  var d3 = this.y.redMul(p3.y);
  var e = this.curve.d.redMul(c2).redMul(d3);
  var f3 = b2.redSub(e);
  var g3 = b2.redAdd(e);
  var tmp = this.x.redAdd(this.y).redMul(p3.x.redAdd(p3.y)).redISub(c2).redISub(d3);
  var nx = a3.redMul(f3).redMul(tmp);
  var ny;
  var nz;
  if (this.curve.twisted) {
    ny = a3.redMul(g3).redMul(d3.redSub(this.curve._mulA(c2)));
    nz = f3.redMul(g3);
  } else {
    ny = a3.redMul(g3).redMul(d3.redSub(c2));
    nz = this.curve._mulC(f3).redMul(g3);
  }
  return this.curve.point(nx, ny, nz);
};
Point.prototype.add = function add4(p3) {
  if (this.isInfinity())
    return p3;
  if (p3.isInfinity())
    return this;
  if (this.curve.extended)
    return this._extAdd(p3);
  else
    return this._projAdd(p3);
};
Point.prototype.mul = function mul4(k2) {
  if (this._hasDoubles(k2))
    return this.curve._fixedNafMul(this, k2);
  else
    return this.curve._wnafMul(this, k2);
};
Point.prototype.mulAdd = function mulAdd3(k1, p3, k2) {
  return this.curve._wnafMulAdd(1, [this, p3], [k1, k2], 2, false);
};
Point.prototype.jmulAdd = function jmulAdd2(k1, p3, k2) {
  return this.curve._wnafMulAdd(1, [this, p3], [k1, k2], 2, true);
};
Point.prototype.normalize = function normalize2() {
  if (this.zOne)
    return this;
  var zi2 = this.z.redInvm();
  this.x = this.x.redMul(zi2);
  this.y = this.y.redMul(zi2);
  if (this.t)
    this.t = this.t.redMul(zi2);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};
Point.prototype.neg = function neg3() {
  return this.curve.point(
    this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg()
  );
};
Point.prototype.getX = function getX3() {
  this.normalize();
  return this.x.fromRed();
};
Point.prototype.getY = function getY2() {
  this.normalize();
  return this.y.fromRed();
};
Point.prototype.eq = function eq5(other) {
  return this === other || this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0;
};
Point.prototype.eqXToP = function eqXToP2(x3) {
  var rx = x3.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0)
    return true;
  var xc = x3.clone();
  var t = this.curve.redN.redMul(this.z);
  for (; ; ) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;
    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};
Point.prototype.toP = Point.prototype.normalize;
Point.prototype.mixedAdd = Point.prototype.add;
(function(exports$1) {
  var curve2 = exports$1;
  curve2.base = base;
  curve2.short = short;
  curve2.mont = mont;
  curve2.edwards = edwards;
})(curve);
var curves$2 = {};
var hash$2 = {};
var utils$g = {};
var assert$b = minimalisticAssert;
var inherits = inherits_browserExports;
utils$g.inherits = inherits;
function isSurrogatePair(msg, i2) {
  if ((msg.charCodeAt(i2) & 64512) !== 55296) {
    return false;
  }
  if (i2 < 0 || i2 + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i2 + 1) & 64512) === 56320;
}
function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === "string") {
    if (!enc) {
      var p3 = 0;
      for (var i2 = 0; i2 < msg.length; i2++) {
        var c2 = msg.charCodeAt(i2);
        if (c2 < 128) {
          res[p3++] = c2;
        } else if (c2 < 2048) {
          res[p3++] = c2 >> 6 | 192;
          res[p3++] = c2 & 63 | 128;
        } else if (isSurrogatePair(msg, i2)) {
          c2 = 65536 + ((c2 & 1023) << 10) + (msg.charCodeAt(++i2) & 1023);
          res[p3++] = c2 >> 18 | 240;
          res[p3++] = c2 >> 12 & 63 | 128;
          res[p3++] = c2 >> 6 & 63 | 128;
          res[p3++] = c2 & 63 | 128;
        } else {
          res[p3++] = c2 >> 12 | 224;
          res[p3++] = c2 >> 6 & 63 | 128;
          res[p3++] = c2 & 63 | 128;
        }
      }
    } else if (enc === "hex") {
      msg = msg.replace(/[^a-z0-9]+/ig, "");
      if (msg.length % 2 !== 0)
        msg = "0" + msg;
      for (i2 = 0; i2 < msg.length; i2 += 2)
        res.push(parseInt(msg[i2] + msg[i2 + 1], 16));
    }
  } else {
    for (i2 = 0; i2 < msg.length; i2++)
      res[i2] = msg[i2] | 0;
  }
  return res;
}
utils$g.toArray = toArray;
function toHex(msg) {
  var res = "";
  for (var i2 = 0; i2 < msg.length; i2++)
    res += zero2(msg[i2].toString(16));
  return res;
}
utils$g.toHex = toHex;
function htonl(w2) {
  var res = w2 >>> 24 | w2 >>> 8 & 65280 | w2 << 8 & 16711680 | (w2 & 255) << 24;
  return res >>> 0;
}
utils$g.htonl = htonl;
function toHex32(msg, endian) {
  var res = "";
  for (var i2 = 0; i2 < msg.length; i2++) {
    var w2 = msg[i2];
    if (endian === "little")
      w2 = htonl(w2);
    res += zero8(w2.toString(16));
  }
  return res;
}
utils$g.toHex32 = toHex32;
function zero2(word) {
  if (word.length === 1)
    return "0" + word;
  else
    return word;
}
utils$g.zero2 = zero2;
function zero8(word) {
  if (word.length === 7)
    return "0" + word;
  else if (word.length === 6)
    return "00" + word;
  else if (word.length === 5)
    return "000" + word;
  else if (word.length === 4)
    return "0000" + word;
  else if (word.length === 3)
    return "00000" + word;
  else if (word.length === 2)
    return "000000" + word;
  else if (word.length === 1)
    return "0000000" + word;
  else
    return word;
}
utils$g.zero8 = zero8;
function join32(msg, start, end, endian) {
  var len = end - start;
  assert$b(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i2 = 0, k2 = start; i2 < res.length; i2++, k2 += 4) {
    var w2;
    if (endian === "big")
      w2 = msg[k2] << 24 | msg[k2 + 1] << 16 | msg[k2 + 2] << 8 | msg[k2 + 3];
    else
      w2 = msg[k2 + 3] << 24 | msg[k2 + 2] << 16 | msg[k2 + 1] << 8 | msg[k2];
    res[i2] = w2 >>> 0;
  }
  return res;
}
utils$g.join32 = join32;
function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i2 = 0, k2 = 0; i2 < msg.length; i2++, k2 += 4) {
    var m3 = msg[i2];
    if (endian === "big") {
      res[k2] = m3 >>> 24;
      res[k2 + 1] = m3 >>> 16 & 255;
      res[k2 + 2] = m3 >>> 8 & 255;
      res[k2 + 3] = m3 & 255;
    } else {
      res[k2 + 3] = m3 >>> 24;
      res[k2 + 2] = m3 >>> 16 & 255;
      res[k2 + 1] = m3 >>> 8 & 255;
      res[k2] = m3 & 255;
    }
  }
  return res;
}
utils$g.split32 = split32;
function rotr32$1(w2, b2) {
  return w2 >>> b2 | w2 << 32 - b2;
}
utils$g.rotr32 = rotr32$1;
function rotl32$2(w2, b2) {
  return w2 << b2 | w2 >>> 32 - b2;
}
utils$g.rotl32 = rotl32$2;
function sum32$3(a3, b2) {
  return a3 + b2 >>> 0;
}
utils$g.sum32 = sum32$3;
function sum32_3$1(a3, b2, c2) {
  return a3 + b2 + c2 >>> 0;
}
utils$g.sum32_3 = sum32_3$1;
function sum32_4$2(a3, b2, c2, d3) {
  return a3 + b2 + c2 + d3 >>> 0;
}
utils$g.sum32_4 = sum32_4$2;
function sum32_5$2(a3, b2, c2, d3, e) {
  return a3 + b2 + c2 + d3 + e >>> 0;
}
utils$g.sum32_5 = sum32_5$2;
function sum64$1(buf, pos, ah2, al) {
  var bh2 = buf[pos];
  var bl = buf[pos + 1];
  var lo = al + bl >>> 0;
  var hi2 = (lo < al ? 1 : 0) + ah2 + bh2;
  buf[pos] = hi2 >>> 0;
  buf[pos + 1] = lo;
}
utils$g.sum64 = sum64$1;
function sum64_hi$1(ah2, al, bh2, bl) {
  var lo = al + bl >>> 0;
  var hi2 = (lo < al ? 1 : 0) + ah2 + bh2;
  return hi2 >>> 0;
}
utils$g.sum64_hi = sum64_hi$1;
function sum64_lo$1(ah2, al, bh2, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
utils$g.sum64_lo = sum64_lo$1;
function sum64_4_hi$1(ah2, al, bh2, bl, ch2, cl, dh2, dl) {
  var carry = 0;
  var lo = al;
  lo = lo + bl >>> 0;
  carry += lo < al ? 1 : 0;
  lo = lo + cl >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = lo + dl >>> 0;
  carry += lo < dl ? 1 : 0;
  var hi2 = ah2 + bh2 + ch2 + dh2 + carry;
  return hi2 >>> 0;
}
utils$g.sum64_4_hi = sum64_4_hi$1;
function sum64_4_lo$1(ah2, al, bh2, bl, ch2, cl, dh2, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
utils$g.sum64_4_lo = sum64_4_lo$1;
function sum64_5_hi$1(ah2, al, bh2, bl, ch2, cl, dh2, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = lo + bl >>> 0;
  carry += lo < al ? 1 : 0;
  lo = lo + cl >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = lo + dl >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = lo + el >>> 0;
  carry += lo < el ? 1 : 0;
  var hi2 = ah2 + bh2 + ch2 + dh2 + eh + carry;
  return hi2 >>> 0;
}
utils$g.sum64_5_hi = sum64_5_hi$1;
function sum64_5_lo$1(ah2, al, bh2, bl, ch2, cl, dh2, dl, eh, el) {
  var lo = al + bl + cl + dl + el;
  return lo >>> 0;
}
utils$g.sum64_5_lo = sum64_5_lo$1;
function rotr64_hi$1(ah2, al, num) {
  var r2 = al << 32 - num | ah2 >>> num;
  return r2 >>> 0;
}
utils$g.rotr64_hi = rotr64_hi$1;
function rotr64_lo$1(ah2, al, num) {
  var r2 = ah2 << 32 - num | al >>> num;
  return r2 >>> 0;
}
utils$g.rotr64_lo = rotr64_lo$1;
function shr64_hi$1(ah2, al, num) {
  return ah2 >>> num;
}
utils$g.shr64_hi = shr64_hi$1;
function shr64_lo$1(ah2, al, num) {
  var r2 = ah2 << 32 - num | al >>> num;
  return r2 >>> 0;
}
utils$g.shr64_lo = shr64_lo$1;
var common$5 = {};
var utils$f = utils$g;
var assert$a = minimalisticAssert;
function BlockHash$4() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = "big";
  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
common$5.BlockHash = BlockHash$4;
BlockHash$4.prototype.update = function update(msg, enc) {
  msg = utils$f.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;
  if (this.pending.length >= this._delta8) {
    msg = this.pending;
    var r2 = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r2, msg.length);
    if (this.pending.length === 0)
      this.pending = null;
    msg = utils$f.join32(msg, 0, msg.length - r2, this.endian);
    for (var i2 = 0; i2 < msg.length; i2 += this._delta32)
      this._update(msg, i2, i2 + this._delta32);
  }
  return this;
};
BlockHash$4.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert$a(this.pending === null);
  return this._digest(enc);
};
BlockHash$4.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k2 = bytes - (len + this.padLength) % bytes;
  var res = new Array(k2 + this.padLength);
  res[0] = 128;
  for (var i2 = 1; i2 < k2; i2++)
    res[i2] = 0;
  len <<= 3;
  if (this.endian === "big") {
    for (var t = 8; t < this.padLength; t++)
      res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = len >>> 24 & 255;
    res[i2++] = len >>> 16 & 255;
    res[i2++] = len >>> 8 & 255;
    res[i2++] = len & 255;
  } else {
    res[i2++] = len & 255;
    res[i2++] = len >>> 8 & 255;
    res[i2++] = len >>> 16 & 255;
    res[i2++] = len >>> 24 & 255;
    res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = 0;
    res[i2++] = 0;
    for (t = 8; t < this.padLength; t++)
      res[i2++] = 0;
  }
  return res;
};
var sha = {};
var common$4 = {};
var utils$e = utils$g;
var rotr32 = utils$e.rotr32;
function ft_1$1(s2, x3, y3, z3) {
  if (s2 === 0)
    return ch32$1(x3, y3, z3);
  if (s2 === 1 || s2 === 3)
    return p32(x3, y3, z3);
  if (s2 === 2)
    return maj32$1(x3, y3, z3);
}
common$4.ft_1 = ft_1$1;
function ch32$1(x3, y3, z3) {
  return x3 & y3 ^ ~x3 & z3;
}
common$4.ch32 = ch32$1;
function maj32$1(x3, y3, z3) {
  return x3 & y3 ^ x3 & z3 ^ y3 & z3;
}
common$4.maj32 = maj32$1;
function p32(x3, y3, z3) {
  return x3 ^ y3 ^ z3;
}
common$4.p32 = p32;
function s0_256$1(x3) {
  return rotr32(x3, 2) ^ rotr32(x3, 13) ^ rotr32(x3, 22);
}
common$4.s0_256 = s0_256$1;
function s1_256$1(x3) {
  return rotr32(x3, 6) ^ rotr32(x3, 11) ^ rotr32(x3, 25);
}
common$4.s1_256 = s1_256$1;
function g0_256$1(x3) {
  return rotr32(x3, 7) ^ rotr32(x3, 18) ^ x3 >>> 3;
}
common$4.g0_256 = g0_256$1;
function g1_256$1(x3) {
  return rotr32(x3, 17) ^ rotr32(x3, 19) ^ x3 >>> 10;
}
common$4.g1_256 = g1_256$1;
var utils$d = utils$g;
var common$3 = common$5;
var shaCommon$1 = common$4;
var rotl32$1 = utils$d.rotl32;
var sum32$2 = utils$d.sum32;
var sum32_5$1 = utils$d.sum32_5;
var ft_1 = shaCommon$1.ft_1;
var BlockHash$3 = common$3.BlockHash;
var sha1_K = [
  1518500249,
  1859775393,
  2400959708,
  3395469782
];
function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();
  BlockHash$3.call(this);
  this.h = [
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ];
  this.W = new Array(80);
}
utils$d.inherits(SHA1, BlockHash$3);
var _1 = SHA1;
SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;
SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;
  for (var i2 = 0; i2 < 16; i2++)
    W[i2] = msg[start + i2];
  for (; i2 < W.length; i2++)
    W[i2] = rotl32$1(W[i2 - 3] ^ W[i2 - 8] ^ W[i2 - 14] ^ W[i2 - 16], 1);
  var a3 = this.h[0];
  var b2 = this.h[1];
  var c2 = this.h[2];
  var d3 = this.h[3];
  var e = this.h[4];
  for (i2 = 0; i2 < W.length; i2++) {
    var s2 = ~~(i2 / 20);
    var t = sum32_5$1(rotl32$1(a3, 5), ft_1(s2, b2, c2, d3), e, W[i2], sha1_K[s2]);
    e = d3;
    d3 = c2;
    c2 = rotl32$1(b2, 30);
    b2 = a3;
    a3 = t;
  }
  this.h[0] = sum32$2(this.h[0], a3);
  this.h[1] = sum32$2(this.h[1], b2);
  this.h[2] = sum32$2(this.h[2], c2);
  this.h[3] = sum32$2(this.h[3], d3);
  this.h[4] = sum32$2(this.h[4], e);
};
SHA1.prototype._digest = function digest2(enc) {
  if (enc === "hex")
    return utils$d.toHex32(this.h, "big");
  else
    return utils$d.split32(this.h, "big");
};
var utils$c = utils$g;
var common$2 = common$5;
var shaCommon = common$4;
var assert$9 = minimalisticAssert;
var sum32$1 = utils$c.sum32;
var sum32_4$1 = utils$c.sum32_4;
var sum32_5 = utils$c.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;
var BlockHash$2 = common$2.BlockHash;
var sha256_K = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
function SHA256$1() {
  if (!(this instanceof SHA256$1))
    return new SHA256$1();
  BlockHash$2.call(this);
  this.h = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils$c.inherits(SHA256$1, BlockHash$2);
var _256 = SHA256$1;
SHA256$1.blockSize = 512;
SHA256$1.outSize = 256;
SHA256$1.hmacStrength = 192;
SHA256$1.padLength = 64;
SHA256$1.prototype._update = function _update2(msg, start) {
  var W = this.W;
  for (var i2 = 0; i2 < 16; i2++)
    W[i2] = msg[start + i2];
  for (; i2 < W.length; i2++)
    W[i2] = sum32_4$1(g1_256(W[i2 - 2]), W[i2 - 7], g0_256(W[i2 - 15]), W[i2 - 16]);
  var a3 = this.h[0];
  var b2 = this.h[1];
  var c2 = this.h[2];
  var d3 = this.h[3];
  var e = this.h[4];
  var f3 = this.h[5];
  var g3 = this.h[6];
  var h3 = this.h[7];
  assert$9(this.k.length === W.length);
  for (i2 = 0; i2 < W.length; i2++) {
    var T1 = sum32_5(h3, s1_256(e), ch32(e, f3, g3), this.k[i2], W[i2]);
    var T2 = sum32$1(s0_256(a3), maj32(a3, b2, c2));
    h3 = g3;
    g3 = f3;
    f3 = e;
    e = sum32$1(d3, T1);
    d3 = c2;
    c2 = b2;
    b2 = a3;
    a3 = sum32$1(T1, T2);
  }
  this.h[0] = sum32$1(this.h[0], a3);
  this.h[1] = sum32$1(this.h[1], b2);
  this.h[2] = sum32$1(this.h[2], c2);
  this.h[3] = sum32$1(this.h[3], d3);
  this.h[4] = sum32$1(this.h[4], e);
  this.h[5] = sum32$1(this.h[5], f3);
  this.h[6] = sum32$1(this.h[6], g3);
  this.h[7] = sum32$1(this.h[7], h3);
};
SHA256$1.prototype._digest = function digest3(enc) {
  if (enc === "hex")
    return utils$c.toHex32(this.h, "big");
  else
    return utils$c.split32(this.h, "big");
};
var utils$b = utils$g;
var SHA256 = _256;
function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();
  SHA256.call(this);
  this.h = [
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ];
}
utils$b.inherits(SHA224, SHA256);
var _224 = SHA224;
SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;
SHA224.prototype._digest = function digest4(enc) {
  if (enc === "hex")
    return utils$b.toHex32(this.h.slice(0, 7), "big");
  else
    return utils$b.split32(this.h.slice(0, 7), "big");
};
var utils$a = utils$g;
var common$1 = common$5;
var assert$8 = minimalisticAssert;
var rotr64_hi = utils$a.rotr64_hi;
var rotr64_lo = utils$a.rotr64_lo;
var shr64_hi = utils$a.shr64_hi;
var shr64_lo = utils$a.shr64_lo;
var sum64 = utils$a.sum64;
var sum64_hi = utils$a.sum64_hi;
var sum64_lo = utils$a.sum64_lo;
var sum64_4_hi = utils$a.sum64_4_hi;
var sum64_4_lo = utils$a.sum64_4_lo;
var sum64_5_hi = utils$a.sum64_5_hi;
var sum64_5_lo = utils$a.sum64_5_lo;
var BlockHash$1 = common$1.BlockHash;
var sha512_K = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
];
function SHA512$1() {
  if (!(this instanceof SHA512$1))
    return new SHA512$1();
  BlockHash$1.call(this);
  this.h = [
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils$a.inherits(SHA512$1, BlockHash$1);
var _512 = SHA512$1;
SHA512$1.blockSize = 1024;
SHA512$1.outSize = 512;
SHA512$1.hmacStrength = 192;
SHA512$1.padLength = 128;
SHA512$1.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;
  for (var i2 = 0; i2 < 32; i2++)
    W[i2] = msg[start + i2];
  for (; i2 < W.length; i2 += 2) {
    var c0_hi = g1_512_hi(W[i2 - 4], W[i2 - 3]);
    var c0_lo = g1_512_lo(W[i2 - 4], W[i2 - 3]);
    var c1_hi = W[i2 - 14];
    var c1_lo = W[i2 - 13];
    var c2_hi = g0_512_hi(W[i2 - 30], W[i2 - 29]);
    var c2_lo = g0_512_lo(W[i2 - 30], W[i2 - 29]);
    var c3_hi = W[i2 - 32];
    var c3_lo = W[i2 - 31];
    W[i2] = sum64_4_hi(
      c0_hi,
      c0_lo,
      c1_hi,
      c1_lo,
      c2_hi,
      c2_lo,
      c3_hi,
      c3_lo
    );
    W[i2 + 1] = sum64_4_lo(
      c0_hi,
      c0_lo,
      c1_hi,
      c1_lo,
      c2_hi,
      c2_lo,
      c3_hi,
      c3_lo
    );
  }
};
SHA512$1.prototype._update = function _update3(msg, start) {
  this._prepareBlock(msg, start);
  var W = this.W;
  var ah2 = this.h[0];
  var al = this.h[1];
  var bh2 = this.h[2];
  var bl = this.h[3];
  var ch2 = this.h[4];
  var cl = this.h[5];
  var dh2 = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh2 = this.h[10];
  var fl = this.h[11];
  var gh2 = this.h[12];
  var gl = this.h[13];
  var hh2 = this.h[14];
  var hl = this.h[15];
  assert$8(this.k.length === W.length);
  for (var i2 = 0; i2 < W.length; i2 += 2) {
    var c0_hi = hh2;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh2, fl, gh2);
    var c2_lo = ch64_lo(eh, el, fh2, fl, gh2, gl);
    var c3_hi = this.k[i2];
    var c3_lo = this.k[i2 + 1];
    var c4_hi = W[i2];
    var c4_lo = W[i2 + 1];
    var T1_hi = sum64_5_hi(
      c0_hi,
      c0_lo,
      c1_hi,
      c1_lo,
      c2_hi,
      c2_lo,
      c3_hi,
      c3_lo,
      c4_hi,
      c4_lo
    );
    var T1_lo = sum64_5_lo(
      c0_hi,
      c0_lo,
      c1_hi,
      c1_lo,
      c2_hi,
      c2_lo,
      c3_hi,
      c3_lo,
      c4_hi,
      c4_lo
    );
    c0_hi = s0_512_hi(ah2, al);
    c0_lo = s0_512_lo(ah2, al);
    c1_hi = maj64_hi(ah2, al, bh2, bl, ch2);
    c1_lo = maj64_lo(ah2, al, bh2, bl, ch2, cl);
    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
    hh2 = gh2;
    hl = gl;
    gh2 = fh2;
    gl = fl;
    fh2 = eh;
    fl = el;
    eh = sum64_hi(dh2, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);
    dh2 = ch2;
    dl = cl;
    ch2 = bh2;
    cl = bl;
    bh2 = ah2;
    bl = al;
    ah2 = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }
  sum64(this.h, 0, ah2, al);
  sum64(this.h, 2, bh2, bl);
  sum64(this.h, 4, ch2, cl);
  sum64(this.h, 6, dh2, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh2, fl);
  sum64(this.h, 12, gh2, gl);
  sum64(this.h, 14, hh2, hl);
};
SHA512$1.prototype._digest = function digest5(enc) {
  if (enc === "hex")
    return utils$a.toHex32(this.h, "big");
  else
    return utils$a.split32(this.h, "big");
};
function ch64_hi(xh2, xl, yh2, yl, zh) {
  var r2 = xh2 & yh2 ^ ~xh2 & zh;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function ch64_lo(xh2, xl, yh2, yl, zh, zl) {
  var r2 = xl & yl ^ ~xl & zl;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function maj64_hi(xh2, xl, yh2, yl, zh) {
  var r2 = xh2 & yh2 ^ xh2 & zh ^ yh2 & zh;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function maj64_lo(xh2, xl, yh2, yl, zh, zl) {
  var r2 = xl & yl ^ xl & zl ^ yl & zl;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function s0_512_hi(xh2, xl) {
  var c0_hi = rotr64_hi(xh2, xl, 28);
  var c1_hi = rotr64_hi(xl, xh2, 2);
  var c2_hi = rotr64_hi(xl, xh2, 7);
  var r2 = c0_hi ^ c1_hi ^ c2_hi;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function s0_512_lo(xh2, xl) {
  var c0_lo = rotr64_lo(xh2, xl, 28);
  var c1_lo = rotr64_lo(xl, xh2, 2);
  var c2_lo = rotr64_lo(xl, xh2, 7);
  var r2 = c0_lo ^ c1_lo ^ c2_lo;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function s1_512_hi(xh2, xl) {
  var c0_hi = rotr64_hi(xh2, xl, 14);
  var c1_hi = rotr64_hi(xh2, xl, 18);
  var c2_hi = rotr64_hi(xl, xh2, 9);
  var r2 = c0_hi ^ c1_hi ^ c2_hi;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function s1_512_lo(xh2, xl) {
  var c0_lo = rotr64_lo(xh2, xl, 14);
  var c1_lo = rotr64_lo(xh2, xl, 18);
  var c2_lo = rotr64_lo(xl, xh2, 9);
  var r2 = c0_lo ^ c1_lo ^ c2_lo;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function g0_512_hi(xh2, xl) {
  var c0_hi = rotr64_hi(xh2, xl, 1);
  var c1_hi = rotr64_hi(xh2, xl, 8);
  var c2_hi = shr64_hi(xh2, xl, 7);
  var r2 = c0_hi ^ c1_hi ^ c2_hi;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function g0_512_lo(xh2, xl) {
  var c0_lo = rotr64_lo(xh2, xl, 1);
  var c1_lo = rotr64_lo(xh2, xl, 8);
  var c2_lo = shr64_lo(xh2, xl, 7);
  var r2 = c0_lo ^ c1_lo ^ c2_lo;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function g1_512_hi(xh2, xl) {
  var c0_hi = rotr64_hi(xh2, xl, 19);
  var c1_hi = rotr64_hi(xl, xh2, 29);
  var c2_hi = shr64_hi(xh2, xl, 6);
  var r2 = c0_hi ^ c1_hi ^ c2_hi;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
function g1_512_lo(xh2, xl) {
  var c0_lo = rotr64_lo(xh2, xl, 19);
  var c1_lo = rotr64_lo(xl, xh2, 29);
  var c2_lo = shr64_lo(xh2, xl, 6);
  var r2 = c0_lo ^ c1_lo ^ c2_lo;
  if (r2 < 0)
    r2 += 4294967296;
  return r2;
}
var utils$9 = utils$g;
var SHA512 = _512;
function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();
  SHA512.call(this);
  this.h = [
    3418070365,
    3238371032,
    1654270250,
    914150663,
    2438529370,
    812702999,
    355462360,
    4144912697,
    1731405415,
    4290775857,
    2394180231,
    1750603025,
    3675008525,
    1694076839,
    1203062813,
    3204075428
  ];
}
utils$9.inherits(SHA384, SHA512);
var _384 = SHA384;
SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;
SHA384.prototype._digest = function digest6(enc) {
  if (enc === "hex")
    return utils$9.toHex32(this.h.slice(0, 12), "big");
  else
    return utils$9.split32(this.h.slice(0, 12), "big");
};
sha.sha1 = _1;
sha.sha224 = _224;
sha.sha256 = _256;
sha.sha384 = _384;
sha.sha512 = _512;
var ripemd = {};
var utils$8 = utils$g;
var common = common$5;
var rotl32 = utils$8.rotl32;
var sum32 = utils$8.sum32;
var sum32_3 = utils$8.sum32_3;
var sum32_4 = utils$8.sum32_4;
var BlockHash = common.BlockHash;
function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();
  BlockHash.call(this);
  this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  this.endian = "little";
}
utils$8.inherits(RIPEMD160, BlockHash);
ripemd.ripemd160 = RIPEMD160;
RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;
RIPEMD160.prototype._update = function update2(msg, start) {
  var A2 = this.h[0];
  var B2 = this.h[1];
  var C3 = this.h[2];
  var D2 = this.h[3];
  var E2 = this.h[4];
  var Ah2 = A2;
  var Bh = B2;
  var Ch = C3;
  var Dh = D2;
  var Eh2 = E2;
  for (var j2 = 0; j2 < 80; j2++) {
    var T2 = sum32(
      rotl32(
        sum32_4(A2, f$3(j2, B2, C3, D2), msg[r[j2] + start], K$1(j2)),
        s[j2]
      ),
      E2
    );
    A2 = E2;
    E2 = D2;
    D2 = rotl32(C3, 10);
    C3 = B2;
    B2 = T2;
    T2 = sum32(
      rotl32(
        sum32_4(Ah2, f$3(79 - j2, Bh, Ch, Dh), msg[rh[j2] + start], Kh(j2)),
        sh$1[j2]
      ),
      Eh2
    );
    Ah2 = Eh2;
    Eh2 = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T2;
  }
  T2 = sum32_3(this.h[1], C3, Dh);
  this.h[1] = sum32_3(this.h[2], D2, Eh2);
  this.h[2] = sum32_3(this.h[3], E2, Ah2);
  this.h[3] = sum32_3(this.h[4], A2, Bh);
  this.h[4] = sum32_3(this.h[0], B2, Ch);
  this.h[0] = T2;
};
RIPEMD160.prototype._digest = function digest7(enc) {
  if (enc === "hex")
    return utils$8.toHex32(this.h, "little");
  else
    return utils$8.split32(this.h, "little");
};
function f$3(j2, x3, y3, z3) {
  if (j2 <= 15)
    return x3 ^ y3 ^ z3;
  else if (j2 <= 31)
    return x3 & y3 | ~x3 & z3;
  else if (j2 <= 47)
    return (x3 | ~y3) ^ z3;
  else if (j2 <= 63)
    return x3 & z3 | y3 & ~z3;
  else
    return x3 ^ (y3 | ~z3);
}
function K$1(j2) {
  if (j2 <= 15)
    return 0;
  else if (j2 <= 31)
    return 1518500249;
  else if (j2 <= 47)
    return 1859775393;
  else if (j2 <= 63)
    return 2400959708;
  else
    return 2840853838;
}
function Kh(j2) {
  if (j2 <= 15)
    return 1352829926;
  else if (j2 <= 31)
    return 1548603684;
  else if (j2 <= 47)
    return 1836072691;
  else if (j2 <= 63)
    return 2053994217;
  else
    return 0;
}
var r = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
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
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
];
var rh = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
];
var s = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
];
var sh$1 = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
];
var utils$7 = utils$g;
var assert$7 = minimalisticAssert;
function Hmac(hash3, key2, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash3, key2, enc);
  this.Hash = hash3;
  this.blockSize = hash3.blockSize / 8;
  this.outSize = hash3.outSize / 8;
  this.inner = null;
  this.outer = null;
  this._init(utils$7.toArray(key2, enc));
}
var hmac = Hmac;
Hmac.prototype._init = function init(key2) {
  if (key2.length > this.blockSize)
    key2 = new this.Hash().update(key2).digest();
  assert$7(key2.length <= this.blockSize);
  for (var i2 = key2.length; i2 < this.blockSize; i2++)
    key2.push(0);
  for (i2 = 0; i2 < key2.length; i2++)
    key2[i2] ^= 54;
  this.inner = new this.Hash().update(key2);
  for (i2 = 0; i2 < key2.length; i2++)
    key2[i2] ^= 106;
  this.outer = new this.Hash().update(key2);
};
Hmac.prototype.update = function update3(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};
Hmac.prototype.digest = function digest8(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};
(function(exports$1) {
  var hash3 = exports$1;
  hash3.utils = utils$g;
  hash3.common = common$5;
  hash3.sha = sha;
  hash3.ripemd = ripemd;
  hash3.hmac = hmac;
  hash3.sha1 = hash3.sha.sha1;
  hash3.sha256 = hash3.sha.sha256;
  hash3.sha224 = hash3.sha.sha224;
  hash3.sha384 = hash3.sha.sha384;
  hash3.sha512 = hash3.sha.sha512;
  hash3.ripemd160 = hash3.ripemd.ripemd160;
})(hash$2);
var secp256k1;
var hasRequiredSecp256k1;
function requireSecp256k1() {
  if (hasRequiredSecp256k1) return secp256k1;
  hasRequiredSecp256k1 = 1;
  secp256k1 = {
    doubles: {
      step: 4,
      points: [
        [
          "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
          "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
        ],
        [
          "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
          "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
        ],
        [
          "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
          "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
        ],
        [
          "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
          "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
        ],
        [
          "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
          "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
        ],
        [
          "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
          "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
        ],
        [
          "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
          "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
        ],
        [
          "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
          "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
        ],
        [
          "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
          "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
        ],
        [
          "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
          "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
        ],
        [
          "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
          "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
        ],
        [
          "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
          "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
        ],
        [
          "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
          "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
        ],
        [
          "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
          "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
        ],
        [
          "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
          "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
        ],
        [
          "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
          "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
        ],
        [
          "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
          "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
        ],
        [
          "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
          "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
        ],
        [
          "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
          "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
        ],
        [
          "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
          "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
        ],
        [
          "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
          "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
        ],
        [
          "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
          "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
        ],
        [
          "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
          "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
        ],
        [
          "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
          "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
        ],
        [
          "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
          "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
        ],
        [
          "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
          "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
        ],
        [
          "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
          "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
        ],
        [
          "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
          "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
        ],
        [
          "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
          "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
        ],
        [
          "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
          "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
        ],
        [
          "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
          "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
        ],
        [
          "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
          "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
        ],
        [
          "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
          "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
        ],
        [
          "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
          "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
        ],
        [
          "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
          "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
        ],
        [
          "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
          "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
        ],
        [
          "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
          "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
        ],
        [
          "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
          "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
        ],
        [
          "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
          "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
        ],
        [
          "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
          "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
        ],
        [
          "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
          "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
        ],
        [
          "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
          "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
        ],
        [
          "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
          "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
        ],
        [
          "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
          "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
        ],
        [
          "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
          "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
        ],
        [
          "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
          "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
        ],
        [
          "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
          "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
        ],
        [
          "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
          "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
        ],
        [
          "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
          "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
        ],
        [
          "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
          "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
        ],
        [
          "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
          "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
        ],
        [
          "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
          "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
        ],
        [
          "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
          "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
        ],
        [
          "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
          "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
        ],
        [
          "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
          "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
        ],
        [
          "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
          "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
        ],
        [
          "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
          "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
        ],
        [
          "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
          "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
        ],
        [
          "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
          "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
        ],
        [
          "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
          "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
        ],
        [
          "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
          "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
        ],
        [
          "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
          "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
        ],
        [
          "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
          "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
        ],
        [
          "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
          "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
        ],
        [
          "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
          "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
        ]
      ]
    },
    naf: {
      wnd: 7,
      points: [
        [
          "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
          "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
        ],
        [
          "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
          "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
        ],
        [
          "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
          "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
        ],
        [
          "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
          "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
        ],
        [
          "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
          "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
        ],
        [
          "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
          "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
        ],
        [
          "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
          "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
        ],
        [
          "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
          "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
        ],
        [
          "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
          "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
        ],
        [
          "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
          "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
        ],
        [
          "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
          "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
        ],
        [
          "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
          "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
        ],
        [
          "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
          "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
        ],
        [
          "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
          "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
        ],
        [
          "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
          "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
        ],
        [
          "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
          "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
        ],
        [
          "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
          "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
        ],
        [
          "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
          "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
        ],
        [
          "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
          "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
        ],
        [
          "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
          "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
        ],
        [
          "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
          "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
        ],
        [
          "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
          "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
        ],
        [
          "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
          "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
        ],
        [
          "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
          "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
        ],
        [
          "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
          "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
        ],
        [
          "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
          "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
        ],
        [
          "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
          "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
        ],
        [
          "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
          "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
        ],
        [
          "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
          "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
        ],
        [
          "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
          "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
        ],
        [
          "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
          "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
        ],
        [
          "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
          "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
        ],
        [
          "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
          "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
        ],
        [
          "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
          "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
        ],
        [
          "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
          "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
        ],
        [
          "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
          "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
        ],
        [
          "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
          "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
        ],
        [
          "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
          "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
        ],
        [
          "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
          "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
        ],
        [
          "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
          "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
        ],
        [
          "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
          "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
        ],
        [
          "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
          "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
        ],
        [
          "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
          "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
        ],
        [
          "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
          "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
        ],
        [
          "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
          "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
        ],
        [
          "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
          "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
        ],
        [
          "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
          "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
        ],
        [
          "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
          "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
        ],
        [
          "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
          "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
        ],
        [
          "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
          "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
        ],
        [
          "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
          "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
        ],
        [
          "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
          "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
        ],
        [
          "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
          "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
        ],
        [
          "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
          "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
        ],
        [
          "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
          "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
        ],
        [
          "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
          "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
        ],
        [
          "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
          "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
        ],
        [
          "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
          "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
        ],
        [
          "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
          "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
        ],
        [
          "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
          "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
        ],
        [
          "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
          "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
        ],
        [
          "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
          "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
        ],
        [
          "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
          "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
        ],
        [
          "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
          "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
        ],
        [
          "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
          "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
        ],
        [
          "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
          "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
        ],
        [
          "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
          "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
        ],
        [
          "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
          "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
        ],
        [
          "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
          "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
        ],
        [
          "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
          "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
        ],
        [
          "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
          "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
        ],
        [
          "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
          "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
        ],
        [
          "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
          "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
        ],
        [
          "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
          "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
        ],
        [
          "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
          "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
        ],
        [
          "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
          "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
        ],
        [
          "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
          "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
        ],
        [
          "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
          "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
        ],
        [
          "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
          "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
        ],
        [
          "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
          "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
        ],
        [
          "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
          "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
        ],
        [
          "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
          "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
        ],
        [
          "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
          "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
        ],
        [
          "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
          "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
        ],
        [
          "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
          "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
        ],
        [
          "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
          "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
        ],
        [
          "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
          "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
        ],
        [
          "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
          "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
        ],
        [
          "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
          "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
        ],
        [
          "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
          "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
        ],
        [
          "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
          "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
        ],
        [
          "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
          "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
        ],
        [
          "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
          "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
        ],
        [
          "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
          "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
        ],
        [
          "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
          "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
        ],
        [
          "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
          "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
        ],
        [
          "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
          "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
        ],
        [
          "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
          "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
        ],
        [
          "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
          "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
        ],
        [
          "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
          "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
        ],
        [
          "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
          "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
        ],
        [
          "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
          "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
        ],
        [
          "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
          "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
        ],
        [
          "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
          "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
        ],
        [
          "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
          "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
        ],
        [
          "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
          "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
        ],
        [
          "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
          "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
        ],
        [
          "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
          "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
        ],
        [
          "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
          "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
        ],
        [
          "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
          "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
        ],
        [
          "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
          "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
        ],
        [
          "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
          "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
        ],
        [
          "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
          "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
        ],
        [
          "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
          "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
        ],
        [
          "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
          "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
        ],
        [
          "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
          "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
        ],
        [
          "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
          "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
        ],
        [
          "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
          "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
        ],
        [
          "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
          "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
        ],
        [
          "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
          "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
        ],
        [
          "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
          "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
        ],
        [
          "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
          "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
        ],
        [
          "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
          "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
        ],
        [
          "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
          "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
        ],
        [
          "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
          "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
        ],
        [
          "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
          "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
        ],
        [
          "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
          "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
        ]
      ]
    }
  };
  return secp256k1;
}
(function(exports$1) {
  var curves2 = exports$1;
  var hash3 = hash$2;
  var curve$1 = curve;
  var utils2 = utils$m;
  var assert2 = utils2.assert;
  function PresetCurve(options) {
    if (options.type === "short")
      this.curve = new curve$1.short(options);
    else if (options.type === "edwards")
      this.curve = new curve$1.edwards(options);
    else
      this.curve = new curve$1.mont(options);
    this.g = this.curve.g;
    this.n = this.curve.n;
    this.hash = options.hash;
    assert2(this.g.validate(), "Invalid curve");
    assert2(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  curves2.PresetCurve = PresetCurve;
  function defineCurve(name, options) {
    Object.defineProperty(curves2, name, {
      configurable: true,
      enumerable: true,
      get: function() {
        var curve2 = new PresetCurve(options);
        Object.defineProperty(curves2, name, {
          configurable: true,
          enumerable: true,
          value: curve2
        });
        return curve2;
      }
    });
  }
  defineCurve("p192", {
    type: "short",
    prime: "p192",
    p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
    b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
    n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
    hash: hash3.sha256,
    gRed: false,
    g: [
      "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
      "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
    ]
  });
  defineCurve("p224", {
    type: "short",
    prime: "p224",
    p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
    b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
    n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
    hash: hash3.sha256,
    gRed: false,
    g: [
      "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
      "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
    ]
  });
  defineCurve("p256", {
    type: "short",
    prime: null,
    p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
    a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
    b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
    n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
    hash: hash3.sha256,
    gRed: false,
    g: [
      "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
      "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
    ]
  });
  defineCurve("p384", {
    type: "short",
    prime: null,
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
    a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
    b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
    n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
    hash: hash3.sha384,
    gRed: false,
    g: [
      "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
      "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
    ]
  });
  defineCurve("p521", {
    type: "short",
    prime: null,
    p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
    a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
    b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
    n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
    hash: hash3.sha512,
    gRed: false,
    g: [
      "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
      "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
    ]
  });
  defineCurve("curve25519", {
    type: "mont",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "76d06",
    b: "1",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: hash3.sha256,
    gRed: false,
    g: [
      "9"
    ]
  });
  defineCurve("ed25519", {
    type: "edwards",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "-1",
    c: "1",
    // -121665 * (121666^(-1)) (mod P)
    d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: hash3.sha256,
    gRed: false,
    g: [
      "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      // 4/5
      "6666666666666666666666666666666666666666666666666666666666666658"
    ]
  });
  var pre;
  try {
    pre = requireSecp256k1();
  } catch (e) {
    pre = void 0;
  }
  defineCurve("secp256k1", {
    type: "short",
    prime: "k256",
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
    a: "0",
    b: "7",
    n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
    h: "1",
    hash: hash3.sha256,
    // Precomputed endomorphism
    beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
    lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
    basis: [
      {
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      },
      {
        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
        b: "3086d221a7d46bcde86c90e49284eb15"
      }
    ],
    gRed: false,
    g: [
      "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
      "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
      pre
    ]
  });
})(curves$2);
var hash$1 = hash$2;
var utils$6 = utils$l;
var assert$6 = minimalisticAssert;
function HmacDRBG$1(options) {
  if (!(this instanceof HmacDRBG$1))
    return new HmacDRBG$1(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;
  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;
  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;
  var entropy = utils$6.toArray(options.entropy, options.entropyEnc || "hex");
  var nonce = utils$6.toArray(options.nonce, options.nonceEnc || "hex");
  var pers = utils$6.toArray(options.pers, options.persEnc || "hex");
  assert$6(
    entropy.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  );
  this._init(entropy, nonce, pers);
}
var hmacDrbg = HmacDRBG$1;
HmacDRBG$1.prototype._init = function init2(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);
  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i2 = 0; i2 < this.V.length; i2++) {
    this.K[i2] = 0;
    this.V[i2] = 1;
  }
  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 281474976710656;
};
HmacDRBG$1.prototype._hmac = function hmac2() {
  return new hash$1.hmac(this.hash, this.K);
};
HmacDRBG$1.prototype._update = function update4(seed) {
  var kmac = this._hmac().update(this.V).update([0]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;
  this.K = this._hmac().update(this.V).update([1]).update(seed).digest();
  this.V = this._hmac().update(this.V).digest();
};
HmacDRBG$1.prototype.reseed = function reseed(entropy, entropyEnc, add5, addEnc) {
  if (typeof entropyEnc !== "string") {
    addEnc = add5;
    add5 = entropyEnc;
    entropyEnc = null;
  }
  entropy = utils$6.toArray(entropy, entropyEnc);
  add5 = utils$6.toArray(add5, addEnc);
  assert$6(
    entropy.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  );
  this._update(entropy.concat(add5 || []));
  this._reseed = 1;
};
HmacDRBG$1.prototype.generate = function generate2(len, enc, add5, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error("Reseed is required");
  if (typeof enc !== "string") {
    addEnc = add5;
    add5 = enc;
    enc = null;
  }
  if (add5) {
    add5 = utils$6.toArray(add5, addEnc || "hex");
    this._update(add5);
  }
  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }
  var res = temp.slice(0, len);
  this._update(add5);
  this._reseed++;
  return utils$6.encode(res, enc);
};
var BN$3 = bnExports;
var utils$5 = utils$m;
var assert$5 = utils$5.assert;
function KeyPair$3(ec2, options) {
  this.ec = ec2;
  this.priv = null;
  this.pub = null;
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
var key$1 = KeyPair$3;
KeyPair$3.fromPublic = function fromPublic(ec2, pub2, enc) {
  if (pub2 instanceof KeyPair$3)
    return pub2;
  return new KeyPair$3(ec2, {
    pub: pub2,
    pubEnc: enc
  });
};
KeyPair$3.fromPrivate = function fromPrivate(ec2, priv2, enc) {
  if (priv2 instanceof KeyPair$3)
    return priv2;
  return new KeyPair$3(ec2, {
    priv: priv2,
    privEnc: enc
  });
};
KeyPair$3.prototype.validate = function validate6() {
  var pub2 = this.getPublic();
  if (pub2.isInfinity())
    return { result: false, reason: "Invalid public key" };
  if (!pub2.validate())
    return { result: false, reason: "Public key is not a point" };
  if (!pub2.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: "Public key * N != O" };
  return { result: true, reason: null };
};
KeyPair$3.prototype.getPublic = function getPublic(compact, enc) {
  if (typeof compact === "string") {
    enc = compact;
    compact = null;
  }
  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);
  if (!enc)
    return this.pub;
  return this.pub.encode(enc, compact);
};
KeyPair$3.prototype.getPrivate = function getPrivate(enc) {
  if (enc === "hex")
    return this.priv.toString(16, 2);
  else
    return this.priv;
};
KeyPair$3.prototype._importPrivate = function _importPrivate(key2, enc) {
  this.priv = new BN$3(key2, enc || 16);
  this.priv = this.priv.umod(this.ec.curve.n);
};
KeyPair$3.prototype._importPublic = function _importPublic(key2, enc) {
  if (key2.x || key2.y) {
    if (this.ec.curve.type === "mont") {
      assert$5(key2.x, "Need x coordinate");
    } else if (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") {
      assert$5(key2.x && key2.y, "Need both x and y coordinate");
    }
    this.pub = this.ec.curve.point(key2.x, key2.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key2, enc);
};
KeyPair$3.prototype.derive = function derive(pub2) {
  if (!pub2.validate()) {
    assert$5(pub2.validate(), "public point not validated");
  }
  return pub2.mul(this.priv).getX();
};
KeyPair$3.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};
KeyPair$3.prototype.verify = function verify(msg, signature2, options) {
  return this.ec.verify(msg, signature2, this, void 0, options);
};
KeyPair$3.prototype.inspect = function inspect5() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var BN$2 = bnExports;
var utils$4 = utils$m;
var assert$4 = utils$4.assert;
function Signature$3(options, enc) {
  if (options instanceof Signature$3)
    return options;
  if (this._importDER(options, enc))
    return;
  assert$4(options.r && options.s, "Signature without r or s");
  this.r = new BN$2(options.r, 16);
  this.s = new BN$2(options.s, 16);
  if (options.recoveryParam === void 0)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
var signature$1 = Signature$3;
function Position() {
  this.place = 0;
}
function getLength(buf, p3) {
  var initial = buf[p3.place++];
  if (!(initial & 128)) {
    return initial;
  }
  var octetLen = initial & 15;
  if (octetLen === 0 || octetLen > 4) {
    return false;
  }
  if (buf[p3.place] === 0) {
    return false;
  }
  var val = 0;
  for (var i2 = 0, off = p3.place; i2 < octetLen; i2++, off++) {
    val <<= 8;
    val |= buf[off];
    val >>>= 0;
  }
  if (val <= 127) {
    return false;
  }
  p3.place = off;
  return val;
}
function rmPadding(buf) {
  var i2 = 0;
  var len = buf.length - 1;
  while (!buf[i2] && !(buf[i2 + 1] & 128) && i2 < len) {
    i2++;
  }
  if (i2 === 0) {
    return buf;
  }
  return buf.slice(i2);
}
Signature$3.prototype._importDER = function _importDER(data, enc) {
  data = utils$4.toArray(data, enc);
  var p3 = new Position();
  if (data[p3.place++] !== 48) {
    return false;
  }
  var len = getLength(data, p3);
  if (len === false) {
    return false;
  }
  if (len + p3.place !== data.length) {
    return false;
  }
  if (data[p3.place++] !== 2) {
    return false;
  }
  var rlen = getLength(data, p3);
  if (rlen === false) {
    return false;
  }
  if ((data[p3.place] & 128) !== 0) {
    return false;
  }
  var r2 = data.slice(p3.place, rlen + p3.place);
  p3.place += rlen;
  if (data[p3.place++] !== 2) {
    return false;
  }
  var slen = getLength(data, p3);
  if (slen === false) {
    return false;
  }
  if (data.length !== slen + p3.place) {
    return false;
  }
  if ((data[p3.place] & 128) !== 0) {
    return false;
  }
  var s2 = data.slice(p3.place, slen + p3.place);
  if (r2[0] === 0) {
    if (r2[1] & 128) {
      r2 = r2.slice(1);
    } else {
      return false;
    }
  }
  if (s2[0] === 0) {
    if (s2[1] & 128) {
      s2 = s2.slice(1);
    } else {
      return false;
    }
  }
  this.r = new BN$2(r2);
  this.s = new BN$2(s2);
  this.recoveryParam = null;
  return true;
};
function constructLength(arr, len) {
  if (len < 128) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 128);
  while (--octets) {
    arr.push(len >>> (octets << 3) & 255);
  }
  arr.push(len);
}
Signature$3.prototype.toDER = function toDER(enc) {
  var r2 = this.r.toArray();
  var s2 = this.s.toArray();
  if (r2[0] & 128)
    r2 = [0].concat(r2);
  if (s2[0] & 128)
    s2 = [0].concat(s2);
  r2 = rmPadding(r2);
  s2 = rmPadding(s2);
  while (!s2[0] && !(s2[1] & 128)) {
    s2 = s2.slice(1);
  }
  var arr = [2];
  constructLength(arr, r2.length);
  arr = arr.concat(r2);
  arr.push(2);
  constructLength(arr, s2.length);
  var backHalf = arr.concat(s2);
  var res = [48];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils$4.encode(res, enc);
};
var BN$1 = bnExports;
var HmacDRBG = hmacDrbg;
var utils$3 = utils$m;
var curves$1 = curves$2;
var rand2 = brorandExports;
var assert$3 = utils$3.assert;
var KeyPair$2 = key$1;
var Signature$2 = signature$1;
function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);
  if (typeof options === "string") {
    assert$3(
      Object.prototype.hasOwnProperty.call(curves$1, options),
      "Unknown curve " + options
    );
    options = curves$1[options];
  }
  if (options instanceof curves$1.PresetCurve)
    options = { curve: options };
  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);
  this.hash = options.hash || options.curve.hash;
}
var ec = EC;
EC.prototype.keyPair = function keyPair(options) {
  return new KeyPair$2(this, options);
};
EC.prototype.keyFromPrivate = function keyFromPrivate(priv2, enc) {
  return KeyPair$2.fromPrivate(this, priv2, enc);
};
EC.prototype.keyFromPublic = function keyFromPublic(pub2, enc) {
  return KeyPair$2.fromPublic(this, pub2, enc);
};
EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};
  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || "utf8",
    entropy: options.entropy || rand2(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || "utf8",
    nonce: this.n.toArray()
  });
  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new BN$1(2));
  for (; ; ) {
    var priv2 = new BN$1(drbg.generate(bytes));
    if (priv2.cmp(ns2) > 0)
      continue;
    priv2.iaddn(1);
    return this.keyFromPrivate(priv2);
  }
};
EC.prototype._truncateToN = function _truncateToN(msg, truncOnly, bitLength) {
  var byteLength;
  if (BN$1.isBN(msg) || typeof msg === "number") {
    msg = new BN$1(msg, 16);
    byteLength = msg.byteLength();
  } else if (typeof msg === "object") {
    byteLength = msg.length;
    msg = new BN$1(msg, 16);
  } else {
    var str = msg.toString();
    byteLength = str.length + 1 >>> 1;
    msg = new BN$1(str, 16);
  }
  if (typeof bitLength !== "number") {
    bitLength = byteLength * 8;
  }
  var delta = bitLength - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};
EC.prototype.sign = function sign2(msg, key2, enc, options) {
  if (typeof enc === "object") {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};
  if (typeof msg !== "string" && typeof msg !== "number" && !BN$1.isBN(msg)) {
    assert$3(
      typeof msg === "object" && msg && typeof msg.length === "number",
      "Expected message to be an array-like, a hex string, or a BN instance"
    );
    assert$3(msg.length >>> 0 === msg.length);
    for (var i2 = 0; i2 < msg.length; i2++) assert$3((msg[i2] & 255) === msg[i2]);
  }
  key2 = this.keyFromPrivate(key2, enc);
  msg = this._truncateToN(msg, false, options.msgBitLength);
  assert$3(!msg.isNeg(), "Can not sign a negative message");
  var bytes = this.n.byteLength();
  var bkey = key2.getPrivate().toArray("be", bytes);
  var nonce = msg.toArray("be", bytes);
  assert$3(new BN$1(nonce).eq(msg), "Can not sign message");
  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce,
    pers: options.pers,
    persEnc: options.persEnc || "utf8"
  });
  var ns1 = this.n.sub(new BN$1(1));
  for (var iter = 0; ; iter++) {
    var k2 = options.k ? options.k(iter) : new BN$1(drbg.generate(this.n.byteLength()));
    k2 = this._truncateToN(k2, true);
    if (k2.cmpn(1) <= 0 || k2.cmp(ns1) >= 0)
      continue;
    var kp = this.g.mul(k2);
    if (kp.isInfinity())
      continue;
    var kpX = kp.getX();
    var r2 = kpX.umod(this.n);
    if (r2.cmpn(0) === 0)
      continue;
    var s2 = k2.invm(this.n).mul(r2.mul(key2.getPrivate()).iadd(msg));
    s2 = s2.umod(this.n);
    if (s2.cmpn(0) === 0)
      continue;
    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r2) !== 0 ? 2 : 0);
    if (options.canonical && s2.cmp(this.nh) > 0) {
      s2 = this.n.sub(s2);
      recoveryParam ^= 1;
    }
    return new Signature$2({ r: r2, s: s2, recoveryParam });
  }
};
EC.prototype.verify = function verify2(msg, signature2, key2, enc, options) {
  if (!options)
    options = {};
  msg = this._truncateToN(msg, false, options.msgBitLength);
  key2 = this.keyFromPublic(key2, enc);
  signature2 = new Signature$2(signature2, "hex");
  var r2 = signature2.r;
  var s2 = signature2.s;
  if (r2.cmpn(1) < 0 || r2.cmp(this.n) >= 0)
    return false;
  if (s2.cmpn(1) < 0 || s2.cmp(this.n) >= 0)
    return false;
  var sinv = s2.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u22 = sinv.mul(r2).umod(this.n);
  var p3;
  if (!this.curve._maxwellTrick) {
    p3 = this.g.mulAdd(u1, key2.getPublic(), u22);
    if (p3.isInfinity())
      return false;
    return p3.getX().umod(this.n).cmp(r2) === 0;
  }
  p3 = this.g.jmulAdd(u1, key2.getPublic(), u22);
  if (p3.isInfinity())
    return false;
  return p3.eqXToP(r2);
};
EC.prototype.recoverPubKey = function(msg, signature2, j2, enc) {
  assert$3((3 & j2) === j2, "The recovery param is more than two bits");
  signature2 = new Signature$2(signature2, enc);
  var n2 = this.n;
  var e = new BN$1(msg);
  var r2 = signature2.r;
  var s2 = signature2.s;
  var isYOdd = j2 & 1;
  var isSecondKey = j2 >> 1;
  if (r2.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error("Unable to find sencond key candinate");
  if (isSecondKey)
    r2 = this.curve.pointFromX(r2.add(this.curve.n), isYOdd);
  else
    r2 = this.curve.pointFromX(r2, isYOdd);
  var rInv = signature2.r.invm(n2);
  var s1 = n2.sub(e).mul(rInv).umod(n2);
  var s22 = s2.mul(rInv).umod(n2);
  return this.g.mulAdd(s1, r2, s22);
};
EC.prototype.getKeyRecoveryParam = function(e, signature2, Q2, enc) {
  signature2 = new Signature$2(signature2, enc);
  if (signature2.recoveryParam !== null)
    return signature2.recoveryParam;
  for (var i2 = 0; i2 < 4; i2++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature2, i2);
    } catch (e2) {
      continue;
    }
    if (Qprime.eq(Q2))
      return i2;
  }
  throw new Error("Unable to find valid recovery factor");
};
var utils$2 = utils$m;
var assert$2 = utils$2.assert;
var parseBytes$2 = utils$2.parseBytes;
var cachedProperty$1 = utils$2.cachedProperty;
function KeyPair$1(eddsa2, params) {
  this.eddsa = eddsa2;
  this._secret = parseBytes$2(params.secret);
  if (eddsa2.isPoint(params.pub))
    this._pub = params.pub;
  else
    this._pubBytes = parseBytes$2(params.pub);
}
KeyPair$1.fromPublic = function fromPublic2(eddsa2, pub2) {
  if (pub2 instanceof KeyPair$1)
    return pub2;
  return new KeyPair$1(eddsa2, { pub: pub2 });
};
KeyPair$1.fromSecret = function fromSecret(eddsa2, secret2) {
  if (secret2 instanceof KeyPair$1)
    return secret2;
  return new KeyPair$1(eddsa2, { secret: secret2 });
};
KeyPair$1.prototype.secret = function secret() {
  return this._secret;
};
cachedProperty$1(KeyPair$1, "pubBytes", function pubBytes() {
  return this.eddsa.encodePoint(this.pub());
});
cachedProperty$1(KeyPair$1, "pub", function pub() {
  if (this._pubBytes)
    return this.eddsa.decodePoint(this._pubBytes);
  return this.eddsa.g.mul(this.priv());
});
cachedProperty$1(KeyPair$1, "privBytes", function privBytes() {
  var eddsa2 = this.eddsa;
  var hash3 = this.hash();
  var lastIx = eddsa2.encodingLength - 1;
  var a3 = hash3.slice(0, eddsa2.encodingLength);
  a3[0] &= 248;
  a3[lastIx] &= 127;
  a3[lastIx] |= 64;
  return a3;
});
cachedProperty$1(KeyPair$1, "priv", function priv() {
  return this.eddsa.decodeInt(this.privBytes());
});
cachedProperty$1(KeyPair$1, "hash", function hash() {
  return this.eddsa.hash().update(this.secret()).digest();
});
cachedProperty$1(KeyPair$1, "messagePrefix", function messagePrefix() {
  return this.hash().slice(this.eddsa.encodingLength);
});
KeyPair$1.prototype.sign = function sign3(message) {
  assert$2(this._secret, "KeyPair can only verify");
  return this.eddsa.sign(message, this);
};
KeyPair$1.prototype.verify = function verify3(message, sig) {
  return this.eddsa.verify(message, sig, this);
};
KeyPair$1.prototype.getSecret = function getSecret(enc) {
  assert$2(this._secret, "KeyPair is public only");
  return utils$2.encode(this.secret(), enc);
};
KeyPair$1.prototype.getPublic = function getPublic2(enc) {
  return utils$2.encode(this.pubBytes(), enc);
};
var key = KeyPair$1;
var BN = bnExports;
var utils$1 = utils$m;
var assert$1 = utils$1.assert;
var cachedProperty = utils$1.cachedProperty;
var parseBytes$1 = utils$1.parseBytes;
function Signature$1(eddsa2, sig) {
  this.eddsa = eddsa2;
  if (typeof sig !== "object")
    sig = parseBytes$1(sig);
  if (Array.isArray(sig)) {
    assert$1(sig.length === eddsa2.encodingLength * 2, "Signature has invalid size");
    sig = {
      R: sig.slice(0, eddsa2.encodingLength),
      S: sig.slice(eddsa2.encodingLength)
    };
  }
  assert$1(sig.R && sig.S, "Signature without R or S");
  if (eddsa2.isPoint(sig.R))
    this._R = sig.R;
  if (sig.S instanceof BN)
    this._S = sig.S;
  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}
cachedProperty(Signature$1, "S", function S() {
  return this.eddsa.decodeInt(this.Sencoded());
});
cachedProperty(Signature$1, "R", function R() {
  return this.eddsa.decodePoint(this.Rencoded());
});
cachedProperty(Signature$1, "Rencoded", function Rencoded() {
  return this.eddsa.encodePoint(this.R());
});
cachedProperty(Signature$1, "Sencoded", function Sencoded() {
  return this.eddsa.encodeInt(this.S());
});
Signature$1.prototype.toBytes = function toBytes() {
  return this.Rencoded().concat(this.Sencoded());
};
Signature$1.prototype.toHex = function toHex2() {
  return utils$1.encode(this.toBytes(), "hex").toUpperCase();
};
var signature = Signature$1;
var hash2 = hash$2;
var curves = curves$2;
var utils = utils$m;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var KeyPair = key;
var Signature = signature;
function EDDSA(curve2) {
  assert(curve2 === "ed25519", "only tested with ed25519 so far");
  if (!(this instanceof EDDSA))
    return new EDDSA(curve2);
  curve2 = curves[curve2].curve;
  this.curve = curve2;
  this.g = curve2.g;
  this.g.precompute(curve2.n.bitLength() + 1);
  this.pointClass = curve2.point().constructor;
  this.encodingLength = Math.ceil(curve2.n.bitLength() / 8);
  this.hash = hash2.sha512;
}
var eddsa = EDDSA;
EDDSA.prototype.sign = function sign4(message, secret2) {
  message = parseBytes(message);
  var key2 = this.keyFromSecret(secret2);
  var r2 = this.hashInt(key2.messagePrefix(), message);
  var R3 = this.g.mul(r2);
  var Rencoded2 = this.encodePoint(R3);
  var s_ = this.hashInt(Rencoded2, key2.pubBytes(), message).mul(key2.priv());
  var S4 = r2.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R3, S: S4, Rencoded: Rencoded2 });
};
EDDSA.prototype.verify = function verify4(message, sig, pub2) {
  message = parseBytes(message);
  sig = this.makeSignature(sig);
  if (sig.S().gte(sig.eddsa.curve.n) || sig.S().isNeg()) {
    return false;
  }
  var key2 = this.keyFromPublic(pub2);
  var h3 = this.hashInt(sig.Rencoded(), key2.pubBytes(), message);
  var SG = this.g.mul(sig.S());
  var RplusAh = sig.R().add(key2.pub().mul(h3));
  return RplusAh.eq(SG);
};
EDDSA.prototype.hashInt = function hashInt() {
  var hash3 = this.hash();
  for (var i2 = 0; i2 < arguments.length; i2++)
    hash3.update(arguments[i2]);
  return utils.intFromLE(hash3.digest()).umod(this.curve.n);
};
EDDSA.prototype.keyFromPublic = function keyFromPublic2(pub2) {
  return KeyPair.fromPublic(this, pub2);
};
EDDSA.prototype.keyFromSecret = function keyFromSecret(secret2) {
  return KeyPair.fromSecret(this, secret2);
};
EDDSA.prototype.makeSignature = function makeSignature(sig) {
  if (sig instanceof Signature)
    return sig;
  return new Signature(this, sig);
};
EDDSA.prototype.encodePoint = function encodePoint(point5) {
  var enc = point5.getY().toArray("le", this.encodingLength);
  enc[this.encodingLength - 1] |= point5.getX().isOdd() ? 128 : 0;
  return enc;
};
EDDSA.prototype.decodePoint = function decodePoint3(bytes) {
  bytes = utils.parseBytes(bytes);
  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & -129);
  var xIsOdd = (bytes[lastIx] & 128) !== 0;
  var y3 = utils.intFromLE(normed);
  return this.curve.pointFromY(y3, xIsOdd);
};
EDDSA.prototype.encodeInt = function encodeInt(num) {
  return num.toArray("le", this.encodingLength);
};
EDDSA.prototype.decodeInt = function decodeInt(bytes) {
  return utils.intFromLE(bytes);
};
EDDSA.prototype.isPoint = function isPoint(val) {
  return val instanceof this.pointClass;
};
(function(exports$1) {
  var elliptic2 = exports$1;
  elliptic2.version = require$$0.version;
  elliptic2.utils = utils$m;
  elliptic2.rand = brorandExports;
  elliptic2.curve = curve;
  elliptic2.curves = curves$2;
  elliptic2.ec = ec;
  elliptic2.eddsa = eddsa;
})(elliptic);
var ed25519 = {};
var sha512 = {};
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  var binary_12 = binary;
  var wipe_12 = wipe$1;
  exports$1.DIGEST_LENGTH = 64;
  exports$1.BLOCK_SIZE = 128;
  var SHA5122 = (
    /** @class */
    function() {
      function SHA5123() {
        this.digestLength = exports$1.DIGEST_LENGTH;
        this.blockSize = exports$1.BLOCK_SIZE;
        this._stateHi = new Int32Array(8);
        this._stateLo = new Int32Array(8);
        this._tempHi = new Int32Array(16);
        this._tempLo = new Int32Array(16);
        this._buffer = new Uint8Array(256);
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        this.reset();
      }
      SHA5123.prototype._initState = function() {
        this._stateHi[0] = 1779033703;
        this._stateHi[1] = 3144134277;
        this._stateHi[2] = 1013904242;
        this._stateHi[3] = 2773480762;
        this._stateHi[4] = 1359893119;
        this._stateHi[5] = 2600822924;
        this._stateHi[6] = 528734635;
        this._stateHi[7] = 1541459225;
        this._stateLo[0] = 4089235720;
        this._stateLo[1] = 2227873595;
        this._stateLo[2] = 4271175723;
        this._stateLo[3] = 1595750129;
        this._stateLo[4] = 2917565137;
        this._stateLo[5] = 725511199;
        this._stateLo[6] = 4215389547;
        this._stateLo[7] = 327033209;
      };
      SHA5123.prototype.reset = function() {
        this._initState();
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        return this;
      };
      SHA5123.prototype.clean = function() {
        wipe_12.wipe(this._buffer);
        wipe_12.wipe(this._tempHi);
        wipe_12.wipe(this._tempLo);
        this.reset();
      };
      SHA5123.prototype.update = function(data, dataLength) {
        if (dataLength === void 0) {
          dataLength = data.length;
        }
        if (this._finished) {
          throw new Error("SHA512: can't update because hash was finished.");
        }
        var dataPos = 0;
        this._bytesHashed += dataLength;
        if (this._bufferLength > 0) {
          while (this._bufferLength < exports$1.BLOCK_SIZE && dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }
          if (this._bufferLength === this.blockSize) {
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
            this._bufferLength = 0;
          }
        }
        if (dataLength >= this.blockSize) {
          dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
          dataLength %= this.blockSize;
        }
        while (dataLength > 0) {
          this._buffer[this._bufferLength++] = data[dataPos++];
          dataLength--;
        }
        return this;
      };
      SHA5123.prototype.finish = function(out) {
        if (!this._finished) {
          var bytesHashed = this._bytesHashed;
          var left = this._bufferLength;
          var bitLenHi = bytesHashed / 536870912 | 0;
          var bitLenLo = bytesHashed << 3;
          var padLength = bytesHashed % 128 < 112 ? 128 : 256;
          this._buffer[left] = 128;
          for (var i2 = left + 1; i2 < padLength - 8; i2++) {
            this._buffer[i2] = 0;
          }
          binary_12.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
          binary_12.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
          hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
          this._finished = true;
        }
        for (var i2 = 0; i2 < this.digestLength / 8; i2++) {
          binary_12.writeUint32BE(this._stateHi[i2], out, i2 * 8);
          binary_12.writeUint32BE(this._stateLo[i2], out, i2 * 8 + 4);
        }
        return this;
      };
      SHA5123.prototype.digest = function() {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
      };
      SHA5123.prototype.saveState = function() {
        if (this._finished) {
          throw new Error("SHA256: cannot save finished state");
        }
        return {
          stateHi: new Int32Array(this._stateHi),
          stateLo: new Int32Array(this._stateLo),
          buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
          bufferLength: this._bufferLength,
          bytesHashed: this._bytesHashed
        };
      };
      SHA5123.prototype.restoreState = function(savedState) {
        this._stateHi.set(savedState.stateHi);
        this._stateLo.set(savedState.stateLo);
        this._bufferLength = savedState.bufferLength;
        if (savedState.buffer) {
          this._buffer.set(savedState.buffer);
        }
        this._bytesHashed = savedState.bytesHashed;
        this._finished = false;
        return this;
      };
      SHA5123.prototype.cleanSavedState = function(savedState) {
        wipe_12.wipe(savedState.stateHi);
        wipe_12.wipe(savedState.stateLo);
        if (savedState.buffer) {
          wipe_12.wipe(savedState.buffer);
        }
        savedState.bufferLength = 0;
        savedState.bytesHashed = 0;
      };
      return SHA5123;
    }()
  );
  exports$1.SHA512 = SHA5122;
  var K2 = new Int32Array([
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ]);
  function hashBlocks(wh2, wl, hh2, hl, m3, pos, len) {
    var ah0 = hh2[0], ah1 = hh2[1], ah2 = hh2[2], ah3 = hh2[3], ah4 = hh2[4], ah5 = hh2[5], ah6 = hh2[6], ah7 = hh2[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
    var h3, l2;
    var th, tl;
    var a3, b2, c2, d3;
    while (len >= 128) {
      for (var i2 = 0; i2 < 16; i2++) {
        var j2 = 8 * i2 + pos;
        wh2[i2] = binary_12.readUint32BE(m3, j2);
        wl[i2] = binary_12.readUint32BE(m3, j2 + 4);
      }
      for (var i2 = 0; i2 < 80; i2++) {
        var bh0 = ah0;
        var bh1 = ah1;
        var bh2 = ah2;
        var bh3 = ah3;
        var bh4 = ah4;
        var bh5 = ah5;
        var bh6 = ah6;
        var bh7 = ah7;
        var bl0 = al0;
        var bl1 = al1;
        var bl2 = al2;
        var bl3 = al3;
        var bl4 = al4;
        var bl5 = al5;
        var bl6 = al6;
        var bl7 = al7;
        h3 = ah7;
        l2 = al7;
        a3 = l2 & 65535;
        b2 = l2 >>> 16;
        c2 = h3 & 65535;
        d3 = h3 >>> 16;
        h3 = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
        l2 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        h3 = ah4 & ah5 ^ ~ah4 & ah6;
        l2 = al4 & al5 ^ ~al4 & al6;
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        h3 = K2[i2 * 2];
        l2 = K2[i2 * 2 + 1];
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        h3 = wh2[i2 % 16];
        l2 = wl[i2 % 16];
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        b2 += a3 >>> 16;
        c2 += b2 >>> 16;
        d3 += c2 >>> 16;
        th = c2 & 65535 | d3 << 16;
        tl = a3 & 65535 | b2 << 16;
        h3 = th;
        l2 = tl;
        a3 = l2 & 65535;
        b2 = l2 >>> 16;
        c2 = h3 & 65535;
        d3 = h3 >>> 16;
        h3 = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
        l2 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        h3 = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
        l2 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        b2 += a3 >>> 16;
        c2 += b2 >>> 16;
        d3 += c2 >>> 16;
        bh7 = c2 & 65535 | d3 << 16;
        bl7 = a3 & 65535 | b2 << 16;
        h3 = bh3;
        l2 = bl3;
        a3 = l2 & 65535;
        b2 = l2 >>> 16;
        c2 = h3 & 65535;
        d3 = h3 >>> 16;
        h3 = th;
        l2 = tl;
        a3 += l2 & 65535;
        b2 += l2 >>> 16;
        c2 += h3 & 65535;
        d3 += h3 >>> 16;
        b2 += a3 >>> 16;
        c2 += b2 >>> 16;
        d3 += c2 >>> 16;
        bh3 = c2 & 65535 | d3 << 16;
        bl3 = a3 & 65535 | b2 << 16;
        ah1 = bh0;
        ah2 = bh1;
        ah3 = bh2;
        ah4 = bh3;
        ah5 = bh4;
        ah6 = bh5;
        ah7 = bh6;
        ah0 = bh7;
        al1 = bl0;
        al2 = bl1;
        al3 = bl2;
        al4 = bl3;
        al5 = bl4;
        al6 = bl5;
        al7 = bl6;
        al0 = bl7;
        if (i2 % 16 === 15) {
          for (var j2 = 0; j2 < 16; j2++) {
            h3 = wh2[j2];
            l2 = wl[j2];
            a3 = l2 & 65535;
            b2 = l2 >>> 16;
            c2 = h3 & 65535;
            d3 = h3 >>> 16;
            h3 = wh2[(j2 + 9) % 16];
            l2 = wl[(j2 + 9) % 16];
            a3 += l2 & 65535;
            b2 += l2 >>> 16;
            c2 += h3 & 65535;
            d3 += h3 >>> 16;
            th = wh2[(j2 + 1) % 16];
            tl = wl[(j2 + 1) % 16];
            h3 = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
            l2 = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
            a3 += l2 & 65535;
            b2 += l2 >>> 16;
            c2 += h3 & 65535;
            d3 += h3 >>> 16;
            th = wh2[(j2 + 14) % 16];
            tl = wl[(j2 + 14) % 16];
            h3 = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
            l2 = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
            a3 += l2 & 65535;
            b2 += l2 >>> 16;
            c2 += h3 & 65535;
            d3 += h3 >>> 16;
            b2 += a3 >>> 16;
            c2 += b2 >>> 16;
            d3 += c2 >>> 16;
            wh2[j2] = c2 & 65535 | d3 << 16;
            wl[j2] = a3 & 65535 | b2 << 16;
          }
        }
      }
      h3 = ah0;
      l2 = al0;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[0];
      l2 = hl[0];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[0] = ah0 = c2 & 65535 | d3 << 16;
      hl[0] = al0 = a3 & 65535 | b2 << 16;
      h3 = ah1;
      l2 = al1;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[1];
      l2 = hl[1];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[1] = ah1 = c2 & 65535 | d3 << 16;
      hl[1] = al1 = a3 & 65535 | b2 << 16;
      h3 = ah2;
      l2 = al2;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[2];
      l2 = hl[2];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[2] = ah2 = c2 & 65535 | d3 << 16;
      hl[2] = al2 = a3 & 65535 | b2 << 16;
      h3 = ah3;
      l2 = al3;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[3];
      l2 = hl[3];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[3] = ah3 = c2 & 65535 | d3 << 16;
      hl[3] = al3 = a3 & 65535 | b2 << 16;
      h3 = ah4;
      l2 = al4;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[4];
      l2 = hl[4];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[4] = ah4 = c2 & 65535 | d3 << 16;
      hl[4] = al4 = a3 & 65535 | b2 << 16;
      h3 = ah5;
      l2 = al5;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[5];
      l2 = hl[5];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[5] = ah5 = c2 & 65535 | d3 << 16;
      hl[5] = al5 = a3 & 65535 | b2 << 16;
      h3 = ah6;
      l2 = al6;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[6];
      l2 = hl[6];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[6] = ah6 = c2 & 65535 | d3 << 16;
      hl[6] = al6 = a3 & 65535 | b2 << 16;
      h3 = ah7;
      l2 = al7;
      a3 = l2 & 65535;
      b2 = l2 >>> 16;
      c2 = h3 & 65535;
      d3 = h3 >>> 16;
      h3 = hh2[7];
      l2 = hl[7];
      a3 += l2 & 65535;
      b2 += l2 >>> 16;
      c2 += h3 & 65535;
      d3 += h3 >>> 16;
      b2 += a3 >>> 16;
      c2 += b2 >>> 16;
      d3 += c2 >>> 16;
      hh2[7] = ah7 = c2 & 65535 | d3 << 16;
      hl[7] = al7 = a3 & 65535 | b2 << 16;
      pos += 128;
      len -= 128;
    }
    return pos;
  }
  function hash3(data) {
    var h3 = new SHA5122();
    h3.update(data);
    var digest9 = h3.digest();
    h3.clean();
    return digest9;
  }
  exports$1.hash = hash3;
})(sha512);
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  exports$1.convertSecretKeyToX25519 = exports$1.convertPublicKeyToX25519 = exports$1.verify = exports$1.sign = exports$1.extractPublicKeyFromSecretKey = exports$1.generateKeyPair = exports$1.generateKeyPairFromSeed = exports$1.SEED_LENGTH = exports$1.SECRET_KEY_LENGTH = exports$1.PUBLIC_KEY_LENGTH = exports$1.SIGNATURE_LENGTH = void 0;
  const random_1 = random;
  const sha512_1 = sha512;
  const wipe_12 = wipe$1;
  exports$1.SIGNATURE_LENGTH = 64;
  exports$1.PUBLIC_KEY_LENGTH = 32;
  exports$1.SECRET_KEY_LENGTH = 64;
  exports$1.SEED_LENGTH = 32;
  function gf2(init3) {
    const r2 = new Float64Array(16);
    if (init3) {
      for (let i2 = 0; i2 < init3.length; i2++) {
        r2[i2] = init3[i2];
      }
    }
    return r2;
  }
  const _9 = new Uint8Array(32);
  _9[0] = 9;
  const gf0 = gf2();
  const gf1 = gf2([1]);
  const D2 = gf2([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]);
  const D22 = gf2([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]);
  const X2 = gf2([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]);
  const Y = gf2([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]);
  const I2 = gf2([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function set25519(r2, a3) {
    for (let i2 = 0; i2 < 16; i2++) {
      r2[i2] = a3[i2] | 0;
    }
  }
  function car25519(o2) {
    let c2 = 1;
    for (let i2 = 0; i2 < 16; i2++) {
      let v3 = o2[i2] + c2 + 65535;
      c2 = Math.floor(v3 / 65536);
      o2[i2] = v3 - c2 * 65536;
    }
    o2[0] += c2 - 1 + 37 * (c2 - 1);
  }
  function sel25519(p3, q2, b2) {
    const c2 = ~(b2 - 1);
    for (let i2 = 0; i2 < 16; i2++) {
      const t = c2 & (p3[i2] ^ q2[i2]);
      p3[i2] ^= t;
      q2[i2] ^= t;
    }
  }
  function pack25519(o2, n2) {
    const m3 = gf2();
    const t = gf2();
    for (let i2 = 0; i2 < 16; i2++) {
      t[i2] = n2[i2];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (let j2 = 0; j2 < 2; j2++) {
      m3[0] = t[0] - 65517;
      for (let i2 = 1; i2 < 15; i2++) {
        m3[i2] = t[i2] - 65535 - (m3[i2 - 1] >> 16 & 1);
        m3[i2 - 1] &= 65535;
      }
      m3[15] = t[15] - 32767 - (m3[14] >> 16 & 1);
      const b2 = m3[15] >> 16 & 1;
      m3[14] &= 65535;
      sel25519(t, m3, 1 - b2);
    }
    for (let i2 = 0; i2 < 16; i2++) {
      o2[2 * i2] = t[i2] & 255;
      o2[2 * i2 + 1] = t[i2] >> 8;
    }
  }
  function verify32(x3, y3) {
    let d3 = 0;
    for (let i2 = 0; i2 < 32; i2++) {
      d3 |= x3[i2] ^ y3[i2];
    }
    return (1 & d3 - 1 >>> 8) - 1;
  }
  function neq25519(a3, b2) {
    const c2 = new Uint8Array(32);
    const d3 = new Uint8Array(32);
    pack25519(c2, a3);
    pack25519(d3, b2);
    return verify32(c2, d3);
  }
  function par25519(a3) {
    const d3 = new Uint8Array(32);
    pack25519(d3, a3);
    return d3[0] & 1;
  }
  function unpack25519(o2, n2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = n2[2 * i2] + (n2[2 * i2 + 1] << 8);
    }
    o2[15] &= 32767;
  }
  function add5(o2, a3, b2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = a3[i2] + b2[i2];
    }
  }
  function sub(o2, a3, b2) {
    for (let i2 = 0; i2 < 16; i2++) {
      o2[i2] = a3[i2] - b2[i2];
    }
  }
  function mul5(o2, a3, b2) {
    let v3, c2, t02 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b02 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7], b8 = b2[8], b9 = b2[9], b10 = b2[10], b11 = b2[11], b12 = b2[12], b13 = b2[13], b14 = b2[14], b15 = b2[15];
    v3 = a3[0];
    t02 += v3 * b02;
    t1 += v3 * b1;
    t2 += v3 * b22;
    t3 += v3 * b3;
    t4 += v3 * b4;
    t5 += v3 * b5;
    t6 += v3 * b6;
    t7 += v3 * b7;
    t8 += v3 * b8;
    t9 += v3 * b9;
    t10 += v3 * b10;
    t11 += v3 * b11;
    t12 += v3 * b12;
    t13 += v3 * b13;
    t14 += v3 * b14;
    t15 += v3 * b15;
    v3 = a3[1];
    t1 += v3 * b02;
    t2 += v3 * b1;
    t3 += v3 * b22;
    t4 += v3 * b3;
    t5 += v3 * b4;
    t6 += v3 * b5;
    t7 += v3 * b6;
    t8 += v3 * b7;
    t9 += v3 * b8;
    t10 += v3 * b9;
    t11 += v3 * b10;
    t12 += v3 * b11;
    t13 += v3 * b12;
    t14 += v3 * b13;
    t15 += v3 * b14;
    t16 += v3 * b15;
    v3 = a3[2];
    t2 += v3 * b02;
    t3 += v3 * b1;
    t4 += v3 * b22;
    t5 += v3 * b3;
    t6 += v3 * b4;
    t7 += v3 * b5;
    t8 += v3 * b6;
    t9 += v3 * b7;
    t10 += v3 * b8;
    t11 += v3 * b9;
    t12 += v3 * b10;
    t13 += v3 * b11;
    t14 += v3 * b12;
    t15 += v3 * b13;
    t16 += v3 * b14;
    t17 += v3 * b15;
    v3 = a3[3];
    t3 += v3 * b02;
    t4 += v3 * b1;
    t5 += v3 * b22;
    t6 += v3 * b3;
    t7 += v3 * b4;
    t8 += v3 * b5;
    t9 += v3 * b6;
    t10 += v3 * b7;
    t11 += v3 * b8;
    t12 += v3 * b9;
    t13 += v3 * b10;
    t14 += v3 * b11;
    t15 += v3 * b12;
    t16 += v3 * b13;
    t17 += v3 * b14;
    t18 += v3 * b15;
    v3 = a3[4];
    t4 += v3 * b02;
    t5 += v3 * b1;
    t6 += v3 * b22;
    t7 += v3 * b3;
    t8 += v3 * b4;
    t9 += v3 * b5;
    t10 += v3 * b6;
    t11 += v3 * b7;
    t12 += v3 * b8;
    t13 += v3 * b9;
    t14 += v3 * b10;
    t15 += v3 * b11;
    t16 += v3 * b12;
    t17 += v3 * b13;
    t18 += v3 * b14;
    t19 += v3 * b15;
    v3 = a3[5];
    t5 += v3 * b02;
    t6 += v3 * b1;
    t7 += v3 * b22;
    t8 += v3 * b3;
    t9 += v3 * b4;
    t10 += v3 * b5;
    t11 += v3 * b6;
    t12 += v3 * b7;
    t13 += v3 * b8;
    t14 += v3 * b9;
    t15 += v3 * b10;
    t16 += v3 * b11;
    t17 += v3 * b12;
    t18 += v3 * b13;
    t19 += v3 * b14;
    t20 += v3 * b15;
    v3 = a3[6];
    t6 += v3 * b02;
    t7 += v3 * b1;
    t8 += v3 * b22;
    t9 += v3 * b3;
    t10 += v3 * b4;
    t11 += v3 * b5;
    t12 += v3 * b6;
    t13 += v3 * b7;
    t14 += v3 * b8;
    t15 += v3 * b9;
    t16 += v3 * b10;
    t17 += v3 * b11;
    t18 += v3 * b12;
    t19 += v3 * b13;
    t20 += v3 * b14;
    t21 += v3 * b15;
    v3 = a3[7];
    t7 += v3 * b02;
    t8 += v3 * b1;
    t9 += v3 * b22;
    t10 += v3 * b3;
    t11 += v3 * b4;
    t12 += v3 * b5;
    t13 += v3 * b6;
    t14 += v3 * b7;
    t15 += v3 * b8;
    t16 += v3 * b9;
    t17 += v3 * b10;
    t18 += v3 * b11;
    t19 += v3 * b12;
    t20 += v3 * b13;
    t21 += v3 * b14;
    t22 += v3 * b15;
    v3 = a3[8];
    t8 += v3 * b02;
    t9 += v3 * b1;
    t10 += v3 * b22;
    t11 += v3 * b3;
    t12 += v3 * b4;
    t13 += v3 * b5;
    t14 += v3 * b6;
    t15 += v3 * b7;
    t16 += v3 * b8;
    t17 += v3 * b9;
    t18 += v3 * b10;
    t19 += v3 * b11;
    t20 += v3 * b12;
    t21 += v3 * b13;
    t22 += v3 * b14;
    t23 += v3 * b15;
    v3 = a3[9];
    t9 += v3 * b02;
    t10 += v3 * b1;
    t11 += v3 * b22;
    t12 += v3 * b3;
    t13 += v3 * b4;
    t14 += v3 * b5;
    t15 += v3 * b6;
    t16 += v3 * b7;
    t17 += v3 * b8;
    t18 += v3 * b9;
    t19 += v3 * b10;
    t20 += v3 * b11;
    t21 += v3 * b12;
    t22 += v3 * b13;
    t23 += v3 * b14;
    t24 += v3 * b15;
    v3 = a3[10];
    t10 += v3 * b02;
    t11 += v3 * b1;
    t12 += v3 * b22;
    t13 += v3 * b3;
    t14 += v3 * b4;
    t15 += v3 * b5;
    t16 += v3 * b6;
    t17 += v3 * b7;
    t18 += v3 * b8;
    t19 += v3 * b9;
    t20 += v3 * b10;
    t21 += v3 * b11;
    t22 += v3 * b12;
    t23 += v3 * b13;
    t24 += v3 * b14;
    t25 += v3 * b15;
    v3 = a3[11];
    t11 += v3 * b02;
    t12 += v3 * b1;
    t13 += v3 * b22;
    t14 += v3 * b3;
    t15 += v3 * b4;
    t16 += v3 * b5;
    t17 += v3 * b6;
    t18 += v3 * b7;
    t19 += v3 * b8;
    t20 += v3 * b9;
    t21 += v3 * b10;
    t22 += v3 * b11;
    t23 += v3 * b12;
    t24 += v3 * b13;
    t25 += v3 * b14;
    t26 += v3 * b15;
    v3 = a3[12];
    t12 += v3 * b02;
    t13 += v3 * b1;
    t14 += v3 * b22;
    t15 += v3 * b3;
    t16 += v3 * b4;
    t17 += v3 * b5;
    t18 += v3 * b6;
    t19 += v3 * b7;
    t20 += v3 * b8;
    t21 += v3 * b9;
    t22 += v3 * b10;
    t23 += v3 * b11;
    t24 += v3 * b12;
    t25 += v3 * b13;
    t26 += v3 * b14;
    t27 += v3 * b15;
    v3 = a3[13];
    t13 += v3 * b02;
    t14 += v3 * b1;
    t15 += v3 * b22;
    t16 += v3 * b3;
    t17 += v3 * b4;
    t18 += v3 * b5;
    t19 += v3 * b6;
    t20 += v3 * b7;
    t21 += v3 * b8;
    t22 += v3 * b9;
    t23 += v3 * b10;
    t24 += v3 * b11;
    t25 += v3 * b12;
    t26 += v3 * b13;
    t27 += v3 * b14;
    t28 += v3 * b15;
    v3 = a3[14];
    t14 += v3 * b02;
    t15 += v3 * b1;
    t16 += v3 * b22;
    t17 += v3 * b3;
    t18 += v3 * b4;
    t19 += v3 * b5;
    t20 += v3 * b6;
    t21 += v3 * b7;
    t22 += v3 * b8;
    t23 += v3 * b9;
    t24 += v3 * b10;
    t25 += v3 * b11;
    t26 += v3 * b12;
    t27 += v3 * b13;
    t28 += v3 * b14;
    t29 += v3 * b15;
    v3 = a3[15];
    t15 += v3 * b02;
    t16 += v3 * b1;
    t17 += v3 * b22;
    t18 += v3 * b3;
    t19 += v3 * b4;
    t20 += v3 * b5;
    t21 += v3 * b6;
    t22 += v3 * b7;
    t23 += v3 * b8;
    t24 += v3 * b9;
    t25 += v3 * b10;
    t26 += v3 * b11;
    t27 += v3 * b12;
    t28 += v3 * b13;
    t29 += v3 * b14;
    t30 += v3 * b15;
    t02 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c2 = 1;
    v3 = t02 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t02 = v3 - c2 * 65536;
    v3 = t1 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t1 = v3 - c2 * 65536;
    v3 = t2 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t2 = v3 - c2 * 65536;
    v3 = t3 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t3 = v3 - c2 * 65536;
    v3 = t4 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t4 = v3 - c2 * 65536;
    v3 = t5 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t5 = v3 - c2 * 65536;
    v3 = t6 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t6 = v3 - c2 * 65536;
    v3 = t7 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t7 = v3 - c2 * 65536;
    v3 = t8 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t8 = v3 - c2 * 65536;
    v3 = t9 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t9 = v3 - c2 * 65536;
    v3 = t10 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t10 = v3 - c2 * 65536;
    v3 = t11 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t11 = v3 - c2 * 65536;
    v3 = t12 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t12 = v3 - c2 * 65536;
    v3 = t13 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t13 = v3 - c2 * 65536;
    v3 = t14 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t14 = v3 - c2 * 65536;
    v3 = t15 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t15 = v3 - c2 * 65536;
    t02 += c2 - 1 + 37 * (c2 - 1);
    c2 = 1;
    v3 = t02 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t02 = v3 - c2 * 65536;
    v3 = t1 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t1 = v3 - c2 * 65536;
    v3 = t2 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t2 = v3 - c2 * 65536;
    v3 = t3 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t3 = v3 - c2 * 65536;
    v3 = t4 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t4 = v3 - c2 * 65536;
    v3 = t5 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t5 = v3 - c2 * 65536;
    v3 = t6 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t6 = v3 - c2 * 65536;
    v3 = t7 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t7 = v3 - c2 * 65536;
    v3 = t8 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t8 = v3 - c2 * 65536;
    v3 = t9 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t9 = v3 - c2 * 65536;
    v3 = t10 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t10 = v3 - c2 * 65536;
    v3 = t11 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t11 = v3 - c2 * 65536;
    v3 = t12 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t12 = v3 - c2 * 65536;
    v3 = t13 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t13 = v3 - c2 * 65536;
    v3 = t14 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t14 = v3 - c2 * 65536;
    v3 = t15 + c2 + 65535;
    c2 = Math.floor(v3 / 65536);
    t15 = v3 - c2 * 65536;
    t02 += c2 - 1 + 37 * (c2 - 1);
    o2[0] = t02;
    o2[1] = t1;
    o2[2] = t2;
    o2[3] = t3;
    o2[4] = t4;
    o2[5] = t5;
    o2[6] = t6;
    o2[7] = t7;
    o2[8] = t8;
    o2[9] = t9;
    o2[10] = t10;
    o2[11] = t11;
    o2[12] = t12;
    o2[13] = t13;
    o2[14] = t14;
    o2[15] = t15;
  }
  function square(o2, a3) {
    mul5(o2, a3, a3);
  }
  function inv25519(o2, i2) {
    const c2 = gf2();
    let a3;
    for (a3 = 0; a3 < 16; a3++) {
      c2[a3] = i2[a3];
    }
    for (a3 = 253; a3 >= 0; a3--) {
      square(c2, c2);
      if (a3 !== 2 && a3 !== 4) {
        mul5(c2, c2, i2);
      }
    }
    for (a3 = 0; a3 < 16; a3++) {
      o2[a3] = c2[a3];
    }
  }
  function pow2523(o2, i2) {
    const c2 = gf2();
    let a3;
    for (a3 = 0; a3 < 16; a3++) {
      c2[a3] = i2[a3];
    }
    for (a3 = 250; a3 >= 0; a3--) {
      square(c2, c2);
      if (a3 !== 1) {
        mul5(c2, c2, i2);
      }
    }
    for (a3 = 0; a3 < 16; a3++) {
      o2[a3] = c2[a3];
    }
  }
  function edadd(p3, q2) {
    const a3 = gf2(), b2 = gf2(), c2 = gf2(), d3 = gf2(), e = gf2(), f3 = gf2(), g3 = gf2(), h3 = gf2(), t = gf2();
    sub(a3, p3[1], p3[0]);
    sub(t, q2[1], q2[0]);
    mul5(a3, a3, t);
    add5(b2, p3[0], p3[1]);
    add5(t, q2[0], q2[1]);
    mul5(b2, b2, t);
    mul5(c2, p3[3], q2[3]);
    mul5(c2, c2, D22);
    mul5(d3, p3[2], q2[2]);
    add5(d3, d3, d3);
    sub(e, b2, a3);
    sub(f3, d3, c2);
    add5(g3, d3, c2);
    add5(h3, b2, a3);
    mul5(p3[0], e, f3);
    mul5(p3[1], h3, g3);
    mul5(p3[2], g3, f3);
    mul5(p3[3], e, h3);
  }
  function cswap(p3, q2, b2) {
    for (let i2 = 0; i2 < 4; i2++) {
      sel25519(p3[i2], q2[i2], b2);
    }
  }
  function pack(r2, p3) {
    const tx = gf2(), ty = gf2(), zi2 = gf2();
    inv25519(zi2, p3[2]);
    mul5(tx, p3[0], zi2);
    mul5(ty, p3[1], zi2);
    pack25519(r2, ty);
    r2[31] ^= par25519(tx) << 7;
  }
  function scalarmult(p3, q2, s2) {
    set25519(p3[0], gf0);
    set25519(p3[1], gf1);
    set25519(p3[2], gf1);
    set25519(p3[3], gf0);
    for (let i2 = 255; i2 >= 0; --i2) {
      const b2 = s2[i2 / 8 | 0] >> (i2 & 7) & 1;
      cswap(p3, q2, b2);
      edadd(q2, p3);
      edadd(p3, p3);
      cswap(p3, q2, b2);
    }
  }
  function scalarbase(p3, s2) {
    const q2 = [gf2(), gf2(), gf2(), gf2()];
    set25519(q2[0], X2);
    set25519(q2[1], Y);
    set25519(q2[2], gf1);
    mul5(q2[3], X2, Y);
    scalarmult(p3, q2, s2);
  }
  function generateKeyPairFromSeed(seed) {
    if (seed.length !== exports$1.SEED_LENGTH) {
      throw new Error(`ed25519: seed must be ${exports$1.SEED_LENGTH} bytes`);
    }
    const d3 = (0, sha512_1.hash)(seed);
    d3[0] &= 248;
    d3[31] &= 127;
    d3[31] |= 64;
    const publicKey = new Uint8Array(32);
    const p3 = [gf2(), gf2(), gf2(), gf2()];
    scalarbase(p3, d3);
    pack(publicKey, p3);
    const secretKey = new Uint8Array(64);
    secretKey.set(seed);
    secretKey.set(publicKey, 32);
    return {
      publicKey,
      secretKey
    };
  }
  exports$1.generateKeyPairFromSeed = generateKeyPairFromSeed;
  function generateKeyPair2(prng) {
    const seed = (0, random_1.randomBytes)(32, prng);
    const result = generateKeyPairFromSeed(seed);
    (0, wipe_12.wipe)(seed);
    return result;
  }
  exports$1.generateKeyPair = generateKeyPair2;
  function extractPublicKeyFromSecretKey(secretKey) {
    if (secretKey.length !== exports$1.SECRET_KEY_LENGTH) {
      throw new Error(`ed25519: secret key must be ${exports$1.SECRET_KEY_LENGTH} bytes`);
    }
    return new Uint8Array(secretKey.subarray(32));
  }
  exports$1.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
  const L3 = new Float64Array([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]);
  function modL(r2, x3) {
    let carry;
    let i2;
    let j2;
    let k2;
    for (i2 = 63; i2 >= 32; --i2) {
      carry = 0;
      for (j2 = i2 - 32, k2 = i2 - 12; j2 < k2; ++j2) {
        x3[j2] += carry - 16 * x3[i2] * L3[j2 - (i2 - 32)];
        carry = Math.floor((x3[j2] + 128) / 256);
        x3[j2] -= carry * 256;
      }
      x3[j2] += carry;
      x3[i2] = 0;
    }
    carry = 0;
    for (j2 = 0; j2 < 32; j2++) {
      x3[j2] += carry - (x3[31] >> 4) * L3[j2];
      carry = x3[j2] >> 8;
      x3[j2] &= 255;
    }
    for (j2 = 0; j2 < 32; j2++) {
      x3[j2] -= carry * L3[j2];
    }
    for (i2 = 0; i2 < 32; i2++) {
      x3[i2 + 1] += x3[i2] >> 8;
      r2[i2] = x3[i2] & 255;
    }
  }
  function reduce(r2) {
    const x3 = new Float64Array(64);
    for (let i2 = 0; i2 < 64; i2++) {
      x3[i2] = r2[i2];
    }
    for (let i2 = 0; i2 < 64; i2++) {
      r2[i2] = 0;
    }
    modL(r2, x3);
  }
  function sign5(secretKey, message) {
    const x3 = new Float64Array(64);
    const p3 = [gf2(), gf2(), gf2(), gf2()];
    const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d3[0] &= 248;
    d3[31] &= 127;
    d3[31] |= 64;
    const signature2 = new Uint8Array(64);
    signature2.set(d3.subarray(32), 32);
    const hs = new sha512_1.SHA512();
    hs.update(signature2.subarray(32));
    hs.update(message);
    const r2 = hs.digest();
    hs.clean();
    reduce(r2);
    scalarbase(p3, r2);
    pack(signature2, p3);
    hs.reset();
    hs.update(signature2.subarray(0, 32));
    hs.update(secretKey.subarray(32));
    hs.update(message);
    const h3 = hs.digest();
    reduce(h3);
    for (let i2 = 0; i2 < 32; i2++) {
      x3[i2] = r2[i2];
    }
    for (let i2 = 0; i2 < 32; i2++) {
      for (let j2 = 0; j2 < 32; j2++) {
        x3[i2 + j2] += h3[i2] * d3[j2];
      }
    }
    modL(signature2.subarray(32), x3);
    return signature2;
  }
  exports$1.sign = sign5;
  function unpackneg(r2, p3) {
    const t = gf2(), chk = gf2(), num = gf2(), den = gf2(), den2 = gf2(), den4 = gf2(), den6 = gf2();
    set25519(r2[2], gf1);
    unpack25519(r2[1], p3);
    square(num, r2[1]);
    mul5(den, num, D2);
    sub(num, num, r2[2]);
    add5(den, r2[2], den);
    square(den2, den);
    square(den4, den2);
    mul5(den6, den4, den2);
    mul5(t, den6, num);
    mul5(t, t, den);
    pow2523(t, t);
    mul5(t, t, num);
    mul5(t, t, den);
    mul5(t, t, den);
    mul5(r2[0], t, den);
    square(chk, r2[0]);
    mul5(chk, chk, den);
    if (neq25519(chk, num)) {
      mul5(r2[0], r2[0], I2);
    }
    square(chk, r2[0]);
    mul5(chk, chk, den);
    if (neq25519(chk, num)) {
      return -1;
    }
    if (par25519(r2[0]) === p3[31] >> 7) {
      sub(r2[0], gf0, r2[0]);
    }
    mul5(r2[3], r2[0], r2[1]);
    return 0;
  }
  function verify5(publicKey, message, signature2) {
    const t = new Uint8Array(32);
    const p3 = [gf2(), gf2(), gf2(), gf2()];
    const q2 = [gf2(), gf2(), gf2(), gf2()];
    if (signature2.length !== exports$1.SIGNATURE_LENGTH) {
      throw new Error(`ed25519: signature must be ${exports$1.SIGNATURE_LENGTH} bytes`);
    }
    if (unpackneg(q2, publicKey)) {
      return false;
    }
    const hs = new sha512_1.SHA512();
    hs.update(signature2.subarray(0, 32));
    hs.update(publicKey);
    hs.update(message);
    const h3 = hs.digest();
    reduce(h3);
    scalarmult(p3, q2, h3);
    scalarbase(q2, signature2.subarray(32));
    edadd(p3, q2);
    pack(t, p3);
    if (verify32(signature2, t)) {
      return false;
    }
    return true;
  }
  exports$1.verify = verify5;
  function convertPublicKeyToX25519(publicKey) {
    let q2 = [gf2(), gf2(), gf2(), gf2()];
    if (unpackneg(q2, publicKey)) {
      throw new Error("Ed25519: invalid public key");
    }
    let a3 = gf2();
    let b2 = gf2();
    let y3 = q2[1];
    add5(a3, gf1, y3);
    sub(b2, gf1, y3);
    inv25519(b2, b2);
    mul5(a3, a3, b2);
    let z3 = new Uint8Array(32);
    pack25519(z3, a3);
    return z3;
  }
  exports$1.convertPublicKeyToX25519 = convertPublicKeyToX25519;
  function convertSecretKeyToX25519(secretKey) {
    const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d3[0] &= 248;
    d3[31] &= 127;
    d3[31] |= 64;
    const o2 = new Uint8Array(d3.subarray(0, 32));
    (0, wipe_12.wipe)(d3);
    return o2;
  }
  exports$1.convertSecretKeyToX25519 = convertSecretKeyToX25519;
})(ed25519);
const JWT_IRIDIUM_ALG = "EdDSA";
const JWT_IRIDIUM_TYP = "JWT";
const JWT_DELIMITER = ".";
const JWT_ENCODING = "base64url";
const JSON_ENCODING = "utf8";
const DATA_ENCODING = "utf8";
const DID_DELIMITER = ":";
const DID_PREFIX = "did";
const DID_METHOD = "key";
const MULTICODEC_ED25519_ENCODING = "base58btc";
const MULTICODEC_ED25519_BASE = "z";
const MULTICODEC_ED25519_HEADER = "K36";
const KEY_PAIR_SEED_LENGTH = 32;
function decodeJSON(str) {
  return safeJsonParse(toString(fromString(str, JWT_ENCODING), JSON_ENCODING));
}
function encodeJSON(val) {
  return toString(fromString(safeJsonStringify(val), JSON_ENCODING), JWT_ENCODING);
}
function encodeIss(publicKey) {
  const header = fromString(MULTICODEC_ED25519_HEADER, MULTICODEC_ED25519_ENCODING);
  const multicodec = MULTICODEC_ED25519_BASE + toString(concat([header, publicKey]), MULTICODEC_ED25519_ENCODING);
  return [DID_PREFIX, DID_METHOD, multicodec].join(DID_DELIMITER);
}
function encodeSig(bytes) {
  return toString(bytes, JWT_ENCODING);
}
function decodeSig(encoded) {
  return fromString(encoded, JWT_ENCODING);
}
function encodeData(params) {
  return fromString([encodeJSON(params.header), encodeJSON(params.payload)].join(JWT_DELIMITER), DATA_ENCODING);
}
function encodeJWT(params) {
  return [
    encodeJSON(params.header),
    encodeJSON(params.payload),
    encodeSig(params.signature)
  ].join(JWT_DELIMITER);
}
function decodeJWT(jwt) {
  const params = jwt.split(JWT_DELIMITER);
  const header = decodeJSON(params[0]);
  const payload = decodeJSON(params[1]);
  const signature2 = decodeSig(params[2]);
  const data = fromString(params.slice(0, 2).join(JWT_DELIMITER), DATA_ENCODING);
  return { header, payload, signature: signature2, data };
}
function generateKeyPair(seed = random.randomBytes(KEY_PAIR_SEED_LENGTH)) {
  return ed25519.generateKeyPairFromSeed(seed);
}
async function signJWT(sub, aud, ttl, keyPair2, iat = cjs.fromMiliseconds(Date.now())) {
  const header = { alg: JWT_IRIDIUM_ALG, typ: JWT_IRIDIUM_TYP };
  const iss = encodeIss(keyPair2.publicKey);
  const exp = iat + ttl;
  const payload = { iss, sub, aud, iat, exp };
  const data = encodeData({ header, payload });
  const signature2 = ed25519.sign(keyPair2.secretKey, data);
  return encodeJWT({ header, payload, signature: signature2 });
}
const Rr$1 = ":";
function mn$1(e) {
  const [t, r2] = e.split(Rr$1);
  return { namespace: t, reference: r2 };
}
function Jo(e, t = []) {
  const r2 = [];
  return Object.keys(e).forEach((i2) => {
    if (t.length && !t.includes(i2)) return;
    const n2 = e[i2];
    r2.push(...n2.accounts);
  }), r2;
}
function Or$1(e, t) {
  return e.includes(":") ? [e] : t.chains || [];
}
var Vo = Object.defineProperty, Mn = Object.getOwnPropertySymbols, Wo = Object.prototype.hasOwnProperty, Xo = Object.prototype.propertyIsEnumerable, En$1 = (e, t, r2) => t in e ? Vo(e, t, { enumerable: true, configurable: true, writable: true, value: r2 }) : e[t] = r2, Sn$1 = (e, t) => {
  for (var r2 in t || (t = {})) Wo.call(t, r2) && En$1(e, r2, t[r2]);
  if (Mn) for (var r2 of Mn(t)) Xo.call(t, r2) && En$1(e, r2, t[r2]);
  return e;
};
const Nn = "ReactNative", qt$1 = { reactNative: "react-native", node: "node", browser: "browser", unknown: "unknown" }, _n$1 = "js";
function bi() {
  return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function rr$1() {
  return !getDocument_1() && !!getNavigator_1() && navigator.product === Nn;
}
function gr$1() {
  return !bi() && !!getNavigator_1() && !!getDocument_1();
}
function We$1() {
  return rr$1() ? qt$1.reactNative : bi() ? qt$1.node : gr$1() ? qt$1.browser : qt$1.unknown;
}
function ts() {
  var e;
  try {
    return rr$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (e = global.Application) == null ? void 0 : e.applicationId : void 0;
  } catch {
    return;
  }
}
function Bn(e, t) {
  let r2 = queryString.parse(e);
  return r2 = Sn$1(Sn$1({}, r2), t), e = queryString.stringify(r2), e;
}
function es() {
  return getWindowMetadata_1() || { name: "", description: "", url: "", icons: [""] };
}
function Cn$1() {
  if (We$1() === qt$1.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
    const { OS: r2, Version: i2 } = global.Platform;
    return [r2, i2].join("-");
  }
  const e = detect();
  if (e === null) return "unknown";
  const t = e.os ? e.os.replace(" ", "").toLowerCase() : "unknown";
  return e.type === "browser" ? [t, e.name, e.version].join("-") : [t, e.version].join("-");
}
function Rn() {
  var e;
  const t = We$1();
  return t === qt$1.browser ? [t, ((e = getLocation_1()) == null ? void 0 : e.host) || "unknown"].join(":") : t;
}
function On(e, t, r2) {
  const i2 = Cn$1(), n2 = Rn();
  return [[e, t].join("-"), [_n$1, r2].join("-"), i2, n2].join("/");
}
function is({ protocol: e, version: t, relayUrl: r2, sdkVersion: i2, auth: n2, projectId: o2, useOnCloseEvent: h3, bundleId: p3 }) {
  const A2 = r2.split("?"), v3 = On(e, t, i2), w2 = { auth: n2, ua: v3, projectId: o2, useOnCloseEvent: h3, origin: p3 || void 0 }, y3 = Bn(A2[1] || "", w2);
  return A2[0] + "?" + y3;
}
function _e$3(e, t) {
  return e.filter((r2) => t.includes(r2)).length === e.length;
}
function ss(e) {
  return Object.fromEntries(e.entries());
}
function as(e) {
  return new Map(Object.entries(e));
}
function ls(e = cjs.FIVE_MINUTES, t) {
  const r2 = cjs.toMiliseconds(e || cjs.FIVE_MINUTES);
  let i2, n2, o2;
  return { resolve: (h3) => {
    o2 && i2 && (clearTimeout(o2), i2(h3));
  }, reject: (h3) => {
    o2 && n2 && (clearTimeout(o2), n2(h3));
  }, done: () => new Promise((h3, p3) => {
    o2 = setTimeout(() => {
      p3(new Error(t));
    }, r2), i2 = h3, n2 = p3;
  }) };
}
function ds(e, t, r2) {
  return new Promise(async (i2, n2) => {
    const o2 = setTimeout(() => n2(new Error(r2)), t);
    try {
      const h3 = await e;
      i2(h3);
    } catch (h3) {
      n2(h3);
    }
    clearTimeout(o2);
  });
}
function yi$1(e, t) {
  if (typeof t == "string" && t.startsWith(`${e}:`)) return t;
  if (e.toLowerCase() === "topic") {
    if (typeof t != "string") throw new Error('Value must be "string" for expirer target type: topic');
    return `topic:${t}`;
  } else if (e.toLowerCase() === "id") {
    if (typeof t != "number") throw new Error('Value must be "number" for expirer target type: id');
    return `id:${t}`;
  }
  throw new Error(`Unknown expirer target type: ${e}`);
}
function ps(e) {
  return yi$1("topic", e);
}
function vs$2(e) {
  return yi$1("id", e);
}
function gs$1(e) {
  const [t, r2] = e.split(":"), i2 = { id: void 0, topic: void 0 };
  if (t === "topic" && typeof r2 == "string") i2.topic = r2;
  else if (t === "id" && Number.isInteger(Number(r2))) i2.id = Number(r2);
  else throw new Error(`Invalid target, expected id:number or topic:string, got ${t}:${r2}`);
  return i2;
}
function ms$2(e, t) {
  return cjs.fromMiliseconds(Date.now() + cjs.toMiliseconds(e));
}
function As$1(e) {
  return Date.now() >= cjs.toMiliseconds(e);
}
function bs$1(e, t) {
  return `${e}${t ? `:${t}` : ""}`;
}
function me$1(e = [], t = []) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
async function ys$2({ id: e, topic: t, wcDeepLink: r2 }) {
  var i2;
  try {
    if (!r2) return;
    const n2 = typeof r2 == "string" ? JSON.parse(r2) : r2;
    let o2 = n2 == null ? void 0 : n2.href;
    if (typeof o2 != "string") return;
    o2.endsWith("/") && (o2 = o2.slice(0, -1));
    const h3 = `${o2}/wc?requestId=${e}&sessionTopic=${t}`, p3 = We$1();
    if (p3 === qt$1.browser) {
      if (!((i2 = getDocument_1()) != null && i2.hasFocus())) {
        console.warn("Document does not have focus, skipping deeplink.");
        return;
      }
      h3.startsWith("https://") || h3.startsWith("http://") ? window.open(h3, "_blank", "noreferrer noopener") : window.open(h3, "_self", "noreferrer noopener");
    } else p3 === qt$1.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(h3);
  } catch (n2) {
    console.error(n2);
  }
}
async function ws$2(e, t) {
  try {
    return await e.getItem(t) || (gr$1() ? localStorage.getItem(t) : void 0);
  } catch (r2) {
    console.error(r2);
  }
}
function xs$1(e, t) {
  if (!e.includes(t)) return null;
  const r2 = e.split(/([&,?,=])/), i2 = r2.indexOf(t);
  return r2[i2 + 2];
}
function Ms$1() {
  return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
var Tn$1 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Es$2(e) {
  var t = e.default;
  if (typeof t == "function") {
    var r2 = function() {
      return t.apply(this, arguments);
    };
    r2.prototype = t.prototype;
  } else r2 = {};
  return Object.defineProperty(r2, "__esModule", { value: true }), Object.keys(e).forEach(function(i2) {
    var n2 = Object.getOwnPropertyDescriptor(e, i2);
    Object.defineProperty(r2, i2, n2.get ? n2 : { enumerable: true, get: function() {
      return e[i2];
    } });
  }), r2;
}
var Un = { exports: {} };
/**
* [js-sha3]{@link https://github.com/emn178/js-sha3}
*
* @version 0.8.0
* @author Chen, Yi-Cyuan [emn178@gmail.com]
* @copyright Chen, Yi-Cyuan 2015-2018
* @license MIT
*/
(function(e) {
  (function() {
    var t = "input is invalid type", r2 = "finalize already called", i2 = typeof window == "object", n2 = i2 ? window : {};
    n2.JS_SHA3_NO_WINDOW && (i2 = false);
    var o2 = !i2 && typeof self == "object", h3 = !n2.JS_SHA3_NO_NODE_JS && typeof process == "object" && process.versions && process.versions.node;
    h3 ? n2 = Tn$1 : o2 && (n2 = self);
    var p3 = !n2.JS_SHA3_NO_COMMON_JS && true && e.exports, A2 = !n2.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer < "u", v3 = "0123456789abcdef".split(""), w2 = [31, 7936, 2031616, 520093696], y3 = [4, 1024, 262144, 67108864], S4 = [1, 256, 65536, 16777216], I2 = [6, 1536, 393216, 100663296], N2 = [0, 8, 16, 24], C3 = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648], F2 = [224, 256, 384, 512], U2 = [128, 256], J = ["hex", "buffer", "arrayBuffer", "array", "digest"], Bt2 = { 128: 168, 256: 136 };
    (n2.JS_SHA3_NO_NODE_JS || !Array.isArray) && (Array.isArray = function(u3) {
      return Object.prototype.toString.call(u3) === "[object Array]";
    }), A2 && (n2.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) && (ArrayBuffer.isView = function(u3) {
      return typeof u3 == "object" && u3.buffer && u3.buffer.constructor === ArrayBuffer;
    });
    for (var G = function(u3, E2, _2) {
      return function(B2) {
        return new s2(u3, E2, u3).update(B2)[_2]();
      };
    }, H = function(u3, E2, _2) {
      return function(B2, R3) {
        return new s2(u3, E2, R3).update(B2)[_2]();
      };
    }, L3 = function(u3, E2, _2) {
      return function(B2, R3, T2, P2) {
        return f3["cshake" + u3].update(B2, R3, T2, P2)[_2]();
      };
    }, Pt2 = function(u3, E2, _2) {
      return function(B2, R3, T2, P2) {
        return f3["kmac" + u3].update(B2, R3, T2, P2)[_2]();
      };
    }, W = function(u3, E2, _2, B2) {
      for (var R3 = 0; R3 < J.length; ++R3) {
        var T2 = J[R3];
        u3[T2] = E2(_2, B2, T2);
      }
      return u3;
    }, Rt2 = function(u3, E2) {
      var _2 = G(u3, E2, "hex");
      return _2.create = function() {
        return new s2(u3, E2, u3);
      }, _2.update = function(B2) {
        return _2.create().update(B2);
      }, W(_2, G, u3, E2);
    }, Vt2 = function(u3, E2) {
      var _2 = H(u3, E2, "hex");
      return _2.create = function(B2) {
        return new s2(u3, E2, B2);
      }, _2.update = function(B2, R3) {
        return _2.create(R3).update(B2);
      }, W(_2, H, u3, E2);
    }, Y = function(u3, E2) {
      var _2 = Bt2[u3], B2 = L3(u3, E2, "hex");
      return B2.create = function(R3, T2, P2) {
        return !T2 && !P2 ? f3["shake" + u3].create(R3) : new s2(u3, E2, R3).bytepad([T2, P2], _2);
      }, B2.update = function(R3, T2, P2, O3) {
        return B2.create(T2, P2, O3).update(R3);
      }, W(B2, L3, u3, E2);
    }, Wt2 = function(u3, E2) {
      var _2 = Bt2[u3], B2 = Pt2(u3, E2, "hex");
      return B2.create = function(R3, T2, P2) {
        return new g3(u3, E2, T2).bytepad(["KMAC", P2], _2).bytepad([R3], _2);
      }, B2.update = function(R3, T2, P2, O3) {
        return B2.create(R3, P2, O3).update(T2);
      }, W(B2, Pt2, u3, E2);
    }, b2 = [{ name: "keccak", padding: S4, bits: F2, createMethod: Rt2 }, { name: "sha3", padding: I2, bits: F2, createMethod: Rt2 }, { name: "shake", padding: w2, bits: U2, createMethod: Vt2 }, { name: "cshake", padding: y3, bits: U2, createMethod: Y }, { name: "kmac", padding: y3, bits: U2, createMethod: Wt2 }], f3 = {}, a3 = [], c2 = 0; c2 < b2.length; ++c2) for (var d3 = b2[c2], m3 = d3.bits, x3 = 0; x3 < m3.length; ++x3) {
      var M3 = d3.name + "_" + m3[x3];
      if (a3.push(M3), f3[M3] = d3.createMethod(m3[x3], d3.padding), d3.name !== "sha3") {
        var l2 = d3.name + m3[x3];
        a3.push(l2), f3[l2] = f3[M3];
      }
    }
    function s2(u3, E2, _2) {
      this.blocks = [], this.s = [], this.padding = E2, this.outputBits = _2, this.reset = true, this.finalized = false, this.block = 0, this.start = 0, this.blockCount = 1600 - (u3 << 1) >> 5, this.byteCount = this.blockCount << 2, this.outputBlocks = _2 >> 5, this.extraBytes = (_2 & 31) >> 3;
      for (var B2 = 0; B2 < 50; ++B2) this.s[B2] = 0;
    }
    s2.prototype.update = function(u3) {
      if (this.finalized) throw new Error(r2);
      var E2, _2 = typeof u3;
      if (_2 !== "string") {
        if (_2 === "object") {
          if (u3 === null) throw new Error(t);
          if (A2 && u3.constructor === ArrayBuffer) u3 = new Uint8Array(u3);
          else if (!Array.isArray(u3) && (!A2 || !ArrayBuffer.isView(u3))) throw new Error(t);
        } else throw new Error(t);
        E2 = true;
      }
      for (var B2 = this.blocks, R3 = this.byteCount, T2 = u3.length, P2 = this.blockCount, O3 = 0, Ct2 = this.s, D2, q2; O3 < T2; ) {
        if (this.reset) for (this.reset = false, B2[0] = this.block, D2 = 1; D2 < P2 + 1; ++D2) B2[D2] = 0;
        if (E2) for (D2 = this.start; O3 < T2 && D2 < R3; ++O3) B2[D2 >> 2] |= u3[O3] << N2[D2++ & 3];
        else for (D2 = this.start; O3 < T2 && D2 < R3; ++O3) q2 = u3.charCodeAt(O3), q2 < 128 ? B2[D2 >> 2] |= q2 << N2[D2++ & 3] : q2 < 2048 ? (B2[D2 >> 2] |= (192 | q2 >> 6) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 & 63) << N2[D2++ & 3]) : q2 < 55296 || q2 >= 57344 ? (B2[D2 >> 2] |= (224 | q2 >> 12) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 >> 6 & 63) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 & 63) << N2[D2++ & 3]) : (q2 = 65536 + ((q2 & 1023) << 10 | u3.charCodeAt(++O3) & 1023), B2[D2 >> 2] |= (240 | q2 >> 18) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 >> 12 & 63) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 >> 6 & 63) << N2[D2++ & 3], B2[D2 >> 2] |= (128 | q2 & 63) << N2[D2++ & 3]);
        if (this.lastByteIndex = D2, D2 >= R3) {
          for (this.start = D2 - R3, this.block = B2[P2], D2 = 0; D2 < P2; ++D2) Ct2[D2] ^= B2[D2];
          k2(Ct2), this.reset = true;
        } else this.start = D2;
      }
      return this;
    }, s2.prototype.encode = function(u3, E2) {
      var _2 = u3 & 255, B2 = 1, R3 = [_2];
      for (u3 = u3 >> 8, _2 = u3 & 255; _2 > 0; ) R3.unshift(_2), u3 = u3 >> 8, _2 = u3 & 255, ++B2;
      return E2 ? R3.push(B2) : R3.unshift(B2), this.update(R3), R3.length;
    }, s2.prototype.encodeString = function(u3) {
      var E2, _2 = typeof u3;
      if (_2 !== "string") {
        if (_2 === "object") {
          if (u3 === null) throw new Error(t);
          if (A2 && u3.constructor === ArrayBuffer) u3 = new Uint8Array(u3);
          else if (!Array.isArray(u3) && (!A2 || !ArrayBuffer.isView(u3))) throw new Error(t);
        } else throw new Error(t);
        E2 = true;
      }
      var B2 = 0, R3 = u3.length;
      if (E2) B2 = R3;
      else for (var T2 = 0; T2 < u3.length; ++T2) {
        var P2 = u3.charCodeAt(T2);
        P2 < 128 ? B2 += 1 : P2 < 2048 ? B2 += 2 : P2 < 55296 || P2 >= 57344 ? B2 += 3 : (P2 = 65536 + ((P2 & 1023) << 10 | u3.charCodeAt(++T2) & 1023), B2 += 4);
      }
      return B2 += this.encode(B2 * 8), this.update(u3), B2;
    }, s2.prototype.bytepad = function(u3, E2) {
      for (var _2 = this.encode(E2), B2 = 0; B2 < u3.length; ++B2) _2 += this.encodeString(u3[B2]);
      var R3 = E2 - _2 % E2, T2 = [];
      return T2.length = R3, this.update(T2), this;
    }, s2.prototype.finalize = function() {
      if (!this.finalized) {
        this.finalized = true;
        var u3 = this.blocks, E2 = this.lastByteIndex, _2 = this.blockCount, B2 = this.s;
        if (u3[E2 >> 2] |= this.padding[E2 & 3], this.lastByteIndex === this.byteCount) for (u3[0] = u3[_2], E2 = 1; E2 < _2 + 1; ++E2) u3[E2] = 0;
        for (u3[_2 - 1] |= 2147483648, E2 = 0; E2 < _2; ++E2) B2[E2] ^= u3[E2];
        k2(B2);
      }
    }, s2.prototype.toString = s2.prototype.hex = function() {
      this.finalize();
      for (var u3 = this.blockCount, E2 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R3 = 0, T2 = 0, P2 = "", O3; T2 < _2; ) {
        for (R3 = 0; R3 < u3 && T2 < _2; ++R3, ++T2) O3 = E2[R3], P2 += v3[O3 >> 4 & 15] + v3[O3 & 15] + v3[O3 >> 12 & 15] + v3[O3 >> 8 & 15] + v3[O3 >> 20 & 15] + v3[O3 >> 16 & 15] + v3[O3 >> 28 & 15] + v3[O3 >> 24 & 15];
        T2 % u3 === 0 && (k2(E2), R3 = 0);
      }
      return B2 && (O3 = E2[R3], P2 += v3[O3 >> 4 & 15] + v3[O3 & 15], B2 > 1 && (P2 += v3[O3 >> 12 & 15] + v3[O3 >> 8 & 15]), B2 > 2 && (P2 += v3[O3 >> 20 & 15] + v3[O3 >> 16 & 15])), P2;
    }, s2.prototype.arrayBuffer = function() {
      this.finalize();
      var u3 = this.blockCount, E2 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R3 = 0, T2 = 0, P2 = this.outputBits >> 3, O3;
      B2 ? O3 = new ArrayBuffer(_2 + 1 << 2) : O3 = new ArrayBuffer(P2);
      for (var Ct2 = new Uint32Array(O3); T2 < _2; ) {
        for (R3 = 0; R3 < u3 && T2 < _2; ++R3, ++T2) Ct2[T2] = E2[R3];
        T2 % u3 === 0 && k2(E2);
      }
      return B2 && (Ct2[R3] = E2[R3], O3 = O3.slice(0, P2)), O3;
    }, s2.prototype.buffer = s2.prototype.arrayBuffer, s2.prototype.digest = s2.prototype.array = function() {
      this.finalize();
      for (var u3 = this.blockCount, E2 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R3 = 0, T2 = 0, P2 = [], O3, Ct2; T2 < _2; ) {
        for (R3 = 0; R3 < u3 && T2 < _2; ++R3, ++T2) O3 = T2 << 2, Ct2 = E2[R3], P2[O3] = Ct2 & 255, P2[O3 + 1] = Ct2 >> 8 & 255, P2[O3 + 2] = Ct2 >> 16 & 255, P2[O3 + 3] = Ct2 >> 24 & 255;
        T2 % u3 === 0 && k2(E2);
      }
      return B2 && (O3 = T2 << 2, Ct2 = E2[R3], P2[O3] = Ct2 & 255, B2 > 1 && (P2[O3 + 1] = Ct2 >> 8 & 255), B2 > 2 && (P2[O3 + 2] = Ct2 >> 16 & 255)), P2;
    };
    function g3(u3, E2, _2) {
      s2.call(this, u3, E2, _2);
    }
    g3.prototype = new s2(), g3.prototype.finalize = function() {
      return this.encode(this.outputBits, true), s2.prototype.finalize.call(this);
    };
    var k2 = function(u3) {
      var E2, _2, B2, R3, T2, P2, O3, Ct2, D2, q2, De2, X2, Z2, Fe, $2, tt2, Te2, et2, rt2, Ue, it2, nt2, ke, ft2, ot2, qe, st2, at2, Ke, ut2, ht2, He, ct2, lt2, Le2, dt2, pt2, ze, vt2, gt2, je, mt2, At2, Qe2, bt2, yt2, Je2, wt2, xt2, Ge, Mt2, Et2, Ye2, St2, Nt2, Ve, It2, _t2, Me, Ee2, Se2, Ne, Ie2;
      for (B2 = 0; B2 < 48; B2 += 2) R3 = u3[0] ^ u3[10] ^ u3[20] ^ u3[30] ^ u3[40], T2 = u3[1] ^ u3[11] ^ u3[21] ^ u3[31] ^ u3[41], P2 = u3[2] ^ u3[12] ^ u3[22] ^ u3[32] ^ u3[42], O3 = u3[3] ^ u3[13] ^ u3[23] ^ u3[33] ^ u3[43], Ct2 = u3[4] ^ u3[14] ^ u3[24] ^ u3[34] ^ u3[44], D2 = u3[5] ^ u3[15] ^ u3[25] ^ u3[35] ^ u3[45], q2 = u3[6] ^ u3[16] ^ u3[26] ^ u3[36] ^ u3[46], De2 = u3[7] ^ u3[17] ^ u3[27] ^ u3[37] ^ u3[47], X2 = u3[8] ^ u3[18] ^ u3[28] ^ u3[38] ^ u3[48], Z2 = u3[9] ^ u3[19] ^ u3[29] ^ u3[39] ^ u3[49], E2 = X2 ^ (P2 << 1 | O3 >>> 31), _2 = Z2 ^ (O3 << 1 | P2 >>> 31), u3[0] ^= E2, u3[1] ^= _2, u3[10] ^= E2, u3[11] ^= _2, u3[20] ^= E2, u3[21] ^= _2, u3[30] ^= E2, u3[31] ^= _2, u3[40] ^= E2, u3[41] ^= _2, E2 = R3 ^ (Ct2 << 1 | D2 >>> 31), _2 = T2 ^ (D2 << 1 | Ct2 >>> 31), u3[2] ^= E2, u3[3] ^= _2, u3[12] ^= E2, u3[13] ^= _2, u3[22] ^= E2, u3[23] ^= _2, u3[32] ^= E2, u3[33] ^= _2, u3[42] ^= E2, u3[43] ^= _2, E2 = P2 ^ (q2 << 1 | De2 >>> 31), _2 = O3 ^ (De2 << 1 | q2 >>> 31), u3[4] ^= E2, u3[5] ^= _2, u3[14] ^= E2, u3[15] ^= _2, u3[24] ^= E2, u3[25] ^= _2, u3[34] ^= E2, u3[35] ^= _2, u3[44] ^= E2, u3[45] ^= _2, E2 = Ct2 ^ (X2 << 1 | Z2 >>> 31), _2 = D2 ^ (Z2 << 1 | X2 >>> 31), u3[6] ^= E2, u3[7] ^= _2, u3[16] ^= E2, u3[17] ^= _2, u3[26] ^= E2, u3[27] ^= _2, u3[36] ^= E2, u3[37] ^= _2, u3[46] ^= E2, u3[47] ^= _2, E2 = q2 ^ (R3 << 1 | T2 >>> 31), _2 = De2 ^ (T2 << 1 | R3 >>> 31), u3[8] ^= E2, u3[9] ^= _2, u3[18] ^= E2, u3[19] ^= _2, u3[28] ^= E2, u3[29] ^= _2, u3[38] ^= E2, u3[39] ^= _2, u3[48] ^= E2, u3[49] ^= _2, Fe = u3[0], $2 = u3[1], yt2 = u3[11] << 4 | u3[10] >>> 28, Je2 = u3[10] << 4 | u3[11] >>> 28, at2 = u3[20] << 3 | u3[21] >>> 29, Ke = u3[21] << 3 | u3[20] >>> 29, Ee2 = u3[31] << 9 | u3[30] >>> 23, Se2 = u3[30] << 9 | u3[31] >>> 23, mt2 = u3[40] << 18 | u3[41] >>> 14, At2 = u3[41] << 18 | u3[40] >>> 14, lt2 = u3[2] << 1 | u3[3] >>> 31, Le2 = u3[3] << 1 | u3[2] >>> 31, tt2 = u3[13] << 12 | u3[12] >>> 20, Te2 = u3[12] << 12 | u3[13] >>> 20, wt2 = u3[22] << 10 | u3[23] >>> 22, xt2 = u3[23] << 10 | u3[22] >>> 22, ut2 = u3[33] << 13 | u3[32] >>> 19, ht2 = u3[32] << 13 | u3[33] >>> 19, Ne = u3[42] << 2 | u3[43] >>> 30, Ie2 = u3[43] << 2 | u3[42] >>> 30, St2 = u3[5] << 30 | u3[4] >>> 2, Nt2 = u3[4] << 30 | u3[5] >>> 2, dt2 = u3[14] << 6 | u3[15] >>> 26, pt2 = u3[15] << 6 | u3[14] >>> 26, et2 = u3[25] << 11 | u3[24] >>> 21, rt2 = u3[24] << 11 | u3[25] >>> 21, Ge = u3[34] << 15 | u3[35] >>> 17, Mt2 = u3[35] << 15 | u3[34] >>> 17, He = u3[45] << 29 | u3[44] >>> 3, ct2 = u3[44] << 29 | u3[45] >>> 3, ft2 = u3[6] << 28 | u3[7] >>> 4, ot2 = u3[7] << 28 | u3[6] >>> 4, Ve = u3[17] << 23 | u3[16] >>> 9, It2 = u3[16] << 23 | u3[17] >>> 9, ze = u3[26] << 25 | u3[27] >>> 7, vt2 = u3[27] << 25 | u3[26] >>> 7, Ue = u3[36] << 21 | u3[37] >>> 11, it2 = u3[37] << 21 | u3[36] >>> 11, Et2 = u3[47] << 24 | u3[46] >>> 8, Ye2 = u3[46] << 24 | u3[47] >>> 8, Qe2 = u3[8] << 27 | u3[9] >>> 5, bt2 = u3[9] << 27 | u3[8] >>> 5, qe = u3[18] << 20 | u3[19] >>> 12, st2 = u3[19] << 20 | u3[18] >>> 12, _t2 = u3[29] << 7 | u3[28] >>> 25, Me = u3[28] << 7 | u3[29] >>> 25, gt2 = u3[38] << 8 | u3[39] >>> 24, je = u3[39] << 8 | u3[38] >>> 24, nt2 = u3[48] << 14 | u3[49] >>> 18, ke = u3[49] << 14 | u3[48] >>> 18, u3[0] = Fe ^ ~tt2 & et2, u3[1] = $2 ^ ~Te2 & rt2, u3[10] = ft2 ^ ~qe & at2, u3[11] = ot2 ^ ~st2 & Ke, u3[20] = lt2 ^ ~dt2 & ze, u3[21] = Le2 ^ ~pt2 & vt2, u3[30] = Qe2 ^ ~yt2 & wt2, u3[31] = bt2 ^ ~Je2 & xt2, u3[40] = St2 ^ ~Ve & _t2, u3[41] = Nt2 ^ ~It2 & Me, u3[2] = tt2 ^ ~et2 & Ue, u3[3] = Te2 ^ ~rt2 & it2, u3[12] = qe ^ ~at2 & ut2, u3[13] = st2 ^ ~Ke & ht2, u3[22] = dt2 ^ ~ze & gt2, u3[23] = pt2 ^ ~vt2 & je, u3[32] = yt2 ^ ~wt2 & Ge, u3[33] = Je2 ^ ~xt2 & Mt2, u3[42] = Ve ^ ~_t2 & Ee2, u3[43] = It2 ^ ~Me & Se2, u3[4] = et2 ^ ~Ue & nt2, u3[5] = rt2 ^ ~it2 & ke, u3[14] = at2 ^ ~ut2 & He, u3[15] = Ke ^ ~ht2 & ct2, u3[24] = ze ^ ~gt2 & mt2, u3[25] = vt2 ^ ~je & At2, u3[34] = wt2 ^ ~Ge & Et2, u3[35] = xt2 ^ ~Mt2 & Ye2, u3[44] = _t2 ^ ~Ee2 & Ne, u3[45] = Me ^ ~Se2 & Ie2, u3[6] = Ue ^ ~nt2 & Fe, u3[7] = it2 ^ ~ke & $2, u3[16] = ut2 ^ ~He & ft2, u3[17] = ht2 ^ ~ct2 & ot2, u3[26] = gt2 ^ ~mt2 & lt2, u3[27] = je ^ ~At2 & Le2, u3[36] = Ge ^ ~Et2 & Qe2, u3[37] = Mt2 ^ ~Ye2 & bt2, u3[46] = Ee2 ^ ~Ne & St2, u3[47] = Se2 ^ ~Ie2 & Nt2, u3[8] = nt2 ^ ~Fe & tt2, u3[9] = ke ^ ~$2 & Te2, u3[18] = He ^ ~ft2 & qe, u3[19] = ct2 ^ ~ot2 & st2, u3[28] = mt2 ^ ~lt2 & dt2, u3[29] = At2 ^ ~Le2 & pt2, u3[38] = Et2 ^ ~Qe2 & yt2, u3[39] = Ye2 ^ ~bt2 & Je2, u3[48] = Ne ^ ~St2 & Ve, u3[49] = Ie2 ^ ~Nt2 & It2, u3[0] ^= C3[B2], u3[1] ^= C3[B2 + 1];
    };
    if (p3) e.exports = f3;
    else for (c2 = 0; c2 < a3.length; ++c2) n2[a3[c2]] = f3[a3[c2]];
  })();
})(Un);
var Ss$2 = Un.exports;
const Ns$1 = "logger/5.7.0";
let kn = false, qn = false;
const Dr$1 = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
let Kn$1 = Dr$1.default, xi = null;
function Is$2() {
  try {
    const e = [];
    if (["NFD", "NFC", "NFKD", "NFKC"].forEach((t) => {
      try {
        if ("test".normalize(t) !== "test") throw new Error("bad normalize");
      } catch {
        e.push(t);
      }
    }), e.length) throw new Error("missing " + e.join(", "));
    if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken implementation");
  } catch (e) {
    return e.message;
  }
  return null;
}
const Hn = Is$2();
var Mi$1;
(function(e) {
  e.DEBUG = "DEBUG", e.INFO = "INFO", e.WARNING = "WARNING", e.ERROR = "ERROR", e.OFF = "OFF";
})(Mi$1 || (Mi$1 = {}));
var re;
(function(e) {
  e.UNKNOWN_ERROR = "UNKNOWN_ERROR", e.NOT_IMPLEMENTED = "NOT_IMPLEMENTED", e.UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION", e.NETWORK_ERROR = "NETWORK_ERROR", e.SERVER_ERROR = "SERVER_ERROR", e.TIMEOUT = "TIMEOUT", e.BUFFER_OVERRUN = "BUFFER_OVERRUN", e.NUMERIC_FAULT = "NUMERIC_FAULT", e.MISSING_NEW = "MISSING_NEW", e.INVALID_ARGUMENT = "INVALID_ARGUMENT", e.MISSING_ARGUMENT = "MISSING_ARGUMENT", e.UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT", e.CALL_EXCEPTION = "CALL_EXCEPTION", e.INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS", e.NONCE_EXPIRED = "NONCE_EXPIRED", e.REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED", e.UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT", e.TRANSACTION_REPLACED = "TRANSACTION_REPLACED", e.ACTION_REJECTED = "ACTION_REJECTED";
})(re || (re = {}));
const Ln = "0123456789abcdef";
let z$3 = class z {
  constructor(t) {
    Object.defineProperty(this, "version", { enumerable: true, value: t, writable: false });
  }
  _log(t, r2) {
    const i2 = t.toLowerCase();
    Dr$1[i2] == null && this.throwArgumentError("invalid log level name", "logLevel", t), !(Kn$1 > Dr$1[i2]) && console.log.apply(console, r2);
  }
  debug(...t) {
    this._log(z.levels.DEBUG, t);
  }
  info(...t) {
    this._log(z.levels.INFO, t);
  }
  warn(...t) {
    this._log(z.levels.WARNING, t);
  }
  makeError(t, r2, i2) {
    if (qn) return this.makeError("censored error", r2, {});
    r2 || (r2 = z.errors.UNKNOWN_ERROR), i2 || (i2 = {});
    const n2 = [];
    Object.keys(i2).forEach((A2) => {
      const v3 = i2[A2];
      try {
        if (v3 instanceof Uint8Array) {
          let w2 = "";
          for (let y3 = 0; y3 < v3.length; y3++) w2 += Ln[v3[y3] >> 4], w2 += Ln[v3[y3] & 15];
          n2.push(A2 + "=Uint8Array(0x" + w2 + ")");
        } else n2.push(A2 + "=" + JSON.stringify(v3));
      } catch {
        n2.push(A2 + "=" + JSON.stringify(i2[A2].toString()));
      }
    }), n2.push(`code=${r2}`), n2.push(`version=${this.version}`);
    const o2 = t;
    let h3 = "";
    switch (r2) {
      case re.NUMERIC_FAULT: {
        h3 = "NUMERIC_FAULT";
        const A2 = t;
        switch (A2) {
          case "overflow":
          case "underflow":
          case "division-by-zero":
            h3 += "-" + A2;
            break;
          case "negative-power":
          case "negative-width":
            h3 += "-unsupported";
            break;
          case "unbound-bitwise-result":
            h3 += "-unbound-result";
            break;
        }
        break;
      }
      case re.CALL_EXCEPTION:
      case re.INSUFFICIENT_FUNDS:
      case re.MISSING_NEW:
      case re.NONCE_EXPIRED:
      case re.REPLACEMENT_UNDERPRICED:
      case re.TRANSACTION_REPLACED:
      case re.UNPREDICTABLE_GAS_LIMIT:
        h3 = r2;
        break;
    }
    h3 && (t += " [ See: https://links.ethers.org/v5-errors-" + h3 + " ]"), n2.length && (t += " (" + n2.join(", ") + ")");
    const p3 = new Error(t);
    return p3.reason = o2, p3.code = r2, Object.keys(i2).forEach(function(A2) {
      p3[A2] = i2[A2];
    }), p3;
  }
  throwError(t, r2, i2) {
    throw this.makeError(t, r2, i2);
  }
  throwArgumentError(t, r2, i2) {
    return this.throwError(t, z.errors.INVALID_ARGUMENT, { argument: r2, value: i2 });
  }
  assert(t, r2, i2, n2) {
    t || this.throwError(r2, i2, n2);
  }
  assertArgument(t, r2, i2, n2) {
    t || this.throwArgumentError(r2, i2, n2);
  }
  checkNormalize(t) {
    Hn && this.throwError("platform missing String.prototype.normalize", z.errors.UNSUPPORTED_OPERATION, { operation: "String.prototype.normalize", form: Hn });
  }
  checkSafeUint53(t, r2) {
    typeof t == "number" && (r2 == null && (r2 = "value not safe"), (t < 0 || t >= 9007199254740991) && this.throwError(r2, z.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "out-of-safe-range", value: t }), t % 1 && this.throwError(r2, z.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "non-integer", value: t }));
  }
  checkArgumentCount(t, r2, i2) {
    i2 ? i2 = ": " + i2 : i2 = "", t < r2 && this.throwError("missing argument" + i2, z.errors.MISSING_ARGUMENT, { count: t, expectedCount: r2 }), t > r2 && this.throwError("too many arguments" + i2, z.errors.UNEXPECTED_ARGUMENT, { count: t, expectedCount: r2 });
  }
  checkNew(t, r2) {
    (t === Object || t == null) && this.throwError("missing new", z.errors.MISSING_NEW, { name: r2.name });
  }
  checkAbstract(t, r2) {
    t === r2 ? this.throwError("cannot instantiate abstract class " + JSON.stringify(r2.name) + " directly; use a sub-class", z.errors.UNSUPPORTED_OPERATION, { name: t.name, operation: "new" }) : (t === Object || t == null) && this.throwError("missing new", z.errors.MISSING_NEW, { name: r2.name });
  }
  static globalLogger() {
    return xi || (xi = new z(Ns$1)), xi;
  }
  static setCensorship(t, r2) {
    if (!t && r2 && this.globalLogger().throwError("cannot permanently disable censorship", z.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" }), kn) {
      if (!t) return;
      this.globalLogger().throwError("error censorship permanent", z.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" });
    }
    qn = !!t, kn = !!r2;
  }
  static setLogLevel(t) {
    const r2 = Dr$1[t.toLowerCase()];
    if (r2 == null) {
      z.globalLogger().warn("invalid log level - " + t);
      return;
    }
    Kn$1 = r2;
  }
  static from(t) {
    return new z(t);
  }
};
z$3.errors = re, z$3.levels = Mi$1;
const _s$2 = "bytes/5.7.0", Dt$1 = new z$3(_s$2);
function zn(e) {
  return !!e.toHexString;
}
function ir$1(e) {
  return e.slice || (e.slice = function() {
    const t = Array.prototype.slice.call(arguments);
    return ir$1(new Uint8Array(Array.prototype.slice.apply(e, t)));
  }), e;
}
function Bs$1(e) {
  return Jt$1(e) && !(e.length % 2) || nr$1(e);
}
function jn(e) {
  return typeof e == "number" && e == e && e % 1 === 0;
}
function nr$1(e) {
  if (e == null) return false;
  if (e.constructor === Uint8Array) return true;
  if (typeof e == "string" || !jn(e.length) || e.length < 0) return false;
  for (let t = 0; t < e.length; t++) {
    const r2 = e[t];
    if (!jn(r2) || r2 < 0 || r2 >= 256) return false;
  }
  return true;
}
function Ot$1(e, t) {
  if (t || (t = {}), typeof e == "number") {
    Dt$1.checkSafeUint53(e, "invalid arrayify value");
    const r2 = [];
    for (; e; ) r2.unshift(e & 255), e = parseInt(String(e / 256));
    return r2.length === 0 && r2.push(0), ir$1(new Uint8Array(r2));
  }
  if (t.allowMissingPrefix && typeof e == "string" && e.substring(0, 2) !== "0x" && (e = "0x" + e), zn(e) && (e = e.toHexString()), Jt$1(e)) {
    let r2 = e.substring(2);
    r2.length % 2 && (t.hexPad === "left" ? r2 = "0" + r2 : t.hexPad === "right" ? r2 += "0" : Dt$1.throwArgumentError("hex data is odd-length", "value", e));
    const i2 = [];
    for (let n2 = 0; n2 < r2.length; n2 += 2) i2.push(parseInt(r2.substring(n2, n2 + 2), 16));
    return ir$1(new Uint8Array(i2));
  }
  return nr$1(e) ? ir$1(new Uint8Array(e)) : Dt$1.throwArgumentError("invalid arrayify value", "value", e);
}
function Cs$1(e) {
  const t = e.map((n2) => Ot$1(n2)), r2 = t.reduce((n2, o2) => n2 + o2.length, 0), i2 = new Uint8Array(r2);
  return t.reduce((n2, o2) => (i2.set(o2, n2), n2 + o2.length), 0), ir$1(i2);
}
function Rs$2(e, t) {
  e = Ot$1(e), e.length > t && Dt$1.throwArgumentError("value out of range", "value", arguments[0]);
  const r2 = new Uint8Array(t);
  return r2.set(e, t - e.length), ir$1(r2);
}
function Jt$1(e, t) {
  return !(typeof e != "string" || !e.match(/^0x[0-9A-Fa-f]*$/) || t && e.length !== 2 + 2 * t);
}
const Ei = "0123456789abcdef";
function Kt$1(e, t) {
  if (t || (t = {}), typeof e == "number") {
    Dt$1.checkSafeUint53(e, "invalid hexlify value");
    let r2 = "";
    for (; e; ) r2 = Ei[e & 15] + r2, e = Math.floor(e / 16);
    return r2.length ? (r2.length % 2 && (r2 = "0" + r2), "0x" + r2) : "0x00";
  }
  if (typeof e == "bigint") return e = e.toString(16), e.length % 2 ? "0x0" + e : "0x" + e;
  if (t.allowMissingPrefix && typeof e == "string" && e.substring(0, 2) !== "0x" && (e = "0x" + e), zn(e)) return e.toHexString();
  if (Jt$1(e)) return e.length % 2 && (t.hexPad === "left" ? e = "0x0" + e.substring(2) : t.hexPad === "right" ? e += "0" : Dt$1.throwArgumentError("hex data is odd-length", "value", e)), e.toLowerCase();
  if (nr$1(e)) {
    let r2 = "0x";
    for (let i2 = 0; i2 < e.length; i2++) {
      let n2 = e[i2];
      r2 += Ei[(n2 & 240) >> 4] + Ei[n2 & 15];
    }
    return r2;
  }
  return Dt$1.throwArgumentError("invalid hexlify value", "value", e);
}
function Os$1(e) {
  if (typeof e != "string") e = Kt$1(e);
  else if (!Jt$1(e) || e.length % 2) return null;
  return (e.length - 2) / 2;
}
function Qn(e, t, r2) {
  return typeof e != "string" ? e = Kt$1(e) : (!Jt$1(e) || e.length % 2) && Dt$1.throwArgumentError("invalid hexData", "value", e), t = 2 + 2 * t, r2 != null ? "0x" + e.substring(t, 2 + 2 * r2) : "0x" + e.substring(t);
}
function oe$2(e, t) {
  for (typeof e != "string" ? e = Kt$1(e) : Jt$1(e) || Dt$1.throwArgumentError("invalid hex string", "value", e), e.length > 2 * t + 2 && Dt$1.throwArgumentError("value out of range", "value", arguments[1]); e.length < 2 * t + 2; ) e = "0x0" + e.substring(2);
  return e;
}
function Jn(e) {
  const t = { r: "0x", s: "0x", _vs: "0x", recoveryParam: 0, v: 0, yParityAndS: "0x", compact: "0x" };
  if (Bs$1(e)) {
    let r2 = Ot$1(e);
    r2.length === 64 ? (t.v = 27 + (r2[32] >> 7), r2[32] &= 127, t.r = Kt$1(r2.slice(0, 32)), t.s = Kt$1(r2.slice(32, 64))) : r2.length === 65 ? (t.r = Kt$1(r2.slice(0, 32)), t.s = Kt$1(r2.slice(32, 64)), t.v = r2[64]) : Dt$1.throwArgumentError("invalid signature string", "signature", e), t.v < 27 && (t.v === 0 || t.v === 1 ? t.v += 27 : Dt$1.throwArgumentError("signature invalid v byte", "signature", e)), t.recoveryParam = 1 - t.v % 2, t.recoveryParam && (r2[32] |= 128), t._vs = Kt$1(r2.slice(32, 64));
  } else {
    if (t.r = e.r, t.s = e.s, t.v = e.v, t.recoveryParam = e.recoveryParam, t._vs = e._vs, t._vs != null) {
      const n2 = Rs$2(Ot$1(t._vs), 32);
      t._vs = Kt$1(n2);
      const o2 = n2[0] >= 128 ? 1 : 0;
      t.recoveryParam == null ? t.recoveryParam = o2 : t.recoveryParam !== o2 && Dt$1.throwArgumentError("signature recoveryParam mismatch _vs", "signature", e), n2[0] &= 127;
      const h3 = Kt$1(n2);
      t.s == null ? t.s = h3 : t.s !== h3 && Dt$1.throwArgumentError("signature v mismatch _vs", "signature", e);
    }
    if (t.recoveryParam == null) t.v == null ? Dt$1.throwArgumentError("signature missing v and recoveryParam", "signature", e) : t.v === 0 || t.v === 1 ? t.recoveryParam = t.v : t.recoveryParam = 1 - t.v % 2;
    else if (t.v == null) t.v = 27 + t.recoveryParam;
    else {
      const n2 = t.v === 0 || t.v === 1 ? t.v : 1 - t.v % 2;
      t.recoveryParam !== n2 && Dt$1.throwArgumentError("signature recoveryParam mismatch v", "signature", e);
    }
    t.r == null || !Jt$1(t.r) ? Dt$1.throwArgumentError("signature missing or invalid r", "signature", e) : t.r = oe$2(t.r, 32), t.s == null || !Jt$1(t.s) ? Dt$1.throwArgumentError("signature missing or invalid s", "signature", e) : t.s = oe$2(t.s, 32);
    const r2 = Ot$1(t.s);
    r2[0] >= 128 && Dt$1.throwArgumentError("signature s out of range", "signature", e), t.recoveryParam && (r2[0] |= 128);
    const i2 = Kt$1(r2);
    t._vs && (Jt$1(t._vs) || Dt$1.throwArgumentError("signature invalid _vs", "signature", e), t._vs = oe$2(t._vs, 32)), t._vs == null ? t._vs = i2 : t._vs !== i2 && Dt$1.throwArgumentError("signature _vs mismatch v and s", "signature", e);
  }
  return t.yParityAndS = t._vs, t.compact = t.r + t.yParityAndS.substring(2), t;
}
function Si(e) {
  return "0x" + Ss$2.keccak_256(Ot$1(e));
}
var Gn = { exports: {} }, Ps$1 = {}, Ds$1 = Object.freeze({ __proto__: null, default: Ps$1 }), Fs$1 = Es$2(Ds$1);
(function(e) {
  (function(t, r2) {
    function i2(b2, f3) {
      if (!b2) throw new Error(f3 || "Assertion failed");
    }
    function n2(b2, f3) {
      b2.super_ = f3;
      var a3 = function() {
      };
      a3.prototype = f3.prototype, b2.prototype = new a3(), b2.prototype.constructor = b2;
    }
    function o2(b2, f3, a3) {
      if (o2.isBN(b2)) return b2;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, b2 !== null && ((f3 === "le" || f3 === "be") && (a3 = f3, f3 = 10), this._init(b2 || 0, f3 || 10, a3 || "be"));
    }
    typeof t == "object" ? t.exports = o2 : r2.BN = o2, o2.BN = o2, o2.wordSize = 26;
    var h3;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? h3 = window.Buffer : h3 = Fs$1.Buffer;
    } catch {
    }
    o2.isBN = function(f3) {
      return f3 instanceof o2 ? true : f3 !== null && typeof f3 == "object" && f3.constructor.wordSize === o2.wordSize && Array.isArray(f3.words);
    }, o2.max = function(f3, a3) {
      return f3.cmp(a3) > 0 ? f3 : a3;
    }, o2.min = function(f3, a3) {
      return f3.cmp(a3) < 0 ? f3 : a3;
    }, o2.prototype._init = function(f3, a3, c2) {
      if (typeof f3 == "number") return this._initNumber(f3, a3, c2);
      if (typeof f3 == "object") return this._initArray(f3, a3, c2);
      a3 === "hex" && (a3 = 16), i2(a3 === (a3 | 0) && a3 >= 2 && a3 <= 36), f3 = f3.toString().replace(/\s+/g, "");
      var d3 = 0;
      f3[0] === "-" && (d3++, this.negative = 1), d3 < f3.length && (a3 === 16 ? this._parseHex(f3, d3, c2) : (this._parseBase(f3, a3, d3), c2 === "le" && this._initArray(this.toArray(), a3, c2)));
    }, o2.prototype._initNumber = function(f3, a3, c2) {
      f3 < 0 && (this.negative = 1, f3 = -f3), f3 < 67108864 ? (this.words = [f3 & 67108863], this.length = 1) : f3 < 4503599627370496 ? (this.words = [f3 & 67108863, f3 / 67108864 & 67108863], this.length = 2) : (i2(f3 < 9007199254740992), this.words = [f3 & 67108863, f3 / 67108864 & 67108863, 1], this.length = 3), c2 === "le" && this._initArray(this.toArray(), a3, c2);
    }, o2.prototype._initArray = function(f3, a3, c2) {
      if (i2(typeof f3.length == "number"), f3.length <= 0) return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(f3.length / 3), this.words = new Array(this.length);
      for (var d3 = 0; d3 < this.length; d3++) this.words[d3] = 0;
      var m3, x3, M3 = 0;
      if (c2 === "be") for (d3 = f3.length - 1, m3 = 0; d3 >= 0; d3 -= 3) x3 = f3[d3] | f3[d3 - 1] << 8 | f3[d3 - 2] << 16, this.words[m3] |= x3 << M3 & 67108863, this.words[m3 + 1] = x3 >>> 26 - M3 & 67108863, M3 += 24, M3 >= 26 && (M3 -= 26, m3++);
      else if (c2 === "le") for (d3 = 0, m3 = 0; d3 < f3.length; d3 += 3) x3 = f3[d3] | f3[d3 + 1] << 8 | f3[d3 + 2] << 16, this.words[m3] |= x3 << M3 & 67108863, this.words[m3 + 1] = x3 >>> 26 - M3 & 67108863, M3 += 24, M3 >= 26 && (M3 -= 26, m3++);
      return this._strip();
    };
    function p3(b2, f3) {
      var a3 = b2.charCodeAt(f3);
      if (a3 >= 48 && a3 <= 57) return a3 - 48;
      if (a3 >= 65 && a3 <= 70) return a3 - 55;
      if (a3 >= 97 && a3 <= 102) return a3 - 87;
      i2(false, "Invalid character in " + b2);
    }
    function A2(b2, f3, a3) {
      var c2 = p3(b2, a3);
      return a3 - 1 >= f3 && (c2 |= p3(b2, a3 - 1) << 4), c2;
    }
    o2.prototype._parseHex = function(f3, a3, c2) {
      this.length = Math.ceil((f3.length - a3) / 6), this.words = new Array(this.length);
      for (var d3 = 0; d3 < this.length; d3++) this.words[d3] = 0;
      var m3 = 0, x3 = 0, M3;
      if (c2 === "be") for (d3 = f3.length - 1; d3 >= a3; d3 -= 2) M3 = A2(f3, a3, d3) << m3, this.words[x3] |= M3 & 67108863, m3 >= 18 ? (m3 -= 18, x3 += 1, this.words[x3] |= M3 >>> 26) : m3 += 8;
      else {
        var l2 = f3.length - a3;
        for (d3 = l2 % 2 === 0 ? a3 + 1 : a3; d3 < f3.length; d3 += 2) M3 = A2(f3, a3, d3) << m3, this.words[x3] |= M3 & 67108863, m3 >= 18 ? (m3 -= 18, x3 += 1, this.words[x3] |= M3 >>> 26) : m3 += 8;
      }
      this._strip();
    };
    function v3(b2, f3, a3, c2) {
      for (var d3 = 0, m3 = 0, x3 = Math.min(b2.length, a3), M3 = f3; M3 < x3; M3++) {
        var l2 = b2.charCodeAt(M3) - 48;
        d3 *= c2, l2 >= 49 ? m3 = l2 - 49 + 10 : l2 >= 17 ? m3 = l2 - 17 + 10 : m3 = l2, i2(l2 >= 0 && m3 < c2, "Invalid character"), d3 += m3;
      }
      return d3;
    }
    o2.prototype._parseBase = function(f3, a3, c2) {
      this.words = [0], this.length = 1;
      for (var d3 = 0, m3 = 1; m3 <= 67108863; m3 *= a3) d3++;
      d3--, m3 = m3 / a3 | 0;
      for (var x3 = f3.length - c2, M3 = x3 % d3, l2 = Math.min(x3, x3 - M3) + c2, s2 = 0, g3 = c2; g3 < l2; g3 += d3) s2 = v3(f3, g3, g3 + d3, a3), this.imuln(m3), this.words[0] + s2 < 67108864 ? this.words[0] += s2 : this._iaddn(s2);
      if (M3 !== 0) {
        var k2 = 1;
        for (s2 = v3(f3, g3, f3.length, a3), g3 = 0; g3 < M3; g3++) k2 *= a3;
        this.imuln(k2), this.words[0] + s2 < 67108864 ? this.words[0] += s2 : this._iaddn(s2);
      }
      this._strip();
    }, o2.prototype.copy = function(f3) {
      f3.words = new Array(this.length);
      for (var a3 = 0; a3 < this.length; a3++) f3.words[a3] = this.words[a3];
      f3.length = this.length, f3.negative = this.negative, f3.red = this.red;
    };
    function w2(b2, f3) {
      b2.words = f3.words, b2.length = f3.length, b2.negative = f3.negative, b2.red = f3.red;
    }
    if (o2.prototype._move = function(f3) {
      w2(f3, this);
    }, o2.prototype.clone = function() {
      var f3 = new o2(null);
      return this.copy(f3), f3;
    }, o2.prototype._expand = function(f3) {
      for (; this.length < f3; ) this.words[this.length++] = 0;
      return this;
    }, o2.prototype._strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; ) this.length--;
      return this._normSign();
    }, o2.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, typeof Symbol < "u" && typeof Symbol.for == "function") try {
      o2.prototype[Symbol.for("nodejs.util.inspect.custom")] = y3;
    } catch {
      o2.prototype.inspect = y3;
    }
    else o2.prototype.inspect = y3;
    function y3() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var S4 = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"], I2 = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], N2 = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
    o2.prototype.toString = function(f3, a3) {
      f3 = f3 || 10, a3 = a3 | 0 || 1;
      var c2;
      if (f3 === 16 || f3 === "hex") {
        c2 = "";
        for (var d3 = 0, m3 = 0, x3 = 0; x3 < this.length; x3++) {
          var M3 = this.words[x3], l2 = ((M3 << d3 | m3) & 16777215).toString(16);
          m3 = M3 >>> 24 - d3 & 16777215, d3 += 2, d3 >= 26 && (d3 -= 26, x3--), m3 !== 0 || x3 !== this.length - 1 ? c2 = S4[6 - l2.length] + l2 + c2 : c2 = l2 + c2;
        }
        for (m3 !== 0 && (c2 = m3.toString(16) + c2); c2.length % a3 !== 0; ) c2 = "0" + c2;
        return this.negative !== 0 && (c2 = "-" + c2), c2;
      }
      if (f3 === (f3 | 0) && f3 >= 2 && f3 <= 36) {
        var s2 = I2[f3], g3 = N2[f3];
        c2 = "";
        var k2 = this.clone();
        for (k2.negative = 0; !k2.isZero(); ) {
          var u3 = k2.modrn(g3).toString(f3);
          k2 = k2.idivn(g3), k2.isZero() ? c2 = u3 + c2 : c2 = S4[s2 - u3.length] + u3 + c2;
        }
        for (this.isZero() && (c2 = "0" + c2); c2.length % a3 !== 0; ) c2 = "0" + c2;
        return this.negative !== 0 && (c2 = "-" + c2), c2;
      }
      i2(false, "Base should be between 2 and 36");
    }, o2.prototype.toNumber = function() {
      var f3 = this.words[0];
      return this.length === 2 ? f3 += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? f3 += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && i2(false, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -f3 : f3;
    }, o2.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, h3 && (o2.prototype.toBuffer = function(f3, a3) {
      return this.toArrayLike(h3, f3, a3);
    }), o2.prototype.toArray = function(f3, a3) {
      return this.toArrayLike(Array, f3, a3);
    };
    var C3 = function(f3, a3) {
      return f3.allocUnsafe ? f3.allocUnsafe(a3) : new f3(a3);
    };
    o2.prototype.toArrayLike = function(f3, a3, c2) {
      this._strip();
      var d3 = this.byteLength(), m3 = c2 || Math.max(1, d3);
      i2(d3 <= m3, "byte array longer than desired length"), i2(m3 > 0, "Requested array length <= 0");
      var x3 = C3(f3, m3), M3 = a3 === "le" ? "LE" : "BE";
      return this["_toArrayLike" + M3](x3, d3), x3;
    }, o2.prototype._toArrayLikeLE = function(f3, a3) {
      for (var c2 = 0, d3 = 0, m3 = 0, x3 = 0; m3 < this.length; m3++) {
        var M3 = this.words[m3] << x3 | d3;
        f3[c2++] = M3 & 255, c2 < f3.length && (f3[c2++] = M3 >> 8 & 255), c2 < f3.length && (f3[c2++] = M3 >> 16 & 255), x3 === 6 ? (c2 < f3.length && (f3[c2++] = M3 >> 24 & 255), d3 = 0, x3 = 0) : (d3 = M3 >>> 24, x3 += 2);
      }
      if (c2 < f3.length) for (f3[c2++] = d3; c2 < f3.length; ) f3[c2++] = 0;
    }, o2.prototype._toArrayLikeBE = function(f3, a3) {
      for (var c2 = f3.length - 1, d3 = 0, m3 = 0, x3 = 0; m3 < this.length; m3++) {
        var M3 = this.words[m3] << x3 | d3;
        f3[c2--] = M3 & 255, c2 >= 0 && (f3[c2--] = M3 >> 8 & 255), c2 >= 0 && (f3[c2--] = M3 >> 16 & 255), x3 === 6 ? (c2 >= 0 && (f3[c2--] = M3 >> 24 & 255), d3 = 0, x3 = 0) : (d3 = M3 >>> 24, x3 += 2);
      }
      if (c2 >= 0) for (f3[c2--] = d3; c2 >= 0; ) f3[c2--] = 0;
    }, Math.clz32 ? o2.prototype._countBits = function(f3) {
      return 32 - Math.clz32(f3);
    } : o2.prototype._countBits = function(f3) {
      var a3 = f3, c2 = 0;
      return a3 >= 4096 && (c2 += 13, a3 >>>= 13), a3 >= 64 && (c2 += 7, a3 >>>= 7), a3 >= 8 && (c2 += 4, a3 >>>= 4), a3 >= 2 && (c2 += 2, a3 >>>= 2), c2 + a3;
    }, o2.prototype._zeroBits = function(f3) {
      if (f3 === 0) return 26;
      var a3 = f3, c2 = 0;
      return a3 & 8191 || (c2 += 13, a3 >>>= 13), a3 & 127 || (c2 += 7, a3 >>>= 7), a3 & 15 || (c2 += 4, a3 >>>= 4), a3 & 3 || (c2 += 2, a3 >>>= 2), a3 & 1 || c2++, c2;
    }, o2.prototype.bitLength = function() {
      var f3 = this.words[this.length - 1], a3 = this._countBits(f3);
      return (this.length - 1) * 26 + a3;
    };
    function F2(b2) {
      for (var f3 = new Array(b2.bitLength()), a3 = 0; a3 < f3.length; a3++) {
        var c2 = a3 / 26 | 0, d3 = a3 % 26;
        f3[a3] = b2.words[c2] >>> d3 & 1;
      }
      return f3;
    }
    o2.prototype.zeroBits = function() {
      if (this.isZero()) return 0;
      for (var f3 = 0, a3 = 0; a3 < this.length; a3++) {
        var c2 = this._zeroBits(this.words[a3]);
        if (f3 += c2, c2 !== 26) break;
      }
      return f3;
    }, o2.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, o2.prototype.toTwos = function(f3) {
      return this.negative !== 0 ? this.abs().inotn(f3).iaddn(1) : this.clone();
    }, o2.prototype.fromTwos = function(f3) {
      return this.testn(f3 - 1) ? this.notn(f3).iaddn(1).ineg() : this.clone();
    }, o2.prototype.isNeg = function() {
      return this.negative !== 0;
    }, o2.prototype.neg = function() {
      return this.clone().ineg();
    }, o2.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, o2.prototype.iuor = function(f3) {
      for (; this.length < f3.length; ) this.words[this.length++] = 0;
      for (var a3 = 0; a3 < f3.length; a3++) this.words[a3] = this.words[a3] | f3.words[a3];
      return this._strip();
    }, o2.prototype.ior = function(f3) {
      return i2((this.negative | f3.negative) === 0), this.iuor(f3);
    }, o2.prototype.or = function(f3) {
      return this.length > f3.length ? this.clone().ior(f3) : f3.clone().ior(this);
    }, o2.prototype.uor = function(f3) {
      return this.length > f3.length ? this.clone().iuor(f3) : f3.clone().iuor(this);
    }, o2.prototype.iuand = function(f3) {
      var a3;
      this.length > f3.length ? a3 = f3 : a3 = this;
      for (var c2 = 0; c2 < a3.length; c2++) this.words[c2] = this.words[c2] & f3.words[c2];
      return this.length = a3.length, this._strip();
    }, o2.prototype.iand = function(f3) {
      return i2((this.negative | f3.negative) === 0), this.iuand(f3);
    }, o2.prototype.and = function(f3) {
      return this.length > f3.length ? this.clone().iand(f3) : f3.clone().iand(this);
    }, o2.prototype.uand = function(f3) {
      return this.length > f3.length ? this.clone().iuand(f3) : f3.clone().iuand(this);
    }, o2.prototype.iuxor = function(f3) {
      var a3, c2;
      this.length > f3.length ? (a3 = this, c2 = f3) : (a3 = f3, c2 = this);
      for (var d3 = 0; d3 < c2.length; d3++) this.words[d3] = a3.words[d3] ^ c2.words[d3];
      if (this !== a3) for (; d3 < a3.length; d3++) this.words[d3] = a3.words[d3];
      return this.length = a3.length, this._strip();
    }, o2.prototype.ixor = function(f3) {
      return i2((this.negative | f3.negative) === 0), this.iuxor(f3);
    }, o2.prototype.xor = function(f3) {
      return this.length > f3.length ? this.clone().ixor(f3) : f3.clone().ixor(this);
    }, o2.prototype.uxor = function(f3) {
      return this.length > f3.length ? this.clone().iuxor(f3) : f3.clone().iuxor(this);
    }, o2.prototype.inotn = function(f3) {
      i2(typeof f3 == "number" && f3 >= 0);
      var a3 = Math.ceil(f3 / 26) | 0, c2 = f3 % 26;
      this._expand(a3), c2 > 0 && a3--;
      for (var d3 = 0; d3 < a3; d3++) this.words[d3] = ~this.words[d3] & 67108863;
      return c2 > 0 && (this.words[d3] = ~this.words[d3] & 67108863 >> 26 - c2), this._strip();
    }, o2.prototype.notn = function(f3) {
      return this.clone().inotn(f3);
    }, o2.prototype.setn = function(f3, a3) {
      i2(typeof f3 == "number" && f3 >= 0);
      var c2 = f3 / 26 | 0, d3 = f3 % 26;
      return this._expand(c2 + 1), a3 ? this.words[c2] = this.words[c2] | 1 << d3 : this.words[c2] = this.words[c2] & ~(1 << d3), this._strip();
    }, o2.prototype.iadd = function(f3) {
      var a3;
      if (this.negative !== 0 && f3.negative === 0) return this.negative = 0, a3 = this.isub(f3), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && f3.negative !== 0) return f3.negative = 0, a3 = this.isub(f3), f3.negative = 1, a3._normSign();
      var c2, d3;
      this.length > f3.length ? (c2 = this, d3 = f3) : (c2 = f3, d3 = this);
      for (var m3 = 0, x3 = 0; x3 < d3.length; x3++) a3 = (c2.words[x3] | 0) + (d3.words[x3] | 0) + m3, this.words[x3] = a3 & 67108863, m3 = a3 >>> 26;
      for (; m3 !== 0 && x3 < c2.length; x3++) a3 = (c2.words[x3] | 0) + m3, this.words[x3] = a3 & 67108863, m3 = a3 >>> 26;
      if (this.length = c2.length, m3 !== 0) this.words[this.length] = m3, this.length++;
      else if (c2 !== this) for (; x3 < c2.length; x3++) this.words[x3] = c2.words[x3];
      return this;
    }, o2.prototype.add = function(f3) {
      var a3;
      return f3.negative !== 0 && this.negative === 0 ? (f3.negative = 0, a3 = this.sub(f3), f3.negative ^= 1, a3) : f3.negative === 0 && this.negative !== 0 ? (this.negative = 0, a3 = f3.sub(this), this.negative = 1, a3) : this.length > f3.length ? this.clone().iadd(f3) : f3.clone().iadd(this);
    }, o2.prototype.isub = function(f3) {
      if (f3.negative !== 0) {
        f3.negative = 0;
        var a3 = this.iadd(f3);
        return f3.negative = 1, a3._normSign();
      } else if (this.negative !== 0) return this.negative = 0, this.iadd(f3), this.negative = 1, this._normSign();
      var c2 = this.cmp(f3);
      if (c2 === 0) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var d3, m3;
      c2 > 0 ? (d3 = this, m3 = f3) : (d3 = f3, m3 = this);
      for (var x3 = 0, M3 = 0; M3 < m3.length; M3++) a3 = (d3.words[M3] | 0) - (m3.words[M3] | 0) + x3, x3 = a3 >> 26, this.words[M3] = a3 & 67108863;
      for (; x3 !== 0 && M3 < d3.length; M3++) a3 = (d3.words[M3] | 0) + x3, x3 = a3 >> 26, this.words[M3] = a3 & 67108863;
      if (x3 === 0 && M3 < d3.length && d3 !== this) for (; M3 < d3.length; M3++) this.words[M3] = d3.words[M3];
      return this.length = Math.max(this.length, M3), d3 !== this && (this.negative = 1), this._strip();
    }, o2.prototype.sub = function(f3) {
      return this.clone().isub(f3);
    };
    function U2(b2, f3, a3) {
      a3.negative = f3.negative ^ b2.negative;
      var c2 = b2.length + f3.length | 0;
      a3.length = c2, c2 = c2 - 1 | 0;
      var d3 = b2.words[0] | 0, m3 = f3.words[0] | 0, x3 = d3 * m3, M3 = x3 & 67108863, l2 = x3 / 67108864 | 0;
      a3.words[0] = M3;
      for (var s2 = 1; s2 < c2; s2++) {
        for (var g3 = l2 >>> 26, k2 = l2 & 67108863, u3 = Math.min(s2, f3.length - 1), E2 = Math.max(0, s2 - b2.length + 1); E2 <= u3; E2++) {
          var _2 = s2 - E2 | 0;
          d3 = b2.words[_2] | 0, m3 = f3.words[E2] | 0, x3 = d3 * m3 + k2, g3 += x3 / 67108864 | 0, k2 = x3 & 67108863;
        }
        a3.words[s2] = k2 | 0, l2 = g3 | 0;
      }
      return l2 !== 0 ? a3.words[s2] = l2 | 0 : a3.length--, a3._strip();
    }
    var J = function(f3, a3, c2) {
      var d3 = f3.words, m3 = a3.words, x3 = c2.words, M3 = 0, l2, s2, g3, k2 = d3[0] | 0, u3 = k2 & 8191, E2 = k2 >>> 13, _2 = d3[1] | 0, B2 = _2 & 8191, R3 = _2 >>> 13, T2 = d3[2] | 0, P2 = T2 & 8191, O3 = T2 >>> 13, Ct2 = d3[3] | 0, D2 = Ct2 & 8191, q2 = Ct2 >>> 13, De2 = d3[4] | 0, X2 = De2 & 8191, Z2 = De2 >>> 13, Fe = d3[5] | 0, $2 = Fe & 8191, tt2 = Fe >>> 13, Te2 = d3[6] | 0, et2 = Te2 & 8191, rt2 = Te2 >>> 13, Ue = d3[7] | 0, it2 = Ue & 8191, nt2 = Ue >>> 13, ke = d3[8] | 0, ft2 = ke & 8191, ot2 = ke >>> 13, qe = d3[9] | 0, st2 = qe & 8191, at2 = qe >>> 13, Ke = m3[0] | 0, ut2 = Ke & 8191, ht2 = Ke >>> 13, He = m3[1] | 0, ct2 = He & 8191, lt2 = He >>> 13, Le2 = m3[2] | 0, dt2 = Le2 & 8191, pt2 = Le2 >>> 13, ze = m3[3] | 0, vt2 = ze & 8191, gt2 = ze >>> 13, je = m3[4] | 0, mt2 = je & 8191, At2 = je >>> 13, Qe2 = m3[5] | 0, bt2 = Qe2 & 8191, yt2 = Qe2 >>> 13, Je2 = m3[6] | 0, wt2 = Je2 & 8191, xt2 = Je2 >>> 13, Ge = m3[7] | 0, Mt2 = Ge & 8191, Et2 = Ge >>> 13, Ye2 = m3[8] | 0, St2 = Ye2 & 8191, Nt2 = Ye2 >>> 13, Ve = m3[9] | 0, It2 = Ve & 8191, _t2 = Ve >>> 13;
      c2.negative = f3.negative ^ a3.negative, c2.length = 19, l2 = Math.imul(u3, ut2), s2 = Math.imul(u3, ht2), s2 = s2 + Math.imul(E2, ut2) | 0, g3 = Math.imul(E2, ht2);
      var Me = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, l2 = Math.imul(B2, ut2), s2 = Math.imul(B2, ht2), s2 = s2 + Math.imul(R3, ut2) | 0, g3 = Math.imul(R3, ht2), l2 = l2 + Math.imul(u3, ct2) | 0, s2 = s2 + Math.imul(u3, lt2) | 0, s2 = s2 + Math.imul(E2, ct2) | 0, g3 = g3 + Math.imul(E2, lt2) | 0;
      var Ee2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (Ee2 >>> 26) | 0, Ee2 &= 67108863, l2 = Math.imul(P2, ut2), s2 = Math.imul(P2, ht2), s2 = s2 + Math.imul(O3, ut2) | 0, g3 = Math.imul(O3, ht2), l2 = l2 + Math.imul(B2, ct2) | 0, s2 = s2 + Math.imul(B2, lt2) | 0, s2 = s2 + Math.imul(R3, ct2) | 0, g3 = g3 + Math.imul(R3, lt2) | 0, l2 = l2 + Math.imul(u3, dt2) | 0, s2 = s2 + Math.imul(u3, pt2) | 0, s2 = s2 + Math.imul(E2, dt2) | 0, g3 = g3 + Math.imul(E2, pt2) | 0;
      var Se2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (Se2 >>> 26) | 0, Se2 &= 67108863, l2 = Math.imul(D2, ut2), s2 = Math.imul(D2, ht2), s2 = s2 + Math.imul(q2, ut2) | 0, g3 = Math.imul(q2, ht2), l2 = l2 + Math.imul(P2, ct2) | 0, s2 = s2 + Math.imul(P2, lt2) | 0, s2 = s2 + Math.imul(O3, ct2) | 0, g3 = g3 + Math.imul(O3, lt2) | 0, l2 = l2 + Math.imul(B2, dt2) | 0, s2 = s2 + Math.imul(B2, pt2) | 0, s2 = s2 + Math.imul(R3, dt2) | 0, g3 = g3 + Math.imul(R3, pt2) | 0, l2 = l2 + Math.imul(u3, vt2) | 0, s2 = s2 + Math.imul(u3, gt2) | 0, s2 = s2 + Math.imul(E2, vt2) | 0, g3 = g3 + Math.imul(E2, gt2) | 0;
      var Ne = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (Ne >>> 26) | 0, Ne &= 67108863, l2 = Math.imul(X2, ut2), s2 = Math.imul(X2, ht2), s2 = s2 + Math.imul(Z2, ut2) | 0, g3 = Math.imul(Z2, ht2), l2 = l2 + Math.imul(D2, ct2) | 0, s2 = s2 + Math.imul(D2, lt2) | 0, s2 = s2 + Math.imul(q2, ct2) | 0, g3 = g3 + Math.imul(q2, lt2) | 0, l2 = l2 + Math.imul(P2, dt2) | 0, s2 = s2 + Math.imul(P2, pt2) | 0, s2 = s2 + Math.imul(O3, dt2) | 0, g3 = g3 + Math.imul(O3, pt2) | 0, l2 = l2 + Math.imul(B2, vt2) | 0, s2 = s2 + Math.imul(B2, gt2) | 0, s2 = s2 + Math.imul(R3, vt2) | 0, g3 = g3 + Math.imul(R3, gt2) | 0, l2 = l2 + Math.imul(u3, mt2) | 0, s2 = s2 + Math.imul(u3, At2) | 0, s2 = s2 + Math.imul(E2, mt2) | 0, g3 = g3 + Math.imul(E2, At2) | 0;
      var Ie2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (Ie2 >>> 26) | 0, Ie2 &= 67108863, l2 = Math.imul($2, ut2), s2 = Math.imul($2, ht2), s2 = s2 + Math.imul(tt2, ut2) | 0, g3 = Math.imul(tt2, ht2), l2 = l2 + Math.imul(X2, ct2) | 0, s2 = s2 + Math.imul(X2, lt2) | 0, s2 = s2 + Math.imul(Z2, ct2) | 0, g3 = g3 + Math.imul(Z2, lt2) | 0, l2 = l2 + Math.imul(D2, dt2) | 0, s2 = s2 + Math.imul(D2, pt2) | 0, s2 = s2 + Math.imul(q2, dt2) | 0, g3 = g3 + Math.imul(q2, pt2) | 0, l2 = l2 + Math.imul(P2, vt2) | 0, s2 = s2 + Math.imul(P2, gt2) | 0, s2 = s2 + Math.imul(O3, vt2) | 0, g3 = g3 + Math.imul(O3, gt2) | 0, l2 = l2 + Math.imul(B2, mt2) | 0, s2 = s2 + Math.imul(B2, At2) | 0, s2 = s2 + Math.imul(R3, mt2) | 0, g3 = g3 + Math.imul(R3, At2) | 0, l2 = l2 + Math.imul(u3, bt2) | 0, s2 = s2 + Math.imul(u3, yt2) | 0, s2 = s2 + Math.imul(E2, bt2) | 0, g3 = g3 + Math.imul(E2, yt2) | 0;
      var $r2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + ($r2 >>> 26) | 0, $r2 &= 67108863, l2 = Math.imul(et2, ut2), s2 = Math.imul(et2, ht2), s2 = s2 + Math.imul(rt2, ut2) | 0, g3 = Math.imul(rt2, ht2), l2 = l2 + Math.imul($2, ct2) | 0, s2 = s2 + Math.imul($2, lt2) | 0, s2 = s2 + Math.imul(tt2, ct2) | 0, g3 = g3 + Math.imul(tt2, lt2) | 0, l2 = l2 + Math.imul(X2, dt2) | 0, s2 = s2 + Math.imul(X2, pt2) | 0, s2 = s2 + Math.imul(Z2, dt2) | 0, g3 = g3 + Math.imul(Z2, pt2) | 0, l2 = l2 + Math.imul(D2, vt2) | 0, s2 = s2 + Math.imul(D2, gt2) | 0, s2 = s2 + Math.imul(q2, vt2) | 0, g3 = g3 + Math.imul(q2, gt2) | 0, l2 = l2 + Math.imul(P2, mt2) | 0, s2 = s2 + Math.imul(P2, At2) | 0, s2 = s2 + Math.imul(O3, mt2) | 0, g3 = g3 + Math.imul(O3, At2) | 0, l2 = l2 + Math.imul(B2, bt2) | 0, s2 = s2 + Math.imul(B2, yt2) | 0, s2 = s2 + Math.imul(R3, bt2) | 0, g3 = g3 + Math.imul(R3, yt2) | 0, l2 = l2 + Math.imul(u3, wt2) | 0, s2 = s2 + Math.imul(u3, xt2) | 0, s2 = s2 + Math.imul(E2, wt2) | 0, g3 = g3 + Math.imul(E2, xt2) | 0;
      var ti2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ti2 >>> 26) | 0, ti2 &= 67108863, l2 = Math.imul(it2, ut2), s2 = Math.imul(it2, ht2), s2 = s2 + Math.imul(nt2, ut2) | 0, g3 = Math.imul(nt2, ht2), l2 = l2 + Math.imul(et2, ct2) | 0, s2 = s2 + Math.imul(et2, lt2) | 0, s2 = s2 + Math.imul(rt2, ct2) | 0, g3 = g3 + Math.imul(rt2, lt2) | 0, l2 = l2 + Math.imul($2, dt2) | 0, s2 = s2 + Math.imul($2, pt2) | 0, s2 = s2 + Math.imul(tt2, dt2) | 0, g3 = g3 + Math.imul(tt2, pt2) | 0, l2 = l2 + Math.imul(X2, vt2) | 0, s2 = s2 + Math.imul(X2, gt2) | 0, s2 = s2 + Math.imul(Z2, vt2) | 0, g3 = g3 + Math.imul(Z2, gt2) | 0, l2 = l2 + Math.imul(D2, mt2) | 0, s2 = s2 + Math.imul(D2, At2) | 0, s2 = s2 + Math.imul(q2, mt2) | 0, g3 = g3 + Math.imul(q2, At2) | 0, l2 = l2 + Math.imul(P2, bt2) | 0, s2 = s2 + Math.imul(P2, yt2) | 0, s2 = s2 + Math.imul(O3, bt2) | 0, g3 = g3 + Math.imul(O3, yt2) | 0, l2 = l2 + Math.imul(B2, wt2) | 0, s2 = s2 + Math.imul(B2, xt2) | 0, s2 = s2 + Math.imul(R3, wt2) | 0, g3 = g3 + Math.imul(R3, xt2) | 0, l2 = l2 + Math.imul(u3, Mt2) | 0, s2 = s2 + Math.imul(u3, Et2) | 0, s2 = s2 + Math.imul(E2, Mt2) | 0, g3 = g3 + Math.imul(E2, Et2) | 0;
      var ei2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ei2 >>> 26) | 0, ei2 &= 67108863, l2 = Math.imul(ft2, ut2), s2 = Math.imul(ft2, ht2), s2 = s2 + Math.imul(ot2, ut2) | 0, g3 = Math.imul(ot2, ht2), l2 = l2 + Math.imul(it2, ct2) | 0, s2 = s2 + Math.imul(it2, lt2) | 0, s2 = s2 + Math.imul(nt2, ct2) | 0, g3 = g3 + Math.imul(nt2, lt2) | 0, l2 = l2 + Math.imul(et2, dt2) | 0, s2 = s2 + Math.imul(et2, pt2) | 0, s2 = s2 + Math.imul(rt2, dt2) | 0, g3 = g3 + Math.imul(rt2, pt2) | 0, l2 = l2 + Math.imul($2, vt2) | 0, s2 = s2 + Math.imul($2, gt2) | 0, s2 = s2 + Math.imul(tt2, vt2) | 0, g3 = g3 + Math.imul(tt2, gt2) | 0, l2 = l2 + Math.imul(X2, mt2) | 0, s2 = s2 + Math.imul(X2, At2) | 0, s2 = s2 + Math.imul(Z2, mt2) | 0, g3 = g3 + Math.imul(Z2, At2) | 0, l2 = l2 + Math.imul(D2, bt2) | 0, s2 = s2 + Math.imul(D2, yt2) | 0, s2 = s2 + Math.imul(q2, bt2) | 0, g3 = g3 + Math.imul(q2, yt2) | 0, l2 = l2 + Math.imul(P2, wt2) | 0, s2 = s2 + Math.imul(P2, xt2) | 0, s2 = s2 + Math.imul(O3, wt2) | 0, g3 = g3 + Math.imul(O3, xt2) | 0, l2 = l2 + Math.imul(B2, Mt2) | 0, s2 = s2 + Math.imul(B2, Et2) | 0, s2 = s2 + Math.imul(R3, Mt2) | 0, g3 = g3 + Math.imul(R3, Et2) | 0, l2 = l2 + Math.imul(u3, St2) | 0, s2 = s2 + Math.imul(u3, Nt2) | 0, s2 = s2 + Math.imul(E2, St2) | 0, g3 = g3 + Math.imul(E2, Nt2) | 0;
      var ri2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ri2 >>> 26) | 0, ri2 &= 67108863, l2 = Math.imul(st2, ut2), s2 = Math.imul(st2, ht2), s2 = s2 + Math.imul(at2, ut2) | 0, g3 = Math.imul(at2, ht2), l2 = l2 + Math.imul(ft2, ct2) | 0, s2 = s2 + Math.imul(ft2, lt2) | 0, s2 = s2 + Math.imul(ot2, ct2) | 0, g3 = g3 + Math.imul(ot2, lt2) | 0, l2 = l2 + Math.imul(it2, dt2) | 0, s2 = s2 + Math.imul(it2, pt2) | 0, s2 = s2 + Math.imul(nt2, dt2) | 0, g3 = g3 + Math.imul(nt2, pt2) | 0, l2 = l2 + Math.imul(et2, vt2) | 0, s2 = s2 + Math.imul(et2, gt2) | 0, s2 = s2 + Math.imul(rt2, vt2) | 0, g3 = g3 + Math.imul(rt2, gt2) | 0, l2 = l2 + Math.imul($2, mt2) | 0, s2 = s2 + Math.imul($2, At2) | 0, s2 = s2 + Math.imul(tt2, mt2) | 0, g3 = g3 + Math.imul(tt2, At2) | 0, l2 = l2 + Math.imul(X2, bt2) | 0, s2 = s2 + Math.imul(X2, yt2) | 0, s2 = s2 + Math.imul(Z2, bt2) | 0, g3 = g3 + Math.imul(Z2, yt2) | 0, l2 = l2 + Math.imul(D2, wt2) | 0, s2 = s2 + Math.imul(D2, xt2) | 0, s2 = s2 + Math.imul(q2, wt2) | 0, g3 = g3 + Math.imul(q2, xt2) | 0, l2 = l2 + Math.imul(P2, Mt2) | 0, s2 = s2 + Math.imul(P2, Et2) | 0, s2 = s2 + Math.imul(O3, Mt2) | 0, g3 = g3 + Math.imul(O3, Et2) | 0, l2 = l2 + Math.imul(B2, St2) | 0, s2 = s2 + Math.imul(B2, Nt2) | 0, s2 = s2 + Math.imul(R3, St2) | 0, g3 = g3 + Math.imul(R3, Nt2) | 0, l2 = l2 + Math.imul(u3, It2) | 0, s2 = s2 + Math.imul(u3, _t2) | 0, s2 = s2 + Math.imul(E2, It2) | 0, g3 = g3 + Math.imul(E2, _t2) | 0;
      var ii2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ii2 >>> 26) | 0, ii2 &= 67108863, l2 = Math.imul(st2, ct2), s2 = Math.imul(st2, lt2), s2 = s2 + Math.imul(at2, ct2) | 0, g3 = Math.imul(at2, lt2), l2 = l2 + Math.imul(ft2, dt2) | 0, s2 = s2 + Math.imul(ft2, pt2) | 0, s2 = s2 + Math.imul(ot2, dt2) | 0, g3 = g3 + Math.imul(ot2, pt2) | 0, l2 = l2 + Math.imul(it2, vt2) | 0, s2 = s2 + Math.imul(it2, gt2) | 0, s2 = s2 + Math.imul(nt2, vt2) | 0, g3 = g3 + Math.imul(nt2, gt2) | 0, l2 = l2 + Math.imul(et2, mt2) | 0, s2 = s2 + Math.imul(et2, At2) | 0, s2 = s2 + Math.imul(rt2, mt2) | 0, g3 = g3 + Math.imul(rt2, At2) | 0, l2 = l2 + Math.imul($2, bt2) | 0, s2 = s2 + Math.imul($2, yt2) | 0, s2 = s2 + Math.imul(tt2, bt2) | 0, g3 = g3 + Math.imul(tt2, yt2) | 0, l2 = l2 + Math.imul(X2, wt2) | 0, s2 = s2 + Math.imul(X2, xt2) | 0, s2 = s2 + Math.imul(Z2, wt2) | 0, g3 = g3 + Math.imul(Z2, xt2) | 0, l2 = l2 + Math.imul(D2, Mt2) | 0, s2 = s2 + Math.imul(D2, Et2) | 0, s2 = s2 + Math.imul(q2, Mt2) | 0, g3 = g3 + Math.imul(q2, Et2) | 0, l2 = l2 + Math.imul(P2, St2) | 0, s2 = s2 + Math.imul(P2, Nt2) | 0, s2 = s2 + Math.imul(O3, St2) | 0, g3 = g3 + Math.imul(O3, Nt2) | 0, l2 = l2 + Math.imul(B2, It2) | 0, s2 = s2 + Math.imul(B2, _t2) | 0, s2 = s2 + Math.imul(R3, It2) | 0, g3 = g3 + Math.imul(R3, _t2) | 0;
      var ni2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ni2 >>> 26) | 0, ni2 &= 67108863, l2 = Math.imul(st2, dt2), s2 = Math.imul(st2, pt2), s2 = s2 + Math.imul(at2, dt2) | 0, g3 = Math.imul(at2, pt2), l2 = l2 + Math.imul(ft2, vt2) | 0, s2 = s2 + Math.imul(ft2, gt2) | 0, s2 = s2 + Math.imul(ot2, vt2) | 0, g3 = g3 + Math.imul(ot2, gt2) | 0, l2 = l2 + Math.imul(it2, mt2) | 0, s2 = s2 + Math.imul(it2, At2) | 0, s2 = s2 + Math.imul(nt2, mt2) | 0, g3 = g3 + Math.imul(nt2, At2) | 0, l2 = l2 + Math.imul(et2, bt2) | 0, s2 = s2 + Math.imul(et2, yt2) | 0, s2 = s2 + Math.imul(rt2, bt2) | 0, g3 = g3 + Math.imul(rt2, yt2) | 0, l2 = l2 + Math.imul($2, wt2) | 0, s2 = s2 + Math.imul($2, xt2) | 0, s2 = s2 + Math.imul(tt2, wt2) | 0, g3 = g3 + Math.imul(tt2, xt2) | 0, l2 = l2 + Math.imul(X2, Mt2) | 0, s2 = s2 + Math.imul(X2, Et2) | 0, s2 = s2 + Math.imul(Z2, Mt2) | 0, g3 = g3 + Math.imul(Z2, Et2) | 0, l2 = l2 + Math.imul(D2, St2) | 0, s2 = s2 + Math.imul(D2, Nt2) | 0, s2 = s2 + Math.imul(q2, St2) | 0, g3 = g3 + Math.imul(q2, Nt2) | 0, l2 = l2 + Math.imul(P2, It2) | 0, s2 = s2 + Math.imul(P2, _t2) | 0, s2 = s2 + Math.imul(O3, It2) | 0, g3 = g3 + Math.imul(O3, _t2) | 0;
      var fi = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (fi >>> 26) | 0, fi &= 67108863, l2 = Math.imul(st2, vt2), s2 = Math.imul(st2, gt2), s2 = s2 + Math.imul(at2, vt2) | 0, g3 = Math.imul(at2, gt2), l2 = l2 + Math.imul(ft2, mt2) | 0, s2 = s2 + Math.imul(ft2, At2) | 0, s2 = s2 + Math.imul(ot2, mt2) | 0, g3 = g3 + Math.imul(ot2, At2) | 0, l2 = l2 + Math.imul(it2, bt2) | 0, s2 = s2 + Math.imul(it2, yt2) | 0, s2 = s2 + Math.imul(nt2, bt2) | 0, g3 = g3 + Math.imul(nt2, yt2) | 0, l2 = l2 + Math.imul(et2, wt2) | 0, s2 = s2 + Math.imul(et2, xt2) | 0, s2 = s2 + Math.imul(rt2, wt2) | 0, g3 = g3 + Math.imul(rt2, xt2) | 0, l2 = l2 + Math.imul($2, Mt2) | 0, s2 = s2 + Math.imul($2, Et2) | 0, s2 = s2 + Math.imul(tt2, Mt2) | 0, g3 = g3 + Math.imul(tt2, Et2) | 0, l2 = l2 + Math.imul(X2, St2) | 0, s2 = s2 + Math.imul(X2, Nt2) | 0, s2 = s2 + Math.imul(Z2, St2) | 0, g3 = g3 + Math.imul(Z2, Nt2) | 0, l2 = l2 + Math.imul(D2, It2) | 0, s2 = s2 + Math.imul(D2, _t2) | 0, s2 = s2 + Math.imul(q2, It2) | 0, g3 = g3 + Math.imul(q2, _t2) | 0;
      var oi2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (oi2 >>> 26) | 0, oi2 &= 67108863, l2 = Math.imul(st2, mt2), s2 = Math.imul(st2, At2), s2 = s2 + Math.imul(at2, mt2) | 0, g3 = Math.imul(at2, At2), l2 = l2 + Math.imul(ft2, bt2) | 0, s2 = s2 + Math.imul(ft2, yt2) | 0, s2 = s2 + Math.imul(ot2, bt2) | 0, g3 = g3 + Math.imul(ot2, yt2) | 0, l2 = l2 + Math.imul(it2, wt2) | 0, s2 = s2 + Math.imul(it2, xt2) | 0, s2 = s2 + Math.imul(nt2, wt2) | 0, g3 = g3 + Math.imul(nt2, xt2) | 0, l2 = l2 + Math.imul(et2, Mt2) | 0, s2 = s2 + Math.imul(et2, Et2) | 0, s2 = s2 + Math.imul(rt2, Mt2) | 0, g3 = g3 + Math.imul(rt2, Et2) | 0, l2 = l2 + Math.imul($2, St2) | 0, s2 = s2 + Math.imul($2, Nt2) | 0, s2 = s2 + Math.imul(tt2, St2) | 0, g3 = g3 + Math.imul(tt2, Nt2) | 0, l2 = l2 + Math.imul(X2, It2) | 0, s2 = s2 + Math.imul(X2, _t2) | 0, s2 = s2 + Math.imul(Z2, It2) | 0, g3 = g3 + Math.imul(Z2, _t2) | 0;
      var si2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (si2 >>> 26) | 0, si2 &= 67108863, l2 = Math.imul(st2, bt2), s2 = Math.imul(st2, yt2), s2 = s2 + Math.imul(at2, bt2) | 0, g3 = Math.imul(at2, yt2), l2 = l2 + Math.imul(ft2, wt2) | 0, s2 = s2 + Math.imul(ft2, xt2) | 0, s2 = s2 + Math.imul(ot2, wt2) | 0, g3 = g3 + Math.imul(ot2, xt2) | 0, l2 = l2 + Math.imul(it2, Mt2) | 0, s2 = s2 + Math.imul(it2, Et2) | 0, s2 = s2 + Math.imul(nt2, Mt2) | 0, g3 = g3 + Math.imul(nt2, Et2) | 0, l2 = l2 + Math.imul(et2, St2) | 0, s2 = s2 + Math.imul(et2, Nt2) | 0, s2 = s2 + Math.imul(rt2, St2) | 0, g3 = g3 + Math.imul(rt2, Nt2) | 0, l2 = l2 + Math.imul($2, It2) | 0, s2 = s2 + Math.imul($2, _t2) | 0, s2 = s2 + Math.imul(tt2, It2) | 0, g3 = g3 + Math.imul(tt2, _t2) | 0;
      var ai2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ai2 >>> 26) | 0, ai2 &= 67108863, l2 = Math.imul(st2, wt2), s2 = Math.imul(st2, xt2), s2 = s2 + Math.imul(at2, wt2) | 0, g3 = Math.imul(at2, xt2), l2 = l2 + Math.imul(ft2, Mt2) | 0, s2 = s2 + Math.imul(ft2, Et2) | 0, s2 = s2 + Math.imul(ot2, Mt2) | 0, g3 = g3 + Math.imul(ot2, Et2) | 0, l2 = l2 + Math.imul(it2, St2) | 0, s2 = s2 + Math.imul(it2, Nt2) | 0, s2 = s2 + Math.imul(nt2, St2) | 0, g3 = g3 + Math.imul(nt2, Nt2) | 0, l2 = l2 + Math.imul(et2, It2) | 0, s2 = s2 + Math.imul(et2, _t2) | 0, s2 = s2 + Math.imul(rt2, It2) | 0, g3 = g3 + Math.imul(rt2, _t2) | 0;
      var ui2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ui2 >>> 26) | 0, ui2 &= 67108863, l2 = Math.imul(st2, Mt2), s2 = Math.imul(st2, Et2), s2 = s2 + Math.imul(at2, Mt2) | 0, g3 = Math.imul(at2, Et2), l2 = l2 + Math.imul(ft2, St2) | 0, s2 = s2 + Math.imul(ft2, Nt2) | 0, s2 = s2 + Math.imul(ot2, St2) | 0, g3 = g3 + Math.imul(ot2, Nt2) | 0, l2 = l2 + Math.imul(it2, It2) | 0, s2 = s2 + Math.imul(it2, _t2) | 0, s2 = s2 + Math.imul(nt2, It2) | 0, g3 = g3 + Math.imul(nt2, _t2) | 0;
      var hi2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (hi2 >>> 26) | 0, hi2 &= 67108863, l2 = Math.imul(st2, St2), s2 = Math.imul(st2, Nt2), s2 = s2 + Math.imul(at2, St2) | 0, g3 = Math.imul(at2, Nt2), l2 = l2 + Math.imul(ft2, It2) | 0, s2 = s2 + Math.imul(ft2, _t2) | 0, s2 = s2 + Math.imul(ot2, It2) | 0, g3 = g3 + Math.imul(ot2, _t2) | 0;
      var ci2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      M3 = (g3 + (s2 >>> 13) | 0) + (ci2 >>> 26) | 0, ci2 &= 67108863, l2 = Math.imul(st2, It2), s2 = Math.imul(st2, _t2), s2 = s2 + Math.imul(at2, It2) | 0, g3 = Math.imul(at2, _t2);
      var li2 = (M3 + l2 | 0) + ((s2 & 8191) << 13) | 0;
      return M3 = (g3 + (s2 >>> 13) | 0) + (li2 >>> 26) | 0, li2 &= 67108863, x3[0] = Me, x3[1] = Ee2, x3[2] = Se2, x3[3] = Ne, x3[4] = Ie2, x3[5] = $r2, x3[6] = ti2, x3[7] = ei2, x3[8] = ri2, x3[9] = ii2, x3[10] = ni2, x3[11] = fi, x3[12] = oi2, x3[13] = si2, x3[14] = ai2, x3[15] = ui2, x3[16] = hi2, x3[17] = ci2, x3[18] = li2, M3 !== 0 && (x3[19] = M3, c2.length++), c2;
    };
    Math.imul || (J = U2);
    function Bt2(b2, f3, a3) {
      a3.negative = f3.negative ^ b2.negative, a3.length = b2.length + f3.length;
      for (var c2 = 0, d3 = 0, m3 = 0; m3 < a3.length - 1; m3++) {
        var x3 = d3;
        d3 = 0;
        for (var M3 = c2 & 67108863, l2 = Math.min(m3, f3.length - 1), s2 = Math.max(0, m3 - b2.length + 1); s2 <= l2; s2++) {
          var g3 = m3 - s2, k2 = b2.words[g3] | 0, u3 = f3.words[s2] | 0, E2 = k2 * u3, _2 = E2 & 67108863;
          x3 = x3 + (E2 / 67108864 | 0) | 0, _2 = _2 + M3 | 0, M3 = _2 & 67108863, x3 = x3 + (_2 >>> 26) | 0, d3 += x3 >>> 26, x3 &= 67108863;
        }
        a3.words[m3] = M3, c2 = x3, x3 = d3;
      }
      return c2 !== 0 ? a3.words[m3] = c2 : a3.length--, a3._strip();
    }
    function G(b2, f3, a3) {
      return Bt2(b2, f3, a3);
    }
    o2.prototype.mulTo = function(f3, a3) {
      var c2, d3 = this.length + f3.length;
      return this.length === 10 && f3.length === 10 ? c2 = J(this, f3, a3) : d3 < 63 ? c2 = U2(this, f3, a3) : d3 < 1024 ? c2 = Bt2(this, f3, a3) : c2 = G(this, f3, a3), c2;
    }, o2.prototype.mul = function(f3) {
      var a3 = new o2(null);
      return a3.words = new Array(this.length + f3.length), this.mulTo(f3, a3);
    }, o2.prototype.mulf = function(f3) {
      var a3 = new o2(null);
      return a3.words = new Array(this.length + f3.length), G(this, f3, a3);
    }, o2.prototype.imul = function(f3) {
      return this.clone().mulTo(f3, this);
    }, o2.prototype.imuln = function(f3) {
      var a3 = f3 < 0;
      a3 && (f3 = -f3), i2(typeof f3 == "number"), i2(f3 < 67108864);
      for (var c2 = 0, d3 = 0; d3 < this.length; d3++) {
        var m3 = (this.words[d3] | 0) * f3, x3 = (m3 & 67108863) + (c2 & 67108863);
        c2 >>= 26, c2 += m3 / 67108864 | 0, c2 += x3 >>> 26, this.words[d3] = x3 & 67108863;
      }
      return c2 !== 0 && (this.words[d3] = c2, this.length++), a3 ? this.ineg() : this;
    }, o2.prototype.muln = function(f3) {
      return this.clone().imuln(f3);
    }, o2.prototype.sqr = function() {
      return this.mul(this);
    }, o2.prototype.isqr = function() {
      return this.imul(this.clone());
    }, o2.prototype.pow = function(f3) {
      var a3 = F2(f3);
      if (a3.length === 0) return new o2(1);
      for (var c2 = this, d3 = 0; d3 < a3.length && a3[d3] === 0; d3++, c2 = c2.sqr()) ;
      if (++d3 < a3.length) for (var m3 = c2.sqr(); d3 < a3.length; d3++, m3 = m3.sqr()) a3[d3] !== 0 && (c2 = c2.mul(m3));
      return c2;
    }, o2.prototype.iushln = function(f3) {
      i2(typeof f3 == "number" && f3 >= 0);
      var a3 = f3 % 26, c2 = (f3 - a3) / 26, d3 = 67108863 >>> 26 - a3 << 26 - a3, m3;
      if (a3 !== 0) {
        var x3 = 0;
        for (m3 = 0; m3 < this.length; m3++) {
          var M3 = this.words[m3] & d3, l2 = (this.words[m3] | 0) - M3 << a3;
          this.words[m3] = l2 | x3, x3 = M3 >>> 26 - a3;
        }
        x3 && (this.words[m3] = x3, this.length++);
      }
      if (c2 !== 0) {
        for (m3 = this.length - 1; m3 >= 0; m3--) this.words[m3 + c2] = this.words[m3];
        for (m3 = 0; m3 < c2; m3++) this.words[m3] = 0;
        this.length += c2;
      }
      return this._strip();
    }, o2.prototype.ishln = function(f3) {
      return i2(this.negative === 0), this.iushln(f3);
    }, o2.prototype.iushrn = function(f3, a3, c2) {
      i2(typeof f3 == "number" && f3 >= 0);
      var d3;
      a3 ? d3 = (a3 - a3 % 26) / 26 : d3 = 0;
      var m3 = f3 % 26, x3 = Math.min((f3 - m3) / 26, this.length), M3 = 67108863 ^ 67108863 >>> m3 << m3, l2 = c2;
      if (d3 -= x3, d3 = Math.max(0, d3), l2) {
        for (var s2 = 0; s2 < x3; s2++) l2.words[s2] = this.words[s2];
        l2.length = x3;
      }
      if (x3 !== 0) if (this.length > x3) for (this.length -= x3, s2 = 0; s2 < this.length; s2++) this.words[s2] = this.words[s2 + x3];
      else this.words[0] = 0, this.length = 1;
      var g3 = 0;
      for (s2 = this.length - 1; s2 >= 0 && (g3 !== 0 || s2 >= d3); s2--) {
        var k2 = this.words[s2] | 0;
        this.words[s2] = g3 << 26 - m3 | k2 >>> m3, g3 = k2 & M3;
      }
      return l2 && g3 !== 0 && (l2.words[l2.length++] = g3), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, o2.prototype.ishrn = function(f3, a3, c2) {
      return i2(this.negative === 0), this.iushrn(f3, a3, c2);
    }, o2.prototype.shln = function(f3) {
      return this.clone().ishln(f3);
    }, o2.prototype.ushln = function(f3) {
      return this.clone().iushln(f3);
    }, o2.prototype.shrn = function(f3) {
      return this.clone().ishrn(f3);
    }, o2.prototype.ushrn = function(f3) {
      return this.clone().iushrn(f3);
    }, o2.prototype.testn = function(f3) {
      i2(typeof f3 == "number" && f3 >= 0);
      var a3 = f3 % 26, c2 = (f3 - a3) / 26, d3 = 1 << a3;
      if (this.length <= c2) return false;
      var m3 = this.words[c2];
      return !!(m3 & d3);
    }, o2.prototype.imaskn = function(f3) {
      i2(typeof f3 == "number" && f3 >= 0);
      var a3 = f3 % 26, c2 = (f3 - a3) / 26;
      if (i2(this.negative === 0, "imaskn works only with positive numbers"), this.length <= c2) return this;
      if (a3 !== 0 && c2++, this.length = Math.min(c2, this.length), a3 !== 0) {
        var d3 = 67108863 ^ 67108863 >>> a3 << a3;
        this.words[this.length - 1] &= d3;
      }
      return this._strip();
    }, o2.prototype.maskn = function(f3) {
      return this.clone().imaskn(f3);
    }, o2.prototype.iaddn = function(f3) {
      return i2(typeof f3 == "number"), i2(f3 < 67108864), f3 < 0 ? this.isubn(-f3) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= f3 ? (this.words[0] = f3 - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(f3), this.negative = 1, this) : this._iaddn(f3);
    }, o2.prototype._iaddn = function(f3) {
      this.words[0] += f3;
      for (var a3 = 0; a3 < this.length && this.words[a3] >= 67108864; a3++) this.words[a3] -= 67108864, a3 === this.length - 1 ? this.words[a3 + 1] = 1 : this.words[a3 + 1]++;
      return this.length = Math.max(this.length, a3 + 1), this;
    }, o2.prototype.isubn = function(f3) {
      if (i2(typeof f3 == "number"), i2(f3 < 67108864), f3 < 0) return this.iaddn(-f3);
      if (this.negative !== 0) return this.negative = 0, this.iaddn(f3), this.negative = 1, this;
      if (this.words[0] -= f3, this.length === 1 && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
      else for (var a3 = 0; a3 < this.length && this.words[a3] < 0; a3++) this.words[a3] += 67108864, this.words[a3 + 1] -= 1;
      return this._strip();
    }, o2.prototype.addn = function(f3) {
      return this.clone().iaddn(f3);
    }, o2.prototype.subn = function(f3) {
      return this.clone().isubn(f3);
    }, o2.prototype.iabs = function() {
      return this.negative = 0, this;
    }, o2.prototype.abs = function() {
      return this.clone().iabs();
    }, o2.prototype._ishlnsubmul = function(f3, a3, c2) {
      var d3 = f3.length + c2, m3;
      this._expand(d3);
      var x3, M3 = 0;
      for (m3 = 0; m3 < f3.length; m3++) {
        x3 = (this.words[m3 + c2] | 0) + M3;
        var l2 = (f3.words[m3] | 0) * a3;
        x3 -= l2 & 67108863, M3 = (x3 >> 26) - (l2 / 67108864 | 0), this.words[m3 + c2] = x3 & 67108863;
      }
      for (; m3 < this.length - c2; m3++) x3 = (this.words[m3 + c2] | 0) + M3, M3 = x3 >> 26, this.words[m3 + c2] = x3 & 67108863;
      if (M3 === 0) return this._strip();
      for (i2(M3 === -1), M3 = 0, m3 = 0; m3 < this.length; m3++) x3 = -(this.words[m3] | 0) + M3, M3 = x3 >> 26, this.words[m3] = x3 & 67108863;
      return this.negative = 1, this._strip();
    }, o2.prototype._wordDiv = function(f3, a3) {
      var c2 = this.length - f3.length, d3 = this.clone(), m3 = f3, x3 = m3.words[m3.length - 1] | 0, M3 = this._countBits(x3);
      c2 = 26 - M3, c2 !== 0 && (m3 = m3.ushln(c2), d3.iushln(c2), x3 = m3.words[m3.length - 1] | 0);
      var l2 = d3.length - m3.length, s2;
      if (a3 !== "mod") {
        s2 = new o2(null), s2.length = l2 + 1, s2.words = new Array(s2.length);
        for (var g3 = 0; g3 < s2.length; g3++) s2.words[g3] = 0;
      }
      var k2 = d3.clone()._ishlnsubmul(m3, 1, l2);
      k2.negative === 0 && (d3 = k2, s2 && (s2.words[l2] = 1));
      for (var u3 = l2 - 1; u3 >= 0; u3--) {
        var E2 = (d3.words[m3.length + u3] | 0) * 67108864 + (d3.words[m3.length + u3 - 1] | 0);
        for (E2 = Math.min(E2 / x3 | 0, 67108863), d3._ishlnsubmul(m3, E2, u3); d3.negative !== 0; ) E2--, d3.negative = 0, d3._ishlnsubmul(m3, 1, u3), d3.isZero() || (d3.negative ^= 1);
        s2 && (s2.words[u3] = E2);
      }
      return s2 && s2._strip(), d3._strip(), a3 !== "div" && c2 !== 0 && d3.iushrn(c2), { div: s2 || null, mod: d3 };
    }, o2.prototype.divmod = function(f3, a3, c2) {
      if (i2(!f3.isZero()), this.isZero()) return { div: new o2(0), mod: new o2(0) };
      var d3, m3, x3;
      return this.negative !== 0 && f3.negative === 0 ? (x3 = this.neg().divmod(f3, a3), a3 !== "mod" && (d3 = x3.div.neg()), a3 !== "div" && (m3 = x3.mod.neg(), c2 && m3.negative !== 0 && m3.iadd(f3)), { div: d3, mod: m3 }) : this.negative === 0 && f3.negative !== 0 ? (x3 = this.divmod(f3.neg(), a3), a3 !== "mod" && (d3 = x3.div.neg()), { div: d3, mod: x3.mod }) : this.negative & f3.negative ? (x3 = this.neg().divmod(f3.neg(), a3), a3 !== "div" && (m3 = x3.mod.neg(), c2 && m3.negative !== 0 && m3.isub(f3)), { div: x3.div, mod: m3 }) : f3.length > this.length || this.cmp(f3) < 0 ? { div: new o2(0), mod: this } : f3.length === 1 ? a3 === "div" ? { div: this.divn(f3.words[0]), mod: null } : a3 === "mod" ? { div: null, mod: new o2(this.modrn(f3.words[0])) } : { div: this.divn(f3.words[0]), mod: new o2(this.modrn(f3.words[0])) } : this._wordDiv(f3, a3);
    }, o2.prototype.div = function(f3) {
      return this.divmod(f3, "div", false).div;
    }, o2.prototype.mod = function(f3) {
      return this.divmod(f3, "mod", false).mod;
    }, o2.prototype.umod = function(f3) {
      return this.divmod(f3, "mod", true).mod;
    }, o2.prototype.divRound = function(f3) {
      var a3 = this.divmod(f3);
      if (a3.mod.isZero()) return a3.div;
      var c2 = a3.div.negative !== 0 ? a3.mod.isub(f3) : a3.mod, d3 = f3.ushrn(1), m3 = f3.andln(1), x3 = c2.cmp(d3);
      return x3 < 0 || m3 === 1 && x3 === 0 ? a3.div : a3.div.negative !== 0 ? a3.div.isubn(1) : a3.div.iaddn(1);
    }, o2.prototype.modrn = function(f3) {
      var a3 = f3 < 0;
      a3 && (f3 = -f3), i2(f3 <= 67108863);
      for (var c2 = (1 << 26) % f3, d3 = 0, m3 = this.length - 1; m3 >= 0; m3--) d3 = (c2 * d3 + (this.words[m3] | 0)) % f3;
      return a3 ? -d3 : d3;
    }, o2.prototype.modn = function(f3) {
      return this.modrn(f3);
    }, o2.prototype.idivn = function(f3) {
      var a3 = f3 < 0;
      a3 && (f3 = -f3), i2(f3 <= 67108863);
      for (var c2 = 0, d3 = this.length - 1; d3 >= 0; d3--) {
        var m3 = (this.words[d3] | 0) + c2 * 67108864;
        this.words[d3] = m3 / f3 | 0, c2 = m3 % f3;
      }
      return this._strip(), a3 ? this.ineg() : this;
    }, o2.prototype.divn = function(f3) {
      return this.clone().idivn(f3);
    }, o2.prototype.egcd = function(f3) {
      i2(f3.negative === 0), i2(!f3.isZero());
      var a3 = this, c2 = f3.clone();
      a3.negative !== 0 ? a3 = a3.umod(f3) : a3 = a3.clone();
      for (var d3 = new o2(1), m3 = new o2(0), x3 = new o2(0), M3 = new o2(1), l2 = 0; a3.isEven() && c2.isEven(); ) a3.iushrn(1), c2.iushrn(1), ++l2;
      for (var s2 = c2.clone(), g3 = a3.clone(); !a3.isZero(); ) {
        for (var k2 = 0, u3 = 1; !(a3.words[0] & u3) && k2 < 26; ++k2, u3 <<= 1) ;
        if (k2 > 0) for (a3.iushrn(k2); k2-- > 0; ) (d3.isOdd() || m3.isOdd()) && (d3.iadd(s2), m3.isub(g3)), d3.iushrn(1), m3.iushrn(1);
        for (var E2 = 0, _2 = 1; !(c2.words[0] & _2) && E2 < 26; ++E2, _2 <<= 1) ;
        if (E2 > 0) for (c2.iushrn(E2); E2-- > 0; ) (x3.isOdd() || M3.isOdd()) && (x3.iadd(s2), M3.isub(g3)), x3.iushrn(1), M3.iushrn(1);
        a3.cmp(c2) >= 0 ? (a3.isub(c2), d3.isub(x3), m3.isub(M3)) : (c2.isub(a3), x3.isub(d3), M3.isub(m3));
      }
      return { a: x3, b: M3, gcd: c2.iushln(l2) };
    }, o2.prototype._invmp = function(f3) {
      i2(f3.negative === 0), i2(!f3.isZero());
      var a3 = this, c2 = f3.clone();
      a3.negative !== 0 ? a3 = a3.umod(f3) : a3 = a3.clone();
      for (var d3 = new o2(1), m3 = new o2(0), x3 = c2.clone(); a3.cmpn(1) > 0 && c2.cmpn(1) > 0; ) {
        for (var M3 = 0, l2 = 1; !(a3.words[0] & l2) && M3 < 26; ++M3, l2 <<= 1) ;
        if (M3 > 0) for (a3.iushrn(M3); M3-- > 0; ) d3.isOdd() && d3.iadd(x3), d3.iushrn(1);
        for (var s2 = 0, g3 = 1; !(c2.words[0] & g3) && s2 < 26; ++s2, g3 <<= 1) ;
        if (s2 > 0) for (c2.iushrn(s2); s2-- > 0; ) m3.isOdd() && m3.iadd(x3), m3.iushrn(1);
        a3.cmp(c2) >= 0 ? (a3.isub(c2), d3.isub(m3)) : (c2.isub(a3), m3.isub(d3));
      }
      var k2;
      return a3.cmpn(1) === 0 ? k2 = d3 : k2 = m3, k2.cmpn(0) < 0 && k2.iadd(f3), k2;
    }, o2.prototype.gcd = function(f3) {
      if (this.isZero()) return f3.abs();
      if (f3.isZero()) return this.abs();
      var a3 = this.clone(), c2 = f3.clone();
      a3.negative = 0, c2.negative = 0;
      for (var d3 = 0; a3.isEven() && c2.isEven(); d3++) a3.iushrn(1), c2.iushrn(1);
      do {
        for (; a3.isEven(); ) a3.iushrn(1);
        for (; c2.isEven(); ) c2.iushrn(1);
        var m3 = a3.cmp(c2);
        if (m3 < 0) {
          var x3 = a3;
          a3 = c2, c2 = x3;
        } else if (m3 === 0 || c2.cmpn(1) === 0) break;
        a3.isub(c2);
      } while (true);
      return c2.iushln(d3);
    }, o2.prototype.invm = function(f3) {
      return this.egcd(f3).a.umod(f3);
    }, o2.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, o2.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, o2.prototype.andln = function(f3) {
      return this.words[0] & f3;
    }, o2.prototype.bincn = function(f3) {
      i2(typeof f3 == "number");
      var a3 = f3 % 26, c2 = (f3 - a3) / 26, d3 = 1 << a3;
      if (this.length <= c2) return this._expand(c2 + 1), this.words[c2] |= d3, this;
      for (var m3 = d3, x3 = c2; m3 !== 0 && x3 < this.length; x3++) {
        var M3 = this.words[x3] | 0;
        M3 += m3, m3 = M3 >>> 26, M3 &= 67108863, this.words[x3] = M3;
      }
      return m3 !== 0 && (this.words[x3] = m3, this.length++), this;
    }, o2.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, o2.prototype.cmpn = function(f3) {
      var a3 = f3 < 0;
      if (this.negative !== 0 && !a3) return -1;
      if (this.negative === 0 && a3) return 1;
      this._strip();
      var c2;
      if (this.length > 1) c2 = 1;
      else {
        a3 && (f3 = -f3), i2(f3 <= 67108863, "Number is too big");
        var d3 = this.words[0] | 0;
        c2 = d3 === f3 ? 0 : d3 < f3 ? -1 : 1;
      }
      return this.negative !== 0 ? -c2 | 0 : c2;
    }, o2.prototype.cmp = function(f3) {
      if (this.negative !== 0 && f3.negative === 0) return -1;
      if (this.negative === 0 && f3.negative !== 0) return 1;
      var a3 = this.ucmp(f3);
      return this.negative !== 0 ? -a3 | 0 : a3;
    }, o2.prototype.ucmp = function(f3) {
      if (this.length > f3.length) return 1;
      if (this.length < f3.length) return -1;
      for (var a3 = 0, c2 = this.length - 1; c2 >= 0; c2--) {
        var d3 = this.words[c2] | 0, m3 = f3.words[c2] | 0;
        if (d3 !== m3) {
          d3 < m3 ? a3 = -1 : d3 > m3 && (a3 = 1);
          break;
        }
      }
      return a3;
    }, o2.prototype.gtn = function(f3) {
      return this.cmpn(f3) === 1;
    }, o2.prototype.gt = function(f3) {
      return this.cmp(f3) === 1;
    }, o2.prototype.gten = function(f3) {
      return this.cmpn(f3) >= 0;
    }, o2.prototype.gte = function(f3) {
      return this.cmp(f3) >= 0;
    }, o2.prototype.ltn = function(f3) {
      return this.cmpn(f3) === -1;
    }, o2.prototype.lt = function(f3) {
      return this.cmp(f3) === -1;
    }, o2.prototype.lten = function(f3) {
      return this.cmpn(f3) <= 0;
    }, o2.prototype.lte = function(f3) {
      return this.cmp(f3) <= 0;
    }, o2.prototype.eqn = function(f3) {
      return this.cmpn(f3) === 0;
    }, o2.prototype.eq = function(f3) {
      return this.cmp(f3) === 0;
    }, o2.red = function(f3) {
      return new Y(f3);
    }, o2.prototype.toRed = function(f3) {
      return i2(!this.red, "Already a number in reduction context"), i2(this.negative === 0, "red works only with positives"), f3.convertTo(this)._forceRed(f3);
    }, o2.prototype.fromRed = function() {
      return i2(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, o2.prototype._forceRed = function(f3) {
      return this.red = f3, this;
    }, o2.prototype.forceRed = function(f3) {
      return i2(!this.red, "Already a number in reduction context"), this._forceRed(f3);
    }, o2.prototype.redAdd = function(f3) {
      return i2(this.red, "redAdd works only with red numbers"), this.red.add(this, f3);
    }, o2.prototype.redIAdd = function(f3) {
      return i2(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, f3);
    }, o2.prototype.redSub = function(f3) {
      return i2(this.red, "redSub works only with red numbers"), this.red.sub(this, f3);
    }, o2.prototype.redISub = function(f3) {
      return i2(this.red, "redISub works only with red numbers"), this.red.isub(this, f3);
    }, o2.prototype.redShl = function(f3) {
      return i2(this.red, "redShl works only with red numbers"), this.red.shl(this, f3);
    }, o2.prototype.redMul = function(f3) {
      return i2(this.red, "redMul works only with red numbers"), this.red._verify2(this, f3), this.red.mul(this, f3);
    }, o2.prototype.redIMul = function(f3) {
      return i2(this.red, "redMul works only with red numbers"), this.red._verify2(this, f3), this.red.imul(this, f3);
    }, o2.prototype.redSqr = function() {
      return i2(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, o2.prototype.redISqr = function() {
      return i2(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, o2.prototype.redSqrt = function() {
      return i2(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, o2.prototype.redInvm = function() {
      return i2(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, o2.prototype.redNeg = function() {
      return i2(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, o2.prototype.redPow = function(f3) {
      return i2(this.red && !f3.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, f3);
    };
    var H = { k256: null, p224: null, p192: null, p25519: null };
    function L3(b2, f3) {
      this.name = b2, this.p = new o2(f3, 16), this.n = this.p.bitLength(), this.k = new o2(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    L3.prototype._tmp = function() {
      var f3 = new o2(null);
      return f3.words = new Array(Math.ceil(this.n / 13)), f3;
    }, L3.prototype.ireduce = function(f3) {
      var a3 = f3, c2;
      do
        this.split(a3, this.tmp), a3 = this.imulK(a3), a3 = a3.iadd(this.tmp), c2 = a3.bitLength();
      while (c2 > this.n);
      var d3 = c2 < this.n ? -1 : a3.ucmp(this.p);
      return d3 === 0 ? (a3.words[0] = 0, a3.length = 1) : d3 > 0 ? a3.isub(this.p) : a3.strip !== void 0 ? a3.strip() : a3._strip(), a3;
    }, L3.prototype.split = function(f3, a3) {
      f3.iushrn(this.n, 0, a3);
    }, L3.prototype.imulK = function(f3) {
      return f3.imul(this.k);
    };
    function Pt2() {
      L3.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    n2(Pt2, L3), Pt2.prototype.split = function(f3, a3) {
      for (var c2 = 4194303, d3 = Math.min(f3.length, 9), m3 = 0; m3 < d3; m3++) a3.words[m3] = f3.words[m3];
      if (a3.length = d3, f3.length <= 9) {
        f3.words[0] = 0, f3.length = 1;
        return;
      }
      var x3 = f3.words[9];
      for (a3.words[a3.length++] = x3 & c2, m3 = 10; m3 < f3.length; m3++) {
        var M3 = f3.words[m3] | 0;
        f3.words[m3 - 10] = (M3 & c2) << 4 | x3 >>> 22, x3 = M3;
      }
      x3 >>>= 22, f3.words[m3 - 10] = x3, x3 === 0 && f3.length > 10 ? f3.length -= 10 : f3.length -= 9;
    }, Pt2.prototype.imulK = function(f3) {
      f3.words[f3.length] = 0, f3.words[f3.length + 1] = 0, f3.length += 2;
      for (var a3 = 0, c2 = 0; c2 < f3.length; c2++) {
        var d3 = f3.words[c2] | 0;
        a3 += d3 * 977, f3.words[c2] = a3 & 67108863, a3 = d3 * 64 + (a3 / 67108864 | 0);
      }
      return f3.words[f3.length - 1] === 0 && (f3.length--, f3.words[f3.length - 1] === 0 && f3.length--), f3;
    };
    function W() {
      L3.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    n2(W, L3);
    function Rt2() {
      L3.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    n2(Rt2, L3);
    function Vt2() {
      L3.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    n2(Vt2, L3), Vt2.prototype.imulK = function(f3) {
      for (var a3 = 0, c2 = 0; c2 < f3.length; c2++) {
        var d3 = (f3.words[c2] | 0) * 19 + a3, m3 = d3 & 67108863;
        d3 >>>= 26, f3.words[c2] = m3, a3 = d3;
      }
      return a3 !== 0 && (f3.words[f3.length++] = a3), f3;
    }, o2._prime = function(f3) {
      if (H[f3]) return H[f3];
      var a3;
      if (f3 === "k256") a3 = new Pt2();
      else if (f3 === "p224") a3 = new W();
      else if (f3 === "p192") a3 = new Rt2();
      else if (f3 === "p25519") a3 = new Vt2();
      else throw new Error("Unknown prime " + f3);
      return H[f3] = a3, a3;
    };
    function Y(b2) {
      if (typeof b2 == "string") {
        var f3 = o2._prime(b2);
        this.m = f3.p, this.prime = f3;
      } else i2(b2.gtn(1), "modulus must be greater than 1"), this.m = b2, this.prime = null;
    }
    Y.prototype._verify1 = function(f3) {
      i2(f3.negative === 0, "red works only with positives"), i2(f3.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(f3, a3) {
      i2((f3.negative | a3.negative) === 0, "red works only with positives"), i2(f3.red && f3.red === a3.red, "red works only with red numbers");
    }, Y.prototype.imod = function(f3) {
      return this.prime ? this.prime.ireduce(f3)._forceRed(this) : (w2(f3, f3.umod(this.m)._forceRed(this)), f3);
    }, Y.prototype.neg = function(f3) {
      return f3.isZero() ? f3.clone() : this.m.sub(f3)._forceRed(this);
    }, Y.prototype.add = function(f3, a3) {
      this._verify2(f3, a3);
      var c2 = f3.add(a3);
      return c2.cmp(this.m) >= 0 && c2.isub(this.m), c2._forceRed(this);
    }, Y.prototype.iadd = function(f3, a3) {
      this._verify2(f3, a3);
      var c2 = f3.iadd(a3);
      return c2.cmp(this.m) >= 0 && c2.isub(this.m), c2;
    }, Y.prototype.sub = function(f3, a3) {
      this._verify2(f3, a3);
      var c2 = f3.sub(a3);
      return c2.cmpn(0) < 0 && c2.iadd(this.m), c2._forceRed(this);
    }, Y.prototype.isub = function(f3, a3) {
      this._verify2(f3, a3);
      var c2 = f3.isub(a3);
      return c2.cmpn(0) < 0 && c2.iadd(this.m), c2;
    }, Y.prototype.shl = function(f3, a3) {
      return this._verify1(f3), this.imod(f3.ushln(a3));
    }, Y.prototype.imul = function(f3, a3) {
      return this._verify2(f3, a3), this.imod(f3.imul(a3));
    }, Y.prototype.mul = function(f3, a3) {
      return this._verify2(f3, a3), this.imod(f3.mul(a3));
    }, Y.prototype.isqr = function(f3) {
      return this.imul(f3, f3.clone());
    }, Y.prototype.sqr = function(f3) {
      return this.mul(f3, f3);
    }, Y.prototype.sqrt = function(f3) {
      if (f3.isZero()) return f3.clone();
      var a3 = this.m.andln(3);
      if (i2(a3 % 2 === 1), a3 === 3) {
        var c2 = this.m.add(new o2(1)).iushrn(2);
        return this.pow(f3, c2);
      }
      for (var d3 = this.m.subn(1), m3 = 0; !d3.isZero() && d3.andln(1) === 0; ) m3++, d3.iushrn(1);
      i2(!d3.isZero());
      var x3 = new o2(1).toRed(this), M3 = x3.redNeg(), l2 = this.m.subn(1).iushrn(1), s2 = this.m.bitLength();
      for (s2 = new o2(2 * s2 * s2).toRed(this); this.pow(s2, l2).cmp(M3) !== 0; ) s2.redIAdd(M3);
      for (var g3 = this.pow(s2, d3), k2 = this.pow(f3, d3.addn(1).iushrn(1)), u3 = this.pow(f3, d3), E2 = m3; u3.cmp(x3) !== 0; ) {
        for (var _2 = u3, B2 = 0; _2.cmp(x3) !== 0; B2++) _2 = _2.redSqr();
        i2(B2 < E2);
        var R3 = this.pow(g3, new o2(1).iushln(E2 - B2 - 1));
        k2 = k2.redMul(R3), g3 = R3.redSqr(), u3 = u3.redMul(g3), E2 = B2;
      }
      return k2;
    }, Y.prototype.invm = function(f3) {
      var a3 = f3._invmp(this.m);
      return a3.negative !== 0 ? (a3.negative = 0, this.imod(a3).redNeg()) : this.imod(a3);
    }, Y.prototype.pow = function(f3, a3) {
      if (a3.isZero()) return new o2(1).toRed(this);
      if (a3.cmpn(1) === 0) return f3.clone();
      var c2 = 4, d3 = new Array(1 << c2);
      d3[0] = new o2(1).toRed(this), d3[1] = f3;
      for (var m3 = 2; m3 < d3.length; m3++) d3[m3] = this.mul(d3[m3 - 1], f3);
      var x3 = d3[0], M3 = 0, l2 = 0, s2 = a3.bitLength() % 26;
      for (s2 === 0 && (s2 = 26), m3 = a3.length - 1; m3 >= 0; m3--) {
        for (var g3 = a3.words[m3], k2 = s2 - 1; k2 >= 0; k2--) {
          var u3 = g3 >> k2 & 1;
          if (x3 !== d3[0] && (x3 = this.sqr(x3)), u3 === 0 && M3 === 0) {
            l2 = 0;
            continue;
          }
          M3 <<= 1, M3 |= u3, l2++, !(l2 !== c2 && (m3 !== 0 || k2 !== 0)) && (x3 = this.mul(x3, d3[M3]), l2 = 0, M3 = 0);
        }
        s2 = 26;
      }
      return x3;
    }, Y.prototype.convertTo = function(f3) {
      var a3 = f3.umod(this.m);
      return a3 === f3 ? a3.clone() : a3;
    }, Y.prototype.convertFrom = function(f3) {
      var a3 = f3.clone();
      return a3.red = null, a3;
    }, o2.mont = function(f3) {
      return new Wt2(f3);
    };
    function Wt2(b2) {
      Y.call(this, b2), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new o2(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    n2(Wt2, Y), Wt2.prototype.convertTo = function(f3) {
      return this.imod(f3.ushln(this.shift));
    }, Wt2.prototype.convertFrom = function(f3) {
      var a3 = this.imod(f3.mul(this.rinv));
      return a3.red = null, a3;
    }, Wt2.prototype.imul = function(f3, a3) {
      if (f3.isZero() || a3.isZero()) return f3.words[0] = 0, f3.length = 1, f3;
      var c2 = f3.imul(a3), d3 = c2.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), m3 = c2.isub(d3).iushrn(this.shift), x3 = m3;
      return m3.cmp(this.m) >= 0 ? x3 = m3.isub(this.m) : m3.cmpn(0) < 0 && (x3 = m3.iadd(this.m)), x3._forceRed(this);
    }, Wt2.prototype.mul = function(f3, a3) {
      if (f3.isZero() || a3.isZero()) return new o2(0)._forceRed(this);
      var c2 = f3.mul(a3), d3 = c2.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), m3 = c2.isub(d3).iushrn(this.shift), x3 = m3;
      return m3.cmp(this.m) >= 0 ? x3 = m3.isub(this.m) : m3.cmpn(0) < 0 && (x3 = m3.iadd(this.m)), x3._forceRed(this);
    }, Wt2.prototype.invm = function(f3) {
      var a3 = this.imod(f3._invmp(this.m).mul(this.r2));
      return a3._forceRed(this);
    };
  })(e, Tn$1);
})(Gn);
var K = Gn.exports;
const Yn = "bignumber/5.7.0";
var Fr$1 = K.BN;
const Ae = new z$3(Yn), Ni = {}, Vn = 9007199254740991;
function Ts$1(e) {
  return e != null && (V$1.isBigNumber(e) || typeof e == "number" && e % 1 === 0 || typeof e == "string" && !!e.match(/^-?[0-9]+$/) || Jt$1(e) || typeof e == "bigint" || nr$1(e));
}
let Wn = false;
let V$1 = class V {
  constructor(t, r2) {
    t !== Ni && Ae.throwError("cannot call constructor directly; use BigNumber.from", z$3.errors.UNSUPPORTED_OPERATION, { operation: "new (BigNumber)" }), this._hex = r2, this._isBigNumber = true, Object.freeze(this);
  }
  fromTwos(t) {
    return zt$1(j$2(this).fromTwos(t));
  }
  toTwos(t) {
    return zt$1(j$2(this).toTwos(t));
  }
  abs() {
    return this._hex[0] === "-" ? V.from(this._hex.substring(1)) : this;
  }
  add(t) {
    return zt$1(j$2(this).add(j$2(t)));
  }
  sub(t) {
    return zt$1(j$2(this).sub(j$2(t)));
  }
  div(t) {
    return V.from(t).isZero() && Zt$1("division-by-zero", "div"), zt$1(j$2(this).div(j$2(t)));
  }
  mul(t) {
    return zt$1(j$2(this).mul(j$2(t)));
  }
  mod(t) {
    const r2 = j$2(t);
    return r2.isNeg() && Zt$1("division-by-zero", "mod"), zt$1(j$2(this).umod(r2));
  }
  pow(t) {
    const r2 = j$2(t);
    return r2.isNeg() && Zt$1("negative-power", "pow"), zt$1(j$2(this).pow(r2));
  }
  and(t) {
    const r2 = j$2(t);
    return (this.isNegative() || r2.isNeg()) && Zt$1("unbound-bitwise-result", "and"), zt$1(j$2(this).and(r2));
  }
  or(t) {
    const r2 = j$2(t);
    return (this.isNegative() || r2.isNeg()) && Zt$1("unbound-bitwise-result", "or"), zt$1(j$2(this).or(r2));
  }
  xor(t) {
    const r2 = j$2(t);
    return (this.isNegative() || r2.isNeg()) && Zt$1("unbound-bitwise-result", "xor"), zt$1(j$2(this).xor(r2));
  }
  mask(t) {
    return (this.isNegative() || t < 0) && Zt$1("negative-width", "mask"), zt$1(j$2(this).maskn(t));
  }
  shl(t) {
    return (this.isNegative() || t < 0) && Zt$1("negative-width", "shl"), zt$1(j$2(this).shln(t));
  }
  shr(t) {
    return (this.isNegative() || t < 0) && Zt$1("negative-width", "shr"), zt$1(j$2(this).shrn(t));
  }
  eq(t) {
    return j$2(this).eq(j$2(t));
  }
  lt(t) {
    return j$2(this).lt(j$2(t));
  }
  lte(t) {
    return j$2(this).lte(j$2(t));
  }
  gt(t) {
    return j$2(this).gt(j$2(t));
  }
  gte(t) {
    return j$2(this).gte(j$2(t));
  }
  isNegative() {
    return this._hex[0] === "-";
  }
  isZero() {
    return j$2(this).isZero();
  }
  toNumber() {
    try {
      return j$2(this).toNumber();
    } catch {
      Zt$1("overflow", "toNumber", this.toString());
    }
    return null;
  }
  toBigInt() {
    try {
      return BigInt(this.toString());
    } catch {
    }
    return Ae.throwError("this platform does not support BigInt", z$3.errors.UNSUPPORTED_OPERATION, { value: this.toString() });
  }
  toString() {
    return arguments.length > 0 && (arguments[0] === 10 ? Wn || (Wn = true, Ae.warn("BigNumber.toString does not accept any parameters; base-10 is assumed")) : arguments[0] === 16 ? Ae.throwError("BigNumber.toString does not accept any parameters; use bigNumber.toHexString()", z$3.errors.UNEXPECTED_ARGUMENT, {}) : Ae.throwError("BigNumber.toString does not accept parameters", z$3.errors.UNEXPECTED_ARGUMENT, {})), j$2(this).toString(10);
  }
  toHexString() {
    return this._hex;
  }
  toJSON(t) {
    return { type: "BigNumber", hex: this.toHexString() };
  }
  static from(t) {
    if (t instanceof V) return t;
    if (typeof t == "string") return t.match(/^-?0x[0-9a-f]+$/i) ? new V(Ni, mr$1(t)) : t.match(/^-?[0-9]+$/) ? new V(Ni, mr$1(new Fr$1(t))) : Ae.throwArgumentError("invalid BigNumber string", "value", t);
    if (typeof t == "number") return t % 1 && Zt$1("underflow", "BigNumber.from", t), (t >= Vn || t <= -Vn) && Zt$1("overflow", "BigNumber.from", t), V.from(String(t));
    const r2 = t;
    if (typeof r2 == "bigint") return V.from(r2.toString());
    if (nr$1(r2)) return V.from(Kt$1(r2));
    if (r2) if (r2.toHexString) {
      const i2 = r2.toHexString();
      if (typeof i2 == "string") return V.from(i2);
    } else {
      let i2 = r2._hex;
      if (i2 == null && r2.type === "BigNumber" && (i2 = r2.hex), typeof i2 == "string" && (Jt$1(i2) || i2[0] === "-" && Jt$1(i2.substring(1)))) return V.from(i2);
    }
    return Ae.throwArgumentError("invalid BigNumber value", "value", t);
  }
  static isBigNumber(t) {
    return !!(t && t._isBigNumber);
  }
};
function mr$1(e) {
  if (typeof e != "string") return mr$1(e.toString(16));
  if (e[0] === "-") return e = e.substring(1), e[0] === "-" && Ae.throwArgumentError("invalid hex", "value", e), e = mr$1(e), e === "0x00" ? e : "-" + e;
  if (e.substring(0, 2) !== "0x" && (e = "0x" + e), e === "0x") return "0x00";
  for (e.length % 2 && (e = "0x0" + e.substring(2)); e.length > 4 && e.substring(0, 4) === "0x00"; ) e = "0x" + e.substring(4);
  return e;
}
function zt$1(e) {
  return V$1.from(mr$1(e));
}
function j$2(e) {
  const t = V$1.from(e).toHexString();
  return t[0] === "-" ? new Fr$1("-" + t.substring(3), 16) : new Fr$1(t.substring(2), 16);
}
function Zt$1(e, t, r2) {
  const i2 = { fault: e, operation: t };
  return r2 != null && (i2.value = r2), Ae.throwError(e, z$3.errors.NUMERIC_FAULT, i2);
}
function Us$1(e) {
  return new Fr$1(e, 36).toString(16);
}
const Ht$1 = new z$3(Yn), Ar$1 = {}, Xn = V$1.from(0), Zn = V$1.from(-1);
function $n(e, t, r2, i2) {
  const n2 = { fault: t, operation: r2 };
  return i2 !== void 0 && (n2.value = i2), Ht$1.throwError(e, z$3.errors.NUMERIC_FAULT, n2);
}
let br$1 = "0";
for (; br$1.length < 256; ) br$1 += br$1;
function Ii(e) {
  if (typeof e != "number") try {
    e = V$1.from(e).toNumber();
  } catch {
  }
  return typeof e == "number" && e >= 0 && e <= 256 && !(e % 1) ? "1" + br$1.substring(0, e) : Ht$1.throwArgumentError("invalid decimal size", "decimals", e);
}
function _i(e, t) {
  t == null && (t = 0);
  const r2 = Ii(t);
  e = V$1.from(e);
  const i2 = e.lt(Xn);
  i2 && (e = e.mul(Zn));
  let n2 = e.mod(r2).toString();
  for (; n2.length < r2.length - 1; ) n2 = "0" + n2;
  n2 = n2.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  const o2 = e.div(r2).toString();
  return r2.length === 1 ? e = o2 : e = o2 + "." + n2, i2 && (e = "-" + e), e;
}
function be$2(e, t) {
  t == null && (t = 0);
  const r2 = Ii(t);
  (typeof e != "string" || !e.match(/^-?[0-9.]+$/)) && Ht$1.throwArgumentError("invalid decimal value", "value", e);
  const i2 = e.substring(0, 1) === "-";
  i2 && (e = e.substring(1)), e === "." && Ht$1.throwArgumentError("missing value", "value", e);
  const n2 = e.split(".");
  n2.length > 2 && Ht$1.throwArgumentError("too many decimal points", "value", e);
  let o2 = n2[0], h3 = n2[1];
  for (o2 || (o2 = "0"), h3 || (h3 = "0"); h3[h3.length - 1] === "0"; ) h3 = h3.substring(0, h3.length - 1);
  for (h3.length > r2.length - 1 && $n("fractional component exceeds decimals", "underflow", "parseFixed"), h3 === "" && (h3 = "0"); h3.length < r2.length - 1; ) h3 += "0";
  const p3 = V$1.from(o2), A2 = V$1.from(h3);
  let v3 = p3.mul(r2).add(A2);
  return i2 && (v3 = v3.mul(Zn)), v3;
}
let vr$1 = class vr {
  constructor(t, r2, i2, n2) {
    t !== Ar$1 && Ht$1.throwError("cannot use FixedFormat constructor; use FixedFormat.from", z$3.errors.UNSUPPORTED_OPERATION, { operation: "new FixedFormat" }), this.signed = r2, this.width = i2, this.decimals = n2, this.name = (r2 ? "" : "u") + "fixed" + String(i2) + "x" + String(n2), this._multiplier = Ii(n2), Object.freeze(this);
  }
  static from(t) {
    if (t instanceof vr) return t;
    typeof t == "number" && (t = `fixed128x${t}`);
    let r2 = true, i2 = 128, n2 = 18;
    if (typeof t == "string") {
      if (t !== "fixed") if (t === "ufixed") r2 = false;
      else {
        const o2 = t.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
        o2 || Ht$1.throwArgumentError("invalid fixed format", "format", t), r2 = o2[1] !== "u", i2 = parseInt(o2[2]), n2 = parseInt(o2[3]);
      }
    } else if (t) {
      const o2 = (h3, p3, A2) => t[h3] == null ? A2 : (typeof t[h3] !== p3 && Ht$1.throwArgumentError("invalid fixed format (" + h3 + " not " + p3 + ")", "format." + h3, t[h3]), t[h3]);
      r2 = o2("signed", "boolean", r2), i2 = o2("width", "number", i2), n2 = o2("decimals", "number", n2);
    }
    return i2 % 8 && Ht$1.throwArgumentError("invalid fixed format width (not byte aligned)", "format.width", i2), n2 > 80 && Ht$1.throwArgumentError("invalid fixed format (decimals too large)", "format.decimals", n2), new vr(Ar$1, r2, i2, n2);
  }
};
let Ut$1 = class Ut {
  constructor(t, r2, i2, n2) {
    t !== Ar$1 && Ht$1.throwError("cannot use FixedNumber constructor; use FixedNumber.from", z$3.errors.UNSUPPORTED_OPERATION, { operation: "new FixedFormat" }), this.format = n2, this._hex = r2, this._value = i2, this._isFixedNumber = true, Object.freeze(this);
  }
  _checkFormat(t) {
    this.format.name !== t.format.name && Ht$1.throwArgumentError("incompatible format; use fixedNumber.toFormat", "other", t);
  }
  addUnsafe(t) {
    this._checkFormat(t);
    const r2 = be$2(this._value, this.format.decimals), i2 = be$2(t._value, t.format.decimals);
    return Ut.fromValue(r2.add(i2), this.format.decimals, this.format);
  }
  subUnsafe(t) {
    this._checkFormat(t);
    const r2 = be$2(this._value, this.format.decimals), i2 = be$2(t._value, t.format.decimals);
    return Ut.fromValue(r2.sub(i2), this.format.decimals, this.format);
  }
  mulUnsafe(t) {
    this._checkFormat(t);
    const r2 = be$2(this._value, this.format.decimals), i2 = be$2(t._value, t.format.decimals);
    return Ut.fromValue(r2.mul(i2).div(this.format._multiplier), this.format.decimals, this.format);
  }
  divUnsafe(t) {
    this._checkFormat(t);
    const r2 = be$2(this._value, this.format.decimals), i2 = be$2(t._value, t.format.decimals);
    return Ut.fromValue(r2.mul(this.format._multiplier).div(i2), this.format.decimals, this.format);
  }
  floor() {
    const t = this.toString().split(".");
    t.length === 1 && t.push("0");
    let r2 = Ut.from(t[0], this.format);
    const i2 = !t[1].match(/^(0*)$/);
    return this.isNegative() && i2 && (r2 = r2.subUnsafe(tf.toFormat(r2.format))), r2;
  }
  ceiling() {
    const t = this.toString().split(".");
    t.length === 1 && t.push("0");
    let r2 = Ut.from(t[0], this.format);
    const i2 = !t[1].match(/^(0*)$/);
    return !this.isNegative() && i2 && (r2 = r2.addUnsafe(tf.toFormat(r2.format))), r2;
  }
  round(t) {
    t == null && (t = 0);
    const r2 = this.toString().split(".");
    if (r2.length === 1 && r2.push("0"), (t < 0 || t > 80 || t % 1) && Ht$1.throwArgumentError("invalid decimal count", "decimals", t), r2[1].length <= t) return this;
    const i2 = Ut.from("1" + br$1.substring(0, t), this.format), n2 = ks$1.toFormat(this.format);
    return this.mulUnsafe(i2).addUnsafe(n2).floor().divUnsafe(i2);
  }
  isZero() {
    return this._value === "0.0" || this._value === "0";
  }
  isNegative() {
    return this._value[0] === "-";
  }
  toString() {
    return this._value;
  }
  toHexString(t) {
    if (t == null) return this._hex;
    t % 8 && Ht$1.throwArgumentError("invalid byte width", "width", t);
    const r2 = V$1.from(this._hex).fromTwos(this.format.width).toTwos(t).toHexString();
    return oe$2(r2, t / 8);
  }
  toUnsafeFloat() {
    return parseFloat(this.toString());
  }
  toFormat(t) {
    return Ut.fromString(this._value, t);
  }
  static fromValue(t, r2, i2) {
    return i2 == null && r2 != null && !Ts$1(r2) && (i2 = r2, r2 = null), r2 == null && (r2 = 0), i2 == null && (i2 = "fixed"), Ut.fromString(_i(t, r2), vr$1.from(i2));
  }
  static fromString(t, r2) {
    r2 == null && (r2 = "fixed");
    const i2 = vr$1.from(r2), n2 = be$2(t, i2.decimals);
    !i2.signed && n2.lt(Xn) && $n("unsigned value cannot be negative", "overflow", "value", t);
    let o2 = null;
    i2.signed ? o2 = n2.toTwos(i2.width).toHexString() : (o2 = n2.toHexString(), o2 = oe$2(o2, i2.width / 8));
    const h3 = _i(n2, i2.decimals);
    return new Ut(Ar$1, o2, h3, i2);
  }
  static fromBytes(t, r2) {
    r2 == null && (r2 = "fixed");
    const i2 = vr$1.from(r2);
    if (Ot$1(t).length > i2.width / 8) throw new Error("overflow");
    let n2 = V$1.from(t);
    i2.signed && (n2 = n2.fromTwos(i2.width));
    const o2 = n2.toTwos((i2.signed ? 0 : 1) + i2.width).toHexString(), h3 = _i(n2, i2.decimals);
    return new Ut(Ar$1, o2, h3, i2);
  }
  static from(t, r2) {
    if (typeof t == "string") return Ut.fromString(t, r2);
    if (nr$1(t)) return Ut.fromBytes(t, r2);
    try {
      return Ut.fromValue(t, 0, r2);
    } catch (i2) {
      if (i2.code !== z$3.errors.INVALID_ARGUMENT) throw i2;
    }
    return Ht$1.throwArgumentError("invalid FixedNumber value", "value", t);
  }
  static isFixedNumber(t) {
    return !!(t && t._isFixedNumber);
  }
};
const tf = Ut$1.from(1), ks$1 = Ut$1.from("0.5"), qs$2 = "strings/5.7.0", ef = new z$3(qs$2);
var Tr$1;
(function(e) {
  e.current = "", e.NFC = "NFC", e.NFD = "NFD", e.NFKC = "NFKC", e.NFKD = "NFKD";
})(Tr$1 || (Tr$1 = {}));
var fr$1;
(function(e) {
  e.UNEXPECTED_CONTINUE = "unexpected continuation byte", e.BAD_PREFIX = "bad codepoint prefix", e.OVERRUN = "string overrun", e.MISSING_CONTINUE = "missing continuation byte", e.OUT_OF_RANGE = "out of UTF-8 range", e.UTF16_SURROGATE = "UTF-16 surrogate", e.OVERLONG = "overlong representation";
})(fr$1 || (fr$1 = {}));
function Bi$1(e, t = Tr$1.current) {
  t != Tr$1.current && (ef.checkNormalize(), e = e.normalize(t));
  let r2 = [];
  for (let i2 = 0; i2 < e.length; i2++) {
    const n2 = e.charCodeAt(i2);
    if (n2 < 128) r2.push(n2);
    else if (n2 < 2048) r2.push(n2 >> 6 | 192), r2.push(n2 & 63 | 128);
    else if ((n2 & 64512) == 55296) {
      i2++;
      const o2 = e.charCodeAt(i2);
      if (i2 >= e.length || (o2 & 64512) !== 56320) throw new Error("invalid utf-8 string");
      const h3 = 65536 + ((n2 & 1023) << 10) + (o2 & 1023);
      r2.push(h3 >> 18 | 240), r2.push(h3 >> 12 & 63 | 128), r2.push(h3 >> 6 & 63 | 128), r2.push(h3 & 63 | 128);
    } else r2.push(n2 >> 12 | 224), r2.push(n2 >> 6 & 63 | 128), r2.push(n2 & 63 | 128);
  }
  return Ot$1(r2);
}
function Ls$1(e) {
  if (e.length % 4 !== 0) throw new Error("bad data");
  let t = [];
  for (let r2 = 0; r2 < e.length; r2 += 4) t.push(parseInt(e.substring(r2, r2 + 4), 16));
  return t;
}
function Ci(e, t) {
  t || (t = function(n2) {
    return [parseInt(n2, 16)];
  });
  let r2 = 0, i2 = {};
  return e.split(",").forEach((n2) => {
    let o2 = n2.split(":");
    r2 += parseInt(o2[0], 16), i2[r2] = t(o2[1]);
  }), i2;
}
function nf(e) {
  let t = 0;
  return e.split(",").map((r2) => {
    let i2 = r2.split("-");
    i2.length === 1 ? i2[1] = "0" : i2[1] === "" && (i2[1] = "1");
    let n2 = t + parseInt(i2[0], 16);
    return t = parseInt(i2[1], 16), { l: n2, h: t };
  });
}
nf("221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d"), "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff".split(",").map((e) => parseInt(e, 16)), Ci("b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3"), Ci("179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7"), Ci("df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D", Ls$1), nf("80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001");
function zs$1(e) {
  e = atob(e);
  const t = [];
  for (let r2 = 0; r2 < e.length; r2++) t.push(e.charCodeAt(r2));
  return Ot$1(t);
}
function of(e, t) {
  t == null && (t = 1);
  const r2 = [], i2 = r2.forEach, n2 = function(o2, h3) {
    i2.call(o2, function(p3) {
      h3 > 0 && Array.isArray(p3) ? n2(p3, h3 - 1) : r2.push(p3);
    });
  };
  return n2(e, t), r2;
}
function js$1(e) {
  const t = {};
  for (let r2 = 0; r2 < e.length; r2++) {
    const i2 = e[r2];
    t[i2[0]] = i2[1];
  }
  return t;
}
function Qs$1(e) {
  let t = 0;
  function r2() {
    return e[t++] << 8 | e[t++];
  }
  let i2 = r2(), n2 = 1, o2 = [0, 1];
  for (let H = 1; H < i2; H++) o2.push(n2 += r2());
  let h3 = r2(), p3 = t;
  t += h3;
  let A2 = 0, v3 = 0;
  function w2() {
    return A2 == 0 && (v3 = v3 << 8 | e[t++], A2 = 8), v3 >> --A2 & 1;
  }
  const y3 = 31, S4 = Math.pow(2, y3), I2 = S4 >>> 1, N2 = I2 >> 1, C3 = S4 - 1;
  let F2 = 0;
  for (let H = 0; H < y3; H++) F2 = F2 << 1 | w2();
  let U2 = [], J = 0, Bt2 = S4;
  for (; ; ) {
    let H = Math.floor(((F2 - J + 1) * n2 - 1) / Bt2), L3 = 0, Pt2 = i2;
    for (; Pt2 - L3 > 1; ) {
      let Vt2 = L3 + Pt2 >>> 1;
      H < o2[Vt2] ? Pt2 = Vt2 : L3 = Vt2;
    }
    if (L3 == 0) break;
    U2.push(L3);
    let W = J + Math.floor(Bt2 * o2[L3] / n2), Rt2 = J + Math.floor(Bt2 * o2[L3 + 1] / n2) - 1;
    for (; !((W ^ Rt2) & I2); ) F2 = F2 << 1 & C3 | w2(), W = W << 1 & C3, Rt2 = Rt2 << 1 & C3 | 1;
    for (; W & ~Rt2 & N2; ) F2 = F2 & I2 | F2 << 1 & C3 >>> 1 | w2(), W = W << 1 ^ I2, Rt2 = (Rt2 ^ I2) << 1 | I2 | 1;
    J = W, Bt2 = 1 + Rt2 - W;
  }
  let G = i2 - 4;
  return U2.map((H) => {
    switch (H - G) {
      case 3:
        return G + 65792 + (e[p3++] << 16 | e[p3++] << 8 | e[p3++]);
      case 2:
        return G + 256 + (e[p3++] << 8 | e[p3++]);
      case 1:
        return G + e[p3++];
      default:
        return H - 1;
    }
  });
}
function Js$1(e) {
  let t = 0;
  return () => e[t++];
}
function Gs$1(e) {
  return Js$1(Qs$1(e));
}
function Ys$1(e) {
  return e & 1 ? ~e >> 1 : e >> 1;
}
function Vs$1(e, t) {
  let r2 = Array(e);
  for (let i2 = 0; i2 < e; i2++) r2[i2] = 1 + t();
  return r2;
}
function sf(e, t) {
  let r2 = Array(e);
  for (let i2 = 0, n2 = -1; i2 < e; i2++) r2[i2] = n2 += 1 + t();
  return r2;
}
function Ws$1(e, t) {
  let r2 = Array(e);
  for (let i2 = 0, n2 = 0; i2 < e; i2++) r2[i2] = n2 += Ys$1(t());
  return r2;
}
function Ur(e, t) {
  let r2 = sf(e(), e), i2 = e(), n2 = sf(i2, e), o2 = Vs$1(i2, e);
  for (let h3 = 0; h3 < i2; h3++) for (let p3 = 0; p3 < o2[h3]; p3++) r2.push(n2[h3] + p3);
  return t ? r2.map((h3) => t[h3]) : r2;
}
function Xs$1(e) {
  let t = [];
  for (; ; ) {
    let r2 = e();
    if (r2 == 0) break;
    t.push($s$1(r2, e));
  }
  for (; ; ) {
    let r2 = e() - 1;
    if (r2 < 0) break;
    t.push(t0(r2, e));
  }
  return js$1(of(t));
}
function Zs$1(e) {
  let t = [];
  for (; ; ) {
    let r2 = e();
    if (r2 == 0) break;
    t.push(r2);
  }
  return t;
}
function af(e, t, r2) {
  let i2 = Array(e).fill(void 0).map(() => []);
  for (let n2 = 0; n2 < t; n2++) Ws$1(e, r2).forEach((o2, h3) => i2[h3].push(o2));
  return i2;
}
function $s$1(e, t) {
  let r2 = 1 + t(), i2 = t(), n2 = Zs$1(t), o2 = af(n2.length, 1 + e, t);
  return of(o2.map((h3, p3) => {
    const A2 = h3[0], v3 = h3.slice(1);
    return Array(n2[p3]).fill(void 0).map((w2, y3) => {
      let S4 = y3 * i2;
      return [A2 + y3 * r2, v3.map((I2) => I2 + S4)];
    });
  }));
}
function t0(e, t) {
  let r2 = 1 + t();
  return af(r2, 1 + e, t).map((n2) => [n2[0], n2.slice(1)]);
}
function e0(e) {
  let t = Ur(e).sort((i2, n2) => i2 - n2);
  return r2();
  function r2() {
    let i2 = [];
    for (; ; ) {
      let v3 = Ur(e, t);
      if (v3.length == 0) break;
      i2.push({ set: new Set(v3), node: r2() });
    }
    i2.sort((v3, w2) => w2.set.size - v3.set.size);
    let n2 = e(), o2 = n2 % 3;
    n2 = n2 / 3 | 0;
    let h3 = !!(n2 & 1);
    n2 >>= 1;
    let p3 = n2 == 1, A2 = n2 == 2;
    return { branches: i2, valid: o2, fe0f: h3, save: p3, check: A2 };
  }
}
function r0() {
  return Gs$1(zs$1("AEQF2AO2DEsA2wIrAGsBRABxAN8AZwCcAEwAqgA0AGwAUgByADcATAAVAFYAIQAyACEAKAAYAFgAGwAjABQAMAAmADIAFAAfABQAKwATACoADgAbAA8AHQAYABoAGQAxADgALAAoADwAEwA9ABMAGgARAA4ADwAWABMAFgAIAA8AHgQXBYMA5BHJAS8JtAYoAe4AExozi0UAH21tAaMnBT8CrnIyhrMDhRgDygIBUAEHcoFHUPe8AXBjAewCjgDQR8IICIcEcQLwATXCDgzvHwBmBoHNAqsBdBcUAykgDhAMShskMgo8AY8jqAQfAUAfHw8BDw87MioGlCIPBwZCa4ELatMAAMspJVgsDl8AIhckSg8XAHdvTwBcIQEiDT4OPhUqbyECAEoAS34Aej8Ybx83JgT/Xw8gHxZ/7w8RICxPHA9vBw+Pfw8PHwAPFv+fAsAvCc8vEr8ivwD/EQ8Bol8OEBa/A78hrwAPCU8vESNvvwWfHwNfAVoDHr+ZAAED34YaAdJPAK7PLwSEgDLHAGo1Pz8Pvx9fUwMrpb8O/58VTzAPIBoXIyQJNF8hpwIVAT8YGAUADDNBaX3RAMomJCg9EhUeA29MABsZBTMNJipjOhc19gcIDR8bBwQHEggCWi6DIgLuAQYA+BAFCha3A5XiAEsqM7UFFgFLhAMjFTMYE1Klnw74nRVBG/ASCm0BYRN/BrsU3VoWy+S0vV8LQx+vN8gF2AC2AK5EAWwApgYDKmAAroQ0NDQ0AT+OCg7wAAIHRAbpNgVcBV0APTA5BfbPFgMLzcYL/QqqA82eBALKCjQCjqYCht0/k2+OAsXQAoP3ASTKDgDw6ACKAUYCMpIKJpRaAE4A5womABzZvs0REEKiACIQAd5QdAECAj4Ywg/wGqY2AVgAYADYvAoCGAEubA0gvAY2ALAAbpbvqpyEAGAEpgQAJgAG7gAgAEACmghUFwCqAMpAINQIwC4DthRAAPcycKgApoIdABwBfCisABoATwBqASIAvhnSBP8aH/ECeAKXAq40NjgDBTwFYQU6AXs3oABgAD4XNgmcCY1eCl5tIFZeUqGgyoNHABgAEQAaABNwWQAmABMATPMa3T34ADldyprmM1M2XociUQgLzvwAXT3xABgAEQAaABNwIGFAnADD8AAgAD4BBJWzaCcIAIEBFMAWwKoAAdq9BWAF5wLQpALEtQAKUSGkahR4GnJM+gsAwCgeFAiUAECQ0BQuL8AAIAAAADKeIheclvFqQAAETr4iAMxIARMgAMIoHhQIAn0E0pDQFC4HhznoAAAAIAI2C0/4lvFqQAAETgBJJwYCAy4ABgYAFAA8MBKYEH4eRhTkAjYeFcgACAYAeABsOqyQ5gRwDayqugEgaIIAtgoACgDmEABmBAWGme5OBJJA2m4cDeoAmITWAXwrMgOgAGwBCh6CBXYF1Tzg1wKAAFdiuABRAFwAXQBsAG8AdgBrAHYAbwCEAHEwfxQBVE5TEQADVFhTBwBDANILAqcCzgLTApQCrQL6vAAMAL8APLhNBKkE6glGKTAU4Dr4N2EYEwBCkABKk8rHAbYBmwIoAiU4Ajf/Aq4CowCAANIChzgaNBsCsTgeODcFXrgClQKdAqQBiQGYAqsCsjTsNHsfNPA0ixsAWTWiOAMFPDQSNCk2BDZHNow2TTZUNhk28Jk9VzI3QkEoAoICoQKwAqcAQAAxBV4FXbS9BW47YkIXP1ciUqs05DS/FwABUwJW11e6nHuYZmSh/RAYA8oMKvZ8KASoUAJYWAJ6ILAsAZSoqjpgA0ocBIhmDgDWAAawRDQoAAcuAj5iAHABZiR2AIgiHgCaAU68ACxuHAG0ygM8MiZIAlgBdF4GagJqAPZOHAMuBgoATkYAsABiAHgAMLoGDPj0HpKEBAAOJgAuALggTAHWAeAMEDbd20Uege0ADwAWADkAQgA9OHd+2MUQZBBhBgNNDkxxPxUQArEPqwvqERoM1irQ090ANK4H8ANYB/ADWANYB/AH8ANYB/ADWANYA1gDWBwP8B/YxRBkD00EcgWTBZAE2wiIJk4RhgctCNdUEnQjHEwDSgEBIypJITuYMxAlR0wRTQgIATZHbKx9PQNMMbBU+pCnA9AyVDlxBgMedhKlAC8PeCE1uk6DekxxpQpQT7NX9wBFBgASqwAS5gBJDSgAUCwGPQBI4zTYABNGAE2bAE3KAExdGABKaAbgAFBXAFCOAFBJABI2SWdObALDOq0//QomCZhvwHdTBkIQHCemEPgMNAG2ATwN7kvZBPIGPATKH34ZGg/OlZ0Ipi3eDO4m5C6igFsj9iqEBe5L9TzeC05RaQ9aC2YJ5DpkgU8DIgEOIowK3g06CG4Q9ArKbA3mEUYHOgPWSZsApgcCCxIdNhW2JhFirQsKOXgG/Br3C5AmsBMqev0F1BoiBk4BKhsAANAu6IWxWjJcHU9gBgQLJiPIFKlQIQ0mQLh4SRocBxYlqgKSQ3FKiFE3HpQh9zw+DWcuFFF9B/Y8BhlQC4I8n0asRQ8R0z6OPUkiSkwtBDaALDAnjAnQD4YMunxzAVoJIgmyDHITMhEYN8YIOgcaLpclJxYIIkaWYJsE+KAD9BPSAwwFQAlCBxQDthwuEy8VKgUOgSXYAvQ21i60ApBWgQEYBcwPJh/gEFFH4Q7qCJwCZgOEJewALhUiABginAhEZABgj9lTBi7MCMhqbSN1A2gU6GIRdAeSDlgHqBw0FcAc4nDJXgyGCSiksAlcAXYJmgFgBOQICjVcjKEgQmdUi1kYnCBiQUBd/QIyDGYVoES+h3kCjA9sEhwBNgF0BzoNAgJ4Ee4RbBCWCOyGBTW2M/k6JgRQIYQgEgooA1BszwsoJvoM+WoBpBJjAw00PnfvZ6xgtyUX/gcaMsZBYSHyC5NPzgydGsIYQ1QvGeUHwAP0GvQn60FYBgADpAQUOk4z7wS+C2oIjAlAAEoOpBgH2BhrCnKM0QEyjAG4mgNYkoQCcJAGOAcMAGgMiAV65gAeAqgIpAAGANADWAA6Aq4HngAaAIZCAT4DKDABIuYCkAOUCDLMAZYwAfQqBBzEDBYA+DhuSwLDsgKAa2ajBd5ZAo8CSjYBTiYEBk9IUgOwcuIA3ABMBhTgSAEWrEvMG+REAeBwLADIAPwABjYHBkIBzgH0bgC4AWALMgmjtLYBTuoqAIQAFmwB2AKKAN4ANgCA8gFUAE4FWvoF1AJQSgESMhksWGIBvAMgATQBDgB6BsyOpsoIIARuB9QCEBwV4gLvLwe2AgMi4BPOQsYCvd9WADIXUu5eZwqoCqdeaAC0YTQHMnM9UQAPH6k+yAdy/BZIiQImSwBQ5gBQQzSaNTFWSTYBpwGqKQK38AFtqwBI/wK37gK3rQK3sAK6280C0gK33AK3zxAAUEIAUD9SklKDArekArw5AEQAzAHCO147WTteO1k7XjtZO147WTteO1kDmChYI03AVU0oJqkKbV9GYewMpw3VRMk6ShPcYFJgMxPJLbgUwhXPJVcZPhq9JwYl5VUKDwUt1GYxCC00dhe9AEApaYNCY4ceMQpMHOhTklT5LRwAskujM7ANrRsWREEFSHXuYisWDwojAmSCAmJDXE6wXDchAqH4AmiZAmYKAp+FOBwMAmY8AmYnBG8EgAN/FAN+kzkHOXgYOYM6JCQCbB4CMjc4CwJtyAJtr/CLADRoRiwBaADfAOIASwYHmQyOAP8MwwAOtgJ3MAJ2o0ACeUxEAni7Hl3cRa9G9AJ8QAJ6yQJ9CgJ88UgBSH5kJQAsFklZSlwWGErNAtECAtDNSygDiFADh+dExpEzAvKiXQQDA69Lz0wuJgTQTU1NsAKLQAKK2cIcCB5EaAa4Ao44Ao5dQZiCAo7aAo5deVG1UzYLUtVUhgKT/AKTDQDqAB1VH1WwVdEHLBwplocy4nhnRTw6ApegAu+zWCKpAFomApaQApZ9nQCqWa1aCoJOADwClrYClk9cRVzSApnMApllXMtdCBoCnJw5wzqeApwXAp+cAp65iwAeEDIrEAKd8gKekwC2PmE1YfACntQCoG8BqgKeoCACnk+mY8lkKCYsAiewAiZ/AqD8AqBN2AKmMAKlzwKoAAB+AqfzaH1osgAESmodatICrOQCrK8CrWgCrQMCVx4CVd0CseLYAx9PbJgCsr4OArLpGGzhbWRtSWADJc4Ctl08QG6RAylGArhfArlIFgK5K3hwN3DiAr0aAy2zAzISAr6JcgMDM3ICvhtzI3NQAsPMAsMFc4N0TDZGdOEDPKgDPJsDPcACxX0CxkgCxhGKAshqUgLIRQLJUALJLwJkngLd03h6YniveSZL0QMYpGcDAmH1GfSVJXsMXpNevBICz2wCz20wTFTT9BSgAMeuAs90ASrrA04TfkwGAtwoAtuLAtJQA1JdA1NgAQIDVY2AikABzBfuYUZ2AILPg44C2sgC2d+EEYRKpz0DhqYAMANkD4ZyWvoAVgLfZgLeuXR4AuIw7RUB8zEoAfScAfLTiALr9ALpcXoAAur6AurlAPpIAboC7ooC652Wq5cEAu5AA4XhmHpw4XGiAvMEAGoDjheZlAL3FAORbwOSiAL3mQL52gL4Z5odmqy8OJsfA52EAv77ARwAOp8dn7QDBY4DpmsDptoA0sYDBmuhiaIGCgMMSgFgASACtgNGAJwEgLpoBgC8BGzAEowcggCEDC6kdjoAJAM0C5IKRoABZCgiAIzw3AYBLACkfng9ogigkgNmWAN6AEQCvrkEVqTGAwCsBRbAA+4iQkMCHR072jI2PTbUNsk2RjY5NvA23TZKNiU3EDcZN5I+RTxDRTBCJkK5VBYKFhZfwQCWygU3AJBRHpu+OytgNxa61A40GMsYjsn7BVwFXQVcBV0FaAVdBVwFXQVcBV0FXAVdBVwFXUsaCNyKAK4AAQUHBwKU7oICoW1e7jAEzgPxA+YDwgCkBFDAwADABKzAAOxFLhitA1UFTDeyPkM+bj51QkRCuwTQWWQ8X+0AWBYzsACNA8xwzAGm7EZ/QisoCTAbLDs6fnLfb8H2GccsbgFw13M1HAVkBW/Jxsm9CNRO8E8FDD0FBQw9FkcClOYCoMFegpDfADgcMiA2AJQACB8AsigKAIzIEAJKeBIApY5yPZQIAKQiHb4fvj5BKSRPQrZCOz0oXyxgOywfKAnGbgMClQaCAkILXgdeCD9IIGUgQj5fPoY+dT52Ao5CM0dAX9BTVG9SDzFwWTQAbxBzJF/lOEIQQglCCkKJIAls5AcClQICoKPMODEFxhi6KSAbiyfIRrMjtCgdWCAkPlFBIitCsEJRzAbMAV/OEyQzDg0OAQQEJ36i328/Mk9AybDJsQlq3tDRApUKAkFzXf1d/j9uALYP6hCoFgCTGD8kPsFKQiobrm0+zj0KSD8kPnVCRBwMDyJRTHFgMTJa5rwXQiQ2YfI/JD7BMEJEHGINTw4TOFlIRzwJO0icMQpyPyQ+wzJCRBv6DVgnKB01NgUKj2bwYzMqCoBkznBgEF+zYDIocwRIX+NgHj4HICNfh2C4CwdwFWpTG/lgUhYGAwRfv2Ts8mAaXzVgml/XYIJfuWC4HI1gUF9pYJZgMR6ilQHMAOwLAlDRefC0in4AXAEJA6PjCwc0IamOANMMCAECRQDFNRTZBgd+CwQlRA+r6+gLBDEFBnwUBXgKATIArwAGRAAHA3cDdAN2A3kDdwN9A3oDdQN7A30DfAN4A3oDfQAYEAAlAtYASwMAUAFsAHcKAHcAmgB3AHUAdQB2AHVu8UgAygDAAHcAdQB1AHYAdQALCgB3AAsAmgB3AAsCOwB3AAtu8UgAygDAAHgKAJoAdwB3AHUAdQB2AHUAeAB1AHUAdgB1bvFIAMoAwAALCgCaAHcACwB3AAsCOwB3AAtu8UgAygDAAH4ACwGgALcBpwC6AahdAu0COwLtbvFIAMoAwAALCgCaAu0ACwLtAAsCOwLtAAtu8UgAygDAA24ACwNvAAu0VsQAAzsAABCkjUIpAAsAUIusOggWcgMeBxVsGwL67U/2HlzmWOEeOgALASvuAAseAfpKUpnpGgYJDCIZM6YyARUE9ThqAD5iXQgnAJYJPnOzw0ZAEZxEKsIAkA4DhAHnTAIDxxUDK0lxCQlPYgIvIQVYJQBVqE1GakUAKGYiDToSBA1EtAYAXQJYAIF8GgMHRyAAIAjOe9YncekRAA0KACUrjwE7Ayc6AAYWAqaiKG4McEcqANoN3+Mg9TwCBhIkuCny+JwUQ29L008JluRxu3K+oAdqiHOqFH0AG5SUIfUJ5SxCGfxdipRzqTmT4V5Zb+r1Uo4Vm+NqSSEl2mNvR2JhIa8SpYO6ntdwFXHCWTCK8f2+Hxo7uiG3drDycAuKIMP5bhi06ACnqArH1rz4Rqg//lm6SgJGEVbF9xJHISaR6HxqxSnkw6shDnelHKNEfGUXSJRJ1GcsmtJw25xrZMDK9gXSm1/YMkdX4/6NKYOdtk/NQ3/NnDASjTc3fPjIjW/5sVfVObX2oTDWkr1dF9f3kxBsD3/3aQO8hPfRz+e0uEiJqt1161griu7gz8hDDwtpy+F+BWtefnKHZPAxcZoWbnznhJpy0e842j36bcNzGnIEusgGX0a8ZxsnjcSsPDZ09yZ36fCQbriHeQ72JRMILNl6ePPf2HWoVwgWAm1fb3V2sAY0+B6rAXqSwPBgseVmoqsBTSrm91+XasMYYySI8eeRxH3ZvHkMz3BQ5aJ3iUVbYPNM3/7emRtjlsMgv/9VyTsyt/mK+8fgWeT6SoFaclXqn42dAIsvAarF5vNNWHzKSkKQ/8Hfk5ZWK7r9yliOsooyBjRhfkHP4Q2DkWXQi6FG/9r/IwbmkV5T7JSopHKn1pJwm9tb5Ot0oyN1Z2mPpKXHTxx2nlK08fKk1hEYA8WgVVWL5lgx0iTv+KdojJeU23ZDjmiubXOxVXJKKi2Wjuh2HLZOFLiSC7Tls5SMh4f+Pj6xUSrNjFqLGehRNB8lC0QSLNmkJJx/wSG3MnjE9T1CkPwJI0wH2lfzwETIiVqUxg0dfu5q39Gt+hwdcxkhhNvQ4TyrBceof3Mhs/IxFci1HmHr4FMZgXEEczPiGCx0HRwzAqDq2j9AVm1kwN0mRVLWLylgtoPNapF5cY4Y1wJh/e0BBwZj44YgZrDNqvD/9Hv7GFYdUQeDJuQ3EWI4HaKqavU1XjC/n41kT4L79kqGq0kLhdTZvgP3TA3fS0ozVz+5piZsoOtIvBUFoMKbNcmBL6YxxaUAusHB38XrS8dQMnQwJfUUkpRoGr5AUeWicvBTzyK9g77+yCkf5PAysL7r/JjcZgrbvRpMW9iyaxZvKO6ceZN2EwIxKwVFPuvFuiEPGCoagbMo+SpydLrXqBzNCDGFCrO/rkcwa2xhokQZ5CdZ0AsU3JfSqJ6n5I14YA+P/uAgfhPU84Tlw7cEFfp7AEE8ey4sP12PTt4Cods1GRgDOB5xvyiR5m+Bx8O5nBCNctU8BevfV5A08x6RHd5jcwPTMDSZJOedIZ1cGQ704lxbAzqZOP05ZxaOghzSdvFBHYqomATARyAADK4elP8Ly3IrUZKfWh23Xy20uBUmLS4Pfagu9+oyVa2iPgqRP3F2CTUsvJ7+RYnN8fFZbU/HVvxvcFFDKkiTqV5UBZ3Gz54JAKByi9hkKMZJvuGgcSYXFmw08UyoQyVdfTD1/dMkCHXcTGAKeROgArsvmRrQTLUOXioOHGK2QkjHuoYFgXciZoTJd6Fs5q1QX1G+p/e26hYsEf7QZD1nnIyl/SFkNtYYmmBhpBrxl9WbY0YpHWRuw2Ll/tj9mD8P4snVzJl4F9J+1arVeTb9E5r2ILH04qStjxQNwn3m4YNqxmaNbLAqW2TN6LidwuJRqS+NXbtqxoeDXpxeGWmxzSkWxjkyCkX4NQRme6q5SAcC+M7+9ETfA/EwrzQajKakCwYyeunP6ZFlxU2oMEn1Pz31zeStW74G406ZJFCl1wAXIoUKkWotYEpOuXB1uVNxJ63dpJEqfxBeptwIHNrPz8BllZoIcBoXwgfJ+8VAUnVPvRvexnw0Ma/WiGYuJO5y8QTvEYBigFmhUxY5RqzE8OcywN/8m4UYrlaniJO75XQ6KSo9+tWHlu+hMi0UVdiKQp7NelnoZUzNaIyBPVeOwK6GNp+FfHuPOoyhaWuNvTYFkvxscMQWDh+zeFCFkgwbXftiV23ywJ4+uwRqmg9k3KzwIQpzppt8DBBOMbrqwQM5Gb05sEwdKzMiAqOloaA/lr0KA+1pr0/+HiWoiIjHA/wir2nIuS3PeU/ji3O6ZwoxcR1SZ9FhtLC5S0FIzFhbBWcGVP/KpxOPSiUoAdWUpqKH++6Scz507iCcxYI6rdMBICPJZea7OcmeFw5mObJSiqpjg2UoWNIs+cFhyDSt6geV5qgi3FunmwwDoGSMgerFOZGX1m0dMCYo5XOruxO063dwENK9DbnVM9wYFREzh4vyU1WYYJ/LRRp6oxgjqP/X5a8/4Af6p6NWkQferzBmXme0zY/4nwMJm/wd1tIqSwGz+E3xPEAOoZlJit3XddD7/BT1pllzOx+8bmQtANQ/S6fZexc6qi3W+Q2xcmXTUhuS5mpHQRvcxZUN0S5+PL9lXWUAaRZhEH8hTdAcuNMMCuVNKTEGtSUKNi3O6KhSaTzck8csZ2vWRZ+d7mW8c4IKwXIYd25S/zIftPkwPzufjEvOHWVD1m+FjpDVUTV0DGDuHj6QnaEwLu/dEgdLQOg9E1Sro9XHJ8ykLAwtPu+pxqKDuFexqON1sKQm7rwbE1E68UCfA/erovrTCG+DBSNg0l4goDQvZN6uNlbyLpcZAwj2UclycvLpIZMgv4yRlpb3YuMftozorbcGVHt/VeDV3+Fdf1TP0iuaCsPi2G4XeGhsyF1ubVDxkoJhmniQ0/jSg/eYML9KLfnCFgISWkp91eauR3IQvED0nAPXK+6hPCYs+n3+hCZbiskmVMG2da+0EsZPonUeIY8EbfusQXjsK/eFDaosbPjEfQS0RKG7yj5GG69M7MeO1HmiUYocgygJHL6M1qzUDDwUSmr99V7Sdr2F3JjQAJY+F0yH33Iv3+C9M38eML7gTgmNu/r2bUMiPvpYbZ6v1/IaESirBHNa7mPKn4dEmYg7v/+HQgPN1G79jBQ1+soydfDC2r+h2Bl/KIc5KjMK7OH6nb1jLsNf0EHVe2KBiE51ox636uyG6Lho0t3J34L5QY/ilE3mikaF4HKXG1mG1rCevT1Vv6GavltxoQe/bMrpZvRggnBxSEPEeEzkEdOxTnPXHVjUYdw8JYvjB/o7Eegc3Ma+NUxLLnsK0kJlinPmUHzHGtrk5+CAbVzFOBqpyy3QVUnzTDfC/0XD94/okH+OB+i7g9lolhWIjSnfIb+Eq43ZXOWmwvjyV/qqD+t0e+7mTEM74qP/Ozt8nmC7mRpyu63OB4KnUzFc074SqoyPUAgM+/TJGFo6T44EHnQU4X4z6qannVqgw/U7zCpwcmXV1AubIrvOmkKHazJAR55ePjp5tLBsN8vAqs3NAHdcEHOR2xQ0lsNAFzSUuxFQCFYvXLZJdOj9p4fNq6p0HBGUik2YzaI4xySy91KzhQ0+q1hjxvImRwPRf76tChlRkhRCi74NXZ9qUNeIwP+s5p+3m5nwPdNOHgSLD79n7O9m1n1uDHiMntq4nkYwV5OZ1ENbXxFd4PgrlvavZsyUO4MqYlqqn1O8W/I1dEZq5dXhrbETLaZIbC2Kj/Aa/QM+fqUOHdf0tXAQ1huZ3cmWECWSXy/43j35+Mvq9xws7JKseriZ1pEWKc8qlzNrGPUGcVgOa9cPJYIJsGnJTAUsEcDOEVULO5x0rXBijc1lgXEzQQKhROf8zIV82w8eswc78YX11KYLWQRcgHNJElBxfXr72lS2RBSl07qTKorO2uUDZr3sFhYsvnhLZn0A94KRzJ/7DEGIAhW5ZWFpL8gEwu1aLA9MuWZzNwl8Oze9Y+bX+v9gywRVnoB5I/8kXTXU3141yRLYrIOOz6SOnyHNy4SieqzkBXharjfjqq1q6tklaEbA8Qfm2DaIPs7OTq/nvJBjKfO2H9bH2cCMh1+5gspfycu8f/cuuRmtDjyqZ7uCIMyjdV3a+p3fqmXsRx4C8lujezIFHnQiVTXLXuI1XrwN3+siYYj2HHTvESUx8DlOTXpak9qFRK+L3mgJ1WsD7F4cu1aJoFoYQnu+wGDMOjJM3kiBQWHCcvhJ/HRdxodOQp45YZaOTA22Nb4XKCVxqkbwMYFhzYQYIAnCW8FW14uf98jhUG2zrKhQQ0q0CEq0t5nXyvUyvR8DvD69LU+g3i+HFWQMQ8PqZuHD+sNKAV0+M6EJC0szq7rEr7B5bQ8BcNHzvDMc9eqB5ZCQdTf80Obn4uzjwpYU7SISdtV0QGa9D3Wrh2BDQtpBKxaNFV+/Cy2P/Sv+8s7Ud0Fd74X4+o/TNztWgETUapy+majNQ68Lq3ee0ZO48VEbTZYiH1Co4OlfWef82RWeyUXo7woM03PyapGfikTnQinoNq5z5veLpeMV3HCAMTaZmA1oGLAn7XS3XYsz+XK7VMQsc4XKrmDXOLU/pSXVNUq8dIqTba///3x6LiLS6xs1xuCAYSfcQ3+rQgmu7uvf3THKt5Ooo97TqcbRqxx7EASizaQCBQllG/rYxVapMLgtLbZS64w1MDBMXX+PQpBKNwqUKOf2DDRDUXQf9EhOS0Qj4nTmlA8dzSLz/G1d+Ud8MTy/6ghhdiLpeerGY/UlDOfiuqFsMUU5/UYlP+BAmgRLuNpvrUaLlVkrqDievNVEAwF+4CoM1MZTmjxjJMsKJq+u8Zd7tNCUFy6LiyYXRJQ4VyvEQFFaCGKsxIwQkk7EzZ6LTJq2hUuPhvAW+gQnSG6J+MszC+7QCRHcnqDdyNRJ6T9xyS87A6MDutbzKGvGktpbXqtzWtXb9HsfK2cBMomjN9a4y+TaJLnXxAeX/HWzmf4cR4vALt/P4w4qgKY04ml4ZdLOinFYS6cup3G/1ie4+t1eOnpBNlqGqs75ilzkT4+DsZQxNvaSKJ//6zIbbk/M7LOhFmRc/1R+kBtz7JFGdZm/COotIdvQoXpTqP/1uqEUmCb/QWoGLMwO5ANcHzxdY48IGP5+J+zKOTBFZ4Pid+GTM+Wq12MV/H86xEJptBa6T+p3kgpwLedManBHC2GgNrFpoN2xnrMz9WFWX/8/ygSBkavq2Uv7FdCsLEYLu9LLIvAU0bNRDtzYl+/vXmjpIvuJFYjmI0im6QEYqnIeMsNjXG4vIutIGHijeAG/9EDBozKV5cldkHbLxHh25vT+ZEzbhXlqvpzKJwcEgfNwLAKFeo0/pvEE10XDB+EXRTXtSzJozQKFFAJhMxYkVaCW+E9AL7tMeU8acxidHqzb6lX4691UsDpy/LLRmT+epgW56+5Cw8tB4kMUv6s9lh3eRKbyGs+H/4mQMaYzPTf2OOdokEn+zzgvoD3FqNKk8QqGAXVsqcGdXrT62fSPkR2vROFi68A6se86UxRUk4cajfPyCC4G5wDhD+zNq4jodQ4u4n/m37Lr36n4LIAAsVr02dFi9AiwA81MYs2rm4eDlDNmdMRvEKRHfBwW5DdMNp0jPFZMeARqF/wL4XBfd+EMLBfMzpH5GH6NaW+1vrvMdg+VxDzatk3MXgO3ro3P/DpcC6+Mo4MySJhKJhSR01SGGGp5hPWmrrUgrv3lDnP+HhcI3nt3YqBoVAVTBAQT5iuhTg8nvPtd8ZeYj6w1x6RqGUBrSku7+N1+BaasZvjTk64RoIDlL8brpEcJx3OmY7jLoZsswdtmhfC/G21llXhITOwmvRDDeTTPbyASOa16cF5/A1fZAidJpqju3wYAy9avPR1ya6eNp9K8XYrrtuxlqi+bDKwlfrYdR0RRiKRVTLOH85+ZY7XSmzRpfZBJjaTa81VDcJHpZnZnSQLASGYW9l51ZV/h7eVzTi3Hv6hUsgc/51AqJRTkpbFVLXXszoBL8nBX0u/0jBLT8nH+fJePbrwURT58OY+UieRjd1vs04w0VG5VN2U6MoGZkQzKN/ptz0Q366dxoTGmj7i1NQGHi9GgnquXFYdrCfZBmeb7s0T6yrdlZH5cZuwHFyIJ/kAtGsTg0xH5taAAq44BAk1CPk9KVVbqQzrCUiFdF/6gtlPQ8bHHc1G1W92MXGZ5HEHftyLYs8mbD/9xYRUWkHmlM0zC2ilJlnNgV4bfALpQghxOUoZL7VTqtCHIaQSXm+YUMnpkXybnV+A6xlm2CVy8fn0Xlm2XRa0+zzOa21JWWmixfiPMSCZ7qA4rS93VN3pkpF1s5TonQjisHf7iU9ZGvUPOAKZcR1pbeVf/Ul7OhepGCaId9wOtqo7pJ7yLcBZ0pFkOF28y4zEI/kcUNmutBHaQpBdNM8vjCS6HZRokkeo88TBAjGyG7SR+6vUgTcyK9Imalj0kuxz0wmK+byQU11AiJFk/ya5dNduRClcnU64yGu/ieWSeOos1t3ep+RPIWQ2pyTYVbZltTbsb7NiwSi3AV+8KLWk7LxCnfZUetEM8ThnsSoGH38/nyAwFguJp8FjvlHtcWZuU4hPva0rHfr0UhOOJ/F6vS62FW7KzkmRll2HEc7oUq4fyi5T70Vl7YVIfsPHUCdHesf9Lk7WNVWO75JDkYbMI8TOW8JKVtLY9d6UJRITO8oKo0xS+o99Yy04iniGHAaGj88kEWgwv0OrHdY/nr76DOGNS59hXCGXzTKUvDl9iKpLSWYN1lxIeyywdNpTkhay74w2jFT6NS8qkjo5CxA1yfSYwp6AJIZNKIeEK5PJAW7ORgWgwp0VgzYpqovMrWxbu+DGZ6Lhie1RAqpzm8VUzKJOH3mCzWuTOLsN3VT/dv2eeYe9UjbR8YTBsLz7q60VN1sU51k+um1f8JxD5pPhbhSC8rRaB454tmh6YUWrJI3+GWY0qeWioj/tbkYITOkJaeuGt4JrJvHA+l0Gu7kY7XOaa05alMnRWVCXqFgLIwSY4uF59Ue5SU4QKuc/HamDxbr0x6csCetXGoP7Qn1Bk/J9DsynO/UD6iZ1Hyrz+jit0hDCwi/E9OjgKTbB3ZQKQ/0ZOvevfNHG0NK4Aj3Cp7NpRk07RT1i/S0EL93Ag8GRgKI9CfpajKyK6+Jj/PI1KO5/85VAwz2AwzP8FTBb075IxCXv6T9RVvWT2tUaqxDS92zrGUbWzUYk9mSs82pECH+fkqsDt93VW++4YsR/dHCYcQSYTO/KaBMDj9LSD/J/+z20Kq8XvZUAIHtm9hRPP3ItbuAu2Hm5lkPs92pd7kCxgRs0xOVBnZ13ccdA0aunrwv9SdqElJRC3g+oCu+nXyCgmXUs9yMjTMAIHfxZV+aPKcZeUBWt057Xo85Ks1Ir5gzEHCWqZEhrLZMuF11ziGtFQUds/EESajhagzcKsxamcSZxGth4UII+adPhQkUnx2WyN+4YWR+r3f8MnkyGFuR4zjzxJS8WsQYR5PTyRaD9ixa6Mh741nBHbzfjXHskGDq179xaRNrCIB1z1xRfWfjqw2pHc1zk9xlPpL8sQWAIuETZZhbnmL54rceXVNRvUiKrrqIkeogsl0XXb17ylNb0f4GA9Wd44vffEG8FSZGHEL2fbaTGRcSiCeA8PmA/f6Hz8HCS76fXUHwgwkzSwlI71ekZ7Fapmlk/KC+Hs8hUcw3N2LN5LhkVYyizYFl/uPeVP5lsoJHhhfWvvSWruCUW1ZcJOeuTbrDgywJ/qG07gZJplnTvLcYdNaH0KMYOYMGX+rB4NGPFmQsNaIwlWrfCezxre8zXBrsMT+edVLbLqN1BqB76JH4BvZTqUIMfGwPGEn+EnmTV86fPBaYbFL3DFEhjB45CewkXEAtJxk4/Ms2pPXnaRqdky0HOYdcUcE2zcXq4vaIvW2/v0nHFJH2XXe22ueDmq/18XGtELSq85j9X8q0tcNSSKJIX8FTuJF/Pf8j5PhqG2u+osvsLxYrvvfeVJL+4tkcXcr9JV7v0ERmj/X6fM3NC4j6dS1+9Umr2oPavqiAydTZPLMNRGY23LO9zAVDly7jD+70G5TPPLdhRIl4WxcYjLnM+SNcJ26FOrkrISUtPObIz5Zb3AG612krnpy15RMW+1cQjlnWFI6538qky9axd2oJmHIHP08KyP0ubGO+TQNOYuv2uh17yCIvR8VcStw7o1g0NM60sk+8Tq7YfIBJrtp53GkvzXH7OA0p8/n/u1satf/VJhtR1l8Wa6Gmaug7haSpaCaYQax6ta0mkutlb+eAOSG1aobM81D9A4iS1RRlzBBoVX6tU1S6WE2N9ORY6DfeLRC4l9Rvr5h95XDWB2mR1d4WFudpsgVYwiTwT31ljskD8ZyDOlm5DkGh9N/UB/0AI5Xvb8ZBmai2hQ4BWMqFwYnzxwB26YHSOv9WgY3JXnvoN+2R4rqGVh/LLDMtpFP+SpMGJNWvbIl5SOodbCczW2RKleksPoUeGEzrjtKHVdtZA+kfqO+rVx/iclCqwoopepvJpSTDjT+b9GWylGRF8EDbGlw6eUzmJM95Ovoz+kwLX3c2fTjFeYEsE7vUZm3mqdGJuKh2w9/QGSaqRHs99aScGOdDqkFcACoqdbBoQqqjamhH6Q9ng39JCg3lrGJwd50Qk9ovnqBTr8MME7Ps2wiVfygUmPoUBJJfJWX5Nda0nuncbFkA=="));
}
const kr$1 = r0();
new Set(Ur(kr$1)), new Set(Ur(kr$1)), Xs$1(kr$1), e0(kr$1);
const i0 = new Uint8Array(32);
i0.fill(0);
const n0 = `Ethereum Signed Message:
`;
function uf(e) {
  return typeof e == "string" && (e = Bi$1(e)), Si(Cs$1([Bi$1(n0), Bi$1(String(e.length)), e]));
}
const o0 = "address/5.7.0", yr$1 = new z$3(o0);
function hf(e) {
  Jt$1(e, 20) || yr$1.throwArgumentError("invalid address", "address", e), e = e.toLowerCase();
  const t = e.substring(2).split(""), r2 = new Uint8Array(40);
  for (let n2 = 0; n2 < 40; n2++) r2[n2] = t[n2].charCodeAt(0);
  const i2 = Ot$1(Si(r2));
  for (let n2 = 0; n2 < 40; n2 += 2) i2[n2 >> 1] >> 4 >= 8 && (t[n2] = t[n2].toUpperCase()), (i2[n2 >> 1] & 15) >= 8 && (t[n2 + 1] = t[n2 + 1].toUpperCase());
  return "0x" + t.join("");
}
const s0 = 9007199254740991;
function a0(e) {
  return Math.log10 ? Math.log10(e) : Math.log(e) / Math.LN10;
}
const Ri = {};
for (let e = 0; e < 10; e++) Ri[String(e)] = String(e);
for (let e = 0; e < 26; e++) Ri[String.fromCharCode(65 + e)] = String(10 + e);
const cf = Math.floor(a0(s0));
function u0(e) {
  e = e.toUpperCase(), e = e.substring(4) + e.substring(0, 2) + "00";
  let t = e.split("").map((i2) => Ri[i2]).join("");
  for (; t.length >= cf; ) {
    let i2 = t.substring(0, cf);
    t = parseInt(i2, 10) % 97 + t.substring(i2.length);
  }
  let r2 = String(98 - parseInt(t, 10) % 97);
  for (; r2.length < 2; ) r2 = "0" + r2;
  return r2;
}
function h0(e) {
  let t = null;
  if (typeof e != "string" && yr$1.throwArgumentError("invalid address", "address", e), e.match(/^(0x)?[0-9a-fA-F]{40}$/)) e.substring(0, 2) !== "0x" && (e = "0x" + e), t = hf(e), e.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && t !== e && yr$1.throwArgumentError("bad address checksum", "address", e);
  else if (e.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    for (e.substring(2, 4) !== u0(e) && yr$1.throwArgumentError("bad icap checksum", "address", e), t = Us$1(e.substring(4)); t.length < 40; ) t = "0" + t;
    t = hf("0x" + t);
  } else yr$1.throwArgumentError("invalid address", "address", e);
  return t;
}
function wr$1(e, t, r2) {
  Object.defineProperty(e, t, { enumerable: true, value: r2, writable: false });
}
const l0 = new Uint8Array(32);
l0.fill(0), V$1.from(-1);
const d0 = V$1.from(0), p0 = V$1.from(1);
V$1.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), oe$2(p0.toHexString(), 32), oe$2(d0.toHexString(), 32);
var se = {}, Q$2 = {}, xr$1 = lf;
function lf(e, t) {
  if (!e) throw new Error(t || "Assertion failed");
}
lf.equal = function(t, r2, i2) {
  if (t != r2) throw new Error(i2 || "Assertion failed: " + t + " != " + r2);
};
var Oi = { exports: {} };
typeof Object.create == "function" ? Oi.exports = function(t, r2) {
  r2 && (t.super_ = r2, t.prototype = Object.create(r2.prototype, { constructor: { value: t, enumerable: false, writable: true, configurable: true } }));
} : Oi.exports = function(t, r2) {
  if (r2) {
    t.super_ = r2;
    var i2 = function() {
    };
    i2.prototype = r2.prototype, t.prototype = new i2(), t.prototype.constructor = t;
  }
};
var v0 = xr$1, g0 = Oi.exports;
Q$2.inherits = g0;
function m0(e, t) {
  return (e.charCodeAt(t) & 64512) !== 55296 || t < 0 || t + 1 >= e.length ? false : (e.charCodeAt(t + 1) & 64512) === 56320;
}
function A0(e, t) {
  if (Array.isArray(e)) return e.slice();
  if (!e) return [];
  var r2 = [];
  if (typeof e == "string") if (t) {
    if (t === "hex") for (e = e.replace(/[^a-z0-9]+/ig, ""), e.length % 2 !== 0 && (e = "0" + e), n2 = 0; n2 < e.length; n2 += 2) r2.push(parseInt(e[n2] + e[n2 + 1], 16));
  } else for (var i2 = 0, n2 = 0; n2 < e.length; n2++) {
    var o2 = e.charCodeAt(n2);
    o2 < 128 ? r2[i2++] = o2 : o2 < 2048 ? (r2[i2++] = o2 >> 6 | 192, r2[i2++] = o2 & 63 | 128) : m0(e, n2) ? (o2 = 65536 + ((o2 & 1023) << 10) + (e.charCodeAt(++n2) & 1023), r2[i2++] = o2 >> 18 | 240, r2[i2++] = o2 >> 12 & 63 | 128, r2[i2++] = o2 >> 6 & 63 | 128, r2[i2++] = o2 & 63 | 128) : (r2[i2++] = o2 >> 12 | 224, r2[i2++] = o2 >> 6 & 63 | 128, r2[i2++] = o2 & 63 | 128);
  }
  else for (n2 = 0; n2 < e.length; n2++) r2[n2] = e[n2] | 0;
  return r2;
}
Q$2.toArray = A0;
function b0(e) {
  for (var t = "", r2 = 0; r2 < e.length; r2++) t += pf(e[r2].toString(16));
  return t;
}
Q$2.toHex = b0;
function df(e) {
  var t = e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (e & 255) << 24;
  return t >>> 0;
}
Q$2.htonl = df;
function y0(e, t) {
  for (var r2 = "", i2 = 0; i2 < e.length; i2++) {
    var n2 = e[i2];
    t === "little" && (n2 = df(n2)), r2 += vf(n2.toString(16));
  }
  return r2;
}
Q$2.toHex32 = y0;
function pf(e) {
  return e.length === 1 ? "0" + e : e;
}
Q$2.zero2 = pf;
function vf(e) {
  return e.length === 7 ? "0" + e : e.length === 6 ? "00" + e : e.length === 5 ? "000" + e : e.length === 4 ? "0000" + e : e.length === 3 ? "00000" + e : e.length === 2 ? "000000" + e : e.length === 1 ? "0000000" + e : e;
}
Q$2.zero8 = vf;
function w0(e, t, r2, i2) {
  var n2 = r2 - t;
  v0(n2 % 4 === 0);
  for (var o2 = new Array(n2 / 4), h3 = 0, p3 = t; h3 < o2.length; h3++, p3 += 4) {
    var A2;
    i2 === "big" ? A2 = e[p3] << 24 | e[p3 + 1] << 16 | e[p3 + 2] << 8 | e[p3 + 3] : A2 = e[p3 + 3] << 24 | e[p3 + 2] << 16 | e[p3 + 1] << 8 | e[p3], o2[h3] = A2 >>> 0;
  }
  return o2;
}
Q$2.join32 = w0;
function x0(e, t) {
  for (var r2 = new Array(e.length * 4), i2 = 0, n2 = 0; i2 < e.length; i2++, n2 += 4) {
    var o2 = e[i2];
    t === "big" ? (r2[n2] = o2 >>> 24, r2[n2 + 1] = o2 >>> 16 & 255, r2[n2 + 2] = o2 >>> 8 & 255, r2[n2 + 3] = o2 & 255) : (r2[n2 + 3] = o2 >>> 24, r2[n2 + 2] = o2 >>> 16 & 255, r2[n2 + 1] = o2 >>> 8 & 255, r2[n2] = o2 & 255);
  }
  return r2;
}
Q$2.split32 = x0;
function M0(e, t) {
  return e >>> t | e << 32 - t;
}
Q$2.rotr32 = M0;
function E0(e, t) {
  return e << t | e >>> 32 - t;
}
Q$2.rotl32 = E0;
function S0(e, t) {
  return e + t >>> 0;
}
Q$2.sum32 = S0;
function N0(e, t, r2) {
  return e + t + r2 >>> 0;
}
Q$2.sum32_3 = N0;
function I0(e, t, r2, i2) {
  return e + t + r2 + i2 >>> 0;
}
Q$2.sum32_4 = I0;
function _0(e, t, r2, i2, n2) {
  return e + t + r2 + i2 + n2 >>> 0;
}
Q$2.sum32_5 = _0;
function B0(e, t, r2, i2) {
  var n2 = e[t], o2 = e[t + 1], h3 = i2 + o2 >>> 0, p3 = (h3 < i2 ? 1 : 0) + r2 + n2;
  e[t] = p3 >>> 0, e[t + 1] = h3;
}
Q$2.sum64 = B0;
function C0(e, t, r2, i2) {
  var n2 = t + i2 >>> 0, o2 = (n2 < t ? 1 : 0) + e + r2;
  return o2 >>> 0;
}
Q$2.sum64_hi = C0;
function R0(e, t, r2, i2) {
  var n2 = t + i2;
  return n2 >>> 0;
}
Q$2.sum64_lo = R0;
function O0(e, t, r2, i2, n2, o2, h3, p3) {
  var A2 = 0, v3 = t;
  v3 = v3 + i2 >>> 0, A2 += v3 < t ? 1 : 0, v3 = v3 + o2 >>> 0, A2 += v3 < o2 ? 1 : 0, v3 = v3 + p3 >>> 0, A2 += v3 < p3 ? 1 : 0;
  var w2 = e + r2 + n2 + h3 + A2;
  return w2 >>> 0;
}
Q$2.sum64_4_hi = O0;
function P0(e, t, r2, i2, n2, o2, h3, p3) {
  var A2 = t + i2 + o2 + p3;
  return A2 >>> 0;
}
Q$2.sum64_4_lo = P0;
function D0(e, t, r2, i2, n2, o2, h3, p3, A2, v3) {
  var w2 = 0, y3 = t;
  y3 = y3 + i2 >>> 0, w2 += y3 < t ? 1 : 0, y3 = y3 + o2 >>> 0, w2 += y3 < o2 ? 1 : 0, y3 = y3 + p3 >>> 0, w2 += y3 < p3 ? 1 : 0, y3 = y3 + v3 >>> 0, w2 += y3 < v3 ? 1 : 0;
  var S4 = e + r2 + n2 + h3 + A2 + w2;
  return S4 >>> 0;
}
Q$2.sum64_5_hi = D0;
function F0(e, t, r2, i2, n2, o2, h3, p3, A2, v3) {
  var w2 = t + i2 + o2 + p3 + v3;
  return w2 >>> 0;
}
Q$2.sum64_5_lo = F0;
function T0(e, t, r2) {
  var i2 = t << 32 - r2 | e >>> r2;
  return i2 >>> 0;
}
Q$2.rotr64_hi = T0;
function U0(e, t, r2) {
  var i2 = e << 32 - r2 | t >>> r2;
  return i2 >>> 0;
}
Q$2.rotr64_lo = U0;
function k0(e, t, r2) {
  return e >>> r2;
}
Q$2.shr64_hi = k0;
function q0(e, t, r2) {
  var i2 = e << 32 - r2 | t >>> r2;
  return i2 >>> 0;
}
Q$2.shr64_lo = q0;
var or$1 = {}, gf = Q$2, K0 = xr$1;
function qr$1() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
or$1.BlockHash = qr$1, qr$1.prototype.update = function(t, r2) {
  if (t = gf.toArray(t, r2), this.pending ? this.pending = this.pending.concat(t) : this.pending = t, this.pendingTotal += t.length, this.pending.length >= this._delta8) {
    t = this.pending;
    var i2 = t.length % this._delta8;
    this.pending = t.slice(t.length - i2, t.length), this.pending.length === 0 && (this.pending = null), t = gf.join32(t, 0, t.length - i2, this.endian);
    for (var n2 = 0; n2 < t.length; n2 += this._delta32) this._update(t, n2, n2 + this._delta32);
  }
  return this;
}, qr$1.prototype.digest = function(t) {
  return this.update(this._pad()), K0(this.pending === null), this._digest(t);
}, qr$1.prototype._pad = function() {
  var t = this.pendingTotal, r2 = this._delta8, i2 = r2 - (t + this.padLength) % r2, n2 = new Array(i2 + this.padLength);
  n2[0] = 128;
  for (var o2 = 1; o2 < i2; o2++) n2[o2] = 0;
  if (t <<= 3, this.endian === "big") {
    for (var h3 = 8; h3 < this.padLength; h3++) n2[o2++] = 0;
    n2[o2++] = 0, n2[o2++] = 0, n2[o2++] = 0, n2[o2++] = 0, n2[o2++] = t >>> 24 & 255, n2[o2++] = t >>> 16 & 255, n2[o2++] = t >>> 8 & 255, n2[o2++] = t & 255;
  } else for (n2[o2++] = t & 255, n2[o2++] = t >>> 8 & 255, n2[o2++] = t >>> 16 & 255, n2[o2++] = t >>> 24 & 255, n2[o2++] = 0, n2[o2++] = 0, n2[o2++] = 0, n2[o2++] = 0, h3 = 8; h3 < this.padLength; h3++) n2[o2++] = 0;
  return n2;
};
var sr$1 = {}, ae$2 = {}, H0 = Q$2, ue = H0.rotr32;
function L0(e, t, r2, i2) {
  if (e === 0) return mf(t, r2, i2);
  if (e === 1 || e === 3) return bf(t, r2, i2);
  if (e === 2) return Af(t, r2, i2);
}
ae$2.ft_1 = L0;
function mf(e, t, r2) {
  return e & t ^ ~e & r2;
}
ae$2.ch32 = mf;
function Af(e, t, r2) {
  return e & t ^ e & r2 ^ t & r2;
}
ae$2.maj32 = Af;
function bf(e, t, r2) {
  return e ^ t ^ r2;
}
ae$2.p32 = bf;
function z0(e) {
  return ue(e, 2) ^ ue(e, 13) ^ ue(e, 22);
}
ae$2.s0_256 = z0;
function j0(e) {
  return ue(e, 6) ^ ue(e, 11) ^ ue(e, 25);
}
ae$2.s1_256 = j0;
function Q0(e) {
  return ue(e, 7) ^ ue(e, 18) ^ e >>> 3;
}
ae$2.g0_256 = Q0;
function J0(e) {
  return ue(e, 17) ^ ue(e, 19) ^ e >>> 10;
}
ae$2.g1_256 = J0;
var ar$1 = Q$2, G0 = or$1, Y0 = ae$2, Pi = ar$1.rotl32, Mr$1 = ar$1.sum32, V0 = ar$1.sum32_5, W0 = Y0.ft_1, yf = G0.BlockHash, X0 = [1518500249, 1859775393, 2400959708, 3395469782];
function he() {
  if (!(this instanceof he)) return new he();
  yf.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80);
}
ar$1.inherits(he, yf);
var Z0 = he;
he.blockSize = 512, he.outSize = 160, he.hmacStrength = 80, he.padLength = 64, he.prototype._update = function(t, r2) {
  for (var i2 = this.W, n2 = 0; n2 < 16; n2++) i2[n2] = t[r2 + n2];
  for (; n2 < i2.length; n2++) i2[n2] = Pi(i2[n2 - 3] ^ i2[n2 - 8] ^ i2[n2 - 14] ^ i2[n2 - 16], 1);
  var o2 = this.h[0], h3 = this.h[1], p3 = this.h[2], A2 = this.h[3], v3 = this.h[4];
  for (n2 = 0; n2 < i2.length; n2++) {
    var w2 = ~~(n2 / 20), y3 = V0(Pi(o2, 5), W0(w2, h3, p3, A2), v3, i2[n2], X0[w2]);
    v3 = A2, A2 = p3, p3 = Pi(h3, 30), h3 = o2, o2 = y3;
  }
  this.h[0] = Mr$1(this.h[0], o2), this.h[1] = Mr$1(this.h[1], h3), this.h[2] = Mr$1(this.h[2], p3), this.h[3] = Mr$1(this.h[3], A2), this.h[4] = Mr$1(this.h[4], v3);
}, he.prototype._digest = function(t) {
  return t === "hex" ? ar$1.toHex32(this.h, "big") : ar$1.split32(this.h, "big");
};
var ur$1 = Q$2, $0 = or$1, hr$1 = ae$2, ta = xr$1, ie = ur$1.sum32, ea = ur$1.sum32_4, ra = ur$1.sum32_5, ia = hr$1.ch32, na = hr$1.maj32, fa = hr$1.s0_256, oa = hr$1.s1_256, sa = hr$1.g0_256, aa = hr$1.g1_256, wf = $0.BlockHash, ua = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
function ce() {
  if (!(this instanceof ce)) return new ce();
  wf.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = ua, this.W = new Array(64);
}
ur$1.inherits(ce, wf);
var xf = ce;
ce.blockSize = 512, ce.outSize = 256, ce.hmacStrength = 192, ce.padLength = 64, ce.prototype._update = function(t, r2) {
  for (var i2 = this.W, n2 = 0; n2 < 16; n2++) i2[n2] = t[r2 + n2];
  for (; n2 < i2.length; n2++) i2[n2] = ea(aa(i2[n2 - 2]), i2[n2 - 7], sa(i2[n2 - 15]), i2[n2 - 16]);
  var o2 = this.h[0], h3 = this.h[1], p3 = this.h[2], A2 = this.h[3], v3 = this.h[4], w2 = this.h[5], y3 = this.h[6], S4 = this.h[7];
  for (ta(this.k.length === i2.length), n2 = 0; n2 < i2.length; n2++) {
    var I2 = ra(S4, oa(v3), ia(v3, w2, y3), this.k[n2], i2[n2]), N2 = ie(fa(o2), na(o2, h3, p3));
    S4 = y3, y3 = w2, w2 = v3, v3 = ie(A2, I2), A2 = p3, p3 = h3, h3 = o2, o2 = ie(I2, N2);
  }
  this.h[0] = ie(this.h[0], o2), this.h[1] = ie(this.h[1], h3), this.h[2] = ie(this.h[2], p3), this.h[3] = ie(this.h[3], A2), this.h[4] = ie(this.h[4], v3), this.h[5] = ie(this.h[5], w2), this.h[6] = ie(this.h[6], y3), this.h[7] = ie(this.h[7], S4);
}, ce.prototype._digest = function(t) {
  return t === "hex" ? ur$1.toHex32(this.h, "big") : ur$1.split32(this.h, "big");
};
var Di$1 = Q$2, Mf = xf;
function ye$1() {
  if (!(this instanceof ye$1)) return new ye$1();
  Mf.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
}
Di$1.inherits(ye$1, Mf);
var ha = ye$1;
ye$1.blockSize = 512, ye$1.outSize = 224, ye$1.hmacStrength = 192, ye$1.padLength = 64, ye$1.prototype._digest = function(t) {
  return t === "hex" ? Di$1.toHex32(this.h.slice(0, 7), "big") : Di$1.split32(this.h.slice(0, 7), "big");
};
var jt$1 = Q$2, ca = or$1, la = xr$1, le = jt$1.rotr64_hi, de = jt$1.rotr64_lo, Ef = jt$1.shr64_hi, Sf = jt$1.shr64_lo, Be = jt$1.sum64, Fi$1 = jt$1.sum64_hi, Ti = jt$1.sum64_lo, da = jt$1.sum64_4_hi, pa = jt$1.sum64_4_lo, va = jt$1.sum64_5_hi, ga = jt$1.sum64_5_lo, Nf = ca.BlockHash, ma = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
function ne$1() {
  if (!(this instanceof ne$1)) return new ne$1();
  Nf.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = ma, this.W = new Array(160);
}
jt$1.inherits(ne$1, Nf);
var If = ne$1;
ne$1.blockSize = 1024, ne$1.outSize = 512, ne$1.hmacStrength = 192, ne$1.padLength = 128, ne$1.prototype._prepareBlock = function(t, r2) {
  for (var i2 = this.W, n2 = 0; n2 < 32; n2++) i2[n2] = t[r2 + n2];
  for (; n2 < i2.length; n2 += 2) {
    var o2 = _a(i2[n2 - 4], i2[n2 - 3]), h3 = Ba(i2[n2 - 4], i2[n2 - 3]), p3 = i2[n2 - 14], A2 = i2[n2 - 13], v3 = Na$1(i2[n2 - 30], i2[n2 - 29]), w2 = Ia(i2[n2 - 30], i2[n2 - 29]), y3 = i2[n2 - 32], S4 = i2[n2 - 31];
    i2[n2] = da(o2, h3, p3, A2, v3, w2, y3, S4), i2[n2 + 1] = pa(o2, h3, p3, A2, v3, w2, y3, S4);
  }
}, ne$1.prototype._update = function(t, r2) {
  this._prepareBlock(t, r2);
  var i2 = this.W, n2 = this.h[0], o2 = this.h[1], h3 = this.h[2], p3 = this.h[3], A2 = this.h[4], v3 = this.h[5], w2 = this.h[6], y3 = this.h[7], S4 = this.h[8], I2 = this.h[9], N2 = this.h[10], C3 = this.h[11], F2 = this.h[12], U2 = this.h[13], J = this.h[14], Bt2 = this.h[15];
  la(this.k.length === i2.length);
  for (var G = 0; G < i2.length; G += 2) {
    var H = J, L3 = Bt2, Pt2 = Ea(S4, I2), W = Sa$1(S4, I2), Rt2 = Aa(S4, I2, N2, C3, F2), Vt2 = ba$1(S4, I2, N2, C3, F2, U2), Y = this.k[G], Wt2 = this.k[G + 1], b2 = i2[G], f3 = i2[G + 1], a3 = va(H, L3, Pt2, W, Rt2, Vt2, Y, Wt2, b2, f3), c2 = ga(H, L3, Pt2, W, Rt2, Vt2, Y, Wt2, b2, f3);
    H = xa(n2, o2), L3 = Ma(n2, o2), Pt2 = ya$1(n2, o2, h3, p3, A2), W = wa(n2, o2, h3, p3, A2, v3);
    var d3 = Fi$1(H, L3, Pt2, W), m3 = Ti(H, L3, Pt2, W);
    J = F2, Bt2 = U2, F2 = N2, U2 = C3, N2 = S4, C3 = I2, S4 = Fi$1(w2, y3, a3, c2), I2 = Ti(y3, y3, a3, c2), w2 = A2, y3 = v3, A2 = h3, v3 = p3, h3 = n2, p3 = o2, n2 = Fi$1(a3, c2, d3, m3), o2 = Ti(a3, c2, d3, m3);
  }
  Be(this.h, 0, n2, o2), Be(this.h, 2, h3, p3), Be(this.h, 4, A2, v3), Be(this.h, 6, w2, y3), Be(this.h, 8, S4, I2), Be(this.h, 10, N2, C3), Be(this.h, 12, F2, U2), Be(this.h, 14, J, Bt2);
}, ne$1.prototype._digest = function(t) {
  return t === "hex" ? jt$1.toHex32(this.h, "big") : jt$1.split32(this.h, "big");
};
function Aa(e, t, r2, i2, n2) {
  var o2 = e & r2 ^ ~e & n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function ba$1(e, t, r2, i2, n2, o2) {
  var h3 = t & i2 ^ ~t & o2;
  return h3 < 0 && (h3 += 4294967296), h3;
}
function ya$1(e, t, r2, i2, n2) {
  var o2 = e & r2 ^ e & n2 ^ r2 & n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function wa(e, t, r2, i2, n2, o2) {
  var h3 = t & i2 ^ t & o2 ^ i2 & o2;
  return h3 < 0 && (h3 += 4294967296), h3;
}
function xa(e, t) {
  var r2 = le(e, t, 28), i2 = le(t, e, 2), n2 = le(t, e, 7), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Ma(e, t) {
  var r2 = de(e, t, 28), i2 = de(t, e, 2), n2 = de(t, e, 7), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Ea(e, t) {
  var r2 = le(e, t, 14), i2 = le(e, t, 18), n2 = le(t, e, 9), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Sa$1(e, t) {
  var r2 = de(e, t, 14), i2 = de(e, t, 18), n2 = de(t, e, 9), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Na$1(e, t) {
  var r2 = le(e, t, 1), i2 = le(e, t, 8), n2 = Ef(e, t, 7), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Ia(e, t) {
  var r2 = de(e, t, 1), i2 = de(e, t, 8), n2 = Sf(e, t, 7), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function _a(e, t) {
  var r2 = le(e, t, 19), i2 = le(t, e, 29), n2 = Ef(e, t, 6), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
function Ba(e, t) {
  var r2 = de(e, t, 19), i2 = de(t, e, 29), n2 = Sf(e, t, 6), o2 = r2 ^ i2 ^ n2;
  return o2 < 0 && (o2 += 4294967296), o2;
}
var Ui$1 = Q$2, _f = If;
function we$2() {
  if (!(this instanceof we$2)) return new we$2();
  _f.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
}
Ui$1.inherits(we$2, _f);
var Ca = we$2;
we$2.blockSize = 1024, we$2.outSize = 384, we$2.hmacStrength = 192, we$2.padLength = 128, we$2.prototype._digest = function(t) {
  return t === "hex" ? Ui$1.toHex32(this.h.slice(0, 12), "big") : Ui$1.split32(this.h.slice(0, 12), "big");
}, sr$1.sha1 = Z0, sr$1.sha224 = ha, sr$1.sha256 = xf, sr$1.sha384 = Ca, sr$1.sha512 = If;
var Bf = {}, Xe$1 = Q$2, Ra$1 = or$1, Kr = Xe$1.rotl32, Cf = Xe$1.sum32, Er$1 = Xe$1.sum32_3, Rf = Xe$1.sum32_4, Of = Ra$1.BlockHash;
function pe() {
  if (!(this instanceof pe)) return new pe();
  Of.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
Xe$1.inherits(pe, Of), Bf.ripemd160 = pe, pe.blockSize = 512, pe.outSize = 160, pe.hmacStrength = 192, pe.padLength = 64, pe.prototype._update = function(t, r2) {
  for (var i2 = this.h[0], n2 = this.h[1], o2 = this.h[2], h3 = this.h[3], p3 = this.h[4], A2 = i2, v3 = n2, w2 = o2, y3 = h3, S4 = p3, I2 = 0; I2 < 80; I2++) {
    var N2 = Cf(Kr(Rf(i2, Pf(I2, n2, o2, h3), t[Da$1[I2] + r2], Oa$1(I2)), Ta$1[I2]), p3);
    i2 = p3, p3 = h3, h3 = Kr(o2, 10), o2 = n2, n2 = N2, N2 = Cf(Kr(Rf(A2, Pf(79 - I2, v3, w2, y3), t[Fa$1[I2] + r2], Pa(I2)), Ua$1[I2]), S4), A2 = S4, S4 = y3, y3 = Kr(w2, 10), w2 = v3, v3 = N2;
  }
  N2 = Er$1(this.h[1], o2, y3), this.h[1] = Er$1(this.h[2], h3, S4), this.h[2] = Er$1(this.h[3], p3, A2), this.h[3] = Er$1(this.h[4], i2, v3), this.h[4] = Er$1(this.h[0], n2, w2), this.h[0] = N2;
}, pe.prototype._digest = function(t) {
  return t === "hex" ? Xe$1.toHex32(this.h, "little") : Xe$1.split32(this.h, "little");
};
function Pf(e, t, r2, i2) {
  return e <= 15 ? t ^ r2 ^ i2 : e <= 31 ? t & r2 | ~t & i2 : e <= 47 ? (t | ~r2) ^ i2 : e <= 63 ? t & i2 | r2 & ~i2 : t ^ (r2 | ~i2);
}
function Oa$1(e) {
  return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
}
function Pa(e) {
  return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
}
var Da$1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13], Fa$1 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11], Ta$1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6], Ua$1 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11], ka = Q$2, qa$1 = xr$1;
function cr$1(e, t, r2) {
  if (!(this instanceof cr$1)) return new cr$1(e, t, r2);
  this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(ka.toArray(t, r2));
}
var Ka = cr$1;
cr$1.prototype._init = function(t) {
  t.length > this.blockSize && (t = new this.Hash().update(t).digest()), qa$1(t.length <= this.blockSize);
  for (var r2 = t.length; r2 < this.blockSize; r2++) t.push(0);
  for (r2 = 0; r2 < t.length; r2++) t[r2] ^= 54;
  for (this.inner = new this.Hash().update(t), r2 = 0; r2 < t.length; r2++) t[r2] ^= 106;
  this.outer = new this.Hash().update(t);
}, cr$1.prototype.update = function(t, r2) {
  return this.inner.update(t, r2), this;
}, cr$1.prototype.digest = function(t) {
  return this.outer.update(this.inner.digest()), this.outer.digest(t);
}, function(e) {
  var t = e;
  t.utils = Q$2, t.common = or$1, t.sha = sr$1, t.ripemd = Bf, t.hmac = Ka, t.sha1 = t.sha.sha1, t.sha256 = t.sha.sha256, t.sha224 = t.sha.sha224, t.sha384 = t.sha.sha384, t.sha512 = t.sha.sha512, t.ripemd160 = t.ripemd.ripemd160;
}(se);
function lr$2(e, t, r2) {
  return r2 = { path: t, exports: {}, require: function(i2, n2) {
    return Ha$1(i2, n2 ?? r2.path);
  } }, e(r2, r2.exports), r2.exports;
}
function Ha$1() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var ki = Df;
function Df(e, t) {
  if (!e) throw new Error(t || "Assertion failed");
}
Df.equal = function(t, r2, i2) {
  if (t != r2) throw new Error(i2 || "Assertion failed: " + t + " != " + r2);
};
var fe$1 = lr$2(function(e, t) {
  var r2 = t;
  function i2(h3, p3) {
    if (Array.isArray(h3)) return h3.slice();
    if (!h3) return [];
    var A2 = [];
    if (typeof h3 != "string") {
      for (var v3 = 0; v3 < h3.length; v3++) A2[v3] = h3[v3] | 0;
      return A2;
    }
    if (p3 === "hex") {
      h3 = h3.replace(/[^a-z0-9]+/ig, ""), h3.length % 2 !== 0 && (h3 = "0" + h3);
      for (var v3 = 0; v3 < h3.length; v3 += 2) A2.push(parseInt(h3[v3] + h3[v3 + 1], 16));
    } else for (var v3 = 0; v3 < h3.length; v3++) {
      var w2 = h3.charCodeAt(v3), y3 = w2 >> 8, S4 = w2 & 255;
      y3 ? A2.push(y3, S4) : A2.push(S4);
    }
    return A2;
  }
  r2.toArray = i2;
  function n2(h3) {
    return h3.length === 1 ? "0" + h3 : h3;
  }
  r2.zero2 = n2;
  function o2(h3) {
    for (var p3 = "", A2 = 0; A2 < h3.length; A2++) p3 += n2(h3[A2].toString(16));
    return p3;
  }
  r2.toHex = o2, r2.encode = function(p3, A2) {
    return A2 === "hex" ? o2(p3) : p3;
  };
}), Gt$1 = lr$2(function(e, t) {
  var r2 = t;
  r2.assert = ki, r2.toArray = fe$1.toArray, r2.zero2 = fe$1.zero2, r2.toHex = fe$1.toHex, r2.encode = fe$1.encode;
  function i2(A2, v3, w2) {
    var y3 = new Array(Math.max(A2.bitLength(), w2) + 1);
    y3.fill(0);
    for (var S4 = 1 << v3 + 1, I2 = A2.clone(), N2 = 0; N2 < y3.length; N2++) {
      var C3, F2 = I2.andln(S4 - 1);
      I2.isOdd() ? (F2 > (S4 >> 1) - 1 ? C3 = (S4 >> 1) - F2 : C3 = F2, I2.isubn(C3)) : C3 = 0, y3[N2] = C3, I2.iushrn(1);
    }
    return y3;
  }
  r2.getNAF = i2;
  function n2(A2, v3) {
    var w2 = [[], []];
    A2 = A2.clone(), v3 = v3.clone();
    for (var y3 = 0, S4 = 0, I2; A2.cmpn(-y3) > 0 || v3.cmpn(-S4) > 0; ) {
      var N2 = A2.andln(3) + y3 & 3, C3 = v3.andln(3) + S4 & 3;
      N2 === 3 && (N2 = -1), C3 === 3 && (C3 = -1);
      var F2;
      N2 & 1 ? (I2 = A2.andln(7) + y3 & 7, (I2 === 3 || I2 === 5) && C3 === 2 ? F2 = -N2 : F2 = N2) : F2 = 0, w2[0].push(F2);
      var U2;
      C3 & 1 ? (I2 = v3.andln(7) + S4 & 7, (I2 === 3 || I2 === 5) && N2 === 2 ? U2 = -C3 : U2 = C3) : U2 = 0, w2[1].push(U2), 2 * y3 === F2 + 1 && (y3 = 1 - y3), 2 * S4 === U2 + 1 && (S4 = 1 - S4), A2.iushrn(1), v3.iushrn(1);
    }
    return w2;
  }
  r2.getJSF = n2;
  function o2(A2, v3, w2) {
    var y3 = "_" + v3;
    A2.prototype[v3] = function() {
      return this[y3] !== void 0 ? this[y3] : this[y3] = w2.call(this);
    };
  }
  r2.cachedProperty = o2;
  function h3(A2) {
    return typeof A2 == "string" ? r2.toArray(A2, "hex") : A2;
  }
  r2.parseBytes = h3;
  function p3(A2) {
    return new K(A2, "hex", "le");
  }
  r2.intFromLE = p3;
}), Hr$1 = Gt$1.getNAF, La$1 = Gt$1.getJSF, Lr$1 = Gt$1.assert;
function Ce$2(e, t) {
  this.type = e, this.p = new K(t.p, 16), this.red = t.prime ? K.red(t.prime) : K.mont(this.p), this.zero = new K(0).toRed(this.red), this.one = new K(1).toRed(this.red), this.two = new K(2).toRed(this.red), this.n = t.n && new K(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var r2 = this.n && this.p.div(this.n);
  !r2 || r2.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = true, this.redN = this.n.toRed(this.red));
}
var Ze$1 = Ce$2;
Ce$2.prototype.point = function() {
  throw new Error("Not implemented");
}, Ce$2.prototype.validate = function() {
  throw new Error("Not implemented");
}, Ce$2.prototype._fixedNafMul = function(t, r2) {
  Lr$1(t.precomputed);
  var i2 = t._getDoubles(), n2 = Hr$1(r2, 1, this._bitLength), o2 = (1 << i2.step + 1) - (i2.step % 2 === 0 ? 2 : 1);
  o2 /= 3;
  var h3 = [], p3, A2;
  for (p3 = 0; p3 < n2.length; p3 += i2.step) {
    A2 = 0;
    for (var v3 = p3 + i2.step - 1; v3 >= p3; v3--) A2 = (A2 << 1) + n2[v3];
    h3.push(A2);
  }
  for (var w2 = this.jpoint(null, null, null), y3 = this.jpoint(null, null, null), S4 = o2; S4 > 0; S4--) {
    for (p3 = 0; p3 < h3.length; p3++) A2 = h3[p3], A2 === S4 ? y3 = y3.mixedAdd(i2.points[p3]) : A2 === -S4 && (y3 = y3.mixedAdd(i2.points[p3].neg()));
    w2 = w2.add(y3);
  }
  return w2.toP();
}, Ce$2.prototype._wnafMul = function(t, r2) {
  var i2 = 4, n2 = t._getNAFPoints(i2);
  i2 = n2.wnd;
  for (var o2 = n2.points, h3 = Hr$1(r2, i2, this._bitLength), p3 = this.jpoint(null, null, null), A2 = h3.length - 1; A2 >= 0; A2--) {
    for (var v3 = 0; A2 >= 0 && h3[A2] === 0; A2--) v3++;
    if (A2 >= 0 && v3++, p3 = p3.dblp(v3), A2 < 0) break;
    var w2 = h3[A2];
    Lr$1(w2 !== 0), t.type === "affine" ? w2 > 0 ? p3 = p3.mixedAdd(o2[w2 - 1 >> 1]) : p3 = p3.mixedAdd(o2[-w2 - 1 >> 1].neg()) : w2 > 0 ? p3 = p3.add(o2[w2 - 1 >> 1]) : p3 = p3.add(o2[-w2 - 1 >> 1].neg());
  }
  return t.type === "affine" ? p3.toP() : p3;
}, Ce$2.prototype._wnafMulAdd = function(t, r2, i2, n2, o2) {
  var h3 = this._wnafT1, p3 = this._wnafT2, A2 = this._wnafT3, v3 = 0, w2, y3, S4;
  for (w2 = 0; w2 < n2; w2++) {
    S4 = r2[w2];
    var I2 = S4._getNAFPoints(t);
    h3[w2] = I2.wnd, p3[w2] = I2.points;
  }
  for (w2 = n2 - 1; w2 >= 1; w2 -= 2) {
    var N2 = w2 - 1, C3 = w2;
    if (h3[N2] !== 1 || h3[C3] !== 1) {
      A2[N2] = Hr$1(i2[N2], h3[N2], this._bitLength), A2[C3] = Hr$1(i2[C3], h3[C3], this._bitLength), v3 = Math.max(A2[N2].length, v3), v3 = Math.max(A2[C3].length, v3);
      continue;
    }
    var F2 = [r2[N2], null, null, r2[C3]];
    r2[N2].y.cmp(r2[C3].y) === 0 ? (F2[1] = r2[N2].add(r2[C3]), F2[2] = r2[N2].toJ().mixedAdd(r2[C3].neg())) : r2[N2].y.cmp(r2[C3].y.redNeg()) === 0 ? (F2[1] = r2[N2].toJ().mixedAdd(r2[C3]), F2[2] = r2[N2].add(r2[C3].neg())) : (F2[1] = r2[N2].toJ().mixedAdd(r2[C3]), F2[2] = r2[N2].toJ().mixedAdd(r2[C3].neg()));
    var U2 = [-3, -1, -5, -7, 0, 7, 5, 1, 3], J = La$1(i2[N2], i2[C3]);
    for (v3 = Math.max(J[0].length, v3), A2[N2] = new Array(v3), A2[C3] = new Array(v3), y3 = 0; y3 < v3; y3++) {
      var Bt2 = J[0][y3] | 0, G = J[1][y3] | 0;
      A2[N2][y3] = U2[(Bt2 + 1) * 3 + (G + 1)], A2[C3][y3] = 0, p3[N2] = F2;
    }
  }
  var H = this.jpoint(null, null, null), L3 = this._wnafT4;
  for (w2 = v3; w2 >= 0; w2--) {
    for (var Pt2 = 0; w2 >= 0; ) {
      var W = true;
      for (y3 = 0; y3 < n2; y3++) L3[y3] = A2[y3][w2] | 0, L3[y3] !== 0 && (W = false);
      if (!W) break;
      Pt2++, w2--;
    }
    if (w2 >= 0 && Pt2++, H = H.dblp(Pt2), w2 < 0) break;
    for (y3 = 0; y3 < n2; y3++) {
      var Rt2 = L3[y3];
      Rt2 !== 0 && (Rt2 > 0 ? S4 = p3[y3][Rt2 - 1 >> 1] : Rt2 < 0 && (S4 = p3[y3][-Rt2 - 1 >> 1].neg()), S4.type === "affine" ? H = H.mixedAdd(S4) : H = H.add(S4));
    }
  }
  for (w2 = 0; w2 < n2; w2++) p3[w2] = null;
  return o2 ? H : H.toP();
};
function $t$1(e, t) {
  this.curve = e, this.type = t, this.precomputed = null;
}
Ce$2.BasePoint = $t$1, $t$1.prototype.eq = function() {
  throw new Error("Not implemented");
}, $t$1.prototype.validate = function() {
  return this.curve.validate(this);
}, Ce$2.prototype.decodePoint = function(t, r2) {
  t = Gt$1.toArray(t, r2);
  var i2 = this.p.byteLength();
  if ((t[0] === 4 || t[0] === 6 || t[0] === 7) && t.length - 1 === 2 * i2) {
    t[0] === 6 ? Lr$1(t[t.length - 1] % 2 === 0) : t[0] === 7 && Lr$1(t[t.length - 1] % 2 === 1);
    var n2 = this.point(t.slice(1, 1 + i2), t.slice(1 + i2, 1 + 2 * i2));
    return n2;
  } else if ((t[0] === 2 || t[0] === 3) && t.length - 1 === i2) return this.pointFromX(t.slice(1, 1 + i2), t[0] === 3);
  throw new Error("Unknown point format");
}, $t$1.prototype.encodeCompressed = function(t) {
  return this.encode(t, true);
}, $t$1.prototype._encode = function(t) {
  var r2 = this.curve.p.byteLength(), i2 = this.getX().toArray("be", r2);
  return t ? [this.getY().isEven() ? 2 : 3].concat(i2) : [4].concat(i2, this.getY().toArray("be", r2));
}, $t$1.prototype.encode = function(t, r2) {
  return Gt$1.encode(this._encode(r2), t);
}, $t$1.prototype.precompute = function(t) {
  if (this.precomputed) return this;
  var r2 = { doubles: null, naf: null, beta: null };
  return r2.naf = this._getNAFPoints(8), r2.doubles = this._getDoubles(4, t), r2.beta = this._getBeta(), this.precomputed = r2, this;
}, $t$1.prototype._hasDoubles = function(t) {
  if (!this.precomputed) return false;
  var r2 = this.precomputed.doubles;
  return r2 ? r2.points.length >= Math.ceil((t.bitLength() + 1) / r2.step) : false;
}, $t$1.prototype._getDoubles = function(t, r2) {
  if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
  for (var i2 = [this], n2 = this, o2 = 0; o2 < r2; o2 += t) {
    for (var h3 = 0; h3 < t; h3++) n2 = n2.dbl();
    i2.push(n2);
  }
  return { step: t, points: i2 };
}, $t$1.prototype._getNAFPoints = function(t) {
  if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
  for (var r2 = [this], i2 = (1 << t) - 1, n2 = i2 === 1 ? null : this.dbl(), o2 = 1; o2 < i2; o2++) r2[o2] = r2[o2 - 1].add(n2);
  return { wnd: t, points: r2 };
}, $t$1.prototype._getBeta = function() {
  return null;
}, $t$1.prototype.dblp = function(t) {
  for (var r2 = this, i2 = 0; i2 < t; i2++) r2 = r2.dbl();
  return r2;
};
var qi = lr$2(function(e) {
  typeof Object.create == "function" ? e.exports = function(r2, i2) {
    i2 && (r2.super_ = i2, r2.prototype = Object.create(i2.prototype, { constructor: { value: r2, enumerable: false, writable: true, configurable: true } }));
  } : e.exports = function(r2, i2) {
    if (i2) {
      r2.super_ = i2;
      var n2 = function() {
      };
      n2.prototype = i2.prototype, r2.prototype = new n2(), r2.prototype.constructor = r2;
    }
  };
}), za = Gt$1.assert;
function te$1(e) {
  Ze$1.call(this, "short", e), this.a = new K(e.a, 16).toRed(this.red), this.b = new K(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
qi(te$1, Ze$1);
var ja = te$1;
te$1.prototype._getEndomorphism = function(t) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var r2, i2;
    if (t.beta) r2 = new K(t.beta, 16).toRed(this.red);
    else {
      var n2 = this._getEndoRoots(this.p);
      r2 = n2[0].cmp(n2[1]) < 0 ? n2[0] : n2[1], r2 = r2.toRed(this.red);
    }
    if (t.lambda) i2 = new K(t.lambda, 16);
    else {
      var o2 = this._getEndoRoots(this.n);
      this.g.mul(o2[0]).x.cmp(this.g.x.redMul(r2)) === 0 ? i2 = o2[0] : (i2 = o2[1], za(this.g.mul(i2).x.cmp(this.g.x.redMul(r2)) === 0));
    }
    var h3;
    return t.basis ? h3 = t.basis.map(function(p3) {
      return { a: new K(p3.a, 16), b: new K(p3.b, 16) };
    }) : h3 = this._getEndoBasis(i2), { beta: r2, lambda: i2, basis: h3 };
  }
}, te$1.prototype._getEndoRoots = function(t) {
  var r2 = t === this.p ? this.red : K.mont(t), i2 = new K(2).toRed(r2).redInvm(), n2 = i2.redNeg(), o2 = new K(3).toRed(r2).redNeg().redSqrt().redMul(i2), h3 = n2.redAdd(o2).fromRed(), p3 = n2.redSub(o2).fromRed();
  return [h3, p3];
}, te$1.prototype._getEndoBasis = function(t) {
  for (var r2 = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), i2 = t, n2 = this.n.clone(), o2 = new K(1), h3 = new K(0), p3 = new K(0), A2 = new K(1), v3, w2, y3, S4, I2, N2, C3, F2 = 0, U2, J; i2.cmpn(0) !== 0; ) {
    var Bt2 = n2.div(i2);
    U2 = n2.sub(Bt2.mul(i2)), J = p3.sub(Bt2.mul(o2));
    var G = A2.sub(Bt2.mul(h3));
    if (!y3 && U2.cmp(r2) < 0) v3 = C3.neg(), w2 = o2, y3 = U2.neg(), S4 = J;
    else if (y3 && ++F2 === 2) break;
    C3 = U2, n2 = i2, i2 = U2, p3 = o2, o2 = J, A2 = h3, h3 = G;
  }
  I2 = U2.neg(), N2 = J;
  var H = y3.sqr().add(S4.sqr()), L3 = I2.sqr().add(N2.sqr());
  return L3.cmp(H) >= 0 && (I2 = v3, N2 = w2), y3.negative && (y3 = y3.neg(), S4 = S4.neg()), I2.negative && (I2 = I2.neg(), N2 = N2.neg()), [{ a: y3, b: S4 }, { a: I2, b: N2 }];
}, te$1.prototype._endoSplit = function(t) {
  var r2 = this.endo.basis, i2 = r2[0], n2 = r2[1], o2 = n2.b.mul(t).divRound(this.n), h3 = i2.b.neg().mul(t).divRound(this.n), p3 = o2.mul(i2.a), A2 = h3.mul(n2.a), v3 = o2.mul(i2.b), w2 = h3.mul(n2.b), y3 = t.sub(p3).sub(A2), S4 = v3.add(w2).neg();
  return { k1: y3, k2: S4 };
}, te$1.prototype.pointFromX = function(t, r2) {
  t = new K(t, 16), t.red || (t = t.toRed(this.red));
  var i2 = t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b), n2 = i2.redSqrt();
  if (n2.redSqr().redSub(i2).cmp(this.zero) !== 0) throw new Error("invalid point");
  var o2 = n2.fromRed().isOdd();
  return (r2 && !o2 || !r2 && o2) && (n2 = n2.redNeg()), this.point(t, n2);
}, te$1.prototype.validate = function(t) {
  if (t.inf) return true;
  var r2 = t.x, i2 = t.y, n2 = this.a.redMul(r2), o2 = r2.redSqr().redMul(r2).redIAdd(n2).redIAdd(this.b);
  return i2.redSqr().redISub(o2).cmpn(0) === 0;
}, te$1.prototype._endoWnafMulAdd = function(t, r2, i2) {
  for (var n2 = this._endoWnafT1, o2 = this._endoWnafT2, h3 = 0; h3 < t.length; h3++) {
    var p3 = this._endoSplit(r2[h3]), A2 = t[h3], v3 = A2._getBeta();
    p3.k1.negative && (p3.k1.ineg(), A2 = A2.neg(true)), p3.k2.negative && (p3.k2.ineg(), v3 = v3.neg(true)), n2[h3 * 2] = A2, n2[h3 * 2 + 1] = v3, o2[h3 * 2] = p3.k1, o2[h3 * 2 + 1] = p3.k2;
  }
  for (var w2 = this._wnafMulAdd(1, n2, o2, h3 * 2, i2), y3 = 0; y3 < h3 * 2; y3++) n2[y3] = null, o2[y3] = null;
  return w2;
};
function Ft$1(e, t, r2, i2) {
  Ze$1.BasePoint.call(this, e, "affine"), t === null && r2 === null ? (this.x = null, this.y = null, this.inf = true) : (this.x = new K(t, 16), this.y = new K(r2, 16), i2 && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = false);
}
qi(Ft$1, Ze$1.BasePoint), te$1.prototype.point = function(t, r2, i2) {
  return new Ft$1(this, t, r2, i2);
}, te$1.prototype.pointFromJSON = function(t, r2) {
  return Ft$1.fromJSON(this, t, r2);
}, Ft$1.prototype._getBeta = function() {
  if (this.curve.endo) {
    var t = this.precomputed;
    if (t && t.beta) return t.beta;
    var r2 = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (t) {
      var i2 = this.curve, n2 = function(o2) {
        return i2.point(o2.x.redMul(i2.endo.beta), o2.y);
      };
      t.beta = r2, r2.precomputed = { beta: null, naf: t.naf && { wnd: t.naf.wnd, points: t.naf.points.map(n2) }, doubles: t.doubles && { step: t.doubles.step, points: t.doubles.points.map(n2) } };
    }
    return r2;
  }
}, Ft$1.prototype.toJSON = function() {
  return this.precomputed ? [this.x, this.y, this.precomputed && { doubles: this.precomputed.doubles && { step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1) }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) } }] : [this.x, this.y];
}, Ft$1.fromJSON = function(t, r2, i2) {
  typeof r2 == "string" && (r2 = JSON.parse(r2));
  var n2 = t.point(r2[0], r2[1], i2);
  if (!r2[2]) return n2;
  function o2(p3) {
    return t.point(p3[0], p3[1], i2);
  }
  var h3 = r2[2];
  return n2.precomputed = { beta: null, doubles: h3.doubles && { step: h3.doubles.step, points: [n2].concat(h3.doubles.points.map(o2)) }, naf: h3.naf && { wnd: h3.naf.wnd, points: [n2].concat(h3.naf.points.map(o2)) } }, n2;
}, Ft$1.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
}, Ft$1.prototype.isInfinity = function() {
  return this.inf;
}, Ft$1.prototype.add = function(t) {
  if (this.inf) return t;
  if (t.inf) return this;
  if (this.eq(t)) return this.dbl();
  if (this.neg().eq(t)) return this.curve.point(null, null);
  if (this.x.cmp(t.x) === 0) return this.curve.point(null, null);
  var r2 = this.y.redSub(t.y);
  r2.cmpn(0) !== 0 && (r2 = r2.redMul(this.x.redSub(t.x).redInvm()));
  var i2 = r2.redSqr().redISub(this.x).redISub(t.x), n2 = r2.redMul(this.x.redSub(i2)).redISub(this.y);
  return this.curve.point(i2, n2);
}, Ft$1.prototype.dbl = function() {
  if (this.inf) return this;
  var t = this.y.redAdd(this.y);
  if (t.cmpn(0) === 0) return this.curve.point(null, null);
  var r2 = this.curve.a, i2 = this.x.redSqr(), n2 = t.redInvm(), o2 = i2.redAdd(i2).redIAdd(i2).redIAdd(r2).redMul(n2), h3 = o2.redSqr().redISub(this.x.redAdd(this.x)), p3 = o2.redMul(this.x.redSub(h3)).redISub(this.y);
  return this.curve.point(h3, p3);
}, Ft$1.prototype.getX = function() {
  return this.x.fromRed();
}, Ft$1.prototype.getY = function() {
  return this.y.fromRed();
}, Ft$1.prototype.mul = function(t) {
  return t = new K(t, 16), this.isInfinity() ? this : this._hasDoubles(t) ? this.curve._fixedNafMul(this, t) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [t]) : this.curve._wnafMul(this, t);
}, Ft$1.prototype.mulAdd = function(t, r2, i2) {
  var n2 = [this, r2], o2 = [t, i2];
  return this.curve.endo ? this.curve._endoWnafMulAdd(n2, o2) : this.curve._wnafMulAdd(1, n2, o2, 2);
}, Ft$1.prototype.jmulAdd = function(t, r2, i2) {
  var n2 = [this, r2], o2 = [t, i2];
  return this.curve.endo ? this.curve._endoWnafMulAdd(n2, o2, true) : this.curve._wnafMulAdd(1, n2, o2, 2, true);
}, Ft$1.prototype.eq = function(t) {
  return this === t || this.inf === t.inf && (this.inf || this.x.cmp(t.x) === 0 && this.y.cmp(t.y) === 0);
}, Ft$1.prototype.neg = function(t) {
  if (this.inf) return this;
  var r2 = this.curve.point(this.x, this.y.redNeg());
  if (t && this.precomputed) {
    var i2 = this.precomputed, n2 = function(o2) {
      return o2.neg();
    };
    r2.precomputed = { naf: i2.naf && { wnd: i2.naf.wnd, points: i2.naf.points.map(n2) }, doubles: i2.doubles && { step: i2.doubles.step, points: i2.doubles.points.map(n2) } };
  }
  return r2;
}, Ft$1.prototype.toJ = function() {
  if (this.inf) return this.curve.jpoint(null, null, null);
  var t = this.curve.jpoint(this.x, this.y, this.curve.one);
  return t;
};
function Tt$2(e, t, r2, i2) {
  Ze$1.BasePoint.call(this, e, "jacobian"), t === null && r2 === null && i2 === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new K(0)) : (this.x = new K(t, 16), this.y = new K(r2, 16), this.z = new K(i2, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
qi(Tt$2, Ze$1.BasePoint), te$1.prototype.jpoint = function(t, r2, i2) {
  return new Tt$2(this, t, r2, i2);
}, Tt$2.prototype.toP = function() {
  if (this.isInfinity()) return this.curve.point(null, null);
  var t = this.z.redInvm(), r2 = t.redSqr(), i2 = this.x.redMul(r2), n2 = this.y.redMul(r2).redMul(t);
  return this.curve.point(i2, n2);
}, Tt$2.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
}, Tt$2.prototype.add = function(t) {
  if (this.isInfinity()) return t;
  if (t.isInfinity()) return this;
  var r2 = t.z.redSqr(), i2 = this.z.redSqr(), n2 = this.x.redMul(r2), o2 = t.x.redMul(i2), h3 = this.y.redMul(r2.redMul(t.z)), p3 = t.y.redMul(i2.redMul(this.z)), A2 = n2.redSub(o2), v3 = h3.redSub(p3);
  if (A2.cmpn(0) === 0) return v3.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var w2 = A2.redSqr(), y3 = w2.redMul(A2), S4 = n2.redMul(w2), I2 = v3.redSqr().redIAdd(y3).redISub(S4).redISub(S4), N2 = v3.redMul(S4.redISub(I2)).redISub(h3.redMul(y3)), C3 = this.z.redMul(t.z).redMul(A2);
  return this.curve.jpoint(I2, N2, C3);
}, Tt$2.prototype.mixedAdd = function(t) {
  if (this.isInfinity()) return t.toJ();
  if (t.isInfinity()) return this;
  var r2 = this.z.redSqr(), i2 = this.x, n2 = t.x.redMul(r2), o2 = this.y, h3 = t.y.redMul(r2).redMul(this.z), p3 = i2.redSub(n2), A2 = o2.redSub(h3);
  if (p3.cmpn(0) === 0) return A2.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var v3 = p3.redSqr(), w2 = v3.redMul(p3), y3 = i2.redMul(v3), S4 = A2.redSqr().redIAdd(w2).redISub(y3).redISub(y3), I2 = A2.redMul(y3.redISub(S4)).redISub(o2.redMul(w2)), N2 = this.z.redMul(p3);
  return this.curve.jpoint(S4, I2, N2);
}, Tt$2.prototype.dblp = function(t) {
  if (t === 0) return this;
  if (this.isInfinity()) return this;
  if (!t) return this.dbl();
  var r2;
  if (this.curve.zeroA || this.curve.threeA) {
    var i2 = this;
    for (r2 = 0; r2 < t; r2++) i2 = i2.dbl();
    return i2;
  }
  var n2 = this.curve.a, o2 = this.curve.tinv, h3 = this.x, p3 = this.y, A2 = this.z, v3 = A2.redSqr().redSqr(), w2 = p3.redAdd(p3);
  for (r2 = 0; r2 < t; r2++) {
    var y3 = h3.redSqr(), S4 = w2.redSqr(), I2 = S4.redSqr(), N2 = y3.redAdd(y3).redIAdd(y3).redIAdd(n2.redMul(v3)), C3 = h3.redMul(S4), F2 = N2.redSqr().redISub(C3.redAdd(C3)), U2 = C3.redISub(F2), J = N2.redMul(U2);
    J = J.redIAdd(J).redISub(I2);
    var Bt2 = w2.redMul(A2);
    r2 + 1 < t && (v3 = v3.redMul(I2)), h3 = F2, A2 = Bt2, w2 = J;
  }
  return this.curve.jpoint(h3, w2.redMul(o2), A2);
}, Tt$2.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
}, Tt$2.prototype._zeroDbl = function() {
  var t, r2, i2;
  if (this.zOne) {
    var n2 = this.x.redSqr(), o2 = this.y.redSqr(), h3 = o2.redSqr(), p3 = this.x.redAdd(o2).redSqr().redISub(n2).redISub(h3);
    p3 = p3.redIAdd(p3);
    var A2 = n2.redAdd(n2).redIAdd(n2), v3 = A2.redSqr().redISub(p3).redISub(p3), w2 = h3.redIAdd(h3);
    w2 = w2.redIAdd(w2), w2 = w2.redIAdd(w2), t = v3, r2 = A2.redMul(p3.redISub(v3)).redISub(w2), i2 = this.y.redAdd(this.y);
  } else {
    var y3 = this.x.redSqr(), S4 = this.y.redSqr(), I2 = S4.redSqr(), N2 = this.x.redAdd(S4).redSqr().redISub(y3).redISub(I2);
    N2 = N2.redIAdd(N2);
    var C3 = y3.redAdd(y3).redIAdd(y3), F2 = C3.redSqr(), U2 = I2.redIAdd(I2);
    U2 = U2.redIAdd(U2), U2 = U2.redIAdd(U2), t = F2.redISub(N2).redISub(N2), r2 = C3.redMul(N2.redISub(t)).redISub(U2), i2 = this.y.redMul(this.z), i2 = i2.redIAdd(i2);
  }
  return this.curve.jpoint(t, r2, i2);
}, Tt$2.prototype._threeDbl = function() {
  var t, r2, i2;
  if (this.zOne) {
    var n2 = this.x.redSqr(), o2 = this.y.redSqr(), h3 = o2.redSqr(), p3 = this.x.redAdd(o2).redSqr().redISub(n2).redISub(h3);
    p3 = p3.redIAdd(p3);
    var A2 = n2.redAdd(n2).redIAdd(n2).redIAdd(this.curve.a), v3 = A2.redSqr().redISub(p3).redISub(p3);
    t = v3;
    var w2 = h3.redIAdd(h3);
    w2 = w2.redIAdd(w2), w2 = w2.redIAdd(w2), r2 = A2.redMul(p3.redISub(v3)).redISub(w2), i2 = this.y.redAdd(this.y);
  } else {
    var y3 = this.z.redSqr(), S4 = this.y.redSqr(), I2 = this.x.redMul(S4), N2 = this.x.redSub(y3).redMul(this.x.redAdd(y3));
    N2 = N2.redAdd(N2).redIAdd(N2);
    var C3 = I2.redIAdd(I2);
    C3 = C3.redIAdd(C3);
    var F2 = C3.redAdd(C3);
    t = N2.redSqr().redISub(F2), i2 = this.y.redAdd(this.z).redSqr().redISub(S4).redISub(y3);
    var U2 = S4.redSqr();
    U2 = U2.redIAdd(U2), U2 = U2.redIAdd(U2), U2 = U2.redIAdd(U2), r2 = N2.redMul(C3.redISub(t)).redISub(U2);
  }
  return this.curve.jpoint(t, r2, i2);
}, Tt$2.prototype._dbl = function() {
  var t = this.curve.a, r2 = this.x, i2 = this.y, n2 = this.z, o2 = n2.redSqr().redSqr(), h3 = r2.redSqr(), p3 = i2.redSqr(), A2 = h3.redAdd(h3).redIAdd(h3).redIAdd(t.redMul(o2)), v3 = r2.redAdd(r2);
  v3 = v3.redIAdd(v3);
  var w2 = v3.redMul(p3), y3 = A2.redSqr().redISub(w2.redAdd(w2)), S4 = w2.redISub(y3), I2 = p3.redSqr();
  I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2);
  var N2 = A2.redMul(S4).redISub(I2), C3 = i2.redAdd(i2).redMul(n2);
  return this.curve.jpoint(y3, N2, C3);
}, Tt$2.prototype.trpl = function() {
  if (!this.curve.zeroA) return this.dbl().add(this);
  var t = this.x.redSqr(), r2 = this.y.redSqr(), i2 = this.z.redSqr(), n2 = r2.redSqr(), o2 = t.redAdd(t).redIAdd(t), h3 = o2.redSqr(), p3 = this.x.redAdd(r2).redSqr().redISub(t).redISub(n2);
  p3 = p3.redIAdd(p3), p3 = p3.redAdd(p3).redIAdd(p3), p3 = p3.redISub(h3);
  var A2 = p3.redSqr(), v3 = n2.redIAdd(n2);
  v3 = v3.redIAdd(v3), v3 = v3.redIAdd(v3), v3 = v3.redIAdd(v3);
  var w2 = o2.redIAdd(p3).redSqr().redISub(h3).redISub(A2).redISub(v3), y3 = r2.redMul(w2);
  y3 = y3.redIAdd(y3), y3 = y3.redIAdd(y3);
  var S4 = this.x.redMul(A2).redISub(y3);
  S4 = S4.redIAdd(S4), S4 = S4.redIAdd(S4);
  var I2 = this.y.redMul(w2.redMul(v3.redISub(w2)).redISub(p3.redMul(A2)));
  I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2);
  var N2 = this.z.redAdd(p3).redSqr().redISub(i2).redISub(A2);
  return this.curve.jpoint(S4, I2, N2);
}, Tt$2.prototype.mul = function(t, r2) {
  return t = new K(t, r2), this.curve._wnafMul(this, t);
}, Tt$2.prototype.eq = function(t) {
  if (t.type === "affine") return this.eq(t.toJ());
  if (this === t) return true;
  var r2 = this.z.redSqr(), i2 = t.z.redSqr();
  if (this.x.redMul(i2).redISub(t.x.redMul(r2)).cmpn(0) !== 0) return false;
  var n2 = r2.redMul(this.z), o2 = i2.redMul(t.z);
  return this.y.redMul(o2).redISub(t.y.redMul(n2)).cmpn(0) === 0;
}, Tt$2.prototype.eqXToP = function(t) {
  var r2 = this.z.redSqr(), i2 = t.toRed(this.curve.red).redMul(r2);
  if (this.x.cmp(i2) === 0) return true;
  for (var n2 = t.clone(), o2 = this.curve.redN.redMul(r2); ; ) {
    if (n2.iadd(this.curve.n), n2.cmp(this.curve.p) >= 0) return false;
    if (i2.redIAdd(o2), this.x.cmp(i2) === 0) return true;
  }
}, Tt$2.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
}, Tt$2.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var zr$1 = lr$2(function(e, t) {
  var r2 = t;
  r2.base = Ze$1, r2.short = ja, r2.mont = null, r2.edwards = null;
}), jr = lr$2(function(e, t) {
  var r2 = t, i2 = Gt$1.assert;
  function n2(p3) {
    p3.type === "short" ? this.curve = new zr$1.short(p3) : p3.type === "edwards" ? this.curve = new zr$1.edwards(p3) : this.curve = new zr$1.mont(p3), this.g = this.curve.g, this.n = this.curve.n, this.hash = p3.hash, i2(this.g.validate(), "Invalid curve"), i2(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  r2.PresetCurve = n2;
  function o2(p3, A2) {
    Object.defineProperty(r2, p3, { configurable: true, enumerable: true, get: function() {
      var v3 = new n2(A2);
      return Object.defineProperty(r2, p3, { configurable: true, enumerable: true, value: v3 }), v3;
    } });
  }
  o2("p192", { type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: se.sha256, gRed: false, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"] }), o2("p224", { type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: se.sha256, gRed: false, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"] }), o2("p256", { type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: se.sha256, gRed: false, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"] }), o2("p384", { type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: se.sha384, gRed: false, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"] }), o2("p521", { type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: se.sha512, gRed: false, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"] }), o2("curve25519", { type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: se.sha256, gRed: false, g: ["9"] }), o2("ed25519", { type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: se.sha256, gRed: false, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"] });
  var h3;
  try {
    h3 = null.crash();
  } catch {
    h3 = void 0;
  }
  o2("secp256k1", { type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: se.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{ a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }], gRed: false, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", h3] });
});
function Re(e) {
  if (!(this instanceof Re)) return new Re(e);
  this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var t = fe$1.toArray(e.entropy, e.entropyEnc || "hex"), r2 = fe$1.toArray(e.nonce, e.nonceEnc || "hex"), i2 = fe$1.toArray(e.pers, e.persEnc || "hex");
  ki(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r2, i2);
}
var Ff = Re;
Re.prototype._init = function(t, r2, i2) {
  var n2 = t.concat(r2).concat(i2);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var o2 = 0; o2 < this.V.length; o2++) this.K[o2] = 0, this.V[o2] = 1;
  this._update(n2), this._reseed = 1, this.reseedInterval = 281474976710656;
}, Re.prototype._hmac = function() {
  return new se.hmac(this.hash, this.K);
}, Re.prototype._update = function(t) {
  var r2 = this._hmac().update(this.V).update([0]);
  t && (r2 = r2.update(t)), this.K = r2.digest(), this.V = this._hmac().update(this.V).digest(), t && (this.K = this._hmac().update(this.V).update([1]).update(t).digest(), this.V = this._hmac().update(this.V).digest());
}, Re.prototype.reseed = function(t, r2, i2, n2) {
  typeof r2 != "string" && (n2 = i2, i2 = r2, r2 = null), t = fe$1.toArray(t, r2), i2 = fe$1.toArray(i2, n2), ki(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(t.concat(i2 || [])), this._reseed = 1;
}, Re.prototype.generate = function(t, r2, i2, n2) {
  if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
  typeof r2 != "string" && (n2 = i2, i2 = r2, r2 = null), i2 && (i2 = fe$1.toArray(i2, n2 || "hex"), this._update(i2));
  for (var o2 = []; o2.length < t; ) this.V = this._hmac().update(this.V).digest(), o2 = o2.concat(this.V);
  var h3 = o2.slice(0, t);
  return this._update(i2), this._reseed++, fe$1.encode(h3, r2);
};
var Ki = Gt$1.assert;
function kt$1(e, t) {
  this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc);
}
var Hi = kt$1;
kt$1.fromPublic = function(t, r2, i2) {
  return r2 instanceof kt$1 ? r2 : new kt$1(t, { pub: r2, pubEnc: i2 });
}, kt$1.fromPrivate = function(t, r2, i2) {
  return r2 instanceof kt$1 ? r2 : new kt$1(t, { priv: r2, privEnc: i2 });
}, kt$1.prototype.validate = function() {
  var t = this.getPublic();
  return t.isInfinity() ? { result: false, reason: "Invalid public key" } : t.validate() ? t.mul(this.ec.curve.n).isInfinity() ? { result: true, reason: null } : { result: false, reason: "Public key * N != O" } : { result: false, reason: "Public key is not a point" };
}, kt$1.prototype.getPublic = function(t, r2) {
  return typeof t == "string" && (r2 = t, t = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), r2 ? this.pub.encode(r2, t) : this.pub;
}, kt$1.prototype.getPrivate = function(t) {
  return t === "hex" ? this.priv.toString(16, 2) : this.priv;
}, kt$1.prototype._importPrivate = function(t, r2) {
  this.priv = new K(t, r2 || 16), this.priv = this.priv.umod(this.ec.curve.n);
}, kt$1.prototype._importPublic = function(t, r2) {
  if (t.x || t.y) {
    this.ec.curve.type === "mont" ? Ki(t.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && Ki(t.x && t.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(t.x, t.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(t, r2);
}, kt$1.prototype.derive = function(t) {
  return t.validate() || Ki(t.validate(), "public point not validated"), t.mul(this.priv).getX();
}, kt$1.prototype.sign = function(t, r2, i2) {
  return this.ec.sign(t, this, r2, i2);
}, kt$1.prototype.verify = function(t, r2) {
  return this.ec.verify(t, r2, this);
}, kt$1.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var Qa = Gt$1.assert;
function Qr$1(e, t) {
  if (e instanceof Qr$1) return e;
  this._importDER(e, t) || (Qa(e.r && e.s, "Signature without r or s"), this.r = new K(e.r, 16), this.s = new K(e.s, 16), e.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam);
}
var Jr$1 = Qr$1;
function Ja() {
  this.place = 0;
}
function Li(e, t) {
  var r2 = e[t.place++];
  if (!(r2 & 128)) return r2;
  var i2 = r2 & 15;
  if (i2 === 0 || i2 > 4) return false;
  for (var n2 = 0, o2 = 0, h3 = t.place; o2 < i2; o2++, h3++) n2 <<= 8, n2 |= e[h3], n2 >>>= 0;
  return n2 <= 127 ? false : (t.place = h3, n2);
}
function Tf(e) {
  for (var t = 0, r2 = e.length - 1; !e[t] && !(e[t + 1] & 128) && t < r2; ) t++;
  return t === 0 ? e : e.slice(t);
}
Qr$1.prototype._importDER = function(t, r2) {
  t = Gt$1.toArray(t, r2);
  var i2 = new Ja();
  if (t[i2.place++] !== 48) return false;
  var n2 = Li(t, i2);
  if (n2 === false || n2 + i2.place !== t.length || t[i2.place++] !== 2) return false;
  var o2 = Li(t, i2);
  if (o2 === false) return false;
  var h3 = t.slice(i2.place, o2 + i2.place);
  if (i2.place += o2, t[i2.place++] !== 2) return false;
  var p3 = Li(t, i2);
  if (p3 === false || t.length !== p3 + i2.place) return false;
  var A2 = t.slice(i2.place, p3 + i2.place);
  if (h3[0] === 0) if (h3[1] & 128) h3 = h3.slice(1);
  else return false;
  if (A2[0] === 0) if (A2[1] & 128) A2 = A2.slice(1);
  else return false;
  return this.r = new K(h3), this.s = new K(A2), this.recoveryParam = null, true;
};
function zi(e, t) {
  if (t < 128) {
    e.push(t);
    return;
  }
  var r2 = 1 + (Math.log(t) / Math.LN2 >>> 3);
  for (e.push(r2 | 128); --r2; ) e.push(t >>> (r2 << 3) & 255);
  e.push(t);
}
Qr$1.prototype.toDER = function(t) {
  var r2 = this.r.toArray(), i2 = this.s.toArray();
  for (r2[0] & 128 && (r2 = [0].concat(r2)), i2[0] & 128 && (i2 = [0].concat(i2)), r2 = Tf(r2), i2 = Tf(i2); !i2[0] && !(i2[1] & 128); ) i2 = i2.slice(1);
  var n2 = [2];
  zi(n2, r2.length), n2 = n2.concat(r2), n2.push(2), zi(n2, i2.length);
  var o2 = n2.concat(i2), h3 = [48];
  return zi(h3, o2.length), h3 = h3.concat(o2), Gt$1.encode(h3, t);
};
var Ga = function() {
  throw new Error("unsupported");
}, Uf = Gt$1.assert;
function ee$1(e) {
  if (!(this instanceof ee$1)) return new ee$1(e);
  typeof e == "string" && (Uf(Object.prototype.hasOwnProperty.call(jr, e), "Unknown curve " + e), e = jr[e]), e instanceof jr.PresetCurve && (e = { curve: e }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash;
}
var Ya = ee$1;
ee$1.prototype.keyPair = function(t) {
  return new Hi(this, t);
}, ee$1.prototype.keyFromPrivate = function(t, r2) {
  return Hi.fromPrivate(this, t, r2);
}, ee$1.prototype.keyFromPublic = function(t, r2) {
  return Hi.fromPublic(this, t, r2);
}, ee$1.prototype.genKeyPair = function(t) {
  t || (t = {});
  for (var r2 = new Ff({ hash: this.hash, pers: t.pers, persEnc: t.persEnc || "utf8", entropy: t.entropy || Ga(this.hash.hmacStrength), entropyEnc: t.entropy && t.entropyEnc || "utf8", nonce: this.n.toArray() }), i2 = this.n.byteLength(), n2 = this.n.sub(new K(2)); ; ) {
    var o2 = new K(r2.generate(i2));
    if (!(o2.cmp(n2) > 0)) return o2.iaddn(1), this.keyFromPrivate(o2);
  }
}, ee$1.prototype._truncateToN = function(t, r2) {
  var i2 = t.byteLength() * 8 - this.n.bitLength();
  return i2 > 0 && (t = t.ushrn(i2)), !r2 && t.cmp(this.n) >= 0 ? t.sub(this.n) : t;
}, ee$1.prototype.sign = function(t, r2, i2, n2) {
  typeof i2 == "object" && (n2 = i2, i2 = null), n2 || (n2 = {}), r2 = this.keyFromPrivate(r2, i2), t = this._truncateToN(new K(t, 16));
  for (var o2 = this.n.byteLength(), h3 = r2.getPrivate().toArray("be", o2), p3 = t.toArray("be", o2), A2 = new Ff({ hash: this.hash, entropy: h3, nonce: p3, pers: n2.pers, persEnc: n2.persEnc || "utf8" }), v3 = this.n.sub(new K(1)), w2 = 0; ; w2++) {
    var y3 = n2.k ? n2.k(w2) : new K(A2.generate(this.n.byteLength()));
    if (y3 = this._truncateToN(y3, true), !(y3.cmpn(1) <= 0 || y3.cmp(v3) >= 0)) {
      var S4 = this.g.mul(y3);
      if (!S4.isInfinity()) {
        var I2 = S4.getX(), N2 = I2.umod(this.n);
        if (N2.cmpn(0) !== 0) {
          var C3 = y3.invm(this.n).mul(N2.mul(r2.getPrivate()).iadd(t));
          if (C3 = C3.umod(this.n), C3.cmpn(0) !== 0) {
            var F2 = (S4.getY().isOdd() ? 1 : 0) | (I2.cmp(N2) !== 0 ? 2 : 0);
            return n2.canonical && C3.cmp(this.nh) > 0 && (C3 = this.n.sub(C3), F2 ^= 1), new Jr$1({ r: N2, s: C3, recoveryParam: F2 });
          }
        }
      }
    }
  }
}, ee$1.prototype.verify = function(t, r2, i2, n2) {
  t = this._truncateToN(new K(t, 16)), i2 = this.keyFromPublic(i2, n2), r2 = new Jr$1(r2, "hex");
  var o2 = r2.r, h3 = r2.s;
  if (o2.cmpn(1) < 0 || o2.cmp(this.n) >= 0 || h3.cmpn(1) < 0 || h3.cmp(this.n) >= 0) return false;
  var p3 = h3.invm(this.n), A2 = p3.mul(t).umod(this.n), v3 = p3.mul(o2).umod(this.n), w2;
  return this.curve._maxwellTrick ? (w2 = this.g.jmulAdd(A2, i2.getPublic(), v3), w2.isInfinity() ? false : w2.eqXToP(o2)) : (w2 = this.g.mulAdd(A2, i2.getPublic(), v3), w2.isInfinity() ? false : w2.getX().umod(this.n).cmp(o2) === 0);
}, ee$1.prototype.recoverPubKey = function(e, t, r2, i2) {
  Uf((3 & r2) === r2, "The recovery param is more than two bits"), t = new Jr$1(t, i2);
  var n2 = this.n, o2 = new K(e), h3 = t.r, p3 = t.s, A2 = r2 & 1, v3 = r2 >> 1;
  if (h3.cmp(this.curve.p.umod(this.curve.n)) >= 0 && v3) throw new Error("Unable to find sencond key candinate");
  v3 ? h3 = this.curve.pointFromX(h3.add(this.curve.n), A2) : h3 = this.curve.pointFromX(h3, A2);
  var w2 = t.r.invm(n2), y3 = n2.sub(o2).mul(w2).umod(n2), S4 = p3.mul(w2).umod(n2);
  return this.g.mulAdd(y3, h3, S4);
}, ee$1.prototype.getKeyRecoveryParam = function(e, t, r2, i2) {
  if (t = new Jr$1(t, i2), t.recoveryParam !== null) return t.recoveryParam;
  for (var n2 = 0; n2 < 4; n2++) {
    var o2;
    try {
      o2 = this.recoverPubKey(e, t, n2);
    } catch {
      continue;
    }
    if (o2.eq(r2)) return n2;
  }
  throw new Error("Unable to find valid recovery factor");
};
var Va = lr$2(function(e, t) {
  var r2 = t;
  r2.version = "6.5.4", r2.utils = Gt$1, r2.rand = function() {
    throw new Error("unsupported");
  }, r2.curve = zr$1, r2.curves = jr, r2.ec = Ya, r2.eddsa = null;
}), Wa = Va.ec;
const Xa = "signing-key/5.7.0", ji = new z$3(Xa);
let Qi = null;
function ve$1() {
  return Qi || (Qi = new Wa("secp256k1")), Qi;
}
class Za {
  constructor(t) {
    wr$1(this, "curve", "secp256k1"), wr$1(this, "privateKey", Kt$1(t)), Os$1(this.privateKey) !== 32 && ji.throwArgumentError("invalid private key", "privateKey", "[[ REDACTED ]]");
    const r2 = ve$1().keyFromPrivate(Ot$1(this.privateKey));
    wr$1(this, "publicKey", "0x" + r2.getPublic(false, "hex")), wr$1(this, "compressedPublicKey", "0x" + r2.getPublic(true, "hex")), wr$1(this, "_isSigningKey", true);
  }
  _addPoint(t) {
    const r2 = ve$1().keyFromPublic(Ot$1(this.publicKey)), i2 = ve$1().keyFromPublic(Ot$1(t));
    return "0x" + r2.pub.add(i2.pub).encodeCompressed("hex");
  }
  signDigest(t) {
    const r2 = ve$1().keyFromPrivate(Ot$1(this.privateKey)), i2 = Ot$1(t);
    i2.length !== 32 && ji.throwArgumentError("bad digest length", "digest", t);
    const n2 = r2.sign(i2, { canonical: true });
    return Jn({ recoveryParam: n2.recoveryParam, r: oe$2("0x" + n2.r.toString(16), 32), s: oe$2("0x" + n2.s.toString(16), 32) });
  }
  computeSharedSecret(t) {
    const r2 = ve$1().keyFromPrivate(Ot$1(this.privateKey)), i2 = ve$1().keyFromPublic(Ot$1(kf(t)));
    return oe$2("0x" + r2.derive(i2.getPublic()).toString(16), 32);
  }
  static isSigningKey(t) {
    return !!(t && t._isSigningKey);
  }
}
function $a$1(e, t) {
  const r2 = Jn(t), i2 = { r: Ot$1(r2.r), s: Ot$1(r2.s) };
  return "0x" + ve$1().recoverPubKey(Ot$1(e), i2, r2.recoveryParam).encode("hex", false);
}
function kf(e, t) {
  const r2 = Ot$1(e);
  if (r2.length === 32) {
    const i2 = new Za(r2);
    return i2.publicKey;
  } else {
    if (r2.length === 33) return "0x" + ve$1().keyFromPublic(r2).getPublic(false, "hex");
    if (r2.length === 65) return Kt$1(r2);
  }
  return ji.throwArgumentError("invalid public or private key", "key", "[REDACTED]");
}
var qf;
(function(e) {
  e[e.legacy = 0] = "legacy", e[e.eip2930 = 1] = "eip2930", e[e.eip1559 = 2] = "eip1559";
})(qf || (qf = {}));
function eu(e) {
  const t = kf(e);
  return h0(Qn(Si(Qn(t, 1)), 12));
}
function ru(e, t) {
  return eu($a$1(Ot$1(e), t));
}
const iu = "https://rpc.walletconnect.com/v1";
async function Kf(e, t, r2, i2, n2, o2) {
  switch (r2.t) {
    case "eip191":
      return Hf(e, t, r2.s);
    case "eip1271":
      return await Lf(e, t, r2.s, i2, n2, o2);
    default:
      throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${r2.t}`);
  }
}
function Hf(e, t, r2) {
  return ru(uf(t), r2).toLowerCase() === e.toLowerCase();
}
async function Lf(e, t, r2, i2, n2, o2) {
  try {
    const h3 = "0x1626ba7e", p3 = "0000000000000000000000000000000000000000000000000000000000000040", A2 = "0000000000000000000000000000000000000000000000000000000000000041", v3 = r2.substring(2), w2 = uf(t).substring(2), y3 = h3 + w2 + p3 + A2 + v3, S4 = await fetch(`${o2 || iu}/?chainId=${i2}&projectId=${n2}`, { method: "POST", body: JSON.stringify({ id: nu(), jsonrpc: "2.0", method: "eth_call", params: [{ to: e, data: y3 }, "latest"] }) }), { result: I2 } = await S4.json();
    return I2 ? I2.slice(0, h3.length).toLowerCase() === h3.toLowerCase() : false;
  } catch (h3) {
    return console.error("isValidEip1271Signature: ", h3), false;
  }
}
function nu() {
  return Date.now() + Math.floor(Math.random() * 1e3);
}
var fu = Object.defineProperty, ou = Object.defineProperties, su = Object.getOwnPropertyDescriptors, zf = Object.getOwnPropertySymbols, au = Object.prototype.hasOwnProperty, uu = Object.prototype.propertyIsEnumerable, jf = (e, t, r2) => t in e ? fu(e, t, { enumerable: true, configurable: true, writable: true, value: r2 }) : e[t] = r2, Ji = (e, t) => {
  for (var r2 in t || (t = {})) au.call(t, r2) && jf(e, r2, t[r2]);
  if (zf) for (var r2 of zf(t)) uu.call(t, r2) && jf(e, r2, t[r2]);
  return e;
}, Qf = (e, t) => ou(e, su(t));
const hu = "did:pkh:", Gr = (e) => e == null ? void 0 : e.split(":"), Gi = (e) => {
  const t = e && Gr(e);
  if (t) return e.includes(hu) ? t[3] : t[1];
}, cu = (e) => {
  const t = e && Gr(e);
  if (t) return t[2] + ":" + t[3];
}, Yi = (e) => {
  const t = e && Gr(e);
  if (t) return t.pop();
};
async function lu(e) {
  const { cacao: t, projectId: r2 } = e, { s: i2, p: n2 } = t, o2 = Jf(n2, n2.iss), h3 = Yi(n2.iss);
  return await Kf(h3, o2, i2, Gi(n2.iss), r2);
}
const Jf = (e, t) => {
  const r2 = `${e.domain} wants you to sign in with your Ethereum account:`, i2 = Yi(t);
  if (!e.aud && !e.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
  let n2 = e.statement || void 0;
  const o2 = `URI: ${e.aud || e.uri}`, h3 = `Version: ${e.version}`, p3 = `Chain ID: ${Gi(t)}`, A2 = `Nonce: ${e.nonce}`, v3 = `Issued At: ${e.iat}`, w2 = e.exp ? `Expiration Time: ${e.exp}` : void 0, y3 = e.nbf ? `Not Before: ${e.nbf}` : void 0, S4 = e.requestId ? `Request ID: ${e.requestId}` : void 0, I2 = e.resources ? `Resources:${e.resources.map((C3) => `
- ${C3}`).join("")}` : void 0, N2 = Vr(e.resources);
  if (N2) {
    const C3 = Oe(N2);
    n2 = Xi(n2, C3);
  }
  return [r2, i2, "", n2, "", o2, h3, p3, A2, v3, w2, y3, S4, I2].filter((C3) => C3 != null).join(`
`);
};
function Wf(e) {
  return Buffer.from(JSON.stringify(e)).toString("base64");
}
function Xf(e) {
  return JSON.parse(Buffer.from(e, "base64").toString("utf-8"));
}
function ge(e) {
  if (!e) throw new Error("No recap provided, value is undefined");
  if (!e.att) throw new Error("No `att` property found");
  const t = Object.keys(e.att);
  if (!(t != null && t.length)) throw new Error("No resources found in `att` property");
  t.forEach((r2) => {
    const i2 = e.att[r2];
    if (Array.isArray(i2)) throw new Error(`Resource must be an object: ${r2}`);
    if (typeof i2 != "object") throw new Error(`Resource must be an object: ${r2}`);
    if (!Object.keys(i2).length) throw new Error(`Resource object is empty: ${r2}`);
    Object.keys(i2).forEach((n2) => {
      const o2 = i2[n2];
      if (!Array.isArray(o2)) throw new Error(`Ability limits ${n2} must be an array of objects, found: ${o2}`);
      if (!o2.length) throw new Error(`Value of ${n2} is empty array, must be an array with objects`);
      o2.forEach((h3) => {
        if (typeof h3 != "object") throw new Error(`Ability limits (${n2}) must be an array of objects, found: ${h3}`);
      });
    });
  });
}
function Zf(e, t, r2, i2 = {}) {
  return r2 == null ? void 0 : r2.sort((n2, o2) => n2.localeCompare(o2)), { att: { [e]: Vi(t, r2, i2) } };
}
function Vi(e, t, r2 = {}) {
  t = t == null ? void 0 : t.sort((n2, o2) => n2.localeCompare(o2));
  const i2 = t.map((n2) => ({ [`${e}/${n2}`]: [r2] }));
  return Object.assign({}, ...i2);
}
function Yr$1(e) {
  return ge(e), `urn:recap:${Wf(e).replace(/=/g, "")}`;
}
function Oe(e) {
  const t = Xf(e.replace("urn:recap:", ""));
  return ge(t), t;
}
function mu(e, t, r2) {
  const i2 = Zf(e, t, r2);
  return Yr$1(i2);
}
function Wi$1(e) {
  return e && e.includes("urn:recap:");
}
function Au(e, t) {
  const r2 = Oe(e), i2 = Oe(t), n2 = to(r2, i2);
  return Yr$1(n2);
}
function to(e, t) {
  ge(e), ge(t);
  const r2 = Object.keys(e.att).concat(Object.keys(t.att)).sort((n2, o2) => n2.localeCompare(o2)), i2 = { att: {} };
  return r2.forEach((n2) => {
    var o2, h3;
    Object.keys(((o2 = e.att) == null ? void 0 : o2[n2]) || {}).concat(Object.keys(((h3 = t.att) == null ? void 0 : h3[n2]) || {})).sort((p3, A2) => p3.localeCompare(A2)).forEach((p3) => {
      var A2, v3;
      i2.att[n2] = Qf(Ji({}, i2.att[n2]), { [p3]: ((A2 = e.att[n2]) == null ? void 0 : A2[p3]) || ((v3 = t.att[n2]) == null ? void 0 : v3[p3]) });
    });
  }), i2;
}
function Xi(e = "", t) {
  ge(t);
  const r2 = "I further authorize the stated URI to perform the following actions on my behalf: ";
  if (e.includes(r2)) return e;
  const i2 = [];
  let n2 = 0;
  Object.keys(t.att).forEach((p3) => {
    const A2 = Object.keys(t.att[p3]).map((y3) => ({ ability: y3.split("/")[0], action: y3.split("/")[1] }));
    A2.sort((y3, S4) => y3.action.localeCompare(S4.action));
    const v3 = {};
    A2.forEach((y3) => {
      v3[y3.ability] || (v3[y3.ability] = []), v3[y3.ability].push(y3.action);
    });
    const w2 = Object.keys(v3).map((y3) => (n2++, `(${n2}) '${y3}': '${v3[y3].join("', '")}' for '${p3}'.`));
    i2.push(w2.join(", ").replace(".,", "."));
  });
  const o2 = i2.join(" "), h3 = `${r2}${o2}`;
  return `${e ? e + " " : ""}${h3}`;
}
function bu(e) {
  var t;
  const r2 = Oe(e);
  ge(r2);
  const i2 = (t = r2.att) == null ? void 0 : t.eip155;
  return i2 ? Object.keys(i2).map((n2) => n2.split("/")[1]) : [];
}
function yu(e) {
  const t = Oe(e);
  ge(t);
  const r2 = [];
  return Object.values(t.att).forEach((i2) => {
    Object.values(i2).forEach((n2) => {
      var o2;
      (o2 = n2 == null ? void 0 : n2[0]) != null && o2.chains && r2.push(n2[0].chains);
    });
  }), [...new Set(r2.flat())];
}
function Vr(e) {
  if (!e) return;
  const t = e == null ? void 0 : e[e.length - 1];
  return Wi$1(t) ? t : void 0;
}
const Zi = "base10", Lt$2 = "base16", $i = "base64pad", wu = "base64url", dr$1 = "utf8", tn$1 = 0, pr$2 = 1, Sr$1 = 2, xu = 0, ro = 1, Nr$1 = 12, en$1 = 32;
function Mu() {
  const e = x25519.generateKeyPair();
  return { privateKey: toString(e.secretKey, Lt$2), publicKey: toString(e.publicKey, Lt$2) };
}
function Eu() {
  const e = random.randomBytes(en$1);
  return toString(e, Lt$2);
}
function Su(e, t) {
  const r2 = x25519.sharedKey(fromString(e, Lt$2), fromString(t, Lt$2), true), i2 = new HKDF_1(sha256.SHA256, r2).expand(en$1);
  return toString(i2, Lt$2);
}
function Nu(e) {
  const t = sha256.hash(fromString(e, Lt$2));
  return toString(t, Lt$2);
}
function Iu(e) {
  const t = sha256.hash(fromString(e, dr$1));
  return toString(t, Lt$2);
}
function rn$1(e) {
  return fromString(`${e}`, Zi);
}
function $e(e) {
  return Number(toString(e, Zi));
}
function _u(e) {
  const t = rn$1(typeof e.type < "u" ? e.type : tn$1);
  if ($e(t) === pr$2 && typeof e.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
  const r2 = typeof e.senderPublicKey < "u" ? fromString(e.senderPublicKey, Lt$2) : void 0, i2 = typeof e.iv < "u" ? fromString(e.iv, Lt$2) : random.randomBytes(Nr$1), n2 = new chacha20poly1305.ChaCha20Poly1305(fromString(e.symKey, Lt$2)).seal(i2, fromString(e.message, dr$1));
  return nn$1({ type: t, sealed: n2, iv: i2, senderPublicKey: r2, encoding: e.encoding });
}
function Bu(e, t) {
  const r2 = rn$1(Sr$1), i2 = random.randomBytes(Nr$1), n2 = fromString(e, dr$1);
  return nn$1({ type: r2, sealed: n2, iv: i2, encoding: t });
}
function Cu(e) {
  const t = new chacha20poly1305.ChaCha20Poly1305(fromString(e.symKey, Lt$2)), { sealed: r2, iv: i2 } = Wr$1({ encoded: e.encoded, encoding: e == null ? void 0 : e.encoding }), n2 = t.open(i2, r2);
  if (n2 === null) throw new Error("Failed to decrypt");
  return toString(n2, dr$1);
}
function Ru(e, t) {
  const { sealed: r2 } = Wr$1({ encoded: e, encoding: t });
  return toString(r2, dr$1);
}
function nn$1(e) {
  const { encoding: t = $i } = e;
  if ($e(e.type) === Sr$1) return toString(concat([e.type, e.sealed]), t);
  if ($e(e.type) === pr$2) {
    if (typeof e.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
    return toString(concat([e.type, e.senderPublicKey, e.iv, e.sealed]), t);
  }
  return toString(concat([e.type, e.iv, e.sealed]), t);
}
function Wr$1(e) {
  const { encoded: t, encoding: r2 = $i } = e, i2 = fromString(t, r2), n2 = i2.slice(xu, ro), o2 = ro;
  if ($e(n2) === pr$2) {
    const v3 = o2 + en$1, w2 = v3 + Nr$1, y3 = i2.slice(o2, v3), S4 = i2.slice(v3, w2), I2 = i2.slice(w2);
    return { type: n2, sealed: I2, iv: S4, senderPublicKey: y3 };
  }
  if ($e(n2) === Sr$1) {
    const v3 = i2.slice(o2), w2 = random.randomBytes(Nr$1);
    return { type: n2, sealed: v3, iv: w2 };
  }
  const h3 = o2 + Nr$1, p3 = i2.slice(o2, h3), A2 = i2.slice(h3);
  return { type: n2, sealed: A2, iv: p3 };
}
function Ou(e, t) {
  const r2 = Wr$1({ encoded: e, encoding: t == null ? void 0 : t.encoding });
  return io({ type: $e(r2.type), senderPublicKey: typeof r2.senderPublicKey < "u" ? toString(r2.senderPublicKey, Lt$2) : void 0, receiverPublicKey: t == null ? void 0 : t.receiverPublicKey });
}
function io(e) {
  const t = (e == null ? void 0 : e.type) || tn$1;
  if (t === pr$2) {
    if (typeof (e == null ? void 0 : e.senderPublicKey) > "u") throw new Error("missing sender public key");
    if (typeof (e == null ? void 0 : e.receiverPublicKey) > "u") throw new Error("missing receiver public key");
  }
  return { type: t, senderPublicKey: e == null ? void 0 : e.senderPublicKey, receiverPublicKey: e == null ? void 0 : e.receiverPublicKey };
}
function Pu(e) {
  return e.type === pr$2 && typeof e.senderPublicKey == "string" && typeof e.receiverPublicKey == "string";
}
function Du(e) {
  return e.type === Sr$1;
}
function no(e) {
  return new elliptic.ec("p256").keyFromPublic({ x: Buffer.from(e.x, "base64").toString("hex"), y: Buffer.from(e.y, "base64").toString("hex") }, "hex");
}
function Fu(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/");
  const r2 = t.length % 4;
  return r2 > 0 && (t += "=".repeat(4 - r2)), t;
}
function Tu(e) {
  return Buffer.from(Fu(e), "base64");
}
function Uu(e, t) {
  const [r2, i2, n2] = e.split("."), o2 = Tu(n2);
  if (o2.length !== 64) throw new Error("Invalid signature length");
  const h3 = o2.slice(0, 32).toString("hex"), p3 = o2.slice(32, 64).toString("hex"), A2 = `${r2}.${i2}`, v3 = new sha256.SHA256().update(Buffer.from(A2)).digest(), w2 = no(t), y3 = Buffer.from(v3).toString("hex");
  if (!w2.verify(y3, { r: h3, s: p3 })) throw new Error("Invalid signature");
  return decodeJWT(e).payload;
}
const fo = "irn";
function ku(e) {
  return (e == null ? void 0 : e.relay) || { protocol: fo };
}
function qu(e) {
  const t = C$3[e];
  if (typeof t > "u") throw new Error(`Relay Protocol not supported: ${e}`);
  return t;
}
var Ku = Object.defineProperty, Hu = Object.defineProperties, Lu = Object.getOwnPropertyDescriptors, oo = Object.getOwnPropertySymbols, zu = Object.prototype.hasOwnProperty, ju = Object.prototype.propertyIsEnumerable, so = (e, t, r2) => t in e ? Ku(e, t, { enumerable: true, configurable: true, writable: true, value: r2 }) : e[t] = r2, ao = (e, t) => {
  for (var r2 in t || (t = {})) zu.call(t, r2) && so(e, r2, t[r2]);
  if (oo) for (var r2 of oo(t)) ju.call(t, r2) && so(e, r2, t[r2]);
  return e;
}, Qu = (e, t) => Hu(e, Lu(t));
function uo(e, t = "-") {
  const r2 = {}, i2 = "relay" + t;
  return Object.keys(e).forEach((n2) => {
    if (n2.startsWith(i2)) {
      const o2 = n2.replace(i2, ""), h3 = e[n2];
      r2[o2] = h3;
    }
  }), r2;
}
function Ju(e) {
  e = e.includes("wc://") ? e.replace("wc://", "") : e, e = e.includes("wc:") ? e.replace("wc:", "") : e;
  const t = e.indexOf(":"), r2 = e.indexOf("?") !== -1 ? e.indexOf("?") : void 0, i2 = e.substring(0, t), n2 = e.substring(t + 1, r2).split("@"), o2 = typeof r2 < "u" ? e.substring(r2) : "", h3 = queryString.parse(o2), p3 = typeof h3.methods == "string" ? h3.methods.split(",") : void 0;
  return { protocol: i2, topic: ho(n2[0]), version: parseInt(n2[1], 10), symKey: h3.symKey, relay: uo(h3), methods: p3, expiryTimestamp: h3.expiryTimestamp ? parseInt(h3.expiryTimestamp, 10) : void 0 };
}
function ho(e) {
  return e.startsWith("//") ? e.substring(2) : e;
}
function co(e, t = "-") {
  const r2 = "relay", i2 = {};
  return Object.keys(e).forEach((n2) => {
    const o2 = r2 + t + n2;
    e[n2] && (i2[o2] = e[n2]);
  }), i2;
}
function Gu(e) {
  return `${e.protocol}:${e.topic}@${e.version}?` + queryString.stringify(ao(Qu(ao({ symKey: e.symKey }, co(e.relay)), { expiryTimestamp: e.expiryTimestamp }), e.methods ? { methods: e.methods.join(",") } : {}));
}
function Yu(e, t, r2) {
  return `${e}?wc_ev=${r2}&topic=${t}`;
}
function tr$1(e) {
  const t = [];
  return e.forEach((r2) => {
    const [i2, n2] = r2.split(":");
    t.push(`${i2}:${n2}`);
  }), t;
}
function vo(e) {
  const t = [];
  return Object.values(e).forEach((r2) => {
    t.push(...tr$1(r2.accounts));
  }), t;
}
function go(e, t) {
  const r2 = [];
  return Object.values(e).forEach((i2) => {
    tr$1(i2.accounts).includes(t) && r2.push(...i2.methods);
  }), r2;
}
function mo(e, t) {
  const r2 = [];
  return Object.values(e).forEach((i2) => {
    tr$1(i2.accounts).includes(t) && r2.push(...i2.events);
  }), r2;
}
function fn$1(e) {
  return e.includes(":");
}
function Ao(e) {
  return fn$1(e) ? e.split(":")[0] : e;
}
function bo(e) {
  const t = {};
  return e == null ? void 0 : e.forEach((r2) => {
    const [i2, n2] = r2.split(":");
    t[i2] || (t[i2] = { accounts: [], chains: [], events: [] }), t[i2].accounts.push(r2), t[i2].chains.push(`${i2}:${n2}`);
  }), t;
}
function nh(e, t) {
  t = t.map((i2) => i2.replace("did:pkh:", ""));
  const r2 = bo(t);
  for (const [i2, n2] of Object.entries(r2)) n2.methods ? n2.methods = me$1(n2.methods, e) : n2.methods = e, n2.events = ["chainChanged", "accountsChanged"];
  return r2;
}
const yo = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } }, wo = { NOT_INITIALIZED: { message: "Not initialized.", code: 1 }, NO_MATCHING_KEY: { message: "No matching key.", code: 2 }, RESTORE_WILL_OVERRIDE: { message: "Restore will override.", code: 3 }, RESUBSCRIBED: { message: "Resubscribed.", code: 4 }, MISSING_OR_INVALID: { message: "Missing or invalid.", code: 5 }, EXPIRED: { message: "Expired.", code: 6 }, UNKNOWN_TYPE: { message: "Unknown type.", code: 7 }, MISMATCHED_TOPIC: { message: "Mismatched topic.", code: 8 }, NON_CONFORMING_NAMESPACES: { message: "Non conforming namespaces.", code: 9 } };
function xe(e, t) {
  const { message: r2, code: i2 } = wo[e];
  return { message: t ? `${r2} ${t}` : r2, code: i2 };
}
function er$1(e, t) {
  const { message: r2, code: i2 } = yo[e];
  return { message: t ? `${r2} ${t}` : r2, code: i2 };
}
function Ir$1(e, t) {
  return Array.isArray(e) ? true : false;
}
function Xr$1(e) {
  return Object.getPrototypeOf(e) === Object.prototype && Object.keys(e).length;
}
function Pe(e) {
  return typeof e > "u";
}
function Yt$1(e, t) {
  return t && Pe(e) ? true : typeof e == "string" && !!e.trim().length;
}
function Zr$1(e, t) {
  return t && Pe(e) ? true : typeof e == "number" && !isNaN(e);
}
function fh(e, t) {
  const { requiredNamespaces: r2 } = t, i2 = Object.keys(e.namespaces), n2 = Object.keys(r2);
  let o2 = true;
  return _e$3(n2, i2) ? (i2.forEach((h3) => {
    const { accounts: p3, methods: A2, events: v3 } = e.namespaces[h3], w2 = tr$1(p3), y3 = r2[h3];
    (!_e$3(Or$1(h3, y3), w2) || !_e$3(y3.methods, A2) || !_e$3(y3.events, v3)) && (o2 = false);
  }), o2) : false;
}
function _r$1(e) {
  return Yt$1(e, false) && e.includes(":") ? e.split(":").length === 2 : false;
}
function xo(e) {
  if (Yt$1(e, false) && e.includes(":")) {
    const t = e.split(":");
    if (t.length === 3) {
      const r2 = t[0] + ":" + t[1];
      return !!t[2] && _r$1(r2);
    }
  }
  return false;
}
function oh(e) {
  if (Yt$1(e, false)) try {
    return typeof new URL(e) < "u";
  } catch {
    return false;
  }
  return false;
}
function sh(e) {
  var t;
  return (t = e == null ? void 0 : e.proposer) == null ? void 0 : t.publicKey;
}
function ah(e) {
  return e == null ? void 0 : e.topic;
}
function uh(e, t) {
  let r2 = null;
  return Yt$1(e == null ? void 0 : e.publicKey, false) || (r2 = xe("MISSING_OR_INVALID", `${t} controller public key should be a string`)), r2;
}
function sn$1(e) {
  let t = true;
  return Ir$1(e) ? e.length && (t = e.every((r2) => Yt$1(r2, false))) : t = false, t;
}
function Mo(e, t, r2) {
  let i2 = null;
  return Ir$1(t) && t.length ? t.forEach((n2) => {
    i2 || _r$1(n2) || (i2 = er$1("UNSUPPORTED_CHAINS", `${r2}, chain ${n2} should be a string and conform to "namespace:chainId" format`));
  }) : _r$1(e) || (i2 = er$1("UNSUPPORTED_CHAINS", `${r2}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), i2;
}
function Eo(e, t, r2) {
  let i2 = null;
  return Object.entries(e).forEach(([n2, o2]) => {
    if (i2) return;
    const h3 = Mo(n2, Or$1(n2, o2), `${t} ${r2}`);
    h3 && (i2 = h3);
  }), i2;
}
function So(e, t) {
  let r2 = null;
  return Ir$1(e) ? e.forEach((i2) => {
    r2 || xo(i2) || (r2 = er$1("UNSUPPORTED_ACCOUNTS", `${t}, account ${i2} should be a string and conform to "namespace:chainId:address" format`));
  }) : r2 = er$1("UNSUPPORTED_ACCOUNTS", `${t}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), r2;
}
function No(e, t) {
  let r2 = null;
  return Object.values(e).forEach((i2) => {
    if (r2) return;
    const n2 = So(i2 == null ? void 0 : i2.accounts, `${t} namespace`);
    n2 && (r2 = n2);
  }), r2;
}
function Io(e, t) {
  let r2 = null;
  return sn$1(e == null ? void 0 : e.methods) ? sn$1(e == null ? void 0 : e.events) || (r2 = er$1("UNSUPPORTED_EVENTS", `${t}, events should be an array of strings or empty array for no events`)) : r2 = er$1("UNSUPPORTED_METHODS", `${t}, methods should be an array of strings or empty array for no methods`), r2;
}
function an$1(e, t) {
  let r2 = null;
  return Object.values(e).forEach((i2) => {
    if (r2) return;
    const n2 = Io(i2, `${t}, namespace`);
    n2 && (r2 = n2);
  }), r2;
}
function hh(e, t, r2) {
  let i2 = null;
  if (e && Xr$1(e)) {
    const n2 = an$1(e, t);
    n2 && (i2 = n2);
    const o2 = Eo(e, t, r2);
    o2 && (i2 = o2);
  } else i2 = xe("MISSING_OR_INVALID", `${t}, ${r2} should be an object with data`);
  return i2;
}
function _o(e, t) {
  let r2 = null;
  if (e && Xr$1(e)) {
    const i2 = an$1(e, t);
    i2 && (r2 = i2);
    const n2 = No(e, t);
    n2 && (r2 = n2);
  } else r2 = xe("MISSING_OR_INVALID", `${t}, namespaces should be an object with data`);
  return r2;
}
function Bo(e) {
  return Yt$1(e.protocol, true);
}
function ch(e, t) {
  let r2 = false;
  return !e ? r2 = true : e && Ir$1(e) && e.length && e.forEach((i2) => {
    r2 = Bo(i2);
  }), r2;
}
function lh(e) {
  return typeof e == "number";
}
function dh(e) {
  return typeof e < "u" && typeof e !== null;
}
function ph(e) {
  return !(!e || typeof e != "object" || !e.code || !Zr$1(e.code, false) || !e.message || !Yt$1(e.message, false));
}
function vh(e) {
  return !(Pe(e) || !Yt$1(e.method, false));
}
function gh(e) {
  return !(Pe(e) || Pe(e.result) && Pe(e.error) || !Zr$1(e.id, false) || !Yt$1(e.jsonrpc, false));
}
function mh(e) {
  return !(Pe(e) || !Yt$1(e.name, false));
}
function Ah(e, t) {
  return !(!_r$1(t) || !vo(e).includes(t));
}
function bh(e, t, r2) {
  return Yt$1(r2, false) ? go(e, t).includes(r2) : false;
}
function yh(e, t, r2) {
  return Yt$1(r2, false) ? mo(e, t).includes(r2) : false;
}
function Co(e, t, r2) {
  let i2 = null;
  const n2 = wh(e), o2 = xh(t), h3 = Object.keys(n2), p3 = Object.keys(o2), A2 = Ro(Object.keys(e)), v3 = Ro(Object.keys(t)), w2 = A2.filter((y3) => !v3.includes(y3));
  return w2.length && (i2 = xe("NON_CONFORMING_NAMESPACES", `${r2} namespaces keys don't satisfy requiredNamespaces.
      Required: ${w2.toString()}
      Received: ${Object.keys(t).toString()}`)), _e$3(h3, p3) || (i2 = xe("NON_CONFORMING_NAMESPACES", `${r2} namespaces chains don't satisfy required namespaces.
      Required: ${h3.toString()}
      Approved: ${p3.toString()}`)), Object.keys(t).forEach((y3) => {
    if (!y3.includes(":") || i2) return;
    const S4 = tr$1(t[y3].accounts);
    S4.includes(y3) || (i2 = xe("NON_CONFORMING_NAMESPACES", `${r2} namespaces accounts don't satisfy namespace accounts for ${y3}
        Required: ${y3}
        Approved: ${S4.toString()}`));
  }), h3.forEach((y3) => {
    i2 || (_e$3(n2[y3].methods, o2[y3].methods) ? _e$3(n2[y3].events, o2[y3].events) || (i2 = xe("NON_CONFORMING_NAMESPACES", `${r2} namespaces events don't satisfy namespace events for ${y3}`)) : i2 = xe("NON_CONFORMING_NAMESPACES", `${r2} namespaces methods don't satisfy namespace methods for ${y3}`));
  }), i2;
}
function wh(e) {
  const t = {};
  return Object.keys(e).forEach((r2) => {
    var i2;
    r2.includes(":") ? t[r2] = e[r2] : (i2 = e[r2].chains) == null || i2.forEach((n2) => {
      t[n2] = { methods: e[r2].methods, events: e[r2].events };
    });
  }), t;
}
function Ro(e) {
  return [...new Set(e.map((t) => t.includes(":") ? t.split(":")[0] : t))];
}
function xh(e) {
  const t = {};
  return Object.keys(e).forEach((r2) => {
    if (r2.includes(":")) t[r2] = e[r2];
    else {
      const i2 = tr$1(e[r2].accounts);
      i2 == null ? void 0 : i2.forEach((n2) => {
        t[n2] = { accounts: e[r2].accounts.filter((o2) => o2.includes(`${n2}:`)), methods: e[r2].methods, events: e[r2].events };
      });
    }
  }), t;
}
function Mh(e, t) {
  return Zr$1(e, false) && e <= t.max && e >= t.min;
}
function Eh() {
  const e = We$1();
  return new Promise((t) => {
    switch (e) {
      case qt$1.browser:
        t(Oo());
        break;
      case qt$1.reactNative:
        t(Po());
        break;
      case qt$1.node:
        t(Do());
        break;
      default:
        t(true);
    }
  });
}
function Oo() {
  return gr$1() && (navigator == null ? void 0 : navigator.onLine);
}
async function Po() {
  if (rr$1() && typeof global < "u" && global != null && global.NetInfo) {
    const e = await (global == null ? void 0 : global.NetInfo.fetch());
    return e == null ? void 0 : e.isConnected;
  }
  return true;
}
function Do() {
  return true;
}
function Sh(e) {
  switch (We$1()) {
    case qt$1.browser:
      Fo(e);
      break;
    case qt$1.reactNative:
      To(e);
      break;
  }
}
function Fo(e) {
  !rr$1() && gr$1() && (window.addEventListener("online", () => e(true)), window.addEventListener("offline", () => e(false)));
}
function To(e) {
  rr$1() && typeof global < "u" && global != null && global.NetInfo && (global == null ? void 0 : global.NetInfo.addEventListener((t) => e(t == null ? void 0 : t.isConnected)));
}
const un$1 = {};
class Nh {
  static get(t) {
    return un$1[t];
  }
  static set(t, r2) {
    un$1[t] = r2;
  }
  static delete(t) {
    delete un$1[t];
  }
}
function tryStringify(o2) {
  try {
    return JSON.stringify(o2);
  } catch (e) {
    return '"[Circular]"';
  }
}
var quickFormatUnescaped = format$1;
function format$1(f3, args, opts) {
  var ss2 = opts && opts.stringify || tryStringify;
  var offset = 1;
  if (typeof f3 === "object" && f3 !== null) {
    var len = args.length + offset;
    if (len === 1) return f3;
    var objects = new Array(len);
    objects[0] = ss2(f3);
    for (var index = 1; index < len; index++) {
      objects[index] = ss2(args[index]);
    }
    return objects.join(" ");
  }
  if (typeof f3 !== "string") {
    return f3;
  }
  var argLen = args.length;
  if (argLen === 0) return f3;
  var str = "";
  var a3 = 1 - offset;
  var lastPos = -1;
  var flen = f3 && f3.length || 0;
  for (var i2 = 0; i2 < flen; ) {
    if (f3.charCodeAt(i2) === 37 && i2 + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0;
      switch (f3.charCodeAt(i2 + 1)) {
        case 100:
        case 102:
          if (a3 >= argLen)
            break;
          if (args[a3] == null) break;
          if (lastPos < i2)
            str += f3.slice(lastPos, i2);
          str += Number(args[a3]);
          lastPos = i2 + 2;
          i2++;
          break;
        case 105:
          if (a3 >= argLen)
            break;
          if (args[a3] == null) break;
          if (lastPos < i2)
            str += f3.slice(lastPos, i2);
          str += Math.floor(Number(args[a3]));
          lastPos = i2 + 2;
          i2++;
          break;
        case 79:
        case 111:
        case 106:
          if (a3 >= argLen)
            break;
          if (args[a3] === void 0) break;
          if (lastPos < i2)
            str += f3.slice(lastPos, i2);
          var type = typeof args[a3];
          if (type === "string") {
            str += "'" + args[a3] + "'";
            lastPos = i2 + 2;
            i2++;
            break;
          }
          if (type === "function") {
            str += args[a3].name || "<anonymous>";
            lastPos = i2 + 2;
            i2++;
            break;
          }
          str += ss2(args[a3]);
          lastPos = i2 + 2;
          i2++;
          break;
        case 115:
          if (a3 >= argLen)
            break;
          if (lastPos < i2)
            str += f3.slice(lastPos, i2);
          str += String(args[a3]);
          lastPos = i2 + 2;
          i2++;
          break;
        case 37:
          if (lastPos < i2)
            str += f3.slice(lastPos, i2);
          str += "%";
          lastPos = i2 + 2;
          i2++;
          a3--;
          break;
      }
      ++a3;
    }
    ++i2;
  }
  if (lastPos === -1)
    return f3;
  else if (lastPos < flen) {
    str += f3.slice(lastPos);
  }
  return str;
}
const format = quickFormatUnescaped;
var browser = pino;
const _console = pfGlobalThisOrFallback().console || {};
const stdSerializers = {
  mapHttpRequest: mock,
  mapHttpResponse: mock,
  wrapRequestSerializer: passthrough,
  wrapResponseSerializer: passthrough,
  wrapErrorSerializer: passthrough,
  req: mock,
  res: mock,
  err: asErrValue
};
function shouldSerialize(serialize, serializers) {
  if (Array.isArray(serialize)) {
    const hasToFilter = serialize.filter(function(k2) {
      return k2 !== "!stdSerializers.err";
    });
    return hasToFilter;
  } else if (serialize === true) {
    return Object.keys(serializers);
  }
  return false;
}
function pino(opts) {
  opts = opts || {};
  opts.browser = opts.browser || {};
  const transmit2 = opts.browser.transmit;
  if (transmit2 && typeof transmit2.send !== "function") {
    throw Error("pino: transmit option must have a send function");
  }
  const proto = opts.browser.write || _console;
  if (opts.browser.write) opts.browser.asObject = true;
  const serializers = opts.serializers || {};
  const serialize = shouldSerialize(opts.browser.serialize, serializers);
  let stdErrSerialize = opts.browser.serialize;
  if (Array.isArray(opts.browser.serialize) && opts.browser.serialize.indexOf("!stdSerializers.err") > -1) stdErrSerialize = false;
  const levels = ["error", "fatal", "warn", "info", "debug", "trace"];
  if (typeof proto === "function") {
    proto.error = proto.fatal = proto.warn = proto.info = proto.debug = proto.trace = proto;
  }
  if (opts.enabled === false) opts.level = "silent";
  const level = opts.level || "info";
  const logger = Object.create(proto);
  if (!logger.log) logger.log = noop;
  Object.defineProperty(logger, "levelVal", {
    get: getLevelVal
  });
  Object.defineProperty(logger, "level", {
    get: getLevel,
    set: setLevel
  });
  const setOpts = {
    transmit: transmit2,
    serialize,
    asObject: opts.browser.asObject,
    levels,
    timestamp: getTimeFunction(opts)
  };
  logger.levels = pino.levels;
  logger.level = level;
  logger.setMaxListeners = logger.getMaxListeners = logger.emit = logger.addListener = logger.on = logger.prependListener = logger.once = logger.prependOnceListener = logger.removeListener = logger.removeAllListeners = logger.listeners = logger.listenerCount = logger.eventNames = logger.write = logger.flush = noop;
  logger.serializers = serializers;
  logger._serialize = serialize;
  logger._stdErrSerialize = stdErrSerialize;
  logger.child = child;
  if (transmit2) logger._logEvent = createLogEventShape();
  function getLevelVal() {
    return this.level === "silent" ? Infinity : this.levels.values[this.level];
  }
  function getLevel() {
    return this._level;
  }
  function setLevel(level2) {
    if (level2 !== "silent" && !this.levels.values[level2]) {
      throw Error("unknown level " + level2);
    }
    this._level = level2;
    set(setOpts, logger, "error", "log");
    set(setOpts, logger, "fatal", "error");
    set(setOpts, logger, "warn", "error");
    set(setOpts, logger, "info", "log");
    set(setOpts, logger, "debug", "log");
    set(setOpts, logger, "trace", "log");
  }
  function child(bindings, childOptions) {
    if (!bindings) {
      throw new Error("missing bindings for child Pino");
    }
    childOptions = childOptions || {};
    if (serialize && bindings.serializers) {
      childOptions.serializers = bindings.serializers;
    }
    const childOptionsSerializers = childOptions.serializers;
    if (serialize && childOptionsSerializers) {
      var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
      var childSerialize = opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
      delete bindings.serializers;
      applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
    }
    function Child(parent) {
      this._childLevel = (parent._childLevel | 0) + 1;
      this.error = bind(parent, bindings, "error");
      this.fatal = bind(parent, bindings, "fatal");
      this.warn = bind(parent, bindings, "warn");
      this.info = bind(parent, bindings, "info");
      this.debug = bind(parent, bindings, "debug");
      this.trace = bind(parent, bindings, "trace");
      if (childSerializers) {
        this.serializers = childSerializers;
        this._serialize = childSerialize;
      }
      if (transmit2) {
        this._logEvent = createLogEventShape(
          [].concat(parent._logEvent.bindings, bindings)
        );
      }
    }
    Child.prototype = this;
    return new Child(this);
  }
  return logger;
}
pino.levels = {
  values: {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10
  },
  labels: {
    10: "trace",
    20: "debug",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal"
  }
};
pino.stdSerializers = stdSerializers;
pino.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
function set(opts, logger, level, fallback) {
  const proto = Object.getPrototypeOf(logger);
  logger[level] = logger.levelVal > logger.levels.values[level] ? noop : proto[level] ? proto[level] : _console[level] || _console[fallback] || noop;
  wrap(opts, logger, level);
}
function wrap(opts, logger, level) {
  if (!opts.transmit && logger[level] === noop) return;
  logger[level] = /* @__PURE__ */ function(write) {
    return function LOG() {
      const ts2 = opts.timestamp();
      const args = new Array(arguments.length);
      const proto = Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
      for (var i2 = 0; i2 < args.length; i2++) args[i2] = arguments[i2];
      if (opts.serialize && !opts.asObject) {
        applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
      }
      if (opts.asObject) write.call(proto, asObject(this, level, args, ts2));
      else write.apply(proto, args);
      if (opts.transmit) {
        const transmitLevel = opts.transmit.level || logger.level;
        const transmitValue = pino.levels.values[transmitLevel];
        const methodValue = pino.levels.values[level];
        if (methodValue < transmitValue) return;
        transmit(this, {
          ts: ts2,
          methodLevel: level,
          methodValue,
          transmitValue: pino.levels.values[opts.transmit.level || logger.level],
          send: opts.transmit.send,
          val: logger.levelVal
        }, args);
      }
    };
  }(logger[level]);
}
function asObject(logger, level, args, ts2) {
  if (logger._serialize) applySerializers(args, logger._serialize, logger.serializers, logger._stdErrSerialize);
  const argsCloned = args.slice();
  let msg = argsCloned[0];
  const o2 = {};
  if (ts2) {
    o2.time = ts2;
  }
  o2.level = pino.levels.values[level];
  let lvl = (logger._childLevel | 0) + 1;
  if (lvl < 1) lvl = 1;
  if (msg !== null && typeof msg === "object") {
    while (lvl-- && typeof argsCloned[0] === "object") {
      Object.assign(o2, argsCloned.shift());
    }
    msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
  } else if (typeof msg === "string") msg = format(argsCloned.shift(), argsCloned);
  if (msg !== void 0) o2.msg = msg;
  return o2;
}
function applySerializers(args, serialize, serializers, stdErrSerialize) {
  for (const i2 in args) {
    if (stdErrSerialize && args[i2] instanceof Error) {
      args[i2] = pino.stdSerializers.err(args[i2]);
    } else if (typeof args[i2] === "object" && !Array.isArray(args[i2])) {
      for (const k2 in args[i2]) {
        if (serialize && serialize.indexOf(k2) > -1 && k2 in serializers) {
          args[i2][k2] = serializers[k2](args[i2][k2]);
        }
      }
    }
  }
}
function bind(parent, bindings, level) {
  return function() {
    const args = new Array(1 + arguments.length);
    args[0] = bindings;
    for (var i2 = 1; i2 < args.length; i2++) {
      args[i2] = arguments[i2 - 1];
    }
    return parent[level].apply(this, args);
  };
}
function transmit(logger, opts, args) {
  const send = opts.send;
  const ts2 = opts.ts;
  const methodLevel = opts.methodLevel;
  const methodValue = opts.methodValue;
  const val = opts.val;
  const bindings = logger._logEvent.bindings;
  applySerializers(
    args,
    logger._serialize || Object.keys(logger.serializers),
    logger.serializers,
    logger._stdErrSerialize === void 0 ? true : logger._stdErrSerialize
  );
  logger._logEvent.ts = ts2;
  logger._logEvent.messages = args.filter(function(arg) {
    return bindings.indexOf(arg) === -1;
  });
  logger._logEvent.level.label = methodLevel;
  logger._logEvent.level.value = methodValue;
  send(methodLevel, logger._logEvent, val);
  logger._logEvent = createLogEventShape(bindings);
}
function createLogEventShape(bindings) {
  return {
    ts: 0,
    messages: [],
    bindings: bindings || [],
    level: { label: "", value: 0 }
  };
}
function asErrValue(err) {
  const obj = {
    type: err.constructor.name,
    msg: err.message,
    stack: err.stack
  };
  for (const key2 in err) {
    if (obj[key2] === void 0) {
      obj[key2] = err[key2];
    }
  }
  return obj;
}
function getTimeFunction(opts) {
  if (typeof opts.timestamp === "function") {
    return opts.timestamp;
  }
  if (opts.timestamp === false) {
    return nullTime;
  }
  return epochTime;
}
function mock() {
  return {};
}
function passthrough(a3) {
  return a3;
}
function noop() {
}
function nullTime() {
  return false;
}
function epochTime() {
  return Date.now();
}
function unixTime() {
  return Math.round(Date.now() / 1e3);
}
function isoTime() {
  return new Date(Date.now()).toISOString();
}
function pfGlobalThisOrFallback() {
  function defd(o2) {
    return typeof o2 !== "undefined" && o2;
  }
  try {
    if (typeof globalThis !== "undefined") return globalThis;
    Object.defineProperty(Object.prototype, "globalThis", {
      get: function() {
        delete Object.prototype.globalThis;
        return this.globalThis = this;
      },
      configurable: true
    });
    return globalThis;
  } catch (e) {
    return defd(self) || defd(window) || defd(this) || {};
  }
}
const Wg = /* @__PURE__ */ getDefaultExportFromCjs(browser);
const c = { level: "info" }, n$1 = "custom_context", l = 1e3 * 1024;
let O$2 = class O {
  constructor(e) {
    this.nodeValue = e, this.sizeInBytes = new TextEncoder().encode(this.nodeValue).length, this.next = null;
  }
  get value() {
    return this.nodeValue;
  }
  get size() {
    return this.sizeInBytes;
  }
};
let d$1 = class d {
  constructor(e) {
    this.head = null, this.tail = null, this.lengthInNodes = 0, this.maxSizeInBytes = e, this.sizeInBytes = 0;
  }
  append(e) {
    const t = new O$2(e);
    if (t.size > this.maxSizeInBytes) throw new Error(`[LinkedList] Value too big to insert into list: ${e} with size ${t.size}`);
    for (; this.size + t.size > this.maxSizeInBytes; ) this.shift();
    this.head ? (this.tail && (this.tail.next = t), this.tail = t) : (this.head = t, this.tail = t), this.lengthInNodes++, this.sizeInBytes += t.size;
  }
  shift() {
    if (!this.head) return;
    const e = this.head;
    this.head = this.head.next, this.head || (this.tail = null), this.lengthInNodes--, this.sizeInBytes -= e.size;
  }
  toArray() {
    const e = [];
    let t = this.head;
    for (; t !== null; ) e.push(t.value), t = t.next;
    return e;
  }
  get length() {
    return this.lengthInNodes;
  }
  get size() {
    return this.sizeInBytes;
  }
  toOrderedArray() {
    return Array.from(this);
  }
  [Symbol.iterator]() {
    let e = this.head;
    return { next: () => {
      if (!e) return { done: true, value: null };
      const t = e.value;
      return e = e.next, { done: false, value: t };
    } };
  }
};
let L$2 = class L {
  constructor(e, t = l) {
    this.level = e ?? "error", this.levelValue = browser.levels.values[this.level], this.MAX_LOG_SIZE_IN_BYTES = t, this.logs = new d$1(this.MAX_LOG_SIZE_IN_BYTES);
  }
  forwardToConsole(e, t) {
    t === browser.levels.values.error ? console.error(e) : t === browser.levels.values.warn ? console.warn(e) : t === browser.levels.values.debug ? console.debug(e) : t === browser.levels.values.trace ? console.trace(e) : console.log(e);
  }
  appendToLogs(e) {
    this.logs.append(safeJsonStringify({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), log: e }));
    const t = typeof e == "string" ? JSON.parse(e).level : e.level;
    t >= this.levelValue && this.forwardToConsole(e, t);
  }
  getLogs() {
    return this.logs;
  }
  clearLogs() {
    this.logs = new d$1(this.MAX_LOG_SIZE_IN_BYTES);
  }
  getLogArray() {
    return Array.from(this.logs);
  }
  logsToBlob(e) {
    const t = this.getLogArray();
    return t.push(safeJsonStringify({ extraMetadata: e })), new Blob(t, { type: "application/json" });
  }
};
let m$1 = class m {
  constructor(e, t = l) {
    this.baseChunkLogger = new L$2(e, t);
  }
  write(e) {
    this.baseChunkLogger.appendToLogs(e);
  }
  getLogs() {
    return this.baseChunkLogger.getLogs();
  }
  clearLogs() {
    this.baseChunkLogger.clearLogs();
  }
  getLogArray() {
    return this.baseChunkLogger.getLogArray();
  }
  logsToBlob(e) {
    return this.baseChunkLogger.logsToBlob(e);
  }
  downloadLogsBlobInBrowser(e) {
    const t = URL.createObjectURL(this.logsToBlob(e)), o2 = document.createElement("a");
    o2.href = t, o2.download = `walletconnect-logs-${(/* @__PURE__ */ new Date()).toISOString()}.txt`, document.body.appendChild(o2), o2.click(), document.body.removeChild(o2), URL.revokeObjectURL(t);
  }
};
class B {
  constructor(e, t = l) {
    this.baseChunkLogger = new L$2(e, t);
  }
  write(e) {
    this.baseChunkLogger.appendToLogs(e);
  }
  getLogs() {
    return this.baseChunkLogger.getLogs();
  }
  clearLogs() {
    this.baseChunkLogger.clearLogs();
  }
  getLogArray() {
    return this.baseChunkLogger.getLogArray();
  }
  logsToBlob(e) {
    return this.baseChunkLogger.logsToBlob(e);
  }
}
var x$2 = Object.defineProperty, S$2 = Object.defineProperties, _ = Object.getOwnPropertyDescriptors, p$2 = Object.getOwnPropertySymbols, T$2 = Object.prototype.hasOwnProperty, z$2 = Object.prototype.propertyIsEnumerable, f$2 = (r2, e, t) => e in r2 ? x$2(r2, e, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e] = t, i = (r2, e) => {
  for (var t in e || (e = {})) T$2.call(e, t) && f$2(r2, t, e[t]);
  if (p$2) for (var t of p$2(e)) z$2.call(e, t) && f$2(r2, t, e[t]);
  return r2;
}, g$2 = (r2, e) => S$2(r2, _(e));
function k(r2) {
  return g$2(i({}, r2), { level: (r2 == null ? void 0 : r2.level) || c.level });
}
function v$3(r2, e = n$1) {
  return r2[e] || "";
}
function b$2(r2, e, t = n$1) {
  return r2[t] = e, r2;
}
function y$3(r2, e = n$1) {
  let t = "";
  return typeof r2.bindings > "u" ? t = v$3(r2, e) : t = r2.bindings().context || "", t;
}
function w$2(r2, e, t = n$1) {
  const o2 = y$3(r2, t);
  return o2.trim() ? `${o2}/${e}` : e;
}
function E$1(r2, e, t = n$1) {
  const o2 = w$2(r2, e, t), a3 = r2.child({ context: o2 });
  return b$2(a3, o2, t);
}
function C$2(r2) {
  var e, t;
  const o2 = new m$1((e = r2.opts) == null ? void 0 : e.level, r2.maxSizeInBytes);
  return { logger: Wg(g$2(i({}, r2.opts), { level: "trace", browser: g$2(i({}, (t = r2.opts) == null ? void 0 : t.browser), { write: (a3) => o2.write(a3) }) })), chunkLoggerController: o2 };
}
function I$1(r2) {
  var e;
  const t = new B((e = r2.opts) == null ? void 0 : e.level, r2.maxSizeInBytes);
  return { logger: Wg(g$2(i({}, r2.opts), { level: "trace" }), t), chunkLoggerController: t };
}
function A$1(r2) {
  return typeof r2.loggerOverride < "u" && typeof r2.loggerOverride != "string" ? { logger: r2.loggerOverride, chunkLoggerController: null } : typeof window < "u" ? C$2(r2) : I$1(r2);
}
class n extends IEvents {
  constructor(s2) {
    super(), this.opts = s2, this.protocol = "wc", this.version = 2;
  }
}
let h$1 = class h extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t, this.records = /* @__PURE__ */ new Map();
  }
};
let a$1 = class a {
  constructor(s2, t) {
    this.logger = s2, this.core = t;
  }
};
let g$1 = class g extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
};
let u$1 = class u extends IEvents {
  constructor(s2) {
    super();
  }
};
let p$1 = class p {
  constructor(s2, t, e, f3) {
    this.core = s2, this.logger = t, this.name = e;
  }
};
class d2 extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
}
let x$1 = class x extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t;
  }
};
let y$2 = class y {
  constructor(s2, t, e) {
    this.core = s2, this.logger = t, this.store = e;
  }
};
let v$2 = class v {
  constructor(s2, t) {
    this.projectId = s2, this.logger = t;
  }
};
let C$1 = class C {
  constructor(s2, t, e) {
    this.core = s2, this.logger = t, this.telemetryEnabled = e;
  }
};
let S$1 = class S2 {
  constructor(s2) {
    this.opts = s2, this.protocol = "wc", this.version = 2;
  }
};
let M$1 = class M {
  constructor(s2) {
    this.client = s2;
  }
};
const w$1 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require("ws"), b$1 = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u", a2 = (c2) => c2.split("?")[0], h2 = 10, S3 = w$1();
let f$1 = class f {
  constructor(e) {
    if (this.url = e, this.events = new eventsExports.EventEmitter(), this.registering = false, !isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
    this.url = e;
  }
  get connected() {
    return typeof this.socket < "u";
  }
  get connecting() {
    return this.registering;
  }
  on(e, t) {
    this.events.on(e, t);
  }
  once(e, t) {
    this.events.once(e, t);
  }
  off(e, t) {
    this.events.off(e, t);
  }
  removeListener(e, t) {
    this.events.removeListener(e, t);
  }
  async open(e = this.url) {
    await this.register(e);
  }
  async close() {
    return new Promise((e, t) => {
      if (typeof this.socket > "u") {
        t(new Error("Connection already closed"));
        return;
      }
      this.socket.onclose = (n2) => {
        this.onClose(n2), e();
      }, this.socket.close();
    });
  }
  async send(e) {
    typeof this.socket > "u" && (this.socket = await this.register());
    try {
      this.socket.send(safeJsonStringify(e));
    } catch (t) {
      this.onError(e.id, t);
    }
  }
  register(e = this.url) {
    if (!isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
    if (this.registering) {
      const t = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n2, o2) => {
        this.events.once("register_error", (s2) => {
          this.resetMaxListeners(), o2(s2);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.socket > "u") return o2(new Error("WebSocket connection is missing or invalid"));
          n2(this.socket);
        });
      });
    }
    return this.url = e, this.registering = true, new Promise((t, n2) => {
      const o2 = new URLSearchParams(e).get("origin"), s2 = cjs$1.isReactNative() ? { headers: { origin: o2 } } : { rejectUnauthorized: !isLocalhostUrl(e) }, i2 = new S3(e, [], s2);
      b$1() ? i2.onerror = (r2) => {
        const l2 = r2;
        n2(this.emitError(l2.error));
      } : i2.on("error", (r2) => {
        n2(this.emitError(r2));
      }), i2.onopen = () => {
        this.onOpen(i2), t(i2);
      };
    });
  }
  onOpen(e) {
    e.onmessage = (t) => this.onPayload(t), e.onclose = (t) => this.onClose(t), this.socket = e, this.registering = false, this.events.emit("open");
  }
  onClose(e) {
    this.socket = void 0, this.registering = false, this.events.emit("close", e);
  }
  onPayload(e) {
    if (typeof e.data > "u") return;
    const t = typeof e.data == "string" ? safeJsonParse(e.data) : e.data;
    this.events.emit("payload", t);
  }
  onError(e, t) {
    const n2 = this.parseError(t), o2 = n2.message || n2.toString(), s2 = formatJsonRpcError(e, o2);
    this.events.emit("payload", s2);
  }
  parseError(e, t = this.url) {
    return parseConnectionError(e, a2(t), "WS");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > h2 && this.events.setMaxListeners(h2);
  }
  emitError(e) {
    const t = this.parseError(new Error((e == null ? void 0 : e.message) || `WebSocket connection failed for host: ${a2(this.url)}`));
    return this.events.emit("register_error", t), t;
  }
};
var lodash_isequal = { exports: {} };
lodash_isequal.exports;
(function(module, exports$1) {
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var freeExports = exports$1 && !exports$1.nodeType && exports$1;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseTimes(n2, iteratee) {
    var index = -1, result = Array(n2);
    while (++index < n2) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function cacheHas(cache, key2) {
    return cache.has(key2);
  }
  function getValue(object, key2) {
    return object == null ? void 0 : object[key2];
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key2) {
      result[++index] = [key2, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var nativeObjectToString = objectProto.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer2 = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array2 = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
  var DataView2 = getNative(root, "DataView"), Map2 = getNative(root, "Map"), Promise2 = getNative(root, "Promise"), Set2 = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  function hashDelete(key2) {
    var result = this.has(key2) && delete this.__data__[key2];
    this.size -= result ? 1 : 0;
    return result;
  }
  function hashGet(key2) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key2];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key2) ? data[key2] : void 0;
  }
  function hashHas(key2) {
    var data = this.__data__;
    return nativeCreate ? data[key2] !== void 0 : hasOwnProperty.call(data, key2);
  }
  function hashSet(key2, value) {
    var data = this.__data__;
    this.size += this.has(key2) ? 0 : 1;
    data[key2] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function listCacheDelete(key2) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key2) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key2) {
    return assocIndexOf(this.__data__, key2) > -1;
  }
  function listCacheSet(key2, value) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    if (index < 0) {
      ++this.size;
      data.push([key2, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key2) {
    var result = getMapData(this, key2)["delete"](key2);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key2) {
    return getMapData(this, key2).get(key2);
  }
  function mapCacheHas(key2) {
    return getMapData(this, key2).has(key2);
  }
  function mapCacheSet(key2, value) {
    var data = getMapData(this, key2), size = data.size;
    data.set(key2, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key2) {
    var data = this.__data__, result = data["delete"](key2);
    this.size = data.size;
    return result;
  }
  function stackGet(key2) {
    return this.__data__.get(key2);
  }
  function stackHas(key2) {
    return this.__data__.has(key2);
  }
  function stackSet(key2, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key2, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key2, value);
    this.size = data.size;
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key2 in value) {
      if (hasOwnProperty.call(value, key2) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key2 == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key2 == "offset" || key2 == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key2 == "buffer" || key2 == "byteLength" || key2 == "byteOffset") || // Skip index properties.
      isIndex(key2, length)))) {
        result.push(key2);
      }
    }
    return result;
  }
  function assocIndexOf(array, key2) {
    var length = array.length;
    while (length--) {
      if (eq6(array[length][0], key2)) {
        return length;
      }
    }
    return -1;
  }
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key2 in Object(object)) {
      if (hasOwnProperty.call(object, key2) && key2 != "constructor") {
        result.push(key2);
      }
    }
    return result;
  }
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq6(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key2 = objProps[index];
      if (!(isPartial ? key2 in other : hasOwnProperty.call(other, key2))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key2 = objProps[index];
      var objValue = object[key2], othValue = other[key2];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key2, other, object, stack) : customizer(objValue, othValue, key2, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key2 == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  function getMapData(map, key2) {
    var data = map.__data__;
    return isKeyable(key2) ? data[typeof key2 == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key2) {
    var value = getValue(object, key2);
    return baseIsNative(value) ? value : void 0;
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function eq6(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArray = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  var isBuffer = nativeIsBuffer || stubFalse;
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function stubArray() {
    return [];
  }
  function stubFalse() {
    return false;
  }
  module.exports = isEqual;
})(lodash_isequal, lodash_isequal.exports);
var lodash_isequalExports = lodash_isequal.exports;
const ys$1 = /* @__PURE__ */ getDefaultExportFromCjs(lodash_isequalExports);
var define_process_env_default$1 = {};
function Ds(o2, e) {
  if (o2.length >= 255) throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), s2 = 0; s2 < t.length; s2++) t[s2] = 255;
  for (var i2 = 0; i2 < o2.length; i2++) {
    var r2 = o2.charAt(i2), n2 = r2.charCodeAt(0);
    if (t[n2] !== 255) throw new TypeError(r2 + " is ambiguous");
    t[n2] = i2;
  }
  var a3 = o2.length, c2 = o2.charAt(0), h3 = Math.log(a3) / Math.log(256), d3 = Math.log(256) / Math.log(a3);
  function g3(l2) {
    if (l2 instanceof Uint8Array || (ArrayBuffer.isView(l2) ? l2 = new Uint8Array(l2.buffer, l2.byteOffset, l2.byteLength) : Array.isArray(l2) && (l2 = Uint8Array.from(l2))), !(l2 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (l2.length === 0) return "";
    for (var p3 = 0, _2 = 0, D2 = 0, E2 = l2.length; D2 !== E2 && l2[D2] === 0; ) D2++, p3++;
    for (var N2 = (E2 - D2) * d3 + 1 >>> 0, C3 = new Uint8Array(N2); D2 !== E2; ) {
      for (var L3 = l2[D2], k2 = 0, x3 = N2 - 1; (L3 !== 0 || k2 < _2) && x3 !== -1; x3--, k2++) L3 += 256 * C3[x3] >>> 0, C3[x3] = L3 % a3 >>> 0, L3 = L3 / a3 >>> 0;
      if (L3 !== 0) throw new Error("Non-zero carry");
      _2 = k2, D2++;
    }
    for (var M3 = N2 - _2; M3 !== N2 && C3[M3] === 0; ) M3++;
    for (var ie2 = c2.repeat(p3); M3 < N2; ++M3) ie2 += o2.charAt(C3[M3]);
    return ie2;
  }
  function m3(l2) {
    if (typeof l2 != "string") throw new TypeError("Expected String");
    if (l2.length === 0) return new Uint8Array();
    var p3 = 0;
    if (l2[p3] !== " ") {
      for (var _2 = 0, D2 = 0; l2[p3] === c2; ) _2++, p3++;
      for (var E2 = (l2.length - p3) * h3 + 1 >>> 0, N2 = new Uint8Array(E2); l2[p3]; ) {
        var C3 = t[l2.charCodeAt(p3)];
        if (C3 === 255) return;
        for (var L3 = 0, k2 = E2 - 1; (C3 !== 0 || L3 < D2) && k2 !== -1; k2--, L3++) C3 += a3 * N2[k2] >>> 0, N2[k2] = C3 % 256 >>> 0, C3 = C3 / 256 >>> 0;
        if (C3 !== 0) throw new Error("Non-zero carry");
        D2 = L3, p3++;
      }
      if (l2[p3] !== " ") {
        for (var x3 = E2 - D2; x3 !== E2 && N2[x3] === 0; ) x3++;
        for (var M3 = new Uint8Array(_2 + (E2 - x3)), ie2 = _2; x3 !== E2; ) M3[ie2++] = N2[x3++];
        return M3;
      }
    }
  }
  function b2(l2) {
    var p3 = m3(l2);
    if (p3) return p3;
    throw new Error(`Non-${e} character`);
  }
  return { encode: g3, decodeUnsafe: m3, decode: b2 };
}
var ms$1 = Ds, bs = ms$1;
const Ye = (o2) => {
  if (o2 instanceof Uint8Array && o2.constructor.name === "Uint8Array") return o2;
  if (o2 instanceof ArrayBuffer) return new Uint8Array(o2);
  if (ArrayBuffer.isView(o2)) return new Uint8Array(o2.buffer, o2.byteOffset, o2.byteLength);
  throw new Error("Unknown type, must be binary type");
}, fs$1 = (o2) => new TextEncoder().encode(o2), _s$1 = (o2) => new TextDecoder().decode(o2);
let Es$1 = class Es {
  constructor(e, t, s2) {
    this.name = e, this.prefix = t, this.baseEncode = s2;
  }
  encode(e) {
    if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
    throw Error("Unknown type, must be binary type");
  }
};
let vs$1 = class vs {
  constructor(e, t, s2) {
    if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = s2;
  }
  decode(e) {
    if (typeof e == "string") {
      if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e.slice(this.prefix.length));
    } else throw Error("Can only multibase decode strings");
  }
  or(e) {
    return Je(this, e);
  }
};
let ws$1 = class ws {
  constructor(e) {
    this.decoders = e;
  }
  or(e) {
    return Je(this, e);
  }
  decode(e) {
    const t = e[0], s2 = this.decoders[t];
    if (s2) return s2.decode(e);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
};
const Je = (o2, e) => new ws$1({ ...o2.decoders || { [o2.prefix]: o2 }, ...e.decoders || { [e.prefix]: e } });
let Is$1 = class Is {
  constructor(e, t, s2, i2) {
    this.name = e, this.prefix = t, this.baseEncode = s2, this.baseDecode = i2, this.encoder = new Es$1(e, t, s2), this.decoder = new vs$1(e, t, i2);
  }
  encode(e) {
    return this.encoder.encode(e);
  }
  decode(e) {
    return this.decoder.decode(e);
  }
};
const ne = ({ name: o2, prefix: e, encode: t, decode: s2 }) => new Is$1(o2, e, t, s2), X = ({ prefix: o2, name: e, alphabet: t }) => {
  const { encode: s2, decode: i2 } = bs(t, e);
  return ne({ prefix: o2, name: e, encode: s2, decode: (r2) => Ye(i2(r2)) });
}, Ts = (o2, e, t, s2) => {
  const i2 = {};
  for (let d3 = 0; d3 < e.length; ++d3) i2[e[d3]] = d3;
  let r2 = o2.length;
  for (; o2[r2 - 1] === "="; ) --r2;
  const n2 = new Uint8Array(r2 * t / 8 | 0);
  let a3 = 0, c2 = 0, h3 = 0;
  for (let d3 = 0; d3 < r2; ++d3) {
    const g3 = i2[o2[d3]];
    if (g3 === void 0) throw new SyntaxError(`Non-${s2} character`);
    c2 = c2 << t | g3, a3 += t, a3 >= 8 && (a3 -= 8, n2[h3++] = 255 & c2 >> a3);
  }
  if (a3 >= t || 255 & c2 << 8 - a3) throw new SyntaxError("Unexpected end of data");
  return n2;
}, Cs = (o2, e, t) => {
  const s2 = e[e.length - 1] === "=", i2 = (1 << t) - 1;
  let r2 = "", n2 = 0, a3 = 0;
  for (let c2 = 0; c2 < o2.length; ++c2) for (a3 = a3 << 8 | o2[c2], n2 += 8; n2 > t; ) n2 -= t, r2 += e[i2 & a3 >> n2];
  if (n2 && (r2 += e[i2 & a3 << t - n2]), s2) for (; r2.length * t & 7; ) r2 += "=";
  return r2;
}, f2 = ({ name: o2, prefix: e, bitsPerChar: t, alphabet: s2 }) => ne({ prefix: e, name: o2, encode(i2) {
  return Cs(i2, s2, t);
}, decode(i2) {
  return Ts(i2, s2, t, o2);
} }), Ss$1 = ne({ prefix: "\0", name: "identity", encode: (o2) => _s$1(o2), decode: (o2) => fs$1(o2) });
var Ps = Object.freeze({ __proto__: null, identity: Ss$1 });
const Rs$1 = f2({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var xs = Object.freeze({ __proto__: null, base2: Rs$1 });
const Os = f2({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var As = Object.freeze({ __proto__: null, base8: Os });
const Ns = X({ prefix: "9", name: "base10", alphabet: "0123456789" });
var Ls = Object.freeze({ __proto__: null, base10: Ns });
const zs = f2({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 }), Ms = f2({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var $s = Object.freeze({ __proto__: null, base16: zs, base16upper: Ms });
const ks = f2({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 }), Fs = f2({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 }), Us = f2({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 }), Ks = f2({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 }), Bs = f2({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 }), Vs = f2({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 }), js = f2({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 }), qs$1 = f2({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 }), Gs = f2({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var Hs = Object.freeze({ __proto__: null, base32: ks, base32upper: Fs, base32pad: Us, base32padupper: Ks, base32hex: Bs, base32hexupper: Vs, base32hexpad: js, base32hexpadupper: qs$1, base32z: Gs });
const Ys = X({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" }), Js = X({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var Ws = Object.freeze({ __proto__: null, base36: Ys, base36upper: Js });
const Xs = X({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" }), Zs = X({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var Qs = Object.freeze({ __proto__: null, base58btc: Xs, base58flickr: Zs });
const er = f2({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 }), tr = f2({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 }), ir = f2({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 }), sr = f2({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var rr = Object.freeze({ __proto__: null, base64: er, base64pad: tr, base64url: ir, base64urlpad: sr });
const We = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), nr = We.reduce((o2, e, t) => (o2[t] = e, o2), []), or = We.reduce((o2, e, t) => (o2[e.codePointAt(0)] = t, o2), []);
function ar(o2) {
  return o2.reduce((e, t) => (e += nr[t], e), "");
}
function cr(o2) {
  const e = [];
  for (const t of o2) {
    const s2 = or[t.codePointAt(0)];
    if (s2 === void 0) throw new Error(`Non-base256emoji character: ${t}`);
    e.push(s2);
  }
  return new Uint8Array(e);
}
const hr = ne({ prefix: "🚀", name: "base256emoji", encode: ar, decode: cr });
var lr$1 = Object.freeze({ __proto__: null, base256emoji: hr }), ur = Ze, Xe = 128, gr = -128, pr$1 = Math.pow(2, 31);
function Ze(o2, e, t) {
  e = e || [], t = t || 0;
  for (var s2 = t; o2 >= pr$1; ) e[t++] = o2 & 255 | Xe, o2 /= 128;
  for (; o2 & gr; ) e[t++] = o2 & 255 | Xe, o2 >>>= 7;
  return e[t] = o2 | 0, Ze.bytes = t - s2 + 1, e;
}
var yr = be$1, Dr = 128, Qe = 127;
function be$1(o2, s2) {
  var t = 0, s2 = s2 || 0, i2 = 0, r2 = s2, n2, a3 = o2.length;
  do {
    if (r2 >= a3) throw be$1.bytes = 0, new RangeError("Could not decode varint");
    n2 = o2[r2++], t += i2 < 28 ? (n2 & Qe) << i2 : (n2 & Qe) * Math.pow(2, i2), i2 += 7;
  } while (n2 >= Dr);
  return be$1.bytes = r2 - s2, t;
}
var mr = Math.pow(2, 7), br = Math.pow(2, 14), fr = Math.pow(2, 21), _r = Math.pow(2, 28), Er = Math.pow(2, 35), vr2 = Math.pow(2, 42), wr = Math.pow(2, 49), Ir = Math.pow(2, 56), Tr = Math.pow(2, 63), Cr = function(o2) {
  return o2 < mr ? 1 : o2 < br ? 2 : o2 < fr ? 3 : o2 < _r ? 4 : o2 < Er ? 5 : o2 < vr2 ? 6 : o2 < wr ? 7 : o2 < Ir ? 8 : o2 < Tr ? 9 : 10;
}, Sr = { encode: ur, decode: yr, encodingLength: Cr }, et = Sr;
const tt = (o2, e, t = 0) => (et.encode(o2, e, t), e), it$1 = (o2) => et.encodingLength(o2), fe = (o2, e) => {
  const t = e.byteLength, s2 = it$1(o2), i2 = s2 + it$1(t), r2 = new Uint8Array(i2 + t);
  return tt(o2, r2, 0), tt(t, r2, s2), r2.set(e, i2), new Pr(o2, t, e, r2);
};
class Pr {
  constructor(e, t, s2, i2) {
    this.code = e, this.size = t, this.digest = s2, this.bytes = i2;
  }
}
const st$1 = ({ name: o2, code: e, encode: t }) => new Rr(o2, e, t);
class Rr {
  constructor(e, t, s2) {
    this.name = e, this.code = t, this.encode = s2;
  }
  digest(e) {
    if (e instanceof Uint8Array) {
      const t = this.encode(e);
      return t instanceof Uint8Array ? fe(this.code, t) : t.then((s2) => fe(this.code, s2));
    } else throw Error("Unknown type, must be binary type");
  }
}
const rt$1 = (o2) => async (e) => new Uint8Array(await crypto.subtle.digest(o2, e)), xr = st$1({ name: "sha2-256", code: 18, encode: rt$1("SHA-256") }), Or = st$1({ name: "sha2-512", code: 19, encode: rt$1("SHA-512") });
var Ar = Object.freeze({ __proto__: null, sha256: xr, sha512: Or });
const nt$1 = 0, Nr = "identity", ot$1 = Ye, Lr = (o2) => fe(nt$1, ot$1(o2)), zr = { code: nt$1, name: Nr, encode: ot$1, digest: Lr };
var Mr = Object.freeze({ __proto__: null, identity: zr });
new TextEncoder(), new TextDecoder();
const at$1 = { ...Ps, ...xs, ...As, ...Ls, ...$s, ...Hs, ...Ws, ...Qs, ...rr, ...lr$1 };
({ ...Ar, ...Mr });
function $r(o2 = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? globalThis.Buffer.allocUnsafe(o2) : new Uint8Array(o2);
}
function ct$1(o2, e, t, s2) {
  return { name: o2, prefix: e, encoder: { name: o2, prefix: e, encode: t }, decoder: { decode: s2 } };
}
const ht$1 = ct$1("utf8", "u", (o2) => "u" + new TextDecoder("utf8").decode(o2), (o2) => new TextEncoder().encode(o2.substring(1))), _e$2 = ct$1("ascii", "a", (o2) => {
  let e = "a";
  for (let t = 0; t < o2.length; t++) e += String.fromCharCode(o2[t]);
  return e;
}, (o2) => {
  o2 = o2.substring(1);
  const e = $r(o2.length);
  for (let t = 0; t < o2.length; t++) e[t] = o2.charCodeAt(t);
  return e;
}), kr = { utf8: ht$1, "utf-8": ht$1, hex: at$1.base16, latin1: _e$2, ascii: _e$2, binary: _e$2, ...at$1 };
function Fr(o2, e = "utf8") {
  const t = kr[e];
  if (!t) throw new Error(`Unsupported encoding "${e}"`);
  return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(o2, "utf8") : t.decoder.decode(`${t.prefix}${o2}`);
}
const Ee = "wc", ve = 2, oe$1 = "core", O$1 = `${Ee}@2:${oe$1}:`, lt$1 = { logger: "error" }, ut$1 = { database: ":memory:" }, dt$1 = "crypto", we$1 = "client_ed25519_seed", gt$1 = cjs.ONE_DAY, pt$1 = "keychain", yt$1 = "0.3", Dt = "messages", mt = "0.3", bt = cjs.SIX_HOURS, ft = "publisher", _t = "irn", Et = "error", Ie = "wss://relay.walletconnect.org", vt = "relayer", w = { message: "relayer_message", message_ack: "relayer_message_ack", connect: "relayer_connect", disconnect: "relayer_disconnect", error: "relayer_error", connection_stalled: "relayer_connection_stalled", transport_closed: "relayer_transport_closed", publish: "relayer_publish" }, wt = "_subscription", T$1 = { payload: "payload", connect: "connect", disconnect: "disconnect", error: "error" }, It = 0.1, Te = "2.16.1", F$1 = { link_mode: "link_mode", relay: "relay" }, Tt$1 = "0.3", Ct = "WALLETCONNECT_CLIENT_ID", Ce$1 = "WALLETCONNECT_LINK_MODE_APPS", A = { created: "subscription_created", deleted: "subscription_deleted", sync: "subscription_sync", resubscribed: "subscription_resubscribed" }, St = "subscription", Pt = "0.3", Rt = cjs.FIVE_SECONDS * 1e3, xt = "pairing", Ot = "0.3", j$1 = { wc_pairingDelete: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 1e3 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 1001 } }, wc_pairingPing: { req: { ttl: cjs.THIRTY_SECONDS, prompt: false, tag: 1002 }, res: { ttl: cjs.THIRTY_SECONDS, prompt: false, tag: 1003 } }, unregistered_method: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 0 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 0 } } }, Z = { create: "pairing_create", expire: "pairing_expire", delete: "pairing_delete", ping: "pairing_ping" }, P = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" }, At = "history", Nt = "0.3", Lt$1 = "expirer", R$1 = { created: "expirer_created", deleted: "expirer_deleted", expired: "expirer_expired", sync: "expirer_sync" }, zt = "0.3", Mt = "verify-api", qr = "https://verify.walletconnect.com", $t = "https://verify.walletconnect.org", Q$1 = $t, kt = `${Q$1}/v3`, Ft = [qr, $t], Ut2 = "echo", Kt = "https://echo.walletconnect.com", z$1 = { pairing_started: "pairing_started", pairing_uri_validation_success: "pairing_uri_validation_success", pairing_uri_not_expired: "pairing_uri_not_expired", store_new_pairing: "store_new_pairing", subscribing_pairing_topic: "subscribing_pairing_topic", subscribe_pairing_topic_success: "subscribe_pairing_topic_success", existing_pairing: "existing_pairing", pairing_not_expired: "pairing_not_expired", emit_inactive_pairing: "emit_inactive_pairing", emit_session_proposal: "emit_session_proposal", subscribing_to_pairing_topic: "subscribing_to_pairing_topic" }, $$1 = { no_wss_connection: "no_wss_connection", no_internet_connection: "no_internet_connection", malformed_pairing_uri: "malformed_pairing_uri", active_pairing_already_exists: "active_pairing_already_exists", subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure", pairing_expired: "pairing_expired", proposal_expired: "proposal_expired", proposal_listener_not_found: "proposal_listener_not_found" }, Hr = { session_approve_started: "session_approve_started", proposal_not_expired: "proposal_not_expired", session_namespaces_validation_success: "session_namespaces_validation_success", create_session_topic: "create_session_topic", subscribing_session_topic: "subscribing_session_topic", subscribe_session_topic_success: "subscribe_session_topic_success", publishing_session_approve: "publishing_session_approve", session_approve_publish_success: "session_approve_publish_success", store_session: "store_session", publishing_session_settle: "publishing_session_settle", session_settle_publish_success: "session_settle_publish_success" }, Yr = { no_internet_connection: "no_internet_connection", no_wss_connection: "no_wss_connection", proposal_expired: "proposal_expired", subscribe_session_topic_failure: "subscribe_session_topic_failure", session_approve_publish_failure: "session_approve_publish_failure", session_settle_publish_failure: "session_settle_publish_failure", session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure", proposal_not_found: "proposal_not_found" }, Jr = { authenticated_session_approve_started: "authenticated_session_approve_started", create_authenticated_session_topic: "create_authenticated_session_topic", cacaos_verified: "cacaos_verified", store_authenticated_session: "store_authenticated_session", subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic", subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success", publishing_authenticated_session_approve: "publishing_authenticated_session_approve" }, Wr = { no_internet_connection: "no_internet_connection", invalid_cacao: "invalid_cacao", subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure", authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure", authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found" }, Bt = 0.1, Vt = "event-client", jt = 86400, qt = "https://pulse.walletconnect.com/batch";
class Gt {
  constructor(e, t) {
    this.core = e, this.logger = t, this.keychain = /* @__PURE__ */ new Map(), this.name = pt$1, this.version = yt$1, this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      if (!this.initialized) {
        const s2 = await this.getKeyChain();
        typeof s2 < "u" && (this.keychain = s2), this.initialized = true;
      }
    }, this.has = (s2) => (this.isInitialized(), this.keychain.has(s2)), this.set = async (s2, i2) => {
      this.isInitialized(), this.keychain.set(s2, i2), await this.persist();
    }, this.get = (s2) => {
      this.isInitialized();
      const i2 = this.keychain.get(s2);
      if (typeof i2 > "u") {
        const { message: r2 } = xe("NO_MATCHING_KEY", `${this.name}: ${s2}`);
        throw new Error(r2);
      }
      return i2;
    }, this.del = async (s2) => {
      this.isInitialized(), this.keychain.delete(s2), await this.persist();
    }, this.core = e, this.logger = E$1(t, this.name);
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setKeyChain(e) {
    await this.core.storage.setItem(this.storageKey, ss(e));
  }
  async getKeyChain() {
    const e = await this.core.storage.getItem(this.storageKey);
    return typeof e < "u" ? as(e) : void 0;
  }
  async persist() {
    await this.setKeyChain(this.keychain);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class Ht {
  constructor(e, t, s2) {
    this.core = e, this.logger = t, this.name = dt$1, this.randomSessionIdentifier = Eu(), this.initialized = false, this.init = async () => {
      this.initialized || (await this.keychain.init(), this.initialized = true);
    }, this.hasKeys = (i2) => (this.isInitialized(), this.keychain.has(i2)), this.getClientId = async () => {
      this.isInitialized();
      const i2 = await this.getClientSeed(), r2 = generateKeyPair(i2);
      return encodeIss(r2.publicKey);
    }, this.generateKeyPair = () => {
      this.isInitialized();
      const i2 = Mu();
      return this.setPrivateKey(i2.publicKey, i2.privateKey);
    }, this.signJWT = async (i2) => {
      this.isInitialized();
      const r2 = await this.getClientSeed(), n2 = generateKeyPair(r2), a3 = this.randomSessionIdentifier, c2 = gt$1;
      return await signJWT(a3, i2, c2, n2);
    }, this.generateSharedKey = (i2, r2, n2) => {
      this.isInitialized();
      const a3 = this.getPrivateKey(i2), c2 = Su(a3, r2);
      return this.setSymKey(c2, n2);
    }, this.setSymKey = async (i2, r2) => {
      this.isInitialized();
      const n2 = r2 || Nu(i2);
      return await this.keychain.set(n2, i2), n2;
    }, this.deleteKeyPair = async (i2) => {
      this.isInitialized(), await this.keychain.del(i2);
    }, this.deleteSymKey = async (i2) => {
      this.isInitialized(), await this.keychain.del(i2);
    }, this.encode = async (i2, r2, n2) => {
      this.isInitialized();
      const a3 = io(n2), c2 = safeJsonStringify(r2);
      if (Du(a3)) return Bu(c2, n2 == null ? void 0 : n2.encoding);
      if (Pu(a3)) {
        const m3 = a3.senderPublicKey, b2 = a3.receiverPublicKey;
        i2 = await this.generateSharedKey(m3, b2);
      }
      const h3 = this.getSymKey(i2), { type: d3, senderPublicKey: g3 } = a3;
      return _u({ type: d3, symKey: h3, message: c2, senderPublicKey: g3, encoding: n2 == null ? void 0 : n2.encoding });
    }, this.decode = async (i2, r2, n2) => {
      this.isInitialized();
      const a3 = Ou(r2, n2);
      if (Du(a3)) {
        const c2 = Ru(r2, n2 == null ? void 0 : n2.encoding);
        return safeJsonParse(c2);
      }
      if (Pu(a3)) {
        const c2 = a3.receiverPublicKey, h3 = a3.senderPublicKey;
        i2 = await this.generateSharedKey(c2, h3);
      }
      try {
        const c2 = this.getSymKey(i2), h3 = Cu({ symKey: c2, encoded: r2, encoding: n2 == null ? void 0 : n2.encoding });
        return safeJsonParse(h3);
      } catch (c2) {
        this.logger.error(`Failed to decode message from topic: '${i2}', clientId: '${await this.getClientId()}'`), this.logger.error(c2);
      }
    }, this.getPayloadType = (i2, r2 = $i) => {
      const n2 = Wr$1({ encoded: i2, encoding: r2 });
      return $e(n2.type);
    }, this.getPayloadSenderPublicKey = (i2, r2 = $i) => {
      const n2 = Wr$1({ encoded: i2, encoding: r2 });
      return n2.senderPublicKey ? toString(n2.senderPublicKey, Lt$2) : void 0;
    }, this.core = e, this.logger = E$1(t, this.name), this.keychain = s2 || new Gt(this.core, this.logger);
  }
  get context() {
    return y$3(this.logger);
  }
  async setPrivateKey(e, t) {
    return await this.keychain.set(e, t), e;
  }
  getPrivateKey(e) {
    return this.keychain.get(e);
  }
  async getClientSeed() {
    let e = "";
    try {
      e = this.keychain.get(we$1);
    } catch {
      e = Eu(), await this.keychain.set(we$1, e);
    }
    return Fr(e, "base16");
  }
  getSymKey(e) {
    return this.keychain.get(e);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class Yt extends a$1 {
  constructor(e, t) {
    super(e, t), this.logger = e, this.core = t, this.messages = /* @__PURE__ */ new Map(), this.name = Dt, this.version = mt, this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      if (!this.initialized) {
        this.logger.trace("Initialized");
        try {
          const s2 = await this.getRelayerMessages();
          typeof s2 < "u" && (this.messages = s2), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", size: this.messages.size });
        } catch (s2) {
          this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(s2);
        } finally {
          this.initialized = true;
        }
      }
    }, this.set = async (s2, i2) => {
      this.isInitialized();
      const r2 = Iu(i2);
      let n2 = this.messages.get(s2);
      return typeof n2 > "u" && (n2 = {}), typeof n2[r2] < "u" || (n2[r2] = i2, this.messages.set(s2, n2), await this.persist()), r2;
    }, this.get = (s2) => {
      this.isInitialized();
      let i2 = this.messages.get(s2);
      return typeof i2 > "u" && (i2 = {}), i2;
    }, this.has = (s2, i2) => {
      this.isInitialized();
      const r2 = this.get(s2), n2 = Iu(i2);
      return typeof r2[n2] < "u";
    }, this.del = async (s2) => {
      this.isInitialized(), this.messages.delete(s2), await this.persist();
    }, this.logger = E$1(e, this.name), this.core = t;
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setRelayerMessages(e) {
    await this.core.storage.setItem(this.storageKey, ss(e));
  }
  async getRelayerMessages() {
    const e = await this.core.storage.getItem(this.storageKey);
    return typeof e < "u" ? as(e) : void 0;
  }
  async persist() {
    await this.setRelayerMessages(this.messages);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class Xr extends g$1 {
  constructor(e, t) {
    super(e, t), this.relayer = e, this.logger = t, this.events = new eventsExports.EventEmitter(), this.name = ft, this.queue = /* @__PURE__ */ new Map(), this.publishTimeout = cjs.toMiliseconds(cjs.ONE_MINUTE), this.failedPublishTimeout = cjs.toMiliseconds(cjs.ONE_SECOND), this.needsTransportRestart = false, this.publish = async (s2, i2, r2) => {
      var n2;
      this.logger.debug("Publishing Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: s2, message: i2, opts: r2 } });
      const a3 = (r2 == null ? void 0 : r2.ttl) || bt, c2 = ku(r2), h3 = (r2 == null ? void 0 : r2.prompt) || false, d3 = (r2 == null ? void 0 : r2.tag) || 0, g3 = (r2 == null ? void 0 : r2.id) || getBigIntRpcId().toString(), m3 = { topic: s2, message: i2, opts: { ttl: a3, relay: c2, prompt: h3, tag: d3, id: g3, attestation: r2 == null ? void 0 : r2.attestation } }, b2 = `Failed to publish payload, please try again. id:${g3} tag:${d3}`, l2 = Date.now();
      let p3, _2 = 1;
      try {
        for (; p3 === void 0; ) {
          if (Date.now() - l2 > this.publishTimeout) throw new Error(b2);
          this.logger.trace({ id: g3, attempts: _2 }, `publisher.publish - attempt ${_2}`), p3 = await await ds(this.rpcPublish(s2, i2, a3, c2, h3, d3, g3, r2 == null ? void 0 : r2.attestation).catch((D2) => this.logger.warn(D2)), this.publishTimeout, b2), _2++, p3 || await new Promise((D2) => setTimeout(D2, this.failedPublishTimeout));
        }
        this.relayer.events.emit(w.publish, m3), this.logger.debug("Successfully Published Payload"), this.logger.trace({ type: "method", method: "publish", params: { id: g3, topic: s2, message: i2, opts: r2 } });
      } catch (D2) {
        if (this.logger.debug("Failed to Publish Payload"), this.logger.error(D2), (n2 = r2 == null ? void 0 : r2.internal) != null && n2.throwOnFailedPublish) throw D2;
        this.queue.set(g3, m3);
      }
    }, this.on = (s2, i2) => {
      this.events.on(s2, i2);
    }, this.once = (s2, i2) => {
      this.events.once(s2, i2);
    }, this.off = (s2, i2) => {
      this.events.off(s2, i2);
    }, this.removeListener = (s2, i2) => {
      this.events.removeListener(s2, i2);
    }, this.relayer = e, this.logger = E$1(t, this.name), this.registerEventListeners();
  }
  get context() {
    return y$3(this.logger);
  }
  rpcPublish(e, t, s2, i2, r2, n2, a3, c2) {
    var h3, d3, g3, m3;
    const b2 = { method: qu(i2.protocol).publish, params: { topic: e, message: t, ttl: s2, prompt: r2, tag: n2, attestation: c2 }, id: a3 };
    return Pe((h3 = b2.params) == null ? void 0 : h3.prompt) && ((d3 = b2.params) == null || delete d3.prompt), Pe((g3 = b2.params) == null ? void 0 : g3.tag) && ((m3 = b2.params) == null || delete m3.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "message", direction: "outgoing", request: b2 }), this.relayer.request(b2);
  }
  removeRequestFromQueue(e) {
    this.queue.delete(e);
  }
  checkQueue() {
    this.queue.forEach(async (e) => {
      const { topic: t, message: s2, opts: i2 } = e;
      await this.publish(t, s2, i2);
    });
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(r$2.pulse, () => {
      if (this.needsTransportRestart) {
        this.needsTransportRestart = false, this.relayer.events.emit(w.connection_stalled);
        return;
      }
      this.checkQueue();
    }), this.relayer.on(w.message_ack, (e) => {
      this.removeRequestFromQueue(e.id.toString());
    });
  }
}
class Zr {
  constructor() {
    this.map = /* @__PURE__ */ new Map(), this.set = (e, t) => {
      const s2 = this.get(e);
      this.exists(e, t) || this.map.set(e, [...s2, t]);
    }, this.get = (e) => this.map.get(e) || [], this.exists = (e, t) => this.get(e).includes(t), this.delete = (e, t) => {
      if (typeof t > "u") {
        this.map.delete(e);
        return;
      }
      if (!this.map.has(e)) return;
      const s2 = this.get(e);
      if (!this.exists(e, t)) return;
      const i2 = s2.filter((r2) => r2 !== t);
      if (!i2.length) {
        this.map.delete(e);
        return;
      }
      this.map.set(e, i2);
    }, this.clear = () => {
      this.map.clear();
    };
  }
  get topics() {
    return Array.from(this.map.keys());
  }
}
var Qr = Object.defineProperty, en = Object.defineProperties, tn = Object.getOwnPropertyDescriptors, Jt = Object.getOwnPropertySymbols, sn = Object.prototype.hasOwnProperty, rn = Object.prototype.propertyIsEnumerable, Wt = (o2, e, t) => e in o2 ? Qr(o2, e, { enumerable: true, configurable: true, writable: true, value: t }) : o2[e] = t, ee = (o2, e) => {
  for (var t in e || (e = {})) sn.call(e, t) && Wt(o2, t, e[t]);
  if (Jt) for (var t of Jt(e)) rn.call(e, t) && Wt(o2, t, e[t]);
  return o2;
}, Se = (o2, e) => en(o2, tn(e));
class Xt extends d2 {
  constructor(e, t) {
    super(e, t), this.relayer = e, this.logger = t, this.subscriptions = /* @__PURE__ */ new Map(), this.topicMap = new Zr(), this.events = new eventsExports.EventEmitter(), this.name = St, this.version = Pt, this.pending = /* @__PURE__ */ new Map(), this.cached = [], this.initialized = false, this.pendingSubscriptionWatchLabel = "pending_sub_watch_label", this.pollingInterval = 20, this.storagePrefix = O$1, this.subscribeTimeout = cjs.toMiliseconds(cjs.ONE_MINUTE), this.restartInProgress = false, this.batchSubscribeTopicsLimit = 500, this.pendingBatchMessages = [], this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), this.clientId = await this.relayer.core.crypto.getClientId(), await this.restore()), this.initialized = true;
    }, this.subscribe = async (s2, i2) => {
      this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: s2, opts: i2 } });
      try {
        const r2 = ku(i2), n2 = { topic: s2, relay: r2, transportType: i2 == null ? void 0 : i2.transportType };
        this.pending.set(s2, n2);
        const a3 = await this.rpcSubscribe(s2, r2, i2 == null ? void 0 : i2.transportType);
        return typeof a3 == "string" && (this.onSubscribe(a3, n2), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: s2, opts: i2 } })), a3;
      } catch (r2) {
        throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(r2), r2;
      }
    }, this.unsubscribe = async (s2, i2) => {
      await this.restartToComplete(), this.isInitialized(), typeof (i2 == null ? void 0 : i2.id) < "u" ? await this.unsubscribeById(s2, i2.id, i2) : await this.unsubscribeByTopic(s2, i2);
    }, this.isSubscribed = async (s2) => {
      if (this.topics.includes(s2)) return true;
      const i2 = `${this.pendingSubscriptionWatchLabel}_${s2}`;
      return await new Promise((r2, n2) => {
        const a3 = new cjs.Watch();
        a3.start(i2);
        const c2 = setInterval(() => {
          !this.pending.has(s2) && this.topics.includes(s2) && (clearInterval(c2), a3.stop(i2), r2(true)), a3.elapsed(i2) >= Rt && (clearInterval(c2), a3.stop(i2), n2(new Error("Subscription resolution timeout")));
        }, this.pollingInterval);
      }).catch(() => false);
    }, this.on = (s2, i2) => {
      this.events.on(s2, i2);
    }, this.once = (s2, i2) => {
      this.events.once(s2, i2);
    }, this.off = (s2, i2) => {
      this.events.off(s2, i2);
    }, this.removeListener = (s2, i2) => {
      this.events.removeListener(s2, i2);
    }, this.start = async () => {
      await this.onConnect();
    }, this.stop = async () => {
      await this.onDisconnect();
    }, this.restart = async () => {
      this.restartInProgress = true, await this.restore(), await this.reset(), this.restartInProgress = false;
    }, this.relayer = e, this.logger = E$1(t, this.name), this.clientId = "";
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.subscriptions.size;
  }
  get ids() {
    return Array.from(this.subscriptions.keys());
  }
  get values() {
    return Array.from(this.subscriptions.values());
  }
  get topics() {
    return this.topicMap.topics;
  }
  hasSubscription(e, t) {
    let s2 = false;
    try {
      s2 = this.getSubscription(e).topic === t;
    } catch {
    }
    return s2;
  }
  onEnable() {
    this.cached = [], this.initialized = true;
  }
  onDisable() {
    this.cached = this.values, this.subscriptions.clear(), this.topicMap.clear();
  }
  async unsubscribeByTopic(e, t) {
    const s2 = this.topicMap.get(e);
    await Promise.all(s2.map(async (i2) => await this.unsubscribeById(e, i2, t)));
  }
  async unsubscribeById(e, t, s2) {
    this.logger.debug("Unsubscribing Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e, id: t, opts: s2 } });
    try {
      const i2 = ku(s2);
      await this.rpcUnsubscribe(e, t, i2);
      const r2 = er$1("USER_DISCONNECTED", `${this.name}, ${e}`);
      await this.onUnsubscribe(e, t, r2), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e, id: t, opts: s2 } });
    } catch (i2) {
      throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(i2), i2;
    }
  }
  async rpcSubscribe(e, t, s2 = F$1.relay) {
    s2 === F$1.relay && await this.restartToComplete();
    const i2 = { method: qu(t.protocol).subscribe, params: { topic: e } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i2 });
    try {
      const r2 = Iu(e + this.clientId);
      return s2 === F$1.link_mode ? (setTimeout(() => {
        (this.relayer.connected || this.relayer.connecting) && this.relayer.request(i2).catch((n2) => this.logger.warn(n2));
      }, cjs.toMiliseconds(cjs.ONE_SECOND)), r2) : await await ds(this.relayer.request(i2).catch((n2) => this.logger.warn(n2)), this.subscribeTimeout) ? r2 : null;
    } catch {
      this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(w.connection_stalled);
    }
    return null;
  }
  async rpcBatchSubscribe(e) {
    if (!e.length) return;
    const t = e[0].relay, s2 = { method: qu(t.protocol).batchSubscribe, params: { topics: e.map((i2) => i2.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s2 });
    try {
      return await await ds(this.relayer.request(s2).catch((i2) => this.logger.warn(i2)), this.subscribeTimeout);
    } catch {
      this.relayer.events.emit(w.connection_stalled);
    }
  }
  async rpcBatchFetchMessages(e) {
    if (!e.length) return;
    const t = e[0].relay, s2 = { method: qu(t.protocol).batchFetchMessages, params: { topics: e.map((r2) => r2.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s2 });
    let i2;
    try {
      i2 = await await ds(this.relayer.request(s2).catch((r2) => this.logger.warn(r2)), this.subscribeTimeout);
    } catch {
      this.relayer.events.emit(w.connection_stalled);
    }
    return i2;
  }
  rpcUnsubscribe(e, t, s2) {
    const i2 = { method: qu(s2.protocol).unsubscribe, params: { topic: e, id: t } };
    return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i2 }), this.relayer.request(i2);
  }
  onSubscribe(e, t) {
    this.setSubscription(e, Se(ee({}, t), { id: e })), this.pending.delete(t.topic);
  }
  onBatchSubscribe(e) {
    e.length && e.forEach((t) => {
      this.setSubscription(t.id, ee({}, t)), this.pending.delete(t.topic);
    });
  }
  async onUnsubscribe(e, t, s2) {
    this.events.removeAllListeners(t), this.hasSubscription(t, e) && this.deleteSubscription(t, s2), await this.relayer.messages.del(e);
  }
  async setRelayerSubscriptions(e) {
    await this.relayer.core.storage.setItem(this.storageKey, e);
  }
  async getRelayerSubscriptions() {
    return await this.relayer.core.storage.getItem(this.storageKey);
  }
  setSubscription(e, t) {
    this.logger.debug("Setting subscription"), this.logger.trace({ type: "method", method: "setSubscription", id: e, subscription: t }), this.addSubscription(e, t);
  }
  addSubscription(e, t) {
    this.subscriptions.set(e, ee({}, t)), this.topicMap.set(t.topic, e), this.events.emit(A.created, t);
  }
  getSubscription(e) {
    this.logger.debug("Getting subscription"), this.logger.trace({ type: "method", method: "getSubscription", id: e });
    const t = this.subscriptions.get(e);
    if (!t) {
      const { message: s2 } = xe("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw new Error(s2);
    }
    return t;
  }
  deleteSubscription(e, t) {
    this.logger.debug("Deleting subscription"), this.logger.trace({ type: "method", method: "deleteSubscription", id: e, reason: t });
    const s2 = this.getSubscription(e);
    this.subscriptions.delete(e), this.topicMap.delete(s2.topic, e), this.events.emit(A.deleted, Se(ee({}, s2), { reason: t }));
  }
  async persist() {
    await this.setRelayerSubscriptions(this.values), this.events.emit(A.sync);
  }
  async reset() {
    if (this.cached.length) {
      const e = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
      for (let t = 0; t < e; t++) {
        const s2 = this.cached.splice(0, this.batchSubscribeTopicsLimit);
        await this.batchFetchMessages(s2), await this.batchSubscribe(s2);
      }
    }
    this.events.emit(A.resubscribed);
  }
  async restore() {
    try {
      const e = await this.getRelayerSubscriptions();
      if (typeof e > "u" || !e.length) return;
      if (this.subscriptions.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({ type: "method", method: "restore", subscriptions: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
    }
  }
  async batchSubscribe(e) {
    if (!e.length) return;
    const t = await this.rpcBatchSubscribe(e);
    Ir$1(t) && this.onBatchSubscribe(t.map((s2, i2) => Se(ee({}, e[i2]), { id: s2 })));
  }
  async batchFetchMessages(e) {
    if (!e.length) return;
    this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);
    const t = await this.rpcBatchFetchMessages(e);
    t && t.messages && (this.pendingBatchMessages = this.pendingBatchMessages.concat(t.messages));
  }
  async onConnect() {
    await this.restart(), this.onEnable();
  }
  onDisconnect() {
    this.onDisable();
  }
  async checkPending() {
    if (!this.initialized || !this.relayer.connected) return;
    const e = [];
    this.pending.forEach((t) => {
      e.push(t);
    }), await this.batchSubscribe(e), this.pendingBatchMessages.length && (await this.relayer.handleBatchMessageEvents(this.pendingBatchMessages), this.pendingBatchMessages = []);
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(r$2.pulse, async () => {
      await this.checkPending();
    }), this.events.on(A.created, async (e) => {
      const t = A.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), await this.persist();
    }), this.events.on(A.deleted, async (e) => {
      const t = A.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), await this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  async restartToComplete() {
    !this.relayer.connected && !this.relayer.connecting && await this.relayer.transportOpen(), this.restartInProgress && await new Promise((e) => {
      const t = setInterval(() => {
        this.restartInProgress || (clearInterval(t), e());
      }, this.pollingInterval);
    });
  }
}
var nn = Object.defineProperty, Zt = Object.getOwnPropertySymbols, on = Object.prototype.hasOwnProperty, an = Object.prototype.propertyIsEnumerable, Qt = (o2, e, t) => e in o2 ? nn(o2, e, { enumerable: true, configurable: true, writable: true, value: t }) : o2[e] = t, cn = (o2, e) => {
  for (var t in e || (e = {})) on.call(e, t) && Qt(o2, t, e[t]);
  if (Zt) for (var t of Zt(e)) an.call(e, t) && Qt(o2, t, e[t]);
  return o2;
};
class ei extends u$1 {
  constructor(e) {
    super(e), this.protocol = "wc", this.version = 2, this.events = new eventsExports.EventEmitter(), this.name = vt, this.transportExplicitlyClosed = false, this.initialized = false, this.connectionAttemptInProgress = false, this.connectionStatusPollingInterval = 20, this.staleConnectionErrors = ["socket hang up", "stalled", "interrupted"], this.hasExperiencedNetworkDisruption = false, this.requestsInFlight = /* @__PURE__ */ new Map(), this.heartBeatTimeout = cjs.toMiliseconds(cjs.THIRTY_SECONDS + cjs.ONE_SECOND), this.request = async (t) => {
      var s2, i2;
      this.logger.debug("Publishing Request Payload");
      const r2 = t.id || getBigIntRpcId().toString();
      await this.toEstablishConnection();
      try {
        const n2 = this.provider.request(t);
        this.requestsInFlight.set(r2, { promise: n2, request: t }), this.logger.trace({ id: r2, method: t.method, topic: (s2 = t.params) == null ? void 0 : s2.topic }, "relayer.request - attempt to publish...");
        const a3 = await new Promise(async (c2, h3) => {
          const d3 = () => {
            h3(new Error(`relayer.request - publish interrupted, id: ${r2}`));
          };
          this.provider.on(T$1.disconnect, d3);
          const g3 = await n2;
          this.provider.off(T$1.disconnect, d3), c2(g3);
        });
        return this.logger.trace({ id: r2, method: t.method, topic: (i2 = t.params) == null ? void 0 : i2.topic }, "relayer.request - published"), a3;
      } catch (n2) {
        throw this.logger.debug(`Failed to Publish Request: ${r2}`), n2;
      } finally {
        this.requestsInFlight.delete(r2);
      }
    }, this.resetPingTimeout = () => {
      if (bi()) try {
        clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
          var t, s2, i2;
          (i2 = (s2 = (t = this.provider) == null ? void 0 : t.connection) == null ? void 0 : s2.socket) == null || i2.terminate();
        }, this.heartBeatTimeout);
      } catch (t) {
        this.logger.warn(t);
      }
    }, this.onPayloadHandler = (t) => {
      this.onProviderPayload(t), this.resetPingTimeout();
    }, this.onConnectHandler = () => {
      this.logger.trace("relayer connected"), this.startPingTimeout(), this.events.emit(w.connect);
    }, this.onDisconnectHandler = () => {
      this.logger.trace("relayer disconnected"), this.onProviderDisconnect();
    }, this.onProviderErrorHandler = (t) => {
      this.logger.error(t), this.events.emit(w.error, t), this.logger.info("Fatal socket error received, closing transport"), this.transportClose();
    }, this.registerProviderListeners = () => {
      this.provider.on(T$1.payload, this.onPayloadHandler), this.provider.on(T$1.connect, this.onConnectHandler), this.provider.on(T$1.disconnect, this.onDisconnectHandler), this.provider.on(T$1.error, this.onProviderErrorHandler);
    }, this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? E$1(e.logger, this.name) : Wg(k({ level: e.logger || Et })), this.messages = new Yt(this.logger, e.core), this.subscriber = new Xt(this, this.logger), this.publisher = new Xr(this, this.logger), this.relayUrl = (e == null ? void 0 : e.relayUrl) || Ie, this.projectId = e.projectId, this.bundleId = ts(), this.provider = {};
  }
  async init() {
    if (this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]), this.initialized = true, this.subscriber.cached.length > 0) try {
      await this.transportOpen();
    } catch (e) {
      this.logger.warn(e);
    }
  }
  get context() {
    return y$3(this.logger);
  }
  get connected() {
    var e, t, s2;
    return ((s2 = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : s2.readyState) === 1;
  }
  get connecting() {
    var e, t, s2;
    return ((s2 = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : s2.readyState) === 0;
  }
  async publish(e, t, s2) {
    this.isInitialized(), await this.publisher.publish(e, t, s2), await this.recordMessageEvent({ topic: e, message: t, publishedAt: Date.now(), transportType: F$1.relay });
  }
  async subscribe(e, t) {
    var s2;
    this.isInitialized(), (t == null ? void 0 : t.transportType) === "relay" && await this.toEstablishConnection();
    let i2 = ((s2 = this.subscriber.topicMap.get(e)) == null ? void 0 : s2[0]) || "", r2;
    const n2 = (a3) => {
      a3.topic === e && (this.subscriber.off(A.created, n2), r2());
    };
    return await Promise.all([new Promise((a3) => {
      r2 = a3, this.subscriber.on(A.created, n2);
    }), new Promise(async (a3) => {
      i2 = await this.subscriber.subscribe(e, t) || i2, a3();
    })]), i2;
  }
  async unsubscribe(e, t) {
    this.isInitialized(), await this.subscriber.unsubscribe(e, t);
  }
  on(e, t) {
    this.events.on(e, t);
  }
  once(e, t) {
    this.events.once(e, t);
  }
  off(e, t) {
    this.events.off(e, t);
  }
  removeListener(e, t) {
    this.events.removeListener(e, t);
  }
  async transportDisconnect() {
    if (!this.hasExperiencedNetworkDisruption && this.connected && this.requestsInFlight.size > 0) try {
      await Promise.all(Array.from(this.requestsInFlight.values()).map((e) => e.promise));
    } catch (e) {
      this.logger.warn(e);
    }
    this.hasExperiencedNetworkDisruption || this.connected ? await ds(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
  }
  async transportClose() {
    this.transportExplicitlyClosed = true, await this.transportDisconnect();
  }
  async transportOpen(e) {
    await this.confirmOnlineStateOrThrow(), e && e !== this.relayUrl && (this.relayUrl = e, await this.transportDisconnect()), await this.createProvider(), this.connectionAttemptInProgress = true, this.transportExplicitlyClosed = false;
    try {
      await new Promise(async (t, s2) => {
        const i2 = () => {
          this.provider.off(T$1.disconnect, i2), s2(new Error("Connection interrupted while trying to subscribe"));
        };
        this.provider.on(T$1.disconnect, i2), await ds(this.provider.connect(), cjs.toMiliseconds(cjs.ONE_MINUTE), `Socket stalled when trying to connect to ${this.relayUrl}`).catch((r2) => {
          s2(r2);
        }).finally(() => {
          clearTimeout(this.reconnectTimeout), this.reconnectTimeout = void 0;
        }), this.subscriber.start().catch((r2) => {
          this.logger.error(r2), this.onDisconnectHandler();
        }), this.hasExperiencedNetworkDisruption = false, t();
      });
    } catch (t) {
      this.logger.error(t);
      const s2 = t;
      if (this.hasExperiencedNetworkDisruption = true, !this.isConnectionStalled(s2.message)) throw t;
    } finally {
      this.connectionAttemptInProgress = false;
    }
  }
  async restartTransport(e) {
    this.connectionAttemptInProgress || (this.relayUrl = e || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
  }
  async confirmOnlineStateOrThrow() {
    if (!await Eh()) throw new Error("No internet connection detected. Please restart your network and try again.");
  }
  async handleBatchMessageEvents(e) {
    if ((e == null ? void 0 : e.length) === 0) {
      this.logger.trace("Batch message events is empty. Ignoring...");
      return;
    }
    const t = e.sort((s2, i2) => s2.publishedAt - i2.publishedAt);
    this.logger.trace(`Batch of ${t.length} message events sorted`);
    for (const s2 of t) try {
      await this.onMessageEvent(s2);
    } catch (i2) {
      this.logger.warn(i2);
    }
    this.logger.trace(`Batch of ${t.length} message events processed`);
  }
  async onLinkMessageEvent(e, t) {
    const { topic: s2 } = e;
    if (!t.sessionExists) {
      const i2 = ms$2(cjs.FIVE_MINUTES), r2 = { topic: s2, expiry: i2, relay: { protocol: "irn" }, active: false };
      await this.core.pairing.pairings.set(s2, r2);
    }
    this.events.emit(w.message, e), await this.recordMessageEvent(e);
  }
  startPingTimeout() {
    var e, t, s2, i2, r2;
    if (bi()) try {
      (t = (e = this.provider) == null ? void 0 : e.connection) != null && t.socket && ((r2 = (i2 = (s2 = this.provider) == null ? void 0 : s2.connection) == null ? void 0 : i2.socket) == null || r2.once("ping", () => {
        this.resetPingTimeout();
      })), this.resetPingTimeout();
    } catch (n2) {
      this.logger.warn(n2);
    }
  }
  isConnectionStalled(e) {
    return this.staleConnectionErrors.some((t) => e.includes(t));
  }
  async createProvider() {
    this.provider.connection && this.unregisterProviderListeners();
    const e = await this.core.crypto.signJWT(this.relayUrl);
    this.provider = new o(new f$1(is({ sdkVersion: Te, protocol: this.protocol, version: this.version, relayUrl: this.relayUrl, projectId: this.projectId, auth: e, useOnCloseEvent: true, bundleId: this.bundleId }))), this.registerProviderListeners();
  }
  async recordMessageEvent(e) {
    const { topic: t, message: s2 } = e;
    await this.messages.set(t, s2);
  }
  async shouldIgnoreMessageEvent(e) {
    const { topic: t, message: s2 } = e;
    if (!s2 || s2.length === 0) return this.logger.debug(`Ignoring invalid/empty message: ${s2}`), true;
    if (!await this.subscriber.isSubscribed(t)) return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`), true;
    const i2 = this.messages.has(t, s2);
    return i2 && this.logger.debug(`Ignoring duplicate message: ${s2}`), i2;
  }
  async onProviderPayload(e) {
    if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({ type: "payload", direction: "incoming", payload: e }), isJsonRpcRequest(e)) {
      if (!e.method.endsWith(wt)) return;
      const t = e.params, { topic: s2, message: i2, publishedAt: r2, attestation: n2 } = t.data, a3 = { topic: s2, message: i2, publishedAt: r2, transportType: F$1.relay, attestation: n2 };
      this.logger.debug("Emitting Relayer Payload"), this.logger.trace(cn({ type: "event", event: t.id }, a3)), this.events.emit(t.id, a3), await this.acknowledgePayload(e), await this.onMessageEvent(a3);
    } else isJsonRpcResponse(e) && this.events.emit(w.message_ack, e);
  }
  async onMessageEvent(e) {
    await this.shouldIgnoreMessageEvent(e) || (this.events.emit(w.message, e), await this.recordMessageEvent(e));
  }
  async acknowledgePayload(e) {
    const t = formatJsonRpcResult(e.id, true);
    await this.provider.connection.send(t);
  }
  unregisterProviderListeners() {
    this.provider.off(T$1.payload, this.onPayloadHandler), this.provider.off(T$1.connect, this.onConnectHandler), this.provider.off(T$1.disconnect, this.onDisconnectHandler), this.provider.off(T$1.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
  }
  async registerEventListeners() {
    let e = await Eh();
    Sh(async (t) => {
      e !== t && (e = t, t ? await this.restartTransport().catch((s2) => this.logger.error(s2)) : (this.hasExperiencedNetworkDisruption = true, await this.transportDisconnect(), this.transportExplicitlyClosed = false));
    });
  }
  async onProviderDisconnect() {
    await this.subscriber.stop(), this.requestsInFlight.clear(), clearTimeout(this.pingTimeout), this.events.emit(w.disconnect), this.connectionAttemptInProgress = false, !this.transportExplicitlyClosed && (this.reconnectTimeout || (this.reconnectTimeout = setTimeout(async () => {
      await this.transportOpen().catch((e) => this.logger.error(e));
    }, cjs.toMiliseconds(It))));
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  async toEstablishConnection() {
    await this.confirmOnlineStateOrThrow(), !this.connected && (this.connectionAttemptInProgress && await new Promise((e) => {
      const t = setInterval(() => {
        this.connected && (clearInterval(t), e());
      }, this.connectionStatusPollingInterval);
    }), await this.transportOpen());
  }
}
var hn = Object.defineProperty, ti = Object.getOwnPropertySymbols, ln = Object.prototype.hasOwnProperty, un = Object.prototype.propertyIsEnumerable, ii = (o2, e, t) => e in o2 ? hn(o2, e, { enumerable: true, configurable: true, writable: true, value: t }) : o2[e] = t, si = (o2, e) => {
  for (var t in e || (e = {})) ln.call(e, t) && ii(o2, t, e[t]);
  if (ti) for (var t of ti(e)) un.call(e, t) && ii(o2, t, e[t]);
  return o2;
};
class ri extends p$1 {
  constructor(e, t, s2, i2 = O$1, r2 = void 0) {
    super(e, t, s2, i2), this.core = e, this.logger = t, this.name = s2, this.map = /* @__PURE__ */ new Map(), this.version = Tt$1, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.recentlyDeleted = [], this.recentlyDeletedLimit = 200, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((n2) => {
        this.getKey && n2 !== null && !Pe(n2) ? this.map.set(this.getKey(n2), n2) : sh(n2) ? this.map.set(n2.id, n2) : ah(n2) && this.map.set(n2.topic, n2);
      }), this.cached = [], this.initialized = true);
    }, this.set = async (n2, a3) => {
      this.isInitialized(), this.map.has(n2) ? await this.update(n2, a3) : (this.logger.debug("Setting value"), this.logger.trace({ type: "method", method: "set", key: n2, value: a3 }), this.map.set(n2, a3), await this.persist());
    }, this.get = (n2) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({ type: "method", method: "get", key: n2 }), this.getData(n2)), this.getAll = (n2) => (this.isInitialized(), n2 ? this.values.filter((a3) => Object.keys(n2).every((c2) => ys$1(a3[c2], n2[c2]))) : this.values), this.update = async (n2, a3) => {
      this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({ type: "method", method: "update", key: n2, update: a3 });
      const c2 = si(si({}, this.getData(n2)), a3);
      this.map.set(n2, c2), await this.persist();
    }, this.delete = async (n2, a3) => {
      this.isInitialized(), this.map.has(n2) && (this.logger.debug("Deleting value"), this.logger.trace({ type: "method", method: "delete", key: n2, reason: a3 }), this.map.delete(n2), this.addToRecentlyDeleted(n2), await this.persist());
    }, this.logger = E$1(t, this.name), this.storagePrefix = i2, this.getKey = r2;
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.map.size;
  }
  get keys() {
    return Array.from(this.map.keys());
  }
  get values() {
    return Array.from(this.map.values());
  }
  addToRecentlyDeleted(e) {
    this.recentlyDeleted.push(e), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
  }
  async setDataStore(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getDataStore() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getData(e) {
    const t = this.map.get(e);
    if (!t) {
      if (this.recentlyDeleted.includes(e)) {
        const { message: i2 } = xe("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e}`);
        throw this.logger.error(i2), new Error(i2);
      }
      const { message: s2 } = xe("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw this.logger.error(s2), new Error(s2);
    }
    return t;
  }
  async persist() {
    await this.setDataStore(this.values);
  }
  async restore() {
    try {
      const e = await this.getDataStore();
      if (typeof e > "u" || !e.length) return;
      if (this.map.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({ type: "method", method: "restore", value: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class ni {
  constructor(e, t) {
    this.core = e, this.logger = t, this.name = xt, this.version = Ot, this.events = new Gg(), this.initialized = false, this.storagePrefix = O$1, this.ignoredPayloadTypes = [pr$2], this.registeredMethods = [], this.init = async () => {
      this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = true, this.logger.trace("Initialized"));
    }, this.register = ({ methods: s2 }) => {
      this.isInitialized(), this.registeredMethods = [.../* @__PURE__ */ new Set([...this.registeredMethods, ...s2])];
    }, this.create = async (s2) => {
      this.isInitialized();
      const i2 = Eu(), r2 = await this.core.crypto.setSymKey(i2), n2 = ms$2(cjs.FIVE_MINUTES), a3 = { protocol: _t }, c2 = { topic: r2, expiry: n2, relay: a3, active: false }, h3 = Gu({ protocol: this.core.protocol, version: this.core.version, topic: r2, symKey: i2, relay: a3, expiryTimestamp: n2, methods: s2 == null ? void 0 : s2.methods });
      return this.core.expirer.set(r2, n2), await this.pairings.set(r2, c2), await this.core.relayer.subscribe(r2, { transportType: s2 == null ? void 0 : s2.transportType }), { topic: r2, uri: h3 };
    }, this.pair = async (s2) => {
      this.isInitialized();
      const i2 = this.core.eventClient.createEvent({ properties: { topic: s2 == null ? void 0 : s2.uri, trace: [z$1.pairing_started] } });
      this.isValidPair(s2, i2);
      const { topic: r2, symKey: n2, relay: a3, expiryTimestamp: c2, methods: h3 } = Ju(s2.uri);
      i2.props.properties.topic = r2, i2.addTrace(z$1.pairing_uri_validation_success), i2.addTrace(z$1.pairing_uri_not_expired);
      let d3;
      if (this.pairings.keys.includes(r2)) {
        if (d3 = this.pairings.get(r2), i2.addTrace(z$1.existing_pairing), d3.active) throw i2.setError($$1.active_pairing_already_exists), new Error(`Pairing already exists: ${r2}. Please try again with a new connection URI.`);
        i2.addTrace(z$1.pairing_not_expired);
      }
      const g3 = c2 || ms$2(cjs.FIVE_MINUTES), m3 = { topic: r2, relay: a3, expiry: g3, active: false, methods: h3 };
      this.core.expirer.set(r2, g3), await this.pairings.set(r2, m3), i2.addTrace(z$1.store_new_pairing), s2.activatePairing && await this.activate({ topic: r2 }), this.events.emit(Z.create, m3), i2.addTrace(z$1.emit_inactive_pairing), this.core.crypto.keychain.has(r2) || await this.core.crypto.setSymKey(n2, r2), i2.addTrace(z$1.subscribing_pairing_topic);
      try {
        await this.core.relayer.confirmOnlineStateOrThrow();
      } catch {
        i2.setError($$1.no_internet_connection);
      }
      try {
        await this.core.relayer.subscribe(r2, { relay: a3 });
      } catch (b2) {
        throw i2.setError($$1.subscribe_pairing_topic_failure), b2;
      }
      return i2.addTrace(z$1.subscribe_pairing_topic_success), m3;
    }, this.activate = async ({ topic: s2 }) => {
      this.isInitialized();
      const i2 = ms$2(cjs.THIRTY_DAYS);
      this.core.expirer.set(s2, i2), await this.pairings.update(s2, { active: true, expiry: i2 });
    }, this.ping = async (s2) => {
      this.isInitialized(), await this.isValidPing(s2);
      const { topic: i2 } = s2;
      if (this.pairings.keys.includes(i2)) {
        const r2 = await this.sendRequest(i2, "wc_pairingPing", {}), { done: n2, resolve: a3, reject: c2 } = ls();
        this.events.once(bs$1("pairing_ping", r2), ({ error: h3 }) => {
          h3 ? c2(h3) : a3();
        }), await n2();
      }
    }, this.updateExpiry = async ({ topic: s2, expiry: i2 }) => {
      this.isInitialized(), await this.pairings.update(s2, { expiry: i2 });
    }, this.updateMetadata = async ({ topic: s2, metadata: i2 }) => {
      this.isInitialized(), await this.pairings.update(s2, { peerMetadata: i2 });
    }, this.getPairings = () => (this.isInitialized(), this.pairings.values), this.disconnect = async (s2) => {
      this.isInitialized(), await this.isValidDisconnect(s2);
      const { topic: i2 } = s2;
      this.pairings.keys.includes(i2) && (await this.sendRequest(i2, "wc_pairingDelete", er$1("USER_DISCONNECTED")), await this.deletePairing(i2));
    }, this.sendRequest = async (s2, i2, r2) => {
      const n2 = formatJsonRpcRequest(i2, r2), a3 = await this.core.crypto.encode(s2, n2), c2 = j$1[i2].req;
      return this.core.history.set(s2, n2), this.core.relayer.publish(s2, a3, c2), n2.id;
    }, this.sendResult = async (s2, i2, r2) => {
      const n2 = formatJsonRpcResult(s2, r2), a3 = await this.core.crypto.encode(i2, n2), c2 = await this.core.history.get(i2, s2), h3 = j$1[c2.request.method].res;
      await this.core.relayer.publish(i2, a3, h3), await this.core.history.resolve(n2);
    }, this.sendError = async (s2, i2, r2) => {
      const n2 = formatJsonRpcError(s2, r2), a3 = await this.core.crypto.encode(i2, n2), c2 = await this.core.history.get(i2, s2), h3 = j$1[c2.request.method] ? j$1[c2.request.method].res : j$1.unregistered_method.res;
      await this.core.relayer.publish(i2, a3, h3), await this.core.history.resolve(n2);
    }, this.deletePairing = async (s2, i2) => {
      await this.core.relayer.unsubscribe(s2), await Promise.all([this.pairings.delete(s2, er$1("USER_DISCONNECTED")), this.core.crypto.deleteSymKey(s2), i2 ? Promise.resolve() : this.core.expirer.del(s2)]);
    }, this.cleanup = async () => {
      const s2 = this.pairings.getAll().filter((i2) => As$1(i2.expiry));
      await Promise.all(s2.map((i2) => this.deletePairing(i2.topic)));
    }, this.onRelayEventRequest = (s2) => {
      const { topic: i2, payload: r2 } = s2;
      switch (r2.method) {
        case "wc_pairingPing":
          return this.onPairingPingRequest(i2, r2);
        case "wc_pairingDelete":
          return this.onPairingDeleteRequest(i2, r2);
        default:
          return this.onUnknownRpcMethodRequest(i2, r2);
      }
    }, this.onRelayEventResponse = async (s2) => {
      const { topic: i2, payload: r2 } = s2, n2 = (await this.core.history.get(i2, r2.id)).request.method;
      switch (n2) {
        case "wc_pairingPing":
          return this.onPairingPingResponse(i2, r2);
        default:
          return this.onUnknownRpcMethodResponse(n2);
      }
    }, this.onPairingPingRequest = async (s2, i2) => {
      const { id: r2 } = i2;
      try {
        this.isValidPing({ topic: s2 }), await this.sendResult(r2, s2, true), this.events.emit(Z.ping, { id: r2, topic: s2 });
      } catch (n2) {
        await this.sendError(r2, s2, n2), this.logger.error(n2);
      }
    }, this.onPairingPingResponse = (s2, i2) => {
      const { id: r2 } = i2;
      setTimeout(() => {
        isJsonRpcResult(i2) ? this.events.emit(bs$1("pairing_ping", r2), {}) : isJsonRpcError(i2) && this.events.emit(bs$1("pairing_ping", r2), { error: i2.error });
      }, 500);
    }, this.onPairingDeleteRequest = async (s2, i2) => {
      const { id: r2 } = i2;
      try {
        this.isValidDisconnect({ topic: s2 }), await this.deletePairing(s2), this.events.emit(Z.delete, { id: r2, topic: s2 });
      } catch (n2) {
        await this.sendError(r2, s2, n2), this.logger.error(n2);
      }
    }, this.onUnknownRpcMethodRequest = async (s2, i2) => {
      const { id: r2, method: n2 } = i2;
      try {
        if (this.registeredMethods.includes(n2)) return;
        const a3 = er$1("WC_METHOD_UNSUPPORTED", n2);
        await this.sendError(r2, s2, a3), this.logger.error(a3);
      } catch (a3) {
        await this.sendError(r2, s2, a3), this.logger.error(a3);
      }
    }, this.onUnknownRpcMethodResponse = (s2) => {
      this.registeredMethods.includes(s2) || this.logger.error(er$1("WC_METHOD_UNSUPPORTED", s2));
    }, this.isValidPair = (s2, i2) => {
      var r2;
      if (!dh(s2)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `pair() params: ${s2}`);
        throw i2.setError($$1.malformed_pairing_uri), new Error(a3);
      }
      if (!oh(s2.uri)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `pair() uri: ${s2.uri}`);
        throw i2.setError($$1.malformed_pairing_uri), new Error(a3);
      }
      const n2 = Ju(s2 == null ? void 0 : s2.uri);
      if (!((r2 = n2 == null ? void 0 : n2.relay) != null && r2.protocol)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", "pair() uri#relay-protocol");
        throw i2.setError($$1.malformed_pairing_uri), new Error(a3);
      }
      if (!(n2 != null && n2.symKey)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", "pair() uri#symKey");
        throw i2.setError($$1.malformed_pairing_uri), new Error(a3);
      }
      if (n2 != null && n2.expiryTimestamp && cjs.toMiliseconds(n2 == null ? void 0 : n2.expiryTimestamp) < Date.now()) {
        i2.setError($$1.pairing_expired);
        const { message: a3 } = xe("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
        throw new Error(a3);
      }
    }, this.isValidPing = async (s2) => {
      if (!dh(s2)) {
        const { message: r2 } = xe("MISSING_OR_INVALID", `ping() params: ${s2}`);
        throw new Error(r2);
      }
      const { topic: i2 } = s2;
      await this.isValidPairingTopic(i2);
    }, this.isValidDisconnect = async (s2) => {
      if (!dh(s2)) {
        const { message: r2 } = xe("MISSING_OR_INVALID", `disconnect() params: ${s2}`);
        throw new Error(r2);
      }
      const { topic: i2 } = s2;
      await this.isValidPairingTopic(i2);
    }, this.isValidPairingTopic = async (s2) => {
      if (!Yt$1(s2, false)) {
        const { message: i2 } = xe("MISSING_OR_INVALID", `pairing topic should be a string: ${s2}`);
        throw new Error(i2);
      }
      if (!this.pairings.keys.includes(s2)) {
        const { message: i2 } = xe("NO_MATCHING_KEY", `pairing topic doesn't exist: ${s2}`);
        throw new Error(i2);
      }
      if (As$1(this.pairings.get(s2).expiry)) {
        await this.deletePairing(s2);
        const { message: i2 } = xe("EXPIRED", `pairing topic: ${s2}`);
        throw new Error(i2);
      }
    }, this.core = e, this.logger = E$1(t, this.name), this.pairings = new ri(this.core, this.logger, this.name, this.storagePrefix);
  }
  get context() {
    return y$3(this.logger);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  registerRelayerEvents() {
    this.core.relayer.on(w.message, async (e) => {
      const { topic: t, message: s2, transportType: i2 } = e;
      if (!this.pairings.keys.includes(t) || i2 === F$1.link_mode || this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(s2))) return;
      const r2 = await this.core.crypto.decode(t, s2);
      try {
        isJsonRpcRequest(r2) ? (this.core.history.set(t, r2), this.onRelayEventRequest({ topic: t, payload: r2 })) : isJsonRpcResponse(r2) && (await this.core.history.resolve(r2), await this.onRelayEventResponse({ topic: t, payload: r2 }), this.core.history.delete(t, r2.id));
      } catch (n2) {
        this.logger.error(n2);
      }
    });
  }
  registerExpirerEvents() {
    this.core.expirer.on(R$1.expired, async (e) => {
      const { topic: t } = gs$1(e.target);
      t && this.pairings.keys.includes(t) && (await this.deletePairing(t, true), this.events.emit(Z.expire, { topic: t }));
    });
  }
}
class oi extends h$1 {
  constructor(e, t) {
    super(e, t), this.core = e, this.logger = t, this.records = /* @__PURE__ */ new Map(), this.events = new eventsExports.EventEmitter(), this.name = At, this.version = Nt, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((s2) => this.records.set(s2.id, s2)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.set = (s2, i2, r2) => {
      if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({ type: "method", method: "set", topic: s2, request: i2, chainId: r2 }), this.records.has(i2.id)) return;
      const n2 = { id: i2.id, topic: s2, request: { method: i2.method, params: i2.params || null }, chainId: r2, expiry: ms$2(cjs.THIRTY_DAYS) };
      this.records.set(n2.id, n2), this.persist(), this.events.emit(P.created, n2);
    }, this.resolve = async (s2) => {
      if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({ type: "method", method: "update", response: s2 }), !this.records.has(s2.id)) return;
      const i2 = await this.getRecord(s2.id);
      typeof i2.response > "u" && (i2.response = isJsonRpcError(s2) ? { error: s2.error } : { result: s2.result }, this.records.set(i2.id, i2), this.persist(), this.events.emit(P.updated, i2));
    }, this.get = async (s2, i2) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({ type: "method", method: "get", topic: s2, id: i2 }), await this.getRecord(i2)), this.delete = (s2, i2) => {
      this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({ type: "method", method: "delete", id: i2 }), this.values.forEach((r2) => {
        if (r2.topic === s2) {
          if (typeof i2 < "u" && r2.id !== i2) return;
          this.records.delete(r2.id), this.events.emit(P.deleted, r2);
        }
      }), this.persist();
    }, this.exists = async (s2, i2) => (this.isInitialized(), this.records.has(i2) ? (await this.getRecord(i2)).topic === s2 : false), this.on = (s2, i2) => {
      this.events.on(s2, i2);
    }, this.once = (s2, i2) => {
      this.events.once(s2, i2);
    }, this.off = (s2, i2) => {
      this.events.off(s2, i2);
    }, this.removeListener = (s2, i2) => {
      this.events.removeListener(s2, i2);
    }, this.logger = E$1(t, this.name);
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get size() {
    return this.records.size;
  }
  get keys() {
    return Array.from(this.records.keys());
  }
  get values() {
    return Array.from(this.records.values());
  }
  get pending() {
    const e = [];
    return this.values.forEach((t) => {
      if (typeof t.response < "u") return;
      const s2 = { topic: t.topic, request: formatJsonRpcRequest(t.request.method, t.request.params, t.id), chainId: t.chainId };
      return e.push(s2);
    }), e;
  }
  async setJsonRpcRecords(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getJsonRpcRecords() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getRecord(e) {
    this.isInitialized();
    const t = this.records.get(e);
    if (!t) {
      const { message: s2 } = xe("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw new Error(s2);
    }
    return t;
  }
  async persist() {
    await this.setJsonRpcRecords(this.values), this.events.emit(P.sync);
  }
  async restore() {
    try {
      const e = await this.getJsonRpcRecords();
      if (typeof e > "u" || !e.length) return;
      if (this.records.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", records: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
    }
  }
  registerEventListeners() {
    this.events.on(P.created, (e) => {
      const t = P.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e });
    }), this.events.on(P.updated, (e) => {
      const t = P.updated;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e });
    }), this.events.on(P.deleted, (e) => {
      const t = P.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e });
    }), this.core.heartbeat.on(r$2.pulse, () => {
      this.cleanup();
    });
  }
  cleanup() {
    try {
      this.isInitialized();
      let e = false;
      this.records.forEach((t) => {
        cjs.toMiliseconds(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(P.deleted, t, false), e = true);
      }), e && this.persist();
    } catch (e) {
      this.logger.warn(e);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class ai extends x$1 {
  constructor(e, t) {
    super(e, t), this.core = e, this.logger = t, this.expirations = /* @__PURE__ */ new Map(), this.events = new eventsExports.EventEmitter(), this.name = Lt$1, this.version = zt, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((s2) => this.expirations.set(s2.target, s2)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.has = (s2) => {
      try {
        const i2 = this.formatTarget(s2);
        return typeof this.getExpiration(i2) < "u";
      } catch {
        return false;
      }
    }, this.set = (s2, i2) => {
      this.isInitialized();
      const r2 = this.formatTarget(s2), n2 = { target: r2, expiry: i2 };
      this.expirations.set(r2, n2), this.checkExpiry(r2, n2), this.events.emit(R$1.created, { target: r2, expiration: n2 });
    }, this.get = (s2) => {
      this.isInitialized();
      const i2 = this.formatTarget(s2);
      return this.getExpiration(i2);
    }, this.del = (s2) => {
      if (this.isInitialized(), this.has(s2)) {
        const i2 = this.formatTarget(s2), r2 = this.getExpiration(i2);
        this.expirations.delete(i2), this.events.emit(R$1.deleted, { target: i2, expiration: r2 });
      }
    }, this.on = (s2, i2) => {
      this.events.on(s2, i2);
    }, this.once = (s2, i2) => {
      this.events.once(s2, i2);
    }, this.off = (s2, i2) => {
      this.events.off(s2, i2);
    }, this.removeListener = (s2, i2) => {
      this.events.removeListener(s2, i2);
    }, this.logger = E$1(t, this.name);
  }
  get context() {
    return y$3(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.expirations.size;
  }
  get keys() {
    return Array.from(this.expirations.keys());
  }
  get values() {
    return Array.from(this.expirations.values());
  }
  formatTarget(e) {
    if (typeof e == "string") return ps(e);
    if (typeof e == "number") return vs$2(e);
    const { message: t } = xe("UNKNOWN_TYPE", `Target type: ${typeof e}`);
    throw new Error(t);
  }
  async setExpirations(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getExpirations() {
    return await this.core.storage.getItem(this.storageKey);
  }
  async persist() {
    await this.setExpirations(this.values), this.events.emit(R$1.sync);
  }
  async restore() {
    try {
      const e = await this.getExpirations();
      if (typeof e > "u" || !e.length) return;
      if (this.expirations.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({ type: "method", method: "restore", expirations: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
    }
  }
  getExpiration(e) {
    const t = this.expirations.get(e);
    if (!t) {
      const { message: s2 } = xe("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw this.logger.warn(s2), new Error(s2);
    }
    return t;
  }
  checkExpiry(e, t) {
    const { expiry: s2 } = t;
    cjs.toMiliseconds(s2) - Date.now() <= 0 && this.expire(e, t);
  }
  expire(e, t) {
    this.expirations.delete(e), this.events.emit(R$1.expired, { target: e, expiration: t });
  }
  checkExpirations() {
    this.core.relayer.connected && this.expirations.forEach((e, t) => this.checkExpiry(t, e));
  }
  registerEventListeners() {
    this.core.heartbeat.on(r$2.pulse, () => this.checkExpirations()), this.events.on(R$1.created, (e) => {
      const t = R$1.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    }), this.events.on(R$1.expired, (e) => {
      const t = R$1.expired;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    }), this.events.on(R$1.deleted, (e) => {
      const t = R$1.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
var y$1 = {};
Object.defineProperty(y$1, "__esModule", { value: true }), y$1.getLocalStorage = y$1.getLocalStorageOrThrow = y$1.getCrypto = y$1.getCryptoOrThrow = y$1.getLocation = y$1.getLocationOrThrow = y$1.getNavigator = y$1.getNavigatorOrThrow = ci = y$1.getDocument = y$1.getDocumentOrThrow = y$1.getFromWindowOrThrow = y$1.getFromWindow = void 0;
function U$1(o2) {
  let e;
  return typeof window < "u" && typeof window[o2] < "u" && (e = window[o2]), e;
}
y$1.getFromWindow = U$1;
function q$1(o2) {
  const e = U$1(o2);
  if (!e) throw new Error(`${o2} is not defined in Window`);
  return e;
}
y$1.getFromWindowOrThrow = q$1;
function dn() {
  return q$1("document");
}
y$1.getDocumentOrThrow = dn;
function gn() {
  return U$1("document");
}
var ci = y$1.getDocument = gn;
function pn() {
  return q$1("navigator");
}
y$1.getNavigatorOrThrow = pn;
function yn() {
  return U$1("navigator");
}
y$1.getNavigator = yn;
function Dn() {
  return q$1("location");
}
y$1.getLocationOrThrow = Dn;
function mn() {
  return U$1("location");
}
y$1.getLocation = mn;
function bn() {
  return q$1("crypto");
}
y$1.getCryptoOrThrow = bn;
function fn() {
  return U$1("crypto");
}
y$1.getCrypto = fn;
function _n() {
  return q$1("localStorage");
}
y$1.getLocalStorageOrThrow = _n;
function En() {
  return U$1("localStorage");
}
y$1.getLocalStorage = En;
class hi extends y$2 {
  constructor(e, t, s2) {
    super(e, t, s2), this.core = e, this.logger = t, this.store = s2, this.name = Mt, this.verifyUrlV3 = kt, this.storagePrefix = O$1, this.version = ve, this.init = async () => {
      var i2;
      this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && cjs.toMiliseconds((i2 = this.publicKey) == null ? void 0 : i2.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
    }, this.register = async (i2) => {
      if (!gr$1() || this.isDevEnv) return;
      const r2 = window.location.origin, { id: n2, decryptedId: a3 } = i2, c2 = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${r2}&id=${n2}&decryptedId=${a3}`;
      try {
        const h3 = ci(), d3 = this.startAbortTimer(cjs.ONE_SECOND * 5), g3 = await new Promise((m3, b2) => {
          const l2 = () => {
            window.removeEventListener("message", _2), h3.body.removeChild(p3), b2("attestation aborted");
          };
          this.abortController.signal.addEventListener("abort", l2);
          const p3 = h3.createElement("iframe");
          p3.src = c2, p3.style.display = "none", p3.addEventListener("error", l2, { signal: this.abortController.signal });
          const _2 = (D2) => {
            if (!D2.data) return;
            const E2 = JSON.parse(D2.data);
            if (E2.type === "verify_attestation") {
              if (decodeJWT(E2.attestation).payload.id !== n2) return;
              clearInterval(d3), h3.body.removeChild(p3), this.abortController.signal.removeEventListener("abort", l2), window.removeEventListener("message", _2), m3(E2.attestation === null ? "" : E2.attestation);
            }
          };
          h3.body.appendChild(p3), window.addEventListener("message", _2, { signal: this.abortController.signal });
        });
        return this.logger.debug("jwt attestation", g3), g3;
      } catch (h3) {
        this.logger.warn(h3);
      }
      return "";
    }, this.resolve = async (i2) => {
      if (this.isDevEnv) return "";
      const { attestationId: r2, hash: n2, encryptedId: a3 } = i2;
      if (r2 === "") {
        this.logger.debug("resolve: attestationId is empty, skipping");
        return;
      }
      if (r2) {
        if (decodeJWT(r2).payload.id !== a3) return;
        const h3 = await this.isValidJwtAttestation(r2);
        if (h3) {
          if (!h3.isVerified) {
            this.logger.warn("resolve: jwt attestation: origin url not verified");
            return;
          }
          return h3;
        }
      }
      if (!n2) return;
      const c2 = this.getVerifyUrl(i2 == null ? void 0 : i2.verifyUrl);
      return this.fetchAttestation(n2, c2);
    }, this.fetchAttestation = async (i2, r2) => {
      this.logger.debug(`resolving attestation: ${i2} from url: ${r2}`);
      const n2 = this.startAbortTimer(cjs.ONE_SECOND * 5), a3 = await fetch(`${r2}/attestation/${i2}?v2Supported=true`, { signal: this.abortController.signal });
      return clearTimeout(n2), a3.status === 200 ? await a3.json() : void 0;
    }, this.getVerifyUrl = (i2) => {
      let r2 = i2 || Q$1;
      return Ft.includes(r2) || (this.logger.info(`verify url: ${r2}, not included in trusted list, assigning default: ${Q$1}`), r2 = Q$1), r2;
    }, this.fetchPublicKey = async () => {
      try {
        this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
        const i2 = this.startAbortTimer(cjs.FIVE_SECONDS), r2 = await fetch(`${this.verifyUrlV3}/public-key`, { signal: this.abortController.signal });
        return clearTimeout(i2), await r2.json();
      } catch (i2) {
        this.logger.warn(i2);
      }
    }, this.persistPublicKey = async (i2) => {
      this.logger.debug("persisting public key to local storage", i2), await this.store.setItem(this.storeKey, i2), this.publicKey = i2;
    }, this.removePublicKey = async () => {
      this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
    }, this.isValidJwtAttestation = async (i2) => {
      const r2 = await this.getPublicKey();
      try {
        if (r2) return this.validateAttestation(i2, r2);
      } catch (a3) {
        this.logger.error(a3), this.logger.warn("error validating attestation");
      }
      const n2 = await this.fetchAndPersistPublicKey();
      try {
        if (n2) return this.validateAttestation(i2, n2);
      } catch (a3) {
        this.logger.error(a3), this.logger.warn("error validating attestation");
      }
    }, this.getPublicKey = async () => this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey(), this.fetchAndPersistPublicKey = async () => {
      if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
      this.fetchPromise = new Promise(async (r2) => {
        const n2 = await this.fetchPublicKey();
        n2 && (await this.persistPublicKey(n2), r2(n2));
      });
      const i2 = await this.fetchPromise;
      return this.fetchPromise = void 0, i2;
    }, this.validateAttestation = (i2, r2) => {
      const n2 = Uu(i2, r2.publicKey), a3 = { hasExpired: cjs.toMiliseconds(n2.exp) < Date.now(), payload: n2 };
      if (a3.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), new Error("JWT attestation expired");
      return { origin: a3.payload.origin, isScam: a3.payload.isScam, isVerified: a3.payload.isVerified };
    }, this.logger = E$1(t, this.name), this.abortController = new AbortController(), this.isDevEnv = bi() && define_process_env_default$1.IS_VITEST, this.init();
  }
  get storeKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
  }
  get context() {
    return y$3(this.logger);
  }
  startAbortTimer(e) {
    return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), cjs.toMiliseconds(e));
  }
}
class li extends v$2 {
  constructor(e, t) {
    super(e, t), this.projectId = e, this.logger = t, this.context = Ut2, this.registerDeviceToken = async (s2) => {
      const { clientId: i2, token: r2, notificationType: n2, enableEncrypted: a3 = false } = s2, c2 = `${Kt}/${this.projectId}/clients`;
      await fetch(c2, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: i2, type: n2, token: r2, always_raw: a3 }) });
    }, this.logger = E$1(t, this.context);
  }
}
var vn = Object.defineProperty, ui = Object.getOwnPropertySymbols, wn = Object.prototype.hasOwnProperty, In$1 = Object.prototype.propertyIsEnumerable, di = (o2, e, t) => e in o2 ? vn(o2, e, { enumerable: true, configurable: true, writable: true, value: t }) : o2[e] = t, te = (o2, e) => {
  for (var t in e || (e = {})) wn.call(e, t) && di(o2, t, e[t]);
  if (ui) for (var t of ui(e)) In$1.call(e, t) && di(o2, t, e[t]);
  return o2;
};
class gi extends C$1 {
  constructor(e, t, s2 = true) {
    super(e, t, s2), this.core = e, this.logger = t, this.context = Vt, this.storagePrefix = O$1, this.storageVersion = Bt, this.events = /* @__PURE__ */ new Map(), this.shouldPersist = false, this.createEvent = (i2) => {
      const { event: r2 = "ERROR", type: n2 = "", properties: { topic: a3, trace: c2 } } = i2, h3 = Ms$1(), d3 = this.core.projectId || "", g3 = Date.now(), m3 = te({ eventId: h3, bundleId: d3, timestamp: g3, props: { event: r2, type: n2, properties: { topic: a3, trace: c2 } } }, this.setMethods(h3));
      return this.telemetryEnabled && (this.events.set(h3, m3), this.shouldPersist = true), m3;
    }, this.getEvent = (i2) => {
      const { eventId: r2, topic: n2 } = i2;
      if (r2) return this.events.get(r2);
      const a3 = Array.from(this.events.values()).find((c2) => c2.props.properties.topic === n2);
      if (a3) return te(te({}, a3), this.setMethods(a3.eventId));
    }, this.deleteEvent = (i2) => {
      const { eventId: r2 } = i2;
      this.events.delete(r2), this.shouldPersist = true;
    }, this.setEventListeners = () => {
      this.core.heartbeat.on(r$2.pulse, async () => {
        this.shouldPersist && await this.persist(), this.events.forEach((i2) => {
          cjs.fromMiliseconds(Date.now()) - cjs.fromMiliseconds(i2.timestamp) > jt && (this.events.delete(i2.eventId), this.shouldPersist = true);
        });
      });
    }, this.setMethods = (i2) => ({ addTrace: (r2) => this.addTrace(i2, r2), setError: (r2) => this.setError(i2, r2) }), this.addTrace = (i2, r2) => {
      const n2 = this.events.get(i2);
      n2 && (n2.props.properties.trace.push(r2), this.events.set(i2, n2), this.shouldPersist = true);
    }, this.setError = (i2, r2) => {
      const n2 = this.events.get(i2);
      n2 && (n2.props.type = r2, n2.timestamp = Date.now(), this.events.set(i2, n2), this.shouldPersist = true);
    }, this.persist = async () => {
      await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = false;
    }, this.restore = async () => {
      try {
        const i2 = await this.core.storage.getItem(this.storageKey) || [];
        if (!i2.length) return;
        i2.forEach((r2) => {
          this.events.set(r2.eventId, te(te({}, r2), this.setMethods(r2.eventId)));
        });
      } catch (i2) {
        this.logger.warn(i2);
      }
    }, this.submit = async () => {
      if (!this.telemetryEnabled || this.events.size === 0) return;
      const i2 = [];
      for (const [r2, n2] of this.events) n2.props.type && i2.push(n2);
      if (i2.length !== 0) try {
        if ((await fetch(`${qt}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${Te}`, { method: "POST", body: JSON.stringify(i2) })).ok) for (const r2 of i2) this.events.delete(r2.eventId), this.shouldPersist = true;
      } catch (r2) {
        this.logger.warn(r2);
      }
    }, this.logger = E$1(t, this.context), s2 ? this.restore().then(async () => {
      await this.submit(), this.setEventListeners();
    }) : this.persist();
  }
  get storageKey() {
    return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
  }
}
var Tn = Object.defineProperty, pi = Object.getOwnPropertySymbols, Cn = Object.prototype.hasOwnProperty, Sn = Object.prototype.propertyIsEnumerable, yi = (o2, e, t) => e in o2 ? Tn(o2, e, { enumerable: true, configurable: true, writable: true, value: t }) : o2[e] = t, Di = (o2, e) => {
  for (var t in e || (e = {})) Cn.call(e, t) && yi(o2, t, e[t]);
  if (pi) for (var t of pi(e)) Sn.call(e, t) && yi(o2, t, e[t]);
  return o2;
};
let ae$1 = class ae extends n {
  constructor(e) {
    var t;
    super(e), this.protocol = Ee, this.version = ve, this.name = oe$1, this.events = new eventsExports.EventEmitter(), this.initialized = false, this.on = (n2, a3) => this.events.on(n2, a3), this.once = (n2, a3) => this.events.once(n2, a3), this.off = (n2, a3) => this.events.off(n2, a3), this.removeListener = (n2, a3) => this.events.removeListener(n2, a3), this.dispatchEnvelope = ({ topic: n2, message: a3, sessionExists: c2 }) => {
      if (!n2 || !a3) return;
      const h3 = { topic: n2, message: a3, publishedAt: Date.now(), transportType: F$1.link_mode };
      this.relayer.onLinkMessageEvent(h3, { sessionExists: c2 });
    }, this.projectId = e == null ? void 0 : e.projectId, this.relayUrl = (e == null ? void 0 : e.relayUrl) || Ie, this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
    const s2 = k({ level: typeof (e == null ? void 0 : e.logger) == "string" && e.logger ? e.logger : lt$1.logger }), { logger: i2, chunkLoggerController: r2 } = A$1({ opts: s2, maxSizeInBytes: e == null ? void 0 : e.maxLogBlobSizeInBytes, loggerOverride: e == null ? void 0 : e.logger });
    this.logChunkController = r2, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
      var n2, a3;
      (n2 = this.logChunkController) != null && n2.downloadLogsBlobInBrowser && ((a3 = this.logChunkController) == null || a3.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
    }), this.logger = E$1(i2, this.name), this.heartbeat = new i$1(), this.crypto = new Ht(this, this.logger, e == null ? void 0 : e.keychain), this.history = new oi(this, this.logger), this.expirer = new ai(this, this.logger), this.storage = e != null && e.storage ? e.storage : new h$2(Di(Di({}, ut$1), e == null ? void 0 : e.storageOptions)), this.relayer = new ei({ core: this, logger: this.logger, relayUrl: this.relayUrl, projectId: this.projectId }), this.pairing = new ni(this, this.logger), this.verify = new hi(this, this.logger, this.storage), this.echoClient = new li(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new gi(this, this.logger, e == null ? void 0 : e.telemetryEnabled);
  }
  static async init(e) {
    const t = new ae(e);
    await t.initialize();
    const s2 = await t.crypto.getClientId();
    return await t.storage.setItem(Ct, s2), t;
  }
  get context() {
    return y$3(this.logger);
  }
  async start() {
    this.initialized || await this.initialize();
  }
  async getLogsBlob() {
    var e;
    return (e = this.logChunkController) == null ? void 0 : e.logsToBlob({ clientId: await this.crypto.getClientId() });
  }
  async addLinkModeSupportedApp(e) {
    this.linkModeSupportedApps.includes(e) || (this.linkModeSupportedApps.push(e), await this.storage.setItem(Ce$1, this.linkModeSupportedApps));
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem(Ce$1) || [], this.initialized = true, this.logger.info("Core Initialization Success");
    } catch (e) {
      throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
    }
  }
};
const Pn = ae$1;
var define_process_env_default = {};
const be = "wc", Ce = 2, De = "client", ye = `${be}@${Ce}:${De}:`, we = { name: De, logger: "error" }, Le = "WALLETCONNECT_DEEPLINK_CHOICE", st = "proposal", it = "Proposal expired", rt = "session", z2 = cjs.SEVEN_DAYS, nt = "engine", v$1 = { wc_sessionPropose: { req: { ttl: cjs.FIVE_MINUTES, prompt: true, tag: 1100 }, res: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1101 }, reject: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1120 }, autoReject: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1121 } }, wc_sessionSettle: { req: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1102 }, res: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1103 } }, wc_sessionUpdate: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 1104 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 1105 } }, wc_sessionExtend: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 1106 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 1107 } }, wc_sessionRequest: { req: { ttl: cjs.FIVE_MINUTES, prompt: true, tag: 1108 }, res: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1109 } }, wc_sessionEvent: { req: { ttl: cjs.FIVE_MINUTES, prompt: true, tag: 1110 }, res: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1111 } }, wc_sessionDelete: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 1112 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 1113 } }, wc_sessionPing: { req: { ttl: cjs.ONE_DAY, prompt: false, tag: 1114 }, res: { ttl: cjs.ONE_DAY, prompt: false, tag: 1115 } }, wc_sessionAuthenticate: { req: { ttl: cjs.ONE_HOUR, prompt: true, tag: 1116 }, res: { ttl: cjs.ONE_HOUR, prompt: false, tag: 1117 }, reject: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1118 }, autoReject: { ttl: cjs.FIVE_MINUTES, prompt: false, tag: 1119 } } }, me = { min: cjs.FIVE_MINUTES, max: cjs.SEVEN_DAYS }, L$1 = { idle: "IDLE", active: "ACTIVE" }, ot = "request", at = ["wc_sessionPropose", "wc_sessionRequest", "wc_authRequest", "wc_sessionAuthenticate"], ct = "wc", lt = "auth", pt = "authKeys", ht = "pairingTopics", dt = "requests", oe = `${ct}@${1.5}:${lt}:`, ae2 = `${oe}:PUB_KEY`;
var gs = Object.defineProperty, ys = Object.defineProperties, ws2 = Object.getOwnPropertyDescriptors, ut = Object.getOwnPropertySymbols, ms = Object.prototype.hasOwnProperty, _s = Object.prototype.propertyIsEnumerable, gt = (q2, o2, e) => o2 in q2 ? gs(q2, o2, { enumerable: true, configurable: true, writable: true, value: e }) : q2[o2] = e, I = (q2, o2) => {
  for (var e in o2 || (o2 = {})) ms.call(o2, e) && gt(q2, e, o2[e]);
  if (ut) for (var e of ut(o2)) _s.call(o2, e) && gt(q2, e, o2[e]);
  return q2;
}, V2 = (q2, o2) => ys(q2, ws2(o2));
class Es2 extends M$1 {
  constructor(o2) {
    super(o2), this.name = nt, this.events = new Gg(), this.initialized = false, this.requestQueue = { state: L$1.idle, queue: [] }, this.sessionRequestQueue = { state: L$1.idle, queue: [] }, this.requestQueueDelay = cjs.ONE_SECOND, this.expectedPairingMethodMap = /* @__PURE__ */ new Map(), this.recentlyDeletedMap = /* @__PURE__ */ new Map(), this.recentlyDeletedLimit = 200, this.relayMessageCache = [], this.init = async () => {
      this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({ methods: Object.keys(v$1) }), this.initialized = true, setTimeout(() => {
        this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
      }, cjs.toMiliseconds(this.requestQueueDelay)));
    }, this.connect = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      const t = V2(I({}, e), { requiredNamespaces: e.requiredNamespaces || {}, optionalNamespaces: e.optionalNamespaces || {} });
      await this.isValidConnect(t);
      const { pairingTopic: s2, requiredNamespaces: i2, optionalNamespaces: r2, sessionProperties: n2, relays: a3 } = t;
      let c2 = s2, h3, p3 = false;
      try {
        c2 && (p3 = this.client.core.pairing.pairings.get(c2).active);
      } catch (E2) {
        throw this.client.logger.error(`connect() -> pairing.get(${c2}) failed`), E2;
      }
      if (!c2 || !p3) {
        const { topic: E2, uri: S4 } = await this.client.core.pairing.create();
        c2 = E2, h3 = S4;
      }
      if (!c2) {
        const { message: E2 } = xe("NO_MATCHING_KEY", `connect() pairing topic: ${c2}`);
        throw new Error(E2);
      }
      const d3 = await this.client.core.crypto.generateKeyPair(), l2 = v$1.wc_sessionPropose.req.ttl || cjs.FIVE_MINUTES, w2 = ms$2(l2), m3 = I({ requiredNamespaces: i2, optionalNamespaces: r2, relays: a3 ?? [{ protocol: _t }], proposer: { publicKey: d3, metadata: this.client.metadata }, expiryTimestamp: w2, pairingTopic: c2 }, n2 && { sessionProperties: n2 }), { reject: y3, resolve: _2, done: R3 } = ls(l2, it);
      this.events.once(bs$1("session_connect"), async ({ error: E2, session: S4 }) => {
        if (E2) y3(E2);
        else if (S4) {
          S4.self.publicKey = d3;
          const M3 = V2(I({}, S4), { pairingTopic: m3.pairingTopic, requiredNamespaces: m3.requiredNamespaces, optionalNamespaces: m3.optionalNamespaces, transportType: F$1.relay });
          await this.client.session.set(S4.topic, M3), await this.setExpiry(S4.topic, S4.expiry), c2 && await this.client.core.pairing.updateMetadata({ topic: c2, metadata: S4.peer.metadata }), this.cleanupDuplicatePairings(M3), _2(M3);
        }
      });
      const x3 = await this.sendRequest({ topic: c2, method: "wc_sessionPropose", params: m3, throwOnFailedPublish: true });
      return await this.setProposal(x3, I({ id: x3 }, m3)), { uri: h3, approval: R3 };
    }, this.pair = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        return await this.client.core.pairing.pair(e);
      } catch (t) {
        throw this.client.logger.error("pair() failed"), t;
      }
    }, this.approve = async (e) => {
      var t, s2, i2;
      const r2 = this.client.core.eventClient.createEvent({ properties: { topic: (t = e == null ? void 0 : e.id) == null ? void 0 : t.toString(), trace: [Hr.session_approve_started] } });
      try {
        this.isInitialized(), await this.confirmOnlineStateOrThrow();
      } catch (N2) {
        throw r2.setError(Yr.no_internet_connection), N2;
      }
      try {
        await this.isValidProposalId(e == null ? void 0 : e.id);
      } catch (N2) {
        throw this.client.logger.error(`approve() -> proposal.get(${e == null ? void 0 : e.id}) failed`), r2.setError(Yr.proposal_not_found), N2;
      }
      try {
        await this.isValidApprove(e);
      } catch (N2) {
        throw this.client.logger.error("approve() -> isValidApprove() failed"), r2.setError(Yr.session_approve_namespace_validation_failure), N2;
      }
      const { id: n2, relayProtocol: a3, namespaces: c2, sessionProperties: h3, sessionConfig: p3 } = e, d3 = this.client.proposal.get(n2);
      this.client.core.eventClient.deleteEvent({ eventId: r2.eventId });
      const { pairingTopic: l2, proposer: w2, requiredNamespaces: m3, optionalNamespaces: y3 } = d3;
      let _2 = (s2 = this.client.core.eventClient) == null ? void 0 : s2.getEvent({ topic: l2 });
      _2 || (_2 = (i2 = this.client.core.eventClient) == null ? void 0 : i2.createEvent({ type: Hr.session_approve_started, properties: { topic: l2, trace: [Hr.session_approve_started, Hr.session_namespaces_validation_success] } }));
      const R3 = await this.client.core.crypto.generateKeyPair(), x3 = w2.publicKey, E2 = await this.client.core.crypto.generateSharedKey(R3, x3), S4 = I(I({ relay: { protocol: a3 ?? "irn" }, namespaces: c2, controller: { publicKey: R3, metadata: this.client.metadata }, expiry: ms$2(z2) }, h3 && { sessionProperties: h3 }), p3 && { sessionConfig: p3 }), M3 = F$1.relay;
      _2.addTrace(Hr.subscribing_session_topic);
      try {
        await this.client.core.relayer.subscribe(E2, { transportType: M3 });
      } catch (N2) {
        throw _2.setError(Yr.subscribe_session_topic_failure), N2;
      }
      _2.addTrace(Hr.subscribe_session_topic_success);
      const W = V2(I({}, S4), { topic: E2, requiredNamespaces: m3, optionalNamespaces: y3, pairingTopic: l2, acknowledged: false, self: S4.controller, peer: { publicKey: w2.publicKey, metadata: w2.metadata }, controller: R3, transportType: F$1.relay });
      await this.client.session.set(E2, W), _2.addTrace(Hr.store_session);
      try {
        _2.addTrace(Hr.publishing_session_settle), await this.sendRequest({ topic: E2, method: "wc_sessionSettle", params: S4, throwOnFailedPublish: true }).catch((N2) => {
          throw _2 == null ? void 0 : _2.setError(Yr.session_settle_publish_failure), N2;
        }), _2.addTrace(Hr.session_settle_publish_success), _2.addTrace(Hr.publishing_session_approve), await this.sendResult({ id: n2, topic: l2, result: { relay: { protocol: a3 ?? "irn" }, responderPublicKey: R3 }, throwOnFailedPublish: true }).catch((N2) => {
          throw _2 == null ? void 0 : _2.setError(Yr.session_approve_publish_failure), N2;
        }), _2.addTrace(Hr.session_approve_publish_success);
      } catch (N2) {
        throw this.client.logger.error(N2), this.client.session.delete(E2, er$1("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(E2), N2;
      }
      return this.client.core.eventClient.deleteEvent({ eventId: _2.eventId }), await this.client.core.pairing.updateMetadata({ topic: l2, metadata: w2.metadata }), await this.client.proposal.delete(n2, er$1("USER_DISCONNECTED")), await this.client.core.pairing.activate({ topic: l2 }), await this.setExpiry(E2, ms$2(z2)), { topic: E2, acknowledged: () => Promise.resolve(this.client.session.get(E2)) };
    }, this.reject = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidReject(e);
      } catch (r2) {
        throw this.client.logger.error("reject() -> isValidReject() failed"), r2;
      }
      const { id: t, reason: s2 } = e;
      let i2;
      try {
        i2 = this.client.proposal.get(t).pairingTopic;
      } catch (r2) {
        throw this.client.logger.error(`reject() -> proposal.get(${t}) failed`), r2;
      }
      i2 && (await this.sendError({ id: t, topic: i2, error: s2, rpcOpts: v$1.wc_sessionPropose.reject }), await this.client.proposal.delete(t, er$1("USER_DISCONNECTED")));
    }, this.update = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidUpdate(e);
      } catch (p3) {
        throw this.client.logger.error("update() -> isValidUpdate() failed"), p3;
      }
      const { topic: t, namespaces: s2 } = e, { done: i2, resolve: r2, reject: n2 } = ls(), a3 = payloadId(), c2 = getBigIntRpcId().toString(), h3 = this.client.session.get(t).namespaces;
      return this.events.once(bs$1("session_update", a3), ({ error: p3 }) => {
        p3 ? n2(p3) : r2();
      }), await this.client.session.update(t, { namespaces: s2 }), await this.sendRequest({ topic: t, method: "wc_sessionUpdate", params: { namespaces: s2 }, throwOnFailedPublish: true, clientRpcId: a3, relayRpcId: c2 }).catch((p3) => {
        this.client.logger.error(p3), this.client.session.update(t, { namespaces: h3 }), n2(p3);
      }), { acknowledged: i2 };
    }, this.extend = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidExtend(e);
      } catch (a3) {
        throw this.client.logger.error("extend() -> isValidExtend() failed"), a3;
      }
      const { topic: t } = e, s2 = payloadId(), { done: i2, resolve: r2, reject: n2 } = ls();
      return this.events.once(bs$1("session_extend", s2), ({ error: a3 }) => {
        a3 ? n2(a3) : r2();
      }), await this.setExpiry(t, ms$2(z2)), this.sendRequest({ topic: t, method: "wc_sessionExtend", params: {}, clientRpcId: s2, throwOnFailedPublish: true }).catch((a3) => {
        n2(a3);
      }), { acknowledged: i2 };
    }, this.request = async (e) => {
      this.isInitialized();
      try {
        await this.isValidRequest(e);
      } catch (w2) {
        throw this.client.logger.error("request() -> isValidRequest() failed"), w2;
      }
      const { chainId: t, request: s2, topic: i2, expiry: r2 = v$1.wc_sessionRequest.req.ttl } = e, n2 = this.client.session.get(i2);
      (n2 == null ? void 0 : n2.transportType) === F$1.relay && await this.confirmOnlineStateOrThrow();
      const a3 = payloadId(), c2 = getBigIntRpcId().toString(), { done: h3, resolve: p3, reject: d3 } = ls(r2, "Request expired. Please try again.");
      this.events.once(bs$1("session_request", a3), ({ error: w2, result: m3 }) => {
        w2 ? d3(w2) : p3(m3);
      });
      const l2 = this.getAppLinkIfEnabled(n2.peer.metadata, n2.transportType);
      return l2 ? (await this.sendRequest({ clientRpcId: a3, relayRpcId: c2, topic: i2, method: "wc_sessionRequest", params: { request: V2(I({}, s2), { expiryTimestamp: ms$2(r2) }), chainId: t }, expiry: r2, throwOnFailedPublish: true, appLink: l2 }).catch((w2) => d3(w2)), this.client.events.emit("session_request_sent", { topic: i2, request: s2, chainId: t, id: a3 }), await h3()) : await Promise.all([new Promise(async (w2) => {
        await this.sendRequest({ clientRpcId: a3, relayRpcId: c2, topic: i2, method: "wc_sessionRequest", params: { request: V2(I({}, s2), { expiryTimestamp: ms$2(r2) }), chainId: t }, expiry: r2, throwOnFailedPublish: true }).catch((m3) => d3(m3)), this.client.events.emit("session_request_sent", { topic: i2, request: s2, chainId: t, id: a3 }), w2();
      }), new Promise(async (w2) => {
        var m3;
        if (!((m3 = n2.sessionConfig) != null && m3.disableDeepLink)) {
          const y3 = await ws$2(this.client.core.storage, Le);
          ys$2({ id: a3, topic: i2, wcDeepLink: y3 });
        }
        w2();
      }), h3()]).then((w2) => w2[2]);
    }, this.respond = async (e) => {
      this.isInitialized(), await this.isValidRespond(e);
      const { topic: t, response: s2 } = e, { id: i2 } = s2, r2 = this.client.session.get(t);
      r2.transportType === F$1.relay && await this.confirmOnlineStateOrThrow();
      const n2 = this.getAppLinkIfEnabled(r2.peer.metadata, r2.transportType);
      isJsonRpcResult(s2) ? await this.sendResult({ id: i2, topic: t, result: s2.result, throwOnFailedPublish: true, appLink: n2 }) : isJsonRpcError(s2) && await this.sendError({ id: i2, topic: t, error: s2.error, appLink: n2 }), this.cleanupAfterResponse(e);
    }, this.ping = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidPing(e);
      } catch (s2) {
        throw this.client.logger.error("ping() -> isValidPing() failed"), s2;
      }
      const { topic: t } = e;
      if (this.client.session.keys.includes(t)) {
        const s2 = payloadId(), i2 = getBigIntRpcId().toString(), { done: r2, resolve: n2, reject: a3 } = ls();
        this.events.once(bs$1("session_ping", s2), ({ error: c2 }) => {
          c2 ? a3(c2) : n2();
        }), await Promise.all([this.sendRequest({ topic: t, method: "wc_sessionPing", params: {}, throwOnFailedPublish: true, clientRpcId: s2, relayRpcId: i2 }), r2()]);
      } else this.client.core.pairing.pairings.keys.includes(t) && await this.client.core.pairing.ping({ topic: t });
    }, this.emit = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(e);
      const { topic: t, event: s2, chainId: i2 } = e, r2 = getBigIntRpcId().toString();
      await this.sendRequest({ topic: t, method: "wc_sessionEvent", params: { event: s2, chainId: i2 }, throwOnFailedPublish: true, relayRpcId: r2 });
    }, this.disconnect = async (e) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(e);
      const { topic: t } = e;
      if (this.client.session.keys.includes(t)) await this.sendRequest({ topic: t, method: "wc_sessionDelete", params: er$1("USER_DISCONNECTED"), throwOnFailedPublish: true }), await this.deleteSession({ topic: t, emitEvent: false });
      else if (this.client.core.pairing.pairings.keys.includes(t)) await this.client.core.pairing.disconnect({ topic: t });
      else {
        const { message: s2 } = xe("MISMATCHED_TOPIC", `Session or pairing topic not found: ${t}`);
        throw new Error(s2);
      }
    }, this.find = (e) => (this.isInitialized(), this.client.session.getAll().filter((t) => fh(t, e))), this.getPendingSessionRequests = () => this.client.pendingRequest.getAll(), this.authenticate = async (e, t) => {
      var s2;
      this.isInitialized(), this.isValidAuthenticate(e);
      const i2 = t && this.client.core.linkModeSupportedApps.includes(t) && ((s2 = this.client.metadata.redirect) == null ? void 0 : s2.linkMode), r2 = i2 ? F$1.link_mode : F$1.relay;
      r2 === F$1.relay && await this.confirmOnlineStateOrThrow();
      const { chains: n2, statement: a3 = "", uri: c2, domain: h3, nonce: p3, type: d3, exp: l2, nbf: w2, methods: m3 = [], expiry: y3 } = e, _2 = [...e.resources || []], { topic: R3, uri: x3 } = await this.client.core.pairing.create({ methods: ["wc_sessionAuthenticate"], transportType: r2 });
      this.client.logger.info({ message: "Generated new pairing", pairing: { topic: R3, uri: x3 } });
      const E2 = await this.client.core.crypto.generateKeyPair(), S4 = Nu(E2);
      if (await Promise.all([this.client.auth.authKeys.set(ae2, { responseTopic: S4, publicKey: E2 }), this.client.auth.pairingTopics.set(S4, { topic: S4, pairingTopic: R3 })]), await this.client.core.relayer.subscribe(S4, { transportType: r2 }), this.client.logger.info(`sending request to new pairing topic: ${R3}`), m3.length > 0) {
        const { namespace: O3 } = mn$1(n2[0]);
        let T2 = mu(O3, "request", m3);
        Vr(_2) && (T2 = Au(T2, _2.pop())), _2.push(T2);
      }
      const M3 = y3 && y3 > v$1.wc_sessionAuthenticate.req.ttl ? y3 : v$1.wc_sessionAuthenticate.req.ttl, W = { authPayload: { type: d3 ?? "caip122", chains: n2, statement: a3, aud: c2, domain: h3, version: "1", nonce: p3, iat: (/* @__PURE__ */ new Date()).toISOString(), exp: l2, nbf: w2, resources: _2 }, requester: { publicKey: E2, metadata: this.client.metadata }, expiryTimestamp: ms$2(M3) }, N2 = { eip155: { chains: n2, methods: [.../* @__PURE__ */ new Set(["personal_sign", ...m3])], events: ["chainChanged", "accountsChanged"] } }, Ve = { requiredNamespaces: {}, optionalNamespaces: N2, relays: [{ protocol: "irn" }], pairingTopic: R3, proposer: { publicKey: E2, metadata: this.client.metadata }, expiryTimestamp: ms$2(v$1.wc_sessionPropose.req.ttl) }, { done: wt2, resolve: xe2, reject: Ee2 } = ls(M3, "Request expired"), ce2 = async ({ error: O3, session: T2 }) => {
        if (this.events.off(bs$1("session_request", G), Re2), O3) Ee2(O3);
        else if (T2) {
          T2.self.publicKey = E2, await this.client.session.set(T2.topic, T2), await this.setExpiry(T2.topic, T2.expiry), R3 && await this.client.core.pairing.updateMetadata({ topic: R3, metadata: T2.peer.metadata });
          const le2 = this.client.session.get(T2.topic);
          await this.deleteProposal(Z2), xe2({ session: le2 });
        }
      }, Re2 = async (O3) => {
        var T2, le2, Me;
        if (await this.deletePendingAuthRequest(G, { message: "fulfilled", code: 0 }), O3.error) {
          const te2 = er$1("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
          return O3.error.code === te2.code ? void 0 : (this.events.off(bs$1("session_connect"), ce2), Ee2(O3.error.message));
        }
        await this.deleteProposal(Z2), this.events.off(bs$1("session_connect"), ce2);
        const { cacaos: ke, responder: j2 } = O3.result, Ie2 = [], $e2 = [];
        for (const te2 of ke) {
          await lu({ cacao: te2, projectId: this.client.core.projectId }) || (this.client.logger.error(te2, "Signature verification failed"), Ee2(er$1("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
          const { p: fe2 } = te2, ve2 = Vr(fe2.resources), Ke = [cu(fe2.iss)], mt2 = Yi(fe2.iss);
          if (ve2) {
            const qe = bu(ve2), _t2 = yu(ve2);
            Ie2.push(...qe), Ke.push(..._t2);
          }
          for (const qe of Ke) $e2.push(`${qe}:${mt2}`);
        }
        const ee2 = await this.client.core.crypto.generateSharedKey(E2, j2.publicKey);
        let pe2;
        Ie2.length > 0 && (pe2 = { topic: ee2, acknowledged: true, self: { publicKey: E2, metadata: this.client.metadata }, peer: j2, controller: j2.publicKey, expiry: ms$2(z2), requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: R3, namespaces: nh([...new Set(Ie2)], [...new Set($e2)]), transportType: r2 }, await this.client.core.relayer.subscribe(ee2, { transportType: r2 }), await this.client.session.set(ee2, pe2), R3 && await this.client.core.pairing.updateMetadata({ topic: R3, metadata: j2.metadata }), pe2 = this.client.session.get(ee2)), (T2 = this.client.metadata.redirect) != null && T2.linkMode && (le2 = j2.metadata.redirect) != null && le2.linkMode && (Me = j2.metadata.redirect) != null && Me.universal && t && (this.client.core.addLinkModeSupportedApp(j2.metadata.redirect.universal), this.client.session.update(ee2, { transportType: F$1.link_mode })), xe2({ auths: ke, session: pe2 });
      }, G = payloadId(), Z2 = payloadId();
      this.events.once(bs$1("session_connect"), ce2), this.events.once(bs$1("session_request", G), Re2);
      let Se2;
      try {
        if (i2) {
          const O3 = formatJsonRpcRequest("wc_sessionAuthenticate", W, G);
          this.client.core.history.set(R3, O3);
          const T2 = await this.client.core.crypto.encode("", O3, { type: Sr$1, encoding: wu });
          Se2 = Yu(t, R3, T2);
        } else await Promise.all([this.sendRequest({ topic: R3, method: "wc_sessionAuthenticate", params: W, expiry: e.expiry, throwOnFailedPublish: true, clientRpcId: G }), this.sendRequest({ topic: R3, method: "wc_sessionPropose", params: Ve, expiry: v$1.wc_sessionPropose.req.ttl, throwOnFailedPublish: true, clientRpcId: Z2 })]);
      } catch (O3) {
        throw this.events.off(bs$1("session_connect"), ce2), this.events.off(bs$1("session_request", G), Re2), O3;
      }
      return await this.setProposal(Z2, I({ id: Z2 }, Ve)), await this.setAuthRequest(G, { request: V2(I({}, W), { verifyContext: {} }), pairingTopic: R3, transportType: r2 }), { uri: Se2 ?? x3, response: wt2 };
    }, this.approveSessionAuthenticate = async (e) => {
      const { id: t, auths: s2 } = e, i2 = this.client.core.eventClient.createEvent({ properties: { topic: t.toString(), trace: [Jr.authenticated_session_approve_started] } });
      try {
        this.isInitialized();
      } catch (y3) {
        throw i2.setError(Wr.no_internet_connection), y3;
      }
      const r2 = this.getPendingAuthRequest(t);
      if (!r2) throw i2.setError(Wr.authenticated_session_pending_request_not_found), new Error(`Could not find pending auth request with id ${t}`);
      const n2 = r2.transportType || F$1.relay;
      n2 === F$1.relay && await this.confirmOnlineStateOrThrow();
      const a3 = r2.requester.publicKey, c2 = await this.client.core.crypto.generateKeyPair(), h3 = Nu(a3), p3 = { type: pr$2, receiverPublicKey: a3, senderPublicKey: c2 }, d3 = [], l2 = [];
      for (const y3 of s2) {
        if (!await lu({ cacao: y3, projectId: this.client.core.projectId })) {
          i2.setError(Wr.invalid_cacao);
          const S4 = er$1("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
          throw await this.sendError({ id: t, topic: h3, error: S4, encodeOpts: p3 }), new Error(S4.message);
        }
        i2.addTrace(Jr.cacaos_verified);
        const { p: _2 } = y3, R3 = Vr(_2.resources), x3 = [cu(_2.iss)], E2 = Yi(_2.iss);
        if (R3) {
          const S4 = bu(R3), M3 = yu(R3);
          d3.push(...S4), x3.push(...M3);
        }
        for (const S4 of x3) l2.push(`${S4}:${E2}`);
      }
      const w2 = await this.client.core.crypto.generateSharedKey(c2, a3);
      i2.addTrace(Jr.create_authenticated_session_topic);
      let m3;
      if ((d3 == null ? void 0 : d3.length) > 0) {
        m3 = { topic: w2, acknowledged: true, self: { publicKey: c2, metadata: this.client.metadata }, peer: { publicKey: a3, metadata: r2.requester.metadata }, controller: a3, expiry: ms$2(z2), authentication: s2, requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: r2.pairingTopic, namespaces: nh([...new Set(d3)], [...new Set(l2)]), transportType: n2 }, i2.addTrace(Jr.subscribing_authenticated_session_topic);
        try {
          await this.client.core.relayer.subscribe(w2, { transportType: n2 });
        } catch (y3) {
          throw i2.setError(Wr.subscribe_authenticated_session_topic_failure), y3;
        }
        i2.addTrace(Jr.subscribe_authenticated_session_topic_success), await this.client.session.set(w2, m3), i2.addTrace(Jr.store_authenticated_session), await this.client.core.pairing.updateMetadata({ topic: r2.pairingTopic, metadata: r2.requester.metadata });
      }
      i2.addTrace(Jr.publishing_authenticated_session_approve);
      try {
        await this.sendResult({ topic: h3, id: t, result: { cacaos: s2, responder: { publicKey: c2, metadata: this.client.metadata } }, encodeOpts: p3, throwOnFailedPublish: true, appLink: this.getAppLinkIfEnabled(r2.requester.metadata, n2) });
      } catch (y3) {
        throw i2.setError(Wr.authenticated_session_approve_publish_failure), y3;
      }
      return await this.client.auth.requests.delete(t, { message: "fulfilled", code: 0 }), await this.client.core.pairing.activate({ topic: r2.pairingTopic }), this.client.core.eventClient.deleteEvent({ eventId: i2.eventId }), { session: m3 };
    }, this.rejectSessionAuthenticate = async (e) => {
      this.isInitialized();
      const { id: t, reason: s2 } = e, i2 = this.getPendingAuthRequest(t);
      if (!i2) throw new Error(`Could not find pending auth request with id ${t}`);
      i2.transportType === F$1.relay && await this.confirmOnlineStateOrThrow();
      const r2 = i2.requester.publicKey, n2 = await this.client.core.crypto.generateKeyPair(), a3 = Nu(r2), c2 = { type: pr$2, receiverPublicKey: r2, senderPublicKey: n2 };
      await this.sendError({ id: t, topic: a3, error: s2, encodeOpts: c2, rpcOpts: v$1.wc_sessionAuthenticate.reject, appLink: this.getAppLinkIfEnabled(i2.requester.metadata, i2.transportType) }), await this.client.auth.requests.delete(t, { message: "rejected", code: 0 }), await this.client.proposal.delete(t, er$1("USER_DISCONNECTED"));
    }, this.formatAuthMessage = (e) => {
      this.isInitialized();
      const { request: t, iss: s2 } = e;
      return Jf(t, s2);
    }, this.processRelayMessageCache = () => {
      setTimeout(async () => {
        if (this.relayMessageCache.length !== 0) for (; this.relayMessageCache.length > 0; ) try {
          const e = this.relayMessageCache.shift();
          e && await this.onRelayMessage(e);
        } catch (e) {
          this.client.logger.error(e);
        }
      }, 50);
    }, this.cleanupDuplicatePairings = async (e) => {
      if (e.pairingTopic) try {
        const t = this.client.core.pairing.pairings.get(e.pairingTopic), s2 = this.client.core.pairing.pairings.getAll().filter((i2) => {
          var r2, n2;
          return ((r2 = i2.peerMetadata) == null ? void 0 : r2.url) && ((n2 = i2.peerMetadata) == null ? void 0 : n2.url) === e.peer.metadata.url && i2.topic && i2.topic !== t.topic;
        });
        if (s2.length === 0) return;
        this.client.logger.info(`Cleaning up ${s2.length} duplicate pairing(s)`), await Promise.all(s2.map((i2) => this.client.core.pairing.disconnect({ topic: i2.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
      } catch (t) {
        this.client.logger.error(t);
      }
    }, this.deleteSession = async (e) => {
      var t;
      const { topic: s2, expirerHasDeleted: i2 = false, emitEvent: r2 = true, id: n2 = 0 } = e, { self: a3 } = this.client.session.get(s2);
      await this.client.core.relayer.unsubscribe(s2), await this.client.session.delete(s2, er$1("USER_DISCONNECTED")), this.addToRecentlyDeleted(s2, "session"), this.client.core.crypto.keychain.has(a3.publicKey) && await this.client.core.crypto.deleteKeyPair(a3.publicKey), this.client.core.crypto.keychain.has(s2) && await this.client.core.crypto.deleteSymKey(s2), i2 || this.client.core.expirer.del(s2), this.client.core.storage.removeItem(Le).catch((c2) => this.client.logger.warn(c2)), this.getPendingSessionRequests().forEach((c2) => {
        c2.topic === s2 && this.deletePendingSessionRequest(c2.id, er$1("USER_DISCONNECTED"));
      }), s2 === ((t = this.sessionRequestQueue.queue[0]) == null ? void 0 : t.topic) && (this.sessionRequestQueue.state = L$1.idle), r2 && this.client.events.emit("session_delete", { id: n2, topic: s2 });
    }, this.deleteProposal = async (e, t) => {
      if (t) try {
        const s2 = this.client.proposal.get(e), i2 = this.client.core.eventClient.getEvent({ topic: s2.pairingTopic });
        i2 == null ? void 0 : i2.setError(Yr.proposal_expired);
      } catch {
      }
      await Promise.all([this.client.proposal.delete(e, er$1("USER_DISCONNECTED")), t ? Promise.resolve() : this.client.core.expirer.del(e)]), this.addToRecentlyDeleted(e, "proposal");
    }, this.deletePendingSessionRequest = async (e, t, s2 = false) => {
      await Promise.all([this.client.pendingRequest.delete(e, t), s2 ? Promise.resolve() : this.client.core.expirer.del(e)]), this.addToRecentlyDeleted(e, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i2) => i2.id !== e), s2 && (this.sessionRequestQueue.state = L$1.idle, this.client.events.emit("session_request_expire", { id: e }));
    }, this.deletePendingAuthRequest = async (e, t, s2 = false) => {
      await Promise.all([this.client.auth.requests.delete(e, t), s2 ? Promise.resolve() : this.client.core.expirer.del(e)]);
    }, this.setExpiry = async (e, t) => {
      this.client.session.keys.includes(e) && (this.client.core.expirer.set(e, t), await this.client.session.update(e, { expiry: t }));
    }, this.setProposal = async (e, t) => {
      this.client.core.expirer.set(e, ms$2(v$1.wc_sessionPropose.req.ttl)), await this.client.proposal.set(e, t);
    }, this.setAuthRequest = async (e, t) => {
      const { request: s2, pairingTopic: i2, transportType: r2 = F$1.relay } = t;
      this.client.core.expirer.set(e, s2.expiryTimestamp), await this.client.auth.requests.set(e, { authPayload: s2.authPayload, requester: s2.requester, expiryTimestamp: s2.expiryTimestamp, id: e, pairingTopic: i2, verifyContext: s2.verifyContext, transportType: r2 });
    }, this.setPendingSessionRequest = async (e) => {
      const { id: t, topic: s2, params: i2, verifyContext: r2 } = e, n2 = i2.request.expiryTimestamp || ms$2(v$1.wc_sessionRequest.req.ttl);
      this.client.core.expirer.set(t, n2), await this.client.pendingRequest.set(t, { id: t, topic: s2, params: i2, verifyContext: r2 });
    }, this.sendRequest = async (e) => {
      const { topic: t, method: s2, params: i2, expiry: r2, relayRpcId: n2, clientRpcId: a3, throwOnFailedPublish: c2, appLink: h3 } = e, p3 = formatJsonRpcRequest(s2, i2, a3);
      let d3;
      const l2 = !!h3;
      try {
        const y3 = l2 ? wu : $i;
        d3 = await this.client.core.crypto.encode(t, p3, { encoding: y3 });
      } catch (y3) {
        throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${t} failed`), y3;
      }
      let w2;
      if (at.includes(s2)) {
        const y3 = Iu(JSON.stringify(p3)), _2 = Iu(d3);
        w2 = await this.client.core.verify.register({ id: _2, decryptedId: y3 });
      }
      const m3 = v$1[s2].req;
      if (m3.attestation = w2, r2 && (m3.ttl = r2), n2 && (m3.id = n2), this.client.core.history.set(t, p3), l2) {
        const y3 = Yu(h3, t, d3);
        await global.Linking.openURL(y3, this.client.name);
      } else {
        const y3 = v$1[s2].req;
        r2 && (y3.ttl = r2), n2 && (y3.id = n2), c2 ? (y3.internal = V2(I({}, y3.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(t, d3, y3)) : this.client.core.relayer.publish(t, d3, y3).catch((_2) => this.client.logger.error(_2));
      }
      return p3.id;
    }, this.sendResult = async (e) => {
      const { id: t, topic: s2, result: i2, throwOnFailedPublish: r2, encodeOpts: n2, appLink: a3 } = e, c2 = formatJsonRpcResult(t, i2);
      let h3;
      const p3 = a3 && typeof (global == null ? void 0 : global.Linking) < "u";
      try {
        const l2 = p3 ? wu : $i;
        h3 = await this.client.core.crypto.encode(s2, c2, V2(I({}, n2 || {}), { encoding: l2 }));
      } catch (l2) {
        throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s2} failed`), l2;
      }
      let d3;
      try {
        d3 = await this.client.core.history.get(s2, t);
      } catch (l2) {
        throw this.client.logger.error(`sendResult() -> history.get(${s2}, ${t}) failed`), l2;
      }
      if (p3) {
        const l2 = Yu(a3, s2, h3);
        await global.Linking.openURL(l2, this.client.name);
      } else {
        const l2 = v$1[d3.request.method].res;
        r2 ? (l2.internal = V2(I({}, l2.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(s2, h3, l2)) : this.client.core.relayer.publish(s2, h3, l2).catch((w2) => this.client.logger.error(w2));
      }
      await this.client.core.history.resolve(c2);
    }, this.sendError = async (e) => {
      const { id: t, topic: s2, error: i2, encodeOpts: r2, rpcOpts: n2, appLink: a3 } = e, c2 = formatJsonRpcError(t, i2);
      let h3;
      const p3 = a3 && typeof (global == null ? void 0 : global.Linking) < "u";
      try {
        const l2 = p3 ? wu : $i;
        h3 = await this.client.core.crypto.encode(s2, c2, V2(I({}, r2 || {}), { encoding: l2 }));
      } catch (l2) {
        throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s2} failed`), l2;
      }
      let d3;
      try {
        d3 = await this.client.core.history.get(s2, t);
      } catch (l2) {
        throw this.client.logger.error(`sendError() -> history.get(${s2}, ${t}) failed`), l2;
      }
      if (p3) {
        const l2 = Yu(a3, s2, h3);
        await global.Linking.openURL(l2, this.client.name);
      } else {
        const l2 = n2 || v$1[d3.request.method].res;
        this.client.core.relayer.publish(s2, h3, l2);
      }
      await this.client.core.history.resolve(c2);
    }, this.cleanup = async () => {
      const e = [], t = [];
      this.client.session.getAll().forEach((s2) => {
        let i2 = false;
        As$1(s2.expiry) && (i2 = true), this.client.core.crypto.keychain.has(s2.topic) || (i2 = true), i2 && e.push(s2.topic);
      }), this.client.proposal.getAll().forEach((s2) => {
        As$1(s2.expiryTimestamp) && t.push(s2.id);
      }), await Promise.all([...e.map((s2) => this.deleteSession({ topic: s2 })), ...t.map((s2) => this.deleteProposal(s2))]);
    }, this.onRelayEventRequest = async (e) => {
      this.requestQueue.queue.push(e), await this.processRequestsQueue();
    }, this.processRequestsQueue = async () => {
      if (this.requestQueue.state === L$1.active) {
        this.client.logger.info("Request queue already active, skipping...");
        return;
      }
      for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0; ) {
        this.requestQueue.state = L$1.active;
        const e = this.requestQueue.queue.shift();
        if (e) try {
          await this.processRequest(e);
        } catch (t) {
          this.client.logger.warn(t);
        }
      }
      this.requestQueue.state = L$1.idle;
    }, this.processRequest = async (e) => {
      const { topic: t, payload: s2, attestation: i2, transportType: r2, encryptedId: n2 } = e, a3 = s2.method;
      if (!this.shouldIgnorePairingRequest({ topic: t, requestMethod: a3 })) switch (a3) {
        case "wc_sessionPropose":
          return await this.onSessionProposeRequest({ topic: t, payload: s2, attestation: i2, encryptedId: n2 });
        case "wc_sessionSettle":
          return await this.onSessionSettleRequest(t, s2);
        case "wc_sessionUpdate":
          return await this.onSessionUpdateRequest(t, s2);
        case "wc_sessionExtend":
          return await this.onSessionExtendRequest(t, s2);
        case "wc_sessionPing":
          return await this.onSessionPingRequest(t, s2);
        case "wc_sessionDelete":
          return await this.onSessionDeleteRequest(t, s2);
        case "wc_sessionRequest":
          return await this.onSessionRequest({ topic: t, payload: s2, attestation: i2, encryptedId: n2, transportType: r2 });
        case "wc_sessionEvent":
          return await this.onSessionEventRequest(t, s2);
        case "wc_sessionAuthenticate":
          return await this.onSessionAuthenticateRequest({ topic: t, payload: s2, attestation: i2, encryptedId: n2, transportType: r2 });
        default:
          return this.client.logger.info(`Unsupported request method ${a3}`);
      }
    }, this.onRelayEventResponse = async (e) => {
      const { topic: t, payload: s2, transportType: i2 } = e, r2 = (await this.client.core.history.get(t, s2.id)).request.method;
      switch (r2) {
        case "wc_sessionPropose":
          return this.onSessionProposeResponse(t, s2, i2);
        case "wc_sessionSettle":
          return this.onSessionSettleResponse(t, s2);
        case "wc_sessionUpdate":
          return this.onSessionUpdateResponse(t, s2);
        case "wc_sessionExtend":
          return this.onSessionExtendResponse(t, s2);
        case "wc_sessionPing":
          return this.onSessionPingResponse(t, s2);
        case "wc_sessionRequest":
          return this.onSessionRequestResponse(t, s2);
        case "wc_sessionAuthenticate":
          return this.onSessionAuthenticateResponse(t, s2);
        default:
          return this.client.logger.info(`Unsupported response method ${r2}`);
      }
    }, this.onRelayEventUnknownPayload = (e) => {
      const { topic: t } = e, { message: s2 } = xe("MISSING_OR_INVALID", `Decoded payload on topic ${t} is not identifiable as a JSON-RPC request or a response.`);
      throw new Error(s2);
    }, this.shouldIgnorePairingRequest = (e) => {
      const { topic: t, requestMethod: s2 } = e, i2 = this.expectedPairingMethodMap.get(t);
      return !i2 || i2.includes(s2) ? false : !!(i2.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
    }, this.onSessionProposeRequest = async (e) => {
      const { topic: t, payload: s2, attestation: i2, encryptedId: r2 } = e, { params: n2, id: a3 } = s2;
      try {
        const c2 = this.client.core.eventClient.getEvent({ topic: t });
        this.isValidConnect(I({}, s2.params));
        const h3 = n2.expiryTimestamp || ms$2(v$1.wc_sessionPropose.req.ttl), p3 = I({ id: a3, pairingTopic: t, expiryTimestamp: h3 }, n2);
        await this.setProposal(a3, p3);
        const d3 = await this.getVerifyContext({ attestationId: i2, hash: Iu(JSON.stringify(s2)), encryptedId: r2, metadata: p3.proposer.metadata });
        this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), c2 == null ? void 0 : c2.setError($$1.proposal_listener_not_found)), c2 == null ? void 0 : c2.addTrace(z$1.emit_session_proposal), this.client.events.emit("session_proposal", { id: a3, params: p3, verifyContext: d3 });
      } catch (c2) {
        await this.sendError({ id: a3, topic: t, error: c2, rpcOpts: v$1.wc_sessionPropose.autoReject }), this.client.logger.error(c2);
      }
    }, this.onSessionProposeResponse = async (e, t, s2) => {
      const { id: i2 } = t;
      if (isJsonRpcResult(t)) {
        const { result: r2 } = t;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", result: r2 });
        const n2 = this.client.proposal.get(i2);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", proposal: n2 });
        const a3 = n2.proposer.publicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", selfPublicKey: a3 });
        const c2 = r2.responderPublicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", peerPublicKey: c2 });
        const h3 = await this.client.core.crypto.generateSharedKey(a3, c2);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", sessionTopic: h3 });
        const p3 = await this.client.core.relayer.subscribe(h3, { transportType: s2 });
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", subscriptionId: p3 }), await this.client.core.pairing.activate({ topic: e });
      } else if (isJsonRpcError(t)) {
        await this.client.proposal.delete(i2, er$1("USER_DISCONNECTED"));
        const r2 = bs$1("session_connect");
        if (this.events.listenerCount(r2) === 0) throw new Error(`emitting ${r2} without any listeners, 954`);
        this.events.emit(bs$1("session_connect"), { error: t.error });
      }
    }, this.onSessionSettleRequest = async (e, t) => {
      const { id: s2, params: i2 } = t;
      try {
        this.isValidSessionSettleRequest(i2);
        const { relay: r2, controller: n2, expiry: a3, namespaces: c2, sessionProperties: h3, sessionConfig: p3 } = t.params, d3 = V2(I(I({ topic: e, relay: r2, expiry: a3, namespaces: c2, acknowledged: true, pairingTopic: "", requiredNamespaces: {}, optionalNamespaces: {}, controller: n2.publicKey, self: { publicKey: "", metadata: this.client.metadata }, peer: { publicKey: n2.publicKey, metadata: n2.metadata } }, h3 && { sessionProperties: h3 }), p3 && { sessionConfig: p3 }), { transportType: F$1.relay }), l2 = bs$1("session_connect");
        if (this.events.listenerCount(l2) === 0) throw new Error(`emitting ${l2} without any listeners 997`);
        this.events.emit(bs$1("session_connect"), { session: d3 }), await this.sendResult({ id: t.id, topic: e, result: true, throwOnFailedPublish: true });
      } catch (r2) {
        await this.sendError({ id: s2, topic: e, error: r2 }), this.client.logger.error(r2);
      }
    }, this.onSessionSettleResponse = async (e, t) => {
      const { id: s2 } = t;
      isJsonRpcResult(t) ? (await this.client.session.update(e, { acknowledged: true }), this.events.emit(bs$1("session_approve", s2), {})) : isJsonRpcError(t) && (await this.client.session.delete(e, er$1("USER_DISCONNECTED")), this.events.emit(bs$1("session_approve", s2), { error: t.error }));
    }, this.onSessionUpdateRequest = async (e, t) => {
      const { params: s2, id: i2 } = t;
      try {
        const r2 = `${e}_session_update`, n2 = Nh.get(r2);
        if (n2 && this.isRequestOutOfSync(n2, i2)) {
          this.client.logger.info(`Discarding out of sync request - ${i2}`), this.sendError({ id: i2, topic: e, error: er$1("INVALID_UPDATE_REQUEST") });
          return;
        }
        this.isValidUpdate(I({ topic: e }, s2));
        try {
          Nh.set(r2, i2), await this.client.session.update(e, { namespaces: s2.namespaces }), await this.sendResult({ id: i2, topic: e, result: true, throwOnFailedPublish: true });
        } catch (a3) {
          throw Nh.delete(r2), a3;
        }
        this.client.events.emit("session_update", { id: i2, topic: e, params: s2 });
      } catch (r2) {
        await this.sendError({ id: i2, topic: e, error: r2 }), this.client.logger.error(r2);
      }
    }, this.isRequestOutOfSync = (e, t) => parseInt(t.toString().slice(0, -3)) <= parseInt(e.toString().slice(0, -3)), this.onSessionUpdateResponse = (e, t) => {
      const { id: s2 } = t, i2 = bs$1("session_update", s2);
      if (this.events.listenerCount(i2) === 0) throw new Error(`emitting ${i2} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit(bs$1("session_update", s2), {}) : isJsonRpcError(t) && this.events.emit(bs$1("session_update", s2), { error: t.error });
    }, this.onSessionExtendRequest = async (e, t) => {
      const { id: s2 } = t;
      try {
        this.isValidExtend({ topic: e }), await this.setExpiry(e, ms$2(z2)), await this.sendResult({ id: s2, topic: e, result: true, throwOnFailedPublish: true }), this.client.events.emit("session_extend", { id: s2, topic: e });
      } catch (i2) {
        await this.sendError({ id: s2, topic: e, error: i2 }), this.client.logger.error(i2);
      }
    }, this.onSessionExtendResponse = (e, t) => {
      const { id: s2 } = t, i2 = bs$1("session_extend", s2);
      if (this.events.listenerCount(i2) === 0) throw new Error(`emitting ${i2} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit(bs$1("session_extend", s2), {}) : isJsonRpcError(t) && this.events.emit(bs$1("session_extend", s2), { error: t.error });
    }, this.onSessionPingRequest = async (e, t) => {
      const { id: s2 } = t;
      try {
        this.isValidPing({ topic: e }), await this.sendResult({ id: s2, topic: e, result: true, throwOnFailedPublish: true }), this.client.events.emit("session_ping", { id: s2, topic: e });
      } catch (i2) {
        await this.sendError({ id: s2, topic: e, error: i2 }), this.client.logger.error(i2);
      }
    }, this.onSessionPingResponse = (e, t) => {
      const { id: s2 } = t, i2 = bs$1("session_ping", s2);
      if (this.events.listenerCount(i2) === 0) throw new Error(`emitting ${i2} without any listeners`);
      setTimeout(() => {
        isJsonRpcResult(t) ? this.events.emit(bs$1("session_ping", s2), {}) : isJsonRpcError(t) && this.events.emit(bs$1("session_ping", s2), { error: t.error });
      }, 500);
    }, this.onSessionDeleteRequest = async (e, t) => {
      const { id: s2 } = t;
      try {
        this.isValidDisconnect({ topic: e, reason: t.params }), Promise.all([new Promise((i2) => {
          this.client.core.relayer.once(w.publish, async () => {
            i2(await this.deleteSession({ topic: e, id: s2 }));
          });
        }), this.sendResult({ id: s2, topic: e, result: true, throwOnFailedPublish: true }), this.cleanupPendingSentRequestsForTopic({ topic: e, error: er$1("USER_DISCONNECTED") })]).catch((i2) => this.client.logger.error(i2));
      } catch (i2) {
        this.client.logger.error(i2);
      }
    }, this.onSessionRequest = async (e) => {
      var t, s2, i2;
      const { topic: r2, payload: n2, attestation: a3, encryptedId: c2, transportType: h3 } = e, { id: p3, params: d3 } = n2;
      try {
        await this.isValidRequest(I({ topic: r2 }, d3));
        const l2 = this.client.session.get(r2), w2 = await this.getVerifyContext({ attestationId: a3, hash: Iu(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", d3, p3))), encryptedId: c2, metadata: l2.peer.metadata, transportType: h3 }), m3 = { id: p3, topic: r2, params: d3, verifyContext: w2 };
        await this.setPendingSessionRequest(m3), h3 === F$1.link_mode && (t = l2.peer.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp((s2 = l2.peer.metadata.redirect) == null ? void 0 : s2.universal), (i2 = this.client.signConfig) != null && i2.disableRequestQueue ? this.emitSessionRequest(m3) : (this.addSessionRequestToSessionRequestQueue(m3), this.processSessionRequestQueue());
      } catch (l2) {
        await this.sendError({ id: p3, topic: r2, error: l2 }), this.client.logger.error(l2);
      }
    }, this.onSessionRequestResponse = (e, t) => {
      const { id: s2 } = t, i2 = bs$1("session_request", s2);
      if (this.events.listenerCount(i2) === 0) throw new Error(`emitting ${i2} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit(bs$1("session_request", s2), { result: t.result }) : isJsonRpcError(t) && this.events.emit(bs$1("session_request", s2), { error: t.error });
    }, this.onSessionEventRequest = async (e, t) => {
      const { id: s2, params: i2 } = t;
      try {
        const r2 = `${e}_session_event_${i2.event.name}`, n2 = Nh.get(r2);
        if (n2 && this.isRequestOutOfSync(n2, s2)) {
          this.client.logger.info(`Discarding out of sync request - ${s2}`);
          return;
        }
        this.isValidEmit(I({ topic: e }, i2)), this.client.events.emit("session_event", { id: s2, topic: e, params: i2 }), Nh.set(r2, s2);
      } catch (r2) {
        await this.sendError({ id: s2, topic: e, error: r2 }), this.client.logger.error(r2);
      }
    }, this.onSessionAuthenticateResponse = (e, t) => {
      const { id: s2 } = t;
      this.client.logger.trace({ type: "method", method: "onSessionAuthenticateResponse", topic: e, payload: t }), isJsonRpcResult(t) ? this.events.emit(bs$1("session_request", s2), { result: t.result }) : isJsonRpcError(t) && this.events.emit(bs$1("session_request", s2), { error: t.error });
    }, this.onSessionAuthenticateRequest = async (e) => {
      var t;
      const { topic: s2, payload: i2, attestation: r2, encryptedId: n2, transportType: a3 } = e;
      try {
        const { requester: c2, authPayload: h3, expiryTimestamp: p3 } = i2.params, d3 = await this.getVerifyContext({ attestationId: r2, hash: Iu(JSON.stringify(i2)), encryptedId: n2, metadata: c2.metadata, transportType: a3 }), l2 = { requester: c2, pairingTopic: s2, id: i2.id, authPayload: h3, verifyContext: d3, expiryTimestamp: p3 };
        await this.setAuthRequest(i2.id, { request: l2, pairingTopic: s2, transportType: a3 }), a3 === F$1.link_mode && (t = c2.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp(c2.metadata.redirect.universal), this.client.events.emit("session_authenticate", { topic: s2, params: i2.params, id: i2.id, verifyContext: d3 });
      } catch (c2) {
        this.client.logger.error(c2);
        const h3 = i2.params.requester.publicKey, p3 = await this.client.core.crypto.generateKeyPair(), d3 = this.getAppLinkIfEnabled(i2.params.requester.metadata, a3), l2 = { type: pr$2, receiverPublicKey: h3, senderPublicKey: p3 };
        await this.sendError({ id: i2.id, topic: s2, error: c2, encodeOpts: l2, rpcOpts: v$1.wc_sessionAuthenticate.autoReject, appLink: d3 });
      }
    }, this.addSessionRequestToSessionRequestQueue = (e) => {
      this.sessionRequestQueue.queue.push(e);
    }, this.cleanupAfterResponse = (e) => {
      this.deletePendingSessionRequest(e.response.id, { message: "fulfilled", code: 0 }), setTimeout(() => {
        this.sessionRequestQueue.state = L$1.idle, this.processSessionRequestQueue();
      }, cjs.toMiliseconds(this.requestQueueDelay));
    }, this.cleanupPendingSentRequestsForTopic = ({ topic: e, error: t }) => {
      const s2 = this.client.core.history.pending;
      s2.length > 0 && s2.filter((i2) => i2.topic === e && i2.request.method === "wc_sessionRequest").forEach((i2) => {
        const r2 = i2.request.id, n2 = bs$1("session_request", r2);
        if (this.events.listenerCount(n2) === 0) throw new Error(`emitting ${n2} without any listeners`);
        this.events.emit(bs$1("session_request", i2.request.id), { error: t });
      });
    }, this.processSessionRequestQueue = () => {
      if (this.sessionRequestQueue.state === L$1.active) {
        this.client.logger.info("session request queue is already active.");
        return;
      }
      const e = this.sessionRequestQueue.queue[0];
      if (!e) {
        this.client.logger.info("session request queue is empty.");
        return;
      }
      try {
        this.sessionRequestQueue.state = L$1.active, this.emitSessionRequest(e);
      } catch (t) {
        this.client.logger.error(t);
      }
    }, this.emitSessionRequest = (e) => {
      this.client.events.emit("session_request", e);
    }, this.onPairingCreated = (e) => {
      if (e.methods && this.expectedPairingMethodMap.set(e.topic, e.methods), e.active) return;
      const t = this.client.proposal.getAll().find((s2) => s2.pairingTopic === e.topic);
      t && this.onSessionProposeRequest({ topic: e.topic, payload: formatJsonRpcRequest("wc_sessionPropose", { requiredNamespaces: t.requiredNamespaces, optionalNamespaces: t.optionalNamespaces, relays: t.relays, proposer: t.proposer, sessionProperties: t.sessionProperties }, t.id) });
    }, this.isValidConnect = async (e) => {
      if (!dh(e)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(e)}`);
        throw new Error(a3);
      }
      const { pairingTopic: t, requiredNamespaces: s2, optionalNamespaces: i2, sessionProperties: r2, relays: n2 } = e;
      if (Pe(t) || await this.isValidPairingTopic(t), !ch(n2)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `connect() relays: ${n2}`);
        throw new Error(a3);
      }
      !Pe(s2) && Xr$1(s2) !== 0 && this.validateNamespaces(s2, "requiredNamespaces"), !Pe(i2) && Xr$1(i2) !== 0 && this.validateNamespaces(i2, "optionalNamespaces"), Pe(r2) || this.validateSessionProps(r2, "sessionProperties");
    }, this.validateNamespaces = (e, t) => {
      const s2 = hh(e, "connect()", t);
      if (s2) throw new Error(s2.message);
    }, this.isValidApprove = async (e) => {
      if (!dh(e)) throw new Error(xe("MISSING_OR_INVALID", `approve() params: ${e}`).message);
      const { id: t, namespaces: s2, relayProtocol: i2, sessionProperties: r2 } = e;
      this.checkRecentlyDeleted(t), await this.isValidProposalId(t);
      const n2 = this.client.proposal.get(t), a3 = _o(s2, "approve()");
      if (a3) throw new Error(a3.message);
      const c2 = Co(n2.requiredNamespaces, s2, "approve()");
      if (c2) throw new Error(c2.message);
      if (!Yt$1(i2, true)) {
        const { message: h3 } = xe("MISSING_OR_INVALID", `approve() relayProtocol: ${i2}`);
        throw new Error(h3);
      }
      Pe(r2) || this.validateSessionProps(r2, "sessionProperties");
    }, this.isValidReject = async (e) => {
      if (!dh(e)) {
        const { message: i2 } = xe("MISSING_OR_INVALID", `reject() params: ${e}`);
        throw new Error(i2);
      }
      const { id: t, reason: s2 } = e;
      if (this.checkRecentlyDeleted(t), await this.isValidProposalId(t), !ph(s2)) {
        const { message: i2 } = xe("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s2)}`);
        throw new Error(i2);
      }
    }, this.isValidSessionSettleRequest = (e) => {
      if (!dh(e)) {
        const { message: c2 } = xe("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${e}`);
        throw new Error(c2);
      }
      const { relay: t, controller: s2, namespaces: i2, expiry: r2 } = e;
      if (!Bo(t)) {
        const { message: c2 } = xe("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
        throw new Error(c2);
      }
      const n2 = uh(s2, "onSessionSettleRequest()");
      if (n2) throw new Error(n2.message);
      const a3 = _o(i2, "onSessionSettleRequest()");
      if (a3) throw new Error(a3.message);
      if (As$1(r2)) {
        const { message: c2 } = xe("EXPIRED", "onSessionSettleRequest()");
        throw new Error(c2);
      }
    }, this.isValidUpdate = async (e) => {
      if (!dh(e)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `update() params: ${e}`);
        throw new Error(a3);
      }
      const { topic: t, namespaces: s2 } = e;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
      const i2 = this.client.session.get(t), r2 = _o(s2, "update()");
      if (r2) throw new Error(r2.message);
      const n2 = Co(i2.requiredNamespaces, s2, "update()");
      if (n2) throw new Error(n2.message);
    }, this.isValidExtend = async (e) => {
      if (!dh(e)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `extend() params: ${e}`);
        throw new Error(s2);
      }
      const { topic: t } = e;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
    }, this.isValidRequest = async (e) => {
      if (!dh(e)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `request() params: ${e}`);
        throw new Error(a3);
      }
      const { topic: t, request: s2, chainId: i2, expiry: r2 } = e;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
      const { namespaces: n2 } = this.client.session.get(t);
      if (!Ah(n2, i2)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `request() chainId: ${i2}`);
        throw new Error(a3);
      }
      if (!vh(s2)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `request() ${JSON.stringify(s2)}`);
        throw new Error(a3);
      }
      if (!bh(n2, i2, s2.method)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `request() method: ${s2.method}`);
        throw new Error(a3);
      }
      if (r2 && !Mh(r2, me)) {
        const { message: a3 } = xe("MISSING_OR_INVALID", `request() expiry: ${r2}. Expiry must be a number (in seconds) between ${me.min} and ${me.max}`);
        throw new Error(a3);
      }
    }, this.isValidRespond = async (e) => {
      var t;
      if (!dh(e)) {
        const { message: r2 } = xe("MISSING_OR_INVALID", `respond() params: ${e}`);
        throw new Error(r2);
      }
      const { topic: s2, response: i2 } = e;
      try {
        await this.isValidSessionTopic(s2);
      } catch (r2) {
        throw (t = e == null ? void 0 : e.response) != null && t.id && this.cleanupAfterResponse(e), r2;
      }
      if (!gh(i2)) {
        const { message: r2 } = xe("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i2)}`);
        throw new Error(r2);
      }
    }, this.isValidPing = async (e) => {
      if (!dh(e)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `ping() params: ${e}`);
        throw new Error(s2);
      }
      const { topic: t } = e;
      await this.isValidSessionOrPairingTopic(t);
    }, this.isValidEmit = async (e) => {
      if (!dh(e)) {
        const { message: n2 } = xe("MISSING_OR_INVALID", `emit() params: ${e}`);
        throw new Error(n2);
      }
      const { topic: t, event: s2, chainId: i2 } = e;
      await this.isValidSessionTopic(t);
      const { namespaces: r2 } = this.client.session.get(t);
      if (!Ah(r2, i2)) {
        const { message: n2 } = xe("MISSING_OR_INVALID", `emit() chainId: ${i2}`);
        throw new Error(n2);
      }
      if (!mh(s2)) {
        const { message: n2 } = xe("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(n2);
      }
      if (!yh(r2, i2, s2.name)) {
        const { message: n2 } = xe("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(n2);
      }
    }, this.isValidDisconnect = async (e) => {
      if (!dh(e)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `disconnect() params: ${e}`);
        throw new Error(s2);
      }
      const { topic: t } = e;
      await this.isValidSessionOrPairingTopic(t);
    }, this.isValidAuthenticate = (e) => {
      const { chains: t, uri: s2, domain: i2, nonce: r2 } = e;
      if (!Array.isArray(t) || t.length === 0) throw new Error("chains is required and must be a non-empty array");
      if (!Yt$1(s2, false)) throw new Error("uri is required parameter");
      if (!Yt$1(i2, false)) throw new Error("domain is required parameter");
      if (!Yt$1(r2, false)) throw new Error("nonce is required parameter");
      if ([...new Set(t.map((a3) => mn$1(a3).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
      const { namespace: n2 } = mn$1(t[0]);
      if (n2 !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
    }, this.getVerifyContext = async (e) => {
      const { attestationId: t, hash: s2, encryptedId: i2, metadata: r2, transportType: n2 } = e, a3 = { verified: { verifyUrl: r2.verifyUrl || Q$1, validation: "UNKNOWN", origin: r2.url || "" } };
      try {
        if (n2 === F$1.link_mode) {
          const h3 = this.getAppLinkIfEnabled(r2, n2);
          return a3.verified.validation = h3 && new URL(h3).origin === new URL(r2.url).origin ? "VALID" : "INVALID", a3;
        }
        const c2 = await this.client.core.verify.resolve({ attestationId: t, hash: s2, encryptedId: i2, verifyUrl: r2.verifyUrl });
        c2 && (a3.verified.origin = c2.origin, a3.verified.isScam = c2.isScam, a3.verified.validation = c2.origin === new URL(r2.url).origin ? "VALID" : "INVALID");
      } catch (c2) {
        this.client.logger.warn(c2);
      }
      return this.client.logger.debug(`Verify context: ${JSON.stringify(a3)}`), a3;
    }, this.validateSessionProps = (e, t) => {
      Object.values(e).forEach((s2) => {
        if (!Yt$1(s2, false)) {
          const { message: i2 } = xe("MISSING_OR_INVALID", `${t} must be in Record<string, string> format. Received: ${JSON.stringify(s2)}`);
          throw new Error(i2);
        }
      });
    }, this.getPendingAuthRequest = (e) => {
      const t = this.client.auth.requests.get(e);
      return typeof t == "object" ? t : void 0;
    }, this.addToRecentlyDeleted = (e, t) => {
      if (this.recentlyDeletedMap.set(e, t), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
        let s2 = 0;
        const i2 = this.recentlyDeletedLimit / 2;
        for (const r2 of this.recentlyDeletedMap.keys()) {
          if (s2++ >= i2) break;
          this.recentlyDeletedMap.delete(r2);
        }
      }
    }, this.checkRecentlyDeleted = (e) => {
      const t = this.recentlyDeletedMap.get(e);
      if (t) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `Record was recently deleted - ${t}: ${e}`);
        throw new Error(s2);
      }
    }, this.isLinkModeEnabled = (e, t) => {
      var s2, i2, r2, n2, a3, c2, h3, p3, d3;
      return !e || t !== F$1.link_mode ? false : ((i2 = (s2 = this.client.metadata) == null ? void 0 : s2.redirect) == null ? void 0 : i2.linkMode) === true && ((n2 = (r2 = this.client.metadata) == null ? void 0 : r2.redirect) == null ? void 0 : n2.universal) !== void 0 && ((c2 = (a3 = this.client.metadata) == null ? void 0 : a3.redirect) == null ? void 0 : c2.universal) !== "" && ((h3 = e == null ? void 0 : e.redirect) == null ? void 0 : h3.universal) !== void 0 && ((p3 = e == null ? void 0 : e.redirect) == null ? void 0 : p3.universal) !== "" && ((d3 = e == null ? void 0 : e.redirect) == null ? void 0 : d3.linkMode) === true && this.client.core.linkModeSupportedApps.includes(e.redirect.universal) && typeof (global == null ? void 0 : global.Linking) < "u";
    }, this.getAppLinkIfEnabled = (e, t) => {
      var s2;
      return this.isLinkModeEnabled(e, t) ? (s2 = e == null ? void 0 : e.redirect) == null ? void 0 : s2.universal : void 0;
    }, this.handleLinkModeMessage = ({ url: e }) => {
      if (!e || !e.includes("wc_ev") || !e.includes("topic")) return;
      const t = xs$1(e, "topic") || "", s2 = decodeURIComponent(xs$1(e, "wc_ev") || ""), i2 = this.client.session.keys.includes(t);
      i2 && this.client.session.update(t, { transportType: F$1.link_mode }), this.client.core.dispatchEnvelope({ topic: t, message: s2, sessionExists: i2 });
    }, this.registerLinkModeListeners = async () => {
      var e;
      if (typeof process < "u" && define_process_env_default.IS_VITEST || rr$1() && (e = this.client.metadata.redirect) != null && e.linkMode) {
        const t = global == null ? void 0 : global.Linking;
        if (typeof t < "u") {
          t.addEventListener("url", this.handleLinkModeMessage, this.client.name);
          const s2 = await t.getInitialURL();
          s2 && setTimeout(() => {
            this.handleLinkModeMessage({ url: s2 });
          }, 50);
        }
      }
    };
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: o2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(o2);
    }
  }
  async confirmOnlineStateOrThrow() {
    await this.client.core.relayer.confirmOnlineStateOrThrow();
  }
  registerRelayerEvents() {
    this.client.core.relayer.on(w.message, (o2) => {
      !this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(o2) : this.onRelayMessage(o2);
    });
  }
  async onRelayMessage(o2) {
    const { topic: e, message: t, attestation: s2, transportType: i2 } = o2, { publicKey: r2 } = this.client.auth.authKeys.keys.includes(ae2) ? this.client.auth.authKeys.get(ae2) : { publicKey: void 0 }, n2 = await this.client.core.crypto.decode(e, t, { receiverPublicKey: r2, encoding: i2 === F$1.link_mode ? wu : $i });
    try {
      isJsonRpcRequest(n2) ? (this.client.core.history.set(e, n2), this.onRelayEventRequest({ topic: e, payload: n2, attestation: s2, transportType: i2, encryptedId: Iu(t) })) : isJsonRpcResponse(n2) ? (await this.client.core.history.resolve(n2), await this.onRelayEventResponse({ topic: e, payload: n2, transportType: i2 }), this.client.core.history.delete(e, n2.id)) : this.onRelayEventUnknownPayload({ topic: e, payload: n2, transportType: i2 });
    } catch (a3) {
      this.client.logger.error(a3);
    }
  }
  registerExpirerEvents() {
    this.client.core.expirer.on(R$1.expired, async (o2) => {
      const { topic: e, id: t } = gs$1(o2.target);
      if (t && this.client.pendingRequest.keys.includes(t)) return await this.deletePendingSessionRequest(t, xe("EXPIRED"), true);
      if (t && this.client.auth.requests.keys.includes(t)) return await this.deletePendingAuthRequest(t, xe("EXPIRED"), true);
      e ? this.client.session.keys.includes(e) && (await this.deleteSession({ topic: e, expirerHasDeleted: true }), this.client.events.emit("session_expire", { topic: e })) : t && (await this.deleteProposal(t, true), this.client.events.emit("proposal_expire", { id: t }));
    });
  }
  registerPairingEvents() {
    this.client.core.pairing.events.on(Z.create, (o2) => this.onPairingCreated(o2)), this.client.core.pairing.events.on(Z.delete, (o2) => {
      this.addToRecentlyDeleted(o2.topic, "pairing");
    });
  }
  isValidPairingTopic(o2) {
    if (!Yt$1(o2, false)) {
      const { message: e } = xe("MISSING_OR_INVALID", `pairing topic should be a string: ${o2}`);
      throw new Error(e);
    }
    if (!this.client.core.pairing.pairings.keys.includes(o2)) {
      const { message: e } = xe("NO_MATCHING_KEY", `pairing topic doesn't exist: ${o2}`);
      throw new Error(e);
    }
    if (As$1(this.client.core.pairing.pairings.get(o2).expiry)) {
      const { message: e } = xe("EXPIRED", `pairing topic: ${o2}`);
      throw new Error(e);
    }
  }
  async isValidSessionTopic(o2) {
    if (!Yt$1(o2, false)) {
      const { message: e } = xe("MISSING_OR_INVALID", `session topic should be a string: ${o2}`);
      throw new Error(e);
    }
    if (this.checkRecentlyDeleted(o2), !this.client.session.keys.includes(o2)) {
      const { message: e } = xe("NO_MATCHING_KEY", `session topic doesn't exist: ${o2}`);
      throw new Error(e);
    }
    if (As$1(this.client.session.get(o2).expiry)) {
      await this.deleteSession({ topic: o2 });
      const { message: e } = xe("EXPIRED", `session topic: ${o2}`);
      throw new Error(e);
    }
    if (!this.client.core.crypto.keychain.has(o2)) {
      const { message: e } = xe("MISSING_OR_INVALID", `session topic does not exist in keychain: ${o2}`);
      throw await this.deleteSession({ topic: o2 }), new Error(e);
    }
  }
  async isValidSessionOrPairingTopic(o2) {
    if (this.checkRecentlyDeleted(o2), this.client.session.keys.includes(o2)) await this.isValidSessionTopic(o2);
    else if (this.client.core.pairing.pairings.keys.includes(o2)) this.isValidPairingTopic(o2);
    else if (Yt$1(o2, false)) {
      const { message: e } = xe("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${o2}`);
      throw new Error(e);
    } else {
      const { message: e } = xe("MISSING_OR_INVALID", `session or pairing topic should be a string: ${o2}`);
      throw new Error(e);
    }
  }
  async isValidProposalId(o2) {
    if (!lh(o2)) {
      const { message: e } = xe("MISSING_OR_INVALID", `proposal id should be a number: ${o2}`);
      throw new Error(e);
    }
    if (!this.client.proposal.keys.includes(o2)) {
      const { message: e } = xe("NO_MATCHING_KEY", `proposal id doesn't exist: ${o2}`);
      throw new Error(e);
    }
    if (As$1(this.client.proposal.get(o2).expiryTimestamp)) {
      await this.deleteProposal(o2);
      const { message: e } = xe("EXPIRED", `proposal id: ${o2}`);
      throw new Error(e);
    }
  }
}
class Rs extends ri {
  constructor(o2, e) {
    super(o2, e, st, ye), this.core = o2, this.logger = e;
  }
}
class yt extends ri {
  constructor(o2, e) {
    super(o2, e, rt, ye), this.core = o2, this.logger = e;
  }
}
class Ss extends ri {
  constructor(o2, e) {
    super(o2, e, ot, ye, (t) => t.id), this.core = o2, this.logger = e;
  }
}
class Is2 extends ri {
  constructor(o2, e) {
    super(o2, e, pt, oe, () => ae2), this.core = o2, this.logger = e;
  }
}
class fs extends ri {
  constructor(o2, e) {
    super(o2, e, ht, oe), this.core = o2, this.logger = e;
  }
}
class vs2 extends ri {
  constructor(o2, e) {
    super(o2, e, dt, oe, (t) => t.id), this.core = o2, this.logger = e;
  }
}
class qs {
  constructor(o2, e) {
    this.core = o2, this.logger = e, this.authKeys = new Is2(this.core, this.logger), this.pairingTopics = new fs(this.core, this.logger), this.requests = new vs2(this.core, this.logger);
  }
  async init() {
    await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
  }
}
let _e$1 = class _e extends S$1 {
  constructor(o2) {
    super(o2), this.protocol = be, this.version = Ce, this.name = we.name, this.events = new eventsExports.EventEmitter(), this.on = (t, s2) => this.events.on(t, s2), this.once = (t, s2) => this.events.once(t, s2), this.off = (t, s2) => this.events.off(t, s2), this.removeListener = (t, s2) => this.events.removeListener(t, s2), this.removeAllListeners = (t) => this.events.removeAllListeners(t), this.connect = async (t) => {
      try {
        return await this.engine.connect(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.pair = async (t) => {
      try {
        return await this.engine.pair(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.approve = async (t) => {
      try {
        return await this.engine.approve(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.reject = async (t) => {
      try {
        return await this.engine.reject(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.update = async (t) => {
      try {
        return await this.engine.update(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.extend = async (t) => {
      try {
        return await this.engine.extend(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.request = async (t) => {
      try {
        return await this.engine.request(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.respond = async (t) => {
      try {
        return await this.engine.respond(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.ping = async (t) => {
      try {
        return await this.engine.ping(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.emit = async (t) => {
      try {
        return await this.engine.emit(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.disconnect = async (t) => {
      try {
        return await this.engine.disconnect(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.find = (t) => {
      try {
        return this.engine.find(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.getPendingSessionRequests = () => {
      try {
        return this.engine.getPendingSessionRequests();
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.authenticate = async (t, s2) => {
      try {
        return await this.engine.authenticate(t, s2);
      } catch (i2) {
        throw this.logger.error(i2.message), i2;
      }
    }, this.formatAuthMessage = (t) => {
      try {
        return this.engine.formatAuthMessage(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.approveSessionAuthenticate = async (t) => {
      try {
        return await this.engine.approveSessionAuthenticate(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.rejectSessionAuthenticate = async (t) => {
      try {
        return await this.engine.rejectSessionAuthenticate(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.name = (o2 == null ? void 0 : o2.name) || we.name, this.metadata = (o2 == null ? void 0 : o2.metadata) || es(), this.signConfig = o2 == null ? void 0 : o2.signConfig;
    const e = typeof (o2 == null ? void 0 : o2.logger) < "u" && typeof (o2 == null ? void 0 : o2.logger) != "string" ? o2.logger : Wg(k({ level: (o2 == null ? void 0 : o2.logger) || we.logger }));
    this.core = (o2 == null ? void 0 : o2.core) || new Pn(o2), this.logger = E$1(e, this.name), this.session = new yt(this.core, this.logger), this.proposal = new Rs(this.core, this.logger), this.pendingRequest = new Ss(this.core, this.logger), this.engine = new Es2(this), this.auth = new qs(this.core, this.logger);
  }
  static async init(o2) {
    const e = new _e(o2);
    return await e.initialize(), e;
  }
  get context() {
    return y$3(this.logger);
  }
  get pairing() {
    return this.core.pairing.pairings;
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success"), this.engine.processRelayMessageCache();
    } catch (o2) {
      throw this.logger.info("SignClient Initialization Failure"), this.logger.error(o2.message), o2;
    }
  }
};
const ya = "error", Kg = "wss://relay.walletconnect.com", Jg = "wc", Yg = "universal_provider", Sa = `${Jg}@2:${Yg}:`, Zg = "https://rpc.walletconnect.com/v1/", Kn = "generic", Tt = { DEFAULT_CHAIN_CHANGED: "default_chain_changed" };
var _e2 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ui = { exports: {} };
/**
* @license
* Lodash <https://lodash.com/>
* Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
* Released under MIT license <https://lodash.com/license>
* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
*/
(function(P2, s2) {
  (function() {
    var i2, p3 = "4.17.21", w2 = 200, x3 = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", O3 = "Expected a function", k2 = "Invalid `variable` option passed into `_.template`", tn2 = "__lodash_hash_undefined__", Jn2 = 500, xn = "__lodash_placeholder__", Ht2 = 1, Mt2 = 2, En2 = 4, yn2 = 1, me2 = 2, vt2 = 1, ln2 = 2, Gi2 = 4, Dt2 = 8, Sn2 = 16, Nt2 = 32, On2 = 64, Bt2 = 128, Yn2 = 256, gr2 = 512, Wa2 = 30, Ma2 = "...", Ba2 = 800, Ga2 = 16, zi2 = 1, za2 = 2, Ka2 = 3, pn2 = 1 / 0, nn2 = 9007199254740991, Ja2 = 17976931348623157e292, we2 = 0 / 0, $t2 = 4294967295, Ya2 = $t2 - 1, Za2 = $t2 >>> 1, Xa2 = [["ary", Bt2], ["bind", vt2], ["bindKey", ln2], ["curry", Dt2], ["curryRight", Sn2], ["flip", gr2], ["partial", Nt2], ["partialRight", On2], ["rearg", Yn2]], Rn2 = "[object Arguments]", Pe2 = "[object Array]", Qa2 = "[object AsyncFunction]", Zn2 = "[object Boolean]", Xn2 = "[object Date]", Va2 = "[object DOMException]", Ce2 = "[object Error]", Ae2 = "[object Function]", Ki2 = "[object GeneratorFunction]", Et2 = "[object Map]", Qn2 = "[object Number]", ka2 = "[object Null]", Gt2 = "[object Object]", Ji2 = "[object Promise]", ja2 = "[object Proxy]", Vn2 = "[object RegExp]", yt2 = "[object Set]", kn2 = "[object String]", Ie2 = "[object Symbol]", to2 = "[object Undefined]", jn2 = "[object WeakMap]", no2 = "[object WeakSet]", te2 = "[object ArrayBuffer]", bn2 = "[object DataView]", vr3 = "[object Float32Array]", _r2 = "[object Float64Array]", mr2 = "[object Int8Array]", wr2 = "[object Int16Array]", Pr2 = "[object Int32Array]", Cr2 = "[object Uint8Array]", Ar2 = "[object Uint8ClampedArray]", Ir2 = "[object Uint16Array]", xr2 = "[object Uint32Array]", eo = /\b__p \+= '';/g, ro2 = /\b(__p \+=) '' \+/g, io2 = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Yi2 = /&(?:amp|lt|gt|quot|#39);/g, Zi2 = /[&<>"']/g, so2 = RegExp(Yi2.source), uo2 = RegExp(Zi2.source), ao2 = /<%-([\s\S]+?)%>/g, oo2 = /<%([\s\S]+?)%>/g, Xi2 = /<%=([\s\S]+?)%>/g, fo2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, co2 = /^\w*$/, ho2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Er2 = /[\\^$.*+?()[\]{}|]/g, lo = RegExp(Er2.source), yr2 = /^\s+/, po = /\s/, go2 = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, vo2 = /\{\n\/\* \[wrapped with (.+)\] \*/, _o2 = /,? & /, mo2 = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, wo2 = /[()=,{}\[\]\/\s]/, Po2 = /\\(\\)?/g, Co2 = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Qi2 = /\w*$/, Ao2 = /^[-+]0x[0-9a-f]+$/i, Io2 = /^0b[01]+$/i, xo2 = /^\[object .+?Constructor\]$/, Eo2 = /^0o[0-7]+$/i, yo2 = /^(?:0|[1-9]\d*)$/, So2 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, xe2 = /($^)/, Oo2 = /['\n\r\u2028\u2029\\]/g, Ee2 = "\\ud800-\\udfff", Ro2 = "\\u0300-\\u036f", bo2 = "\\ufe20-\\ufe2f", To2 = "\\u20d0-\\u20ff", Vi2 = Ro2 + bo2 + To2, ki2 = "\\u2700-\\u27bf", ji2 = "a-z\\xdf-\\xf6\\xf8-\\xff", Lo = "\\xac\\xb1\\xd7\\xf7", Ho = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Do2 = "\\u2000-\\u206f", No2 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ts2 = "A-Z\\xc0-\\xd6\\xd8-\\xde", ns = "\\ufe0e\\ufe0f", es2 = Lo + Ho + Do2 + No2, Sr2 = "['’]", $o = "[" + Ee2 + "]", rs = "[" + es2 + "]", ye2 = "[" + Vi2 + "]", is2 = "\\d+", qo = "[" + ki2 + "]", ss2 = "[" + ji2 + "]", us = "[^" + Ee2 + es2 + is2 + ki2 + ji2 + ts2 + "]", Or2 = "\\ud83c[\\udffb-\\udfff]", Uo = "(?:" + ye2 + "|" + Or2 + ")", as2 = "[^" + Ee2 + "]", Rr2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", br2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", Tn2 = "[" + ts2 + "]", os = "\\u200d", fs2 = "(?:" + ss2 + "|" + us + ")", Fo2 = "(?:" + Tn2 + "|" + us + ")", cs = "(?:" + Sr2 + "(?:d|ll|m|re|s|t|ve))?", hs = "(?:" + Sr2 + "(?:D|LL|M|RE|S|T|VE))?", ls2 = Uo + "?", ps2 = "[" + ns + "]?", Wo2 = "(?:" + os + "(?:" + [as2, Rr2, br2].join("|") + ")" + ps2 + ls2 + ")*", Mo2 = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Bo2 = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ds2 = ps2 + ls2 + Wo2, Go = "(?:" + [qo, Rr2, br2].join("|") + ")" + ds2, zo = "(?:" + [as2 + ye2 + "?", ye2, Rr2, br2, $o].join("|") + ")", Ko = RegExp(Sr2, "g"), Jo2 = RegExp(ye2, "g"), Tr2 = RegExp(Or2 + "(?=" + Or2 + ")|" + zo + ds2, "g"), Yo = RegExp([Tn2 + "?" + ss2 + "+" + cs + "(?=" + [rs, Tn2, "$"].join("|") + ")", Fo2 + "+" + hs + "(?=" + [rs, Tn2 + fs2, "$"].join("|") + ")", Tn2 + "?" + fs2 + "+" + cs, Tn2 + "+" + hs, Bo2, Mo2, is2, Go].join("|"), "g"), Zo = RegExp("[" + os + Ee2 + Vi2 + ns + "]"), Xo2 = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Qo = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Vo2 = -1, G = {};
    G[vr3] = G[_r2] = G[mr2] = G[wr2] = G[Pr2] = G[Cr2] = G[Ar2] = G[Ir2] = G[xr2] = true, G[Rn2] = G[Pe2] = G[te2] = G[Zn2] = G[bn2] = G[Xn2] = G[Ce2] = G[Ae2] = G[Et2] = G[Qn2] = G[Gt2] = G[Vn2] = G[yt2] = G[kn2] = G[jn2] = false;
    var B2 = {};
    B2[Rn2] = B2[Pe2] = B2[te2] = B2[bn2] = B2[Zn2] = B2[Xn2] = B2[vr3] = B2[_r2] = B2[mr2] = B2[wr2] = B2[Pr2] = B2[Et2] = B2[Qn2] = B2[Gt2] = B2[Vn2] = B2[yt2] = B2[kn2] = B2[Ie2] = B2[Cr2] = B2[Ar2] = B2[Ir2] = B2[xr2] = true, B2[Ce2] = B2[Ae2] = B2[jn2] = false;
    var ko = { À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A", à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", Ç: "C", ç: "c", Ð: "D", ð: "d", È: "E", É: "E", Ê: "E", Ë: "E", è: "e", é: "e", ê: "e", ë: "e", Ì: "I", Í: "I", Î: "I", Ï: "I", ì: "i", í: "i", î: "i", ï: "i", Ñ: "N", ñ: "n", Ò: "O", Ó: "O", Ô: "O", Õ: "O", Ö: "O", Ø: "O", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o", Ù: "U", Ú: "U", Û: "U", Ü: "U", ù: "u", ú: "u", û: "u", ü: "u", Ý: "Y", ý: "y", ÿ: "y", Æ: "Ae", æ: "ae", Þ: "Th", þ: "th", ß: "ss", Ā: "A", Ă: "A", Ą: "A", ā: "a", ă: "a", ą: "a", Ć: "C", Ĉ: "C", Ċ: "C", Č: "C", ć: "c", ĉ: "c", ċ: "c", č: "c", Ď: "D", Đ: "D", ď: "d", đ: "d", Ē: "E", Ĕ: "E", Ė: "E", Ę: "E", Ě: "E", ē: "e", ĕ: "e", ė: "e", ę: "e", ě: "e", Ĝ: "G", Ğ: "G", Ġ: "G", Ģ: "G", ĝ: "g", ğ: "g", ġ: "g", ģ: "g", Ĥ: "H", Ħ: "H", ĥ: "h", ħ: "h", Ĩ: "I", Ī: "I", Ĭ: "I", Į: "I", İ: "I", ĩ: "i", ī: "i", ĭ: "i", į: "i", ı: "i", Ĵ: "J", ĵ: "j", Ķ: "K", ķ: "k", ĸ: "k", Ĺ: "L", Ļ: "L", Ľ: "L", Ŀ: "L", Ł: "L", ĺ: "l", ļ: "l", ľ: "l", ŀ: "l", ł: "l", Ń: "N", Ņ: "N", Ň: "N", Ŋ: "N", ń: "n", ņ: "n", ň: "n", ŋ: "n", Ō: "O", Ŏ: "O", Ő: "O", ō: "o", ŏ: "o", ő: "o", Ŕ: "R", Ŗ: "R", Ř: "R", ŕ: "r", ŗ: "r", ř: "r", Ś: "S", Ŝ: "S", Ş: "S", Š: "S", ś: "s", ŝ: "s", ş: "s", š: "s", Ţ: "T", Ť: "T", Ŧ: "T", ţ: "t", ť: "t", ŧ: "t", Ũ: "U", Ū: "U", Ŭ: "U", Ů: "U", Ű: "U", Ų: "U", ũ: "u", ū: "u", ŭ: "u", ů: "u", ű: "u", ų: "u", Ŵ: "W", ŵ: "w", Ŷ: "Y", ŷ: "y", Ÿ: "Y", Ź: "Z", Ż: "Z", Ž: "Z", ź: "z", ż: "z", ž: "z", Ĳ: "IJ", ĳ: "ij", Œ: "Oe", œ: "oe", ŉ: "'n", ſ: "s" }, jo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, tf2 = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, nf2 = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, ef2 = parseFloat, rf = parseInt, gs2 = typeof _e2 == "object" && _e2 && _e2.Object === Object && _e2, sf2 = typeof self == "object" && self && self.Object === Object && self, j2 = gs2 || sf2 || Function("return this")(), Lr2 = s2 && !s2.nodeType && s2, dn2 = Lr2 && true && P2 && !P2.nodeType && P2, vs3 = dn2 && dn2.exports === Lr2, Hr2 = vs3 && gs2.process, _t2 = function() {
      try {
        var h3 = dn2 && dn2.require && dn2.require("util").types;
        return h3 || Hr2 && Hr2.binding && Hr2.binding("util");
      } catch {
      }
    }(), _s2 = _t2 && _t2.isArrayBuffer, ms2 = _t2 && _t2.isDate, ws3 = _t2 && _t2.isMap, Ps2 = _t2 && _t2.isRegExp, Cs2 = _t2 && _t2.isSet, As2 = _t2 && _t2.isTypedArray;
    function ct2(h3, g3, d3) {
      switch (d3.length) {
        case 0:
          return h3.call(g3);
        case 1:
          return h3.call(g3, d3[0]);
        case 2:
          return h3.call(g3, d3[0], d3[1]);
        case 3:
          return h3.call(g3, d3[0], d3[1], d3[2]);
      }
      return h3.apply(g3, d3);
    }
    function uf2(h3, g3, d3, A2) {
      for (var R3 = -1, q2 = h3 == null ? 0 : h3.length; ++R3 < q2; ) {
        var X2 = h3[R3];
        g3(A2, X2, d3(X2), h3);
      }
      return A2;
    }
    function mt2(h3, g3) {
      for (var d3 = -1, A2 = h3 == null ? 0 : h3.length; ++d3 < A2 && g3(h3[d3], d3, h3) !== false; ) ;
      return h3;
    }
    function af2(h3, g3) {
      for (var d3 = h3 == null ? 0 : h3.length; d3-- && g3(h3[d3], d3, h3) !== false; ) ;
      return h3;
    }
    function Is3(h3, g3) {
      for (var d3 = -1, A2 = h3 == null ? 0 : h3.length; ++d3 < A2; ) if (!g3(h3[d3], d3, h3)) return false;
      return true;
    }
    function en2(h3, g3) {
      for (var d3 = -1, A2 = h3 == null ? 0 : h3.length, R3 = 0, q2 = []; ++d3 < A2; ) {
        var X2 = h3[d3];
        g3(X2, d3, h3) && (q2[R3++] = X2);
      }
      return q2;
    }
    function Se2(h3, g3) {
      var d3 = h3 == null ? 0 : h3.length;
      return !!d3 && Ln2(h3, g3, 0) > -1;
    }
    function Dr2(h3, g3, d3) {
      for (var A2 = -1, R3 = h3 == null ? 0 : h3.length; ++A2 < R3; ) if (d3(g3, h3[A2])) return true;
      return false;
    }
    function z3(h3, g3) {
      for (var d3 = -1, A2 = h3 == null ? 0 : h3.length, R3 = Array(A2); ++d3 < A2; ) R3[d3] = g3(h3[d3], d3, h3);
      return R3;
    }
    function rn2(h3, g3) {
      for (var d3 = -1, A2 = g3.length, R3 = h3.length; ++d3 < A2; ) h3[R3 + d3] = g3[d3];
      return h3;
    }
    function Nr2(h3, g3, d3, A2) {
      var R3 = -1, q2 = h3 == null ? 0 : h3.length;
      for (A2 && q2 && (d3 = h3[++R3]); ++R3 < q2; ) d3 = g3(d3, h3[R3], R3, h3);
      return d3;
    }
    function of2(h3, g3, d3, A2) {
      var R3 = h3 == null ? 0 : h3.length;
      for (A2 && R3 && (d3 = h3[--R3]); R3--; ) d3 = g3(d3, h3[R3], R3, h3);
      return d3;
    }
    function $r2(h3, g3) {
      for (var d3 = -1, A2 = h3 == null ? 0 : h3.length; ++d3 < A2; ) if (g3(h3[d3], d3, h3)) return true;
      return false;
    }
    var ff = qr2("length");
    function cf2(h3) {
      return h3.split("");
    }
    function hf2(h3) {
      return h3.match(mo2) || [];
    }
    function xs2(h3, g3, d3) {
      var A2;
      return d3(h3, function(R3, q2, X2) {
        if (g3(R3, q2, X2)) return A2 = q2, false;
      }), A2;
    }
    function Oe2(h3, g3, d3, A2) {
      for (var R3 = h3.length, q2 = d3 + (A2 ? 1 : -1); A2 ? q2-- : ++q2 < R3; ) if (g3(h3[q2], q2, h3)) return q2;
      return -1;
    }
    function Ln2(h3, g3, d3) {
      return g3 === g3 ? If2(h3, g3, d3) : Oe2(h3, Es3, d3);
    }
    function lf2(h3, g3, d3, A2) {
      for (var R3 = d3 - 1, q2 = h3.length; ++R3 < q2; ) if (A2(h3[R3], g3)) return R3;
      return -1;
    }
    function Es3(h3) {
      return h3 !== h3;
    }
    function ys2(h3, g3) {
      var d3 = h3 == null ? 0 : h3.length;
      return d3 ? Fr2(h3, g3) / d3 : we2;
    }
    function qr2(h3) {
      return function(g3) {
        return g3 == null ? i2 : g3[h3];
      };
    }
    function Ur2(h3) {
      return function(g3) {
        return h3 == null ? i2 : h3[g3];
      };
    }
    function Ss2(h3, g3, d3, A2, R3) {
      return R3(h3, function(q2, X2, M3) {
        d3 = A2 ? (A2 = false, q2) : g3(d3, q2, X2, M3);
      }), d3;
    }
    function pf2(h3, g3) {
      var d3 = h3.length;
      for (h3.sort(g3); d3--; ) h3[d3] = h3[d3].value;
      return h3;
    }
    function Fr2(h3, g3) {
      for (var d3, A2 = -1, R3 = h3.length; ++A2 < R3; ) {
        var q2 = g3(h3[A2]);
        q2 !== i2 && (d3 = d3 === i2 ? q2 : d3 + q2);
      }
      return d3;
    }
    function Wr2(h3, g3) {
      for (var d3 = -1, A2 = Array(h3); ++d3 < h3; ) A2[d3] = g3(d3);
      return A2;
    }
    function df2(h3, g3) {
      return z3(g3, function(d3) {
        return [d3, h3[d3]];
      });
    }
    function Os2(h3) {
      return h3 && h3.slice(0, Ls2(h3) + 1).replace(yr2, "");
    }
    function ht2(h3) {
      return function(g3) {
        return h3(g3);
      };
    }
    function Mr2(h3, g3) {
      return z3(g3, function(d3) {
        return h3[d3];
      });
    }
    function ne2(h3, g3) {
      return h3.has(g3);
    }
    function Rs2(h3, g3) {
      for (var d3 = -1, A2 = h3.length; ++d3 < A2 && Ln2(g3, h3[d3], 0) > -1; ) ;
      return d3;
    }
    function bs2(h3, g3) {
      for (var d3 = h3.length; d3-- && Ln2(g3, h3[d3], 0) > -1; ) ;
      return d3;
    }
    function gf2(h3, g3) {
      for (var d3 = h3.length, A2 = 0; d3--; ) h3[d3] === g3 && ++A2;
      return A2;
    }
    var vf2 = Ur2(ko), _f2 = Ur2(jo);
    function mf2(h3) {
      return "\\" + nf2[h3];
    }
    function wf2(h3, g3) {
      return h3 == null ? i2 : h3[g3];
    }
    function Hn2(h3) {
      return Zo.test(h3);
    }
    function Pf2(h3) {
      return Xo2.test(h3);
    }
    function Cf2(h3) {
      for (var g3, d3 = []; !(g3 = h3.next()).done; ) d3.push(g3.value);
      return d3;
    }
    function Br(h3) {
      var g3 = -1, d3 = Array(h3.size);
      return h3.forEach(function(A2, R3) {
        d3[++g3] = [R3, A2];
      }), d3;
    }
    function Ts2(h3, g3) {
      return function(d3) {
        return h3(g3(d3));
      };
    }
    function sn2(h3, g3) {
      for (var d3 = -1, A2 = h3.length, R3 = 0, q2 = []; ++d3 < A2; ) {
        var X2 = h3[d3];
        (X2 === g3 || X2 === xn) && (h3[d3] = xn, q2[R3++] = d3);
      }
      return q2;
    }
    function Re2(h3) {
      var g3 = -1, d3 = Array(h3.size);
      return h3.forEach(function(A2) {
        d3[++g3] = A2;
      }), d3;
    }
    function Af2(h3) {
      var g3 = -1, d3 = Array(h3.size);
      return h3.forEach(function(A2) {
        d3[++g3] = [A2, A2];
      }), d3;
    }
    function If2(h3, g3, d3) {
      for (var A2 = d3 - 1, R3 = h3.length; ++A2 < R3; ) if (h3[A2] === g3) return A2;
      return -1;
    }
    function xf2(h3, g3, d3) {
      for (var A2 = d3 + 1; A2--; ) if (h3[A2] === g3) return A2;
      return A2;
    }
    function Dn2(h3) {
      return Hn2(h3) ? yf2(h3) : ff(h3);
    }
    function St2(h3) {
      return Hn2(h3) ? Sf2(h3) : cf2(h3);
    }
    function Ls2(h3) {
      for (var g3 = h3.length; g3-- && po.test(h3.charAt(g3)); ) ;
      return g3;
    }
    var Ef2 = Ur2(tf2);
    function yf2(h3) {
      for (var g3 = Tr2.lastIndex = 0; Tr2.test(h3); ) ++g3;
      return g3;
    }
    function Sf2(h3) {
      return h3.match(Tr2) || [];
    }
    function Of2(h3) {
      return h3.match(Yo) || [];
    }
    var Rf2 = function h3(g3) {
      g3 = g3 == null ? j2 : Nn2.defaults(j2.Object(), g3, Nn2.pick(j2, Qo));
      var d3 = g3.Array, A2 = g3.Date, R3 = g3.Error, q2 = g3.Function, X2 = g3.Math, M3 = g3.Object, Gr2 = g3.RegExp, bf2 = g3.String, wt2 = g3.TypeError, be2 = d3.prototype, Tf2 = q2.prototype, $n2 = M3.prototype, Te2 = g3["__core-js_shared__"], Le2 = Tf2.toString, W = $n2.hasOwnProperty, Lf2 = 0, Hs2 = function() {
        var t = /[^.]+$/.exec(Te2 && Te2.keys && Te2.keys.IE_PROTO || "");
        return t ? "Symbol(src)_1." + t : "";
      }(), He = $n2.toString, Hf2 = Le2.call(M3), Df2 = j2._, Nf2 = Gr2("^" + Le2.call(W).replace(Er2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), De2 = vs3 ? g3.Buffer : i2, un2 = g3.Symbol, Ne = g3.Uint8Array, Ds2 = De2 ? De2.allocUnsafe : i2, $e2 = Ts2(M3.getPrototypeOf, M3), Ns2 = M3.create, $s2 = $n2.propertyIsEnumerable, qe = be2.splice, qs2 = un2 ? un2.isConcatSpreadable : i2, ee2 = un2 ? un2.iterator : i2, gn2 = un2 ? un2.toStringTag : i2, Ue = function() {
        try {
          var t = Pn2(M3, "defineProperty");
          return t({}, "", {}), t;
        } catch {
        }
      }(), $f = g3.clearTimeout !== j2.clearTimeout && g3.clearTimeout, qf2 = A2 && A2.now !== j2.Date.now && A2.now, Uf2 = g3.setTimeout !== j2.setTimeout && g3.setTimeout, Fe = X2.ceil, We2 = X2.floor, zr2 = M3.getOwnPropertySymbols, Ff2 = De2 ? De2.isBuffer : i2, Us2 = g3.isFinite, Wf2 = be2.join, Mf2 = Ts2(M3.keys, M3), Q2 = X2.max, nt2 = X2.min, Bf2 = A2.now, Gf = g3.parseInt, Fs2 = X2.random, zf2 = be2.reverse, Kr2 = Pn2(g3, "DataView"), re2 = Pn2(g3, "Map"), Jr2 = Pn2(g3, "Promise"), qn2 = Pn2(g3, "Set"), ie2 = Pn2(g3, "WeakMap"), se2 = Pn2(M3, "create"), Me = ie2 && new ie2(), Un2 = {}, Kf2 = Cn2(Kr2), Jf2 = Cn2(re2), Yf = Cn2(Jr2), Zf2 = Cn2(qn2), Xf2 = Cn2(ie2), Be2 = un2 ? un2.prototype : i2, ue2 = Be2 ? Be2.valueOf : i2, Ws2 = Be2 ? Be2.toString : i2;
      function a3(t) {
        if (J(t) && !b2(t) && !(t instanceof N2)) {
          if (t instanceof Pt2) return t;
          if (W.call(t, "__wrapped__")) return Mu2(t);
        }
        return new Pt2(t);
      }
      var Fn = /* @__PURE__ */ function() {
        function t() {
        }
        return function(n2) {
          if (!K2(n2)) return {};
          if (Ns2) return Ns2(n2);
          t.prototype = n2;
          var e = new t();
          return t.prototype = i2, e;
        };
      }();
      function Ge() {
      }
      function Pt2(t, n2) {
        this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!n2, this.__index__ = 0, this.__values__ = i2;
      }
      a3.templateSettings = { escape: ao2, evaluate: oo2, interpolate: Xi2, variable: "", imports: { _: a3 } }, a3.prototype = Ge.prototype, a3.prototype.constructor = a3, Pt2.prototype = Fn(Ge.prototype), Pt2.prototype.constructor = Pt2;
      function N2(t) {
        this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = $t2, this.__views__ = [];
      }
      function Qf2() {
        var t = new N2(this.__wrapped__);
        return t.__actions__ = ut2(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = ut2(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = ut2(this.__views__), t;
      }
      function Vf() {
        if (this.__filtered__) {
          var t = new N2(this);
          t.__dir__ = -1, t.__filtered__ = true;
        } else t = this.clone(), t.__dir__ *= -1;
        return t;
      }
      function kf2() {
        var t = this.__wrapped__.value(), n2 = this.__dir__, e = b2(t), r2 = n2 < 0, u3 = e ? t.length : 0, o2 = ch2(0, u3, this.__views__), f3 = o2.start, c2 = o2.end, l2 = c2 - f3, v3 = r2 ? c2 : f3 - 1, _2 = this.__iteratees__, m3 = _2.length, C3 = 0, I2 = nt2(l2, this.__takeCount__);
        if (!e || !r2 && u3 == l2 && I2 == l2) return cu2(t, this.__actions__);
        var y3 = [];
        t: for (; l2-- && C3 < I2; ) {
          v3 += n2;
          for (var L3 = -1, S4 = t[v3]; ++L3 < m3; ) {
            var D2 = _2[L3], $2 = D2.iteratee, dt2 = D2.type, st2 = $2(S4);
            if (dt2 == za2) S4 = st2;
            else if (!st2) {
              if (dt2 == zi2) continue t;
              break t;
            }
          }
          y3[C3++] = S4;
        }
        return y3;
      }
      N2.prototype = Fn(Ge.prototype), N2.prototype.constructor = N2;
      function vn2(t) {
        var n2 = -1, e = t == null ? 0 : t.length;
        for (this.clear(); ++n2 < e; ) {
          var r2 = t[n2];
          this.set(r2[0], r2[1]);
        }
      }
      function jf2() {
        this.__data__ = se2 ? se2(null) : {}, this.size = 0;
      }
      function tc(t) {
        var n2 = this.has(t) && delete this.__data__[t];
        return this.size -= n2 ? 1 : 0, n2;
      }
      function nc(t) {
        var n2 = this.__data__;
        if (se2) {
          var e = n2[t];
          return e === tn2 ? i2 : e;
        }
        return W.call(n2, t) ? n2[t] : i2;
      }
      function ec2(t) {
        var n2 = this.__data__;
        return se2 ? n2[t] !== i2 : W.call(n2, t);
      }
      function rc(t, n2) {
        var e = this.__data__;
        return this.size += this.has(t) ? 0 : 1, e[t] = se2 && n2 === i2 ? tn2 : n2, this;
      }
      vn2.prototype.clear = jf2, vn2.prototype.delete = tc, vn2.prototype.get = nc, vn2.prototype.has = ec2, vn2.prototype.set = rc;
      function zt2(t) {
        var n2 = -1, e = t == null ? 0 : t.length;
        for (this.clear(); ++n2 < e; ) {
          var r2 = t[n2];
          this.set(r2[0], r2[1]);
        }
      }
      function ic() {
        this.__data__ = [], this.size = 0;
      }
      function sc(t) {
        var n2 = this.__data__, e = ze(n2, t);
        if (e < 0) return false;
        var r2 = n2.length - 1;
        return e == r2 ? n2.pop() : qe.call(n2, e, 1), --this.size, true;
      }
      function uc(t) {
        var n2 = this.__data__, e = ze(n2, t);
        return e < 0 ? i2 : n2[e][1];
      }
      function ac(t) {
        return ze(this.__data__, t) > -1;
      }
      function oc(t, n2) {
        var e = this.__data__, r2 = ze(e, t);
        return r2 < 0 ? (++this.size, e.push([t, n2])) : e[r2][1] = n2, this;
      }
      zt2.prototype.clear = ic, zt2.prototype.delete = sc, zt2.prototype.get = uc, zt2.prototype.has = ac, zt2.prototype.set = oc;
      function Kt2(t) {
        var n2 = -1, e = t == null ? 0 : t.length;
        for (this.clear(); ++n2 < e; ) {
          var r2 = t[n2];
          this.set(r2[0], r2[1]);
        }
      }
      function fc() {
        this.size = 0, this.__data__ = { hash: new vn2(), map: new (re2 || zt2)(), string: new vn2() };
      }
      function cc(t) {
        var n2 = er2(this, t).delete(t);
        return this.size -= n2 ? 1 : 0, n2;
      }
      function hc(t) {
        return er2(this, t).get(t);
      }
      function lc(t) {
        return er2(this, t).has(t);
      }
      function pc(t, n2) {
        var e = er2(this, t), r2 = e.size;
        return e.set(t, n2), this.size += e.size == r2 ? 0 : 1, this;
      }
      Kt2.prototype.clear = fc, Kt2.prototype.delete = cc, Kt2.prototype.get = hc, Kt2.prototype.has = lc, Kt2.prototype.set = pc;
      function _n2(t) {
        var n2 = -1, e = t == null ? 0 : t.length;
        for (this.__data__ = new Kt2(); ++n2 < e; ) this.add(t[n2]);
      }
      function dc(t) {
        return this.__data__.set(t, tn2), this;
      }
      function gc(t) {
        return this.__data__.has(t);
      }
      _n2.prototype.add = _n2.prototype.push = dc, _n2.prototype.has = gc;
      function Ot2(t) {
        var n2 = this.__data__ = new zt2(t);
        this.size = n2.size;
      }
      function vc() {
        this.__data__ = new zt2(), this.size = 0;
      }
      function _c(t) {
        var n2 = this.__data__, e = n2.delete(t);
        return this.size = n2.size, e;
      }
      function mc(t) {
        return this.__data__.get(t);
      }
      function wc(t) {
        return this.__data__.has(t);
      }
      function Pc(t, n2) {
        var e = this.__data__;
        if (e instanceof zt2) {
          var r2 = e.__data__;
          if (!re2 || r2.length < w2 - 1) return r2.push([t, n2]), this.size = ++e.size, this;
          e = this.__data__ = new Kt2(r2);
        }
        return e.set(t, n2), this.size = e.size, this;
      }
      Ot2.prototype.clear = vc, Ot2.prototype.delete = _c, Ot2.prototype.get = mc, Ot2.prototype.has = wc, Ot2.prototype.set = Pc;
      function Ms2(t, n2) {
        var e = b2(t), r2 = !e && An(t), u3 = !e && !r2 && hn2(t), o2 = !e && !r2 && !u3 && Gn2(t), f3 = e || r2 || u3 || o2, c2 = f3 ? Wr2(t.length, bf2) : [], l2 = c2.length;
        for (var v3 in t) (n2 || W.call(t, v3)) && !(f3 && (v3 == "length" || u3 && (v3 == "offset" || v3 == "parent") || o2 && (v3 == "buffer" || v3 == "byteLength" || v3 == "byteOffset") || Xt2(v3, l2))) && c2.push(v3);
        return c2;
      }
      function Bs2(t) {
        var n2 = t.length;
        return n2 ? t[ri2(0, n2 - 1)] : i2;
      }
      function Cc(t, n2) {
        return rr2(ut2(t), mn2(n2, 0, t.length));
      }
      function Ac(t) {
        return rr2(ut2(t));
      }
      function Yr2(t, n2, e) {
        (e !== i2 && !Rt2(t[n2], e) || e === i2 && !(n2 in t)) && Jt2(t, n2, e);
      }
      function ae3(t, n2, e) {
        var r2 = t[n2];
        (!(W.call(t, n2) && Rt2(r2, e)) || e === i2 && !(n2 in t)) && Jt2(t, n2, e);
      }
      function ze(t, n2) {
        for (var e = t.length; e--; ) if (Rt2(t[e][0], n2)) return e;
        return -1;
      }
      function Ic(t, n2, e, r2) {
        return an2(t, function(u3, o2, f3) {
          n2(r2, u3, e(u3), f3);
        }), r2;
      }
      function Gs2(t, n2) {
        return t && Ut3(n2, V3(n2), t);
      }
      function xc(t, n2) {
        return t && Ut3(n2, ot2(n2), t);
      }
      function Jt2(t, n2, e) {
        n2 == "__proto__" && Ue ? Ue(t, n2, { configurable: true, enumerable: true, value: e, writable: true }) : t[n2] = e;
      }
      function Zr2(t, n2) {
        for (var e = -1, r2 = n2.length, u3 = d3(r2), o2 = t == null; ++e < r2; ) u3[e] = o2 ? i2 : Oi2(t, n2[e]);
        return u3;
      }
      function mn2(t, n2, e) {
        return t === t && (e !== i2 && (t = t <= e ? t : e), n2 !== i2 && (t = t >= n2 ? t : n2)), t;
      }
      function Ct2(t, n2, e, r2, u3, o2) {
        var f3, c2 = n2 & Ht2, l2 = n2 & Mt2, v3 = n2 & En2;
        if (e && (f3 = u3 ? e(t, r2, u3, o2) : e(t)), f3 !== i2) return f3;
        if (!K2(t)) return t;
        var _2 = b2(t);
        if (_2) {
          if (f3 = lh2(t), !c2) return ut2(t, f3);
        } else {
          var m3 = et2(t), C3 = m3 == Ae2 || m3 == Ki2;
          if (hn2(t)) return pu(t, c2);
          if (m3 == Gt2 || m3 == Rn2 || C3 && !u3) {
            if (f3 = l2 || C3 ? {} : Lu2(t), !c2) return l2 ? nh2(t, xc(f3, t)) : th(t, Gs2(f3, t));
          } else {
            if (!B2[m3]) return u3 ? t : {};
            f3 = ph2(t, m3, c2);
          }
        }
        o2 || (o2 = new Ot2());
        var I2 = o2.get(t);
        if (I2) return I2;
        o2.set(t, f3), aa2(t) ? t.forEach(function(S4) {
          f3.add(Ct2(S4, n2, e, S4, t, o2));
        }) : sa2(t) && t.forEach(function(S4, D2) {
          f3.set(D2, Ct2(S4, n2, e, D2, t, o2));
        });
        var y3 = v3 ? l2 ? di2 : pi2 : l2 ? ot2 : V3, L3 = _2 ? i2 : y3(t);
        return mt2(L3 || t, function(S4, D2) {
          L3 && (D2 = S4, S4 = t[D2]), ae3(f3, D2, Ct2(S4, n2, e, D2, t, o2));
        }), f3;
      }
      function Ec(t) {
        var n2 = V3(t);
        return function(e) {
          return zs2(e, t, n2);
        };
      }
      function zs2(t, n2, e) {
        var r2 = e.length;
        if (t == null) return !r2;
        for (t = M3(t); r2--; ) {
          var u3 = e[r2], o2 = n2[u3], f3 = t[u3];
          if (f3 === i2 && !(u3 in t) || !o2(f3)) return false;
        }
        return true;
      }
      function Ks2(t, n2, e) {
        if (typeof t != "function") throw new wt2(O3);
        return de2(function() {
          t.apply(i2, e);
        }, n2);
      }
      function oe2(t, n2, e, r2) {
        var u3 = -1, o2 = Se2, f3 = true, c2 = t.length, l2 = [], v3 = n2.length;
        if (!c2) return l2;
        e && (n2 = z3(n2, ht2(e))), r2 ? (o2 = Dr2, f3 = false) : n2.length >= w2 && (o2 = ne2, f3 = false, n2 = new _n2(n2));
        t: for (; ++u3 < c2; ) {
          var _2 = t[u3], m3 = e == null ? _2 : e(_2);
          if (_2 = r2 || _2 !== 0 ? _2 : 0, f3 && m3 === m3) {
            for (var C3 = v3; C3--; ) if (n2[C3] === m3) continue t;
            l2.push(_2);
          } else o2(n2, m3, r2) || l2.push(_2);
        }
        return l2;
      }
      var an2 = mu2(qt2), Js2 = mu2(Qr2, true);
      function yc(t, n2) {
        var e = true;
        return an2(t, function(r2, u3, o2) {
          return e = !!n2(r2, u3, o2), e;
        }), e;
      }
      function Ke(t, n2, e) {
        for (var r2 = -1, u3 = t.length; ++r2 < u3; ) {
          var o2 = t[r2], f3 = n2(o2);
          if (f3 != null && (c2 === i2 ? f3 === f3 && !pt2(f3) : e(f3, c2))) var c2 = f3, l2 = o2;
        }
        return l2;
      }
      function Sc(t, n2, e, r2) {
        var u3 = t.length;
        for (e = T2(e), e < 0 && (e = -e > u3 ? 0 : u3 + e), r2 = r2 === i2 || r2 > u3 ? u3 : T2(r2), r2 < 0 && (r2 += u3), r2 = e > r2 ? 0 : fa2(r2); e < r2; ) t[e++] = n2;
        return t;
      }
      function Ys2(t, n2) {
        var e = [];
        return an2(t, function(r2, u3, o2) {
          n2(r2, u3, o2) && e.push(r2);
        }), e;
      }
      function tt2(t, n2, e, r2, u3) {
        var o2 = -1, f3 = t.length;
        for (e || (e = gh2), u3 || (u3 = []); ++o2 < f3; ) {
          var c2 = t[o2];
          n2 > 0 && e(c2) ? n2 > 1 ? tt2(c2, n2 - 1, e, r2, u3) : rn2(u3, c2) : r2 || (u3[u3.length] = c2);
        }
        return u3;
      }
      var Xr2 = wu2(), Zs2 = wu2(true);
      function qt2(t, n2) {
        return t && Xr2(t, n2, V3);
      }
      function Qr2(t, n2) {
        return t && Zs2(t, n2, V3);
      }
      function Je2(t, n2) {
        return en2(n2, function(e) {
          return Qt2(t[e]);
        });
      }
      function wn2(t, n2) {
        n2 = fn2(n2, t);
        for (var e = 0, r2 = n2.length; t != null && e < r2; ) t = t[Ft2(n2[e++])];
        return e && e == r2 ? t : i2;
      }
      function Xs2(t, n2, e) {
        var r2 = n2(t);
        return b2(t) ? r2 : rn2(r2, e(t));
      }
      function rt2(t) {
        return t == null ? t === i2 ? to2 : ka2 : gn2 && gn2 in M3(t) ? fh2(t) : Ah2(t);
      }
      function Vr2(t, n2) {
        return t > n2;
      }
      function Oc(t, n2) {
        return t != null && W.call(t, n2);
      }
      function Rc(t, n2) {
        return t != null && n2 in M3(t);
      }
      function bc(t, n2, e) {
        return t >= nt2(n2, e) && t < Q2(n2, e);
      }
      function kr2(t, n2, e) {
        for (var r2 = e ? Dr2 : Se2, u3 = t[0].length, o2 = t.length, f3 = o2, c2 = d3(o2), l2 = 1 / 0, v3 = []; f3--; ) {
          var _2 = t[f3];
          f3 && n2 && (_2 = z3(_2, ht2(n2))), l2 = nt2(_2.length, l2), c2[f3] = !e && (n2 || u3 >= 120 && _2.length >= 120) ? new _n2(f3 && _2) : i2;
        }
        _2 = t[0];
        var m3 = -1, C3 = c2[0];
        t: for (; ++m3 < u3 && v3.length < l2; ) {
          var I2 = _2[m3], y3 = n2 ? n2(I2) : I2;
          if (I2 = e || I2 !== 0 ? I2 : 0, !(C3 ? ne2(C3, y3) : r2(v3, y3, e))) {
            for (f3 = o2; --f3; ) {
              var L3 = c2[f3];
              if (!(L3 ? ne2(L3, y3) : r2(t[f3], y3, e))) continue t;
            }
            C3 && C3.push(y3), v3.push(I2);
          }
        }
        return v3;
      }
      function Tc(t, n2, e, r2) {
        return qt2(t, function(u3, o2, f3) {
          n2(r2, e(u3), o2, f3);
        }), r2;
      }
      function fe2(t, n2, e) {
        n2 = fn2(n2, t), t = $u(t, n2);
        var r2 = t == null ? t : t[Ft2(It2(n2))];
        return r2 == null ? i2 : ct2(r2, t, e);
      }
      function Qs2(t) {
        return J(t) && rt2(t) == Rn2;
      }
      function Lc(t) {
        return J(t) && rt2(t) == te2;
      }
      function Hc(t) {
        return J(t) && rt2(t) == Xn2;
      }
      function ce2(t, n2, e, r2, u3) {
        return t === n2 ? true : t == null || n2 == null || !J(t) && !J(n2) ? t !== t && n2 !== n2 : Dc(t, n2, e, r2, ce2, u3);
      }
      function Dc(t, n2, e, r2, u3, o2) {
        var f3 = b2(t), c2 = b2(n2), l2 = f3 ? Pe2 : et2(t), v3 = c2 ? Pe2 : et2(n2);
        l2 = l2 == Rn2 ? Gt2 : l2, v3 = v3 == Rn2 ? Gt2 : v3;
        var _2 = l2 == Gt2, m3 = v3 == Gt2, C3 = l2 == v3;
        if (C3 && hn2(t)) {
          if (!hn2(n2)) return false;
          f3 = true, _2 = false;
        }
        if (C3 && !_2) return o2 || (o2 = new Ot2()), f3 || Gn2(t) ? Ru2(t, n2, e, r2, u3, o2) : ah2(t, n2, l2, e, r2, u3, o2);
        if (!(e & yn2)) {
          var I2 = _2 && W.call(t, "__wrapped__"), y3 = m3 && W.call(n2, "__wrapped__");
          if (I2 || y3) {
            var L3 = I2 ? t.value() : t, S4 = y3 ? n2.value() : n2;
            return o2 || (o2 = new Ot2()), u3(L3, S4, e, r2, o2);
          }
        }
        return C3 ? (o2 || (o2 = new Ot2()), oh2(t, n2, e, r2, u3, o2)) : false;
      }
      function Nc(t) {
        return J(t) && et2(t) == Et2;
      }
      function jr2(t, n2, e, r2) {
        var u3 = e.length, o2 = u3, f3 = !r2;
        if (t == null) return !o2;
        for (t = M3(t); u3--; ) {
          var c2 = e[u3];
          if (f3 && c2[2] ? c2[1] !== t[c2[0]] : !(c2[0] in t)) return false;
        }
        for (; ++u3 < o2; ) {
          c2 = e[u3];
          var l2 = c2[0], v3 = t[l2], _2 = c2[1];
          if (f3 && c2[2]) {
            if (v3 === i2 && !(l2 in t)) return false;
          } else {
            var m3 = new Ot2();
            if (r2) var C3 = r2(v3, _2, l2, t, n2, m3);
            if (!(C3 === i2 ? ce2(_2, v3, yn2 | me2, r2, m3) : C3)) return false;
          }
        }
        return true;
      }
      function Vs2(t) {
        if (!K2(t) || _h(t)) return false;
        var n2 = Qt2(t) ? Nf2 : xo2;
        return n2.test(Cn2(t));
      }
      function $c(t) {
        return J(t) && rt2(t) == Vn2;
      }
      function qc(t) {
        return J(t) && et2(t) == yt2;
      }
      function Uc(t) {
        return J(t) && fr2(t.length) && !!G[rt2(t)];
      }
      function ks2(t) {
        return typeof t == "function" ? t : t == null ? ft2 : typeof t == "object" ? b2(t) ? nu2(t[0], t[1]) : tu(t) : Pa2(t);
      }
      function ti2(t) {
        if (!pe2(t)) return Mf2(t);
        var n2 = [];
        for (var e in M3(t)) W.call(t, e) && e != "constructor" && n2.push(e);
        return n2;
      }
      function Fc(t) {
        if (!K2(t)) return Ch(t);
        var n2 = pe2(t), e = [];
        for (var r2 in t) r2 == "constructor" && (n2 || !W.call(t, r2)) || e.push(r2);
        return e;
      }
      function ni2(t, n2) {
        return t < n2;
      }
      function js2(t, n2) {
        var e = -1, r2 = at2(t) ? d3(t.length) : [];
        return an2(t, function(u3, o2, f3) {
          r2[++e] = n2(u3, o2, f3);
        }), r2;
      }
      function tu(t) {
        var n2 = vi(t);
        return n2.length == 1 && n2[0][2] ? Du2(n2[0][0], n2[0][1]) : function(e) {
          return e === t || jr2(e, t, n2);
        };
      }
      function nu2(t, n2) {
        return mi(t) && Hu2(n2) ? Du2(Ft2(t), n2) : function(e) {
          var r2 = Oi2(e, t);
          return r2 === i2 && r2 === n2 ? Ri2(e, t) : ce2(n2, r2, yn2 | me2);
        };
      }
      function Ye2(t, n2, e, r2, u3) {
        t !== n2 && Xr2(n2, function(o2, f3) {
          if (u3 || (u3 = new Ot2()), K2(o2)) Wc(t, n2, f3, e, Ye2, r2, u3);
          else {
            var c2 = r2 ? r2(Pi2(t, f3), o2, f3 + "", t, n2, u3) : i2;
            c2 === i2 && (c2 = o2), Yr2(t, f3, c2);
          }
        }, ot2);
      }
      function Wc(t, n2, e, r2, u3, o2, f3) {
        var c2 = Pi2(t, e), l2 = Pi2(n2, e), v3 = f3.get(l2);
        if (v3) {
          Yr2(t, e, v3);
          return;
        }
        var _2 = o2 ? o2(c2, l2, e + "", t, n2, f3) : i2, m3 = _2 === i2;
        if (m3) {
          var C3 = b2(l2), I2 = !C3 && hn2(l2), y3 = !C3 && !I2 && Gn2(l2);
          _2 = l2, C3 || I2 || y3 ? b2(c2) ? _2 = c2 : Y(c2) ? _2 = ut2(c2) : I2 ? (m3 = false, _2 = pu(l2, true)) : y3 ? (m3 = false, _2 = du(l2, true)) : _2 = [] : ge2(l2) || An(l2) ? (_2 = c2, An(c2) ? _2 = ca2(c2) : (!K2(c2) || Qt2(c2)) && (_2 = Lu2(l2))) : m3 = false;
        }
        m3 && (f3.set(l2, _2), u3(_2, l2, r2, o2, f3), f3.delete(l2)), Yr2(t, e, _2);
      }
      function eu2(t, n2) {
        var e = t.length;
        if (e) return n2 += n2 < 0 ? e : 0, Xt2(n2, e) ? t[n2] : i2;
      }
      function ru2(t, n2, e) {
        n2.length ? n2 = z3(n2, function(o2) {
          return b2(o2) ? function(f3) {
            return wn2(f3, o2.length === 1 ? o2[0] : o2);
          } : o2;
        }) : n2 = [ft2];
        var r2 = -1;
        n2 = z3(n2, ht2(E2()));
        var u3 = js2(t, function(o2, f3, c2) {
          var l2 = z3(n2, function(v3) {
            return v3(o2);
          });
          return { criteria: l2, index: ++r2, value: o2 };
        });
        return pf2(u3, function(o2, f3) {
          return jc(o2, f3, e);
        });
      }
      function Mc(t, n2) {
        return iu2(t, n2, function(e, r2) {
          return Ri2(t, r2);
        });
      }
      function iu2(t, n2, e) {
        for (var r2 = -1, u3 = n2.length, o2 = {}; ++r2 < u3; ) {
          var f3 = n2[r2], c2 = wn2(t, f3);
          e(c2, f3) && he2(o2, fn2(f3, t), c2);
        }
        return o2;
      }
      function Bc(t) {
        return function(n2) {
          return wn2(n2, t);
        };
      }
      function ei2(t, n2, e, r2) {
        var u3 = r2 ? lf2 : Ln2, o2 = -1, f3 = n2.length, c2 = t;
        for (t === n2 && (n2 = ut2(n2)), e && (c2 = z3(t, ht2(e))); ++o2 < f3; ) for (var l2 = 0, v3 = n2[o2], _2 = e ? e(v3) : v3; (l2 = u3(c2, _2, l2, r2)) > -1; ) c2 !== t && qe.call(c2, l2, 1), qe.call(t, l2, 1);
        return t;
      }
      function su2(t, n2) {
        for (var e = t ? n2.length : 0, r2 = e - 1; e--; ) {
          var u3 = n2[e];
          if (e == r2 || u3 !== o2) {
            var o2 = u3;
            Xt2(u3) ? qe.call(t, u3, 1) : ui2(t, u3);
          }
        }
        return t;
      }
      function ri2(t, n2) {
        return t + We2(Fs2() * (n2 - t + 1));
      }
      function Gc(t, n2, e, r2) {
        for (var u3 = -1, o2 = Q2(Fe((n2 - t) / (e || 1)), 0), f3 = d3(o2); o2--; ) f3[r2 ? o2 : ++u3] = t, t += e;
        return f3;
      }
      function ii2(t, n2) {
        var e = "";
        if (!t || n2 < 1 || n2 > nn2) return e;
        do
          n2 % 2 && (e += t), n2 = We2(n2 / 2), n2 && (t += t);
        while (n2);
        return e;
      }
      function H(t, n2) {
        return Ci2(Nu2(t, n2, ft2), t + "");
      }
      function zc(t) {
        return Bs2(zn2(t));
      }
      function Kc(t, n2) {
        var e = zn2(t);
        return rr2(e, mn2(n2, 0, e.length));
      }
      function he2(t, n2, e, r2) {
        if (!K2(t)) return t;
        n2 = fn2(n2, t);
        for (var u3 = -1, o2 = n2.length, f3 = o2 - 1, c2 = t; c2 != null && ++u3 < o2; ) {
          var l2 = Ft2(n2[u3]), v3 = e;
          if (l2 === "__proto__" || l2 === "constructor" || l2 === "prototype") return t;
          if (u3 != f3) {
            var _2 = c2[l2];
            v3 = r2 ? r2(_2, l2, c2) : i2, v3 === i2 && (v3 = K2(_2) ? _2 : Xt2(n2[u3 + 1]) ? [] : {});
          }
          ae3(c2, l2, v3), c2 = c2[l2];
        }
        return t;
      }
      var uu2 = Me ? function(t, n2) {
        return Me.set(t, n2), t;
      } : ft2, Jc = Ue ? function(t, n2) {
        return Ue(t, "toString", { configurable: true, enumerable: false, value: Ti2(n2), writable: true });
      } : ft2;
      function Yc(t) {
        return rr2(zn2(t));
      }
      function At2(t, n2, e) {
        var r2 = -1, u3 = t.length;
        n2 < 0 && (n2 = -n2 > u3 ? 0 : u3 + n2), e = e > u3 ? u3 : e, e < 0 && (e += u3), u3 = n2 > e ? 0 : e - n2 >>> 0, n2 >>>= 0;
        for (var o2 = d3(u3); ++r2 < u3; ) o2[r2] = t[r2 + n2];
        return o2;
      }
      function Zc(t, n2) {
        var e;
        return an2(t, function(r2, u3, o2) {
          return e = n2(r2, u3, o2), !e;
        }), !!e;
      }
      function Ze2(t, n2, e) {
        var r2 = 0, u3 = t == null ? r2 : t.length;
        if (typeof n2 == "number" && n2 === n2 && u3 <= Za2) {
          for (; r2 < u3; ) {
            var o2 = r2 + u3 >>> 1, f3 = t[o2];
            f3 !== null && !pt2(f3) && (e ? f3 <= n2 : f3 < n2) ? r2 = o2 + 1 : u3 = o2;
          }
          return u3;
        }
        return si2(t, n2, ft2, e);
      }
      function si2(t, n2, e, r2) {
        var u3 = 0, o2 = t == null ? 0 : t.length;
        if (o2 === 0) return 0;
        n2 = e(n2);
        for (var f3 = n2 !== n2, c2 = n2 === null, l2 = pt2(n2), v3 = n2 === i2; u3 < o2; ) {
          var _2 = We2((u3 + o2) / 2), m3 = e(t[_2]), C3 = m3 !== i2, I2 = m3 === null, y3 = m3 === m3, L3 = pt2(m3);
          if (f3) var S4 = r2 || y3;
          else v3 ? S4 = y3 && (r2 || C3) : c2 ? S4 = y3 && C3 && (r2 || !I2) : l2 ? S4 = y3 && C3 && !I2 && (r2 || !L3) : I2 || L3 ? S4 = false : S4 = r2 ? m3 <= n2 : m3 < n2;
          S4 ? u3 = _2 + 1 : o2 = _2;
        }
        return nt2(o2, Ya2);
      }
      function au2(t, n2) {
        for (var e = -1, r2 = t.length, u3 = 0, o2 = []; ++e < r2; ) {
          var f3 = t[e], c2 = n2 ? n2(f3) : f3;
          if (!e || !Rt2(c2, l2)) {
            var l2 = c2;
            o2[u3++] = f3 === 0 ? 0 : f3;
          }
        }
        return o2;
      }
      function ou2(t) {
        return typeof t == "number" ? t : pt2(t) ? we2 : +t;
      }
      function lt2(t) {
        if (typeof t == "string") return t;
        if (b2(t)) return z3(t, lt2) + "";
        if (pt2(t)) return Ws2 ? Ws2.call(t) : "";
        var n2 = t + "";
        return n2 == "0" && 1 / t == -pn2 ? "-0" : n2;
      }
      function on2(t, n2, e) {
        var r2 = -1, u3 = Se2, o2 = t.length, f3 = true, c2 = [], l2 = c2;
        if (e) f3 = false, u3 = Dr2;
        else if (o2 >= w2) {
          var v3 = n2 ? null : sh2(t);
          if (v3) return Re2(v3);
          f3 = false, u3 = ne2, l2 = new _n2();
        } else l2 = n2 ? [] : c2;
        t: for (; ++r2 < o2; ) {
          var _2 = t[r2], m3 = n2 ? n2(_2) : _2;
          if (_2 = e || _2 !== 0 ? _2 : 0, f3 && m3 === m3) {
            for (var C3 = l2.length; C3--; ) if (l2[C3] === m3) continue t;
            n2 && l2.push(m3), c2.push(_2);
          } else u3(l2, m3, e) || (l2 !== c2 && l2.push(m3), c2.push(_2));
        }
        return c2;
      }
      function ui2(t, n2) {
        return n2 = fn2(n2, t), t = $u(t, n2), t == null || delete t[Ft2(It2(n2))];
      }
      function fu2(t, n2, e, r2) {
        return he2(t, n2, e(wn2(t, n2)), r2);
      }
      function Xe2(t, n2, e, r2) {
        for (var u3 = t.length, o2 = r2 ? u3 : -1; (r2 ? o2-- : ++o2 < u3) && n2(t[o2], o2, t); ) ;
        return e ? At2(t, r2 ? 0 : o2, r2 ? o2 + 1 : u3) : At2(t, r2 ? o2 + 1 : 0, r2 ? u3 : o2);
      }
      function cu2(t, n2) {
        var e = t;
        return e instanceof N2 && (e = e.value()), Nr2(n2, function(r2, u3) {
          return u3.func.apply(u3.thisArg, rn2([r2], u3.args));
        }, e);
      }
      function ai2(t, n2, e) {
        var r2 = t.length;
        if (r2 < 2) return r2 ? on2(t[0]) : [];
        for (var u3 = -1, o2 = d3(r2); ++u3 < r2; ) for (var f3 = t[u3], c2 = -1; ++c2 < r2; ) c2 != u3 && (o2[u3] = oe2(o2[u3] || f3, t[c2], n2, e));
        return on2(tt2(o2, 1), n2, e);
      }
      function hu2(t, n2, e) {
        for (var r2 = -1, u3 = t.length, o2 = n2.length, f3 = {}; ++r2 < u3; ) {
          var c2 = r2 < o2 ? n2[r2] : i2;
          e(f3, t[r2], c2);
        }
        return f3;
      }
      function oi2(t) {
        return Y(t) ? t : [];
      }
      function fi(t) {
        return typeof t == "function" ? t : ft2;
      }
      function fn2(t, n2) {
        return b2(t) ? t : mi(t, n2) ? [t] : Wu(U2(t));
      }
      var Xc = H;
      function cn2(t, n2, e) {
        var r2 = t.length;
        return e = e === i2 ? r2 : e, !n2 && e >= r2 ? t : At2(t, n2, e);
      }
      var lu2 = $f || function(t) {
        return j2.clearTimeout(t);
      };
      function pu(t, n2) {
        if (n2) return t.slice();
        var e = t.length, r2 = Ds2 ? Ds2(e) : new t.constructor(e);
        return t.copy(r2), r2;
      }
      function ci2(t) {
        var n2 = new t.constructor(t.byteLength);
        return new Ne(n2).set(new Ne(t)), n2;
      }
      function Qc(t, n2) {
        var e = n2 ? ci2(t.buffer) : t.buffer;
        return new t.constructor(e, t.byteOffset, t.byteLength);
      }
      function Vc(t) {
        var n2 = new t.constructor(t.source, Qi2.exec(t));
        return n2.lastIndex = t.lastIndex, n2;
      }
      function kc(t) {
        return ue2 ? M3(ue2.call(t)) : {};
      }
      function du(t, n2) {
        var e = n2 ? ci2(t.buffer) : t.buffer;
        return new t.constructor(e, t.byteOffset, t.length);
      }
      function gu(t, n2) {
        if (t !== n2) {
          var e = t !== i2, r2 = t === null, u3 = t === t, o2 = pt2(t), f3 = n2 !== i2, c2 = n2 === null, l2 = n2 === n2, v3 = pt2(n2);
          if (!c2 && !v3 && !o2 && t > n2 || o2 && f3 && l2 && !c2 && !v3 || r2 && f3 && l2 || !e && l2 || !u3) return 1;
          if (!r2 && !o2 && !v3 && t < n2 || v3 && e && u3 && !r2 && !o2 || c2 && e && u3 || !f3 && u3 || !l2) return -1;
        }
        return 0;
      }
      function jc(t, n2, e) {
        for (var r2 = -1, u3 = t.criteria, o2 = n2.criteria, f3 = u3.length, c2 = e.length; ++r2 < f3; ) {
          var l2 = gu(u3[r2], o2[r2]);
          if (l2) {
            if (r2 >= c2) return l2;
            var v3 = e[r2];
            return l2 * (v3 == "desc" ? -1 : 1);
          }
        }
        return t.index - n2.index;
      }
      function vu(t, n2, e, r2) {
        for (var u3 = -1, o2 = t.length, f3 = e.length, c2 = -1, l2 = n2.length, v3 = Q2(o2 - f3, 0), _2 = d3(l2 + v3), m3 = !r2; ++c2 < l2; ) _2[c2] = n2[c2];
        for (; ++u3 < f3; ) (m3 || u3 < o2) && (_2[e[u3]] = t[u3]);
        for (; v3--; ) _2[c2++] = t[u3++];
        return _2;
      }
      function _u2(t, n2, e, r2) {
        for (var u3 = -1, o2 = t.length, f3 = -1, c2 = e.length, l2 = -1, v3 = n2.length, _2 = Q2(o2 - c2, 0), m3 = d3(_2 + v3), C3 = !r2; ++u3 < _2; ) m3[u3] = t[u3];
        for (var I2 = u3; ++l2 < v3; ) m3[I2 + l2] = n2[l2];
        for (; ++f3 < c2; ) (C3 || u3 < o2) && (m3[I2 + e[f3]] = t[u3++]);
        return m3;
      }
      function ut2(t, n2) {
        var e = -1, r2 = t.length;
        for (n2 || (n2 = d3(r2)); ++e < r2; ) n2[e] = t[e];
        return n2;
      }
      function Ut3(t, n2, e, r2) {
        var u3 = !e;
        e || (e = {});
        for (var o2 = -1, f3 = n2.length; ++o2 < f3; ) {
          var c2 = n2[o2], l2 = r2 ? r2(e[c2], t[c2], c2, e, t) : i2;
          l2 === i2 && (l2 = t[c2]), u3 ? Jt2(e, c2, l2) : ae3(e, c2, l2);
        }
        return e;
      }
      function th(t, n2) {
        return Ut3(t, _i2(t), n2);
      }
      function nh2(t, n2) {
        return Ut3(t, bu2(t), n2);
      }
      function Qe2(t, n2) {
        return function(e, r2) {
          var u3 = b2(e) ? uf2 : Ic, o2 = n2 ? n2() : {};
          return u3(e, t, E2(r2, 2), o2);
        };
      }
      function Wn2(t) {
        return H(function(n2, e) {
          var r2 = -1, u3 = e.length, o2 = u3 > 1 ? e[u3 - 1] : i2, f3 = u3 > 2 ? e[2] : i2;
          for (o2 = t.length > 3 && typeof o2 == "function" ? (u3--, o2) : i2, f3 && it2(e[0], e[1], f3) && (o2 = u3 < 3 ? i2 : o2, u3 = 1), n2 = M3(n2); ++r2 < u3; ) {
            var c2 = e[r2];
            c2 && t(n2, c2, r2, o2);
          }
          return n2;
        });
      }
      function mu2(t, n2) {
        return function(e, r2) {
          if (e == null) return e;
          if (!at2(e)) return t(e, r2);
          for (var u3 = e.length, o2 = n2 ? u3 : -1, f3 = M3(e); (n2 ? o2-- : ++o2 < u3) && r2(f3[o2], o2, f3) !== false; ) ;
          return e;
        };
      }
      function wu2(t) {
        return function(n2, e, r2) {
          for (var u3 = -1, o2 = M3(n2), f3 = r2(n2), c2 = f3.length; c2--; ) {
            var l2 = f3[t ? c2 : ++u3];
            if (e(o2[l2], l2, o2) === false) break;
          }
          return n2;
        };
      }
      function eh(t, n2, e) {
        var r2 = n2 & vt2, u3 = le2(t);
        function o2() {
          var f3 = this && this !== j2 && this instanceof o2 ? u3 : t;
          return f3.apply(r2 ? e : this, arguments);
        }
        return o2;
      }
      function Pu2(t) {
        return function(n2) {
          n2 = U2(n2);
          var e = Hn2(n2) ? St2(n2) : i2, r2 = e ? e[0] : n2.charAt(0), u3 = e ? cn2(e, 1).join("") : n2.slice(1);
          return r2[t]() + u3;
        };
      }
      function Mn2(t) {
        return function(n2) {
          return Nr2(ma2(_a2(n2).replace(Ko, "")), t, "");
        };
      }
      function le2(t) {
        return function() {
          var n2 = arguments;
          switch (n2.length) {
            case 0:
              return new t();
            case 1:
              return new t(n2[0]);
            case 2:
              return new t(n2[0], n2[1]);
            case 3:
              return new t(n2[0], n2[1], n2[2]);
            case 4:
              return new t(n2[0], n2[1], n2[2], n2[3]);
            case 5:
              return new t(n2[0], n2[1], n2[2], n2[3], n2[4]);
            case 6:
              return new t(n2[0], n2[1], n2[2], n2[3], n2[4], n2[5]);
            case 7:
              return new t(n2[0], n2[1], n2[2], n2[3], n2[4], n2[5], n2[6]);
          }
          var e = Fn(t.prototype), r2 = t.apply(e, n2);
          return K2(r2) ? r2 : e;
        };
      }
      function rh2(t, n2, e) {
        var r2 = le2(t);
        function u3() {
          for (var o2 = arguments.length, f3 = d3(o2), c2 = o2, l2 = Bn2(u3); c2--; ) f3[c2] = arguments[c2];
          var v3 = o2 < 3 && f3[0] !== l2 && f3[o2 - 1] !== l2 ? [] : sn2(f3, l2);
          if (o2 -= v3.length, o2 < e) return Eu2(t, n2, Ve, u3.placeholder, i2, f3, v3, i2, i2, e - o2);
          var _2 = this && this !== j2 && this instanceof u3 ? r2 : t;
          return ct2(_2, this, f3);
        }
        return u3;
      }
      function Cu2(t) {
        return function(n2, e, r2) {
          var u3 = M3(n2);
          if (!at2(n2)) {
            var o2 = E2(e, 3);
            n2 = V3(n2), e = function(c2) {
              return o2(u3[c2], c2, u3);
            };
          }
          var f3 = t(n2, e, r2);
          return f3 > -1 ? u3[o2 ? n2[f3] : f3] : i2;
        };
      }
      function Au2(t) {
        return Zt2(function(n2) {
          var e = n2.length, r2 = e, u3 = Pt2.prototype.thru;
          for (t && n2.reverse(); r2--; ) {
            var o2 = n2[r2];
            if (typeof o2 != "function") throw new wt2(O3);
            if (u3 && !f3 && nr2(o2) == "wrapper") var f3 = new Pt2([], true);
          }
          for (r2 = f3 ? r2 : e; ++r2 < e; ) {
            o2 = n2[r2];
            var c2 = nr2(o2), l2 = c2 == "wrapper" ? gi2(o2) : i2;
            l2 && wi(l2[0]) && l2[1] == (Bt2 | Dt2 | Nt2 | Yn2) && !l2[4].length && l2[9] == 1 ? f3 = f3[nr2(l2[0])].apply(f3, l2[3]) : f3 = o2.length == 1 && wi(o2) ? f3[c2]() : f3.thru(o2);
          }
          return function() {
            var v3 = arguments, _2 = v3[0];
            if (f3 && v3.length == 1 && b2(_2)) return f3.plant(_2).value();
            for (var m3 = 0, C3 = e ? n2[m3].apply(this, v3) : _2; ++m3 < e; ) C3 = n2[m3].call(this, C3);
            return C3;
          };
        });
      }
      function Ve(t, n2, e, r2, u3, o2, f3, c2, l2, v3) {
        var _2 = n2 & Bt2, m3 = n2 & vt2, C3 = n2 & ln2, I2 = n2 & (Dt2 | Sn2), y3 = n2 & gr2, L3 = C3 ? i2 : le2(t);
        function S4() {
          for (var D2 = arguments.length, $2 = d3(D2), dt2 = D2; dt2--; ) $2[dt2] = arguments[dt2];
          if (I2) var st2 = Bn2(S4), gt2 = gf2($2, st2);
          if (r2 && ($2 = vu($2, r2, u3, I2)), o2 && ($2 = _u2($2, o2, f3, I2)), D2 -= gt2, I2 && D2 < v3) {
            var Z2 = sn2($2, st2);
            return Eu2(t, n2, Ve, S4.placeholder, e, $2, Z2, c2, l2, v3 - D2);
          }
          var bt2 = m3 ? e : this, kt2 = C3 ? bt2[t] : t;
          return D2 = $2.length, c2 ? $2 = Ih($2, c2) : y3 && D2 > 1 && $2.reverse(), _2 && l2 < D2 && ($2.length = l2), this && this !== j2 && this instanceof S4 && (kt2 = L3 || le2(kt2)), kt2.apply(bt2, $2);
        }
        return S4;
      }
      function Iu2(t, n2) {
        return function(e, r2) {
          return Tc(e, t, n2(r2), {});
        };
      }
      function ke(t, n2) {
        return function(e, r2) {
          var u3;
          if (e === i2 && r2 === i2) return n2;
          if (e !== i2 && (u3 = e), r2 !== i2) {
            if (u3 === i2) return r2;
            typeof e == "string" || typeof r2 == "string" ? (e = lt2(e), r2 = lt2(r2)) : (e = ou2(e), r2 = ou2(r2)), u3 = t(e, r2);
          }
          return u3;
        };
      }
      function hi2(t) {
        return Zt2(function(n2) {
          return n2 = z3(n2, ht2(E2())), H(function(e) {
            var r2 = this;
            return t(n2, function(u3) {
              return ct2(u3, r2, e);
            });
          });
        });
      }
      function je(t, n2) {
        n2 = n2 === i2 ? " " : lt2(n2);
        var e = n2.length;
        if (e < 2) return e ? ii2(n2, t) : n2;
        var r2 = ii2(n2, Fe(t / Dn2(n2)));
        return Hn2(n2) ? cn2(St2(r2), 0, t).join("") : r2.slice(0, t);
      }
      function ih(t, n2, e, r2) {
        var u3 = n2 & vt2, o2 = le2(t);
        function f3() {
          for (var c2 = -1, l2 = arguments.length, v3 = -1, _2 = r2.length, m3 = d3(_2 + l2), C3 = this && this !== j2 && this instanceof f3 ? o2 : t; ++v3 < _2; ) m3[v3] = r2[v3];
          for (; l2--; ) m3[v3++] = arguments[++c2];
          return ct2(C3, u3 ? e : this, m3);
        }
        return f3;
      }
      function xu2(t) {
        return function(n2, e, r2) {
          return r2 && typeof r2 != "number" && it2(n2, e, r2) && (e = r2 = i2), n2 = Vt2(n2), e === i2 ? (e = n2, n2 = 0) : e = Vt2(e), r2 = r2 === i2 ? n2 < e ? 1 : -1 : Vt2(r2), Gc(n2, e, r2, t);
        };
      }
      function tr2(t) {
        return function(n2, e) {
          return typeof n2 == "string" && typeof e == "string" || (n2 = xt2(n2), e = xt2(e)), t(n2, e);
        };
      }
      function Eu2(t, n2, e, r2, u3, o2, f3, c2, l2, v3) {
        var _2 = n2 & Dt2, m3 = _2 ? f3 : i2, C3 = _2 ? i2 : f3, I2 = _2 ? o2 : i2, y3 = _2 ? i2 : o2;
        n2 |= _2 ? Nt2 : On2, n2 &= ~(_2 ? On2 : Nt2), n2 & Gi2 || (n2 &= -4);
        var L3 = [t, n2, u3, I2, m3, y3, C3, c2, l2, v3], S4 = e.apply(i2, L3);
        return wi(t) && qu2(S4, L3), S4.placeholder = r2, Uu2(S4, t, n2);
      }
      function li2(t) {
        var n2 = X2[t];
        return function(e, r2) {
          if (e = xt2(e), r2 = r2 == null ? 0 : nt2(T2(r2), 292), r2 && Us2(e)) {
            var u3 = (U2(e) + "e").split("e"), o2 = n2(u3[0] + "e" + (+u3[1] + r2));
            return u3 = (U2(o2) + "e").split("e"), +(u3[0] + "e" + (+u3[1] - r2));
          }
          return n2(e);
        };
      }
      var sh2 = qn2 && 1 / Re2(new qn2([, -0]))[1] == pn2 ? function(t) {
        return new qn2(t);
      } : Di2;
      function yu2(t) {
        return function(n2) {
          var e = et2(n2);
          return e == Et2 ? Br(n2) : e == yt2 ? Af2(n2) : df2(n2, t(n2));
        };
      }
      function Yt2(t, n2, e, r2, u3, o2, f3, c2) {
        var l2 = n2 & ln2;
        if (!l2 && typeof t != "function") throw new wt2(O3);
        var v3 = r2 ? r2.length : 0;
        if (v3 || (n2 &= -97, r2 = u3 = i2), f3 = f3 === i2 ? f3 : Q2(T2(f3), 0), c2 = c2 === i2 ? c2 : T2(c2), v3 -= u3 ? u3.length : 0, n2 & On2) {
          var _2 = r2, m3 = u3;
          r2 = u3 = i2;
        }
        var C3 = l2 ? i2 : gi2(t), I2 = [t, n2, e, r2, u3, _2, m3, o2, f3, c2];
        if (C3 && Ph(I2, C3), t = I2[0], n2 = I2[1], e = I2[2], r2 = I2[3], u3 = I2[4], c2 = I2[9] = I2[9] === i2 ? l2 ? 0 : t.length : Q2(I2[9] - v3, 0), !c2 && n2 & (Dt2 | Sn2) && (n2 &= -25), !n2 || n2 == vt2) var y3 = eh(t, n2, e);
        else n2 == Dt2 || n2 == Sn2 ? y3 = rh2(t, n2, c2) : (n2 == Nt2 || n2 == (vt2 | Nt2)) && !u3.length ? y3 = ih(t, n2, e, r2) : y3 = Ve.apply(i2, I2);
        var L3 = C3 ? uu2 : qu2;
        return Uu2(L3(y3, I2), t, n2);
      }
      function Su2(t, n2, e, r2) {
        return t === i2 || Rt2(t, $n2[e]) && !W.call(r2, e) ? n2 : t;
      }
      function Ou2(t, n2, e, r2, u3, o2) {
        return K2(t) && K2(n2) && (o2.set(n2, t), Ye2(t, n2, i2, Ou2, o2), o2.delete(n2)), t;
      }
      function uh2(t) {
        return ge2(t) ? i2 : t;
      }
      function Ru2(t, n2, e, r2, u3, o2) {
        var f3 = e & yn2, c2 = t.length, l2 = n2.length;
        if (c2 != l2 && !(f3 && l2 > c2)) return false;
        var v3 = o2.get(t), _2 = o2.get(n2);
        if (v3 && _2) return v3 == n2 && _2 == t;
        var m3 = -1, C3 = true, I2 = e & me2 ? new _n2() : i2;
        for (o2.set(t, n2), o2.set(n2, t); ++m3 < c2; ) {
          var y3 = t[m3], L3 = n2[m3];
          if (r2) var S4 = f3 ? r2(L3, y3, m3, n2, t, o2) : r2(y3, L3, m3, t, n2, o2);
          if (S4 !== i2) {
            if (S4) continue;
            C3 = false;
            break;
          }
          if (I2) {
            if (!$r2(n2, function(D2, $2) {
              if (!ne2(I2, $2) && (y3 === D2 || u3(y3, D2, e, r2, o2))) return I2.push($2);
            })) {
              C3 = false;
              break;
            }
          } else if (!(y3 === L3 || u3(y3, L3, e, r2, o2))) {
            C3 = false;
            break;
          }
        }
        return o2.delete(t), o2.delete(n2), C3;
      }
      function ah2(t, n2, e, r2, u3, o2, f3) {
        switch (e) {
          case bn2:
            if (t.byteLength != n2.byteLength || t.byteOffset != n2.byteOffset) return false;
            t = t.buffer, n2 = n2.buffer;
          case te2:
            return !(t.byteLength != n2.byteLength || !o2(new Ne(t), new Ne(n2)));
          case Zn2:
          case Xn2:
          case Qn2:
            return Rt2(+t, +n2);
          case Ce2:
            return t.name == n2.name && t.message == n2.message;
          case Vn2:
          case kn2:
            return t == n2 + "";
          case Et2:
            var c2 = Br;
          case yt2:
            var l2 = r2 & yn2;
            if (c2 || (c2 = Re2), t.size != n2.size && !l2) return false;
            var v3 = f3.get(t);
            if (v3) return v3 == n2;
            r2 |= me2, f3.set(t, n2);
            var _2 = Ru2(c2(t), c2(n2), r2, u3, o2, f3);
            return f3.delete(t), _2;
          case Ie2:
            if (ue2) return ue2.call(t) == ue2.call(n2);
        }
        return false;
      }
      function oh2(t, n2, e, r2, u3, o2) {
        var f3 = e & yn2, c2 = pi2(t), l2 = c2.length, v3 = pi2(n2), _2 = v3.length;
        if (l2 != _2 && !f3) return false;
        for (var m3 = l2; m3--; ) {
          var C3 = c2[m3];
          if (!(f3 ? C3 in n2 : W.call(n2, C3))) return false;
        }
        var I2 = o2.get(t), y3 = o2.get(n2);
        if (I2 && y3) return I2 == n2 && y3 == t;
        var L3 = true;
        o2.set(t, n2), o2.set(n2, t);
        for (var S4 = f3; ++m3 < l2; ) {
          C3 = c2[m3];
          var D2 = t[C3], $2 = n2[C3];
          if (r2) var dt2 = f3 ? r2($2, D2, C3, n2, t, o2) : r2(D2, $2, C3, t, n2, o2);
          if (!(dt2 === i2 ? D2 === $2 || u3(D2, $2, e, r2, o2) : dt2)) {
            L3 = false;
            break;
          }
          S4 || (S4 = C3 == "constructor");
        }
        if (L3 && !S4) {
          var st2 = t.constructor, gt2 = n2.constructor;
          st2 != gt2 && "constructor" in t && "constructor" in n2 && !(typeof st2 == "function" && st2 instanceof st2 && typeof gt2 == "function" && gt2 instanceof gt2) && (L3 = false);
        }
        return o2.delete(t), o2.delete(n2), L3;
      }
      function Zt2(t) {
        return Ci2(Nu2(t, i2, zu2), t + "");
      }
      function pi2(t) {
        return Xs2(t, V3, _i2);
      }
      function di2(t) {
        return Xs2(t, ot2, bu2);
      }
      var gi2 = Me ? function(t) {
        return Me.get(t);
      } : Di2;
      function nr2(t) {
        for (var n2 = t.name + "", e = Un2[n2], r2 = W.call(Un2, n2) ? e.length : 0; r2--; ) {
          var u3 = e[r2], o2 = u3.func;
          if (o2 == null || o2 == t) return u3.name;
        }
        return n2;
      }
      function Bn2(t) {
        var n2 = W.call(a3, "placeholder") ? a3 : t;
        return n2.placeholder;
      }
      function E2() {
        var t = a3.iteratee || Li2;
        return t = t === Li2 ? ks2 : t, arguments.length ? t(arguments[0], arguments[1]) : t;
      }
      function er2(t, n2) {
        var e = t.__data__;
        return vh2(n2) ? e[typeof n2 == "string" ? "string" : "hash"] : e.map;
      }
      function vi(t) {
        for (var n2 = V3(t), e = n2.length; e--; ) {
          var r2 = n2[e], u3 = t[r2];
          n2[e] = [r2, u3, Hu2(u3)];
        }
        return n2;
      }
      function Pn2(t, n2) {
        var e = wf2(t, n2);
        return Vs2(e) ? e : i2;
      }
      function fh2(t) {
        var n2 = W.call(t, gn2), e = t[gn2];
        try {
          t[gn2] = i2;
          var r2 = true;
        } catch {
        }
        var u3 = He.call(t);
        return r2 && (n2 ? t[gn2] = e : delete t[gn2]), u3;
      }
      var _i2 = zr2 ? function(t) {
        return t == null ? [] : (t = M3(t), en2(zr2(t), function(n2) {
          return $s2.call(t, n2);
        }));
      } : Ni2, bu2 = zr2 ? function(t) {
        for (var n2 = []; t; ) rn2(n2, _i2(t)), t = $e2(t);
        return n2;
      } : Ni2, et2 = rt2;
      (Kr2 && et2(new Kr2(new ArrayBuffer(1))) != bn2 || re2 && et2(new re2()) != Et2 || Jr2 && et2(Jr2.resolve()) != Ji2 || qn2 && et2(new qn2()) != yt2 || ie2 && et2(new ie2()) != jn2) && (et2 = function(t) {
        var n2 = rt2(t), e = n2 == Gt2 ? t.constructor : i2, r2 = e ? Cn2(e) : "";
        if (r2) switch (r2) {
          case Kf2:
            return bn2;
          case Jf2:
            return Et2;
          case Yf:
            return Ji2;
          case Zf2:
            return yt2;
          case Xf2:
            return jn2;
        }
        return n2;
      });
      function ch2(t, n2, e) {
        for (var r2 = -1, u3 = e.length; ++r2 < u3; ) {
          var o2 = e[r2], f3 = o2.size;
          switch (o2.type) {
            case "drop":
              t += f3;
              break;
            case "dropRight":
              n2 -= f3;
              break;
            case "take":
              n2 = nt2(n2, t + f3);
              break;
            case "takeRight":
              t = Q2(t, n2 - f3);
              break;
          }
        }
        return { start: t, end: n2 };
      }
      function hh2(t) {
        var n2 = t.match(vo2);
        return n2 ? n2[1].split(_o2) : [];
      }
      function Tu2(t, n2, e) {
        n2 = fn2(n2, t);
        for (var r2 = -1, u3 = n2.length, o2 = false; ++r2 < u3; ) {
          var f3 = Ft2(n2[r2]);
          if (!(o2 = t != null && e(t, f3))) break;
          t = t[f3];
        }
        return o2 || ++r2 != u3 ? o2 : (u3 = t == null ? 0 : t.length, !!u3 && fr2(u3) && Xt2(f3, u3) && (b2(t) || An(t)));
      }
      function lh2(t) {
        var n2 = t.length, e = new t.constructor(n2);
        return n2 && typeof t[0] == "string" && W.call(t, "index") && (e.index = t.index, e.input = t.input), e;
      }
      function Lu2(t) {
        return typeof t.constructor == "function" && !pe2(t) ? Fn($e2(t)) : {};
      }
      function ph2(t, n2, e) {
        var r2 = t.constructor;
        switch (n2) {
          case te2:
            return ci2(t);
          case Zn2:
          case Xn2:
            return new r2(+t);
          case bn2:
            return Qc(t, e);
          case vr3:
          case _r2:
          case mr2:
          case wr2:
          case Pr2:
          case Cr2:
          case Ar2:
          case Ir2:
          case xr2:
            return du(t, e);
          case Et2:
            return new r2();
          case Qn2:
          case kn2:
            return new r2(t);
          case Vn2:
            return Vc(t);
          case yt2:
            return new r2();
          case Ie2:
            return kc(t);
        }
      }
      function dh2(t, n2) {
        var e = n2.length;
        if (!e) return t;
        var r2 = e - 1;
        return n2[r2] = (e > 1 ? "& " : "") + n2[r2], n2 = n2.join(e > 2 ? ", " : " "), t.replace(go2, `{
/* [wrapped with ` + n2 + `] */
`);
      }
      function gh2(t) {
        return b2(t) || An(t) || !!(qs2 && t && t[qs2]);
      }
      function Xt2(t, n2) {
        var e = typeof t;
        return n2 = n2 ?? nn2, !!n2 && (e == "number" || e != "symbol" && yo2.test(t)) && t > -1 && t % 1 == 0 && t < n2;
      }
      function it2(t, n2, e) {
        if (!K2(e)) return false;
        var r2 = typeof n2;
        return (r2 == "number" ? at2(e) && Xt2(n2, e.length) : r2 == "string" && n2 in e) ? Rt2(e[n2], t) : false;
      }
      function mi(t, n2) {
        if (b2(t)) return false;
        var e = typeof t;
        return e == "number" || e == "symbol" || e == "boolean" || t == null || pt2(t) ? true : co2.test(t) || !fo2.test(t) || n2 != null && t in M3(n2);
      }
      function vh2(t) {
        var n2 = typeof t;
        return n2 == "string" || n2 == "number" || n2 == "symbol" || n2 == "boolean" ? t !== "__proto__" : t === null;
      }
      function wi(t) {
        var n2 = nr2(t), e = a3[n2];
        if (typeof e != "function" || !(n2 in N2.prototype)) return false;
        if (t === e) return true;
        var r2 = gi2(e);
        return !!r2 && t === r2[0];
      }
      function _h(t) {
        return !!Hs2 && Hs2 in t;
      }
      var mh2 = Te2 ? Qt2 : $i2;
      function pe2(t) {
        var n2 = t && t.constructor, e = typeof n2 == "function" && n2.prototype || $n2;
        return t === e;
      }
      function Hu2(t) {
        return t === t && !K2(t);
      }
      function Du2(t, n2) {
        return function(e) {
          return e == null ? false : e[t] === n2 && (n2 !== i2 || t in M3(e));
        };
      }
      function wh2(t) {
        var n2 = ar2(t, function(r2) {
          return e.size === Jn2 && e.clear(), r2;
        }), e = n2.cache;
        return n2;
      }
      function Ph(t, n2) {
        var e = t[1], r2 = n2[1], u3 = e | r2, o2 = u3 < (vt2 | ln2 | Bt2), f3 = r2 == Bt2 && e == Dt2 || r2 == Bt2 && e == Yn2 && t[7].length <= n2[8] || r2 == (Bt2 | Yn2) && n2[7].length <= n2[8] && e == Dt2;
        if (!(o2 || f3)) return t;
        r2 & vt2 && (t[2] = n2[2], u3 |= e & vt2 ? 0 : Gi2);
        var c2 = n2[3];
        if (c2) {
          var l2 = t[3];
          t[3] = l2 ? vu(l2, c2, n2[4]) : c2, t[4] = l2 ? sn2(t[3], xn) : n2[4];
        }
        return c2 = n2[5], c2 && (l2 = t[5], t[5] = l2 ? _u2(l2, c2, n2[6]) : c2, t[6] = l2 ? sn2(t[5], xn) : n2[6]), c2 = n2[7], c2 && (t[7] = c2), r2 & Bt2 && (t[8] = t[8] == null ? n2[8] : nt2(t[8], n2[8])), t[9] == null && (t[9] = n2[9]), t[0] = n2[0], t[1] = u3, t;
      }
      function Ch(t) {
        var n2 = [];
        if (t != null) for (var e in M3(t)) n2.push(e);
        return n2;
      }
      function Ah2(t) {
        return He.call(t);
      }
      function Nu2(t, n2, e) {
        return n2 = Q2(n2 === i2 ? t.length - 1 : n2, 0), function() {
          for (var r2 = arguments, u3 = -1, o2 = Q2(r2.length - n2, 0), f3 = d3(o2); ++u3 < o2; ) f3[u3] = r2[n2 + u3];
          u3 = -1;
          for (var c2 = d3(n2 + 1); ++u3 < n2; ) c2[u3] = r2[u3];
          return c2[n2] = e(f3), ct2(t, this, c2);
        };
      }
      function $u(t, n2) {
        return n2.length < 2 ? t : wn2(t, At2(n2, 0, -1));
      }
      function Ih(t, n2) {
        for (var e = t.length, r2 = nt2(n2.length, e), u3 = ut2(t); r2--; ) {
          var o2 = n2[r2];
          t[r2] = Xt2(o2, e) ? u3[o2] : i2;
        }
        return t;
      }
      function Pi2(t, n2) {
        if (!(n2 === "constructor" && typeof t[n2] == "function") && n2 != "__proto__") return t[n2];
      }
      var qu2 = Fu2(uu2), de2 = Uf2 || function(t, n2) {
        return j2.setTimeout(t, n2);
      }, Ci2 = Fu2(Jc);
      function Uu2(t, n2, e) {
        var r2 = n2 + "";
        return Ci2(t, dh2(r2, xh2(hh2(r2), e)));
      }
      function Fu2(t) {
        var n2 = 0, e = 0;
        return function() {
          var r2 = Bf2(), u3 = Ga2 - (r2 - e);
          if (e = r2, u3 > 0) {
            if (++n2 >= Ba2) return arguments[0];
          } else n2 = 0;
          return t.apply(i2, arguments);
        };
      }
      function rr2(t, n2) {
        var e = -1, r2 = t.length, u3 = r2 - 1;
        for (n2 = n2 === i2 ? r2 : n2; ++e < n2; ) {
          var o2 = ri2(e, u3), f3 = t[o2];
          t[o2] = t[e], t[e] = f3;
        }
        return t.length = n2, t;
      }
      var Wu = wh2(function(t) {
        var n2 = [];
        return t.charCodeAt(0) === 46 && n2.push(""), t.replace(ho2, function(e, r2, u3, o2) {
          n2.push(u3 ? o2.replace(Po2, "$1") : r2 || e);
        }), n2;
      });
      function Ft2(t) {
        if (typeof t == "string" || pt2(t)) return t;
        var n2 = t + "";
        return n2 == "0" && 1 / t == -pn2 ? "-0" : n2;
      }
      function Cn2(t) {
        if (t != null) {
          try {
            return Le2.call(t);
          } catch {
          }
          try {
            return t + "";
          } catch {
          }
        }
        return "";
      }
      function xh2(t, n2) {
        return mt2(Xa2, function(e) {
          var r2 = "_." + e[0];
          n2 & e[1] && !Se2(t, r2) && t.push(r2);
        }), t.sort();
      }
      function Mu2(t) {
        if (t instanceof N2) return t.clone();
        var n2 = new Pt2(t.__wrapped__, t.__chain__);
        return n2.__actions__ = ut2(t.__actions__), n2.__index__ = t.__index__, n2.__values__ = t.__values__, n2;
      }
      function Eh2(t, n2, e) {
        (e ? it2(t, n2, e) : n2 === i2) ? n2 = 1 : n2 = Q2(T2(n2), 0);
        var r2 = t == null ? 0 : t.length;
        if (!r2 || n2 < 1) return [];
        for (var u3 = 0, o2 = 0, f3 = d3(Fe(r2 / n2)); u3 < r2; ) f3[o2++] = At2(t, u3, u3 += n2);
        return f3;
      }
      function yh2(t) {
        for (var n2 = -1, e = t == null ? 0 : t.length, r2 = 0, u3 = []; ++n2 < e; ) {
          var o2 = t[n2];
          o2 && (u3[r2++] = o2);
        }
        return u3;
      }
      function Sh2() {
        var t = arguments.length;
        if (!t) return [];
        for (var n2 = d3(t - 1), e = arguments[0], r2 = t; r2--; ) n2[r2 - 1] = arguments[r2];
        return rn2(b2(e) ? ut2(e) : [e], tt2(n2, 1));
      }
      var Oh = H(function(t, n2) {
        return Y(t) ? oe2(t, tt2(n2, 1, Y, true)) : [];
      }), Rh = H(function(t, n2) {
        var e = It2(n2);
        return Y(e) && (e = i2), Y(t) ? oe2(t, tt2(n2, 1, Y, true), E2(e, 2)) : [];
      }), bh2 = H(function(t, n2) {
        var e = It2(n2);
        return Y(e) && (e = i2), Y(t) ? oe2(t, tt2(n2, 1, Y, true), i2, e) : [];
      });
      function Th(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        return r2 ? (n2 = e || n2 === i2 ? 1 : T2(n2), At2(t, n2 < 0 ? 0 : n2, r2)) : [];
      }
      function Lh(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        return r2 ? (n2 = e || n2 === i2 ? 1 : T2(n2), n2 = r2 - n2, At2(t, 0, n2 < 0 ? 0 : n2)) : [];
      }
      function Hh(t, n2) {
        return t && t.length ? Xe2(t, E2(n2, 3), true, true) : [];
      }
      function Dh(t, n2) {
        return t && t.length ? Xe2(t, E2(n2, 3), true) : [];
      }
      function Nh2(t, n2, e, r2) {
        var u3 = t == null ? 0 : t.length;
        return u3 ? (e && typeof e != "number" && it2(t, n2, e) && (e = 0, r2 = u3), Sc(t, n2, e, r2)) : [];
      }
      function Bu2(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        if (!r2) return -1;
        var u3 = e == null ? 0 : T2(e);
        return u3 < 0 && (u3 = Q2(r2 + u3, 0)), Oe2(t, E2(n2, 3), u3);
      }
      function Gu2(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        if (!r2) return -1;
        var u3 = r2 - 1;
        return e !== i2 && (u3 = T2(e), u3 = e < 0 ? Q2(r2 + u3, 0) : nt2(u3, r2 - 1)), Oe2(t, E2(n2, 3), u3, true);
      }
      function zu2(t) {
        var n2 = t == null ? 0 : t.length;
        return n2 ? tt2(t, 1) : [];
      }
      function $h(t) {
        var n2 = t == null ? 0 : t.length;
        return n2 ? tt2(t, pn2) : [];
      }
      function qh(t, n2) {
        var e = t == null ? 0 : t.length;
        return e ? (n2 = n2 === i2 ? 1 : T2(n2), tt2(t, n2)) : [];
      }
      function Uh(t) {
        for (var n2 = -1, e = t == null ? 0 : t.length, r2 = {}; ++n2 < e; ) {
          var u3 = t[n2];
          r2[u3[0]] = u3[1];
        }
        return r2;
      }
      function Ku2(t) {
        return t && t.length ? t[0] : i2;
      }
      function Fh(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        if (!r2) return -1;
        var u3 = e == null ? 0 : T2(e);
        return u3 < 0 && (u3 = Q2(r2 + u3, 0)), Ln2(t, n2, u3);
      }
      function Wh(t) {
        var n2 = t == null ? 0 : t.length;
        return n2 ? At2(t, 0, -1) : [];
      }
      var Mh2 = H(function(t) {
        var n2 = z3(t, oi2);
        return n2.length && n2[0] === t[0] ? kr2(n2) : [];
      }), Bh = H(function(t) {
        var n2 = It2(t), e = z3(t, oi2);
        return n2 === It2(e) ? n2 = i2 : e.pop(), e.length && e[0] === t[0] ? kr2(e, E2(n2, 2)) : [];
      }), Gh = H(function(t) {
        var n2 = It2(t), e = z3(t, oi2);
        return n2 = typeof n2 == "function" ? n2 : i2, n2 && e.pop(), e.length && e[0] === t[0] ? kr2(e, i2, n2) : [];
      });
      function zh(t, n2) {
        return t == null ? "" : Wf2.call(t, n2);
      }
      function It2(t) {
        var n2 = t == null ? 0 : t.length;
        return n2 ? t[n2 - 1] : i2;
      }
      function Kh2(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        if (!r2) return -1;
        var u3 = r2;
        return e !== i2 && (u3 = T2(e), u3 = u3 < 0 ? Q2(r2 + u3, 0) : nt2(u3, r2 - 1)), n2 === n2 ? xf2(t, n2, u3) : Oe2(t, Es3, u3, true);
      }
      function Jh(t, n2) {
        return t && t.length ? eu2(t, T2(n2)) : i2;
      }
      var Yh = H(Ju2);
      function Ju2(t, n2) {
        return t && t.length && n2 && n2.length ? ei2(t, n2) : t;
      }
      function Zh(t, n2, e) {
        return t && t.length && n2 && n2.length ? ei2(t, n2, E2(e, 2)) : t;
      }
      function Xh(t, n2, e) {
        return t && t.length && n2 && n2.length ? ei2(t, n2, i2, e) : t;
      }
      var Qh = Zt2(function(t, n2) {
        var e = t == null ? 0 : t.length, r2 = Zr2(t, n2);
        return su2(t, z3(n2, function(u3) {
          return Xt2(u3, e) ? +u3 : u3;
        }).sort(gu)), r2;
      });
      function Vh(t, n2) {
        var e = [];
        if (!(t && t.length)) return e;
        var r2 = -1, u3 = [], o2 = t.length;
        for (n2 = E2(n2, 3); ++r2 < o2; ) {
          var f3 = t[r2];
          n2(f3, r2, t) && (e.push(f3), u3.push(r2));
        }
        return su2(t, u3), e;
      }
      function Ai(t) {
        return t == null ? t : zf2.call(t);
      }
      function kh(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        return r2 ? (e && typeof e != "number" && it2(t, n2, e) ? (n2 = 0, e = r2) : (n2 = n2 == null ? 0 : T2(n2), e = e === i2 ? r2 : T2(e)), At2(t, n2, e)) : [];
      }
      function jh(t, n2) {
        return Ze2(t, n2);
      }
      function tl(t, n2, e) {
        return si2(t, n2, E2(e, 2));
      }
      function nl(t, n2) {
        var e = t == null ? 0 : t.length;
        if (e) {
          var r2 = Ze2(t, n2);
          if (r2 < e && Rt2(t[r2], n2)) return r2;
        }
        return -1;
      }
      function el(t, n2) {
        return Ze2(t, n2, true);
      }
      function rl(t, n2, e) {
        return si2(t, n2, E2(e, 2), true);
      }
      function il(t, n2) {
        var e = t == null ? 0 : t.length;
        if (e) {
          var r2 = Ze2(t, n2, true) - 1;
          if (Rt2(t[r2], n2)) return r2;
        }
        return -1;
      }
      function sl(t) {
        return t && t.length ? au2(t) : [];
      }
      function ul(t, n2) {
        return t && t.length ? au2(t, E2(n2, 2)) : [];
      }
      function al(t) {
        var n2 = t == null ? 0 : t.length;
        return n2 ? At2(t, 1, n2) : [];
      }
      function ol(t, n2, e) {
        return t && t.length ? (n2 = e || n2 === i2 ? 1 : T2(n2), At2(t, 0, n2 < 0 ? 0 : n2)) : [];
      }
      function fl(t, n2, e) {
        var r2 = t == null ? 0 : t.length;
        return r2 ? (n2 = e || n2 === i2 ? 1 : T2(n2), n2 = r2 - n2, At2(t, n2 < 0 ? 0 : n2, r2)) : [];
      }
      function cl(t, n2) {
        return t && t.length ? Xe2(t, E2(n2, 3), false, true) : [];
      }
      function hl(t, n2) {
        return t && t.length ? Xe2(t, E2(n2, 3)) : [];
      }
      var ll = H(function(t) {
        return on2(tt2(t, 1, Y, true));
      }), pl = H(function(t) {
        var n2 = It2(t);
        return Y(n2) && (n2 = i2), on2(tt2(t, 1, Y, true), E2(n2, 2));
      }), dl = H(function(t) {
        var n2 = It2(t);
        return n2 = typeof n2 == "function" ? n2 : i2, on2(tt2(t, 1, Y, true), i2, n2);
      });
      function gl(t) {
        return t && t.length ? on2(t) : [];
      }
      function vl(t, n2) {
        return t && t.length ? on2(t, E2(n2, 2)) : [];
      }
      function _l(t, n2) {
        return n2 = typeof n2 == "function" ? n2 : i2, t && t.length ? on2(t, i2, n2) : [];
      }
      function Ii2(t) {
        if (!(t && t.length)) return [];
        var n2 = 0;
        return t = en2(t, function(e) {
          if (Y(e)) return n2 = Q2(e.length, n2), true;
        }), Wr2(n2, function(e) {
          return z3(t, qr2(e));
        });
      }
      function Yu2(t, n2) {
        if (!(t && t.length)) return [];
        var e = Ii2(t);
        return n2 == null ? e : z3(e, function(r2) {
          return ct2(n2, i2, r2);
        });
      }
      var ml = H(function(t, n2) {
        return Y(t) ? oe2(t, n2) : [];
      }), wl = H(function(t) {
        return ai2(en2(t, Y));
      }), Pl = H(function(t) {
        var n2 = It2(t);
        return Y(n2) && (n2 = i2), ai2(en2(t, Y), E2(n2, 2));
      }), Cl = H(function(t) {
        var n2 = It2(t);
        return n2 = typeof n2 == "function" ? n2 : i2, ai2(en2(t, Y), i2, n2);
      }), Al = H(Ii2);
      function Il(t, n2) {
        return hu2(t || [], n2 || [], ae3);
      }
      function xl(t, n2) {
        return hu2(t || [], n2 || [], he2);
      }
      var El = H(function(t) {
        var n2 = t.length, e = n2 > 1 ? t[n2 - 1] : i2;
        return e = typeof e == "function" ? (t.pop(), e) : i2, Yu2(t, e);
      });
      function Zu(t) {
        var n2 = a3(t);
        return n2.__chain__ = true, n2;
      }
      function yl(t, n2) {
        return n2(t), t;
      }
      function ir2(t, n2) {
        return n2(t);
      }
      var Sl = Zt2(function(t) {
        var n2 = t.length, e = n2 ? t[0] : 0, r2 = this.__wrapped__, u3 = function(o2) {
          return Zr2(o2, t);
        };
        return n2 > 1 || this.__actions__.length || !(r2 instanceof N2) || !Xt2(e) ? this.thru(u3) : (r2 = r2.slice(e, +e + (n2 ? 1 : 0)), r2.__actions__.push({ func: ir2, args: [u3], thisArg: i2 }), new Pt2(r2, this.__chain__).thru(function(o2) {
          return n2 && !o2.length && o2.push(i2), o2;
        }));
      });
      function Ol() {
        return Zu(this);
      }
      function Rl() {
        return new Pt2(this.value(), this.__chain__);
      }
      function bl() {
        this.__values__ === i2 && (this.__values__ = oa2(this.value()));
        var t = this.__index__ >= this.__values__.length, n2 = t ? i2 : this.__values__[this.__index__++];
        return { done: t, value: n2 };
      }
      function Tl() {
        return this;
      }
      function Ll(t) {
        for (var n2, e = this; e instanceof Ge; ) {
          var r2 = Mu2(e);
          r2.__index__ = 0, r2.__values__ = i2, n2 ? u3.__wrapped__ = r2 : n2 = r2;
          var u3 = r2;
          e = e.__wrapped__;
        }
        return u3.__wrapped__ = t, n2;
      }
      function Hl() {
        var t = this.__wrapped__;
        if (t instanceof N2) {
          var n2 = t;
          return this.__actions__.length && (n2 = new N2(this)), n2 = n2.reverse(), n2.__actions__.push({ func: ir2, args: [Ai], thisArg: i2 }), new Pt2(n2, this.__chain__);
        }
        return this.thru(Ai);
      }
      function Dl() {
        return cu2(this.__wrapped__, this.__actions__);
      }
      var Nl = Qe2(function(t, n2, e) {
        W.call(t, e) ? ++t[e] : Jt2(t, e, 1);
      });
      function $l(t, n2, e) {
        var r2 = b2(t) ? Is3 : yc;
        return e && it2(t, n2, e) && (n2 = i2), r2(t, E2(n2, 3));
      }
      function ql(t, n2) {
        var e = b2(t) ? en2 : Ys2;
        return e(t, E2(n2, 3));
      }
      var Ul = Cu2(Bu2), Fl = Cu2(Gu2);
      function Wl(t, n2) {
        return tt2(sr2(t, n2), 1);
      }
      function Ml(t, n2) {
        return tt2(sr2(t, n2), pn2);
      }
      function Bl(t, n2, e) {
        return e = e === i2 ? 1 : T2(e), tt2(sr2(t, n2), e);
      }
      function Xu(t, n2) {
        var e = b2(t) ? mt2 : an2;
        return e(t, E2(n2, 3));
      }
      function Qu2(t, n2) {
        var e = b2(t) ? af2 : Js2;
        return e(t, E2(n2, 3));
      }
      var Gl = Qe2(function(t, n2, e) {
        W.call(t, e) ? t[e].push(n2) : Jt2(t, e, [n2]);
      });
      function zl(t, n2, e, r2) {
        t = at2(t) ? t : zn2(t), e = e && !r2 ? T2(e) : 0;
        var u3 = t.length;
        return e < 0 && (e = Q2(u3 + e, 0)), cr2(t) ? e <= u3 && t.indexOf(n2, e) > -1 : !!u3 && Ln2(t, n2, e) > -1;
      }
      var Kl = H(function(t, n2, e) {
        var r2 = -1, u3 = typeof n2 == "function", o2 = at2(t) ? d3(t.length) : [];
        return an2(t, function(f3) {
          o2[++r2] = u3 ? ct2(n2, f3, e) : fe2(f3, n2, e);
        }), o2;
      }), Jl = Qe2(function(t, n2, e) {
        Jt2(t, e, n2);
      });
      function sr2(t, n2) {
        var e = b2(t) ? z3 : js2;
        return e(t, E2(n2, 3));
      }
      function Yl(t, n2, e, r2) {
        return t == null ? [] : (b2(n2) || (n2 = n2 == null ? [] : [n2]), e = r2 ? i2 : e, b2(e) || (e = e == null ? [] : [e]), ru2(t, n2, e));
      }
      var Zl = Qe2(function(t, n2, e) {
        t[e ? 0 : 1].push(n2);
      }, function() {
        return [[], []];
      });
      function Xl(t, n2, e) {
        var r2 = b2(t) ? Nr2 : Ss2, u3 = arguments.length < 3;
        return r2(t, E2(n2, 4), e, u3, an2);
      }
      function Ql(t, n2, e) {
        var r2 = b2(t) ? of2 : Ss2, u3 = arguments.length < 3;
        return r2(t, E2(n2, 4), e, u3, Js2);
      }
      function Vl(t, n2) {
        var e = b2(t) ? en2 : Ys2;
        return e(t, or2(E2(n2, 3)));
      }
      function kl(t) {
        var n2 = b2(t) ? Bs2 : zc;
        return n2(t);
      }
      function jl(t, n2, e) {
        (e ? it2(t, n2, e) : n2 === i2) ? n2 = 1 : n2 = T2(n2);
        var r2 = b2(t) ? Cc : Kc;
        return r2(t, n2);
      }
      function tp(t) {
        var n2 = b2(t) ? Ac : Yc;
        return n2(t);
      }
      function np(t) {
        if (t == null) return 0;
        if (at2(t)) return cr2(t) ? Dn2(t) : t.length;
        var n2 = et2(t);
        return n2 == Et2 || n2 == yt2 ? t.size : ti2(t).length;
      }
      function ep(t, n2, e) {
        var r2 = b2(t) ? $r2 : Zc;
        return e && it2(t, n2, e) && (n2 = i2), r2(t, E2(n2, 3));
      }
      var rp = H(function(t, n2) {
        if (t == null) return [];
        var e = n2.length;
        return e > 1 && it2(t, n2[0], n2[1]) ? n2 = [] : e > 2 && it2(n2[0], n2[1], n2[2]) && (n2 = [n2[0]]), ru2(t, tt2(n2, 1), []);
      }), ur2 = qf2 || function() {
        return j2.Date.now();
      };
      function ip(t, n2) {
        if (typeof n2 != "function") throw new wt2(O3);
        return t = T2(t), function() {
          if (--t < 1) return n2.apply(this, arguments);
        };
      }
      function Vu(t, n2, e) {
        return n2 = e ? i2 : n2, n2 = t && n2 == null ? t.length : n2, Yt2(t, Bt2, i2, i2, i2, i2, n2);
      }
      function ku2(t, n2) {
        var e;
        if (typeof n2 != "function") throw new wt2(O3);
        return t = T2(t), function() {
          return --t > 0 && (e = n2.apply(this, arguments)), t <= 1 && (n2 = i2), e;
        };
      }
      var xi2 = H(function(t, n2, e) {
        var r2 = vt2;
        if (e.length) {
          var u3 = sn2(e, Bn2(xi2));
          r2 |= Nt2;
        }
        return Yt2(t, r2, n2, e, u3);
      }), ju2 = H(function(t, n2, e) {
        var r2 = vt2 | ln2;
        if (e.length) {
          var u3 = sn2(e, Bn2(ju2));
          r2 |= Nt2;
        }
        return Yt2(n2, r2, t, e, u3);
      });
      function ta2(t, n2, e) {
        n2 = e ? i2 : n2;
        var r2 = Yt2(t, Dt2, i2, i2, i2, i2, i2, n2);
        return r2.placeholder = ta2.placeholder, r2;
      }
      function na2(t, n2, e) {
        n2 = e ? i2 : n2;
        var r2 = Yt2(t, Sn2, i2, i2, i2, i2, i2, n2);
        return r2.placeholder = na2.placeholder, r2;
      }
      function ea2(t, n2, e) {
        var r2, u3, o2, f3, c2, l2, v3 = 0, _2 = false, m3 = false, C3 = true;
        if (typeof t != "function") throw new wt2(O3);
        n2 = xt2(n2) || 0, K2(e) && (_2 = !!e.leading, m3 = "maxWait" in e, o2 = m3 ? Q2(xt2(e.maxWait) || 0, n2) : o2, C3 = "trailing" in e ? !!e.trailing : C3);
        function I2(Z2) {
          var bt2 = r2, kt2 = u3;
          return r2 = u3 = i2, v3 = Z2, f3 = t.apply(kt2, bt2), f3;
        }
        function y3(Z2) {
          return v3 = Z2, c2 = de2(D2, n2), _2 ? I2(Z2) : f3;
        }
        function L3(Z2) {
          var bt2 = Z2 - l2, kt2 = Z2 - v3, Ca2 = n2 - bt2;
          return m3 ? nt2(Ca2, o2 - kt2) : Ca2;
        }
        function S4(Z2) {
          var bt2 = Z2 - l2, kt2 = Z2 - v3;
          return l2 === i2 || bt2 >= n2 || bt2 < 0 || m3 && kt2 >= o2;
        }
        function D2() {
          var Z2 = ur2();
          if (S4(Z2)) return $2(Z2);
          c2 = de2(D2, L3(Z2));
        }
        function $2(Z2) {
          return c2 = i2, C3 && r2 ? I2(Z2) : (r2 = u3 = i2, f3);
        }
        function dt2() {
          c2 !== i2 && lu2(c2), v3 = 0, r2 = l2 = u3 = c2 = i2;
        }
        function st2() {
          return c2 === i2 ? f3 : $2(ur2());
        }
        function gt2() {
          var Z2 = ur2(), bt2 = S4(Z2);
          if (r2 = arguments, u3 = this, l2 = Z2, bt2) {
            if (c2 === i2) return y3(l2);
            if (m3) return lu2(c2), c2 = de2(D2, n2), I2(l2);
          }
          return c2 === i2 && (c2 = de2(D2, n2)), f3;
        }
        return gt2.cancel = dt2, gt2.flush = st2, gt2;
      }
      var sp = H(function(t, n2) {
        return Ks2(t, 1, n2);
      }), up = H(function(t, n2, e) {
        return Ks2(t, xt2(n2) || 0, e);
      });
      function ap(t) {
        return Yt2(t, gr2);
      }
      function ar2(t, n2) {
        if (typeof t != "function" || n2 != null && typeof n2 != "function") throw new wt2(O3);
        var e = function() {
          var r2 = arguments, u3 = n2 ? n2.apply(this, r2) : r2[0], o2 = e.cache;
          if (o2.has(u3)) return o2.get(u3);
          var f3 = t.apply(this, r2);
          return e.cache = o2.set(u3, f3) || o2, f3;
        };
        return e.cache = new (ar2.Cache || Kt2)(), e;
      }
      ar2.Cache = Kt2;
      function or2(t) {
        if (typeof t != "function") throw new wt2(O3);
        return function() {
          var n2 = arguments;
          switch (n2.length) {
            case 0:
              return !t.call(this);
            case 1:
              return !t.call(this, n2[0]);
            case 2:
              return !t.call(this, n2[0], n2[1]);
            case 3:
              return !t.call(this, n2[0], n2[1], n2[2]);
          }
          return !t.apply(this, n2);
        };
      }
      function op(t) {
        return ku2(2, t);
      }
      var fp = Xc(function(t, n2) {
        n2 = n2.length == 1 && b2(n2[0]) ? z3(n2[0], ht2(E2())) : z3(tt2(n2, 1), ht2(E2()));
        var e = n2.length;
        return H(function(r2) {
          for (var u3 = -1, o2 = nt2(r2.length, e); ++u3 < o2; ) r2[u3] = n2[u3].call(this, r2[u3]);
          return ct2(t, this, r2);
        });
      }), Ei2 = H(function(t, n2) {
        var e = sn2(n2, Bn2(Ei2));
        return Yt2(t, Nt2, i2, n2, e);
      }), ra2 = H(function(t, n2) {
        var e = sn2(n2, Bn2(ra2));
        return Yt2(t, On2, i2, n2, e);
      }), cp = Zt2(function(t, n2) {
        return Yt2(t, Yn2, i2, i2, i2, n2);
      });
      function hp(t, n2) {
        if (typeof t != "function") throw new wt2(O3);
        return n2 = n2 === i2 ? n2 : T2(n2), H(t, n2);
      }
      function lp(t, n2) {
        if (typeof t != "function") throw new wt2(O3);
        return n2 = n2 == null ? 0 : Q2(T2(n2), 0), H(function(e) {
          var r2 = e[n2], u3 = cn2(e, 0, n2);
          return r2 && rn2(u3, r2), ct2(t, this, u3);
        });
      }
      function pp(t, n2, e) {
        var r2 = true, u3 = true;
        if (typeof t != "function") throw new wt2(O3);
        return K2(e) && (r2 = "leading" in e ? !!e.leading : r2, u3 = "trailing" in e ? !!e.trailing : u3), ea2(t, n2, { leading: r2, maxWait: n2, trailing: u3 });
      }
      function dp(t) {
        return Vu(t, 1);
      }
      function gp(t, n2) {
        return Ei2(fi(n2), t);
      }
      function vp() {
        if (!arguments.length) return [];
        var t = arguments[0];
        return b2(t) ? t : [t];
      }
      function _p(t) {
        return Ct2(t, En2);
      }
      function mp(t, n2) {
        return n2 = typeof n2 == "function" ? n2 : i2, Ct2(t, En2, n2);
      }
      function wp(t) {
        return Ct2(t, Ht2 | En2);
      }
      function Pp(t, n2) {
        return n2 = typeof n2 == "function" ? n2 : i2, Ct2(t, Ht2 | En2, n2);
      }
      function Cp(t, n2) {
        return n2 == null || zs2(t, n2, V3(n2));
      }
      function Rt2(t, n2) {
        return t === n2 || t !== t && n2 !== n2;
      }
      var Ap = tr2(Vr2), Ip = tr2(function(t, n2) {
        return t >= n2;
      }), An = Qs2(/* @__PURE__ */ function() {
        return arguments;
      }()) ? Qs2 : function(t) {
        return J(t) && W.call(t, "callee") && !$s2.call(t, "callee");
      }, b2 = d3.isArray, xp = _s2 ? ht2(_s2) : Lc;
      function at2(t) {
        return t != null && fr2(t.length) && !Qt2(t);
      }
      function Y(t) {
        return J(t) && at2(t);
      }
      function Ep(t) {
        return t === true || t === false || J(t) && rt2(t) == Zn2;
      }
      var hn2 = Ff2 || $i2, yp = ms2 ? ht2(ms2) : Hc;
      function Sp(t) {
        return J(t) && t.nodeType === 1 && !ge2(t);
      }
      function Op(t) {
        if (t == null) return true;
        if (at2(t) && (b2(t) || typeof t == "string" || typeof t.splice == "function" || hn2(t) || Gn2(t) || An(t))) return !t.length;
        var n2 = et2(t);
        if (n2 == Et2 || n2 == yt2) return !t.size;
        if (pe2(t)) return !ti2(t).length;
        for (var e in t) if (W.call(t, e)) return false;
        return true;
      }
      function Rp(t, n2) {
        return ce2(t, n2);
      }
      function bp(t, n2, e) {
        e = typeof e == "function" ? e : i2;
        var r2 = e ? e(t, n2) : i2;
        return r2 === i2 ? ce2(t, n2, i2, e) : !!r2;
      }
      function yi2(t) {
        if (!J(t)) return false;
        var n2 = rt2(t);
        return n2 == Ce2 || n2 == Va2 || typeof t.message == "string" && typeof t.name == "string" && !ge2(t);
      }
      function Tp(t) {
        return typeof t == "number" && Us2(t);
      }
      function Qt2(t) {
        if (!K2(t)) return false;
        var n2 = rt2(t);
        return n2 == Ae2 || n2 == Ki2 || n2 == Qa2 || n2 == ja2;
      }
      function ia2(t) {
        return typeof t == "number" && t == T2(t);
      }
      function fr2(t) {
        return typeof t == "number" && t > -1 && t % 1 == 0 && t <= nn2;
      }
      function K2(t) {
        var n2 = typeof t;
        return t != null && (n2 == "object" || n2 == "function");
      }
      function J(t) {
        return t != null && typeof t == "object";
      }
      var sa2 = ws3 ? ht2(ws3) : Nc;
      function Lp(t, n2) {
        return t === n2 || jr2(t, n2, vi(n2));
      }
      function Hp(t, n2, e) {
        return e = typeof e == "function" ? e : i2, jr2(t, n2, vi(n2), e);
      }
      function Dp(t) {
        return ua2(t) && t != +t;
      }
      function Np(t) {
        if (mh2(t)) throw new R3(x3);
        return Vs2(t);
      }
      function $p(t) {
        return t === null;
      }
      function qp(t) {
        return t == null;
      }
      function ua2(t) {
        return typeof t == "number" || J(t) && rt2(t) == Qn2;
      }
      function ge2(t) {
        if (!J(t) || rt2(t) != Gt2) return false;
        var n2 = $e2(t);
        if (n2 === null) return true;
        var e = W.call(n2, "constructor") && n2.constructor;
        return typeof e == "function" && e instanceof e && Le2.call(e) == Hf2;
      }
      var Si2 = Ps2 ? ht2(Ps2) : $c;
      function Up(t) {
        return ia2(t) && t >= -nn2 && t <= nn2;
      }
      var aa2 = Cs2 ? ht2(Cs2) : qc;
      function cr2(t) {
        return typeof t == "string" || !b2(t) && J(t) && rt2(t) == kn2;
      }
      function pt2(t) {
        return typeof t == "symbol" || J(t) && rt2(t) == Ie2;
      }
      var Gn2 = As2 ? ht2(As2) : Uc;
      function Fp(t) {
        return t === i2;
      }
      function Wp(t) {
        return J(t) && et2(t) == jn2;
      }
      function Mp(t) {
        return J(t) && rt2(t) == no2;
      }
      var Bp = tr2(ni2), Gp = tr2(function(t, n2) {
        return t <= n2;
      });
      function oa2(t) {
        if (!t) return [];
        if (at2(t)) return cr2(t) ? St2(t) : ut2(t);
        if (ee2 && t[ee2]) return Cf2(t[ee2]());
        var n2 = et2(t), e = n2 == Et2 ? Br : n2 == yt2 ? Re2 : zn2;
        return e(t);
      }
      function Vt2(t) {
        if (!t) return t === 0 ? t : 0;
        if (t = xt2(t), t === pn2 || t === -pn2) {
          var n2 = t < 0 ? -1 : 1;
          return n2 * Ja2;
        }
        return t === t ? t : 0;
      }
      function T2(t) {
        var n2 = Vt2(t), e = n2 % 1;
        return n2 === n2 ? e ? n2 - e : n2 : 0;
      }
      function fa2(t) {
        return t ? mn2(T2(t), 0, $t2) : 0;
      }
      function xt2(t) {
        if (typeof t == "number") return t;
        if (pt2(t)) return we2;
        if (K2(t)) {
          var n2 = typeof t.valueOf == "function" ? t.valueOf() : t;
          t = K2(n2) ? n2 + "" : n2;
        }
        if (typeof t != "string") return t === 0 ? t : +t;
        t = Os2(t);
        var e = Io2.test(t);
        return e || Eo2.test(t) ? rf(t.slice(2), e ? 2 : 8) : Ao2.test(t) ? we2 : +t;
      }
      function ca2(t) {
        return Ut3(t, ot2(t));
      }
      function zp(t) {
        return t ? mn2(T2(t), -nn2, nn2) : t === 0 ? t : 0;
      }
      function U2(t) {
        return t == null ? "" : lt2(t);
      }
      var Kp = Wn2(function(t, n2) {
        if (pe2(n2) || at2(n2)) {
          Ut3(n2, V3(n2), t);
          return;
        }
        for (var e in n2) W.call(n2, e) && ae3(t, e, n2[e]);
      }), ha2 = Wn2(function(t, n2) {
        Ut3(n2, ot2(n2), t);
      }), hr2 = Wn2(function(t, n2, e, r2) {
        Ut3(n2, ot2(n2), t, r2);
      }), Jp = Wn2(function(t, n2, e, r2) {
        Ut3(n2, V3(n2), t, r2);
      }), Yp = Zt2(Zr2);
      function Zp(t, n2) {
        var e = Fn(t);
        return n2 == null ? e : Gs2(e, n2);
      }
      var Xp = H(function(t, n2) {
        t = M3(t);
        var e = -1, r2 = n2.length, u3 = r2 > 2 ? n2[2] : i2;
        for (u3 && it2(n2[0], n2[1], u3) && (r2 = 1); ++e < r2; ) for (var o2 = n2[e], f3 = ot2(o2), c2 = -1, l2 = f3.length; ++c2 < l2; ) {
          var v3 = f3[c2], _2 = t[v3];
          (_2 === i2 || Rt2(_2, $n2[v3]) && !W.call(t, v3)) && (t[v3] = o2[v3]);
        }
        return t;
      }), Qp = H(function(t) {
        return t.push(i2, Ou2), ct2(la2, i2, t);
      });
      function Vp(t, n2) {
        return xs2(t, E2(n2, 3), qt2);
      }
      function kp(t, n2) {
        return xs2(t, E2(n2, 3), Qr2);
      }
      function jp(t, n2) {
        return t == null ? t : Xr2(t, E2(n2, 3), ot2);
      }
      function td(t, n2) {
        return t == null ? t : Zs2(t, E2(n2, 3), ot2);
      }
      function nd(t, n2) {
        return t && qt2(t, E2(n2, 3));
      }
      function ed(t, n2) {
        return t && Qr2(t, E2(n2, 3));
      }
      function rd(t) {
        return t == null ? [] : Je2(t, V3(t));
      }
      function id(t) {
        return t == null ? [] : Je2(t, ot2(t));
      }
      function Oi2(t, n2, e) {
        var r2 = t == null ? i2 : wn2(t, n2);
        return r2 === i2 ? e : r2;
      }
      function sd(t, n2) {
        return t != null && Tu2(t, n2, Oc);
      }
      function Ri2(t, n2) {
        return t != null && Tu2(t, n2, Rc);
      }
      var ud = Iu2(function(t, n2, e) {
        n2 != null && typeof n2.toString != "function" && (n2 = He.call(n2)), t[n2] = e;
      }, Ti2(ft2)), ad = Iu2(function(t, n2, e) {
        n2 != null && typeof n2.toString != "function" && (n2 = He.call(n2)), W.call(t, n2) ? t[n2].push(e) : t[n2] = [e];
      }, E2), od = H(fe2);
      function V3(t) {
        return at2(t) ? Ms2(t) : ti2(t);
      }
      function ot2(t) {
        return at2(t) ? Ms2(t, true) : Fc(t);
      }
      function fd(t, n2) {
        var e = {};
        return n2 = E2(n2, 3), qt2(t, function(r2, u3, o2) {
          Jt2(e, n2(r2, u3, o2), r2);
        }), e;
      }
      function cd(t, n2) {
        var e = {};
        return n2 = E2(n2, 3), qt2(t, function(r2, u3, o2) {
          Jt2(e, u3, n2(r2, u3, o2));
        }), e;
      }
      var hd = Wn2(function(t, n2, e) {
        Ye2(t, n2, e);
      }), la2 = Wn2(function(t, n2, e, r2) {
        Ye2(t, n2, e, r2);
      }), ld = Zt2(function(t, n2) {
        var e = {};
        if (t == null) return e;
        var r2 = false;
        n2 = z3(n2, function(o2) {
          return o2 = fn2(o2, t), r2 || (r2 = o2.length > 1), o2;
        }), Ut3(t, di2(t), e), r2 && (e = Ct2(e, Ht2 | Mt2 | En2, uh2));
        for (var u3 = n2.length; u3--; ) ui2(e, n2[u3]);
        return e;
      });
      function pd(t, n2) {
        return pa2(t, or2(E2(n2)));
      }
      var dd = Zt2(function(t, n2) {
        return t == null ? {} : Mc(t, n2);
      });
      function pa2(t, n2) {
        if (t == null) return {};
        var e = z3(di2(t), function(r2) {
          return [r2];
        });
        return n2 = E2(n2), iu2(t, e, function(r2, u3) {
          return n2(r2, u3[0]);
        });
      }
      function gd(t, n2, e) {
        n2 = fn2(n2, t);
        var r2 = -1, u3 = n2.length;
        for (u3 || (u3 = 1, t = i2); ++r2 < u3; ) {
          var o2 = t == null ? i2 : t[Ft2(n2[r2])];
          o2 === i2 && (r2 = u3, o2 = e), t = Qt2(o2) ? o2.call(t) : o2;
        }
        return t;
      }
      function vd(t, n2, e) {
        return t == null ? t : he2(t, n2, e);
      }
      function _d(t, n2, e, r2) {
        return r2 = typeof r2 == "function" ? r2 : i2, t == null ? t : he2(t, n2, e, r2);
      }
      var da2 = yu2(V3), ga2 = yu2(ot2);
      function md(t, n2, e) {
        var r2 = b2(t), u3 = r2 || hn2(t) || Gn2(t);
        if (n2 = E2(n2, 4), e == null) {
          var o2 = t && t.constructor;
          u3 ? e = r2 ? new o2() : [] : K2(t) ? e = Qt2(o2) ? Fn($e2(t)) : {} : e = {};
        }
        return (u3 ? mt2 : qt2)(t, function(f3, c2, l2) {
          return n2(e, f3, c2, l2);
        }), e;
      }
      function wd(t, n2) {
        return t == null ? true : ui2(t, n2);
      }
      function Pd(t, n2, e) {
        return t == null ? t : fu2(t, n2, fi(e));
      }
      function Cd(t, n2, e, r2) {
        return r2 = typeof r2 == "function" ? r2 : i2, t == null ? t : fu2(t, n2, fi(e), r2);
      }
      function zn2(t) {
        return t == null ? [] : Mr2(t, V3(t));
      }
      function Ad(t) {
        return t == null ? [] : Mr2(t, ot2(t));
      }
      function Id(t, n2, e) {
        return e === i2 && (e = n2, n2 = i2), e !== i2 && (e = xt2(e), e = e === e ? e : 0), n2 !== i2 && (n2 = xt2(n2), n2 = n2 === n2 ? n2 : 0), mn2(xt2(t), n2, e);
      }
      function xd(t, n2, e) {
        return n2 = Vt2(n2), e === i2 ? (e = n2, n2 = 0) : e = Vt2(e), t = xt2(t), bc(t, n2, e);
      }
      function Ed(t, n2, e) {
        if (e && typeof e != "boolean" && it2(t, n2, e) && (n2 = e = i2), e === i2 && (typeof n2 == "boolean" ? (e = n2, n2 = i2) : typeof t == "boolean" && (e = t, t = i2)), t === i2 && n2 === i2 ? (t = 0, n2 = 1) : (t = Vt2(t), n2 === i2 ? (n2 = t, t = 0) : n2 = Vt2(n2)), t > n2) {
          var r2 = t;
          t = n2, n2 = r2;
        }
        if (e || t % 1 || n2 % 1) {
          var u3 = Fs2();
          return nt2(t + u3 * (n2 - t + ef2("1e-" + ((u3 + "").length - 1))), n2);
        }
        return ri2(t, n2);
      }
      var yd = Mn2(function(t, n2, e) {
        return n2 = n2.toLowerCase(), t + (e ? va2(n2) : n2);
      });
      function va2(t) {
        return bi2(U2(t).toLowerCase());
      }
      function _a2(t) {
        return t = U2(t), t && t.replace(So2, vf2).replace(Jo2, "");
      }
      function Sd(t, n2, e) {
        t = U2(t), n2 = lt2(n2);
        var r2 = t.length;
        e = e === i2 ? r2 : mn2(T2(e), 0, r2);
        var u3 = e;
        return e -= n2.length, e >= 0 && t.slice(e, u3) == n2;
      }
      function Od(t) {
        return t = U2(t), t && uo2.test(t) ? t.replace(Zi2, _f2) : t;
      }
      function Rd(t) {
        return t = U2(t), t && lo.test(t) ? t.replace(Er2, "\\$&") : t;
      }
      var bd = Mn2(function(t, n2, e) {
        return t + (e ? "-" : "") + n2.toLowerCase();
      }), Td = Mn2(function(t, n2, e) {
        return t + (e ? " " : "") + n2.toLowerCase();
      }), Ld = Pu2("toLowerCase");
      function Hd(t, n2, e) {
        t = U2(t), n2 = T2(n2);
        var r2 = n2 ? Dn2(t) : 0;
        if (!n2 || r2 >= n2) return t;
        var u3 = (n2 - r2) / 2;
        return je(We2(u3), e) + t + je(Fe(u3), e);
      }
      function Dd(t, n2, e) {
        t = U2(t), n2 = T2(n2);
        var r2 = n2 ? Dn2(t) : 0;
        return n2 && r2 < n2 ? t + je(n2 - r2, e) : t;
      }
      function Nd(t, n2, e) {
        t = U2(t), n2 = T2(n2);
        var r2 = n2 ? Dn2(t) : 0;
        return n2 && r2 < n2 ? je(n2 - r2, e) + t : t;
      }
      function $d(t, n2, e) {
        return e || n2 == null ? n2 = 0 : n2 && (n2 = +n2), Gf(U2(t).replace(yr2, ""), n2 || 0);
      }
      function qd(t, n2, e) {
        return (e ? it2(t, n2, e) : n2 === i2) ? n2 = 1 : n2 = T2(n2), ii2(U2(t), n2);
      }
      function Ud() {
        var t = arguments, n2 = U2(t[0]);
        return t.length < 3 ? n2 : n2.replace(t[1], t[2]);
      }
      var Fd = Mn2(function(t, n2, e) {
        return t + (e ? "_" : "") + n2.toLowerCase();
      });
      function Wd(t, n2, e) {
        return e && typeof e != "number" && it2(t, n2, e) && (n2 = e = i2), e = e === i2 ? $t2 : e >>> 0, e ? (t = U2(t), t && (typeof n2 == "string" || n2 != null && !Si2(n2)) && (n2 = lt2(n2), !n2 && Hn2(t)) ? cn2(St2(t), 0, e) : t.split(n2, e)) : [];
      }
      var Md = Mn2(function(t, n2, e) {
        return t + (e ? " " : "") + bi2(n2);
      });
      function Bd(t, n2, e) {
        return t = U2(t), e = e == null ? 0 : mn2(T2(e), 0, t.length), n2 = lt2(n2), t.slice(e, e + n2.length) == n2;
      }
      function Gd(t, n2, e) {
        var r2 = a3.templateSettings;
        e && it2(t, n2, e) && (n2 = i2), t = U2(t), n2 = hr2({}, n2, r2, Su2);
        var u3 = hr2({}, n2.imports, r2.imports, Su2), o2 = V3(u3), f3 = Mr2(u3, o2), c2, l2, v3 = 0, _2 = n2.interpolate || xe2, m3 = "__p += '", C3 = Gr2((n2.escape || xe2).source + "|" + _2.source + "|" + (_2 === Xi2 ? Co2 : xe2).source + "|" + (n2.evaluate || xe2).source + "|$", "g"), I2 = "//# sourceURL=" + (W.call(n2, "sourceURL") ? (n2.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Vo2 + "]") + `
`;
        t.replace(C3, function(S4, D2, $2, dt2, st2, gt2) {
          return $2 || ($2 = dt2), m3 += t.slice(v3, gt2).replace(Oo2, mf2), D2 && (c2 = true, m3 += `' +
__e(` + D2 + `) +
'`), st2 && (l2 = true, m3 += `';
` + st2 + `;
__p += '`), $2 && (m3 += `' +
((__t = (` + $2 + `)) == null ? '' : __t) +
'`), v3 = gt2 + S4.length, S4;
        }), m3 += `';
`;
        var y3 = W.call(n2, "variable") && n2.variable;
        if (!y3) m3 = `with (obj) {
` + m3 + `
}
`;
        else if (wo2.test(y3)) throw new R3(k2);
        m3 = (l2 ? m3.replace(eo, "") : m3).replace(ro2, "$1").replace(io2, "$1;"), m3 = "function(" + (y3 || "obj") + `) {
` + (y3 ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (c2 ? ", __e = _.escape" : "") + (l2 ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + m3 + `return __p
}`;
        var L3 = wa2(function() {
          return q2(o2, I2 + "return " + m3).apply(i2, f3);
        });
        if (L3.source = m3, yi2(L3)) throw L3;
        return L3;
      }
      function zd(t) {
        return U2(t).toLowerCase();
      }
      function Kd(t) {
        return U2(t).toUpperCase();
      }
      function Jd(t, n2, e) {
        if (t = U2(t), t && (e || n2 === i2)) return Os2(t);
        if (!t || !(n2 = lt2(n2))) return t;
        var r2 = St2(t), u3 = St2(n2), o2 = Rs2(r2, u3), f3 = bs2(r2, u3) + 1;
        return cn2(r2, o2, f3).join("");
      }
      function Yd(t, n2, e) {
        if (t = U2(t), t && (e || n2 === i2)) return t.slice(0, Ls2(t) + 1);
        if (!t || !(n2 = lt2(n2))) return t;
        var r2 = St2(t), u3 = bs2(r2, St2(n2)) + 1;
        return cn2(r2, 0, u3).join("");
      }
      function Zd(t, n2, e) {
        if (t = U2(t), t && (e || n2 === i2)) return t.replace(yr2, "");
        if (!t || !(n2 = lt2(n2))) return t;
        var r2 = St2(t), u3 = Rs2(r2, St2(n2));
        return cn2(r2, u3).join("");
      }
      function Xd(t, n2) {
        var e = Wa2, r2 = Ma2;
        if (K2(n2)) {
          var u3 = "separator" in n2 ? n2.separator : u3;
          e = "length" in n2 ? T2(n2.length) : e, r2 = "omission" in n2 ? lt2(n2.omission) : r2;
        }
        t = U2(t);
        var o2 = t.length;
        if (Hn2(t)) {
          var f3 = St2(t);
          o2 = f3.length;
        }
        if (e >= o2) return t;
        var c2 = e - Dn2(r2);
        if (c2 < 1) return r2;
        var l2 = f3 ? cn2(f3, 0, c2).join("") : t.slice(0, c2);
        if (u3 === i2) return l2 + r2;
        if (f3 && (c2 += l2.length - c2), Si2(u3)) {
          if (t.slice(c2).search(u3)) {
            var v3, _2 = l2;
            for (u3.global || (u3 = Gr2(u3.source, U2(Qi2.exec(u3)) + "g")), u3.lastIndex = 0; v3 = u3.exec(_2); ) var m3 = v3.index;
            l2 = l2.slice(0, m3 === i2 ? c2 : m3);
          }
        } else if (t.indexOf(lt2(u3), c2) != c2) {
          var C3 = l2.lastIndexOf(u3);
          C3 > -1 && (l2 = l2.slice(0, C3));
        }
        return l2 + r2;
      }
      function Qd(t) {
        return t = U2(t), t && so2.test(t) ? t.replace(Yi2, Ef2) : t;
      }
      var Vd = Mn2(function(t, n2, e) {
        return t + (e ? " " : "") + n2.toUpperCase();
      }), bi2 = Pu2("toUpperCase");
      function ma2(t, n2, e) {
        return t = U2(t), n2 = e ? i2 : n2, n2 === i2 ? Pf2(t) ? Of2(t) : hf2(t) : t.match(n2) || [];
      }
      var wa2 = H(function(t, n2) {
        try {
          return ct2(t, i2, n2);
        } catch (e) {
          return yi2(e) ? e : new R3(e);
        }
      }), kd = Zt2(function(t, n2) {
        return mt2(n2, function(e) {
          e = Ft2(e), Jt2(t, e, xi2(t[e], t));
        }), t;
      });
      function jd(t) {
        var n2 = t == null ? 0 : t.length, e = E2();
        return t = n2 ? z3(t, function(r2) {
          if (typeof r2[1] != "function") throw new wt2(O3);
          return [e(r2[0]), r2[1]];
        }) : [], H(function(r2) {
          for (var u3 = -1; ++u3 < n2; ) {
            var o2 = t[u3];
            if (ct2(o2[0], this, r2)) return ct2(o2[1], this, r2);
          }
        });
      }
      function tg(t) {
        return Ec(Ct2(t, Ht2));
      }
      function Ti2(t) {
        return function() {
          return t;
        };
      }
      function ng(t, n2) {
        return t == null || t !== t ? n2 : t;
      }
      var eg = Au2(), rg = Au2(true);
      function ft2(t) {
        return t;
      }
      function Li2(t) {
        return ks2(typeof t == "function" ? t : Ct2(t, Ht2));
      }
      function ig(t) {
        return tu(Ct2(t, Ht2));
      }
      function sg(t, n2) {
        return nu2(t, Ct2(n2, Ht2));
      }
      var ug = H(function(t, n2) {
        return function(e) {
          return fe2(e, t, n2);
        };
      }), ag = H(function(t, n2) {
        return function(e) {
          return fe2(t, e, n2);
        };
      });
      function Hi2(t, n2, e) {
        var r2 = V3(n2), u3 = Je2(n2, r2);
        e == null && !(K2(n2) && (u3.length || !r2.length)) && (e = n2, n2 = t, t = this, u3 = Je2(n2, V3(n2)));
        var o2 = !(K2(e) && "chain" in e) || !!e.chain, f3 = Qt2(t);
        return mt2(u3, function(c2) {
          var l2 = n2[c2];
          t[c2] = l2, f3 && (t.prototype[c2] = function() {
            var v3 = this.__chain__;
            if (o2 || v3) {
              var _2 = t(this.__wrapped__), m3 = _2.__actions__ = ut2(this.__actions__);
              return m3.push({ func: l2, args: arguments, thisArg: t }), _2.__chain__ = v3, _2;
            }
            return l2.apply(t, rn2([this.value()], arguments));
          });
        }), t;
      }
      function og() {
        return j2._ === this && (j2._ = Df2), this;
      }
      function Di2() {
      }
      function fg(t) {
        return t = T2(t), H(function(n2) {
          return eu2(n2, t);
        });
      }
      var cg = hi2(z3), hg = hi2(Is3), lg = hi2($r2);
      function Pa2(t) {
        return mi(t) ? qr2(Ft2(t)) : Bc(t);
      }
      function pg(t) {
        return function(n2) {
          return t == null ? i2 : wn2(t, n2);
        };
      }
      var dg = xu2(), gg = xu2(true);
      function Ni2() {
        return [];
      }
      function $i2() {
        return false;
      }
      function vg() {
        return {};
      }
      function _g() {
        return "";
      }
      function mg() {
        return true;
      }
      function wg(t, n2) {
        if (t = T2(t), t < 1 || t > nn2) return [];
        var e = $t2, r2 = nt2(t, $t2);
        n2 = E2(n2), t -= $t2;
        for (var u3 = Wr2(r2, n2); ++e < t; ) n2(e);
        return u3;
      }
      function Pg(t) {
        return b2(t) ? z3(t, Ft2) : pt2(t) ? [t] : ut2(Wu(U2(t)));
      }
      function Cg(t) {
        var n2 = ++Lf2;
        return U2(t) + n2;
      }
      var Ag = ke(function(t, n2) {
        return t + n2;
      }, 0), Ig = li2("ceil"), xg = ke(function(t, n2) {
        return t / n2;
      }, 1), Eg = li2("floor");
      function yg(t) {
        return t && t.length ? Ke(t, ft2, Vr2) : i2;
      }
      function Sg(t, n2) {
        return t && t.length ? Ke(t, E2(n2, 2), Vr2) : i2;
      }
      function Og(t) {
        return ys2(t, ft2);
      }
      function Rg(t, n2) {
        return ys2(t, E2(n2, 2));
      }
      function bg(t) {
        return t && t.length ? Ke(t, ft2, ni2) : i2;
      }
      function Tg(t, n2) {
        return t && t.length ? Ke(t, E2(n2, 2), ni2) : i2;
      }
      var Lg = ke(function(t, n2) {
        return t * n2;
      }, 1), Hg = li2("round"), Dg = ke(function(t, n2) {
        return t - n2;
      }, 0);
      function Ng(t) {
        return t && t.length ? Fr2(t, ft2) : 0;
      }
      function $g(t, n2) {
        return t && t.length ? Fr2(t, E2(n2, 2)) : 0;
      }
      return a3.after = ip, a3.ary = Vu, a3.assign = Kp, a3.assignIn = ha2, a3.assignInWith = hr2, a3.assignWith = Jp, a3.at = Yp, a3.before = ku2, a3.bind = xi2, a3.bindAll = kd, a3.bindKey = ju2, a3.castArray = vp, a3.chain = Zu, a3.chunk = Eh2, a3.compact = yh2, a3.concat = Sh2, a3.cond = jd, a3.conforms = tg, a3.constant = Ti2, a3.countBy = Nl, a3.create = Zp, a3.curry = ta2, a3.curryRight = na2, a3.debounce = ea2, a3.defaults = Xp, a3.defaultsDeep = Qp, a3.defer = sp, a3.delay = up, a3.difference = Oh, a3.differenceBy = Rh, a3.differenceWith = bh2, a3.drop = Th, a3.dropRight = Lh, a3.dropRightWhile = Hh, a3.dropWhile = Dh, a3.fill = Nh2, a3.filter = ql, a3.flatMap = Wl, a3.flatMapDeep = Ml, a3.flatMapDepth = Bl, a3.flatten = zu2, a3.flattenDeep = $h, a3.flattenDepth = qh, a3.flip = ap, a3.flow = eg, a3.flowRight = rg, a3.fromPairs = Uh, a3.functions = rd, a3.functionsIn = id, a3.groupBy = Gl, a3.initial = Wh, a3.intersection = Mh2, a3.intersectionBy = Bh, a3.intersectionWith = Gh, a3.invert = ud, a3.invertBy = ad, a3.invokeMap = Kl, a3.iteratee = Li2, a3.keyBy = Jl, a3.keys = V3, a3.keysIn = ot2, a3.map = sr2, a3.mapKeys = fd, a3.mapValues = cd, a3.matches = ig, a3.matchesProperty = sg, a3.memoize = ar2, a3.merge = hd, a3.mergeWith = la2, a3.method = ug, a3.methodOf = ag, a3.mixin = Hi2, a3.negate = or2, a3.nthArg = fg, a3.omit = ld, a3.omitBy = pd, a3.once = op, a3.orderBy = Yl, a3.over = cg, a3.overArgs = fp, a3.overEvery = hg, a3.overSome = lg, a3.partial = Ei2, a3.partialRight = ra2, a3.partition = Zl, a3.pick = dd, a3.pickBy = pa2, a3.property = Pa2, a3.propertyOf = pg, a3.pull = Yh, a3.pullAll = Ju2, a3.pullAllBy = Zh, a3.pullAllWith = Xh, a3.pullAt = Qh, a3.range = dg, a3.rangeRight = gg, a3.rearg = cp, a3.reject = Vl, a3.remove = Vh, a3.rest = hp, a3.reverse = Ai, a3.sampleSize = jl, a3.set = vd, a3.setWith = _d, a3.shuffle = tp, a3.slice = kh, a3.sortBy = rp, a3.sortedUniq = sl, a3.sortedUniqBy = ul, a3.split = Wd, a3.spread = lp, a3.tail = al, a3.take = ol, a3.takeRight = fl, a3.takeRightWhile = cl, a3.takeWhile = hl, a3.tap = yl, a3.throttle = pp, a3.thru = ir2, a3.toArray = oa2, a3.toPairs = da2, a3.toPairsIn = ga2, a3.toPath = Pg, a3.toPlainObject = ca2, a3.transform = md, a3.unary = dp, a3.union = ll, a3.unionBy = pl, a3.unionWith = dl, a3.uniq = gl, a3.uniqBy = vl, a3.uniqWith = _l, a3.unset = wd, a3.unzip = Ii2, a3.unzipWith = Yu2, a3.update = Pd, a3.updateWith = Cd, a3.values = zn2, a3.valuesIn = Ad, a3.without = ml, a3.words = ma2, a3.wrap = gp, a3.xor = wl, a3.xorBy = Pl, a3.xorWith = Cl, a3.zip = Al, a3.zipObject = Il, a3.zipObjectDeep = xl, a3.zipWith = El, a3.entries = da2, a3.entriesIn = ga2, a3.extend = ha2, a3.extendWith = hr2, Hi2(a3, a3), a3.add = Ag, a3.attempt = wa2, a3.camelCase = yd, a3.capitalize = va2, a3.ceil = Ig, a3.clamp = Id, a3.clone = _p, a3.cloneDeep = wp, a3.cloneDeepWith = Pp, a3.cloneWith = mp, a3.conformsTo = Cp, a3.deburr = _a2, a3.defaultTo = ng, a3.divide = xg, a3.endsWith = Sd, a3.eq = Rt2, a3.escape = Od, a3.escapeRegExp = Rd, a3.every = $l, a3.find = Ul, a3.findIndex = Bu2, a3.findKey = Vp, a3.findLast = Fl, a3.findLastIndex = Gu2, a3.findLastKey = kp, a3.floor = Eg, a3.forEach = Xu, a3.forEachRight = Qu2, a3.forIn = jp, a3.forInRight = td, a3.forOwn = nd, a3.forOwnRight = ed, a3.get = Oi2, a3.gt = Ap, a3.gte = Ip, a3.has = sd, a3.hasIn = Ri2, a3.head = Ku2, a3.identity = ft2, a3.includes = zl, a3.indexOf = Fh, a3.inRange = xd, a3.invoke = od, a3.isArguments = An, a3.isArray = b2, a3.isArrayBuffer = xp, a3.isArrayLike = at2, a3.isArrayLikeObject = Y, a3.isBoolean = Ep, a3.isBuffer = hn2, a3.isDate = yp, a3.isElement = Sp, a3.isEmpty = Op, a3.isEqual = Rp, a3.isEqualWith = bp, a3.isError = yi2, a3.isFinite = Tp, a3.isFunction = Qt2, a3.isInteger = ia2, a3.isLength = fr2, a3.isMap = sa2, a3.isMatch = Lp, a3.isMatchWith = Hp, a3.isNaN = Dp, a3.isNative = Np, a3.isNil = qp, a3.isNull = $p, a3.isNumber = ua2, a3.isObject = K2, a3.isObjectLike = J, a3.isPlainObject = ge2, a3.isRegExp = Si2, a3.isSafeInteger = Up, a3.isSet = aa2, a3.isString = cr2, a3.isSymbol = pt2, a3.isTypedArray = Gn2, a3.isUndefined = Fp, a3.isWeakMap = Wp, a3.isWeakSet = Mp, a3.join = zh, a3.kebabCase = bd, a3.last = It2, a3.lastIndexOf = Kh2, a3.lowerCase = Td, a3.lowerFirst = Ld, a3.lt = Bp, a3.lte = Gp, a3.max = yg, a3.maxBy = Sg, a3.mean = Og, a3.meanBy = Rg, a3.min = bg, a3.minBy = Tg, a3.stubArray = Ni2, a3.stubFalse = $i2, a3.stubObject = vg, a3.stubString = _g, a3.stubTrue = mg, a3.multiply = Lg, a3.nth = Jh, a3.noConflict = og, a3.noop = Di2, a3.now = ur2, a3.pad = Hd, a3.padEnd = Dd, a3.padStart = Nd, a3.parseInt = $d, a3.random = Ed, a3.reduce = Xl, a3.reduceRight = Ql, a3.repeat = qd, a3.replace = Ud, a3.result = gd, a3.round = Hg, a3.runInContext = h3, a3.sample = kl, a3.size = np, a3.snakeCase = Fd, a3.some = ep, a3.sortedIndex = jh, a3.sortedIndexBy = tl, a3.sortedIndexOf = nl, a3.sortedLastIndex = el, a3.sortedLastIndexBy = rl, a3.sortedLastIndexOf = il, a3.startCase = Md, a3.startsWith = Bd, a3.subtract = Dg, a3.sum = Ng, a3.sumBy = $g, a3.template = Gd, a3.times = wg, a3.toFinite = Vt2, a3.toInteger = T2, a3.toLength = fa2, a3.toLower = zd, a3.toNumber = xt2, a3.toSafeInteger = zp, a3.toString = U2, a3.toUpper = Kd, a3.trim = Jd, a3.trimEnd = Yd, a3.trimStart = Zd, a3.truncate = Xd, a3.unescape = Qd, a3.uniqueId = Cg, a3.upperCase = Vd, a3.upperFirst = bi2, a3.each = Xu, a3.eachRight = Qu2, a3.first = Ku2, Hi2(a3, function() {
        var t = {};
        return qt2(a3, function(n2, e) {
          W.call(a3.prototype, e) || (t[e] = n2);
        }), t;
      }(), { chain: false }), a3.VERSION = p3, mt2(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t) {
        a3[t].placeholder = a3;
      }), mt2(["drop", "take"], function(t, n2) {
        N2.prototype[t] = function(e) {
          e = e === i2 ? 1 : Q2(T2(e), 0);
          var r2 = this.__filtered__ && !n2 ? new N2(this) : this.clone();
          return r2.__filtered__ ? r2.__takeCount__ = nt2(e, r2.__takeCount__) : r2.__views__.push({ size: nt2(e, $t2), type: t + (r2.__dir__ < 0 ? "Right" : "") }), r2;
        }, N2.prototype[t + "Right"] = function(e) {
          return this.reverse()[t](e).reverse();
        };
      }), mt2(["filter", "map", "takeWhile"], function(t, n2) {
        var e = n2 + 1, r2 = e == zi2 || e == Ka2;
        N2.prototype[t] = function(u3) {
          var o2 = this.clone();
          return o2.__iteratees__.push({ iteratee: E2(u3, 3), type: e }), o2.__filtered__ = o2.__filtered__ || r2, o2;
        };
      }), mt2(["head", "last"], function(t, n2) {
        var e = "take" + (n2 ? "Right" : "");
        N2.prototype[t] = function() {
          return this[e](1).value()[0];
        };
      }), mt2(["initial", "tail"], function(t, n2) {
        var e = "drop" + (n2 ? "" : "Right");
        N2.prototype[t] = function() {
          return this.__filtered__ ? new N2(this) : this[e](1);
        };
      }), N2.prototype.compact = function() {
        return this.filter(ft2);
      }, N2.prototype.find = function(t) {
        return this.filter(t).head();
      }, N2.prototype.findLast = function(t) {
        return this.reverse().find(t);
      }, N2.prototype.invokeMap = H(function(t, n2) {
        return typeof t == "function" ? new N2(this) : this.map(function(e) {
          return fe2(e, t, n2);
        });
      }), N2.prototype.reject = function(t) {
        return this.filter(or2(E2(t)));
      }, N2.prototype.slice = function(t, n2) {
        t = T2(t);
        var e = this;
        return e.__filtered__ && (t > 0 || n2 < 0) ? new N2(e) : (t < 0 ? e = e.takeRight(-t) : t && (e = e.drop(t)), n2 !== i2 && (n2 = T2(n2), e = n2 < 0 ? e.dropRight(-n2) : e.take(n2 - t)), e);
      }, N2.prototype.takeRightWhile = function(t) {
        return this.reverse().takeWhile(t).reverse();
      }, N2.prototype.toArray = function() {
        return this.take($t2);
      }, qt2(N2.prototype, function(t, n2) {
        var e = /^(?:filter|find|map|reject)|While$/.test(n2), r2 = /^(?:head|last)$/.test(n2), u3 = a3[r2 ? "take" + (n2 == "last" ? "Right" : "") : n2], o2 = r2 || /^find/.test(n2);
        u3 && (a3.prototype[n2] = function() {
          var f3 = this.__wrapped__, c2 = r2 ? [1] : arguments, l2 = f3 instanceof N2, v3 = c2[0], _2 = l2 || b2(f3), m3 = function(D2) {
            var $2 = u3.apply(a3, rn2([D2], c2));
            return r2 && C3 ? $2[0] : $2;
          };
          _2 && e && typeof v3 == "function" && v3.length != 1 && (l2 = _2 = false);
          var C3 = this.__chain__, I2 = !!this.__actions__.length, y3 = o2 && !C3, L3 = l2 && !I2;
          if (!o2 && _2) {
            f3 = L3 ? f3 : new N2(this);
            var S4 = t.apply(f3, c2);
            return S4.__actions__.push({ func: ir2, args: [m3], thisArg: i2 }), new Pt2(S4, C3);
          }
          return y3 && L3 ? t.apply(this, c2) : (S4 = this.thru(m3), y3 ? r2 ? S4.value()[0] : S4.value() : S4);
        });
      }), mt2(["pop", "push", "shift", "sort", "splice", "unshift"], function(t) {
        var n2 = be2[t], e = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru", r2 = /^(?:pop|shift)$/.test(t);
        a3.prototype[t] = function() {
          var u3 = arguments;
          if (r2 && !this.__chain__) {
            var o2 = this.value();
            return n2.apply(b2(o2) ? o2 : [], u3);
          }
          return this[e](function(f3) {
            return n2.apply(b2(f3) ? f3 : [], u3);
          });
        };
      }), qt2(N2.prototype, function(t, n2) {
        var e = a3[n2];
        if (e) {
          var r2 = e.name + "";
          W.call(Un2, r2) || (Un2[r2] = []), Un2[r2].push({ name: n2, func: e });
        }
      }), Un2[Ve(i2, ln2).name] = [{ name: "wrapper", func: i2 }], N2.prototype.clone = Qf2, N2.prototype.reverse = Vf, N2.prototype.value = kf2, a3.prototype.at = Sl, a3.prototype.chain = Ol, a3.prototype.commit = Rl, a3.prototype.next = bl, a3.prototype.plant = Ll, a3.prototype.reverse = Hl, a3.prototype.toJSON = a3.prototype.valueOf = a3.prototype.value = Dl, a3.prototype.first = a3.prototype.head, ee2 && (a3.prototype[ee2] = Tl), a3;
    }, Nn2 = Rf2();
    dn2 ? ((dn2.exports = Nn2)._ = Nn2, Lr2._ = Nn2) : j2._ = Nn2;
  }).call(_e2);
})(Ui, Ui.exports);
var Xg = Object.defineProperty, Qg = Object.defineProperties, Vg = Object.getOwnPropertyDescriptors, Oa = Object.getOwnPropertySymbols, kg = Object.prototype.hasOwnProperty, jg = Object.prototype.propertyIsEnumerable, Ra = (P2, s2, i2) => s2 in P2 ? Xg(P2, s2, { enumerable: true, configurable: true, writable: true, value: i2 }) : P2[s2] = i2, lr = (P2, s2) => {
  for (var i2 in s2 || (s2 = {})) kg.call(s2, i2) && Ra(P2, i2, s2[i2]);
  if (Oa) for (var i2 of Oa(s2)) jg.call(s2, i2) && Ra(P2, i2, s2[i2]);
  return P2;
}, tv = (P2, s2) => Qg(P2, Vg(s2));
function Lt(P2, s2, i2) {
  var p3;
  const w2 = mn$1(P2);
  return ((p3 = s2.rpcMap) == null ? void 0 : p3[w2.reference]) || `${Zg}?chainId=${w2.namespace}:${w2.reference}&projectId=${i2}`;
}
function In(P2) {
  return P2.includes(":") ? P2.split(":")[1] : P2;
}
function ba(P2) {
  return P2.map((s2) => `${s2.split(":")[0]}:${s2.split(":")[1]}`);
}
function nv(P2, s2) {
  const i2 = Object.keys(s2.namespaces).filter((w2) => w2.includes(P2));
  if (!i2.length) return [];
  const p3 = [];
  return i2.forEach((w2) => {
    const x3 = s2.namespaces[w2].accounts;
    p3.push(...x3);
  }), p3;
}
function Fi(P2 = {}, s2 = {}) {
  const i2 = Ta(P2), p3 = Ta(s2);
  return Ui.exports.merge(i2, p3);
}
function Ta(P2) {
  var s2, i2, p3, w2;
  const x3 = {};
  if (!Xr$1(P2)) return x3;
  for (const [O3, k2] of Object.entries(P2)) {
    const tn2 = fn$1(O3) ? [O3] : k2.chains, Jn2 = k2.methods || [], xn = k2.events || [], Ht2 = k2.rpcMap || {}, Mt2 = Ao(O3);
    x3[Mt2] = tv(lr(lr({}, x3[Mt2]), k2), { chains: me$1(tn2, (s2 = x3[Mt2]) == null ? void 0 : s2.chains), methods: me$1(Jn2, (i2 = x3[Mt2]) == null ? void 0 : i2.methods), events: me$1(xn, (p3 = x3[Mt2]) == null ? void 0 : p3.events), rpcMap: lr(lr({}, Ht2), (w2 = x3[Mt2]) == null ? void 0 : w2.rpcMap) });
  }
  return x3;
}
function ev(P2) {
  return P2.includes(":") ? P2.split(":")[2] : P2;
}
function La(P2) {
  const s2 = {};
  for (const [i2, p3] of Object.entries(P2)) {
    const w2 = p3.methods || [], x3 = p3.events || [], O3 = p3.accounts || [], k2 = fn$1(i2) ? [i2] : p3.chains ? p3.chains : ba(p3.accounts);
    s2[i2] = { chains: k2, methods: w2, events: x3, accounts: O3 };
  }
  return s2;
}
function Wi(P2) {
  return typeof P2 == "number" ? P2 : P2.includes("0x") ? parseInt(P2, 16) : (P2 = P2.includes(":") ? P2.split(":")[1] : P2, isNaN(Number(P2)) ? P2 : Number(P2));
}
const Ha = {}, F = (P2) => Ha[P2], Mi = (P2, s2) => {
  Ha[P2] = s2;
};
class rv {
  constructor(s2) {
    this.name = "polkadot", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
var iv = Object.defineProperty, sv = Object.defineProperties, uv = Object.getOwnPropertyDescriptors, Da = Object.getOwnPropertySymbols, av = Object.prototype.hasOwnProperty, ov = Object.prototype.propertyIsEnumerable, Na = (P2, s2, i2) => s2 in P2 ? iv(P2, s2, { enumerable: true, configurable: true, writable: true, value: i2 }) : P2[s2] = i2, $a = (P2, s2) => {
  for (var i2 in s2 || (s2 = {})) av.call(s2, i2) && Na(P2, i2, s2[i2]);
  if (Da) for (var i2 of Da(s2)) ov.call(s2, i2) && Na(P2, i2, s2[i2]);
  return P2;
}, qa = (P2, s2) => sv(P2, uv(s2));
class fv {
  constructor(s2) {
    this.name = "eip155", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain());
  }
  async request(s2) {
    switch (s2.request.method) {
      case "eth_requestAccounts":
        return this.getAccounts();
      case "eth_accounts":
        return this.getAccounts();
      case "wallet_switchEthereumChain":
        return await this.handleSwitchChain(s2);
      case "eth_chainId":
        return parseInt(this.getDefaultChain());
      case "wallet_getCapabilities":
        return await this.getCapabilities(s2);
    }
    return this.namespace.methods.includes(s2.request.method) ? await this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(parseInt(s2), i2), this.chainId = parseInt(s2), this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId.toString();
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(`${this.name}:${s2}`, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = parseInt(In(i2));
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  getHttpProvider() {
    const s2 = this.chainId, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  async handleSwitchChain(s2) {
    var i2, p3;
    let w2 = s2.request.params ? (i2 = s2.request.params[0]) == null ? void 0 : i2.chainId : "0x0";
    w2 = w2.startsWith("0x") ? w2 : `0x${w2}`;
    const x3 = parseInt(w2, 16);
    if (this.isChainApproved(x3)) this.setDefaultChain(`${x3}`);
    else if (this.namespace.methods.includes("wallet_switchEthereumChain")) await this.client.request({ topic: s2.topic, request: { method: s2.request.method, params: [{ chainId: w2 }] }, chainId: (p3 = this.namespace.chains) == null ? void 0 : p3[0] }), this.setDefaultChain(`${x3}`);
    else throw new Error(`Failed to switch to chain 'eip155:${x3}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
    return null;
  }
  isChainApproved(s2) {
    return this.namespace.chains.includes(`${this.name}:${s2}`);
  }
  async getCapabilities(s2) {
    var i2, p3, w2;
    const x3 = (p3 = (i2 = s2.request) == null ? void 0 : i2.params) == null ? void 0 : p3[0];
    if (!x3) throw new Error("Missing address parameter in `wallet_getCapabilities` request");
    const O3 = this.client.session.get(s2.topic), k2 = ((w2 = O3 == null ? void 0 : O3.sessionProperties) == null ? void 0 : w2.capabilities) || {};
    if (k2 != null && k2[x3]) return k2 == null ? void 0 : k2[x3];
    const tn2 = await this.client.request(s2);
    try {
      await this.client.session.update(s2.topic, { sessionProperties: qa($a({}, O3.sessionProperties || {}), { capabilities: qa($a({}, k2 || {}), { [x3]: tn2 }) }) });
    } catch (Jn2) {
      console.warn("Failed to update session with capabilities", Jn2);
    }
    return tn2;
  }
}
class cv {
  constructor(s2) {
    this.name = "solana", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
class hv {
  constructor(s2) {
    this.name = "cosmos", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
class lv {
  constructor(s2) {
    this.name = "algorand", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    if (!this.httpProviders[s2]) {
      const p3 = i2 || Lt(`${this.name}:${s2}`, this.namespace, this.client.core.projectId);
      if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
      this.setHttpProvider(s2, p3);
    }
    this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      s2[i2] = this.createHttpProvider(i2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    return typeof p3 > "u" ? void 0 : new o(new f$4(p3, F("disableProviderPing")));
  }
}
class pv {
  constructor(s2) {
    this.name = "cip34", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      const p3 = this.getCardanoRPCUrl(i2), w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, p3);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  getCardanoRPCUrl(s2) {
    const i2 = this.namespace.rpcMap;
    if (i2) return i2[s2];
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || this.getCardanoRPCUrl(s2);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
class dv {
  constructor(s2) {
    this.name = "elrond", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
class gv {
  constructor(s2) {
    this.name = "multiversx", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      const w2 = In(i2);
      s2[w2] = this.createHttpProvider(w2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
class vv {
  constructor(s2) {
    this.name = "near", this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace = Object.assign(this.namespace, s2);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider().request(s2.request);
  }
  setDefaultChain(s2, i2) {
    if (this.chainId = s2, !this.httpProviders[s2]) {
      const p3 = i2 || Lt(`${this.name}:${s2}`, this.namespace);
      if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
      this.setHttpProvider(s2, p3);
    }
    this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const s2 = {};
    return this.namespace.chains.forEach((i2) => {
      var p3;
      s2[i2] = this.createHttpProvider(i2, (p3 = this.namespace.rpcMap) == null ? void 0 : p3[i2]);
    }), s2;
  }
  getHttpProvider() {
    const s2 = `${this.name}:${this.chainId}`, i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace);
    return typeof p3 > "u" ? void 0 : new o(new f$4(p3, F("disableProviderPing")));
  }
}
class _v {
  constructor(s2) {
    this.name = Kn, this.namespace = s2.namespace, this.events = F("events"), this.client = F("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(s2) {
    this.namespace.chains = [...new Set((this.namespace.chains || []).concat(s2.chains || []))], this.namespace.accounts = [...new Set((this.namespace.accounts || []).concat(s2.accounts || []))], this.namespace.methods = [...new Set((this.namespace.methods || []).concat(s2.methods || []))], this.namespace.events = [...new Set((this.namespace.events || []).concat(s2.events || []))], this.httpProviders = this.createHttpProviders();
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(s2) {
    return this.namespace.methods.includes(s2.request.method) ? this.client.request(s2) : this.getHttpProvider(s2.chainId).request(s2.request);
  }
  setDefaultChain(s2, i2) {
    this.httpProviders[s2] || this.setHttpProvider(s2, i2), this.chainId = s2, this.events.emit(Tt.DEFAULT_CHAIN_CHANGED, `${this.name}:${s2}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const s2 = this.namespace.chains[0];
    if (!s2) throw new Error("ChainId not found");
    return s2.split(":")[1];
  }
  getAccounts() {
    const s2 = this.namespace.accounts;
    return s2 ? [...new Set(s2.filter((i2) => i2.split(":")[1] === this.chainId.toString()).map((i2) => i2.split(":")[2]))] : [];
  }
  createHttpProviders() {
    var s2, i2;
    const p3 = {};
    return (i2 = (s2 = this.namespace) == null ? void 0 : s2.accounts) == null || i2.forEach((w2) => {
      const x3 = mn$1(w2);
      p3[`${x3.namespace}:${x3.reference}`] = this.createHttpProvider(w2);
    }), p3;
  }
  getHttpProvider(s2) {
    const i2 = this.httpProviders[s2];
    if (typeof i2 > "u") throw new Error(`JSON-RPC provider for ${s2} not found`);
    return i2;
  }
  setHttpProvider(s2, i2) {
    const p3 = this.createHttpProvider(s2, i2);
    p3 && (this.httpProviders[s2] = p3);
  }
  createHttpProvider(s2, i2) {
    const p3 = i2 || Lt(s2, this.namespace, this.client.core.projectId);
    if (!p3) throw new Error(`No RPC url provided for chainId: ${s2}`);
    return new o(new f$4(p3, F("disableProviderPing")));
  }
}
var mv = Object.defineProperty, wv = Object.defineProperties, Pv = Object.getOwnPropertyDescriptors, Ua = Object.getOwnPropertySymbols, Cv = Object.prototype.hasOwnProperty, Av = Object.prototype.propertyIsEnumerable, Fa = (P2, s2, i2) => s2 in P2 ? mv(P2, s2, { enumerable: true, configurable: true, writable: true, value: i2 }) : P2[s2] = i2, pr = (P2, s2) => {
  for (var i2 in s2 || (s2 = {})) Cv.call(s2, i2) && Fa(P2, i2, s2[i2]);
  if (Ua) for (var i2 of Ua(s2)) Av.call(s2, i2) && Fa(P2, i2, s2[i2]);
  return P2;
}, Bi = (P2, s2) => wv(P2, Pv(s2));
class dr {
  constructor(s2) {
    this.events = new Gg(), this.rpcProviders = {}, this.shouldAbortPairingAttempt = false, this.maxPairingAttempts = 10, this.disableProviderPing = false, this.providerOpts = s2, this.logger = typeof (s2 == null ? void 0 : s2.logger) < "u" && typeof (s2 == null ? void 0 : s2.logger) != "string" ? s2.logger : Wg(k({ level: (s2 == null ? void 0 : s2.logger) || ya })), this.disableProviderPing = (s2 == null ? void 0 : s2.disableProviderPing) || false;
  }
  static async init(s2) {
    const i2 = new dr(s2);
    return await i2.initialize(), i2;
  }
  async request(s2, i2, p3) {
    const [w2, x3] = this.validateChain(i2);
    if (!this.session) throw new Error("Please call connect() before request()");
    return await this.getProvider(w2).request({ request: pr({}, s2), chainId: `${w2}:${x3}`, topic: this.session.topic, expiry: p3 });
  }
  sendAsync(s2, i2, p3, w2) {
    const x3 = (/* @__PURE__ */ new Date()).getTime();
    this.request(s2, p3, w2).then((O3) => i2(null, formatJsonRpcResult(x3, O3))).catch((O3) => i2(O3, void 0));
  }
  async enable() {
    if (!this.client) throw new Error("Sign Client not initialized");
    return this.session || await this.connect({ namespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties }), await this.requestAccounts();
  }
  async disconnect() {
    var s2;
    if (!this.session) throw new Error("Please call connect() before enable()");
    await this.client.disconnect({ topic: (s2 = this.session) == null ? void 0 : s2.topic, reason: er$1("USER_DISCONNECTED") }), await this.cleanup();
  }
  async connect(s2) {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (this.setNamespaces(s2), await this.cleanupPendingPairings(), !s2.skipPairing) return await this.pair(s2.pairingTopic);
  }
  async authenticate(s2, i2) {
    if (!this.client) throw new Error("Sign Client not initialized");
    this.setNamespaces(s2), await this.cleanupPendingPairings();
    const { uri: p3, response: w2 } = await this.client.authenticate(s2, i2);
    p3 && (this.uri = p3, this.events.emit("display_uri", p3));
    const x3 = await w2();
    if (this.session = x3.session, this.session) {
      const O3 = La(this.session.namespaces);
      this.namespaces = Fi(this.namespaces, O3), this.persist("namespaces", this.namespaces), this.onConnect();
    }
    return x3;
  }
  on(s2, i2) {
    this.events.on(s2, i2);
  }
  once(s2, i2) {
    this.events.once(s2, i2);
  }
  removeListener(s2, i2) {
    this.events.removeListener(s2, i2);
  }
  off(s2, i2) {
    this.events.off(s2, i2);
  }
  get isWalletConnect() {
    return true;
  }
  async pair(s2) {
    this.shouldAbortPairingAttempt = false;
    let i2 = 0;
    do {
      if (this.shouldAbortPairingAttempt) throw new Error("Pairing aborted");
      if (i2 >= this.maxPairingAttempts) throw new Error("Max auto pairing attempts reached");
      const { uri: p3, approval: w2 } = await this.client.connect({ pairingTopic: s2, requiredNamespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties });
      p3 && (this.uri = p3, this.events.emit("display_uri", p3)), await w2().then((x3) => {
        this.session = x3;
        const O3 = La(x3.namespaces);
        this.namespaces = Fi(this.namespaces, O3), this.persist("namespaces", this.namespaces);
      }).catch((x3) => {
        if (x3.message !== it) throw x3;
        i2++;
      });
    } while (!this.session);
    return this.onConnect(), this.session;
  }
  setDefaultChain(s2, i2) {
    try {
      if (!this.session) return;
      const [p3, w2] = this.validateChain(s2), x3 = this.getProvider(p3);
      x3.name === Kn ? x3.setDefaultChain(`${p3}:${w2}`, i2) : x3.setDefaultChain(w2, i2);
    } catch (p3) {
      if (!/Please call connect/.test(p3.message)) throw p3;
    }
  }
  async cleanupPendingPairings(s2 = {}) {
    this.logger.info("Cleaning up inactive pairings...");
    const i2 = this.client.pairing.getAll();
    if (Ir$1(i2)) {
      for (const p3 of i2) s2.deletePairings ? this.client.core.expirer.set(p3.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(p3.topic);
      this.logger.info(`Inactive pairings cleared: ${i2.length}`);
    }
  }
  abortPairingAttempt() {
    this.shouldAbortPairingAttempt = true;
  }
  async checkStorage() {
    if (this.namespaces = await this.getFromStore("namespaces"), this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.client.session.length) {
      const s2 = this.client.session.keys.length - 1;
      this.session = this.client.session.get(this.client.session.keys[s2]), this.createProviders();
    }
  }
  async initialize() {
    this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
  }
  async createClient() {
    this.client = this.providerOpts.client || await _e$1.init({ core: this.providerOpts.core, logger: this.providerOpts.logger || ya, relayUrl: this.providerOpts.relayUrl || Kg, projectId: this.providerOpts.projectId, metadata: this.providerOpts.metadata, storageOptions: this.providerOpts.storageOptions, storage: this.providerOpts.storage, name: this.providerOpts.name, customStoragePrefix: this.providerOpts.customStoragePrefix, telemetryEnabled: this.providerOpts.telemetryEnabled }), this.logger.trace("SignClient Initialized");
  }
  createProviders() {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (!this.session) throw new Error("Session not initialized. Please call connect() before enable()");
    const s2 = [...new Set(Object.keys(this.session.namespaces).map((i2) => Ao(i2)))];
    Mi("client", this.client), Mi("events", this.events), Mi("disableProviderPing", this.disableProviderPing), s2.forEach((i2) => {
      if (!this.session) return;
      const p3 = nv(i2, this.session), w2 = ba(p3), x3 = Fi(this.namespaces, this.optionalNamespaces), O3 = Bi(pr({}, x3[i2]), { accounts: p3, chains: w2 });
      switch (i2) {
        case "eip155":
          this.rpcProviders[i2] = new fv({ namespace: O3 });
          break;
        case "algorand":
          this.rpcProviders[i2] = new lv({ namespace: O3 });
          break;
        case "solana":
          this.rpcProviders[i2] = new cv({ namespace: O3 });
          break;
        case "cosmos":
          this.rpcProviders[i2] = new hv({ namespace: O3 });
          break;
        case "polkadot":
          this.rpcProviders[i2] = new rv({ namespace: O3 });
          break;
        case "cip34":
          this.rpcProviders[i2] = new pv({ namespace: O3 });
          break;
        case "elrond":
          this.rpcProviders[i2] = new dv({ namespace: O3 });
          break;
        case "multiversx":
          this.rpcProviders[i2] = new gv({ namespace: O3 });
          break;
        case "near":
          this.rpcProviders[i2] = new vv({ namespace: O3 });
          break;
        default:
          this.rpcProviders[Kn] ? this.rpcProviders[Kn].updateNamespace(O3) : this.rpcProviders[Kn] = new _v({ namespace: O3 });
      }
    });
  }
  registerEventListeners() {
    if (typeof this.client > "u") throw new Error("Sign Client is not initialized");
    this.client.on("session_ping", (s2) => {
      this.events.emit("session_ping", s2);
    }), this.client.on("session_event", (s2) => {
      const { params: i2 } = s2, { event: p3 } = i2;
      if (p3.name === "accountsChanged") {
        const w2 = p3.data;
        w2 && Ir$1(w2) && this.events.emit("accountsChanged", w2.map(ev));
      } else if (p3.name === "chainChanged") {
        const w2 = i2.chainId, x3 = i2.event.data, O3 = Ao(w2), k2 = Wi(w2) !== Wi(x3) ? `${O3}:${Wi(x3)}` : w2;
        this.onChainChanged(k2);
      } else this.events.emit(p3.name, p3.data);
      this.events.emit("session_event", s2);
    }), this.client.on("session_update", ({ topic: s2, params: i2 }) => {
      var p3;
      const { namespaces: w2 } = i2, x3 = (p3 = this.client) == null ? void 0 : p3.session.get(s2);
      this.session = Bi(pr({}, x3), { namespaces: w2 }), this.onSessionUpdate(), this.events.emit("session_update", { topic: s2, params: i2 });
    }), this.client.on("session_delete", async (s2) => {
      await this.cleanup(), this.events.emit("session_delete", s2), this.events.emit("disconnect", Bi(pr({}, er$1("USER_DISCONNECTED")), { data: s2.topic }));
    }), this.on(Tt.DEFAULT_CHAIN_CHANGED, (s2) => {
      this.onChainChanged(s2, true);
    });
  }
  getProvider(s2) {
    return this.rpcProviders[s2] || this.rpcProviders[Kn];
  }
  onSessionUpdate() {
    Object.keys(this.rpcProviders).forEach((s2) => {
      var i2;
      this.getProvider(s2).updateNamespace((i2 = this.session) == null ? void 0 : i2.namespaces[s2]);
    });
  }
  setNamespaces(s2) {
    const { namespaces: i2, optionalNamespaces: p3, sessionProperties: w2 } = s2;
    i2 && Object.keys(i2).length && (this.namespaces = i2), p3 && Object.keys(p3).length && (this.optionalNamespaces = p3), this.sessionProperties = w2, this.persist("namespaces", i2), this.persist("optionalNamespaces", p3);
  }
  validateChain(s2) {
    const [i2, p3] = (s2 == null ? void 0 : s2.split(":")) || ["", ""];
    if (!this.namespaces || !Object.keys(this.namespaces).length) return [i2, p3];
    if (i2 && !Object.keys(this.namespaces || {}).map((O3) => Ao(O3)).includes(i2)) throw new Error(`Namespace '${i2}' is not configured. Please call connect() first with namespace config.`);
    if (i2 && p3) return [i2, p3];
    const w2 = Ao(Object.keys(this.namespaces)[0]), x3 = this.rpcProviders[w2].getDefaultChain();
    return [w2, x3];
  }
  async requestAccounts() {
    const [s2] = this.validateChain();
    return await this.getProvider(s2).requestAccounts();
  }
  onChainChanged(s2, i2 = false) {
    if (!this.namespaces) return;
    const [p3, w2] = this.validateChain(s2);
    w2 && (i2 || this.getProvider(p3).setDefaultChain(w2), this.namespaces[p3] ? this.namespaces[p3].defaultChain = w2 : this.namespaces[`${p3}:${w2}`] ? this.namespaces[`${p3}:${w2}`].defaultChain = w2 : this.namespaces[`${p3}:${w2}`] = { defaultChain: w2 }, this.persist("namespaces", this.namespaces), this.events.emit("chainChanged", w2));
  }
  onConnect() {
    this.createProviders(), this.events.emit("connect", { session: this.session });
  }
  async cleanup() {
    this.session = void 0, this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, this.persist("namespaces", void 0), this.persist("optionalNamespaces", void 0), this.persist("sessionProperties", void 0), await this.cleanupPendingPairings({ deletePairings: true });
  }
  persist(s2, i2) {
    this.client.core.storage.setItem(`${Sa}/${s2}`, i2);
  }
  async getFromStore(s2) {
    return await this.client.core.storage.getItem(`${Sa}/${s2}`);
  }
}
const Iv = dr;
const R2 = "wc", T = "ethereum_provider", $ = `${R2}@2:${T}:`, j = "https://rpc.walletconnect.com/v1/", u2 = ["eth_sendTransaction", "personal_sign"], y2 = ["eth_accounts", "eth_requestAccounts", "eth_sendRawTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "eth_sendTransaction", "personal_sign", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode", "wallet_sendCalls", "wallet_getCapabilities", "wallet_getCallsStatus", "wallet_showCallsStatus"], g2 = ["chainChanged", "accountsChanged"], b = ["chainChanged", "accountsChanged", "message", "disconnect", "connect"];
var q = Object.defineProperty, N = Object.defineProperties, D = Object.getOwnPropertyDescriptors, M2 = Object.getOwnPropertySymbols, U = Object.prototype.hasOwnProperty, Q = Object.prototype.propertyIsEnumerable, O2 = (r2, t, s2) => t in r2 ? q(r2, t, { enumerable: true, configurable: true, writable: true, value: s2 }) : r2[t] = s2, p2 = (r2, t) => {
  for (var s2 in t || (t = {})) U.call(t, s2) && O2(r2, s2, t[s2]);
  if (M2) for (var s2 of M2(t)) Q.call(t, s2) && O2(r2, s2, t[s2]);
  return r2;
}, E = (r2, t) => N(r2, D(t));
function m2(r2) {
  return Number(r2[0].split(":")[1]);
}
function v2(r2) {
  return `0x${r2.toString(16)}`;
}
function L2(r2) {
  const { chains: t, optionalChains: s2, methods: i2, optionalMethods: e, events: n2, optionalEvents: o2, rpcMap: c2 } = r2;
  if (!Ir$1(t)) throw new Error("Invalid chains");
  const a3 = { chains: t, methods: i2 || u2, events: n2 || g2, rpcMap: p2({}, t.length ? { [m2(t)]: c2[m2(t)] } : {}) }, h3 = n2 == null ? void 0 : n2.filter((l2) => !g2.includes(l2)), d3 = i2 == null ? void 0 : i2.filter((l2) => !u2.includes(l2));
  if (!s2 && !o2 && !e && !(h3 != null && h3.length) && !(d3 != null && d3.length)) return { required: t.length ? a3 : void 0 };
  const w2 = (h3 == null ? void 0 : h3.length) && (d3 == null ? void 0 : d3.length) || !s2, I2 = { chains: [...new Set(w2 ? a3.chains.concat(s2 || []) : s2)], methods: [...new Set(a3.methods.concat(e != null && e.length ? e : y2))], events: [...new Set(a3.events.concat(o2 != null && o2.length ? o2 : b))], rpcMap: c2 };
  return { required: t.length ? a3 : void 0, optional: s2.length ? I2 : void 0 };
}
class C2 {
  constructor() {
    this.events = new eventsExports.EventEmitter(), this.namespace = "eip155", this.accounts = [], this.chainId = 1, this.STORAGE_KEY = $, this.on = (t, s2) => (this.events.on(t, s2), this), this.once = (t, s2) => (this.events.once(t, s2), this), this.removeListener = (t, s2) => (this.events.removeListener(t, s2), this), this.off = (t, s2) => (this.events.off(t, s2), this), this.parseAccount = (t) => this.isCompatibleChainId(t) ? this.parseAccountId(t).address : t, this.signer = {}, this.rpc = {};
  }
  static async init(t) {
    const s2 = new C2();
    return await s2.initialize(t), s2;
  }
  async request(t, s2) {
    return await this.signer.request(t, this.formatChainId(this.chainId), s2);
  }
  sendAsync(t, s2, i2) {
    this.signer.sendAsync(t, s2, this.formatChainId(this.chainId), i2);
  }
  get connected() {
    return this.signer.client ? this.signer.client.core.relayer.connected : false;
  }
  get connecting() {
    return this.signer.client ? this.signer.client.core.relayer.connecting : false;
  }
  async enable() {
    return this.session || await this.connect(), await this.request({ method: "eth_requestAccounts" });
  }
  async connect(t) {
    if (!this.signer.client) throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts(t);
    const { required: s2, optional: i2 } = L2(this.rpc);
    try {
      const e = await new Promise(async (o2, c2) => {
        var a3;
        this.rpc.showQrModal && ((a3 = this.modal) == null || a3.subscribeModal((h3) => {
          !h3.open && !this.signer.session && (this.signer.abortPairingAttempt(), c2(new Error("Connection request reset. Please try again.")));
        })), await this.signer.connect(E(p2({ namespaces: p2({}, s2 && { [this.namespace]: s2 }) }, i2 && { optionalNamespaces: { [this.namespace]: i2 } }), { pairingTopic: t == null ? void 0 : t.pairingTopic })).then((h3) => {
          o2(h3);
        }).catch((h3) => {
          c2(new Error(h3.message));
        });
      });
      if (!e) return;
      const n2 = Jo(e.namespaces, [this.namespace]);
      this.setChainIds(this.rpc.chains.length ? this.rpc.chains : n2), this.setAccounts(n2), this.events.emit("connect", { chainId: v2(this.chainId) });
    } catch (e) {
      throw this.signer.logger.error(e), e;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async authenticate(t, s2) {
    if (!this.signer.client) throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts({ chains: t == null ? void 0 : t.chains });
    try {
      const i2 = await new Promise(async (n2, o2) => {
        var c2;
        this.rpc.showQrModal && ((c2 = this.modal) == null || c2.subscribeModal((a3) => {
          !a3.open && !this.signer.session && (this.signer.abortPairingAttempt(), o2(new Error("Connection request reset. Please try again.")));
        })), await this.signer.authenticate(E(p2({}, t), { chains: this.rpc.chains }), s2).then((a3) => {
          n2(a3);
        }).catch((a3) => {
          o2(new Error(a3.message));
        });
      }), e = i2.session;
      if (e) {
        const n2 = Jo(e.namespaces, [this.namespace]);
        this.setChainIds(this.rpc.chains.length ? this.rpc.chains : n2), this.setAccounts(n2), this.events.emit("connect", { chainId: v2(this.chainId) });
      }
      return i2;
    } catch (i2) {
      throw this.signer.logger.error(i2), i2;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async disconnect() {
    this.session && await this.signer.disconnect(), this.reset();
  }
  get isWalletConnect() {
    return true;
  }
  get session() {
    return this.signer.session;
  }
  registerEventListeners() {
    this.signer.on("session_event", (t) => {
      const { params: s2 } = t, { event: i2 } = s2;
      i2.name === "accountsChanged" ? (this.accounts = this.parseAccounts(i2.data), this.events.emit("accountsChanged", this.accounts)) : i2.name === "chainChanged" ? this.setChainId(this.formatChainId(i2.data)) : this.events.emit(i2.name, i2.data), this.events.emit("session_event", t);
    }), this.signer.on("chainChanged", (t) => {
      const s2 = parseInt(t);
      this.chainId = s2, this.events.emit("chainChanged", v2(this.chainId)), this.persist();
    }), this.signer.on("session_update", (t) => {
      this.events.emit("session_update", t);
    }), this.signer.on("session_delete", (t) => {
      this.reset(), this.events.emit("session_delete", t), this.events.emit("disconnect", E(p2({}, er$1("USER_DISCONNECTED")), { data: t.topic, name: "USER_DISCONNECTED" }));
    }), this.signer.on("display_uri", (t) => {
      var s2, i2;
      this.rpc.showQrModal && ((s2 = this.modal) == null || s2.closeModal(), (i2 = this.modal) == null || i2.openModal({ uri: t })), this.events.emit("display_uri", t);
    });
  }
  switchEthereumChain(t) {
    this.request({ method: "wallet_switchEthereumChain", params: [{ chainId: t.toString(16) }] });
  }
  isCompatibleChainId(t) {
    return typeof t == "string" ? t.startsWith(`${this.namespace}:`) : false;
  }
  formatChainId(t) {
    return `${this.namespace}:${t}`;
  }
  parseChainId(t) {
    return Number(t.split(":")[1]);
  }
  setChainIds(t) {
    const s2 = t.filter((i2) => this.isCompatibleChainId(i2)).map((i2) => this.parseChainId(i2));
    s2.length && (this.chainId = s2[0], this.events.emit("chainChanged", v2(this.chainId)), this.persist());
  }
  setChainId(t) {
    if (this.isCompatibleChainId(t)) {
      const s2 = this.parseChainId(t);
      this.chainId = s2, this.switchEthereumChain(s2);
    }
  }
  parseAccountId(t) {
    const [s2, i2, e] = t.split(":");
    return { chainId: `${s2}:${i2}`, address: e };
  }
  setAccounts(t) {
    this.accounts = t.filter((s2) => this.parseChainId(this.parseAccountId(s2).chainId) === this.chainId).map((s2) => this.parseAccountId(s2).address), this.events.emit("accountsChanged", this.accounts);
  }
  getRpcConfig(t) {
    var s2, i2;
    const e = (s2 = t == null ? void 0 : t.chains) != null ? s2 : [], n2 = (i2 = t == null ? void 0 : t.optionalChains) != null ? i2 : [], o2 = e.concat(n2);
    if (!o2.length) throw new Error("No chains specified in either `chains` or `optionalChains`");
    const c2 = e.length ? (t == null ? void 0 : t.methods) || u2 : [], a3 = e.length ? (t == null ? void 0 : t.events) || g2 : [], h3 = (t == null ? void 0 : t.optionalMethods) || [], d3 = (t == null ? void 0 : t.optionalEvents) || [], w2 = (t == null ? void 0 : t.rpcMap) || this.buildRpcMap(o2, t.projectId), I2 = (t == null ? void 0 : t.qrModalOptions) || void 0;
    return { chains: e == null ? void 0 : e.map((l2) => this.formatChainId(l2)), optionalChains: n2.map((l2) => this.formatChainId(l2)), methods: c2, events: a3, optionalMethods: h3, optionalEvents: d3, rpcMap: w2, showQrModal: !!(t != null && t.showQrModal), qrModalOptions: I2, projectId: t.projectId, metadata: t.metadata };
  }
  buildRpcMap(t, s2) {
    const i2 = {};
    return t.forEach((e) => {
      i2[e] = this.getRpcUrl(e, s2);
    }), i2;
  }
  async initialize(t) {
    if (this.rpc = this.getRpcConfig(t), this.chainId = this.rpc.chains.length ? m2(this.rpc.chains) : m2(this.rpc.optionalChains), this.signer = await Iv.init({ projectId: this.rpc.projectId, metadata: this.rpc.metadata, disableProviderPing: t.disableProviderPing, relayUrl: t.relayUrl, storageOptions: t.storageOptions, customStoragePrefix: t.customStoragePrefix, telemetryEnabled: t.telemetryEnabled }), this.registerEventListeners(), await this.loadPersistedSession(), this.rpc.showQrModal) {
      let s2;
      try {
        const { WalletConnectModal: i2 } = await __vitePreload(() => import("./index-D4HxNKwF.js").then((n2) => n2.i), true ? __vite__mapDeps([0,1,2]) : void 0);
        s2 = i2;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (s2) try {
        this.modal = new s2(p2({ projectId: this.rpc.projectId }, this.rpc.qrModalOptions));
      } catch (i2) {
        throw this.signer.logger.error(i2), new Error("Could not generate WalletConnectModal Instance");
      }
    }
  }
  loadConnectOpts(t) {
    if (!t) return;
    const { chains: s2, optionalChains: i2, rpcMap: e } = t;
    s2 && Ir$1(s2) && (this.rpc.chains = s2.map((n2) => this.formatChainId(n2)), s2.forEach((n2) => {
      this.rpc.rpcMap[n2] = (e == null ? void 0 : e[n2]) || this.getRpcUrl(n2);
    })), i2 && Ir$1(i2) && (this.rpc.optionalChains = [], this.rpc.optionalChains = i2 == null ? void 0 : i2.map((n2) => this.formatChainId(n2)), i2.forEach((n2) => {
      this.rpc.rpcMap[n2] = (e == null ? void 0 : e[n2]) || this.getRpcUrl(n2);
    }));
  }
  getRpcUrl(t, s2) {
    var i2;
    return ((i2 = this.rpc.rpcMap) == null ? void 0 : i2[t]) || `${j}?chainId=eip155:${t}&projectId=${s2 || this.rpc.projectId}`;
  }
  async loadPersistedSession() {
    if (this.session) try {
      const t = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`), s2 = this.session.namespaces[`${this.namespace}:${t}`] ? this.session.namespaces[`${this.namespace}:${t}`] : this.session.namespaces[this.namespace];
      this.setChainIds(t ? [this.formatChainId(t)] : s2 == null ? void 0 : s2.accounts), this.setAccounts(s2 == null ? void 0 : s2.accounts);
    } catch (t) {
      this.signer.logger.error("Failed to load persisted session, clearing state..."), this.signer.logger.error(t), await this.disconnect().catch((s2) => this.signer.logger.warn(s2));
    }
  }
  reset() {
    this.chainId = 1, this.accounts = [];
  }
  persist() {
    this.session && this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId);
  }
  parseAccounts(t) {
    return typeof t == "string" || t instanceof String ? [this.parseAccount(t)] : t.map((s2) => this.parseAccount(s2));
  }
}
const x2 = C2;
export {
  x2 as EthereumProvider,
  b as OPTIONAL_EVENTS,
  y2 as OPTIONAL_METHODS,
  g2 as REQUIRED_EVENTS,
  u2 as REQUIRED_METHODS,
  C2 as default
};
