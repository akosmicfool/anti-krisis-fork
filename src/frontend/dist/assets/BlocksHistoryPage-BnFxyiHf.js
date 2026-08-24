import { r as reactExports, F as useGetBlockHistoryPage, G as useGetTotalBlockCount, H as useBlockDetails, j as jsxRuntimeExports, X, S as Skeleton, J as ChevronDown } from "./index-D3Low12Q.js";
import { C as Clock, a as Card, b as CardHeader, c as CardTitle, d as CardContent } from "./card-fzcS9XN2.js";
import { S as Search } from "./search-CyCr6JFB.js";
import { C as ChevronUp } from "./chevron-up-DadPCsmE.js";
function formatAkk(amount) {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });
}
function truncateAddress(address, chars = 8) {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}
function BlockDetailPanel({ blockNumber }) {
  const { data: detail, isLoading } = useBlockDetails(blockNumber);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 bg-muted/10 border-t border-border/40 text-xs font-mono text-muted-foreground animate-pulse", children: "Loading block details…" });
  }
  if (!detail) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 bg-muted/10 border-t border-border/40 text-xs font-mono text-muted-foreground", children: "Block details unavailable." });
  }
  const vrfHex = detail.vrfValue.toString(16).toUpperCase().padStart(16, "0");
  const gritByMiner = new Map(
    detail.minerGritSpent.map(([id, g]) => [id.toString(), g])
  );
  const weightByMiner = new Map(
    detail.minerWeights.map(([id, w]) => [id.toString(), w])
  );
  const noMinerData = detail.minerCount === 0n && detail.totalGritSpent === 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/8 border-t border-border/40 px-3 py-3 space-y-3 text-xs font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/50 px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5", children: "Winner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground truncate", children: detail.winnerPrincipal ? truncateAddress(detail.winnerPrincipal.toText(), 8) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/50 px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5", children: "Total GRIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-accent font-bold", children: detail.totalGritSpent === 0n ? "—" : `${formatGritSpent(detail.totalGritSpent)} B` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/50 px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5", children: "Miners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground", children: detail.minerCount === 0n ? "—" : detail.minerCount.toString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/50 px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5", children: "VRF Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#00ff41]/80 truncate", children: detail.vrfValue === 0n ? "—" : vrfHex })
      ] })
    ] }),
    noMinerData ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "No miner data available for this block." }) : detail.minerParticipants.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground uppercase tracking-widest text-[9px] mb-1.5", children: "Miner Breakdown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: detail.minerParticipants.map(([minerId, principal]) => {
        var _a;
        const grit = gritByMiner.get(minerId.toString()) ?? 0n;
        const weight = weightByMiner.get(minerId.toString()) ?? 0;
        const isWinner = ((_a = detail.winnerMinerId) == null ? void 0 : _a.toString()) === minerId.toString();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: [
              "grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center px-2 py-1 border",
              isWinner ? "border-[#00ff41]/40 bg-[#00ff41]/5" : "border-border/30 bg-card"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: isWinner ? "text-[#00ff41]" : "text-muted-foreground",
                  children: isWinner ? "★" : "·"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground truncate", children: [
                "#",
                minerId.toString(),
                " ·",
                " ",
                truncateAddress(principal.toText(), 6)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground tabular-nums", children: [
                (Number(grit) / 1e9).toLocaleString("en-US", {
                  maximumFractionDigits: 2
                }),
                " ",
                "B"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#00ff41]/70 tabular-nums w-10 text-right", children: [
                (weight * 100).toFixed(1),
                "%"
              ] })
            ]
          },
          minerId.toString()
        );
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "No miner data available for this block." })
  ] });
}
function formatGritSpent(amount) {
  const num = Number(amount) / 1e9;
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
function formatTimestamp(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleString();
}
function BlockRow({ block, index }) {
  var _a;
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-b border-border/50 last:border-0",
      "data-ocid": `blocks_history.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded((v) => !v),
            className: "w-full text-left grid grid-cols-[3.5rem_1fr_1fr_1fr_1fr_1.5rem] gap-2 px-3 sm:px-4 py-2.5 text-xs font-mono items-center hover:bg-muted/10 transition-colors min-w-[540px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-bold tabular-nums", children: [
                "#",
                Number(block.blockNumber)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-foreground truncate",
                  title: (_a = block.winnerOwner) == null ? void 0 : _a.toText(),
                  children: block.winnerOwner ? truncateAddress(block.winnerOwner.toText()) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "No winner" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-bold text-right", children: [
                formatAkk(block.akkReward),
                " AKK"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white text-right", children: [
                formatGritSpent(block.totalGritSpent),
                " B"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-right", children: formatTimestamp(block.timestamp) }),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 text-muted-foreground ml-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground ml-auto" })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockDetailPanel, { blockNumber: block.blockNumber })
      ]
    },
    Number(block.blockNumber)
  );
}
function BlocksHistoryPage() {
  const [page, setPage] = reactExports.useState(0n);
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [searchBlockNum, setSearchBlockNum] = reactExports.useState(null);
  const { data: blocks = [], isLoading } = useGetBlockHistoryPage(page, 10n);
  const { data: totalBlocks = 0n } = useGetTotalBlockCount();
  const { data: searchDetail, isLoading: searchLoading } = useBlockDetails(searchBlockNum);
  const totalPages = totalBlocks === 0n ? 0 : Math.max(1, Math.ceil(Number(totalBlocks) / 10));
  const sorted = [...blocks].sort(
    (a, b) => Number(b.blockNumber - a.blockNumber)
  );
  function handleSearch(e) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    try {
      const parsed = BigInt(trimmed);
      if (parsed < 0n) {
        setSearchBlockNum(null);
        return;
      }
      setSearchBlockNum(parsed);
    } catch {
      setSearchBlockNum(null);
      return;
    }
  }
  function handleClear() {
    setSearchInput("");
    setSearchBlockNum(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "blocks_history.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
            "BLOCK HISTORY"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm mt-1", children: "Explore the Anti Krisis consensus protocol." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", "data-ocid": "blocks_history.card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-[1.3rem] uppercase tracking-widest text-white", children: "VIEW BLOCK DETAILS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      step: "1",
                      value: searchInput,
                      onChange: (e) => setSearchInput(e.target.value),
                      placeholder: "Search by block number...",
                      className: "border border-border bg-input text-foreground font-mono pl-7 pr-2 py-1 w-full sm:w-48 rounded-none text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-accent focus:outline-none",
                      "data-ocid": "blocks_history.search_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    className: "bg-accent text-accent-foreground hover:bg-accent/80 px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-smooth",
                    "data-ocid": "blocks_history.search_button",
                    children: "Search"
                  }
                ),
                searchBlockNum !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleClear,
                    className: "border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-smooth flex items-center gap-1",
                    "data-ocid": "blocks_history.clear_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                      "Clear"
                    ]
                  }
                )
              ] })
            ] }),
            searchLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground animate-pulse pt-2", children: "Loading block details…" }),
            searchBlockNum !== null && !searchLoading && !searchDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-xs font-mono text-muted-foreground pt-2",
                "data-ocid": "blocks_history.search_not_found",
                children: [
                  "Block #",
                  searchBlockNum.toString(),
                  " not found."
                ]
              }
            ),
            searchBlockNum !== null && !searchLoading && searchDetail && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "border border-[#00ff41]/30 bg-[#00ff41]/5 mt-2",
                "data-ocid": "blocks_history.search_result",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlockDetailPanel, { blockNumber: searchBlockNum })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0 px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[3.5rem_1fr_1fr_1fr_1fr_1.5rem] gap-2 px-3 sm:px-4 py-2 border-b border-border text-xs font-mono uppercase tracking-widest text-white min-w-[540px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Winner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "AKK Reward" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "GRIT Spent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Time" })
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 px-4 pt-2 min-w-[540px]", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-muted" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "py-12 text-center text-muted-foreground text-sm font-mono",
                "data-ocid": "blocks_history.empty_state",
                children: "No blocks mined yet. Mining starts once a miner is active."
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "blocks_history.list", className: "min-w-[540px]", children: sorted.map((block, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              BlockRow,
              {
                block,
                index: i
              },
              Number(block.blockNumber)
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between border border-border bg-card px-3 sm:px-4 py-3",
            "data-ocid": "blocks_history.pagination",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPage((p) => p - 1n),
                  disabled: page === 0n || totalPages === 0,
                  className: "text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth",
                  "data-ocid": "blocks_history.pagination_prev",
                  children: "← PREV"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                "PAGE ",
                Number(page) + 1,
                " OF ",
                totalPages
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPage((p) => p + 1n),
                  disabled: totalPages === 0 || page === BigInt(Math.max(0, totalPages - 1)),
                  className: "text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth",
                  "data-ocid": "blocks_history.pagination_next",
                  children: "NEXT →"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  BlocksHistoryPage
};
