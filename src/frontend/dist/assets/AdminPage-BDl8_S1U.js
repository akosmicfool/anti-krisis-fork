import { A as createLucideIcon, j as jsxRuntimeExports, cc as Root, r as reactExports, aZ as useComposedRefs, cd as WarningProvider, ce as Content, Z as composeEventHandlers, cf as Title, cg as Description, ch as Close, ci as createDialogScope, cj as Portal, ck as Overlay, cl as createSlottable, a0 as createContextScope, cm as Trigger, N as cn, cn as buttonVariants, u as useAuth, co as useIsAdmin, cp as ShieldCheck, d as useGetTokens, cq as useRemoveToken, R as RefreshCw, B as Button, S as Skeleton, t as truncateAddress, h as formatUSDValue, k as CHAIN_LABELS, cr as useAllowlistAuditLog, cs as AuditAction, ct as useGetMintRetryStats, cu as useGetPendingMints, cv as useGetAbandonedMints, cw as useRetryMint, cx as useGetAkkLedgerCanisterId, cy as useSetAkkLedgerCanisterId, cz as useGetAkkTransferFee, cA as useSetAkkTransferFee, cB as Label, cC as CircleCheck, n as useGetFeeRecipient, m as useGetFeePercent, cD as useSetFeeRecipient, cE as useSetFeePercent, I as Input, cF as Wallet, cG as useGetMinerCreationFees, cH as useSetMinerCreationFee, cI as useGetLaunchGateConfig, cJ as useSetLaunchTimeGate, cK as useSetNftGate, cL as useGetAdmins, cM as useAddAdmin, cN as useRemoveAdmin, cO as useCreditAbandonedMints, cP as fetchDexScreenerPrice, cQ as useAddToken, cR as Dialog, cS as DialogContent, cT as DialogHeader, cU as DialogTitle, cV as LoaderCircle, e as useGetGritIssuanceRate, cW as useGetIsLaunched, cX as useSetGritIssuanceRate, cY as useSetLaunched, cZ as getChainId, c_ as ETH_RPC_ENDPOINTS, c$ as createPublicClient, d0 as http } from "./index-D3Low12Q.js";
import { B as Badge, C as Cpu } from "./badge-BCuwcWHm.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DxqxDXJW.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BwuCvDfY.js";
import { u as ue } from "./index-BND4Q3ii.js";
import { u as useTestScore } from "./use-test-score-C_kip_Oj.js";
import { P as Plus, T as TriangleAlert } from "./triangle-alert-BnE7BoBr.js";
import { Z as Zap } from "./zap-DDLUb-Ol.js";
import "./chevron-up-DadPCsmE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
  ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
  ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
  ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
  ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
  ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
  ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
  ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCog = createLucideIcon("user-cog", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function CreditAbandonedMintsSection() {
  const creditMints = useCreditAbandonedMints();
  const [result, setResult] = reactExports.useState(null);
  const handleCredit = async () => {
    try {
      const res = await creditMints.mutateAsync();
      setResult({
        credited: Number(res.credited),
        total: Number(res.total)
      });
      setTimeout(() => setResult(null), 5e3);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to credit abandoned mints"
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "admin.credit_abandoned_mints.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-base uppercase tracking-widest text-foreground font-semibold", children: "CREDIT ABANDONED MINTS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Retroactively mint all abandoned rewards to winners on the AKK ledger. Use this after fixing a ledger configuration issue." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: handleCredit,
          disabled: creditMints.isPending,
          className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
          "data-ocid": "admin.credit_abandoned_mints.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
            creditMints.isPending ? "Crediting…" : "Credit Abandoned Mints"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "flex items-center gap-1 text-xs font-mono text-emerald-400",
          "data-ocid": "admin.credit_abandoned_mints.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
            "Credited ",
            result.credited,
            " of ",
            result.total,
            " abandoned mints"
          ]
        }
      ),
      creditMints.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "flex items-center gap-1 text-xs font-mono text-destructive",
          "data-ocid": "admin.credit_abandoned_mints.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
            creditMints.error instanceof Error ? creditMints.error.message : "Failed to credit abandoned mints"
          ]
        }
      )
    ] })
  ] });
}
function ScoreOverrideSection() {
  const {
    testScore,
    setTestScore,
    clearTestScore,
    testBadgeLevel,
    testBadgeName
  } = useTestScore();
  const [customInput, setCustomInput] = reactExports.useState("");
  const PRESETS = [
    { label: "PLAYER (690)", value: 690 },
    { label: "SUPER PLAYER (6,900)", value: 6900 },
    { label: "ALPHA PLAYER (69,000)", value: 69e3 }
  ];
  const handleSetCustom = () => {
    const n = Number(customInput);
    if (!Number.isFinite(n) || n < 0) return;
    setTestScore(n);
    setCustomInput("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-base uppercase tracking-widest text-foreground font-semibold", children: "SCORE OVERRIDE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Set a test AK69 score to simulate badge thresholds. For testing only." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setTestScore(p.value),
        "data-ocid": `admin.test_score_preset.${p.value}`,
        className: "font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors duration-150",
        children: p.label
      },
      p.value
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "custom-score-input",
          className: "font-mono text-xs uppercase tracking-widest text-foreground whitespace-nowrap",
          children: "CUSTOM SCORE"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "custom-score-input",
          type: "number",
          min: 0,
          placeholder: "e.g. 12345",
          value: customInput,
          onChange: (e) => setCustomInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleSetCustom(),
          "data-ocid": "admin.test_score_input",
          className: "w-36 font-mono text-sm h-8"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSetCustom,
          "data-ocid": "admin.test_score_set_button",
          className: "font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors duration-150",
          children: "SET"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: clearTestScore,
        "data-ocid": "admin.test_score_reset_button",
        className: "font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-destructive text-destructive bg-transparent hover:bg-destructive/10 transition-colors duration-150",
        children: "RESET TO REAL SCORE"
      }
    ) }),
    testScore !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "font-mono text-sm text-primary",
        "data-ocid": "admin.test_score_status",
        children: [
          "Test score active: ",
          testScore.toLocaleString(),
          " →",
          " ",
          testBadgeLevel > 0 ? testBadgeName : "No badge"
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "font-mono text-sm text-muted-foreground",
        "data-ocid": "admin.test_score_status",
        children: "No test override active."
      }
    )
  ] });
}
const CHAINS = ["ethereum", "arbitrum", "polygon", "optimism", "base"];
const CONTRACT_REGEX = /^0x[0-9a-fA-F]{40}$/;
const RPC_URLS = {
  8453: "https://mainnet.base.org",
  42220: "https://forno.celo.org",
  10: "https://mainnet.optimism.io",
  1: "https://ethereum.publicnode.com",
  137: "https://polygon-rpc.com",
  42161: "https://arb1.arbitrum.io/rpc"
};
const ERC20_ABI = [
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view"
  },
  {
    name: "name",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  }
];
async function fetchTokenDetailsFromRpc(tokenAddress, rpc) {
  const client = createPublicClient({ transport: http(rpc) });
  const [rawName, rawSymbol, rawDecimals] = await Promise.all([
    client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "name"
    }).catch(() => null),
    client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "symbol"
    }).catch(() => null),
    client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals"
    }).catch(() => null)
  ]);
  return {
    name: typeof rawName === "string" ? rawName : null,
    symbol: typeof rawSymbol === "string" ? rawSymbol : null,
    decimals: rawDecimals !== null && rawDecimals !== void 0 ? Number(rawDecimals) : null
  };
}
async function fetchTokenDetails(tokenAddress, chainId, _chain) {
  let name = null;
  let symbol = null;
  let decimals = null;
  let priceUSD = null;
  const rpcList = chainId === 1 ? [...ETH_RPC_ENDPOINTS] : RPC_URLS[chainId] ? [RPC_URLS[chainId]] : [];
  for (const rpc of rpcList) {
    try {
      const result = await fetchTokenDetailsFromRpc(tokenAddress, rpc);
      if (result.name !== null || result.symbol !== null || result.decimals !== null) {
        name = result.name;
        symbol = result.symbol;
        decimals = result.decimals;
        break;
      }
    } catch {
    }
  }
  const fetchedPrice = await fetchDexScreenerPrice(tokenAddress);
  const price = fetchedPrice ?? 0;
  if (price > 0) priceUSD = price;
  return { name, symbol, decimals, priceUSD };
}
function useLivePrices(tokens) {
  const [prices, setPrices] = reactExports.useState({});
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  const fetchAll = reactExports.useCallback(async (list) => {
    if (!list.length) return;
    setIsLoading(true);
    const unique = [...new Set(list.map((t) => t.tokenAddress.toLowerCase()))];
    const results = await Promise.all(
      unique.map(async (addr) => {
        const price = await fetchDexScreenerPrice(addr);
        return [addr, price];
      })
    );
    setPrices(Object.fromEntries(results));
    setIsLoading(false);
  }, []);
  reactExports.useEffect(() => {
    if (!tokens) return;
    fetchAll(tokens);
    timerRef.current = setInterval(() => fetchAll(tokens), 6e4);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tokens, fetchAll]);
  return { prices, isLoading };
}
const SYMBOL_DISPLAY_NAMES = {
  kVCM: "Klima Protocol",
  axlREGEN: "Regen Network",
  TGN: "Treegens",
  GIV: "Giveth"
};
function getTokenDisplayName(symbol, fallback) {
  return SYMBOL_DISPLAY_NAMES[symbol] ?? fallback;
}
function ChainBadge({ chain }) {
  const colors = {
    ethereum: "border-blue-400/40 text-blue-400",
    arbitrum: "border-sky-400/40 text-sky-400",
    polygon: "border-purple-400/40 text-purple-400",
    optimism: "border-red-400/40 text-red-400",
    base: "border-indigo-400/40 text-indigo-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `font-mono text-xs ${colors[chain] ?? "border-border text-muted-foreground"}`,
      children: CHAIN_LABELS[chain] ?? chain
    }
  );
}
function CopyBtn({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        navigator.clipboard.writeText(text);
        ue.success("Copied");
      },
      className: "ml-1 text-muted-foreground hover:text-accent transition-smooth",
      "aria-label": "Copy to clipboard",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3 w-3" })
    }
  );
}
const EMPTY_FORM = {
  tokenAddress: "",
  chain: "",
  name: "",
  symbol: "",
  decimals: "18",
  priceUSD: ""
};
function validateForm(form) {
  const e = {};
  if (!CONTRACT_REGEX.test(form.tokenAddress))
    e.tokenAddress = "Must be a valid 0x… address (40 hex chars)";
  if (!form.chain) e.chain = "Select a chain";
  if (!form.name.trim()) e.name = "Name is required";
  if (!form.symbol.trim()) e.symbol = "Symbol is required";
  const dec = Number(form.decimals);
  if (!Number.isInteger(dec) || dec < 0 || dec > 18)
    e.decimals = "Integer 0–18 required";
  const price = Number(form.priceUSD);
  if (Number.isNaN(price) || price <= 0) e.priceUSD = "Must be > 0";
  return e;
}
function FieldError({
  message,
  ocid
}) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", "data-ocid": ocid, children: message });
}
function AddTokenModal({ open, onClose }) {
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [touched, setTouched] = reactExports.useState(
    {}
  );
  const [isFetchingDetails, setIsFetchingDetails] = reactExports.useState(false);
  const [fetchError, setFetchError] = reactExports.useState(null);
  const [fetched, setFetched] = reactExports.useState({
    fetched: false,
    symbol: null,
    decimals: null,
    priceUSD: null,
    priceNotFound: false
  });
  const addToken = useAddToken();
  const errors = validateForm(form);
  const hasErrors = Object.keys(errors).length > 0;
  const canFetch = CONTRACT_REGEX.test(form.tokenAddress) && !!form.chain;
  async function handleFetchDetails() {
    if (!canFetch) return;
    setIsFetchingDetails(true);
    setFetchError(null);
    try {
      const chainId = getChainId(form.chain);
      const details = await fetchTokenDetails(
        form.tokenAddress,
        chainId,
        form.chain
      );
      setFetched({
        fetched: true,
        symbol: details.symbol,
        decimals: details.decimals,
        priceUSD: details.priceUSD,
        priceNotFound: details.priceUSD === null
      });
      setForm((f) => ({
        ...f,
        name: details.name ?? f.name,
        symbol: details.symbol ?? f.symbol,
        decimals: details.decimals !== null ? String(details.decimals) : f.decimals,
        priceUSD: details.priceUSD !== null ? String(details.priceUSD) : f.priceUSD
      }));
      if (!details.name && !details.symbol && details.decimals === null && details.priceUSD === null) {
        setFetchError(
          "Could not fetch token details. Check the address and chain, then try again."
        );
      }
    } catch {
      setFetchError(
        "Fetch failed. Check the address and chain, then try again."
      );
    } finally {
      setIsFetchingDetails(false);
    }
  }
  function bindInput(key) {
    return {
      value: form[key],
      onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [key]: true }))
    };
  }
  function touchAll() {
    setTouched(
      Object.fromEntries(
        Object.keys(EMPTY_FORM).map((k) => [k, true])
      )
    );
  }
  async function handleSubmit(e) {
    e.preventDefault();
    touchAll();
    if (hasErrors) return;
    const token = {
      tokenAddress: form.tokenAddress,
      chain: form.chain,
      name: form.name.trim(),
      symbol: form.symbol.trim().toUpperCase(),
      decimals: BigInt(form.decimals),
      priceUSD: Number(form.priceUSD)
    };
    try {
      await addToken.mutateAsync(token);
      ue.success(`${token.symbol} added to allowlist`);
      handleClose();
    } catch {
      ue.error("Failed to add token");
    }
  }
  function handleClose() {
    setForm(EMPTY_FORM);
    setTouched({});
    setFetched({
      fetched: false,
      symbol: null,
      decimals: null,
      priceUSD: null,
      priceNotFound: false
    });
    setFetchError(null);
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border border-border max-w-lg",
      "data-ocid": "add_token.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl text-foreground tracking-wide flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-accent" }),
          "Add Allowed Token"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
              "Contract Address ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ...bindInput("tokenAddress"),
                placeholder: "0x…",
                className: "mt-1.5 font-mono text-sm bg-background border-input",
                "data-ocid": "add_token.address_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldError,
              {
                message: touched.tokenAddress ? errors.tokenAddress : void 0,
                ocid: "add_token.address_input.field_error"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
              "Chain ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.chain,
                onValueChange: (v) => {
                  setForm((f) => ({ ...f, chain: v }));
                  setTouched((t) => ({ ...t, chain: true }));
                  setFetched({
                    fetched: false,
                    symbol: null,
                    decimals: null,
                    priceUSD: null,
                    priceNotFound: false
                  });
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "mt-1.5 bg-background border-input",
                      "data-ocid": "add_token.chain_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select chain…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border", children: CHAINS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, className: "font-mono text-sm", children: CHAIN_LABELS[c] }, c)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldError,
              {
                message: touched.chain ? errors.chain : void 0,
                ocid: "add_token.chain_select.field_error"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                disabled: !canFetch || isFetchingDetails,
                onClick: handleFetchDetails,
                className: "w-full border-accent/50 text-accent hover:bg-accent/10 font-mono uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40",
                "data-ocid": "add_token.fetch_details_button",
                children: isFetchingDetails ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                  " Fetching…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                  " Fetch Details"
                ] })
              }
            ),
            fetchError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive mt-1.5 font-mono",
                "data-ocid": "add_token.fetch_error_state",
                children: fetchError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...bindInput("name"),
                  placeholder: "Tether USD",
                  className: "mt-1.5 bg-background border-input",
                  "data-ocid": "add_token.name_input"
                }
              ),
              fetched.fetched && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Editable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldError,
                {
                  message: touched.name ? errors.name : void 0,
                  ocid: "add_token.name_input.field_error"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "Symbol ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              fetched.fetched ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: form.symbol || "—" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...bindInput("symbol"),
                  placeholder: "USDT",
                  className: "mt-1.5 bg-background border-input font-mono",
                  "data-ocid": "add_token.symbol_input"
                }
              ),
              fetched.fetched && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Auto-fetched" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldError,
                {
                  message: !fetched.fetched && touched.symbol ? errors.symbol : void 0,
                  ocid: "add_token.symbol_input.field_error"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "Decimals ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              fetched.fetched ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: form.decimals }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...bindInput("decimals"),
                  type: "number",
                  min: 0,
                  max: 18,
                  step: 1,
                  placeholder: "18",
                  className: "mt-1.5 bg-background border-input font-mono",
                  "data-ocid": "add_token.decimals_input"
                }
              ),
              fetched.fetched && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Auto-fetched" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldError,
                {
                  message: !fetched.fetched && touched.decimals ? errors.decimals : void 0,
                  ocid: "add_token.decimals_input.field_error"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "USD Price ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              fetched.fetched && !fetched.priceNotFound ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: form.priceUSD ? `${Number(form.priceUSD).toLocaleString("en-US", { maximumFractionDigits: 8 })}` : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Not listed" }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...bindInput("priceUSD"),
                  type: "number",
                  min: 0,
                  step: "any",
                  placeholder: fetched.priceNotFound ? "Enter price manually…" : "1.00",
                  className: `mt-1.5 bg-background border-input font-mono${fetched.priceNotFound ? " border-yellow-500/60" : ""}`,
                  "data-ocid": "add_token.price_input"
                }
              ),
              fetched.fetched && !fetched.priceNotFound && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "DexScreener" }),
              fetched.priceNotFound && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-yellow-400/80 mt-1 font-mono",
                  "data-ocid": "add_token.price_not_found_state",
                  children: "Price not found on DexScreener — enter manually"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldError,
                {
                  message: (fetched.priceNotFound || !fetched.fetched) && touched.priceUSD ? errors.priceUSD : void 0,
                  ocid: "add_token.price_input.field_error"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: handleClose,
                className: "text-muted-foreground",
                "data-ocid": "add_token.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                size: "sm",
                disabled: addToken.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 transition-smooth",
                "data-ocid": "add_token.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  addToken.isPending ? "Adding…" : "Add Token"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function AllowedTokensTab() {
  const { data: tokens, isLoading, isError } = useGetTokens();
  const removeToken = useRemoveToken();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(
    null
  );
  const { prices: livePrices, isLoading: pricesLoading } = useLivePrices(tokens);
  function getLivePrice(token) {
    return livePrices[token.tokenAddress.toLowerCase()] ?? null;
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await removeToken.mutateAsync({
        tokenAddress: deleteTarget.tokenAddress,
        chain: deleteTarget.chain
      });
      ue.success(`${deleteTarget.symbol} removed`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to remove token");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "allowed_tokens.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground", children: "CURRENT ALLOWLIST" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        pricesLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1 text-xs text-muted-foreground font-mono",
            "data-ocid": "allowed_tokens.prices_loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }),
              "Fetching prices…"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setAddOpen(true),
            className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
            "data-ocid": "allowed_tokens.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add Token"
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "allowed_tokens.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-muted" }, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive font-mono text-center",
        "data-ocid": "allowed_tokens.error_state",
        children: "Failed to load allowlist"
      }
    ) : !(tokens == null ? void 0 : tokens.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-dashed border-border bg-muted/10 py-14 flex flex-col items-center gap-3 text-center",
        "data-ocid": "allowed_tokens.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display text-foreground", children: "No tokens allowlisted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add ERC-20 contracts to accept burns from" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setAddOpen(true),
              className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs mt-1",
              "data-ocid": "allowed_tokens.empty_state.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                "Add First Token"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border overflow-x-auto",
        "data-ocid": "allowed_tokens.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[120px_70px_180px_100px_50px_100px_48px] min-w-[760px] bg-muted/40 border-b border-border px-4 py-2.5 gap-3", children: [
            "Name",
            "Symbol",
            "Contract Address",
            "Chain",
            "Dec.",
            "USD Price",
            ""
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono uppercase tracking-widest text-white",
              children: h
            },
            h || "actions"
          )) }),
          tokens.map((token, idx) => {
            const livePrice = getLivePrice(token);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-[120px_70px_180px_100px_50px_100px_48px] min-w-[760px] items-center px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth gap-3",
                "data-ocid": `allowed_tokens.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-display text-foreground truncate", children: getTokenDisplayName(token.symbol, token.name) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-accent uppercase", children: token.symbol }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center font-mono text-xs text-muted-foreground min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", title: token.tokenAddress, children: truncateAddress(token.tokenAddress, 8) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text: token.tokenAddress })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChainBadge, { chain: token.chain }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: Number(token.decimals) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: pricesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-muted" }) : livePrice !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatUSDValue(livePrice) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic text-xs", children: "N/A" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => setDeleteTarget(token),
                      className: "h-7 w-7 text-muted-foreground hover:text-destructive transition-smooth",
                      "aria-label": `Remove ${token.symbol}`,
                      "data-ocid": `allowed_tokens.delete_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  ) })
                ]
              },
              `${token.tokenAddress}-${token.chain}`
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddTokenModal, { open: addOpen, onClose: () => setAddOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (o) => !o && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "delete_token.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-xl text-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
                  "Remove ",
                  deleteTarget == null ? void 0 : deleteTarget.symbol,
                  "?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
                  "This removes",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: deleteTarget == null ? void 0 : deleteTarget.symbol }),
                  " ",
                  "(",
                  CHAIN_LABELS[(deleteTarget == null ? void 0 : deleteTarget.chain) ?? ""] ?? (deleteTarget == null ? void 0 : deleteTarget.chain),
                  ") from the allowlist. Burns of this token will no longer be accepted."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border text-muted-foreground",
                    "data-ocid": "delete_token.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  AlertDialogAction,
                  {
                    onClick: confirmDelete,
                    disabled: removeToken.isPending,
                    className: "bg-destructive hover:bg-destructive/80 text-destructive-foreground gap-1.5",
                    "data-ocid": "delete_token.confirm_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                      removeToken.isPending ? "Removing…" : "Remove"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function AuditLogTab() {
  const { data: log, isLoading, isError } = useAllowlistAuditLog();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "audit_log.section", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "audit_log.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-muted" }, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive font-mono text-center",
      "data-ocid": "audit_log.error_state",
      children: "Failed to load audit log"
    }
  ) : !(log == null ? void 0 : log.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-dashed border-border bg-muted/10 py-14 flex flex-col items-center gap-3 text-center",
      "data-ocid": "audit_log.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-muted-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display text-foreground", children: "No audit entries yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Allowlist changes will appear here" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border overflow-x-auto",
      "data-ocid": "audit_log.table",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[80px_170px_90px_1fr_130px] min-w-[640px] bg-muted/40 border-b border-border px-4 py-2.5 gap-3", children: [
          "Action",
          "Token Address",
          "Chain",
          "Admin Principal",
          "Timestamp"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-mono uppercase tracking-widest text-muted-foreground",
            children: h
          },
          h
        )) }),
        log.map((entry, idx) => {
          const isAdd = entry.action === AuditAction.add;
          const ts = new Date(Number(entry.timestamp / BigInt(1e6)));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-[80px_170px_90px_1fr_130px] min-w-[640px] items-center px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth gap-3",
              "data-ocid": `audit_log.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: isAdd ? "border-green-500/40 text-green-400 font-mono text-xs" : "border-destructive/40 text-destructive font-mono text-xs",
                    children: isAdd ? "ADDED" : "REMOVED"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center font-mono text-xs text-muted-foreground min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", title: entry.tokenAddress, children: truncateAddress(entry.tokenAddress, 8) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text: entry.tokenAddress })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChainBadge, { chain: entry.chain }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground truncate min-w-0", children: (() => {
                  const p = entry.adminPrincipal.toText();
                  const isAnon = p === "2vxsx-fae3t-qaxgo-bbkl3-xoxsa-5anqp-s4jsx-sdeux-3hmne-y52fa-cae" || p.startsWith("2vxsx-f") || p === "aaaaa-aa";
                  return isAnon ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground/60", children: "System" }) : truncateAddress(p, 10);
                })() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                  ts.toLocaleDateString(),
                  " ",
                  ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ] })
              ]
            },
            `${entry.tokenAddress}-${entry.chain}-${String(entry.timestamp)}`
          );
        })
      ]
    }
  ) });
}
const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
function FeeSettingsTab() {
  const { data: currentRecipient, isLoading, isError } = useGetFeeRecipient();
  const { data: currentFeePercent, isLoading: isFeeLoading } = useGetFeePercent();
  const setFeeRecipient = useSetFeeRecipient();
  const setFeePercent = useSetFeePercent();
  const [address, setAddress] = reactExports.useState("");
  const [addressTouched, setAddressTouched] = reactExports.useState(false);
  const [feeInput, setFeeInput] = reactExports.useState("");
  const [feeTouched, setFeeTouched] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (currentRecipient != null) setAddress(currentRecipient);
  }, [currentRecipient]);
  reactExports.useEffect(() => {
    if (currentFeePercent != null) setFeeInput(String(currentFeePercent));
  }, [currentFeePercent]);
  const addressError = addressTouched && !EVM_ADDRESS_REGEX.test(address) ? "Must be a valid EVM address (0x followed by 40 hex characters)" : null;
  const feeValue = Number(feeInput);
  const feeError = feeTouched && (Number.isNaN(feeValue) || feeValue < 0 || feeValue > 100) ? "Must be a number between 0 and 100" : null;
  async function handleSaveAddress(e) {
    e.preventDefault();
    setAddressTouched(true);
    if (!EVM_ADDRESS_REGEX.test(address)) return;
    try {
      await setFeeRecipient.mutateAsync(address.trim());
      ue.success("Fee recipient address saved");
    } catch {
      ue.error("Failed to save fee recipient address");
    }
  }
  async function handleSaveFee(e) {
    e.preventDefault();
    setFeeTouched(true);
    if (Number.isNaN(feeValue) || feeValue < 0 || feeValue > 100) return;
    try {
      await setFeePercent.mutateAsync(feeValue);
      ue.success(`Platform fee set to ${feeValue}%`);
    } catch {
      ue.error("Failed to save platform fee");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "fee_settings.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "Platform Fee" })
      ] }),
      isFeeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "fee_settings.fee_loading_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-40 bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-widest", children: "Current:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: currentFeePercent != null ? `${currentFeePercent}%` : "Not configured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic", children: "of each burn amount" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveFee, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
              "Fee Percentage ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: feeInput,
                  onChange: (e) => setFeeInput(e.target.value),
                  onBlur: () => setFeeTouched(true),
                  type: "number",
                  min: 0,
                  max: 100,
                  step: "any",
                  placeholder: "0.69",
                  className: "font-mono text-sm bg-background border-input pr-8",
                  "data-ocid": "fee_settings.fee_percent_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono", children: "%" })
            ] }),
            feeError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive mt-1",
                "data-ocid": "fee_settings.fee_percent_input.field_error",
                children: feeError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                size: "sm",
                disabled: setFeePercent.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                "data-ocid": "fee_settings.save_fee_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-3.5 w-3.5" }),
                  setFeePercent.isPending ? "Saving…" : "Save Fee"
                ]
              }
            ),
            setFeePercent.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 text-xs font-mono text-emerald-400",
                "data-ocid": "fee_settings.fee_success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                  "Saved"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "Fee Recipient Address" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "fee_settings.loading_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-64 bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
      ] }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center",
          "data-ocid": "fee_settings.error_state",
          children: "Failed to load fee recipient"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-widest", children: "Current:" }),
          currentRecipient ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: truncateAddress(currentRecipient, 14) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text: currentRecipient })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic", children: "Not configured" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveAddress, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
              "New Address ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: address,
                onChange: (e) => setAddress(e.target.value),
                onBlur: () => setAddressTouched(true),
                placeholder: "0x…",
                className: "mt-1.5 font-mono text-sm bg-background border-input",
                "data-ocid": "fee_settings.address_input"
              }
            ),
            addressError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive mt-1",
                "data-ocid": "fee_settings.address_input.field_error",
                children: addressError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                size: "sm",
                disabled: setFeeRecipient.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                "data-ocid": "fee_settings.save_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
                  setFeeRecipient.isPending ? "Saving…" : "Save Address"
                ]
              }
            ),
            setFeeRecipient.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 text-xs font-mono text-emerald-400",
                "data-ocid": "fee_settings.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                  "Saved"
                ]
              }
            ),
            setFeeRecipient.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-mono text-destructive",
                "data-ocid": "fee_settings.error_state",
                children: "Failed to save"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GritIssuanceRateSection, {})
  ] });
}
function GritIssuanceRateSection() {
  const { data: currentRate, isLoading, isError } = useGetGritIssuanceRate();
  const { data: isLaunched, isLoading: isLaunchLoading } = useGetIsLaunched();
  const setGritIssuanceRate = useSetGritIssuanceRate();
  const setLaunched = useSetLaunched();
  const [rateInput, setRateInput] = reactExports.useState("");
  const [rateTouched, setRateTouched] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [confirmLock, setConfirmLock] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (currentRate != null) setRateInput(String(Number(currentRate)));
  }, [currentRate]);
  const rateValue = Number(rateInput);
  const rateError = rateTouched && (Number.isNaN(rateValue) || !Number.isInteger(rateValue) || rateValue <= 0) ? "Must be a positive whole number" : null;
  const locked = isLaunched === true;
  async function handleSaveRate(e) {
    e.preventDefault();
    if (locked) return;
    setRateTouched(true);
    if (Number.isNaN(rateValue) || !Number.isInteger(rateValue) || rateValue <= 0)
      return;
    try {
      await setGritIssuanceRate.mutateAsync(BigInt(rateValue));
      setSaved(true);
      setTimeout(() => setSaved(false), 3e3);
      ue.success(`GRIT issuance rate set to ${rateValue.toLocaleString()}`);
    } catch {
      ue.error("Failed to save GRIT issuance rate");
    }
  }
  async function handleLockAtLaunch() {
    try {
      await setLaunched.mutateAsync();
      ue.success(
        "Settings locked at launch. GRIT Issuance Rate is now immutable."
      );
      setConfirmLock(false);
    } catch {
      ue.error("Failed to lock settings");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card p-5 space-y-4",
        "data-ocid": "fee_settings.grit_rate.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold tracking-widest text-foreground uppercase", children: "GRIT ISSUANCE RATE" })
            ] }),
            !isLaunchLoading && (locked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border px-2 py-1",
                "data-ocid": "fee_settings.grit_rate.locked_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-accent" }),
                  "LOCKED AT LAUNCH"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                onClick: () => setConfirmLock(true),
                disabled: setLaunched.isPending,
                className: "text-xs font-mono uppercase tracking-widest gap-1.5 border-amber-600/40 text-amber-400 hover:bg-amber-600/10",
                "data-ocid": "fee_settings.lock_at_launch_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
                  "LOCK SETTINGS AT LAUNCH"
                ]
              }
            ))
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-2",
              "data-ocid": "fee_settings.grit_rate.loading_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-muted animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
              ]
            }
          ) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center",
              "data-ocid": "fee_settings.grit_rate.error_state",
              children: "Failed to load GRIT issuance rate"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-widest", children: "Current:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: currentRate != null ? Number(currentRate).toLocaleString() : "Not configured" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic", children: "GRIT per $1 burned" }),
              locked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400/70 italic", children: "· immutable after launch" })
            ] }),
            locked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-amber-600/20 bg-amber-600/5 p-3 text-xs font-mono text-amber-400/80", children: "This parameter is locked and cannot be changed after launch." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveRate, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                  "Issuance Rate ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 mb-1.5", children: "Number of GRIT issued per $1 of token burned. Default: 1,000,000,000,000 (1 trillion)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: rateInput,
                      onChange: (e) => setRateInput(e.target.value),
                      onBlur: () => setRateTouched(true),
                      type: "number",
                      min: 1,
                      step: 1,
                      placeholder: "100000000000",
                      className: "font-mono text-sm bg-background border-input pr-16",
                      "data-ocid": "fee_settings.grit_rate_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none", children: "GRIT" })
                ] }),
                rateError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-1",
                    "data-ocid": "fee_settings.grit_rate_input.field_error",
                    children: rateError
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: setGritIssuanceRate.isPending,
                    className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                    "data-ocid": "fee_settings.save_grit_rate_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
                      setGritIssuanceRate.isPending ? "Saving…" : "Save Rate"
                    ]
                  }
                ),
                saved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "flex items-center gap-1 text-xs font-mono text-emerald-400",
                    "data-ocid": "fee_settings.grit_rate.success_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                      "Saved"
                    ]
                  }
                ),
                setGritIssuanceRate.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-mono text-destructive",
                    "data-ocid": "fee_settings.grit_rate.error_state",
                    children: "Failed to save"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmLock, onOpenChange: setConfirmLock, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display tracking-widest uppercase text-foreground", children: "LOCK SETTINGS AT LAUNCH?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "font-mono text-sm text-muted-foreground", children: "This will permanently lock the GRIT Issuance Rate. Once locked, it cannot be changed — ever. This action is irreversible." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogCancel,
          {
            className: "font-mono text-xs uppercase tracking-widest",
            "data-ocid": "fee_settings.lock_confirm_dialog.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleLockAtLaunch,
            disabled: setLaunched.isPending,
            className: "font-mono text-xs uppercase tracking-widest bg-amber-600 hover:bg-amber-700 text-white",
            "data-ocid": "fee_settings.lock_confirm_dialog.confirm_button",
            children: setLaunched.isPending ? "Locking…" : "LOCK AT LAUNCH"
          }
        )
      ] })
    ] }) })
  ] });
}
function AdminManagementSection() {
  const { principal: currentPrincipal } = useAuth();
  const { data: admins, isLoading, isError } = useGetAdmins();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();
  const [newPrincipal, setNewPrincipal] = reactExports.useState("");
  const [removeTarget, setRemoveTarget] = reactExports.useState(null);
  async function handleAdd(e) {
    e.preventDefault();
    if (!newPrincipal.trim()) return;
    try {
      await addAdmin.mutateAsync(newPrincipal.trim());
      ue.success("Admin added successfully");
      setNewPrincipal("");
    } catch {
      ue.error("Failed to add admin — check the principal ID");
    }
  }
  async function confirmRemove() {
    if (!removeTarget) return;
    try {
      await removeAdmin.mutateAsync(removeTarget);
      ue.success("Admin removed");
      setRemoveTarget(null);
    } catch {
      ue.error("Failed to remove admin");
    }
  }
  const isLastAdmin = ((admins == null ? void 0 : admins.length) ?? 0) <= 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card p-5 space-y-4",
        "data-ocid": "admin_management.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "ADMIN MANAGEMENT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newPrincipal,
                onChange: (e) => setNewPrincipal(e.target.value),
                placeholder: "Enter principal ID to add as admin…",
                className: "flex-1 font-mono text-sm bg-background border-input",
                "data-ocid": "admin_management.principal_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                size: "sm",
                disabled: !newPrincipal.trim() || addAdmin.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth whitespace-nowrap",
                "data-ocid": "admin_management.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5" }),
                  addAdmin.isPending ? "Adding…" : "Add Admin"
                ]
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "admin_management.loading_state", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-muted" }, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center",
              "data-ocid": "admin_management.error_state",
              children: "Failed to load admin list"
            }
          ) : !(admins == null ? void 0 : admins.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "border border-dashed border-border bg-muted/10 py-8 flex items-center justify-center",
              "data-ocid": "admin_management.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "No admins found" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "border border-border",
              "data-ocid": "admin_management.list",
              children: admins.map((p, idx) => {
                const isCurrentUser = p === currentPrincipal;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth",
                    "data-ocid": `admin_management.item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-3.5 w-3.5 text-muted-foreground flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-xs text-foreground truncate",
                            title: p,
                            children: truncateAddress(p, 16)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text: p }),
                        isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "border-accent/40 text-accent font-mono text-xs ml-1 flex-shrink-0",
                            children: "You"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          onClick: () => setRemoveTarget(p),
                          disabled: isLastAdmin,
                          className: "h-7 w-7 text-muted-foreground hover:text-destructive transition-smooth flex-shrink-0",
                          "aria-label": `Remove admin ${p}`,
                          title: isLastAdmin ? "Cannot remove the last admin" : void 0,
                          "data-ocid": `admin_management.delete_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ]
                  },
                  p
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All listed principals have full admin access. You cannot remove the last admin." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!removeTarget,
        onOpenChange: (o) => !o && setRemoveTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "remove_admin.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-xl text-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
                  "Remove Admin?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
                  "Principal",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: removeTarget ? truncateAddress(removeTarget, 12) : "" }),
                  " ",
                  "will lose all admin privileges immediately."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border text-muted-foreground",
                    "data-ocid": "remove_admin.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  AlertDialogAction,
                  {
                    onClick: confirmRemove,
                    disabled: removeAdmin.isPending,
                    className: "bg-destructive hover:bg-destructive/80 text-destructive-foreground gap-1.5",
                    "data-ocid": "remove_admin.confirm_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" }),
                      removeAdmin.isPending ? "Removing…" : "Remove Admin"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
const WEI_PER_UNIT = BigInt("1000000000000000000");
function weiToDisplay(wei) {
  const whole = wei / WEI_PER_UNIT;
  const frac = wei % WEI_PER_UNIT;
  if (frac === BigInt(0)) return String(whole);
  const fracStr = frac.toString().padStart(18, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}
function displayToWei(val) {
  const trimmed = val.trim();
  if (!trimmed || Number.isNaN(Number(trimmed))) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const fracPadded = fracPart.slice(0, 18).padEnd(18, "0");
  return BigInt(wholePart || "0") * WEI_PER_UNIT + BigInt(fracPadded);
}
const CHAIN_DISPLAY_MAP = {
  ethereum: {
    label: "Ethereum",
    currency: "ETH",
    badgeClass: "border-blue-400/40 text-blue-400"
  },
  base: {
    label: "Base",
    currency: "ETH",
    badgeClass: "border-indigo-400/40 text-indigo-400"
  },
  celo: {
    label: "Celo",
    currency: "CELO",
    badgeClass: "border-yellow-400/40 text-yellow-400"
  },
  optimism: {
    label: "Optimism",
    currency: "ETH",
    badgeClass: "border-red-400/40 text-red-400"
  },
  arbitrum: {
    label: "Arbitrum",
    currency: "ETH",
    badgeClass: "border-sky-400/40 text-sky-400"
  },
  polygon: {
    label: "Polygon",
    currency: "MATIC",
    badgeClass: "border-purple-400/40 text-purple-400"
  }
};
function MiningFeesTab() {
  const { data: currentFees, isLoading, isError } = useGetMinerCreationFees();
  const setMinerCreationFee = useSetMinerCreationFee();
  const [inputs, setInputs] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (currentFees) {
      const map = {};
      for (const entry of currentFees) {
        map[entry.chain] = weiToDisplay(entry.feeWei);
      }
      setInputs(map);
    }
  }, [currentFees]);
  function getError(chain, currency) {
    if (!touched[chain]) return null;
    const val = Number(inputs[chain]);
    if (Number.isNaN(val) || val < 0) return "Must be ≥ 0";
    if (val > 1) return `Max 1 ${currency}`;
    return null;
  }
  const feeEntries = currentFees ?? [];
  const hasErrors = feeEntries.some(
    (entry) => {
      var _a;
      return getError(
        entry.chain,
        ((_a = CHAIN_DISPLAY_MAP[entry.chain]) == null ? void 0 : _a.currency) ?? "ETH"
      ) !== null;
    }
  );
  async function handleSave(e) {
    e.preventDefault();
    const allTouched = {};
    for (const entry of feeEntries) {
      allTouched[entry.chain] = true;
    }
    setTouched(allTouched);
    if (hasErrors) return;
    try {
      for (const entry of feeEntries) {
        const wei = displayToWei(inputs[entry.chain] ?? "");
        if (wei === null) {
          ue.error(`Invalid fee value for ${entry.chain}`);
          return;
        }
        await setMinerCreationFee.mutateAsync({
          chain: entry.chain,
          feeWei: wei
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3e3);
      ue.success("Miner creation fees saved");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save fees");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "mining_fees.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "Miner Creation Fee" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "mining_fees.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-24 bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
      ] }, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center",
          "data-ocid": "mining_fees.error_state",
          children: "Failed to load miner creation fees"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
        feeEntries.map((entry) => {
          const display = CHAIN_DISPLAY_MAP[entry.chain] ?? {
            label: entry.chain.charAt(0).toUpperCase() + entry.chain.slice(1),
            currency: "ETH",
            badgeClass: "border-border text-muted-foreground"
          };
          const err = getError(entry.chain, display.currency);
          const ocid = `mining_fees.${entry.chain}_input`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: display.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center border rounded-sm px-1.5 py-0.5 font-mono text-xs ${display.badgeClass}`,
                  children: display.currency
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground/60 ml-auto", children: [
                "current:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: weiToDisplay(entry.feeWei) }),
                " ",
                display.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 1,
                  step: "any",
                  value: inputs[entry.chain] ?? "",
                  onChange: (e) => setInputs((prev) => ({
                    ...prev,
                    [entry.chain]: e.target.value
                  })),
                  onBlur: () => setTouched((prev) => ({ ...prev, [entry.chain]: true })),
                  placeholder: "0.001",
                  className: "font-mono text-sm bg-background border-input pr-16",
                  "data-ocid": ocid
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none", children: display.currency })
            ] }),
            err && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive mt-1",
                "data-ocid": `${ocid}.field_error`,
                children: err
              }
            )
          ] }, entry.chain);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: setMinerCreationFee.isPending,
              className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
              "data-ocid": "mining_fees.save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
                setMinerCreationFee.isPending ? "Saving…" : "Save Fees"
              ]
            }
          ),
          saved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "flex items-center gap-1 text-xs font-mono text-emerald-400",
              "data-ocid": "mining_fees.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                "Saved"
              ]
            }
          ),
          setMinerCreationFee.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono text-destructive",
              "data-ocid": "mining_fees.error_state",
              children: "Failed to save"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This fee is charged in the chain's native gas token when a user creates a new miner. Set to 0 to disable the fee for that chain." })
  ] });
}
function AkkLedgerSection() {
  const { data: currentId, isLoading } = useGetAkkLedgerCanisterId();
  const setCanisterId = useSetAkkLedgerCanisterId();
  const [inputId, setInputId] = reactExports.useState("");
  const [saveMsg, setSaveMsg] = reactExports.useState(null);
  const { data: currentFee, isLoading: feeLoading } = useGetAkkTransferFee();
  const setFee = useSetAkkTransferFee();
  const [feeInput, setFeeInput] = reactExports.useState("");
  const [feeMsg, setFeeMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (currentFee !== void 0) {
      setFeeInput(String(currentFee));
    }
  }, [currentFee]);
  async function handleSave(e) {
    e.preventDefault();
    if (currentId) {
      setSaveMsg({
        type: "error",
        text: "Canister ID is locked and cannot be changed"
      });
      return;
    }
    const trimmed = inputId.trim();
    if (!trimmed) {
      setSaveMsg({ type: "error", text: "Canister ID is required" });
      return;
    }
    setSaveMsg(null);
    try {
      await setCanisterId.mutateAsync(trimmed);
      setInputId("");
      setSaveMsg({ type: "success", text: "AKK ledger canister ID saved" });
      setTimeout(() => setSaveMsg(null), 3e3);
    } catch (err) {
      setSaveMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save"
      });
    }
  }
  async function handleFeeSave(e) {
    e.preventDefault();
    const trimmed = feeInput.trim();
    if (!trimmed) {
      setFeeMsg({ type: "error", text: "Fee is required" });
      return;
    }
    setFeeMsg(null);
    try {
      await setFee.mutateAsync(BigInt(trimmed));
      setFeeMsg({ type: "success", text: "AKK transfer fee saved" });
      setTimeout(() => setFeeMsg(null), 3e3);
    } catch (err) {
      setFeeMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save"
      });
    }
  }
  const feeInAkk = feeInput ? (Number(feeInput) / 1e8).toFixed(8).replace(/\.?0+$/, "") : "0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border bg-card p-5 space-y-6",
      "data-ocid": "akk_ledger.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-white", children: "AKK LEDGER CANISTER" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono leading-relaxed", children: "Set the ICRC-1/2/3 AKK token ledger canister ID to enable real on-chain AKK minting and transfers." }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "akk_ledger.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-muted animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-mono uppercase tracking-widest text-white shrink-0", children: "Current ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-mono text-green-400 truncate",
                "data-ocid": "akk_ledger.current_id",
                children: currentId ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400", children: "Not configured" })
              }
            ),
            currentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-mono text-amber-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
              "Locked"
            ] })
          ] }),
          currentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs font-mono text-amber-400/80 bg-amber-950/20 border border-amber-900/30 p-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "The ledger canister ID is locked and cannot be changed once set. This protects the protocol from accidental misconfiguration." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "New Canister ID ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: inputId,
                  onChange: (e) => setInputId(e.target.value),
                  placeholder: currentId ? "Locked — cannot be changed" : "aaaaa-aa",
                  disabled: !!currentId,
                  className: "mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed",
                  "data-ocid": "akk_ledger.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: setCanisterId.isPending || !!currentId,
                  className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
                  "data-ocid": "akk_ledger.save_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
                    setCanisterId.isPending ? "Saving…" : currentId ? "Locked" : "Save"
                  ]
                }
              ),
              saveMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `flex items-center gap-1 text-xs font-mono ${saveMsg.type === "success" ? "text-emerald-400" : "text-destructive"}`,
                  "data-ocid": `akk_ledger.${saveMsg.type === "success" ? "success_state" : "error_state"}`,
                  children: [
                    saveMsg.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                    saveMsg.text
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "AKK TRANSFER FEE" })
          ] }),
          feeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "akk_fee.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-32 bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleFeeSave, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                "Fee (e8s) ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  step: "1",
                  value: feeInput,
                  onChange: (e) => setFeeInput(e.target.value),
                  placeholder: "10000",
                  className: "mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm placeholder:text-muted-foreground",
                  "data-ocid": "akk_fee.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground mt-1", children: [
                "= ",
                feeInAkk,
                " AKK"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: setFee.isPending,
                  className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                  "data-ocid": "akk_fee.save_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5" }),
                    setFee.isPending ? "Saving…" : "Save"
                  ]
                }
              ),
              feeMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `flex items-center gap-1 text-xs font-mono ${feeMsg.type === "success" ? "text-emerald-400" : "text-destructive"}`,
                  "data-ocid": `akk_fee.${feeMsg.type === "success" ? "success_state" : "error_state"}`,
                  children: [
                    feeMsg.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                    feeMsg.text
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function LaunchGateSection() {
  const { data: config, isLoading } = useGetLaunchGateConfig();
  const setLaunchTimeGate = useSetLaunchTimeGate();
  const setNftGate = useSetNftGate();
  const [launchTimeEnabled, setLaunchTimeEnabled] = reactExports.useState(false);
  const [launchTimeValue, setLaunchTimeValue] = reactExports.useState("");
  const [nftGateEnabled, setNftGateEnabled] = reactExports.useState(false);
  const [timeSaveMsg, setTimeSaveMsg] = reactExports.useState(null);
  const [nftSaveMsg, setNftSaveMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!config) return;
    setLaunchTimeEnabled(config.launchTimeEnabled);
    setNftGateEnabled(config.nftGateEnabled);
    if (Number(config.launchTime) > 0) {
      setLaunchTimeValue(
        new Date(Number(config.launchTime)).toISOString().slice(0, 16)
      );
    } else {
      setLaunchTimeValue("");
    }
  }, [config]);
  async function handleSaveLaunchTime(e) {
    e.preventDefault();
    setTimeSaveMsg(null);
    try {
      const ms = new Date(launchTimeValue).getTime();
      await setLaunchTimeGate.mutateAsync({
        enabled: launchTimeEnabled,
        launchTime: BigInt(ms)
      });
      setTimeSaveMsg({ type: "success", text: "Saved!" });
      setTimeout(() => setTimeSaveMsg(null), 3e3);
    } catch {
      setTimeSaveMsg({ type: "error", text: "Failed to save" });
    }
  }
  async function handleSaveNftGate(e) {
    e.preventDefault();
    setNftSaveMsg(null);
    try {
      await setNftGate.mutateAsync(nftGateEnabled);
      setNftSaveMsg({ type: "success", text: "Saved!" });
      setTimeout(() => setNftSaveMsg(null), 3e3);
    } catch {
      setNftSaveMsg({ type: "error", text: "Failed to save" });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border bg-card p-5 space-y-6",
      "data-ocid": "launch_gate.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold uppercase tracking-widest text-foreground", children: "LAUNCH GATE ACCESS" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "launch_gate.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-muted animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted animate-pulse" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "LAUNCH TIME GATE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveLaunchTime, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: "Enable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setLaunchTimeEnabled((v) => !v),
                    className: `relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${launchTimeEnabled ? "border-green-500 bg-green-500/20" : "border-border bg-muted/30"}`,
                    "aria-label": "Toggle launch time gate",
                    "data-ocid": "launch_gate.time_toggle",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `pointer-events-none inline-block h-3 w-3 rounded-full shadow-md ring-0 transition-transform ${launchTimeEnabled ? "translate-x-5 bg-green-400" : "translate-x-0.5 bg-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-mono font-semibold ${launchTimeEnabled ? "text-green-400" : "text-yellow-400"}`,
                    "data-ocid": "launch_gate.time_status_display",
                    children: launchTimeEnabled ? "ENABLED" : "DISABLED"
                  }
                )
              ] }),
              launchTimeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: [
                  "Launch Time (UTC)",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "datetime-local",
                    value: launchTimeValue,
                    onChange: (e) => setLaunchTimeValue(e.target.value),
                    className: "mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm",
                    "data-ocid": "launch_gate.time_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: setLaunchTimeGate.isPending,
                    className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                    "data-ocid": "launch_gate.save_time_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
                      setLaunchTimeGate.isPending ? "Saving…" : "SAVE"
                    ]
                  }
                ),
                timeSaveMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `flex items-center gap-1 text-xs font-mono ${timeSaveMsg.type === "success" ? "text-emerald-400" : "text-destructive"}`,
                    "data-ocid": `launch_gate.${timeSaveMsg.type === "success" ? "time_success_state" : "time_error_state"}`,
                    children: [
                      timeSaveMsg.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                      timeSaveMsg.text
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "NFT GATE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveNftGate, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-mono uppercase tracking-widest text-white", children: "Enable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNftGateEnabled((v) => !v),
                    className: `relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${nftGateEnabled ? "border-green-500 bg-green-500/20" : "border-border bg-muted/30"}`,
                    "aria-label": "Toggle NFT gate",
                    "data-ocid": "launch_gate.nft_toggle",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `pointer-events-none inline-block h-3 w-3 rounded-full shadow-md ring-0 transition-transform ${nftGateEnabled ? "translate-x-5 bg-green-400" : "translate-x-0.5 bg-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-mono font-semibold ${nftGateEnabled ? "text-green-400" : "text-yellow-400"}`,
                    "data-ocid": "launch_gate.nft_status_display",
                    children: nftGateEnabled ? "ENABLED" : "DISABLED"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: setNftGate.isPending,
                    className: "bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth",
                    "data-ocid": "launch_gate.save_nft_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
                      setNftGate.isPending ? "Saving…" : "SAVE"
                    ]
                  }
                ),
                nftSaveMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `flex items-center gap-1 text-xs font-mono ${nftSaveMsg.type === "success" ? "text-emerald-400" : "text-destructive"}`,
                    "data-ocid": `launch_gate.${nftSaveMsg.type === "success" ? "nft_success_state" : "nft_error_state"}`,
                    children: [
                      nftSaveMsg.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                      nftSaveMsg.text
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function NotAuthorized() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex-1 flex items-center justify-center min-h-[60vh]",
      "data-ocid": "admin.not_authorized",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border border-destructive/30 bg-destructive/5 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-8 w-8 text-destructive/60" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground", children: "Not Authorized" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "This panel is restricted to protocol administrators." })
        ] })
      ] })
    }
  );
}
function AdminPage() {
  const { isAuthenticated } = useAuth();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  if (!isAuthenticated || !isAdminLoading && !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NotAuthorized, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-8",
      "data-ocid": "admin.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
            "ADMIN PANEL"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm mt-1 max-w-md", children: "Manage the ERC-20 burn allowlist and protocol settings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "tokens", "data-ocid": "admin.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "bg-muted/40 border border-border h-auto p-0.5 gap-0.5 flex-wrap",
              "data-ocid": "admin.tabs_list",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "tokens",
                    className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                    "data-ocid": "admin.allowed_tokens_tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "TOKENS" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "ALLOWED TOKENS" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "protocol",
                    className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                    "data-ocid": "admin.protocol_settings_tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "SETTINGS" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "PROTOCOL SETTINGS" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    value: "testing",
                    className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                    "data-ocid": "admin.testing_tab",
                    children: "TESTING"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "tokens", className: "mt-6 space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AllowedTokensTab, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground", children: "AUDIT LOG" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogTab, {})
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "protocol", className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MintRetryQueuePanel, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AkkLedgerSection, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeeSettingsTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiningFeesTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LaunchGateSection, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminManagementSection, {}) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "testing", className: "mt-6 space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreOverrideSection, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-green-900/30 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditAbandonedMintsSection, {}) })
          ] })
        ] })
      ]
    }
  );
}
function MintRetryQueuePanel() {
  const { data: stats, refetch: refetchStats } = useGetMintRetryStats();
  const { data: pending, refetch: refetchPending } = useGetPendingMints();
  const { data: abandoned, refetch: refetchAbandoned } = useGetAbandonedMints();
  const retryMint = useRetryMint();
  const [showAbandoned, setShowAbandoned] = reactExports.useState(false);
  const refresh = () => {
    refetchStats();
    refetchPending();
    refetchAbandoned();
  };
  const formatOwner = (p) => {
    const s = p.toString();
    return s.length > 14 ? `${s.slice(0, 8)}...${s.slice(-4)}` : s;
  };
  const formatAkk = (e8s) => (Number(e8s) / 1e8).toFixed(4);
  const formatTime = (ns) => ns === 0n ? "—" : new Date(Number(ns / 1000000n)).toLocaleString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-['VT323'] text-white text-xl tracking-widest uppercase", children: "MINT RETRY QUEUE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: refresh,
          className: "font-['VT323'] text-green-400 text-base tracking-widest hover:text-green-300 transition-colors",
          children: "[REFRESH QUEUE] →"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      {
        label: "QUEUE DEPTH",
        value: stats ? Number(stats.queueDepth) : "—"
      },
      {
        label: "LIFETIME RETRIED",
        value: stats ? Number(stats.totalRetried) : "—"
      },
      {
        label: "LIFETIME SUCCEEDED",
        value: stats ? Number(stats.totalSucceeded) : "—"
      },
      {
        label: "LIFETIME ABANDONED",
        value: stats ? Number(stats.totalAbandoned) : "—"
      }
    ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-green-900/40 bg-black/30 p-3 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-['VT323'] text-green-500/70 text-xs tracking-widest uppercase", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-['VT323'] text-green-400 text-2xl", children: String(value) })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-green-900/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: !pending || pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-['VT323'] text-green-700 text-sm p-3 tracking-widest", children: "No pending mints." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-green-900/40", children: [
        "BLOCK #",
        "OWNER",
        "AMOUNT",
        "ATTEMPTS",
        "LAST ATTEMPT",
        "ERROR",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "font-['VT323'] text-white text-left px-3 py-2 tracking-widest text-sm whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pending.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-green-900/20 hover:bg-green-900/5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-300", children: Number(entry.blockId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-400/70", children: formatOwner(entry.owner) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-white", children: formatAkk(entry.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-300", children: Number(entry.attempts) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-400/60 whitespace-nowrap", children: formatTime(entry.lastAttemptTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-red-400/70 max-w-32 truncate", children: entry.error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => retryMint.mutate(entry.blockId),
                className: "font-['VT323'] text-green-400 border border-green-700 px-2 py-0.5 text-sm hover:bg-green-900/30 tracking-widest",
                children: "[RETRY]"
              }
            ) })
          ]
        },
        Number(entry.blockId)
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowAbandoned((s) => !s),
          className: "font-['VT323'] text-green-400 text-base tracking-widest hover:text-green-300 transition-colors",
          children: [
            "[ABANDONED MINTS] ",
            showAbandoned ? "↑" : "↓"
          ]
        }
      ),
      showAbandoned && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-green-900/40 mt-2 overflow-x-auto", children: !abandoned || abandoned.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-['VT323'] text-green-700 text-sm p-3 tracking-widest", children: "No abandoned mints." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-green-900/40", children: [
          "BLOCK #",
          "OWNER",
          "AMOUNT",
          "ATTEMPTS",
          "LAST ATTEMPT",
          "ERROR",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "font-['VT323'] text-white text-left px-3 py-2 tracking-widest text-sm whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: abandoned.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-green-900/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-300", children: Number(entry.blockId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-400/70", children: formatOwner(entry.owner) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-white", children: formatAkk(entry.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-red-400", children: Number(entry.attempts) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-400/60 whitespace-nowrap", children: formatTime(entry.lastAttemptTime) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-red-400/70 max-w-32 truncate", children: entry.error }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => retryMint.mutate(entry.blockId),
                  className: "font-['VT323'] text-green-400 border border-green-700 px-2 py-0.5 text-sm hover:bg-green-900/30 tracking-widest",
                  children: "[RETRY]"
                }
              ) })
            ]
          },
          Number(entry.blockId)
        )) })
      ] }) })
    ] })
  ] });
}
export {
  AdminPage
};
