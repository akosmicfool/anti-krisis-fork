import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const faqData: FaqCategory[] = [
  {
    title: "General",
    items: [
      {
        question: "Why the hell are we doing this?",
        answer: (
          <>
            The metacrisis is real and the regen movement offers a systemic way
            to tackle it with a broad range of solutions. But the movement
            suffers from a coordination problem to attract capital and attention
            to go mainstream.
            <br />
            <br />
            Anti Krisis protocol solves this by uniting fragmented efforts
            through its Proof of Burn protocol. It creates perpetual demand for
            RegNet tokens and transforms them into a scarce, multi-capital store
            of value. It channels speculation, the force that usually drives
            extraction into an engine for regeneration, making regenerative
            action the most rational and rewarding choice.
          </>
        ),
      },
      {
        question: "What is the metacrisis?",
        answer: (
          <>
            The interconnected web of planetary crises - climate change,
            biodiversity loss, social unrest, systemic inequality that stem from
            deeper coordination failures in how humanity organizes economically,
            socially, and ecologically.
          </>
        ),
      },
      {
        question: "What are the 5 forms of capital?",
        answer: (
          <>
            Natural, social, human, manufactured, and financial capital.
            Traditional economics only optimizes for financial capital, while
            regeneration requires preserving and growing all five. Read more
            about them{" "}
            <a
              href="https://www.forumforthefuture.org/Handlers/Download.ashx?IDMF=8cdb0889-fa4a-4038-9e04-b6aefefe65a9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent/80"
            >
              here
            </a>
            .
          </>
        ),
      },
      {
        question: "What is AK69?",
        answer: (
          <>
            AK69 exists on multiple levels:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                A soulbound meta-score earned across 69 civilization games in
                AK69.fun arena.
              </li>
              <li>
                The memetic symbol representing reciprocity between Anti Krisis
                and RegNets.
              </li>
              <li>
                A cultural weapon against extractive systems symbolizing
                &quot;resistance, resilience, and regeneration&quot;.
              </li>
            </ul>
          </>
        ),
      },
      {
        question: "What are 69 civilization games?",
        answer: (
          <>
            Here&apos;s a thought experiment - what are the 69 games we ought to
            be playing to bring peace and harmony to this world? Beyond the core
            $AKK mining protocol, we imagine games like &quot;Memetik&quot;
            (cultural capital game through memes) and &quot;Kosmic&quot;
            (spiritual capital game through mindfullness). Each game scores
            contributions differently, allowing users to participate based on
            their unique capacities.
          </>
        ),
      },
      {
        question: "How is AK69 score calculated?",
        answer: (
          <>
            AK69 rewards both effort and outcomes with equal weight: your GRIT
            spent on mining and the $AKK you win. Each UTC day, your
            contribution on both legs is normalized against the whole network's
            activity for that day, and the two halves are averaged and scaled
            by 100 to form your Daily Score. Higher timescales are simply sums
            of Daily Scores: weekly adds the last 7 days, monthly 30,
            quarterly 90, yearly 365, and All-Time is the cumulative sum from
            genesis — so consistent participation compounds. Days without
            activity contribute 0. For tribes, each member's mining effort and
            wins are credited to their tribe for exactly the period they were a
            member (timestamp-accurate, even across mid-day switches).
          </>
        ),
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        question: "What is $AKK backed by?",
        answer: (
          <>
            $AKK is mined by the irreversible economic sacrifice of burning
            RegNet tokens with provable impact just like how Bitcoin is created
            by spending energy. Each unit of mining power is inseparably linked
            to the economics of ecological and social renewal. It is not backed
            by underlying assets in a traditional sense and cannot be redeemed
            for those assets when required.
          </>
        ),
      },
      {
        question: "What is the utility of $AKK?",
        answer: (
          <>
            $AKK serves multiple functions:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Governance: Propose and vote on RegNet additions/removals, burn
                weights, and protocol upgrades through token-weighted
                governance.
              </li>
              <li>
                Curation: Participate in identifying and elevating things
                relevant to the community.
              </li>
              <li>
                Store of Value: Functions as a multi-capital store of value
                anchored to regenerative principles. It can be used in all kinds
                of DeFi related applications.
              </li>
            </ul>
          </>
        ),
      },
      {
        question: "Where can I buy/sell $AKK after mining it?",
        answer: (
          <>
            Once enough $AKK is mined, liquidity pools will emerge to buy/sell.
            The details of which will be shared though the app when they become
            available.
          </>
        ),
      },
    ],
  },
  {
    title: "Mining Mechanics",
    items: [
      {
        question: "What wallet do I need?",
        answer: <>Any EVM-compatible wallet that works with WalletCollect.</>,
      },
      {
        question: "Which tokens can be burned to get GRIT?",
        answer: (
          <>
            Currently, the following RegNet tokens are allow-listed for burning:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>$GIV (Giveth)</li>
              <li>$kVCM (Klima Protocol)</li>
              <li>$REGEN (Regen Network)</li>
              <li>$TGN (Treegens)</li>
              <li>$IMPT (IMPT)</li>
            </ul>
            Additional RegNets may be added through $AKK token-weighted
            governance upon meeting the criteria.
          </>
        ),
      },
      {
        question: "On which chains can I burn RegNet tokens?",
        answer: (
          <>
            RegNet burning is currently supported on the following chains:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Giveth ($GIV): Optimism</li>
              <li>Klima Protocol ($kVCM): Base</li>
              <li>Regen Network ($REGEN): Base and Celo</li>
              <li>Treegens ($TGN): Base</li>
              <li>IMPT ($IMPT): Ethereum</li>
            </ul>
          </>
        ),
      },
      {
        question: "How is the winning miner selected?",
        answer: (
          <>
            Approximately every 11.5 minutes, a Tullock contest mechanism
            executed with an on-chain Verifiable Randomness Function (VRF)
            selects the winner. The probability of success is determined by your
            share of GRIT spent.
          </>
        ),
      },
      {
        question: "Why do you have a one-time miner creation fee?",
        answer: (
          <>
            The miner creation fee helps prevent Sybil attacks and ensures
            participants have skin in the game. It mimics the capital investment
            needed to buy and set up a miner in the physical world.
          </>
        ),
      },
      {
        question: "What&apos;s the minimum amount needed to participate?",
        answer: (
          <>
            While there&apos;s technically no minimum, you need enough to cover:
            purchasing RegNet tokens, gas fees for burning, the one-time miner
            creation fee, and enough GRIT to meaningfully compete. The
            conversion is $1 of burned RegNet = 1 billion GRIT, which is enough
            to run 1 miner for a day at the lowest mining rate.
          </>
        ),
      },
      {
        question: "Can I pause or stop my miner? What happens to unused GRIT?",
        answer: (
          <>
            If your miner runs out of GRIT to mine, it automatically pauses. You
            can top up again to start mining. The unused GRIT remains in your
            account until it is allocated to a miner. GRIT is non-transferable
            and non-convertible.
          </>
        ),
      },
      {
        question: "Do I need to run mining software?",
        answer: (
          <>
            No, these are virtual miners running autonomously on a decentralized
            crypto cloud network called Internet Computer. The protocol handles
            block selection automatically approximately every 11.5 minutes via
            smart contracts.
          </>
        ),
      },
      {
        question: "Can I run multiple miners?",
        answer: (
          <>
            Yes, there is no limit on miners per participant, though each
            requires a one-time creation fee.
          </>
        ),
      },
    ],
  },
  {
    title: "Risks",
    items: [
      {
        question: "How is this different from regular crypto mining?",
        answer: (
          <>
            Instead of spending electricity (PoW) or locking capital (PoS), you
            permanently burn impact-aligned tokens. It requires real economic
            expenditure as skin in the game to mine $AKK.
          </>
        ),
      },
      {
        question: "What are the risks of participating?",
        answer: (
          <>
            Participation involves several risks:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Irreversible Loss: All burned tokens are permanently spent and
                cannot be recovered (irreversible sacrifice).
              </li>
              <li>
                Probabilistic Mining: Mining success is not guaranteed; you may
                spend GRIT without receiving a block reward.
              </li>
              <li>
                Speculative Asset: $AKK is a speculative asset and is not backed
                by any underlying assets for future redemption.
              </li>
              <li>
                Protocol Vulnerabilities: The protocol, including its smart
                contracts and wallets, may be vulnerable to hacking attacks.
              </li>
              <li>
                Social Hacking Risks: Users must remain vigilant against common
                social engineering and hacking methods, such as phishing,
                impersonation, etc.
              </li>
            </ul>
            <br />
            Participation should be undertaken only after a thorough
            understanding and acceptance of these risks.
          </>
        ),
      },
      {
        question: "What are the expected returns?",
        answer: (
          <>
            Returns are probabilistic, not guaranteed. Your winning probability
            is proportional to your share of GRIT spent relative to all miners
            competing for the reward every block. More GRIT spent increases your
            chances but doesn&apos;t guarantee wins. The commercial viability of
            mining operations depends on the price of $AKK and the mining
            competitiveness
          </>
        ),
      },
    ],
  },
];

export function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-foreground uppercase tracking-widest mb-4">
            FAQs
          </h1>
          <div className="h-px w-24 bg-accent mx-auto" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqData.map((category) => (
            <section key={category.title} className="space-y-4">
              {/* Category Header */}
              <h2 className="font-display text-2xl md:text-3xl text-accent uppercase tracking-widest border-b border-border pb-2">
                {category.title}
              </h2>

              {/* Accordion Items */}
              <div className="space-y-2">
                {category.items.map((item, idx) => {
                  const key = `${category.title}-${idx}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={key}
                      className="border border-border bg-card overflow-hidden"
                      data-ocid={`faq.item.${category.title.toLowerCase()}.${idx + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(key)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left transition-smooth hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        aria-expanded={isOpen}
                        data-ocid={`faq.question_button.${category.title.toLowerCase()}.${idx + 1}`}
                      >
                        <span className="font-body text-sm md:text-base text-foreground pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-accent flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Answer Panel */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "max-h-[800px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-border/50">
                          <p className="font-body text-sm text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqsPage;
