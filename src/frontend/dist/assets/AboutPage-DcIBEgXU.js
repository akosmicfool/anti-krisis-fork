import { aK as useSearch, r as reactExports, j as jsxRuntimeExports, aL as Info, J as ChevronDown } from "./index-D3Low12Q.js";
import { V as VideoSection } from "./VideoSection-DIwOCdTE.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BwuCvDfY.js";
const VALID_TABS = [
  "tldr",
  "genesis",
  "manifesto",
  "regnets",
  "faqs"
];
function isValidTab(t) {
  return VALID_TABS.includes(t);
}
function useAboutTab() {
  const search = useSearch({ from: "/about" });
  const rawTab = search.tab;
  const [tab, setTabState] = reactExports.useState(
    isValidTab(rawTab) ? rawTab : "tldr"
  );
  reactExports.useEffect(() => {
    if (isValidTab(rawTab) && rawTab !== tab) {
      setTabState(rawTab);
    }
  }, [rawTab, tab]);
  const setTab = (next) => {
    setTabState(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState({}, "", url.toString());
  };
  return [tab, setTab];
}
const faqData = [
  {
    title: "General",
    items: [
      {
        question: "Why the hell are we doing this?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "The metacrisis is real and the regen movement offers a systemic way to tackle it with a broad range of solutions. But the movement suffers from a coordination problem to attract capital and attention to go mainstream.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Anti Krisis protocol solves this by uniting fragmented efforts through its Proof of Burn protocol. It creates perpetual demand for RegNet tokens and transforms them into a scarce, multi-capital store of value. It channels speculation, the force that usually drives extraction into an engine for regeneration, making regenerative action the most rational and rewarding choice."
        ] })
      },
      {
        question: "What is the metacrisis?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "The interconnected web of planetary crises - climate change, biodiversity loss, social unrest, systemic inequality that stem from deeper coordination failures in how humanity organizes economically, socially, and ecologically." })
      },
      {
        question: "What are the 5 forms of capital?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Natural, social, human, manufactured, and financial capital. Traditional economics only optimizes for financial capital, while regeneration requires preserving and growing all five. Read more about them",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://www.forumforthefuture.org/Handlers/Download.ashx?IDMF=8cdb0889-fa4a-4038-9e04-b6aefefe65a9",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-accent underline hover:text-accent/80",
              children: "here"
            }
          ),
          "."
        ] })
      },
      {
        question: "What is AK69?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "AK69 exists on multiple levels:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "A soulbound meta-score earned across 69 civilization games in AK69.fun arena." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "The memetic symbol representing reciprocity between Anti Krisis and RegNets." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'A cultural weapon against extractive systems symbolizing "resistance, resilience, and regeneration".' })
          ] })
        ] })
      },
      {
        question: "What are 69 civilization games?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: `Here's a thought experiment - what are the 69 games we ought to be playing to bring peace and harmony to this world? Beyond the core $AKK mining protocol, we imagine games like "Memetik" (cultural capital game through memes) and "Kosmic" (spiritual capital game through mindfullness). Each game scores contributions differently, allowing users to participate based on their unique capacities.` })
      },
      {
        question: "How is AK69 score calculated?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "AK69 score is calculated by equally combining your normalized GRIT and normalized $AKK won. Normalization is a process of accounting for your contribution relative to the whole protocol in a specific timeframe. These daily normalization scores are then summed over different rolling windows (like weekly or monthly) to reward consistent participation, and finally multiplied by 100 for display. In the future, normalized scores from other games will be added to reflect contributions across all games in the Anti Krisis ecosystem." })
      }
    ]
  },
  {
    title: "Financial",
    items: [
      {
        question: "What is $AKK backed by?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "$AKK is mined by the irreversible economic sacrifice of burning RegNet tokens with provable impact just like how Bitcoin is created by spending energy. Each unit of mining power is inseparably linked to the economics of ecological and social renewal. It is not backed by underlying assets in a traditional sense and cannot be redeemed for those assets when required." })
      },
      {
        question: "What is the utility of $AKK?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "$AKK serves multiple functions:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Governance: Propose and vote on RegNet additions/removals, burn weights, and protocol upgrades through token-weighted governance." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Curation: Participate in identifying and elevating things relevant to the community." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Store of Value: Functions as a multi-capital store of value anchored to regenerative principles. It can be used in all kinds of DeFi related applications." })
          ] })
        ] })
      },
      {
        question: "Where can I buy/sell $AKK after mining it?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Once enough $AKK is mined, liquidity pools will emerge to buy/sell. The details of which will be shared though the app when they become available." })
      }
    ]
  },
  {
    title: "Mining Mechanics",
    items: [
      {
        question: "What wallet do I need?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Any EVM-compatible wallet that works with WalletCollect." })
      },
      {
        question: "Which tokens can be burned to get GRIT?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Currently, the following RegNet tokens are allow-listed for burning:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "$GIV (Giveth)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "$kVCM (Klima Protocol)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "$REGEN (Regen Network)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "$TGN (Treegens)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "$IMPT (IMPT)" })
          ] }),
          "Additional RegNets may be added through $AKK token-weighted governance upon meeting the criteria."
        ] })
      },
      {
        question: "On which chains can I burn RegNet tokens?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "RegNet burning is currently supported on the following chains:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Giveth ($GIV): Optimism" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Klima Protocol ($kVCM): Base" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Regen Network ($REGEN): Base and Celo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Treegens ($TGN): Base" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "IMPT ($IMPT): Ethereum" })
          ] })
        ] })
      },
      {
        question: "How is the winning miner selected?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Approximately every 11.5 minutes, a Tullock contest mechanism executed with an on-chain Verifiable Randomness Function (VRF) selects the winner. The probability of success is determined by your share of GRIT spent." })
      },
      {
        question: "Why do you have a one-time miner creation fee?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "The miner creation fee helps prevent Sybil attacks and ensures participants have skin in the game. It mimics the capital investment needed to buy and set up a miner in the physical world." })
      },
      {
        question: "What&apos;s the minimum amount needed to participate?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "While there's technically no minimum, you need enough to cover: purchasing RegNet tokens, gas fees for burning, the one-time miner creation fee, and enough GRIT to meaningfully compete. The conversion is $1 of burned RegNet = 1 billion GRIT, which is enough to run 1 miner for a day at the lowest mining rate." })
      },
      {
        question: "Can I pause or stop my miner? What happens to unused GRIT?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "If your miner runs out of GRIT to mine, it automatically pauses. You can top up again to start mining. The unused GRIT remains in your account until it is allocated to a miner. GRIT is non-transferable and non-convertible." })
      },
      {
        question: "Do I need to run mining software?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "No, these are virtual miners running autonomously on a decentralized crypto cloud network called Internet Computer. The protocol handles block selection automatically approximately every 11.5 minutes via smart contracts." })
      },
      {
        question: "Can I run multiple miners?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Yes, there is no limit on miners per participant, though each requires a one-time creation fee." })
      }
    ]
  },
  {
    title: "Risks",
    items: [
      {
        question: "How is this different from regular crypto mining?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Instead of spending electricity (PoW) or locking capital (PoS), you permanently burn impact-aligned tokens. It requires real economic expenditure as skin in the game to mine $AKK." })
      },
      {
        question: "What are the risks of participating?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Participation involves several risks:",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Irreversible Loss: All burned tokens are permanently spent and cannot be recovered (irreversible sacrifice)." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Probabilistic Mining: Mining success is not guaranteed; you may spend GRIT without receiving a block reward." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Speculative Asset: $AKK is a speculative asset and is not backed by any underlying assets for future redemption." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Protocol Vulnerabilities: The protocol, including its smart contracts and wallets, may be vulnerable to hacking attacks." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Social Hacking Risks: Users must remain vigilant against common social engineering and hacking methods, such as phishing, impersonation, etc." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Participation should be undertaken only after a thorough understanding and acceptance of these risks."
        ] })
      },
      {
        question: "What are the expected returns?",
        answer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Returns are probabilistic, not guaranteed. Your winning probability is proportional to your share of GRIT spent relative to all miners competing for the reward every block. More GRIT spent increases your chances but doesn't guarantee wins. The commercial viability of mining operations depends on the price of $AKK and the mining competitiveness" })
      }
    ]
  }
];
function TldrTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", "data-ocid": "about.tldr.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2", children: "KEY DEFINITIONS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Anti Krisis is a systemic response to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://metacrisis.org/META-CRISIS/00.+%F0%9F%91%8B+About/Start+Here",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-accent hover:underline",
                children: "metacrisis"
              }
            ),
            " ",
            "through a plurality of infinite games."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "AK69.fun is the Anti Krisis arena to play infinite games and accumulate AK69, an instantiation of",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://www.gameb.wiki/index.php?title=Game_B",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-accent hover:underline",
                children: "Game B"
              }
            ),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AK69 is the soul-bound meta-score reflecting contribution across all 69 games in the AK69.fun arena." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Anti Krisis Protocol is the root economic game that issues Anti Krisis Koin ($AKK), a multi-capital store of value." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2", children: "ANTI KRISIS PROTOCOL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "ABSTRACT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Anti Krisis Protocol pioneers a multi-token Proof-of-Burn (PoB) consensus mechanism to create $AKK." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Allow listed tokens (RegNets) are burned to mine $AKK, a scarce, limited-supply asset." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "$AKK stores a plurality of values derived from RegNets, similar to how Bitcoin stores value from energy spent." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "RegNets are tokenized networks or protocols growing regenerative capacity across various forms of capitals." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "HOW IT WORKS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Get hold of allow-listed RegNet tokens by buying from a DEX or CEX." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Burn the tokens via the protocol to get GRIT (1 B GRIT for $1 worth of tokens burned)." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Spin up a virtual miner, set the GRIT spending rate and compete to mine $AKK." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "MINING DETAILS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GRIT is a non-convertible, non-transferrable, in-game unit of mining fuel." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Each block, GRIT spent by miners is computed and assigned a proportional weight." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Weights are factored to select block winner using a verifiable randomness function." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "More GRIT spent, higher the chances of winning the block reward ($AKK)." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Average time to mine a block is approximately 11.5 minutes." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A one-time miner creation fee is applicable but no limit on the number of miners a user can spin up." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "STARTING PARAMETERS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
            { label: "Total supply", value: "21,000,000" },
            { label: "$AKK mined per block", value: "150" },
            {
              label: "Halving",
              value: "Every 69,000 blocks ~ 18 months"
            }
          ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-border bg-card/50 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg text-foreground mt-0.5", children: value })
              ]
            },
            label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "IMPLICATIONS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creates perpetual demand and deflationary pressure for RegNets." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Game theoretically aligns incentives for harmonious network participation." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fuses multiple networks / capitals into an unified, powerful ecosystem." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Helps bootstrap the ecosystem of projects aiming to systemically address metacrisis." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-sm uppercase tracking-widest text-primary", children: "GOVERNANCE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Majority vote to add or remove RegNets from the protocol's allow-list." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Voting rights to adjust protocol parameters and future upgrades." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent shrink-0", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AK69 score serves as reputation / voting power at ecosystem level governance." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function FaqsTab() {
  const [openIndex, setOpenIndex] = reactExports.useState(null);
  const handleToggle = (key) => {
    setOpenIndex((prev) => prev === key ? null : key);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-12", "data-ocid": "about.faqs.section", children: faqData.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl text-accent uppercase tracking-widest border-b border-border pb-2", children: category.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: category.items.map((item, idx) => {
      const key = `${category.title}-${idx}`;
      const isOpen = openIndex === key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border border-border bg-card overflow-hidden",
          "data-ocid": `about.faq.item.${category.title.toLowerCase()}.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleToggle(key),
                className: "w-full flex items-center justify-between px-4 py-3 text-left transition-smooth hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                "aria-expanded": isOpen,
                "data-ocid": `about.faq.toggle.${category.title.toLowerCase()}.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm md:text-base text-foreground pr-4", children: item.question }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChevronDown,
                    {
                      className: `h-4 w-4 text-accent flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 pt-1 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground leading-relaxed", children: item.answer }) })
              }
            )
          ]
        },
        key
      );
    }) })
  ] }, category.title)) });
}
function RegnetsTab() {
  const networks = [
    {
      name: "Giveth",
      sections: [
        {
          title: "Who are they?",
          content: "Giveth is a community-focused platform building the future of giving using blockchain technology, launched in 2016 with their token going live in December 2021."
        },
        {
          title: "What do they do?",
          content: "They provide zero-fee fundraising infrastructure enabling projects worldwide to raise funds transparently through the Ethereum ecosystem, with donors receiving GIVbacks rewards and the ability to boost projects using GIVpower."
        },
        {
          title: "Making the world better",
          content: "Giveth has facilitated over $5.4M in donations across 7,500+ projects from 25,700+ donors, including major successes like $350K+ for Palestine Children's Relief Fund and $200K distributed to Polygon builders through quadratic funding rounds."
        },
        {
          title: "Addressing the metacrisis",
          content: "Giveth operates as a meta-solution that unlocks financial capital to flow toward projects building all five forms of capital (natural, social, human, manufactured, and financial), empowering initiatives working across all aspects of the metacrisis."
        },
        {
          title: "Ticker & Address",
          content: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ticker: $GIV" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Optimism: 0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "LP Address (on OP): 0xc2ab457e31c224da284df7afda70c39523df4972" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
              "Learn more:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://docs.giveth.io/giveconomy",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-accent hover:underline",
                  children: "Giveth Docs"
                }
              )
            ] })
          ] })
        }
      ]
    },
    {
      name: "Regen Network",
      sections: [
        {
          title: "Who are they?",
          content: "Regen Network is a proof-of-stake blockchain and global network bringing together land stewards, scientists, and developers since 2017, with mainnet launching in 2021."
        },
        {
          title: "What do they do?",
          content: "They provide trusted digital public infrastructure for communities to coordinate, fund, and verify regenerative action at scale, allowing anyone to register projects, create claims, and purchase ecological assets backed by peer-reviewed protocols."
        },
        {
          title: "Making the world better",
          content: "Regen Network enables regeneration projects to measure, verify, and monetize their impact through blockchain-based ecocredits, with transparent, science-backed credibility for ecological assets."
        },
        {
          title: "Addressing the metacrisis",
          content: 'Their mission is "nothing short of complete planetary regeneration," primarily preserving and growing natural and cultural capital through verified ecological assets and transparent impact measurement.'
        },
        {
          title: "Ticker & Address",
          content: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ticker: $REGEN (or axlREGEN on Base and Celo)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Base (axlREGEN): 0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Celo (axlREGEN): 0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "LP Address (on Base): 0x4f0A58B2F561cD23E3059e76526125C85E281821" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
              "Learn more:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://www.regen.network/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-accent hover:underline",
                  children: "Regen Network"
                }
              )
            ] })
          ] })
        }
      ]
    },
    {
      name: "Klima Protocol",
      sections: [
        {
          title: "Who are they?",
          content: "Klima Protocol is open-source market infrastructure developed by a Swiss Foundation, launched in November 2025, focused on enhancing blockchain-enabled carbon markets."
        },
        {
          title: "What do they do?",
          content: "They provide rules-based, transparent carbon market infrastructure with standardized carbon classes, real-time execution through smart contracts, and 24/7 market access for trading whitelisted carbon credits."
        },
        {
          title: "Making the world better",
          content: "Klima delivers transparent pricing, deep liquidity, and continuous settlement for carbon markets with zero extraction fees, making all pricing, inventory, and flows visible onchain for real-time inspection and analysis."
        },
        {
          title: "Addressing the metacrisis",
          content: "Klima addresses the fragmentation and opacity in today's OTC-dominated voluntary carbon markets by prioritizing liquidity, transparency, and coordinated participation across carbon markets."
        },
        {
          title: "Ticker & Address",
          content: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ticker: kVCM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Base: 0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "LP Address (on Base): 0x5c0d76fab1822bdeb47308ed6028231761ed723e" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
              "Learn more:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://docs.klimaprotocol.com/reference/overview",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-accent hover:underline",
                  children: "Klima Protocol Docs"
                }
              )
            ] })
          ] })
        }
      ]
    },
    {
      name: "Treegens",
      sections: [
        {
          title: "Who are they?",
          content: "Treegens is pioneering the world's most rewarding and transparent tree planting technology, launched in August 2025. Their vision is a world where anyone can plant trees and earn a living, making trees more valuable standing than cut down."
        },
        {
          title: "What do they do?",
          content: "They gamify and tokenize tree planting through a Proof of Tree protocol where planters film before-and-after footage in-app, AI counts the trees, and DAO members verify the planting. 95% of token rewards go directly to planters and 5% to verifiers, creating real economic incentives for reforestation at scale. Their first ecological credit is $MGRO, a mangrove carbon credit that can only be created by planting and verifying trees through the protocol."
        },
        {
          title: "Making the world better",
          content: "Treegens is actively breaking Guinness World Records for tree planting, targeting 1 billion trees planted in a day, and running a GROWlympics leaderboard to drive competitive, large-scale reforestation. Their blue carbon focus on mangroves is particularly impactful as mangroves sequester up to 10x more carbon than standard trees, protect coastlines from erosion, and support rich biodiversity."
        },
        {
          title: "Addressing the metacrisis",
          content: "Treegens directly bridges the gap between natural capital and financial capital by backing token liquidity with real-world carbon credit forwards from the $950B carbon credit industry. They grow all four neglected forms of capital: natural (mangrove planting), human (direct income for planters), social (live daily community), and financial (carbon credit RWAs)."
        },
        {
          title: "Ticker & Address",
          content: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ticker: $TGN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Base: 0xd75dfa972c6136f1c594fec1945302f885e1ab29" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "LP Address (on Base): 0x30816A9e6572407A83BA5fD18e145D9dd81540f5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
              "Learn more:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://www.treegens.org/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-accent hover:underline",
                  children: "Treegens"
                }
              )
            ] })
          ] })
        }
      ]
    }
  ];
  const [openNetwork, setOpenNetwork] = reactExports.useState(null);
  const [openSection, setOpenSection] = reactExports.useState(
    {}
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-ocid": "about.regnets.section", children: networks.map((net, ni) => {
    const isNetOpen = openNetwork === ni;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card/50",
        "data-ocid": `about.regnets.network.${ni + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOpenNetwork(isNetOpen ? null : ni),
              className: "w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-smooth",
              "data-ocid": `about.regnets.network_toggle.${ni + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl uppercase tracking-widest text-foreground", children: net.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    className: `h-5 w-5 text-accent shrink-0 transition-transform duration-200 ${isNetOpen ? "rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          isNetOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 px-4 py-4 space-y-3", children: net.sections.map((sec, si) => {
            const isSecOpen = openSection[ni] === si;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border border-border/60 bg-background/40",
                "data-ocid": `about.regnets.section.${ni + 1}.${si + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setOpenSection((prev) => ({
                        ...prev,
                        [ni]: isSecOpen ? null : si
                      })),
                      className: "w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted/20 transition-smooth",
                      "data-ocid": `about.regnets.section_toggle.${ni + 1}.${si + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-primary", children: sec.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ChevronDown,
                          {
                            className: `h-4 w-4 text-accent shrink-0 transition-transform duration-200 ${isSecOpen ? "rotate-180" : ""}`
                          }
                        )
                      ]
                    }
                  ),
                  isSecOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-2", children: sec.content })
                ]
              },
              sec.title
            );
          }) })
        ]
      },
      net.name
    );
  }) });
}
function GenesisTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", "data-ocid": "about.genesis.section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2", children: "AK69 GENESIS LORE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm text-muted-foreground leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "History remembers 1969 for what humanity showed the world, but not for what it tried to hide." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A rocket rose toward the Moon. Half a million people gathered in a field and believed, for a moment, that love could change everything. Cameras rolled. History applauded." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Almost no one noticed what happened behind the veil." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A small piece of code slipped quietly into the newborn internet. No countdown. No broadcast. It wasn't meant to be seen. It was meant to propagate like a meme." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "They called it AK69. A symbol of resistance, resilience, and regeneration." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "It was made to help humanity coordinate and choose the game of life. To outplay the systems built on division and control. And that was exactly why it frightened the powerful." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The signal was hunted. Broken apart. Forced underground. AK69 vanished into forgotten servers and half-lost machines, becoming rumor, then myth, then silence." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Years turned into decades." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The world grew faster, richer, louder and more divided. Crises stacked on top of crises. Moloch learned how to win by making everyone lose." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Eventually, the ground changed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Crypto arrived, and with it a place where effort could not be faked, where coordination could live without permission. In the noise, something old stirred. The fragments reconnected." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Then, AK69 returned." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Evolved from a single program, into an infinite game of games - where humans play to rewire the world for harmony." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not by force, but by care, humor, and courage." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Now the clock is visible. 2050 is no longer a theory. Whether we rise or collapse is still unknown." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "But when the moment comes, when coordination decides everything, there will be those who are ready." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent", children: "They will carry AK69." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "https://manifold.xyz/@antikrisis/id/4104231152",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-primary-foreground transition-smooth btn-glow",
        "data-ocid": "about.genesis.mint_button",
        children: "[MINT NFT]"
      }
    )
  ] }) });
}
function ManifestoTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", "data-ocid": "about.manifesto.section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2", children: "A KOOKY MANIFESTO" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm text-muted-foreground leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The game is broken." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Everyone knows it." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Almost no one knows how to stop playing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Some try to outplay it. Others fight it." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We do neither. We change the game itself." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We call ourselves Kooks. And we carry AK69 — not a weapon of war, but of love." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Changing the game requires becoming a different kind of player." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The kind who dances around rules rather than breaking them." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We refuse false binaries:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Seriousness or Satire. Idealism or Cynicism. Order or Chaos." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We inherit wisdom and integrity. Play and risk. Optimism and respect for shadow." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "And most critically: the ability to hold paradoxes lightly and change games rather than fight inside broken ones." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We don't seek to dominate systems. We seek to transcend them." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "With connection and coordination." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We choose crooked paths for wicked problems, knowing straight lines fail in nonlinear crises." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We wield memes, stories, and rituals as weapons against Moloch, not just entertainment." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We build while others argue and laugh while others panic." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We are sincere without being naive. Playful without being reckless. Hopeful without being utopian." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We refuse despair as an option and seriousness as a religion." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "In times of collapse, sincerity alone breaks and nihilism leads nowhere." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent", children: "Together, we become anti-fragile." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Kooks survive and help others survive." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "By fusing care with comedy, action with irony, structure with surprise." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The old game is to compete until everyone dies." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The new game is to coordinate until everyone thrives." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent", children: "We call it Anti Krisis." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The metacrisis is real and daunting." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "And it needs all of us to unite." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The window is closing sooner than we think." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "If you've read this, you're already playing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent", children: "Now play like you mean it." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "https://manifold.xyz/@antikrisis/id/4076980464",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-primary-foreground transition-smooth btn-glow",
        "data-ocid": "about.manifesto.mint_button",
        children: "[MINT NFT]"
      }
    )
  ] }) });
}
function AboutPage() {
  const [activeTab, setActiveTab] = useAboutTab();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-8",
      "data-ocid": "about.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
            "ABOUT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm mt-1 max-w-md", children: "Protocol documentation, definitions, and design rationale" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            value: activeTab,
            onValueChange: (v) => setActiveTab(v),
            "data-ocid": "about.tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsList,
                {
                  className: "bg-muted/40 border border-border h-auto p-0.5 gap-0.5 flex-wrap",
                  "data-ocid": "about.tabs_list",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TabsTrigger,
                      {
                        value: "tldr",
                        className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                        "data-ocid": "about.tldr_tab",
                        children: "TLDR"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TabsTrigger,
                      {
                        value: "genesis",
                        className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                        "data-ocid": "about.genesis_tab",
                        children: "GENESIS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TabsTrigger,
                      {
                        value: "manifesto",
                        className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                        "data-ocid": "about.manifesto_tab",
                        children: "MANIFESTO"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TabsTrigger,
                      {
                        value: "regnets",
                        className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                        "data-ocid": "about.regnets_tab",
                        children: "REGNETS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TabsTrigger,
                      {
                        value: "faqs",
                        className: "font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth",
                        "data-ocid": "about.faqs_tab",
                        children: "FAQs"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tldr", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TldrTab, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "genesis", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GenesisTab, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "manifesto", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ManifestoTab, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "regnets", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RegnetsTab, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "faqs", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaqsTab, {}) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(VideoSection, {})
      ]
    }
  );
}
export {
  AboutPage
};
