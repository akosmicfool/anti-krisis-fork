import { X } from "lucide-react";
import { useState } from "react";

/**
 * Play-mode reminder banner, pinned at the very top of the app shell.
 * Dismissible for the session — it is plain component state (never persisted),
 * so the banner reappears on every app refresh by design.
 */
export function PlayModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="border-b border-[#00ff41]/30 bg-[#00ff41]/5"
      data-ocid="banner.play_mode"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-start gap-3">
        <p className="flex-1 font-body text-sm md:text-base leading-relaxed text-center">
          <span className="text-white">⚠️ Attention - </span>
          <span className="text-accent font-normal italic">
            we&apos;re in play mode
          </span>
          <span className="text-white">
            ! Get familiar with using the app and surface any issues to fix or
            improve before final release. To facilitate robust testing,
            we&apos;ve{" "}
          </span>
          <span className="text-accent font-normal italic">
            scaled down cost of mining by 100x
          </span>
          <span className="text-white">. You will be burning </span>
          <span className="text-accent font-bold">real RegNet tokens</span>
          <span className="text-white"> to earn GRIT (issuance rate: </span>
          <span className="text-accent font-normal italic">
            100 billion per $1 burned
          </span>
          <span className="text-white">). </span>
          <span className="text-accent font-bold">Do not</span>
          <span className="text-white">
            {" "}
            burn more than $1 per RegNet token as all{" "}
          </span>
          <span className="text-accent font-normal italic">
            GRIT earned will be reset after play mode
          </span>
          <span className="text-white">.</span>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss play mode banner"
          className="shrink-0 mt-0.5 p-1 text-muted-foreground hover:text-white transition-colors"
          data-ocid="banner.play_mode_dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
