import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ProtocolStatsGrid } from "../../components/ProtocolStatsGrid";

// ─── Section ──────────────────────────────────────────────────────────────────

export function KeyInfoSection() {
  return (
    <section
      className="py-8 sm:py-16 px-4 bg-card/40 border-t border-b border-border"
      data-ocid="overview.keyinfo_section"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <img
            src="/assets/key_info_icon.png"
            alt="Key Info"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-widest">
            PROTOCOL STATE
          </h2>
        </div>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-base text-foreground/85 leading-relaxed mb-6 sm:mb-8 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 shrink-0 animate-[blink_1.4s_ease-in-out_infinite]" />
          Live stats of Anti Krisis Protocol
        </p>

        {/* Stats grid */}
        <ProtocolStatsGrid />

        {/* Action buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/akore/blockhistory"
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.full_history_link"
          >
            <span>[Full History]</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
          <Link
            to="/akore"
            className="inline-flex items-center gap-2 border border-accent px-5 py-2.5 sm:px-6 sm:py-3 font-accent text-accent text-sm sm:text-base tracking-widest uppercase hover:bg-accent/10 transition-all duration-200 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)]"
            data-ocid="overview.get_mining_button"
          >
            GET MINING
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
