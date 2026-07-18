import { A as createLucideIcon, dg as useConnection, r as reactExports, d0 as ETH_RPC_ENDPOINTS, j as jsxRuntimeExports, cR as fetchDexScreenerPrice, d1 as createPublicClient, d2 as http, dh as mainnet, X, B as Button, cC as CircleCheck, cX as LoaderCircle, i as isPendingFee, C as ClaimStatus, u as useAuth, l as useWallet, d as useGetTokens, c as useMyClaimHistory, di as useInitiateClaim, n as useGetFeeRecipient, m as useGetFeePercent, b as useMyBalance, o as useRetryFeeClaim, dj as useQueryClient, dk as useLiveTokenPrice, cI as useGetLaunchGateConfig, e as useGetGritIssuanceRate, S as Skeleton, c$ as getChainId, f as formatGrit, k as CHAIN_LABELS, aL as Info, h as formatUSDValue, t as truncateAddress, dl as getExplorerUrl, L as Link, dm as WalletButton, dn as useReadContracts, dp as formatUnits, dq as useMinerCreationFees, dr as useCreateMiner, cT as Dialog, cU as DialogContent, cV as DialogHeader, cW as DialogTitle, ds as useEditMiner, dt as MinerStatus, du as useMyMiners, dv as useUserMiningStats, dw as useBlockHistory, dx as Swords, J as ChevronDown } from "./index-DqUaPUte.js";
import { S as Search } from "./search-CnvYeMNj.js";
import { V as VideoSection } from "./VideoSection-Cnd2c0D2.js";
import { B as Badge, C as Cpu } from "./badge-ZDweztb1.js";
import { C as Clock, a as Card, d as CardContent, b as CardHeader, c as CardTitle } from "./card-CO-E7rfo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CTPRiq2U.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-Be9tuGjA.js";
import { T as TriangleAlert, P as Plus } from "./triangle-alert-CrGshVKr.js";
import { F as Flame, E as ExternalLink } from "./flame-B1MJKGpB.js";
import { Z as Zap } from "./zap-DN51KW58.js";
import { S as Shield } from "./shield-D2nSa5Nc.js";
import { u as ue } from "./index-lFSGe_yi.js";
import { C as ChevronUp } from "./chevron-up-DAT-e9aa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912", key: "we99rg" }],
  [
    "path",
    {
      d: "M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393",
      key: "1w6hck"
    }
  ],
  [
    "path",
    {
      d: "M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z",
      key: "15hgfx"
    }
  ],
  [
    "path",
    {
      d: "M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319",
      key: "452b4h"
    }
  ]
];
const Pickaxe = createLucideIcon("pickaxe", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const ACQUIRE_TOKENS = [
  {
    ticker: "axlREGEN",
    chainName: "Base",
    chainId: 8453,
    contract: "0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754",
    link: "https://bridge.eco/?to=0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754&toChain=8453",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base"
    ]
  },
  {
    ticker: "kVCM",
    chainName: "Base",
    chainId: 8453,
    contract: "0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d",
    link: "https://bridge.eco/?to=0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d&toChain=8453",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base"
    ]
  },
  {
    ticker: "GIV",
    chainName: "Optimism",
    chainId: 10,
    contract: "0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98",
    link: "https://bridge.eco/?to=0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98&toChain=10",
    rpcEndpoints: [
      "https://mainnet.optimism.io",
      "https://optimism.publicnode.com",
      "https://rpc.ankr.com/optimism"
    ]
  },
  {
    ticker: "axlREGEN",
    chainName: "Celo",
    chainId: 42220,
    contract: "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754",
    link: "https://bridge.eco/?to=0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754&toChain=42220",
    rpcEndpoints: [
      "https://forno.celo.org",
      "https://celo.publicnode.com",
      "https://rpc.ankr.com/celo"
    ]
  },
  {
    ticker: "TGN",
    chainName: "Base",
    chainId: 8453,
    contract: "0xd75dfa972c6136f1c594fec1945302f885e1ab29",
    link: "https://www.hydrex.fi/swap?tokenIn=ETH&tokenOut=0xd75dfa972c6136f1c594fec1945302f885e1ab29",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base"
    ]
  },
  {
    ticker: "IMPT",
    chainName: "Ethereum",
    chainId: 1,
    contract: "0x04C17b9D3b29A78F7Bd062a57CF44FC633e71f85",
    link: "https://app.uniswap.org/swap?outputCurrency=0x04C17b9D3b29A78F7Bd062a57CF44FC633e71f85",
    rpcEndpoints: [...ETH_RPC_ENDPOINTS]
  }
];
const BALANCE_OF_ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  }
];
const DECIMALS_ABI = [
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view"
  }
];
function formatBalance(raw, decimals) {
  const divisor = 10 ** decimals;
  const value = Number(raw) / divisor;
  if (value === 0) return "0.00";
  if (value < 1e-4) return "<0.01";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatUSD(value) {
  if (!Number.isFinite(value)) return "$--";
  if (value === 0) return "$0.00";
  if (value < 0.01) return "<$0.01";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
async function readContractWithFallback(rpcEndpoints, contractAddress, abi, functionName, args) {
  for (const rpcUrl of rpcEndpoints) {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl)
      });
      const result = await Promise.race([
        client.readContract({
          address: contractAddress,
          abi,
          functionName,
          args
        }),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("timeout")), 5e3)
        )
      ]);
      return result;
    } catch {
    }
  }
  return BigInt(0);
}
function AcquireSection() {
  const { address } = useConnection();
  const [search, setSearch] = reactExports.useState("");
  const [balances, setBalances] = reactExports.useState({});
  const [decimals, setDecimals] = reactExports.useState({});
  const [prices, setPrices] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!address) {
      setBalances({});
      setDecimals({});
      setPrices({});
      return;
    }
    let cancelled = false;
    setLoading(true);
    const fetchAll = async () => {
      const balancePromises = ACQUIRE_TOKENS.map(async (token) => {
        const bal = await readContractWithFallback(
          token.rpcEndpoints,
          token.contract,
          BALANCE_OF_ABI,
          "balanceOf",
          [address]
        );
        const dec = await readContractWithFallback(
          token.rpcEndpoints,
          token.contract,
          DECIMALS_ABI,
          "decimals",
          []
        );
        const price = await fetchDexScreenerPrice(token.contract);
        return {
          key: `${token.ticker}-${token.chainName}`,
          bal,
          dec: Number(dec),
          price
        };
      });
      const results = await Promise.all(balancePromises);
      if (cancelled) return;
      const balMap = {};
      const decMap = {};
      const priceMap = {};
      for (const r of results) {
        balMap[r.key] = r.bal;
        decMap[r.key] = r.dec;
        priceMap[r.key] = r.price;
      }
      setBalances(balMap);
      setDecimals(decMap);
      setPrices(priceMap);
      setLoading(false);
    };
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [address]);
  const filteredTokens = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ACQUIRE_TOKENS;
    return ACQUIRE_TOKENS.filter(
      (t) => t.ticker.toLowerCase().includes(q) || t.chainName.toLowerCase().includes(q)
    );
  }, [search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "acquire.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-[1.53rem] w-[1.53rem] text-accent" }),
        "ACQUIRE"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm mt-0.5 break-words", children: [
        "Buy allowlisted",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-mono font-bold", children: "RegNet tokens" }),
        " ",
        "via the links provided (or any DEX or CEX of your preference). Skip if you already own these tokens."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "acquire.search_container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "SEARCH TOKENS...",
          className: "w-full pl-9 pr-3 py-2 bg-input border border-border font-display text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none",
          "data-ocid": "acquire.search_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "acquire.token_list", children: [
      filteredTokens.map((token, idx) => {
        const key = `${token.ticker}-${token.chainName}`;
        const rawBal = balances[key];
        const dec = decimals[key] ?? 18;
        const price = prices[key];
        const balanceStr = !address || loading || rawBal === void 0 ? "--" : formatBalance(rawBal, dec);
        const usdStr = !address || loading || rawBal === void 0 || price == null ? "--" : formatUSD(Number(rawBal) / 10 ** dec * price);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: token.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block border border-border bg-card hover:bg-muted/30 transition-colors px-4 py-3",
            "data-ocid": `acquire.token.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg uppercase tracking-wider text-foreground", children: token.ticker }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-accent text-sm text-muted-foreground uppercase tracking-wide", children: token.chainName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 ml-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-sm text-white", children: balanceStr }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-xs text-accent", children: usdStr })
              ] })
            ] })
          },
          key
        );
      }),
      filteredTokens.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-6 text-muted-foreground font-body text-sm",
          "data-ocid": "acquire.empty_state",
          children: "No tokens match your search"
        }
      )
    ] })
  ] });
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
function getModalStep(step) {
  if (step === "burning" || step === "awaiting_confirm" || step === "confirming_on_chain")
    return 1;
  if (step === "paying_fee" || step === "awaiting_fee_confirm" || step === "submitting_claim" || step === "pending_verification" || step === "pending_fee")
    return 2;
  return 3;
}
function getStepStatus(step) {
  switch (step) {
    case "burning":
    case "awaiting_confirm":
      return "Awaiting wallet confirmation…";
    case "confirming_on_chain":
      return "Waiting for RPC indexing…";
    case "paying_fee":
      return "Calculating platform fee…";
    case "submitting_claim":
      return "Submitting claim to ICP…";
    case "pending_verification":
      return "Pending — monitoring transaction…";
    case "pending_fee":
      return "Awaiting platform fee confirmation... This may take a few minutes on Ethereum.";
    case "awaiting_fee_confirm":
      return "Waiting for platform fee to confirm…";
    case "verified":
      return "GRIT Minted!";
    case "failed":
      return "Transaction failed";
    default:
      return "";
  }
}
const STEP_LABELS = [
  "Confirming burn transaction",
  "Paying platform fees",
  "GRIT credit status"
];
function StepDot({
  index,
  activeIndex,
  isCompleted,
  isFailed,
  userRejected
}) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  if (isPast && userRejected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-none border-2 border-red-500/60 bg-red-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-400/80" }) });
  }
  if (isPast && !isFailed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0.6, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        className: "w-7 h-7 rounded-none border-2 border-accent bg-accent/20 flex items-center justify-center shrink-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-accent" })
      }
    );
  }
  if (isActive && isFailed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-none border-2 border-red-500 bg-red-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-400" }) });
  }
  if (isActive && isCompleted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0.6, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        className: "w-7 h-7 rounded-none border-2 border-accent bg-accent/20 flex items-center justify-center shrink-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent" })
      }
    );
  }
  if (isActive) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-none border-2 border-accent bg-accent/10 flex items-center justify-center shrink-0 animate-energy-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 text-accent animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-none border-2 border-border/50 bg-muted/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-accent text-muted-foreground/60", children: index + 1 }) });
}
function BurnProgressModal({
  open,
  step,
  verifiedGrit,
  errorMsg,
  priceNote,
  userRejected = false,
  onClose,
  onContinueInBackground,
  formatGrit: formatGrit2
}) {
  const activeIndex = getModalStep(step) - 1;
  const isVerified = step === "verified";
  const isFailed = step === "failed";
  const isTerminal = isVerified || isFailed;
  const canBackground = !isTerminal;
  const statusText = getStepStatus(step);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-sm",
        onClick: isTerminal ? onClose : onContinueInBackground,
        "data-ocid": "burn_modal.backdrop"
      },
      "backdrop"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.94, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
        transition: { type: "spring", stiffness: 340, damping: 28 },
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "pointer-events-auto w-full max-w-md bg-card border-2 border-accent/40 shadow-[0_0_32px_rgba(0,255,65,0.15)] p-0 overflow-hidden",
            "data-ocid": "burn_modal.dialog",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-accent/20 bg-accent/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-accent uppercase tracking-widest", children: "Burn Progress" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: isTerminal ? onClose : onContinueInBackground,
                    className: "w-7 h-7 flex items-center justify-center border border-border/60 hover:border-accent/60 hover:text-accent text-muted-foreground transition-colors duration-200",
                    "aria-label": "Close burn progress",
                    "data-ocid": "burn_modal.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5 space-y-4", children: STEP_LABELS.map((label, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                const stepIsVerifiedFinal = isVerified && i === 2;
                const stepIsFailedFinal = isFailed && i === activeIndex;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: false,
                    animate: {
                      opacity: i > activeIndex ? 0.45 : 1
                    },
                    transition: { duration: 0.3 },
                    className: "flex items-start gap-4",
                    "data-ocid": `burn_modal.step.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StepDot,
                        {
                          index: i,
                          activeIndex,
                          isCompleted: stepIsVerifiedFinal,
                          isFailed: stepIsFailedFinal,
                          userRejected
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: `text-xs font-accent uppercase tracking-widest ${isActive || isPast ? "text-accent/70" : "text-muted-foreground/50"}`,
                              children: [
                                "Step ",
                                i + 1
                              ]
                            }
                          ),
                          (isPast || stepIsVerifiedFinal) && !userRejected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-accent text-accent/50 uppercase tracking-widest", children: "✓ Done" }),
                          isPast && userRejected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-accent text-red-400/70 uppercase tracking-widest", children: "Cancelled" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: `font-display text-xl uppercase tracking-wide ${isActive ? isFailed ? "text-red-400" : isVerified ? "text-accent" : "text-foreground" : isPast ? "text-foreground/60" : "text-muted-foreground/40"}`,
                            children: label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isActive && statusText && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.p,
                          {
                            initial: { opacity: 0, x: -6 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: 6 },
                            transition: { duration: 0.2 },
                            className: `text-sm font-body mt-1 ${isFailed ? "text-red-400" : isVerified ? "text-accent" : "text-muted-foreground"}`,
                            "data-ocid": "burn_modal.status_text",
                            children: [
                              isVerified && "🎉 ",
                              statusText
                            ]
                          },
                          step
                        ) }),
                        stepIsVerifiedFinal && verifiedGrit !== null && verifiedGrit > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.p,
                          {
                            initial: { opacity: 0, y: 4 },
                            animate: { opacity: 1, y: 0 },
                            className: "font-mono font-bold text-accent text-lg mt-1 energy-pulse",
                            "data-ocid": "burn_modal.grit_amount",
                            children: [
                              "+",
                              formatGrit2(verifiedGrit),
                              " GRIT"
                            ]
                          }
                        )
                      ] })
                    ]
                  },
                  label
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: errorMsg && isFailed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  className: "mx-5 mb-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 flex items-start gap-2",
                  "data-ocid": "burn_modal.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400 shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 font-body", children: errorMsg })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: priceNote && !isFailed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  className: "mx-5 mb-4 rounded border border-border/40 bg-muted/20 px-3 py-2.5 flex items-start gap-2",
                  "data-ocid": "burn_modal.price_note",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: priceNote })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isFailed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  className: "mx-5 mb-1",
                  "data-ocid": "burn_modal.failed_fee_note",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "If a fee payment failed, check Burn History to retry." })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5 flex flex-col gap-2", children: isTerminal ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-full h-11 bg-accent text-background hover:bg-accent/90 font-display text-lg uppercase tracking-widest transition-smooth",
                  "data-ocid": "burn_modal.close_button",
                  children: isVerified ? "Done" : "Close"
                }
              ) : canBackground ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: onContinueInBackground,
                  className: "w-full h-11 border-border/60 hover:border-accent/60 font-body text-sm text-muted-foreground hover:text-accent tracking-wide transition-smooth",
                  "data-ocid": "burn_modal.background_button",
                  children: "Continue in background"
                }
              ) : null })
            ]
          }
        )
      },
      "modal"
    )
  ] }) });
}
function ClaimStatusBadge({
  status,
  variant = "pill"
}) {
  const isFeeStatus = isPendingFee(status);
  const isPending = !isFeeStatus && status === ClaimStatus.pending;
  const isVerified = status === ClaimStatus.verified;
  const colorClasses = isFeeStatus ? "bg-orange-500/15 text-orange-400 border-orange-500/40" : isPending ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : isVerified ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-red-500/15 text-red-400 border-red-500/30";
  const label = isFeeStatus ? "Fee Failed — Retry" : isPending ? "Confirming…" : isVerified ? "Verified" : "Failed";
  const Icon = isFeeStatus ? CreditCard : isPending ? Clock : isVerified ? CircleCheck : CircleX;
  if (variant === "chip") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: `inline-flex items-center gap-1.5 px-3 py-1 rounded border font-accent text-xs uppercase tracking-widest ${colorClasses}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon,
            {
              className: `h-3.5 w-3.5 shrink-0 ${isPending || isFeeStatus ? "animate-pulse" : ""}`
            }
          ),
          label
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded border font-accent text-[10px] uppercase tracking-widest ${colorClasses}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            className: `h-3 w-3 shrink-0 ${isPending || isFeeStatus ? "animate-pulse" : ""}`
          }
        ),
        label
      ]
    }
  );
}
const STEP_BUTTON_LABELS = {
  burning: "Preparing transaction…",
  awaiting_confirm: "Awaiting wallet confirmation…",
  confirming_on_chain: "Waiting for RPC indexing…",
  paying_fee: "Calculating platform fee…",
  awaiting_fee_confirm: "Awaiting fee payment confirmation…",
  submitting_claim: "Submitting claim to ICP…",
  pending_verification: "Pending — monitoring transaction…"
};
function AuthGate({ onLogin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "burn.auth_gate",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-none border border-accent/40 bg-accent/5 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-7 w-7 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-black tracking-tight text-foreground mb-2 uppercase", children: "Identity Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mb-8", children: "Connect your Internet Identity to begin burning tokens and accumulating GRIT fuel." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onLogin,
            className: "bg-accent text-background hover:bg-accent/90 font-display font-bold tracking-widest gap-2 h-12 px-8 transition-smooth uppercase",
            "data-ocid": "burn.connect_identity_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
              "Connect Internet Identity"
            ]
          }
        )
      ]
    }
  );
}
function WalletGate() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "burn.wallet_gate",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-none border border-border bg-muted/30 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-black tracking-tight text-foreground mb-2 uppercase", children: "Connect EVM Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mb-8", children: "Link your MetaMask or browser wallet to sign the burn transaction on Base." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(WalletButton, {})
      ]
    }
  );
}
function WrongChainBanner({
  chainLabel,
  onSwitch
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -6 },
      animate: { opacity: 1, y: 0 },
      className: "rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 flex items-center justify-between gap-3",
      "data-ocid": "burn.wrong_chain_banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-200", children: [
            "Your wallet is not on",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-amber-300", children: chainLabel }),
            ". Switch networks to continue."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: onSwitch,
            className: "shrink-0 bg-amber-500/20 border border-amber-500/50 text-amber-200 hover:bg-amber-500/30 font-mono text-xs uppercase tracking-widest h-8 px-3",
            "data-ocid": "burn.switch_chain_button",
            children: [
              "Switch to ",
              chainLabel
            ]
          }
        )
      ]
    }
  );
}
async function readEthContractWithFallback(contractAddress, abi, functionName, args) {
  for (const rpcUrl of ETH_RPC_ENDPOINTS) {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl)
      });
      const result = await Promise.race([
        client.readContract({
          address: contractAddress,
          abi,
          functionName,
          args
        }),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("timeout")), 5e3)
        )
      ]);
      return result;
    } catch {
    }
  }
  return BigInt(0);
}
const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
];
function TokenBalanceDisplay({
  selectedToken,
  walletAddress,
  livePrice
}) {
  var _a;
  const isEthereum = (selectedToken == null ? void 0 : selectedToken.chain) === "ethereum";
  const [ethBalance, setEthBalance] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!isEthereum || !selectedToken || !walletAddress) {
      setEthBalance(null);
      return;
    }
    let cancelled = false;
    readEthContractWithFallback(
      selectedToken.tokenAddress,
      ERC20_BALANCE_ABI,
      "balanceOf",
      [walletAddress]
    ).then((bal) => {
      if (!cancelled) setEthBalance(bal);
    });
    return () => {
      cancelled = true;
    };
  }, [isEthereum, selectedToken, walletAddress]);
  const contracts = !isEthereum && selectedToken && walletAddress ? [
    {
      address: selectedToken.tokenAddress,
      abi: ERC20_BALANCE_ABI,
      functionName: "balanceOf",
      args: [walletAddress],
      chainId: getChainId(selectedToken.chain)
    }
  ] : [];
  const { data: balanceResults } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 }
  });
  if (!selectedToken || !walletAddress) return null;
  const rawValue = isEthereum ? ethBalance ?? BigInt(0) : ((_a = balanceResults == null ? void 0 : balanceResults[0]) == null ? void 0 : _a.status) === "success" ? balanceResults[0].result : BigInt(0);
  const decimals = Number(selectedToken.decimals);
  const rawBalance = Number.parseFloat(formatUnits(rawValue, decimals));
  const usdValue = rawBalance * (livePrice ?? 0);
  const formattedBalance = rawBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const formattedUsd = usdValue < 0.01 ? "<$0.01" : `$${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "p",
    {
      className: "text-xs text-muted-foreground font-mono mt-1",
      "data-ocid": "burn.token_balance_display",
      children: [
        "Balance :",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
          formattedBalance,
          " ",
          selectedToken.symbol
        ] }),
        " ",
        "~ ",
        formattedUsd
      ]
    }
  );
}
function BurnPage({ embedded = false }) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const wallet = useWallet();
  const { data: tokens, isLoading: tokensLoading } = useGetTokens();
  const { data: claimHistory, refetch: refetchHistory } = useMyClaimHistory();
  const initiateClaim = useInitiateClaim();
  const { data: feeRecipient } = useGetFeeRecipient();
  const { data: feePercent } = useGetFeePercent();
  const feeRate = feePercent != null ? feePercent / 100 : 69e-4;
  const feeDisplay = feePercent != null ? `${feePercent.toFixed(2)}%` : "…%";
  const { data: gritBalance } = useMyBalance();
  const [selectedChain, setSelectedChain] = reactExports.useState("all");
  const [selectedToken, setSelectedToken] = reactExports.useState(
    null
  );
  const [amount, setAmount] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("idle");
  const stepRef = reactExports.useRef("idle");
  const setStepAndRef = reactExports.useCallback((s) => {
    setStep(s);
    stepRef.current = s;
  }, []);
  const [txHash, setTxHash] = reactExports.useState(null);
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  const [_confirmCountdown, setConfirmCountdown] = reactExports.useState(0);
  const [verifiedGrit, setVerifiedGrit] = reactExports.useState(null);
  const [_feeInfo, setFeeInfo] = reactExports.useState(null);
  const [_feeTxHash, setFeeTxHash] = reactExports.useState(null);
  const [_retryingFee, setRetryingFee] = reactExports.useState(false);
  const [_retryFeeMsg, setRetryFeeMsg] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [priceNote, setPriceNote] = reactExports.useState(null);
  const [userRejected, setUserRejected] = reactExports.useState(false);
  const burnChainIdRef = reactExports.useRef(1);
  const burnValueUsdRef = reactExports.useRef(0);
  useRetryFeeClaim();
  const pollingRef = reactExports.useRef(null);
  const claimedTxRef = reactExports.useRef(null);
  const availableChains = Array.from(
    new Set((tokens ?? []).map((t) => t.chain))
  );
  const filteredTokens = selectedChain === "all" ? tokens ?? [] : (tokens ?? []).filter((t) => t.chain === selectedChain);
  function gasTokenForChain(chain) {
    return chain === "celo" ? "CELO" : "ETH";
  }
  const qc = useQueryClient();
  const {
    data: livePrice,
    isLoading: priceLoading,
    isError: priceError,
    refetch: refetchPrice
  } = useLiveTokenPrice((selectedToken == null ? void 0 : selectedToken.tokenAddress) ?? null);
  const priceUnavailable = selectedToken !== null && !priceLoading && (priceError || !livePrice);
  const { data: launchGateData } = useGetLaunchGateConfig();
  const [isNftHolder, setIsNftHolder] = reactExports.useState(true);
  const [countdown, setCountdown] = reactExports.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  reactExports.useEffect(() => {
    if (!(launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(
        diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
      );
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      setCountdown({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [launchGateData == null ? void 0 : launchGateData.launchTimeEnabled, launchGateData == null ? void 0 : launchGateData.launchTime]);
  reactExports.useEffect(() => {
    const evmAddress = wallet.address;
    if (!evmAddress) {
      setIsNftHolder(true);
      return;
    }
    const NFT_ABI = [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "owner", type: "address" }],
        outputs: [{ name: "", type: "uint256" }]
      }
    ];
    const NFT_CONTRACTS = [
      "0x48e727F3052ea0497e5d939B9B52a1B601F166bb",
      "0x9c4642e8456e05BCF3da1922eE9ee5868A602cbA"
    ];
    let cancelled = false;
    async function checkNfts() {
      try {
        const results = await Promise.all(
          NFT_CONTRACTS.map(
            (addr) => readEthContractWithFallback(addr, NFT_ABI, "balanceOf", [
              evmAddress
            ])
          )
        );
        if (!cancelled) {
          setIsNftHolder(results.every((bal) => bal > 0n));
        }
      } catch {
        if (!cancelled) setIsNftHolder(false);
      }
    }
    void checkNfts();
    return () => {
      cancelled = true;
    };
  }, [wallet.address]);
  const isGateActive = !!((launchGateData == null ? void 0 : launchGateData.nftGateEnabled) && Date.now() >= Number(launchGateData.startTime ?? 0) && Date.now() <= Number(launchGateData.endTime ?? 0));
  const isLaunchTimeBlocked = !!((launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) && Date.now() < Number(launchGateData.launchTime ?? 0));
  const isBurnBlocked = isGateActive && !isNftHolder || isLaunchTimeBlocked;
  function formatGritRate(rate) {
    const n = Number(rate);
    if (n >= 1e12) return `${n / 1e12}T`;
    if (n >= 1e9) return `${n / 1e9}B`;
    if (n >= 1e6) return `${n / 1e6}M`;
    return n.toLocaleString("en-US");
  }
  const { data: gritIssuanceRate } = useGetGritIssuanceRate();
  const effectiveRate = gritIssuanceRate ?? BigInt(1e11);
  const parsedAmount = amount.trim() ? Number.parseFloat(amount.trim()) : 0;
  const priceLoaded = !priceLoading && !!livePrice && livePrice > 0;
  const gritEstimate = (() => {
    if (!selectedToken || parsedAmount <= 0 || !livePrice || livePrice <= 0)
      return 0;
    return Math.floor(parsedAmount * livePrice * Number(effectiveRate));
  })();
  reactExports.useEffect(() => {
    if (step !== "pending_verification" || !claimedTxRef.current) return;
    const POLL_TIMEOUT_MS = 35 * 60 * 1e3;
    const startedAt = Date.now();
    async function stopPolling(reason) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      await refetchHistory();
      if (reason === "timeout") {
        setErrorMsg(
          "Verification is taking longer than usual. We're still monitoring — your GRIT will be credited once confirmed."
        );
      }
    }
    pollingRef.current = setInterval(async () => {
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        await stopPolling("timeout");
        return;
      }
      const result = await refetchHistory();
      const records = result.data ?? [];
      const match = records.find((r) => r.txHash === claimedTxRef.current);
      if (!match) return;
      if (match.status === ClaimStatus.verified) {
        setTimeout(() => {
          qc.invalidateQueries({ queryKey: ["myBalance"] });
          qc.refetchQueries({ queryKey: ["myBalance"] });
        }, 1500);
        setVerifiedGrit(match.gritMinted);
        setStepAndRef("verified");
        await stopPolling("settled");
      } else if (isPendingFee(match.status)) {
        setStepAndRef("pending_fee");
        await stopPolling("settled");
      } else if (match.status === ClaimStatus.failed) {
        setStepAndRef("failed");
        setErrorMsg(
          "Verification failed — transaction could not be confirmed on-chain."
        );
        await stopPolling("settled");
      }
    }, 3e3);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [step, refetchHistory, qc, setStepAndRef]);
  async function handleSwitchChain() {
    if (!selectedToken) return;
    const targetChainId = getChainId(selectedToken.chain);
    const targetLabel = CHAIN_LABELS[selectedToken.chain] ?? selectedToken.chain;
    try {
      await wallet.switchToChain(targetChainId);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : `Failed to switch to ${targetLabel}. Please switch manually in your wallet.`
      );
    }
  }
  async function handleBurn() {
    if (!selectedToken || !amount || !wallet.address) return;
    const parsedAmt = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmt) || parsedAmt <= 0) return;
    if (!feeRecipient || !feeRecipient.startsWith("0x")) {
      setErrorMsg(
        "Platform fee recipient is not configured. Please ask an admin to set the fee address in the Admin Panel before burning."
      );
      return;
    }
    setErrorMsg(null);
    setFeeInfo(null);
    setFeeTxHash(null);
    setStepAndRef("burning");
    setModalOpen(true);
    try {
      const tokenDecimals = Number(selectedToken.decimals);
      const targetChainId = getChainId(selectedToken.chain);
      setStepAndRef("awaiting_confirm");
      const AXLREGEN_ADDR = "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754";
      const effectiveDecimals = selectedToken.tokenAddress.toLowerCase() === AXLREGEN_ADDR ? 6 : tokenDecimals;
      const hash = await wallet.burnToken(
        selectedToken.tokenAddress,
        amount.trim(),
        effectiveDecimals,
        targetChainId
      );
      setTxHash(hash);
      setStepAndRef("confirming_on_chain");
      const DELAY_SECS = 15;
      setConfirmCountdown(DELAY_SECS);
      await new Promise((resolve) => {
        let remaining = DELAY_SECS;
        const ticker = setInterval(() => {
          remaining -= 1;
          setConfirmCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(ticker);
            resolve();
          }
        }, 1e3);
      });
      setConfirmCountdown(0);
      setStepAndRef("paying_fee");
      const burnValueUsd = parsedAmt * (livePrice ?? 0);
      burnValueUsdRef.current = burnValueUsd;
      burnChainIdRef.current = targetChainId;
      const feeData = await wallet.getPlatformFeeInfo(
        burnValueUsd,
        targetChainId,
        feeRate
      );
      setFeeInfo(feeData);
      setStepAndRef("awaiting_fee_confirm");
      const feeHash = await wallet.sendPlatformFee(
        burnValueUsd,
        targetChainId,
        feeRecipient ?? "",
        feeRate
      );
      setFeeTxHash(feeHash);
      setStepAndRef("submitting_claim");
      claimedTxRef.current = hash;
      await initiateClaim.mutateAsync({
        txHash: hash,
        feeTxHash: feeHash ?? "",
        tokenAddress: selectedToken.tokenAddress,
        chain: selectedToken.chain,
        frontendPrice: livePrice ?? 0
      });
      setStepAndRef("pending_verification");
    } catch (err) {
      console.error("[handleBurn] burn failed (raw error):", err);
      if (err && typeof err === "object") {
        const e = err;
        if (e.code !== void 0)
          console.error("[handleBurn] error code:", e.code);
        if (e.details !== void 0)
          console.error("[handleBurn] error details:", e.details);
        if (e.cause !== void 0)
          console.error("[handleBurn] error cause:", e.cause);
      }
      const isPriceOracleError = err instanceof Error && (err.message.toLowerCase().includes("price unavailable") || err.message.toLowerCase().includes("network error") || err.message.toLowerCase().includes("real-time price") || err.message.toLowerCase().includes("fetch price") || err.message.toLowerCase().includes("usd price") || err.message.toLowerCase().includes("oracle") || err.message.toLowerCase().includes("price") && !err.message.toLowerCase().includes("native price fetch failed") && !err.message.toLowerCase().includes("invalid native token price"));
      const burnAlreadySubmitted = step === "submitting_claim" || step === "pending_verification";
      if (isPriceOracleError && burnAlreadySubmitted) {
        setPriceNote(
          "Price data temporarily unavailable — GRIT will be credited using last known price once verified."
        );
        setStepAndRef("pending_verification");
        return;
      }
      const isUserRejection = err instanceof Error && (err.message.includes("User denied") || err.message.includes("user rejected") || err.message.includes("User rejected") || err.code === 4001);
      if (isUserRejection) {
        setUserRejected(true);
      }
      const feeStillPending = (stepRef.current === "paying_fee" || stepRef.current === "awaiting_fee_confirm") && !isUserRejection && err instanceof Error && !err.message.toLowerCase().includes("reverted") && !err.message.toLowerCase().includes("denied") && !err.message.toLowerCase().includes("rejected");
      if (feeStillPending) {
        setPriceNote(
          "Platform fee is still pending on-chain — this may take a few minutes on Ethereum. Your GRIT will be credited once confirmed."
        );
        setStepAndRef("awaiting_fee_confirm");
        return;
      }
      const isFeeStillPendingBackend = err instanceof Error && err.message.includes("FEE_PENDING");
      if (isFeeStillPendingBackend) {
        setStepAndRef("awaiting_fee_confirm");
        setPriceNote(
          "Platform fee is still confirming on-chain — awaiting confirmation. Your GRIT will be credited once the fee settles."
        );
        const FEE_POLL_INTERVAL_MS = 1e4;
        const FEE_POLL_MAX_ATTEMPTS = 210;
        let feeAttempts = 0;
        const feePollRef = pollingRef;
        if (feePollRef.current) clearInterval(feePollRef.current);
        feePollRef.current = setInterval(async () => {
          feeAttempts += 1;
          if (feeAttempts > FEE_POLL_MAX_ATTEMPTS) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("failed");
            setErrorMsg(
              "Fee confirmation timed out. The platform fee did not settle within 35 minutes."
            );
            return;
          }
          const result = await refetchHistory();
          const records = result.data ?? [];
          const match = claimedTxRef.current ? records.find((r) => r.txHash === claimedTxRef.current) : null;
          if (!match) return;
          if (match.status === ClaimStatus.verified) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setTimeout(() => {
              qc.invalidateQueries({ queryKey: ["myBalance"] });
              qc.refetchQueries({ queryKey: ["myBalance"] });
            }, 1500);
            setVerifiedGrit(match.gritMinted);
            setStepAndRef("verified");
          } else if (isPendingFee(match.status)) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("pending_fee");
            setPriceNote(
              "Platform fee failed on-chain — please retry the fee payment."
            );
          } else if (match.status === ClaimStatus.failed) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("failed");
            setErrorMsg(
              "Verification failed — transaction could not be confirmed on-chain."
            );
          }
        }, FEE_POLL_INTERVAL_MS);
        return;
      }
      let msg = "An unexpected error occurred.";
      if (err instanceof Error) {
        if (err.message.includes("User denied") || err.message.includes("user rejected")) {
          msg = "Wallet transaction rejected by user.";
          setUserRejected(true);
        } else if (err.message.includes("already claimed")) {
          msg = "This transaction has already been claimed.";
        } else if (err.message.includes("not on allowlist")) {
          msg = "Token is not on the allowlist.";
        } else if (err.message.includes("insufficient")) {
          msg = "Insufficient balance for this transaction.";
        } else if (err.message.includes("LAUNCH_NOT_STARTED")) {
          msg = "Launch has not started yet.";
        } else if (err.message.includes("NFT_GATE_BLOCKED")) {
          msg = "Launch NFTs not detected. Burn access disabled. Try again after obtaining the NFTs.";
        } else if (err.message.includes("Native price fetch failed") || err.message.includes("Invalid native token price")) {
          msg = `Could not fetch native token price for fee calculation: ${err.message}. Please try again.`;
        } else {
          msg = err.message;
        }
      }
      setErrorMsg(msg);
      setStepAndRef("failed");
    }
  }
  function handleReset() {
    setStepAndRef("idle");
    setUserRejected(false);
    setTxHash(null);
    setErrorMsg(null);
    setAmount("");
    setConfirmCountdown(0);
    setVerifiedGrit(null);
    setFeeInfo(null);
    setFeeTxHash(null);
    setRetryingFee(false);
    setRetryFeeMsg("");
    setModalOpen(false);
    setPriceNote(null);
    burnValueUsdRef.current = 0;
    burnChainIdRef.current = 1;
    claimedTxRef.current = null;
    if (pollingRef.current) clearInterval(pollingRef.current);
  }
  function handleModalClose() {
    handleReset();
  }
  function handleContinueInBackground() {
    setModalOpen(false);
  }
  reactExports.useEffect(() => {
    const isTerminalStep = step === "verified" || step === "failed" || step === "pending_fee";
    if (isTerminalStep && !modalOpen) {
      const t = setTimeout(() => {
        handleReset();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step, modalOpen]);
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: embedded ? "space-y-4" : "max-w-4xl mx-auto px-4 py-12 space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48 bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 w-full bg-muted" })
        ]
      }
    );
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: embedded ? "" : "max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { onLogin: login }) });
  }
  if (!wallet.isConnected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: embedded ? "" : "max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletGate, {}) });
  }
  const isOnTargetChain = !selectedToken || wallet.chainId === getChainId(selectedToken.chain);
  const canBurn = step === "idle" && selectedToken !== null && amount !== "" && Number.parseFloat(amount) > 0 && !tokensLoading && !priceLoading && !priceUnavailable && isOnTargetChain && !isBurnBlocked;
  const isTerminal = step === "verified" || step === "failed" || step === "pending_fee";
  const isBusy = !isTerminal && step !== "idle";
  const isRunningInBackground = isBusy && !modalOpen;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: embedded ? "space-y-6" : "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "burn.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-[1.53rem] w-[1.53rem] text-accent" }),
            "BURN"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm mt-0.5 break-words", children: [
            "Permanently burn RegNet tokens on supported chains and earn GRIT (",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-mono font-bold", children: [
              formatGritRate(effectiveRate),
              " per $1"
            ] }),
            " ",
            "burned). GRIT is your non-transferable fuel to mine $AKK."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", "data-ocid": "burn.form_card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5 pt-6", children: [
          isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              className: "rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2",
              "data-ocid": "burn.launch_countdown",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent font-mono", children: "LAUNCH OPENS IN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-2xl sm:text-3xl font-bold text-accent tracking-widest", children: [
                  String(countdown.days).padStart(2, "0"),
                  "d",
                  " ",
                  String(countdown.hours).padStart(2, "0"),
                  "h",
                  " ",
                  String(countdown.minutes).padStart(2, "0"),
                  "m",
                  " ",
                  String(countdown.seconds).padStart(2, "0"),
                  "s"
                ] })
              ]
            }
          ),
          !isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-white font-mono", children: "GRIT BALANCE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center h-10 rounded border border-accent/30 bg-accent/5 px-3 w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-accent text-sm truncate", children: gritBalance !== void 0 ? formatGrit(gritBalance) : "—" }) })
          ] }),
          !isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white uppercase tracking-widest font-mono", children: "Connected Chain" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `font-mono ${isOnTargetChain ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`,
                    "data-ocid": "burn.chain_badge",
                    children: wallet.chainName ? CHAIN_LABELS[wallet.chainName] ?? wallet.chainName : "Unknown"
                  }
                )
              ] }),
              selectedToken && !isOnTargetChain && /* @__PURE__ */ jsxRuntimeExports.jsx(
                WrongChainBanner,
                {
                  chainLabel: CHAIN_LABELS[selectedToken.chain] ?? selectedToken.chain,
                  onSwitch: handleSwitchChain
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "chain-select",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Select a Chain"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  disabled: isBusy || isTerminal,
                  value: selectedChain,
                  onValueChange: async (val) => {
                    setSelectedChain(val);
                    setSelectedToken(null);
                    setAmount("");
                    if (val !== "all") {
                      const targetChainId = getChainId(val);
                      if (targetChainId && wallet.chainId !== targetChainId) {
                        try {
                          await wallet.switchToChain(targetChainId);
                        } catch {
                        }
                      }
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "chain-select",
                        className: "bg-background border-border font-mono text-sm text-gray-400",
                        "data-ocid": "burn.chain_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Chains" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectItem,
                        {
                          value: "all",
                          className: "font-mono text-sm text-gray-400",
                          children: "All Chains"
                        }
                      ),
                      availableChains.map((chain) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectItem,
                        {
                          value: chain,
                          className: "font-mono text-sm text-gray-400",
                          children: CHAIN_LABELS[chain] ?? chain
                        },
                        chain
                      ))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "token-select",
                      className: "text-xs uppercase tracking-widest text-white font-mono",
                      children: "Select a Token"
                    }
                  ),
                  tokensLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Skeleton,
                    {
                      className: "h-10 w-full bg-muted",
                      "data-ocid": "burn.token_loading_state"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      disabled: isBusy || isTerminal,
                      onValueChange: async (val) => {
                        const tok = (tokens ?? []).find(
                          (t) => `${t.chain}::${t.tokenAddress}` === val
                        );
                        setSelectedToken(tok ?? null);
                        setAmount("");
                        if (tok) {
                          const targetChainId = getChainId(tok.chain);
                          if (targetChainId && wallet.chainId !== targetChainId) {
                            try {
                              await wallet.switchToChain(targetChainId);
                            } catch {
                            }
                          }
                        }
                      },
                      "data-ocid": "burn.token_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            id: "token-select",
                            className: "bg-background border-border font-mono text-sm",
                            "data-ocid": "burn.token_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a token…" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: filteredTokens.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "px-3 py-4 text-xs text-muted-foreground text-center",
                            "data-ocid": "burn.token_empty_state",
                            children: "No tokens on allowlist. Ask an admin to add tokens."
                          }
                        ) : filteredTokens.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          SelectItem,
                          {
                            value: `${t.chain}::${t.tokenAddress}`,
                            className: "font-mono text-sm",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-accent", children: t.symbol }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-2 text-xs", children: CHAIN_LABELS[t.chain] ?? t.chain })
                            ]
                          },
                          `${t.chain}-${t.tokenAddress}`
                        )) })
                      ]
                    }
                  )
                ] }),
                selectedToken && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:w-40 sm:shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-white font-mono mb-1.5", children: "Live Price" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
                    priceLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, y: -4 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -4 },
                        className: "flex items-center gap-2 h-10 rounded border border-border/60 bg-muted/30 px-3",
                        "data-ocid": "burn.price_loading_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "Fetching…" })
                        ]
                      },
                      "price-loading"
                    ),
                    !priceLoading && livePrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, y: -4 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -4 },
                        className: "flex items-center gap-1.5 h-10 rounded border border-border/60 bg-muted/30 px-3",
                        "data-ocid": "burn.price_display",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-400 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-foreground", children: [
                            "$",
                            livePrice.toLocaleString("en-US", {
                              minimumFractionDigits: 4,
                              maximumFractionDigits: 8
                            })
                          ] })
                        ]
                      },
                      "price-ok"
                    ),
                    priceUnavailable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, y: -4 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -4 },
                        className: "rounded border border-red-500/30 bg-red-500/10 px-3 py-2 space-y-1",
                        "data-ocid": "burn.price_error_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 text-red-400 shrink-0" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 font-mono", children: "Unavailable" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              className: "h-6 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono uppercase tracking-widest w-full",
                              onClick: () => {
                                if (selectedToken) {
                                  qc.removeQueries({
                                    queryKey: [
                                      "livePrice",
                                      selectedToken.tokenAddress
                                    ]
                                  });
                                  void refetchPrice();
                                }
                              },
                              "data-ocid": "burn.price_retry_button",
                              children: "Retry"
                            }
                          )
                        ]
                      },
                      "price-error"
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TokenBalanceDisplay,
                {
                  selectedToken,
                  walletAddress: wallet.isConnected ? wallet.address : void 0,
                  livePrice: livePrice ?? null
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "burn-amount",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Amount to Burn"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "burn-amount",
                      type: "number",
                      min: "0",
                      step: "any",
                      value: amount,
                      onChange: (e) => setAmount(e.target.value),
                      placeholder: "0.00",
                      disabled: isBusy || isTerminal || !selectedToken || priceUnavailable,
                      className: "w-full bg-background border border-border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                      "data-ocid": "burn.amount_input"
                    }
                  ),
                  selectedToken && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground", children: selectedToken.symbol })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "w-full sm:w-40 sm:shrink-0",
                    "data-ocid": "burn.grit_estimate",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-white font-accent mb-1.5", children: "Est. GRIT" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center h-10 rounded border border-accent/30 bg-accent/5 px-3", children: priceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-accent shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "…" })
                      ] }) : priceUnavailable || !selectedToken ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground/60", children: "—" }) : parsedAmount > 0 && priceLoaded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-accent text-sm energy-pulse truncate", children: gritEstimate > 0 ? `~${formatGrit(BigInt(gritEstimate))}` : "< 1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground/50", children: "—" }) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: step === "idle" && selectedToken && parsedAmount > 0 && priceLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                className: "rounded border border-border/60 bg-muted/20 px-3 py-2.5 flex items-center justify-between gap-2",
                "data-ocid": "burn.fee_preview",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                    "Platform fee (",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#4ade80" }, children: feeDisplay }),
                    "):",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                      formatUSDValue(
                        parsedAmount * (livePrice ?? 0) * feeRate
                      ),
                      " ",
                      "USD"
                    ] }),
                    " ",
                    "+ Gas fees in",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "white" }, children: gasTokenForChain(selectedToken.chain) }),
                    " ",
                    "are required to complete the burn."
                  ] })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
              priceUnavailable && step === "idle" && !isRunningInBackground && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs text-red-400 font-mono text-center mb-2 flex items-center justify-center gap-1",
                  "data-ocid": "burn.price_unavailable_label",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 shrink-0" }),
                    "Price unavailable — burn disabled until live price is fetched"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => {
                    if (isRunningInBackground) {
                      setModalOpen(true);
                    } else {
                      void handleBurn();
                    }
                  },
                  disabled: !canBurn && !isRunningInBackground,
                  className: "w-full h-12 bg-accent text-background hover:bg-accent/90 font-display font-black text-lg uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40",
                  "data-ocid": "burn.burn_button",
                  children: isRunningInBackground ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                    "View Progress"
                  ] }) : step === "idle" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }),
                    "Burn Tokens"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                    STEP_BUTTON_LABELS[step] ?? "Processing…"
                  ] })
                }
              ),
              isBurnBlocked && !isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-yellow-400 font-mono text-xs text-center mt-2 border border-yellow-500 px-3 py-2",
                  "data-ocid": "burn.gate_blocked_message",
                  children: "Launch NFTs not detected. Burn access disabled. Try again after obtaining the NFTs."
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BurnProgressModal,
          {
            open: modalOpen,
            step,
            verifiedGrit,
            errorMsg,
            priceNote,
            userRejected,
            onClose: handleModalClose,
            onContinueInBackground: handleContinueInBackground,
            formatGrit: (v) => formatGrit(v)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", "data-ocid": "claim_history.card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-xl sm:text-3xl uppercase tracking-widest text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-accent" }),
            "RECENT BURNS"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: (claimHistory ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-8 text-center text-muted-foreground text-sm",
              "data-ocid": "claim_history.empty_state",
              children: "No claims yet. Burn tokens above to get started."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", "data-ocid": "claim_history.list", children: [
            (claimHistory ?? []).slice(0, 5).map((record, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-1.5 sm:gap-3 items-start sm:items-center py-2.5 border-b border-border/50 last:border-0",
                "data-ocid": `claim_history.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 w-full sm:contents", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "a",
                        {
                          href: getExplorerUrl(record.txHash, record.chain),
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "font-mono text-xs text-accent hover:underline flex items-center gap-1 group",
                          "data-ocid": `claim_history.tx_link.${i + 1}`,
                          children: [
                            truncateAddress(record.txHash, 10),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 opacity-0 group-hover:opacity-100 transition-smooth" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        CHAIN_LABELS[record.chain] ?? record.chain,
                        " ·",
                        " ",
                        record.tokenSymbol || truncateAddress(record.tokenAddress)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-foreground sm:hidden", children: [
                      formatGrit(record.gritMinted),
                      " GRIT"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:block font-mono text-sm text-foreground", children: [
                    formatGrit(record.gritMinted),
                    " GRIT"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden w-full flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClaimStatusBadge, { status: record.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClaimStatusBadge, { status: record.status }) })
                ]
              },
              record.txHash
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/dashboard",
                className: "font-mono text-xs text-gray-400 hover:text-[#00ff41] hover:drop-shadow-[0_0_6px_#00ff41] uppercase tracking-widest transition-colors duration-200",
                "data-ocid": "claim_history.view_burn_history_link",
                children: "FULL BURN HISTORY"
              }
            ) })
          ] }) })
        ] })
      ]
    }
  );
}
function getChainNameFromId(chainId) {
  if (chainId === 8453) return "base";
  if (chainId === 42220) return "celo";
  if (chainId === 10) return "optimism";
  if (chainId === 1) return "ethereum";
  return null;
}
function getNativeSymbol(chainId) {
  if (chainId === 42220) return "CELO";
  return "ETH";
}
function getChainName(chainId) {
  if (!chainId) return "Unknown";
  const map = {
    8453: "Base",
    42220: "Celo",
    10: "Optimism",
    1: "Ethereum"
  };
  return map[chainId] ?? `Chain ${chainId}`;
}
function CreateMinerModal({ open, onClose }) {
  var _a;
  const { data: gritBalance = 0n } = useMyBalance();
  const { data: feeConfig } = useMinerCreationFees();
  const { data: feeRecipient } = useGetFeeRecipient();
  const createMiner = useCreateMiner();
  const wallet = useWallet();
  const [name, setName] = reactExports.useState("");
  const [gritInput, setGritInput] = reactExports.useState("");
  const [rate, setRate] = reactExports.useState(1e9);
  const [step, setStep] = reactExports.useState("idle");
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  const chainId = wallet.chainId;
  const chainNameKey = getChainNameFromId(chainId);
  const nativeSymbol = getNativeSymbol(chainId);
  const chainName = getChainName(chainId);
  const creationFeeWei = chainNameKey && feeConfig ? ((_a = feeConfig.find((e) => e.chain === chainNameKey)) == null ? void 0 : _a.feeWei) ?? 0n : 0n;
  const creationFeeEth = Number(creationFeeWei) / 1e18;
  const parsedGrit = gritInput.trim() ? BigInt(Math.floor(Number(gritInput.trim()) * 1e9)) : 0n;
  const hasInsufficientGrit = parsedGrit > gritBalance;
  const canCreate = step === "idle" && name.trim().length > 0 && parsedGrit > 0n && !hasInsufficientGrit && wallet.isConnected;
  function handleClose() {
    if (step === "paying_fee" || step === "creating") return;
    setName("");
    setGritInput("");
    setRate(1e9);
    setStep("idle");
    setErrorMsg(null);
    onClose();
  }
  async function handleCreate() {
    if (!canCreate) return;
    setErrorMsg(null);
    try {
      if (creationFeeWei > 0n) {
        if (!feeRecipient || !feeRecipient.startsWith("0x")) {
          setErrorMsg("Fee recipient not configured. Contact an admin.");
          setStep("error");
          return;
        }
        setStep("paying_fee");
        await wallet.sendTransaction({
          to: feeRecipient,
          data: "0x",
          value: creationFeeWei,
          chainId: chainId ?? void 0
        });
      }
      setStep("creating");
      const result = await createMiner.mutateAsync({
        name: name.trim(),
        gritAmount: parsedGrit,
        rate: BigInt(rate)
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setStep("done");
      ue.success(
        "Miner created! It will start competing from the next block."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error occurred.";
      setErrorMsg(msg);
      setStep("error");
    }
  }
  const isBusy = step === "paying_fee" || step === "creating";
  const rateDisplay = (rate / 1e9).toFixed(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "mining.create_miner_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display font-black uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5 text-accent" }),
          "Create Miner"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "miner-name",
                className: "text-xs uppercase tracking-widest text-white font-mono",
                children: "Miner Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "miner-name",
                type: "text",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "My Miner",
                disabled: isBusy || step === "done",
                maxLength: 20,
                className: "w-full bg-background border border-border rounded-md h-10 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                "data-ocid": "mining.miner_name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "grit-load",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Load GRIT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                "Available:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                  formatGrit(gritBalance),
                  " GRIT"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "grit-load",
                  type: "number",
                  min: "0",
                  step: "any",
                  value: gritInput,
                  onChange: (e) => setGritInput(e.target.value),
                  placeholder: "0",
                  disabled: isBusy || step === "done",
                  className: [
                    "w-full bg-background border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                    hasInsufficientGrit ? "border-red-500/60" : "border-border"
                  ].join(" "),
                  "data-ocid": "mining.grit_load_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground", children: "GRIT" })
            ] }),
            hasInsufficientGrit && step !== "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-red-400 font-mono",
                "data-ocid": "mining.grit_load_input.field_error",
                children: "Insufficient GRIT balance."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "mining-rate",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Mining Rate"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-accent", children: [
                rateDisplay,
                " B GRIT/day"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "mining-rate",
                type: "range",
                min: 1,
                max: 10,
                step: 1,
                value: rate / 1e9,
                onChange: (e) => setRate(Number(e.target.value) * 1e9),
                disabled: isBusy || step === "done",
                className: "w-full accent-accent cursor-pointer disabled:opacity-50",
                "data-ocid": "mining.rate_slider"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1B/day (min)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10B/day (max)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border/60 bg-muted/20 px-3 py-2.5 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Creation Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground", children: creationFeeWei === 0n ? "Free" : `${creationFeeEth.toFixed(6)} ${nativeSymbol} on ${chainName}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
            isBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 4 },
                className: "flex items-center gap-2 text-sm font-mono text-accent",
                "data-ocid": "mining.create_loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin shrink-0" }),
                  step === "paying_fee" ? "Paying creation fee…" : "Creating miner on ICP…"
                ]
              },
              step
            ),
            step === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                className: "flex items-center gap-2 text-sm font-mono text-emerald-400",
                "data-ocid": "mining.create_success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
                  "Miner created successfully!"
                ]
              },
              "done"
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              className: "rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 flex items-start gap-2",
              "data-ocid": "mining.create_error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errorMsg })
              ]
            }
          ) }),
          !wallet.isConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-300 font-mono", children: "Connect your EVM wallet to pay the creation fee." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 pt-1", children: step !== "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleClose,
                disabled: isBusy,
                className: "flex-1 border-border font-mono text-xs uppercase tracking-widest transition-smooth",
                "data-ocid": "mining.create_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleCreate,
                disabled: !canCreate || isBusy,
                className: "flex-1 bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40",
                "data-ocid": "mining.create_submit_button",
                children: [
                  isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
                  step === "paying_fee" ? "Paying…" : "Create"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleClose,
              className: "w-full bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest transition-smooth",
              "data-ocid": "mining.create_close_button",
              children: "Done"
            }
          ) })
        ] })
      ]
    }
  ) });
}
function EditMinerModal({ miner, open, onClose }) {
  const { data: gritBalance = 0n } = useMyBalance();
  const editMiner = useEditMiner();
  const [name, setName] = reactExports.useState(miner.name);
  const [topUpInput, setTopUpInput] = reactExports.useState("");
  const [rate, setRate] = reactExports.useState(Number(miner.miningRate) / 1e9);
  const [step, setStep] = reactExports.useState(
    "idle"
  );
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void miner.id;
    setName(miner.name);
    setTopUpInput("");
    setRate(Number(miner.miningRate) / 1e9);
    setStep("idle");
    setErrorMsg(null);
  }, [miner.id, miner.name, miner.miningRate]);
  const topUpParsed = topUpInput.trim() ? BigInt(Math.floor(Number(topUpInput.trim()) * 1e9)) : null;
  const hasInsufficientTopUp = topUpParsed !== null && topUpParsed > gritBalance;
  const isBusy = step === "saving";
  const isPaused = miner.status === MinerStatus.paused;
  const isExhausted = miner.status === MinerStatus.exhausted;
  const rateDisplay = rate.toFixed(0);
  function handleClose() {
    if (isBusy) return;
    onClose();
  }
  async function handleSave() {
    if (isBusy) return;
    setErrorMsg(null);
    setStep("saving");
    try {
      const nameChanged = name.trim() !== miner.name ? name.trim() : null;
      const rateChanged = BigInt(rate) * 1000000000n !== miner.miningRate ? BigInt(rate) * 1000000000n : null;
      const result = await editMiner.mutateAsync({
        minerId: miner.id,
        nameChange: nameChanged,
        topUp: topUpParsed,
        rateChange: rateChanged,
        pause: null
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setStep("done");
      ue.success("Miner updated successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(msg);
      setStep("error");
    }
  }
  async function handleTogglePause() {
    if (isBusy || isExhausted) return;
    setErrorMsg(null);
    setStep("saving");
    try {
      const result = await editMiner.mutateAsync({
        minerId: miner.id,
        nameChange: null,
        topUp: null,
        rateChange: null,
        pause: !isPaused
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setStep("done");
      ue.success(isPaused ? "Miner resumed." : "Miner paused.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(msg);
      setStep("error");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "mining.edit_miner_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display font-black uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5 text-accent" }),
          "Edit Miner"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded border border-border/60 bg-muted/20 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-white uppercase tracking-widest", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              miner.status === MinerStatus.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border-emerald-500/30", children: "Active" }),
              miner.status === MinerStatus.paused && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-yellow-500/15 text-yellow-400 border-yellow-500/30", children: "Paused" }),
              miner.status === MinerStatus.exhausted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-widest bg-red-500/15 text-red-400 border-red-500/30", children: "Exhausted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 inline mr-1 text-accent" }),
                formatGrit(miner.gritBalance),
                " GRIT"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "edit-miner-name",
                className: "text-xs uppercase tracking-widest text-white font-mono",
                children: "Miner Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "edit-miner-name",
                type: "text",
                value: name,
                onChange: (e) => setName(e.target.value),
                disabled: isBusy || step === "done",
                maxLength: 48,
                className: "w-full bg-background border border-border rounded-md h-10 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                "data-ocid": "mining.edit_name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "edit-topup",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Top Up GRIT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                "Available:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                  formatGrit(gritBalance),
                  " GRIT"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "edit-topup",
                  type: "number",
                  min: "0",
                  step: "any",
                  value: topUpInput,
                  onChange: (e) => setTopUpInput(e.target.value),
                  placeholder: "Optional top-up amount",
                  disabled: isBusy || step === "done",
                  className: [
                    "w-full bg-background border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth",
                    hasInsufficientTopUp ? "border-red-500/60" : "border-border"
                  ].join(" "),
                  "data-ocid": "mining.edit_topup_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground", children: "GRIT" })
            ] }),
            hasInsufficientTopUp && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-red-400 font-mono",
                "data-ocid": "mining.edit_topup_input.field_error",
                children: "Insufficient GRIT balance."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "edit-rate",
                  className: "text-xs uppercase tracking-widest text-white font-mono",
                  children: "Mining Rate"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-accent", children: [
                rateDisplay,
                " B GRIT/day"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "edit-rate",
                type: "range",
                min: 1,
                max: 10,
                step: 1,
                value: rate,
                onChange: (e) => setRate(Number(e.target.value)),
                disabled: isBusy || step === "done",
                className: "w-full accent-accent cursor-pointer disabled:opacity-50",
                "data-ocid": "mining.edit_rate_slider"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1B/day (min)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10B/day (max)" })
            ] })
          ] }),
          !isExhausted && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleTogglePause,
              disabled: isBusy || step === "done",
              className: [
                "w-full border font-mono text-xs uppercase tracking-widest gap-2 transition-smooth",
                isPaused ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10" : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
              ].join(" "),
              "data-ocid": "mining.edit_pause_toggle",
              children: isPaused ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
                " Resume Miner"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3.5 w-3.5" }),
                " Pause Miner"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
            isBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 4 },
                className: "flex items-center gap-2 text-sm font-mono text-accent",
                "data-ocid": "mining.edit_loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin shrink-0" }),
                  "Saving changes…"
                ]
              },
              "saving"
            ),
            step === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                className: "flex items-center gap-2 text-sm font-mono text-emerald-400",
                "data-ocid": "mining.edit_success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
                  "Changes saved!"
                ]
              },
              "done"
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              className: "rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 flex items-start gap-2",
              "data-ocid": "mining.edit_error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errorMsg })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 pt-1", children: step !== "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleClose,
                disabled: isBusy,
                className: "flex-1 border-border font-mono text-xs uppercase tracking-widest transition-smooth",
                "data-ocid": "mining.edit_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleSave,
                disabled: isBusy || hasInsufficientTopUp || step === "error",
                className: "flex-1 bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40",
                "data-ocid": "mining.edit_save_button",
                children: [
                  isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
                  "Save"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleClose,
              className: "w-full bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest transition-smooth",
              "data-ocid": "mining.edit_close_button",
              children: "Done"
            }
          ) })
        ] })
      ]
    }
  ) });
}
function formatAkk(amount) {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });
}
function formatRate(rate) {
  const bn = Number(rate) / 1e9;
  return `${bn.toLocaleString("en-US", { maximumFractionDigits: 2 })} B GRIT/day`;
}
function formatTimestamp(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleString();
}
function MinerStatusBadge({ status }) {
  if (status === MinerStatus.active)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border-emerald-500/30", children: "Active" });
  if (status === MinerStatus.paused)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-yellow-500/15 text-yellow-400 border-yellow-500/30", children: "Paused" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-red-500/15 text-red-400 border-red-500/30", children: "Exhausted" });
}
function StatCard({
  label,
  value,
  icon,
  labelClass,
  valueClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-4 flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: labelClass ?? "text-xs uppercase tracking-widest font-mono",
          children: label
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: valueClass ?? "font-mono font-bold text-xl text-foreground",
        children: value
      }
    )
  ] });
}
function MinerCard({
  miner,
  index,
  onEdit
}) {
  const isExhausted = miner.status === MinerStatus.exhausted;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.06 },
      className: [
        "bg-card border border-border p-4 flex flex-col gap-3 transition-smooth",
        isExhausted ? "opacity-50" : ""
      ].join(" "),
      "data-ocid": `mining.miner_card.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-wrap items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground truncate shrink-0 max-w-[150px] sm:max-w-[180px] text-[1.1rem] sm:text-[1.275rem]", children: miner.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MinerStatusBadge, { status: miner.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "@ ",
              formatRate(miner.miningRate)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => onEdit(miner),
              className: "shrink-0 ml-auto border-border hover:border-accent/60 font-mono text-xs uppercase tracking-widest transition-smooth",
              "data-ocid": `mining.edit_button.${index + 1}`,
              children: "Edit"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1 sm:gap-2 border-t border-border/50 pt-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center", children: "GRIT SPENT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs sm:text-sm font-bold text-foreground text-center", children: formatGrit(
              miner.gritSpent ?? 0n
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center", children: "BLOCKS MINED" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs sm:text-sm font-bold text-foreground text-center", children: (miner.blocksMined ?? 0n).toString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center", children: "GRIT BALANCE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs sm:text-sm font-bold text-accent text-center", children: formatGrit(miner.gritBalance) })
          ] })
        ] })
      ]
    }
  );
}
function BlockHistoryRow({
  block,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "py-2.5 border-b border-border/50 last:border-0 text-xs font-mono",
      "data-ocid": `mining.block_history.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground tabular-nums shrink-0", children: [
            "#",
            Number(block.blockNumber)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate flex-1 min-w-0", children: block.winnerOwner ? truncateAddress(block.winnerOwner.toText(), 8) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "No winner" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-bold shrink-0", children: [
            formatAkk(block.akkReward),
            " AKK"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mt-0.5", children: formatTimestamp(block.timestamp) })
      ]
    }
  );
}
function MiningPage({ embedded = false }) {
  const { isAuthenticated } = useAuth();
  const { data: miners = [], isLoading: minersLoading } = useMyMiners();
  const { data: miningStats } = useUserMiningStats();
  const { data: blockHistory = [], isLoading: historyLoading } = useBlockHistory(10n);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editMiner, setEditMiner] = reactExports.useState(null);
  const { data: launchGateData } = useGetLaunchGateConfig();
  const [launchCountdown, setLaunchCountdown] = reactExports.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const isLaunchTimeBlocked = !!((launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) && Date.now() < Number((launchGateData == null ? void 0 : launchGateData.launchTime) ?? 0));
  reactExports.useEffect(() => {
    if (!(launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLaunchCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setLaunchCountdown({
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff % 864e5 / 36e5),
        minutes: Math.floor(diff % 36e5 / 6e4),
        seconds: Math.floor(diff % 6e4 / 1e3)
      });
    };
    tick();
    const iv = setInterval(tick, 1e3);
    return () => clearInterval(iv);
  }, [launchGateData == null ? void 0 : launchGateData.launchTimeEnabled, launchGateData == null ? void 0 : launchGateData.launchTime]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: embedded ? "space-y-4" : "max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4",
      "data-ocid": "mining.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { className: "h-[1.53rem] w-[1.53rem] text-accent" }),
            "MINE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm mt-0.5", children: [
            "Spend GRIT to mine",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-mono", children: "$AKK" }),
            " — deploy miners, set rates, and compete for each block reward."
          ] })
        ] }) }),
        isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent font-mono", children: "LAUNCH OPENS IN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-2xl font-bold text-accent tracking-widest", children: [
            String(launchCountdown.days).padStart(2, "0"),
            "d",
            " ",
            String(launchCountdown.hours).padStart(2, "0"),
            "h",
            " ",
            String(launchCountdown.minutes).padStart(2, "0"),
            "m",
            " ",
            String(launchCountdown.seconds).padStart(2, "0"),
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "BLOCKS MINED",
              value: miningStats ? miningStats.blocksMined.toString() : "0",
              labelClass: "text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white",
              valueClass: "text-base sm:text-xl text-foreground font-bold font-mono truncate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "AKK WON",
              value: miningStats ? formatAkk(miningStats.akkWon) : "0",
              labelClass: "text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white",
              valueClass: "text-base sm:text-2xl text-accent font-bold font-mono truncate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "GRIT SPENT",
              value: miningStats ? formatGrit(miningStats.gritSpent) : "0",
              labelClass: "text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white",
              valueClass: "text-base sm:text-2xl text-accent font-bold font-mono truncate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "ACTIVE MINERS",
              value: miners ? miners.filter((m) => m.status === MinerStatus.active).length.toString() : "0",
              labelClass: "text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white",
              valueClass: "text-base sm:text-xl text-foreground font-bold font-mono truncate"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mining.miners_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-[1.43rem] uppercase tracking-widest text-accent flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
              "MY MINERS"
            ] }),
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                disabled: isLaunchTimeBlocked,
                onClick: () => setCreateOpen(true),
                className: "bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 h-9 px-4 text-sm transition-smooth",
                "data-ocid": "mining.create_miner_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Create Miner"
                ]
              }
            )
          ] }),
          minersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full bg-muted" }, i)) }) : miners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "border border-dashed border-border/60 py-12 flex flex-col items-center justify-center gap-3 text-center",
              "data-ocid": "mining.miners_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border border-border bg-muted/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-6 w-6 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground uppercase tracking-wide", children: "No Miners Yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Create your first miner to start competing for AKK block rewards." })
                ] }),
                isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    disabled: isLaunchTimeBlocked,
                    size: "sm",
                    onClick: () => setCreateOpen(true),
                    className: "bg-accent text-background hover:bg-accent/90 font-mono text-xs uppercase tracking-widest gap-1.5 transition-smooth",
                    "data-ocid": "mining.empty_create_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                      "Create Miner"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "mining.miners_list", children: miners.map((miner, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MinerCard,
            {
              miner,
              index: i,
              onEdit: setEditMiner
            },
            Number(miner.id)
          )) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "bg-card border-border",
            "data-ocid": "mining.block_history_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-xl sm:text-3xl uppercase tracking-widest text-white flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-accent" }),
                "RECENT BLOCKS"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-muted" }, i)) }) : blockHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "py-8 text-center text-muted-foreground text-sm",
                  "data-ocid": "mining.block_history_empty_state",
                  children: "No blocks mined yet. Mining starts once a miner is created."
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mining.block_history_list", className: "-mt-2", children: [
                [...blockHistory].sort((a, b) => Number(b.blockNumber - a.blockNumber)).slice(0, 5).map((block, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BlockHistoryRow,
                  {
                    block,
                    index: i
                  },
                  Number(block.blockNumber)
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/mining/blocks",
                    className: "font-mono text-xs text-gray-400 hover:text-[#00ff41] hover:drop-shadow-[0_0_6px_#00ff41] uppercase tracking-widest transition-colors duration-200",
                    "data-ocid": "mining.blocks_history_link",
                    children: "FULL BLOCK HISTORY"
                  }
                ) })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CreateMinerModal,
          {
            open: createOpen,
            onClose: () => setCreateOpen(false)
          }
        ),
        editMiner && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditMinerModal,
          {
            miner: editMiner,
            open: !!editMiner,
            onClose: () => setEditMiner(null)
          }
        )
      ]
    }
  );
}
function AkorePage() {
  const [activeSection, setActiveSection] = reactExports.useState(null);
  const expandedRef = reactExports.useRef(null);
  const { data: launchGateData } = useGetLaunchGateConfig();
  const [countdown, setCountdown] = reactExports.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  reactExports.useEffect(() => {
    if (!(launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(
        diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
      );
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      setCountdown({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [launchGateData == null ? void 0 : launchGateData.launchTimeEnabled, launchGateData == null ? void 0 : launchGateData.launchTime]);
  const isLaunchTimeBlocked = !!((launchGateData == null ? void 0 : launchGateData.launchTimeEnabled) && Date.now() < Number(launchGateData.launchTime ?? 0));
  function toggle(section) {
    setActiveSection((prev) => {
      const isExpanding = prev !== section;
      if (isExpanding) {
        setTimeout(() => {
          var _a;
          (_a = expandedRef.current) == null ? void 0 : _a.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 300);
      }
      return isExpanding ? section : null;
    });
  }
  const steps = [
    {
      id: "acquire",
      num: "1",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-7 w-7 text-accent" }),
      title: "ACQUIRE",
      subtitle: "RegNet Tokens",
      ocid: "akore.step_acquire.card"
    },
    {
      id: "burn",
      num: "2",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7 text-accent" }),
      title: "BURN",
      subtitle: "RegNet Tokens",
      ocid: "akore.step_burn.card"
    },
    {
      id: "mine",
      num: "3",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pickaxe, { className: "h-7 w-7 text-accent" }),
      title: "MINE",
      subtitle: "$AKK",
      ocid: "akore.step_mine.card"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "akore.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
            "AKORE"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm mt-1 break-words", children: [
            "The Schelling point of civilisational coordination.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Mine $AKK, power Anti Krisis." })
          ] })
        ] }),
        isLaunchTimeBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2",
            "data-ocid": "akore.launch_countdown",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent font-mono", children: "LAUNCH OPENS IN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-2xl sm:text-3xl font-bold text-accent tracking-widest", children: [
                String(countdown.days).padStart(2, "0"),
                "d",
                " ",
                String(countdown.hours).padStart(2, "0"),
                "h",
                " ",
                String(countdown.minutes).padStart(2, "0"),
                "m",
                " ",
                String(countdown.seconds).padStart(2, "0"),
                "s"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-l-2 border-accent pl-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl uppercase tracking-widest text-foreground", children: "STEPS" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0", children: steps.map((step, idx) => {
            const isActive = activeSection === step.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggle(step.id),
                  "data-ocid": step.ocid,
                  className: [
                    "flex-1 bg-card border text-left p-3 sm:p-4 transition-all duration-200 cursor-pointer",
                    "hover:border-accent/70 hover:shadow-md",
                    isActive ? "border-accent" : "border-accent/30"
                  ].join(" "),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full h-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-mono text-accent leading-none select-none shrink-0", children: step.num }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xl shrink-0 ml-2 ${isActive ? "text-accent" : "text-accent/50"}`,
                          children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-2 mb-1", children: step.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[1.32rem] font-bold uppercase tracking-wider text-foreground leading-tight", children: step.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[0.963rem] uppercase tracking-wide text-accent/70 leading-tight", children: step.subtitle })
                    ] })
                  ] })
                }
              ),
              idx < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex items-center justify-center px-2 text-accent/50 text-2xl select-none shrink-0", children: "→" })
            ] }, step.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: expandedRef,
              className: "grid transition-all duration-500 ease-in-out",
              style: {
                gridTemplateRows: activeSection ? "1fr" : "0fr",
                opacity: activeSection ? 1 : 0
              },
              "data-ocid": "akore.expanded_panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-accent/30 bg-card p-4", children: [
                activeSection === "acquire" && /* @__PURE__ */ jsxRuntimeExports.jsx(AcquireSection, {}),
                activeSection === "burn" && /* @__PURE__ */ jsxRuntimeExports.jsx(BurnPage, { embedded: true }),
                activeSection === "mine" && /* @__PURE__ */ jsxRuntimeExports.jsx(MiningPage, { embedded: true })
              ] }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(VideoSection, {})
      ]
    }
  );
}
export {
  AkorePage
};
