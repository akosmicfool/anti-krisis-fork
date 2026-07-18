import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProtocolBurnSummary } from "../../hooks/use-backend";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSDValue(usd: number): string {
  if (!Number.isFinite(usd)) return "$0.00";
  if (usd < 0) return "<$0.00";
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return "<$0.01";
  if (usd >= 1000)
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (usd >= 1)
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${usd.toFixed(2)}`;
}

function formatGrit(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toLocaleString();
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border border-border p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 min-w-0">
      <span className="text-xs uppercase tracking-widest font-mono text-white truncate">
        {label}
      </span>
      <span className="font-mono font-bold text-base sm:text-xl text-accent truncate">
        {value}
      </span>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomBarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 text-xs font-mono"
      style={{
        background: "#0a0a0a",
        border: "1px solid #00ff41",
        color: "#00ff41",
      }}
    >
      <p className="font-bold mb-0.5">{label}</p>
      <p>{formatUSDValue(payload[0].value)}</p>
    </div>
  );
}

// ─── Burn Summary Table (collapsible) ────────────────────────────────────────

type BurnSummaryProps = {
  summary: {
    byToken: [string, number, number][];
    totalBurnUsd: number;
  };
  chartData: { symbol: string; usdValue: number }[];
};

function BurnSummaryTable({ summary, chartData }: BurnSummaryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* REGNET BURNS mini header */}
      <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-white tracking-widest mb-2">
        REGNET BURNS
      </h3>
      {/* Bar chart — always visible */}
      <div className="w-full" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#00ff4120"
              vertical={false}
            />
            <XAxis
              dataKey="symbol"
              tick={{
                fill: "#00ff41",
                fontSize: 11,
                fontFamily: "monospace",
              }}
              axisLine={{ stroke: "#00ff4140" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`
              }
              tick={{
                fill: "#8b9d8b",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: "#00ff4110" }}
            />
            <Bar
              dataKey="usdValue"
              fill="#00ff41"
              radius={[2, 2, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Toggle button — styled like [READ THE PROTOCOL] → */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="self-start inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
        data-ocid="overview.burninfo.burn_summary_toggle"
      >
        <span>[BURN SUMMARY]</span>
        <span className="group-hover:translate-y-0.5 transition-transform duration-200">
          {open ? "↑" : "↓"}
        </span>
      </button>

      {/* Collapsible table */}
      {open && (
        <div className="w-full border border-border overflow-x-auto">
          <table className="w-full text-xs min-w-[280px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-1 text-left font-display text-sm tracking-widest text-green-400 uppercase">
                  RegNet
                </th>
                <th className="px-2 py-1 text-right font-display text-sm tracking-widest text-green-400 uppercase">
                  TOKENS
                </th>
                <th className="px-2 py-1 text-right font-display text-sm tracking-widest text-green-400 uppercase">
                  $ Value
                </th>
                <th className="px-2 py-1 text-right font-display text-sm tracking-widest text-green-400 uppercase">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const totalUsd = summary.byToken.reduce(
                  (s, [, , v]) => s + v,
                  0,
                );
                return [...summary.byToken]
                  .sort((a, b) => b[2] - a[2])
                  .map(([symbol, tokensBurned, usdValue]) => (
                    <tr
                      key={symbol}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-2 py-0.5 font-['Tomorrow'] text-white text-xs tracking-wider">
                        {symbol}
                      </td>
                      <td className="px-2 py-0.5 font-['Tomorrow'] text-white text-xs text-right">
                        {tokensBurned.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-0.5 font-['Tomorrow'] text-white text-xs text-right">
                        {formatUSDValue(usdValue)}
                      </td>
                      <td className="px-2 py-0.5 font-['Tomorrow'] text-white text-xs text-right">
                        {totalUsd > 0
                          ? ((usdValue / totalUsd) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function BurnInfoSection() {
  const { data: summary, isLoading } = useProtocolBurnSummary();

  const chartData = summary?.byToken
    ? [...summary.byToken]
        .sort((a, b) => b[2] - a[2])
        .map(([symbol, , usdValue]) => ({ symbol, usdValue }))
    : [];
  const hasData = chartData.length > 0 && (summary?.totalBurnUsd ?? 0) > 0;

  return (
    <section
      className="py-8 sm:py-16 px-4 bg-background"
      data-ocid="overview.burninfo_section"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <img
            src="/assets/burn_info_icon.png"
            alt="Burn Info"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-widest">
            BURN INFO
          </h2>
        </div>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-base text-foreground/85 leading-relaxed mb-6 sm:mb-8">
          Every burn is an{" "}
          <span className="text-accent font-normal">
            irreversible act of coordination
          </span>
          . GRIT is earned for the sacrifice and spent for mining $AKK.
        </p>

        {isLoading ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="lg:w-1/3 flex flex-col gap-2">
              <div
                className="animate-pulse bg-card border border-border p-4"
                style={{ height: 60 }}
              />
              <div
                className="animate-pulse bg-card border border-border p-4"
                style={{ height: 60 }}
              />
            </div>
            <div className="lg:w-2/3">
              <div
                className="animate-pulse"
                style={{ width: 160, height: 160, background: "#004d14" }}
              />
            </div>
          </div>
        ) : !hasData ? (
          <div
            className="flex items-center justify-center py-8 border border-dashed border-border/60"
            data-ocid="overview.burninfo.empty_state"
          >
            <span className="font-display text-lg text-muted-foreground tracking-widest">
              No burns recorded yet.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Row 1: TOTAL BURN + TOTAL GRIT side by side */}
            <div className="flex flex-row gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <StatCard
                  label="TOTAL BURN"
                  value={`~${formatUSDValue(summary!.totalBurnUsd)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <StatCard
                  label="TOTAL GRIT"
                  value={`${formatGrit(summary!.totalGritFromBurns)}`}
                />
              </div>
            </div>

            {/* Row 2: REGNET BURNS — full width, collapsible */}
            <BurnSummaryTable summary={summary!} chartData={chartData} />
          </div>
        )}
      </div>
    </section>
  );
}
