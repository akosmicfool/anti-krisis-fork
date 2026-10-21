// ─── Anti Krisis Whitepaper v1 ───────────────────────────────────────────────
// Content transcribed from "Anti Krisis Whitepaper v1.docx". The Tullock
// contest formula in §4.3 was an image in the source doc and is re-rendered
// as markup (kind: "formula").

export type WhitepaperBlock =
  | { kind: "p"; lead?: string; text: string }
  | { kind: "h4"; text: string }
  | { kind: "ul"; items: Array<{ lead?: string; text: string }> }
  | { kind: "formula" }
  | { kind: "refs"; items: string[] };

export interface WhitepaperSection {
  num: string;
  title: string;
  blocks: WhitepaperBlock[];
}

export const whitepaperTitle = "Anti Krisis Protocol";
export const whitepaperSubtitle = "A Proof of Burn Consensus Protocol";

export const whitepaperSections: WhitepaperSection[] = [
  {
    num: "1",
    title: "Abstract",
    blocks: [
      {
        kind: "p",
        text: "Anti Krisis Protocol is a consensus protocol that leverages Proof of Burn (PoB) to create a multi-capital store of value that aims to empower and unify diverse efforts addressing the metacrisis. By permanently burning aligned regenerative network tokens (RegNets), participants mine Anti Krisis Koin (AKK), a scarce digital asset with a fixed supply of 21 million.",
      },
      {
        kind: "p",
        text: "The protocol transforms token destruction into a coordination mechanism. Burning creates GRIT, a non-transferable mining unit, which is spent to create blocks and win AKK. This dynamic generates a perpetual demand for RegNet tokens, reduces their supply, and establishes AKK as a multi-capital store of value aligned with the principles of regenerative economics.",
      },
      {
        kind: "p",
        text: "Its design allows Anti Krisis to channel self-interest into a collective good. It resolves coordination failures by embedding positive externalities into the base consensus layer of a blockchain network. In doing so, it pioneers a new consensus mechanism that supports systemic regeneration by valuing other forms of capital overlooked by our current economic model.",
      },
    ],
  },
  {
    num: "2",
    title: "Introduction",
    blocks: [
      {
        kind: "p",
        text: "Bitcoin proved that distributed consensus can create incorruptible digital scarcity. Its Proof of Work (PoW) system aligns incentives through energy expenditure but at the cost of vast electricity consumption. Ethereum evolved toward Proof of Stake (PoS), offering efficiency but concentrating power among token-rich holders.",
      },
      {
        kind: "p",
        text: "Bittensor’s Yuma Consensus extended the paradigm by demonstrating how consensus mechanisms can be applied beyond pure financial transactions. It generalised PoW to incentivise the development of open-source AI infrastructure and models in a decentralised way and distribute rewards to the value creators fairly.",
      },
      {
        kind: "p",
        text: "While these mechanisms coordinate large, distributed networks of actors around specific causes, they fall short of directly addressing the planetary crises accelerating around us, such as climate change, biodiversity loss, social unrest and systemic inequality.",
      },
      {
        kind: "p",
        text: "Anti Krisis integrates regenerative principles into its consensus mechanism. By tying block production to the burning of RegNet tokens, it ensures that each unit of mining power is inseparably linked to the economics of ecological and social renewal.",
      },
      { kind: "p", text: "The result is a network that:" },
      {
        kind: "ul",
        items: [
          {
            text: "Secures consensus through scarcity dynamics, ensuring block production is grounded in real economic sacrifice.",
          },
          {
            text: "Supports regeneration by creating continuous demand for impact-oriented tokens, linking mining power to ecological and social outcomes.",
          },
          {
            text: "Provides a resilient store of value (AKK) that anchors and propels the ReFi movement while embodying multi-capital value beyond financial capital.",
          },
          {
            text: "Gamifies coordination, transforming regenerative action into a competitive yet collectively beneficial game for all.",
          },
          {
            text: "Signals credibility and alignment since burn tokens have provable impact, reinforcing trust across the ecosystem.",
          },
        ],
      },
      {
        kind: "p",
        text: "Just as Bitcoin solved the double-spend problem, Anti Krisis aims to solve the coordination failure problem at the heart of the metacrisis by aligning digital scarcity with real-world regeneration.",
      },
    ],
  },
  {
    num: "3",
    title: "Background",
    blocks: [
      { kind: "h4", text: "3.1 Systemic Issues" },
      {
        kind: "p",
        text: "Humanity’s crises are interlinked symptoms of deeper systemic failures that manifest across ecological, economic, and social dimensions. These failures share a common thread: coordination breakdowns that allow short-term optimisation to undermine long-term resilience.",
      },
      {
        kind: "p",
        lead: "Multipolar traps:",
        text: "In game-theoretic contexts, actors face the Prisoner’s Dilemma: while mutual cooperation yields the highest collective benefit, each fears exploitation if the other defects. Consequently, both defect and produce a worse outcome for all. This lack of trust locks everyone into collectively destructive outcomes that manifest as depletion of shared resources aka the classic tragedy of the commons.",
      },
      {
        kind: "p",
        lead: "Misaligned incentives:",
        text: "Financial and political systems are structured to prioritise short-term profit and political wins, often at the cost of long-term ecological and social resilience. This short-termism diverts capital and policy support away from regenerative solutions, creating underinvestment in systemic change. The result is a recurring cycle where immediate gains are glorified, but deeper structural stability and resilience remain unaddressed.",
      },
      {
        kind: "p",
        lead: "Siloed efforts:",
        text: "The regenerative movement is emerging in siloes, with fractured narratives and scattered attention. This sensemaking and coordination crisis prevents discovery and capital attraction, leaving room for hollow crypto narratives to hijack attention and block scaling of genuine impact.",
      },
      {
        kind: "p",
        lead: "Capital tunnel vision:",
        text: "Capital markets and funding flows narrowly focus on optimising for financial capital while ignoring other forms such as social, cultural, or ecological capital. This one-dimensional view starves systemic solutions of resources, undervalues regenerative outcomes that cannot be expressed in financial returns, and renders large-scale regeneration elusive.",
      },
      {
        kind: "p",
        text: "Together, these dynamics reinforce one another and reveal the urgent need for new forms of consensus and incentive alignment. While many other factors play a role, this paper highlights only the most pertinent ones in the Anti Krisis protocol.",
      },
      {
        kind: "h4",
        text: "3.2 Need for Consensus in Addressing the Metacrisis",
      },
      {
        kind: "p",
        text: "The challenge of the metacrisis is not only that humanity struggles to recognise the interconnected crises we face, but that even when the problems are acknowledged, there’s a lack of agreement on which solutions are legitimate. Proposals like carbon markets, geoengineering, de-growth, or AI alignment all come with deep trade-offs and moral stakes. In the absence of shared legitimacy, each solution risks being seen as progress by some and reckless harm by others. This fractures collective energy and turns potential collaboration into conflict.",
      },
      {
        kind: "p",
        text: "Consensus, therefore, must go deeper than problem diagnosis. It must provide a shared framework for evaluating which responses deserve trust and support. Such a framework does not require unanimity on a single path, but it demands agreement on the criteria by which solutions are judged considering ethical principles, systemic impacts, and thresholds of risk. With this evaluative consensus in place, diversity of approaches becomes a strength rather than a liability, since differing efforts can inter-operate instead of undermining one another.",
      },
      {
        kind: "p",
        text: "This transforms coordination from shallow alignment into resilient cooperation. Consensus on legitimacy creates a protocol layer that allows polycentric action — many actors, many contexts, one underlying basis of trust. Without it, our collective response to the metacrisis will remain fragmented and fragile. With it, we gain the coherence needed to face complexity together and move from scattered reactions to true collective intelligence.",
      },
      { kind: "p", text: "A consensus layer for regeneration is:" },
      {
        kind: "ul",
        items: [
          { text: "One that aligns incentives across diverse actors." },
          {
            text: "One that embeds real-world ecological, social, cultural, and economic value directly into protocol mechanics.",
          },
          {
            text: "One that is fair and credibly neutral, yet oriented toward life rather than entropy.",
          },
        ],
      },
      { kind: "h4", text: "3.3 Overview of Consensus Mechanisms" },
      {
        kind: "p",
        lead: "Proof of Work (PoW):",
        text: "Bitcoin’s PoW requires miners to spend computational energy to solve cryptographic puzzles in order to validate transactions and secure the network. This mechanism anchors security in measurable energy expenditure, making it costly to attack the system.",
      },
      {
        kind: "p",
        lead: "Strengths:",
        text: "simple, battle-tested, and provides objective security through energy expenditure.",
      },
      {
        kind: "p",
        lead: "Weaknesses:",
        text: "massive energy consumption, industrial mining centralisation and significant ecological cost.",
      },
      {
        kind: "p",
        lead: "Proof of Stake (PoS):",
        text: "Ethereum’s PoS secures the network by requiring validators to lock up tokens as collateral. Validators are then selected to propose and attest to blocks in proportion to their stake, making attacks costly since malicious behaviour risks losing the staked funds. This mechanism reduces energy use compared to PoW and rewards honest participation.",
      },
      {
        kind: "p",
        lead: "Strengths:",
        text: "efficiency, capital lock discourages attacks.",
      },
      {
        kind: "p",
        lead: "Weaknesses:",
        text: 'plutocracy risk, "rich get richer" dynamics, cartelisation.',
      },
      {
        kind: "p",
        lead: "Proof of Intelligence (PoI):",
        text: "Bittensor’s Yuma Consensus extends the consensus paradigm by incentivising the creation and validation of machine intelligence, open-source AI models and infrastructure. In this mechanism, miners contribute resources or model outputs, validators assess their quality, and subnet owners set the rules, with rewards distributed using a stake-weighted mechanism. It generalises PoW to knowledge production, demonstrating how blockchain consensus can create valuable work rather than just financial transactions.",
      },
      {
        kind: "p",
        lead: "Strengths:",
        text: "rewards useful AI outputs, task-based validation.",
      },
      {
        kind: "p",
        lead: "Weaknesses:",
        text: "specialised, not yet generalised to real-world use cases where validation is not purely digital.",
      },
      {
        kind: "p",
        lead: "Proof of Virtual Work (PoVW):",
        text: "Blockchain on Blockchain (BOB) pioneered a form of virtual Proof of Work (PoW) on the Internet Computer Protocol (ICP), where on-chain computation units (cycles) replaced the role of energy expenditure and specialised mining hardware. The mechanism offered a pathway to transform inflationary ICP into a scarce digital asset. BOB successfully reinvigorated network activity and proved how virtualised resource expenditure could replicate scarcity dynamics with mutually reinforcing benefits.",
      },
      {
        kind: "p",
        lead: "Strengths:",
        text: "demonstrated how virtualized work could create scarcity without relying on physical systems.",
      },
      {
        kind: "p",
        lead: "Weaknesses:",
        text: "sustainability depended on ongoing speculative demand, limited direct connection to real-world impact. Vulnerable to concentration if a small number of participants controlled large amounts of ICP.",
      },
      {
        kind: "p",
        lead: "Proof of Burn (PoB):",
        text: "PoB requires participants to verifiably burn tokens in exchange for the right to mine a token, create new blocks and secure the network. The act of burning represents an irreversible economic sacrifice, which becomes the basis of security and fairness in the system.",
      },
      {
        kind: "p",
        lead: "Strengths:",
        text: "uses irreversible economic sacrifice as skin-in-the-game, easy to verify, removes supply of existing assets.",
      },
      {
        kind: "p",
        lead: "Weaknesses:",
        text: 'traditionally criticised for "waste," unless burn creates systemic externalities of value. Plutocracy could creep into the mining process and capture the protocol without effective guardrails.',
      },
      {
        kind: "p",
        text: "Anti Krisis posits to resolve these weaknesses by:",
      },
      {
        kind: "ul",
        items: [
          {
            text: "Ensuring the value captured in AKK is rooted in real-world impact rather than speculation by selecting legitimate RegNet tokens as burnable assets.",
          },
          {
            text: "Incorporating a range of mechanisms such as limiting miners per account, employing sybil-resistance, applying quadratic throttling to reduce disproportionate advantage, introducing demurrage to discourage hoarding, and other adaptive safeguards against mining centralisation.",
          },
        ],
      },
      {
        kind: "p",
        text: "Together, these measures aim to sustain the fairness, decentralisation and legitimacy of the network.",
      },
    ],
  },
  {
    num: "4",
    title: "Mining Mechanism",
    blocks: [
      { kind: "h4", text: "4.1 RegNet Burning" },
      {
        kind: "p",
        text: "First, miners acquire RegNet tokens through decentralised or centralised exchanges. They then burn the tokens by sending them to the null address via the protocol and in return receive GRIT, a non-transferable mining fuel at a set conversion rate.",
      },
      {
        kind: "p",
        text: "The conversion rate is subject to change as the protocol evolves to accommodate RegNets of varying market caps in a manner that prevents bigger projects from overpowering smaller ones. Initially, the protocol sets the rate at 1 billion GRIT for each $1 worth of burned RegNets tokens..",
      },
      { kind: "h4", text: "4.2 GRIT Spending" },
      {
        kind: "p",
        text: "The users create virtual mining rigs (miners) and allocate GRIT to compete for block rewards, i.e. AKK. At genesis, there will be no limits on the number of miners a participant can set up.",
      },
      {
        kind: "p",
        text: "They can adjust the GRIT spending rate (between 1 and 10 billion GRIT per day) of the miners to affect their chances of winning the block reward proportionally. The higher the GRIT spent, the greater a miner’s chance of winning.",
      },
      { kind: "h4", text: "4.3 Block Winning" },
      {
        kind: "p",
        text: 'Approximately every 11.5 minutes, a Tullock contest mechanism executed with an on-chain verifiable randomness function (VRF) selects a block winner. The probability of success is determined by the share of GRIT spent by the miner. In a contest with "n" players, let xi be the effort (GRIT) exerted by player "i". The probability "pi" of player "i" winning is:',
      },
      { kind: "formula" },
      { kind: "p", text: "Where," },
      {
        kind: "ul",
        items: [
          {
            lead: "xi =",
            text: 'The effort or resource expenditure of player "i" (i.e. GRIT earned by burning RegNet tokens).',
          },
          {
            lead: "r > 0 =",
            text: "the contest intensity parameter (also called the Tullock exponent). This protocol sets the parameter as: r = 1.",
          },
        ],
      },
      {
        kind: "ul",
        items: [
          {
            text: "If r=1: linear contest where the probability of winning is proportional to effort.",
          },
          {
            text: "If r>1: higher efforts are disproportionately rewarded (strong contests).",
          },
          { text: "If 0<r<1: luck plays a bigger role (weaker contests)." },
        ],
      },
      {
        kind: "p",
        text: "At genesis, the block reward of 150 AKK is distributed to the winning miner. This block reward is programmed to halve every 69,000 blocks (roughly 18 months), echoing Bitcoin’s halving cycle but on a shorter cadence. The total supply is capped at 21 million AKK, mirroring Bitcoin’s maximum limit and ensuring predictable scarcity.",
      },
      {
        kind: "p",
        text: "All GRIT spent during the process is permanently consumed, creating ongoing buy pressure for RegNet tokens. By consuming multiple tokens and transforming into a single asset, the protocol aligns network incentives with long-term value preservation.",
      },
    ],
  },
  {
    num: "5",
    title: "Governance",
    blocks: [
      { kind: "h4", text: "5.1 RegNets Allowlist" },
      {
        kind: "p",
        text: "AKK holders may propose additions or removal of RegNets from the burn mechanism through a token-weighted governance process. All proposals require a defined quorum and majority approval to be enacted, ensuring that allowlist changes reflect broad community agreement and legitimacy of the protocol.",
      },
      { kind: "h4", text: "Genesis RegNet Criteria" },
      {
        kind: "p",
        text: "To ensure fairness, legitimacy, decentralisation and plurality of values to be integrated at the consensus layer, RegNets must meet the following criteria:",
      },
      {
        kind: "ul",
        items: [
          {
            lead: "Team –",
            text: "A core team actively stewarding the project with transparent governance.",
          },
          {
            lead: "Token age –",
            text: "Active for over six months to demonstrate stability.",
          },
          {
            lead: "Users –",
            text: "Minimum of 100 unique holders to indicate community traction.",
          },
          {
            lead: "Chain compatibility –",
            text: "EVM, BTC, SOL, and other chainfusion-compatible chains.",
          },
          {
            lead: "Market cap –",
            text: "At genesis, a minimum of $0.5 million and maximum relative capitalisation up to 10x of the lowest cap RegNet. This is to establish a positive-sum flywheel between RegNets and AKK, while avoiding disproportionate advantage to established networks.",
          },
          {
            lead: "Liquidity –",
            text: "Sufficient depth to ensure trades up to $100 incur less than 2% slippage.",
          },
          {
            lead: "Price oracle –",
            text: "Must have reliable price feeds to support accurate smart contract execution.",
          },
          {
            lead: "Proof of Impact -",
            text: "Must demonstrate continual preservation or growth of at least one of the 5 forms of capital in a verifiable way contributing toward a regenerative future.",
          },
          {
            lead: "Token types –",
            text: "RegNet tokens must represent project market capitalisation or function as an index of multiple impact assets. They can also be governance tokens but stablecoins are excluded as their fixed value prevents price action and the feedback loops the protocol is designed to reinforce.",
          },
          {
            lead: "Project maturity –",
            text: "Projects must be beyond MVP stage, ideally approaching product-market fit or already achieved it. Projects needing support to bootstrap or scale into their next phase and undervalued are also suitable.",
          },
          {
            lead: "Protocol exit –",
            text: "RegNets can exit the protocol once they achieve economic sustainability, creating space for newer projects.",
          },
        ],
      },
      { kind: "h4", text: "5.2 Burn Weights" },
      {
        kind: "p",
        text: "Burn weights determine how one unit of value (example $1 or 1 eth) is distributed to burn all RegNets when miners prefer to burn the tokens neutrally. The weights determine the buy pressure the protocol brings to each RegNet for burning and converting to GRIT with a neutral currency instead of a RegNet token.",
      },
      {
        kind: "p",
        text: "A stake-weighted mechanism allows the protocol to value different RegNets according to community priorities and impact assessments. Governance can adjust the weights over time to reflect evolving conditions, maintain fairness, and signal which RegNets the network values most.",
      },
      { kind: "h4", text: "5.3 Curation" },
      {
        kind: "p",
        text: "Fair AKK mining creates the foundation for higher-order governance functions such as curation of applications and initiatives most relevant to the community. As creation becomes democratized through advances in AI, the ability to identify and elevate valuable work will be as important as its production.",
      },
      { kind: "h4", text: "5.4 Network Upgrades" },
      {
        kind: "p",
        text: "AKK holders can propose and vote on protocol upgrades through the token-weighted governance process. This allows Anti Krisis to evolve through community-driven decision making, preserving adaptability without reliance on central authority.",
      },
    ],
  },
  {
    num: "6",
    title: "Implications",
    blocks: [
      { kind: "h4", text: "6.1 On RegNets" },
      {
        kind: "p",
        text: "Perpetual demand for RegNets strengthens their long-term valuation and growth. Continuous burning creates deflationary pressure and reflexive feedback loops that both reduce circulating supply and signal credibility. Over time, RegNets become more resilient, better capitalised, and empowered to deliver measurable regenerative impact across capitals.",
      },
      {
        kind: "p",
        text: 'In conventional markets, competition often leads to a "race to the bottom", where rivals undercut one another, degrade quality, and externalize costs. PoB consensus mechanism flips this dynamic by embedding RegNets in a positive-sum game: every burn reduces circulating supply, reinforcing scarcity and strengthening value, while governance ensures only credible, high-impact networks remain eligible. Rather than eroding one another, RegNets now compete to show resilience, activity, and integrity, creating a reputational feedback loop that channels self-interest into collective strength by transforming destructive competition into a "race to the top."',
      },
      { kind: "h4", text: "6.2 On the ReFi Ecosystem" },
      {
        kind: "p",
        text: "Anti Krisis introduces a fair, neutral and scarce asset that anchors and propels Regenerative Finance (ReFi) into the mainstream by providing a common reference point for value. It channels otherwise fragmented initiatives into a shared consensus and value-signalling mechanism, giving coherence to diverse efforts. By aligning incentives through market-driven dynamics, it bootstraps the regenerative movement. Participants compete for mining AKK, but the only path to that reward is by burning RegNets, which strengthens their markets and impact.",
      },
      {
        kind: "p",
        text: 'This design leverages speculation and scarcity, the forces that normally drive extraction into engines of regeneration. It strengthens ecosystem resilience where RegNets can leverage the mechanism to overcome the "valley of death", access sustained capital flows and mature into self-sustaining, high-impact networks.',
      },
      { kind: "h4", text: "6.3 On our Civilization" },
      {
        kind: "p",
        lead: "From multipolar traps to coordination flywheels:",
        text: "In conventional multipolar traps, each actor’s rational pursuit of self-interest produces collective harm. Anti Krisis inverts this dynamic by embedding collaboration directly into its incentive structure. The most rational individual strategy i.e. burning RegNets for mining power is simultaneously the one that sustains real-world regenerative efforts. Game theory is therefore reoriented so that self-interest yields collective benefit as a by-product. Competition transforms into cooperation, turning what would otherwise be coordination failures into regenerative flywheels.",
      },
      {
        kind: "p",
        lead: "Civilisational significance:",
        text: "Bitcoin proved the viability of digital scarcity, anchoring value in cryptographic proof and energy expenditure. Anti Krisis advances this concept to regenerative scarcity, where value is anchored in irreversible contributions to ecological and social renewal. Instead of securing trust solely through energy burn or capital lock, it ties scarcity to regenerative sacrifice (burning tokens) linked to verifiable real-world impact. In doing so, it reframes scarcity itself as a driver of systemic change and positions AKK not only as a scarce digital asset but as a potential civilisational tool to confront metacrisis, rooted in regeneration rather than extraction.",
      },
    ],
  },
  {
    num: "7",
    title: "Future Prospects",
    blocks: [
      {
        kind: "p",
        text: "This whitepaper primarily positions Anti Krisis as a capital formation mechanism that establishes a multi-capital store of value analogous to Bitcoin. While its current design focuses on creation, governance of protocol parameters and curation, the underlying architecture holds potential to mature far beyond these foundational capabilities.",
      },
      {
        kind: "p",
        text: "Future evolutions of the protocol may extend governance functionality to include capital allocation toward new ventures in a market-driven manner, similar to Bittensor’s incentive architecture. Through this expansion, the network would grow into both a capital allocator and curator of innovation; supporting applications and primitives that directly address dimensions of the metacrisis. Allocators and contributors may receive reciprocal value either through newly issued tokens or revenue-sharing mechanisms proportionate to the capital they deploy.",
      },
      {
        kind: "p",
        text: "Such extensions would elevate Anti Krisis from a consensus protocol into an adaptive economic coordination engine capable of bootstrapping the ecosystem. By integrating value creation, governance, and capital allocation into a unified design, the protocol could catalyse mainstream adoption of regenerative economics in a decentralized way. These possibilities are under active research and will be elaborated in future technical specifications.",
      },
    ],
  },
  {
    num: "8",
    title: "Conclusion",
    blocks: [
      {
        kind: "p",
        text: "Anti Krisis is a consensus protocol designed to unlock coordination across the regenerative movement. It not only secures digital scarcity but also rewires economic incentives so that regenerative action becomes the most rational and rewarding choice.",
      },
      {
        kind: "p",
        text: "With a fixed supply of AKK, reflexive demand for RegNets, and democratic governance, Anti Krisis offers a credible, regenerative alternative to existing consensus models. It transforms destruction (burning) into creation (coordination), serving as a new capital formation mechanism that adapts the most effective elements of Bitcoin, Bittensor, and BOB — all of which demonstrate how scarcity can drive coordination at scale.",
      },
      {
        kind: "p",
        text: "Just as Bitcoin became digital gold, Anti Krisis positions AKK as the next evolutionary step: moving from a single-capital store of value to a pioneering multi-capital store of value aligned with the principles of regenerative economics.",
      },
    ],
  },
  {
    num: "9",
    title: "References",
    blocks: [
      {
        kind: "refs",
        items: [
          "Satoshi Nakamoto, Bitcoin: A Peer-to-Peer Electronic Cash System, 2008.",
          "Sunny King and Scott Nadal. PPCoin: Peer-to-Peer Crypto-Currency with Proof-of-Stake, 2012.",
          "Bittensor Foundation, Yuma Consensus Whitepaper, 2023.",
          "Iain Stewart, Bitcoin Wiki: Proof of Burn, 2012.",
          "P4Titan, Slimcoin: A Peer-to-Peer Crypto-Currency with Proof-of-Burn, 2014.",
          "Kyle Langham, Chain Fusion Ecosystem Report, 2024.",
        ],
      },
    ],
  },
];
