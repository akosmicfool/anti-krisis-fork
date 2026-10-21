import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { VideoSection } from "../components/VideoSection";
import { BurnInfoSection } from "./overview/BurnInfoSection";
import { KeyInfoSection } from "./overview/KeyInfoSection";

// ─── Side quote (left-bar pull quote, hero-style) ─────────────────────────────
function SideQuote({
  ocid,
  children,
}: {
  ocid?: string;
  children: ReactNode;
}) {
  return (
    <blockquote
      className="border-l-4 border-accent pl-4 font-body text-sm sm:text-base italic text-foreground/70 leading-relaxed"
      data-ocid={ocid}
    >
      {children}
    </blockquote>
  );
}

// ─── Mini stat tile (matches Protocol State style) ────────────────────────────
function MiniStatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border p-3 sm:p-4 flex flex-col gap-1.5 min-w-0">
      <span className="text-xs uppercase tracking-widest font-mono text-white leading-tight truncate">
        {label}
      </span>
      <span className="font-display font-bold text-xl sm:text-[25px] text-accent truncate">
        {value}
      </span>
    </div>
  );
}

// ─── Hook: network counts (players / tribes) ──────────────────────────────────
// Totals come from dedicated count endpoints, not from the top-list lengths —
// the leaderboards are capped (9 players / 6 tribes) and filtered.
function useLeaderboardCounts() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const players = useQuery({
    queryKey: ["playerCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getPlayerCount();
    },
    enabled,
    refetchInterval: 30_000,
  });

  const tribes = useQuery({
    queryKey: ["tribeCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTribeCount();
    },
    enabled,
    refetchInterval: 30_000,
  });

  return {
    data:
      players.data !== undefined && tribes.data !== undefined
        ? { players: players.data, tribes: tribes.data }
        : undefined,
  };
}

