import { AcquireSection } from "@/components/AcquireSection";
import {
  ChevronDown,
  ChevronUp,
  Flame,
  PickaxeIcon,
  ShoppingCart,
  Swords,
} from "lucide-react";
import { motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { VideoSection } from "../components/VideoSection";
import { useGetLaunchGateConfig } from "../hooks/use-backend";
import { BurnPage } from "./BurnPage";
import { MiningPage } from "./MiningPage";

export function AkorePage() {
  const [activeSection, setActiveSection] = useState<
    null | "acquire" | "burn" | "mine"
  >(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // ── Launch Gate countdown at page level ───────────────────────────────────
  const { data: launchGateData } = useGetLaunchGateConfig();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!launchGateData?.launchTimeEnabled || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [launchGateData?.launchTimeEnabled, launchGateData?.launchTime]);

  const isLaunchTimeBlocked = !!(
    launchGateData?.launchTimeEnabled &&
    Date.now() < Number(launchGateData.launchTime ?? 0)
  );

  function toggle(section: "acquire" | "burn" | "mine") {
    setActiveSection((prev) => {
      const isExpanding = prev !== section;
      if (isExpanding) {
        // Scroll to expanded content after animation begins
        setTimeout(() => {
          expandedRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
      return isExpanding ? section : null;
    });
  }

  const steps: {
    id: "acquire" | "burn" | "mine";
    num: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    ocid: string;
  }[] = [
    {
      id: "acquire",
      num: "1",
      icon: <ShoppingCart className="h-7 w-7 text-accent" />,
      title: "ACQUIRE",
      subtitle: "RegNet Tokens",
      ocid: "akore.step_acquire.card",
    },
    {
      id: "burn",
      num: "2",
      icon: <Flame className="h-7 w-7 text-accent" />,
      title: "BURN",
      subtitle: "RegNet Tokens",
      ocid: "akore.step_burn.card",
    },
    {
      id: "mine",
      num: "3",
      icon: <PickaxeIcon className="h-7 w-7 text-accent" />,
      title: "MINE",
      subtitle: "$AKK",
      ocid: "akore.step_mine.card",
    },
  ];

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="akore.page"
    >
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
          <Swords className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          AKORE
        </h1>
        <p className="text-white text-sm mt-1 break-words">
          The Schelling point of civilisational coordination.{" "}
          <span className="text-accent">Mine $AKK, power Anti Krisis.</span>
        </p>
      </div>

      {/* Launch countdown banner — visible above step tiles */}
      {isLaunchTimeBlocked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2"
          data-ocid="akore.launch_countdown"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono">
            LAUNCH OPENS IN
          </p>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-accent tracking-widest">
            {String(countdown.days).padStart(2, "0")}d{" "}
            {String(countdown.hours).padStart(2, "0")}h{" "}
            {String(countdown.minutes).padStart(2, "0")}m{" "}
            {String(countdown.seconds).padStart(2, "0")}s
          </p>
        </motion.div>
      )}

      {/* 3 Steps */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center gap-2 border-l-2 border-accent pl-3">
          <span className="font-display font-bold text-3xl uppercase tracking-widest text-foreground">
            STEPS
          </span>
        </div>

        {/* Step cards row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0">
          {steps.map((step, idx) => {
            const isActive = activeSection === step.id;
            return (
              <Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => toggle(step.id)}
                  data-ocid={step.ocid}
                  className={[
                    "flex-1 bg-card border text-left p-3 sm:p-4 transition-all duration-200 cursor-pointer",
                    "hover:border-accent/70 hover:shadow-md",
                    isActive ? "border-accent" : "border-accent/30",
                  ].join(" ")}
                >
                  <div className="flex flex-col items-center w-full h-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl font-mono text-accent leading-none select-none shrink-0">
                        {step.num}
                      </span>
                      <span
                        className={`text-xl shrink-0 ml-2 ${isActive ? "text-accent" : "text-accent/50"}`}
                      >
                        {isActive ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-center mt-2 mb-1">
                      {step.icon}
                    </div>
                    <div className="flex flex-col items-center text-center mb-1">
                      <span className="font-display text-[1.32rem] font-bold uppercase tracking-wider text-foreground leading-tight">
                        {step.title}
                      </span>
                      <span className="font-display text-[0.963rem] uppercase tracking-wide text-accent/70 leading-tight">
                        {step.subtitle}
                      </span>
                    </div>
                  </div>
                </button>
                {/* Arrow between cards — desktop only */}
                {idx < steps.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center px-2 text-accent/50 text-2xl select-none shrink-0">
                    →
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Expandable content panel — CSS grid rows trick for smooth animation */}
        <div
          ref={expandedRef}
          className="grid transition-all duration-500 ease-in-out"
          style={{
            gridTemplateRows: activeSection ? "1fr" : "0fr",
            opacity: activeSection ? 1 : 0,
          }}
          data-ocid="akore.expanded_panel"
        >
          <div className="overflow-hidden">
            <div className="border border-accent/30 bg-card p-4">
              {activeSection === "acquire" && <AcquireSection />}
              {activeSection === "burn" && <BurnPage embedded />}
              {activeSection === "mine" && <MiningPage embedded />}
            </div>
          </div>
        </div>
      </div>
      <VideoSection />
    </div>
  );
}
