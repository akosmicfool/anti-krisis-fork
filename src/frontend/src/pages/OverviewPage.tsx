import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { VideoSection } from "../components/VideoSection";
import { BurnInfoSection } from "./overview/BurnInfoSection";
import { KeyInfoSection } from "./overview/KeyInfoSection";

// ─── Mini stat tile (matches Protocol State style) ────────────────────────────
function MiniStatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border p-3 sm:p-4 flex flex-col gap-1.5 min-w-0">
      <span className="text-xs uppercase tracking-widest font-mono text-white leading-tight truncate">
        {label}
      </span>
      <span className="font-mono font-bold text-base sm:text-xl text-accent truncate">
        {value}
      </span>
    </div>
  );
}

// ─── Hook: leaderboard counts ─────────────────────────────────────────────────
function useLeaderboardCounts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["leaderboardCounts"],
    queryFn: async () => {
      if (!actor) return { players: 0, tribes: 0 };
      const [players, tribes] = await Promise.all([
        actor.getTopPlayers("alltime"),
        actor.getTopTribes("alltime"),
      ]);
      return { players: players.length, tribes: tribes.length };
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Hook: total AK69 score ───────────────────────────────────────────────────
// ─── Hook: AK69 stockpile (cumulative all-time player scores) ─────────────────
function useTotalAk69Score() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["totalAk69Stockpile"],
    queryFn: async () => {
      if (!actor) return 0;
      // Stockpile = sum of every player's all-time AK69 score (daily scores
      // summed from genesis). Grows as days accrue.
      try {
        const v = await actor.getHistoryBasedAk69Stockpile();
        return typeof v === "number" ? v : Number(v);
      } catch {
        // Fall back to the identical aggregate endpoint if unavailable
        return actor.getTotalAk69Score();
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-start min-h-[50vh] px-4 py-8 sm:py-16 text-left overflow-hidden"
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

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 text-left">
        {/* Welcome line */}
        <p className="font-body text-sm sm:text-base tracking-widest">
          <span className="text-white font-normal">Welcome to the </span>
          <span className="text-accent font-bold">Arena</span>
          <span className="text-white font-normal">.</span>
        </p>

        {/* Italic subline */}
        <blockquote
          className="border-l-4 border-accent pl-4 font-body text-sm sm:text-base italic text-foreground/70 leading-relaxed"
          data-ocid="overview.hero_subline"
        >
          &ldquo;We see crises everywhere. It&apos;s not the players who are bad
          — it&apos;s the game itself.&rdquo;
        </blockquote>

        {/* Main headline */}
        <div className="flex items-baseline gap-3 sm:gap-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-accent leading-none tracking-wider drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]">
            ANTI KRISIS
          </h1>
          <span
            className="font-body text-sm sm:text-base text-foreground/70 italic tracking-wide"
            style={{
              fontFamily: "Tomorrow, sans-serif",
            }}
          >
            is...
          </span>
        </div>

        {/* Taglines */}
        <div className="space-y-3 mt-4 sm:mt-8 text-left">
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.hero_tagline.1"
          >
            <span className="text-accent mr-2">→</span>the{" "}
            <span className="text-accent font-normal">antithesis</span> to a
            world in <span className="text-accent font-normal">metacrisis</span>
          </p>
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.hero_tagline.2"
          >
            <span className="text-accent mr-2">→</span>an{" "}
            <span className="text-accent font-normal">infinite game</span> to
            coordinate civilization toward a{" "}
            <span className="text-accent font-normal">flourishing future</span>
          </p>
          <p
            className="font-body text-sm sm:text-base md:text-lg text-foreground/90 tracking-wide break-words"
            data-ocid="overview.hero_tagline.3"
          >
            <span className="text-accent mr-2">→</span>powered by the
            world&apos;s first{" "}
            <span className="text-accent font-normal">
              multi-capital store of value
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4 sm:pt-6">
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
            <span className="text-accent font-normal">
              extract, accumulate and collapse
            </span>{" "}
            — taking from the basis of life until there&apos;s nothing left.
          </p>
          <p data-ocid="overview.infinite_game_p2">
            Anti Krisis{" "}
            <span className="text-accent font-normal">redesigns the game</span>{" "}
            from the economic layer up, creating a foundation for civilisational
            coordination to{" "}
            <span className="text-accent font-normal">
              emerge in service of life
            </span>
            .
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
          <MiniStatTile
            label="Players"
            value={counts ? counts.players.toString() : "—"}
          />
          <MiniStatTile
            label="Tribes"
            value={counts ? counts.tribes.toString() : "—"}
          />
          {/* AKORE is the only game in the Anti Krisis network. Increment this when new games are added. */}
          <MiniStatTile label="Games" value="1" />
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
            Anti Krisis Protocol pioneers a multi-token{" "}
            <span className="text-accent font-normal">Proof of Burn</span>{" "}
            consensus mechanism to mine{" "}
            <span className="text-accent font-normal">
              Anti Krisis Koin ($AKK)
            </span>{" "}
            — the multi-capital SoV capped at{" "}
            <span className="text-accent font-normal">21 million.</span>
          </p>
          <p data-ocid="overview.kapital_fusion_p2">
            <span className="text-accent font-normal">$AKK</span> stores not
            just financial or manufactured capital, but also{" "}
            <span className="text-accent font-normal">
              natural, social and human
            </span>{" "}
            capitals - the value legacy economics calls externalities.
          </p>
        </div>

        {/* Read the Protocol link */}
        <div className="mt-4 sm:mt-5">
          <a
            href="/assets/ak_whitepaper_v1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.whitepaper_link"
          >
            <span>[Read the Protocol]</span>
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
        {/* Header row */}
        <div className="flex items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-accent tracking-widest">
            AK69
          </h2>
          <span
            className="font-body text-sm sm:text-base text-foreground/70 italic tracking-wide"
            style={{ fontFamily: "Tomorrow, sans-serif" }}
          >
            is your...
          </span>
        </div>

        {/* Taglines */}
        <div className="space-y-3 font-body text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed">
          <p data-ocid="overview.ak69_tagline.1">
            <span className="text-accent mr-2">→</span>soul-bound{" "}
            <span className="text-accent font-normal">meta score</span> in the
            Anti Krisis arena
          </p>
          <p data-ocid="overview.ak69_tagline.2">
            <span className="text-accent mr-2">→</span>symbol of{" "}
            <span className="text-accent font-normal">
              resistance, resilience and regeneration
            </span>
          </p>
          <p data-ocid="overview.ak69_tagline.3">
            <span className="text-accent mr-2">→</span>memetic{" "}
            <span className="text-accent font-normal">
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
      <HeroSection />
      <InfiniteGameSection />
      <KapitalFusionSection />
      <BurnInfoSection />
      <KeyInfoSection />
      <Ak69Section />
      <VideoSection />
    </div>
  );
}
