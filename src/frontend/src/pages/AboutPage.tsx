import { VideoSection } from "@/components/VideoSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAboutTab } from "@/hooks/useAboutTab";
import { faqData } from "@/pages/FaqsPage";
import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type AboutTab = "tldr" | "genesis" | "manifesto" | "regnets" | "faqs";

// ─── Section Components ──────────────────────────────────────────────────────
function TldrTab() {
  return (
    <div className="space-y-10" data-ocid="about.tldr.section">
      {/* KEY DEFINITIONS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2">
          KEY DEFINITIONS
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            <span>
              Anti Krisis is a systemic response to{" "}
              <a
                href="https://metacrisis.org/META-CRISIS/00.+%F0%9F%91%8B+About/Start+Here"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                metacrisis
              </a>{" "}
              through a plurality of infinite games.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            <span>
              AK69.fun is the Anti Krisis arena to play infinite games and
              accumulate AK69, an instantiation of{" "}
              <a
                href="https://www.gameb.wiki/index.php?title=Game_B"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Game B
              </a>
              .
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            <span>
              AK69 is the soul-bound meta-score reflecting contribution across
              all 69 games in the AK69.fun arena.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">→</span>
            <span>
              Anti Krisis Protocol is the root economic game that issues Anti
              Krisis Koin ($AKK), a multi-capital store of value.
            </span>
          </li>
        </ul>
      </section>

      {/* ANTI KRISIS PROTOCOL */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2">
          ANTI KRISIS PROTOCOL
        </h2>

        <div className="space-y-6">
          {/* ABSTRACT */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              ABSTRACT
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Anti Krisis Protocol pioneers a multi-token Proof-of-Burn
                  (PoB) consensus mechanism to create $AKK.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Allow listed tokens (RegNets) are burned to mine $AKK, a
                  scarce, limited-supply asset.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  $AKK stores a plurality of values derived from RegNets,
                  similar to how Bitcoin stores value from energy spent.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  RegNets are tokenized networks or protocols growing
                  regenerative capacity across various forms of capitals.
                </span>
              </li>
            </ul>
          </div>

          {/* HOW IT WORKS */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              HOW IT WORKS
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Get hold of allow-listed RegNet tokens by buying from a DEX or
                  CEX.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Burn the tokens via the protocol to get GRIT (1 B GRIT for $1
                  worth of tokens burned).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Spin up a virtual miner, set the GRIT spending rate and
                  compete to mine $AKK.
                </span>
              </li>
            </ul>
          </div>

          {/* MINING DETAILS */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              MINING DETAILS
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  GRIT is a non-convertible, non-transferrable, in-game unit of
                  mining fuel.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Each block, GRIT spent by miners is computed and assigned a
                  proportional weight.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Weights are factored to select block winner using a verifiable
                  randomness function.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  More GRIT spent, higher the chances of winning the block
                  reward ($AKK).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Average time to mine a block is approximately 11.5 minutes.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  A one-time miner creation fee is applicable but no limit on
                  the number of miners a user can spin up.
                </span>
              </li>
            </ul>
          </div>

          {/* STARTING PARAMETERS */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              STARTING PARAMETERS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Total supply", value: "21,000,000" },
                { label: "$AKK mined per block", value: "150" },
                {
                  label: "Halving",
                  value: "Every 69,000 blocks ~ 18 months",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-border bg-card/50 p-3"
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {label}
                  </div>
                  <div className="font-display text-lg text-foreground mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMPLICATIONS */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              IMPLICATIONS
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Creates perpetual demand and deflationary pressure for
                  RegNets.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Game theoretically aligns incentives for harmonious network
                  participation.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Fuses multiple networks / capitals into an unified, powerful
                  ecosystem.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Helps bootstrap the ecosystem of projects aiming to
                  systemically address metacrisis.
                </span>
              </li>
            </ul>
          </div>

          {/* GOVERNANCE */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase tracking-widest text-primary">
              GOVERNANCE
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Majority vote to add or remove RegNets from the
                  protocol&apos;s allow-list.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  Voting rights to adjust protocol parameters and future
                  upgrades.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>
                  AK69 score serves as reputation / voting power at ecosystem
                  level governance.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqsTab() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-12" data-ocid="about.faqs.section">
      {faqData.map((category) => (
        <section key={category.title} className="space-y-4">
          <h2 className="font-display text-2xl md:text-3xl text-accent uppercase tracking-widest border-b border-border pb-2">
            {category.title}
          </h2>
          <div className="space-y-2">
            {category.items.map((item, idx) => {
              const key = `${category.title}-${idx}`;
              const isOpen = openIndex === key;
              return (
                <div
                  key={key}
                  className="border border-border bg-card overflow-hidden"
                  data-ocid={`about.faq.item.${category.title.toLowerCase()}.${idx + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-smooth hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    aria-expanded={isOpen}
                    data-ocid={`about.faq.toggle.${category.title.toLowerCase()}.${idx + 1}`}
                  >
                    <span className="font-body text-sm md:text-base text-foreground pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-accent flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
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
  );
}

function RegnetsTab() {
  const networks = [
    {
      name: "Giveth",
      sections: [
        {
          title: "Who are they?",
          content:
            "Giveth is a community-focused platform building the future of giving using blockchain technology, launched in 2016 with their token going live in December 2021.",
        },
        {
          title: "What do they do?",
          content:
            "They provide zero-fee fundraising infrastructure enabling projects worldwide to raise funds transparently through the Ethereum ecosystem, with donors receiving GIVbacks rewards and the ability to boost projects using GIVpower.",
        },
        {
          title: "Making the world better",
          content:
            "Giveth has facilitated over $5.4M in donations across 7,500+ projects from 25,700+ donors, including major successes like $350K+ for Palestine Children's Relief Fund and $200K distributed to Polygon builders through quadratic funding rounds.",
        },
        {
          title: "Addressing the metacrisis",
          content:
            "Giveth operates as a meta-solution that unlocks financial capital to flow toward projects building all five forms of capital (natural, social, human, manufactured, and financial), empowering initiatives working across all aspects of the metacrisis.",
        },
        {
          title: "Ticker & Address",
          content: (
            <>
              <ul className="space-y-1">
                <li>Ticker: $GIV</li>
                <li>Optimism: 0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98</li>
                <li>
                  LP Address (on OP): 0xc2ab457e31c224da284df7afda70c39523df4972
                </li>
              </ul>
              <p className="mt-2">
                Learn more:{" "}
                <a
                  href="https://docs.giveth.io/giveconomy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Giveth Docs
                </a>
              </p>
            </>
          ),
        },
      ],
    },
    {
      name: "Regen Network",
      sections: [
        {
          title: "Who are they?",
          content:
            "Regen Network is a proof-of-stake blockchain and global network bringing together land stewards, scientists, and developers since 2017, with mainnet launching in 2021.",
        },
        {
          title: "What do they do?",
          content:
            "They provide trusted digital public infrastructure for communities to coordinate, fund, and verify regenerative action at scale, allowing anyone to register projects, create claims, and purchase ecological assets backed by peer-reviewed protocols.",
        },
        {
          title: "Making the world better",
          content:
            "Regen Network enables regeneration projects to measure, verify, and monetize their impact through blockchain-based ecocredits, with transparent, science-backed credibility for ecological assets.",
        },
        {
          title: "Addressing the metacrisis",
          content:
            'Their mission is "nothing short of complete planetary regeneration," primarily preserving and growing natural and cultural capital through verified ecological assets and transparent impact measurement.',
        },
        {
          title: "Ticker & Address",
          content: (
            <>
              <ul className="space-y-1">
                <li>Ticker: $REGEN (or axlREGEN on Base and Celo)</li>
                <li>
                  Base (axlREGEN): 0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754
                </li>
                <li>
                  Celo (axlREGEN): 0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754
                </li>
                <li>
                  LP Address (on Base):
                  0x4f0A58B2F561cD23E3059e76526125C85E281821
                </li>
              </ul>
              <p className="mt-2">
                Learn more:{" "}
                <a
                  href="https://www.regen.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Regen Network
                </a>
              </p>
            </>
          ),
        },
      ],
    },
    {
      name: "Klima Protocol",
      sections: [
        {
          title: "Who are they?",
          content:
            "Klima Protocol is open-source market infrastructure developed by a Swiss Foundation, launched in November 2025, focused on enhancing blockchain-enabled carbon markets.",
        },
        {
          title: "What do they do?",
          content:
            "They provide rules-based, transparent carbon market infrastructure with standardized carbon classes, real-time execution through smart contracts, and 24/7 market access for trading whitelisted carbon credits.",
        },
        {
          title: "Making the world better",
          content:
            "Klima delivers transparent pricing, deep liquidity, and continuous settlement for carbon markets with zero extraction fees, making all pricing, inventory, and flows visible onchain for real-time inspection and analysis.",
        },
        {
          title: "Addressing the metacrisis",
          content:
            "Klima addresses the fragmentation and opacity in today's OTC-dominated voluntary carbon markets by prioritizing liquidity, transparency, and coordinated participation across carbon markets.",
        },
        {
          title: "Ticker & Address",
          content: (
            <>
              <ul className="space-y-1">
                <li>Ticker: kVCM</li>
                <li>Base: 0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d</li>
                <li>
                  LP Address (on Base):
                  0x5c0d76fab1822bdeb47308ed6028231761ed723e
                </li>
              </ul>
              <p className="mt-2">
                Learn more:{" "}
                <a
                  href="https://docs.klimaprotocol.com/reference/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Klima Protocol Docs
                </a>
              </p>
            </>
          ),
        },
      ],
    },
    {
      name: "Treegens",
      sections: [
        {
          title: "Who are they?",
          content:
            "Treegens is pioneering the world's most rewarding and transparent tree planting technology, launched in August 2025. Their vision is a world where anyone can plant trees and earn a living, making trees more valuable standing than cut down.",
        },
        {
          title: "What do they do?",
          content:
            "They gamify and tokenize tree planting through a Proof of Tree protocol where planters film before-and-after footage in-app, AI counts the trees, and DAO members verify the planting. 95% of token rewards go directly to planters and 5% to verifiers, creating real economic incentives for reforestation at scale. Their first ecological credit is $MGRO, a mangrove carbon credit that can only be created by planting and verifying trees through the protocol.",
        },
        {
          title: "Making the world better",
          content:
            "Treegens is actively breaking Guinness World Records for tree planting, targeting 1 billion trees planted in a day, and running a GROWlympics leaderboard to drive competitive, large-scale reforestation. Their blue carbon focus on mangroves is particularly impactful as mangroves sequester up to 10x more carbon than standard trees, protect coastlines from erosion, and support rich biodiversity.",
        },
        {
          title: "Addressing the metacrisis",
          content:
            "Treegens directly bridges the gap between natural capital and financial capital by backing token liquidity with real-world carbon credit forwards from the $950B carbon credit industry. They grow all four neglected forms of capital: natural (mangrove planting), human (direct income for planters), social (live daily community), and financial (carbon credit RWAs).",
        },
        {
          title: "Ticker & Address",
          content: (
            <>
              <ul className="space-y-1">
                <li>Ticker: $TGN</li>
                <li>Base: 0xd75dfa972c6136f1c594fec1945302f885e1ab29</li>
                <li>
                  LP Address (on Base):
                  0x30816A9e6572407A83BA5fD18e145D9dd81540f5
                </li>
              </ul>
              <p className="mt-2">
                Learn more:{" "}
                <a
                  href="https://www.treegens.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Treegens
                </a>
              </p>
            </>
          ),
        },
      ],
    },
  ];

  const [openNetwork, setOpenNetwork] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<Record<number, number | null>>(
    {},
  );

  return (
    <div className="space-y-6" data-ocid="about.regnets.section">
      {networks.map((net, ni) => {
        const isNetOpen = openNetwork === ni;
        return (
          <div
            key={net.name}
            className="border border-border bg-card/50"
            data-ocid={`about.regnets.network.${ni + 1}`}
          >
            <button
              type="button"
              onClick={() => setOpenNetwork(isNetOpen ? null : ni)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-smooth"
              data-ocid={`about.regnets.network_toggle.${ni + 1}`}
            >
              <span className="font-display text-xl uppercase tracking-widest text-foreground">
                {net.name}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-accent shrink-0 transition-transform duration-200 ${isNetOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isNetOpen && (
              <div className="border-t border-border/50 px-4 py-4 space-y-3">
                {net.sections.map((sec, si) => {
                  const isSecOpen = openSection[ni] === si;
                  return (
                    <div
                      key={sec.title}
                      className="border border-border/60 bg-background/40"
                      data-ocid={`about.regnets.section.${ni + 1}.${si + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSection((prev) => ({
                            ...prev,
                            [ni]: isSecOpen ? null : si,
                          }))
                        }
                        className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted/20 transition-smooth"
                        data-ocid={`about.regnets.section_toggle.${ni + 1}.${si + 1}`}
                      >
                        <span className="font-mono text-xs uppercase tracking-widest text-primary">
                          {sec.title}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-accent shrink-0 transition-transform duration-200 ${isSecOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isSecOpen && (
                        <div className="px-3 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-2">
                          {sec.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GenesisTab() {
  return (
    <div className="space-y-10" data-ocid="about.genesis.section">
      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2">
          AK69 GENESIS LORE
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            History remembers 1969 for what humanity showed the world, but not
            for what it tried to hide.
          </p>
          <p>
            A rocket rose toward the Moon. Half a million people gathered in a
            field and believed, for a moment, that love could change everything.
            Cameras rolled. History applauded.
          </p>
          <p>Almost no one noticed what happened behind the veil.</p>
          <p>
            A small piece of code slipped quietly into the newborn internet. No
            countdown. No broadcast. It wasn&apos;t meant to be seen. It was
            meant to propagate like a meme.
          </p>
          <p>
            They called it AK69. A symbol of resistance, resilience, and
            regeneration.
          </p>
          <p>
            It was made to help humanity coordinate and choose the game of life.
            To outplay the systems built on division and control. And that was
            exactly why it frightened the powerful.
          </p>
          <p>
            The signal was hunted. Broken apart. Forced underground. AK69
            vanished into forgotten servers and half-lost machines, becoming
            rumor, then myth, then silence.
          </p>
          <p>Years turned into decades.</p>
          <p>
            The world grew faster, richer, louder and more divided. Crises
            stacked on top of crises. Moloch learned how to win by making
            everyone lose.
          </p>
          <p>Eventually, the ground changed.</p>
          <p>
            Crypto arrived, and with it a place where effort could not be faked,
            where coordination could live without permission. In the noise,
            something old stirred. The fragments reconnected.
          </p>
          <p>Then, AK69 returned.</p>
          <p>
            Evolved from a single program, into an infinite game of games -
            where humans play to rewire the world for harmony.
          </p>
          <p>Not by force, but by care, humor, and courage.</p>
          <p>
            Now the clock is visible. 2050 is no longer a theory. Whether we
            rise or collapse is still unknown.
          </p>
          <p>
            But when the moment comes, when coordination decides everything,
            there will be those who are ready.
          </p>
          <p className="text-accent">They will carry AK69.</p>
        </div>
        <a
          href="https://manifold.xyz/@antikrisis/id/4104231152"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-primary-foreground transition-smooth btn-glow"
          data-ocid="about.genesis.mint_button"
        >
          [MINT NFT]
        </a>
      </section>
    </div>
  );
}

function ManifestoTab() {
  return (
    <div className="space-y-10" data-ocid="about.manifesto.section">
      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-foreground border-b border-border pb-2">
          A KOOKY MANIFESTO
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>The game is broken.</p>
          <p>Everyone knows it.</p>
          <p>Almost no one knows how to stop playing.</p>
          <p>Some try to outplay it. Others fight it.</p>
          <p>We do neither. We change the game itself.</p>
          <p>
            We call ourselves Kooks. And we carry AK69 — not a weapon of war,
            but of love.
          </p>
          <p>Changing the game requires becoming a different kind of player.</p>
          <p>The kind who dances around rules rather than breaking them.</p>
          <p>We refuse false binaries:</p>
          <p>Seriousness or Satire. Idealism or Cynicism. Order or Chaos.</p>
          <p>
            We inherit wisdom and integrity. Play and risk. Optimism and respect
            for shadow.
          </p>
          <p>
            And most critically: the ability to hold paradoxes lightly and
            change games rather than fight inside broken ones.
          </p>
          <p>
            We don&apos;t seek to dominate systems. We seek to transcend them.
          </p>
          <p>With connection and coordination.</p>
          <p>
            We choose crooked paths for wicked problems, knowing straight lines
            fail in nonlinear crises.
          </p>
          <p>
            We wield memes, stories, and rituals as weapons against Moloch, not
            just entertainment.
          </p>
          <p>We build while others argue and laugh while others panic.</p>
          <p>
            We are sincere without being naive. Playful without being reckless.
            Hopeful without being utopian.
          </p>
          <p>We refuse despair as an option and seriousness as a religion.</p>
          <p>
            In times of collapse, sincerity alone breaks and nihilism leads
            nowhere.
          </p>
          <p className="text-accent">Together, we become anti-fragile.</p>
          <p>Kooks survive and help others survive.</p>
          <p>
            By fusing care with comedy, action with irony, structure with
            surprise.
          </p>
          <p>The old game is to compete until everyone dies.</p>
          <p>The new game is to coordinate until everyone thrives.</p>
          <p className="text-accent">We call it Anti Krisis.</p>
          <p>The metacrisis is real and daunting.</p>
          <p>And it needs all of us to unite.</p>
          <p>The window is closing sooner than we think.</p>
          <p>If you&apos;ve read this, you&apos;re already playing.</p>
          <p className="text-accent">Now play like you mean it.</p>
        </div>
        <a
          href="https://manifold.xyz/@antikrisis/id/4076980464"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-primary-foreground transition-smooth btn-glow"
          data-ocid="about.manifesto.mint_button"
        >
          [MINT NFT]
        </a>
      </section>
    </div>
  );
}

// ─── About Page ──────────────────────────────────────────────────────────────
export function AboutPage() {
  const [activeTab, setActiveTab] = useAboutTab();

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
      data-ocid="about.page"
    >
      {/* Page header */}
      <div className="min-w-0">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
          <Info className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          ABOUT
        </h1>
        <p className="text-white text-sm mt-1 max-w-md">
          Protocol documentation, definitions, and design rationale
        </p>
      </div>

      {/* Sub-tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as AboutTab)}
        data-ocid="about.tabs"
      >
        <TabsList
          className="bg-muted/40 border border-border h-auto p-0.5 gap-0.5 flex-wrap"
          data-ocid="about.tabs_list"
        >
          <TabsTrigger
            value="tldr"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="about.tldr_tab"
          >
            TLDR
          </TabsTrigger>
          <TabsTrigger
            value="genesis"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="about.genesis_tab"
          >
            GENESIS
          </TabsTrigger>
          <TabsTrigger
            value="manifesto"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="about.manifesto_tab"
          >
            MANIFESTO
          </TabsTrigger>
          <TabsTrigger
            value="regnets"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="about.regnets_tab"
          >
            REGNETS
          </TabsTrigger>
          <TabsTrigger
            value="faqs"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="about.faqs_tab"
          >
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tldr" className="mt-6">
          <TldrTab />
        </TabsContent>
        <TabsContent value="genesis" className="mt-6">
          <GenesisTab />
        </TabsContent>
        <TabsContent value="manifesto" className="mt-6">
          <ManifestoTab />
        </TabsContent>
        <TabsContent value="regnets" className="mt-6">
          <RegnetsTab />
        </TabsContent>
        <TabsContent value="faqs" className="mt-6">
          <FaqsTab />
        </TabsContent>
      </Tabs>

      <VideoSection />
    </div>
  );
}