// ─── Hook: total AK69 score (cumulative all-time stockpile) ──────────────────
function useTotalAk69Score() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["totalAk69Stockpile"],
    queryFn: async () => {
      if (!actor) return 0;
      // Stockpile = sum of every player's all-time AK69 score (daily scores
      // summed from genesis). Grows as days accrue.
      const v = await actor.getTotalAk69Score();
      return typeof v === "number" ? v : Number(v);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Section 1 — Subvert hero (no section header) ─────────────────────────────
function SubvertHeroSection() {
  return (
    <section
      className="relative flex flex-col items-start px-4 pt-8 pb-8 sm:pt-10 sm:pb-12 text-left overflow-hidden"
      data-ocid="overview.hero_section"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)",
        }}
        aria-hidden="true"
      />

      {/* Glow blob */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl z-0"
        style={{ background: "rgba(0,255,65,0.04)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 text-left">
        {/* Stacked headline: INFINITE GAME / to subvert / METACRISIS */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-wider text-accent">
          <span className="block drop-shadow-[0_0_24px_rgba(0,255,65,0.45)]">
            INFINITE GAME
          </span>
          <span className="block font-body text-2xl sm:text-3xl md:text-4xl italic font-normal normal-case tracking-wide text-accent/80 my-1.5 sm:my-2.5">
            to subvert
          </span>
          <span className="block drop-shadow-[0_0_24px_rgba(0,255,65,0.45)]">
            METACRISIS
          </span>
        </h1>

        <SideQuote ocid="overview.hero_quote">
          &ldquo;We see crises everywhere — not because the players are evil,
          because the game is rigged. Its about time we change the game itself
          ✊&rdquo;
        </SideQuote>

        {/* CTA */}
        <div className="pt-1 sm:pt-3 flex flex-wrap items-center gap-4">
          <Link
            to="/about"
            search={{ tab: "tldr" }}
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.read_me_link"
          >
            <span>[Read Me]</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2 — Anti Krisis / Arena (previous hero) ──────────────────────────
function ArenaSection() {
  return (
    <section
      className="relative flex flex-col items-start px-4 py-8 sm:py-16 text-left overflow-hidden border-t border-border"
      data-ocid="overview.arena_section"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 text-left">
        {/* Transparent mark sized in em off the heading's own type scale, so it
            can never outgrow the wordmark at any breakpoint. */}
        <h2 className="flex items-center gap-3 sm:gap-5 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-accent leading-none tracking-wider">
          <img
            src="/assets/ak_logo_transparent.png"
            alt=""
            aria-hidden="true"
            className="h-[0.71em] w-[0.71em] shrink-0 object-contain drop-shadow-[0_0_16px_rgba(0,255,65,0.35)]"
            data-ocid="overview.arena_logo"
          />
          <span className="drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]">
            ANTI KRISIS
          </span>
        </h2>

        {/* Welcome line */}
        <p
          className="font-body text-sm sm:text-base tracking-widest"
          data-ocid="overview.arena_welcome"
        >
          <span className="text-white font-normal">Welcome to the </span>
          <span className="text-accent font-bold">Arena</span>
          <span className="text-white font-normal"> where we:</span>
        </p>

        {/* Taglines */}
        <div className="space-y-3 text-left">
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.arena_tagline.1"
          >
            <span className="text-accent mr-2">→</span>create the{" "}
            <span className="text-accent font-normal italic">antithesis</span>{" "}
            to a world in{" "}
            <a
              href="https://metacrisis.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-normal italic underline decoration-accent/40 underline-offset-4 hover:text-accent/80 hover:decoration-accent transition-colors"
            >
              metacrisis
            </a>
          </p>
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.arena_tagline.2"
          >
            <span className="text-accent mr-2">→</span>play an{" "}
            <a
              href="https://en.wikipedia.org/wiki/The_Infinite_Game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-normal italic underline decoration-accent/40 underline-offset-4 hover:text-accent/80 hover:decoration-accent transition-colors"
            >
              infinite game
            </a>{" "}
            to coordinate civilization toward a{" "}
            <span className="text-accent font-normal italic">
              thriving future
            </span>
          </p>
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.arena_tagline.3"
          >
            <span className="text-accent mr-2">→</span>compete to mine the only{" "}
            <span className="text-accent font-normal italic">
              multi-capital store of value
            </span>{" "}
            on Earth
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/akore"
            className="inline-flex items-center gap-2 border border-accent px-5 py-2.5 sm:px-6 sm:py-3 font-accent text-accent text-sm sm:text-base tracking-widest uppercase hover:bg-accent/10 transition-all duration-200 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)]"
            data-ocid="overview.hero_cta_button"
          >
            ENTER AKORE
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Infinite Game Section ─────────────────────────────────────────────────────
function InfiniteGameSection() {
  const { data: counts } = useLeaderboardCounts();

  return (
    <section
      className="py-8 sm:py-16 px-4 bg-card/40 border-t border-b border-border"
      data-ocid="overview.infinite_game_section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <img
            src="/assets/infinite_game_icon.png"
            alt="Infinite Game"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-accent tracking-widest">
            INFINITE GAME
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5 font-body text-sm sm:text-base md:text-lg text-foreground/85 leading-relaxed">
          <p data-ocid="overview.infinite_game_p1">
            The games we inherit are built to{" "}
            <span className="text-accent font-normal italic">
              extract, accumulate and collapse
            </span>{" "}
            — taking from the basis of life until there&apos;s nothing left.
          </p>
          <p data-ocid="overview.infinite_game_p2">
            Anti Krisis{" "}
            <span className="text-accent font-normal italic">
              redesigns the game
            </span>{" "}
            from the economic layer up, creating a foundation for coordination
            to emerge in{" "}
            <span className="text-accent font-normal italic">
              service of life.
            </span>
          </p>
        </div>

        {/* Secondary link */}
        <div className="mt-4 sm:mt-5">
          <a
            href="https://www.gameb.wiki/index.php?title=Game_B"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.game_b_link"
          >
            <span>[What is Game B]</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </div>

        {/* Stats row */}
        <div
          className="mt-6 grid grid-cols-3 gap-2 sm:gap-3"
          data-ocid="overview.infinite_game_stats"
        >
          {/* AKORE is the only game in the Anti Krisis network. Increment this when new games are added. */}
          <MiniStatTile label="Games" value="1" />
          <MiniStatTile
            label="Players"
            value={counts ? counts.players.toString() : "—"}
          />
          <MiniStatTile
            label="Tribes"
            value={counts ? counts.tribes.toString() : "—"}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Kapital Fusion Section ────────────────────────────────────────────────────
function KapitalFusionSection() {
  return (
    <section
      className="py-8 sm:py-16 px-4 border-t border-b border-border"
      data-ocid="overview.kapital_fusion_section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <img
            src="/assets/kapital_fusion_icon.png"
            alt="Kapital Fusion"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-accent tracking-widest">
            KAPITAL FUSION
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5 font-body text-sm sm:text-base md:text-lg text-foreground/85 leading-relaxed">
          <p data-ocid="overview.kapital_fusion_p1">
            Coordination is ensured by aligning{" "}
            <span className="text-accent font-normal italic">
              self interest with collective good
            </span>{" "}
            through game theoretic incentives of Anti Krisis Protocol.
          </p>
          <p data-ocid="overview.kapital_fusion_p2">
            It pioneers a multi-token{" "}
            <span className="text-accent font-normal italic">
              Proof of Burn
            </span>{" "}
            consensus mechanism to mine{" "}
            <span className="text-accent font-normal italic">
              Anti Krisis Koin ($AKK)
            </span>{" "}
            — the multi-capital store of value capped at{" "}
            <span className="text-accent font-normal italic">21 million.</span>
          </p>
          <p data-ocid="overview.kapital_fusion_p3">
            <span className="text-accent font-normal italic">$AKK</span> stores
            value from{" "}
            <span className="text-accent font-normal italic">
              natural, social and human
            </span>{" "}
            capitals — the values legacy economics calls externalities, while
            empowering those creating the capitals.
          </p>
        </div>

        {/* Read the whitepaper link */}
        <div className="mt-4 sm:mt-5">
          <a
            href="/assets/ak_whitepaper_v1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.whitepaper_link"
          >
            <span>[READ WHITEPAPER]</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── AK69 Section ─────────────────────────────────────────────────────────────
function Ak69Section() {
  const { data: totalScore } = useTotalAk69Score();

  return (
    <section
      className="py-8 sm:py-16 px-4 bg-card/40 border-t border-border"
      data-ocid="overview.ak69_section"
    >
      <div className="max-w-4xl mx-auto">
        {/* Lead-in + quote */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-5">
          <p className="font-body text-sm sm:text-base tracking-widest">
            <span className="text-white font-normal">
              One more thing&hellip;
            </span>
          </p>
          <SideQuote ocid="overview.ak69_quote">
            &ldquo;One game alone cannot subvert the metacrisis; imagine 69
            positive-sum games to slay Moloch 👹 🔫&rdquo;
          </SideQuote>
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide"
            data-ocid="overview.ak69_composite"
          >
            ...and one composite score to account for all!
          </p>
        </div>

        {/* Header row */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="flex items-center gap-3 sm:gap-4 font-display text-3xl sm:text-4xl md:text-5xl text-accent tracking-widest">
            <img
              src="/assets/ak69_icon.svg"
              alt=""
              aria-hidden="true"
              className="h-[0.71em] w-[0.71em] shrink-0 object-contain"
              data-ocid="overview.ak69_icon"
            />
            AK69
          </h2>
          <span
            className="font-body text-sm sm:text-base text-foreground/70 italic tracking-wide"
            style={{ fontFamily: "Tomorrow, sans-serif" }}
          >
            becomes your
          </span>
        </div>

        {/* Taglines */}
        <div className="space-y-3 font-body text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed">
          <p data-ocid="overview.ak69_tagline.1">
            <span className="text-accent mr-2">→</span>soul-bound{" "}
            <span className="text-accent font-normal italic">meta score</span>{" "}
            in the Anti Krisis arena
          </p>
          <p data-ocid="overview.ak69_tagline.2">
            <span className="text-accent mr-2">→</span>symbol of{" "}
            <span className="text-accent font-normal italic">
              resistance, resilience and regeneration
            </span>
          </p>
          <p data-ocid="overview.ak69_tagline.3">
            <span className="text-accent mr-2">→</span>memetic{" "}
            <span className="text-accent font-normal italic">
              weapon of mass coordination
            </span>
          </p>
        </div>

        {/* AK69 in the wild stat */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <MiniStatTile
            label="AK69 STOCKPILE"
            value={
              totalScore != null ? Math.round(totalScore).toLocaleString() : "—"
            }
          />
        </div>

        {/* Closing italic */}
        <p
          className="mt-6 font-body text-base sm:text-lg md:text-xl font-bold text-accent"
          data-ocid="overview.ak69_closing"
        >
          Wield it wisely 💚
        </p>
      </div>
    </section>
  );
}

// ─── Overview Page ─────────────────────────────────────────────────────────────
export function OverviewPage() {
  return (
    <div className="min-h-screen" data-ocid="overview.page">
      <SubvertHeroSection />
      <ArenaSection />
      <InfiniteGameSection />
      <KapitalFusionSection />
      <BurnInfoSection />
      <KeyInfoSection />
      <Ak69Section />
      <VideoSection />
    </div>
  );
}
