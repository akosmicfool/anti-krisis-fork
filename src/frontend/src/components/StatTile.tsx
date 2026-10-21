// Stat tile shared by the Tribe Page overview and the player profile
// highlights (RANK / SKORE). One definition so the two surfaces can never
// render the same stat differently.
export function StatTile({
  label,
  value,
  unit,
  valueColor = "text-white",
  className = "",
}: {
  label: string;
  value: string;
  unit?: string;
  valueColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-border bg-card px-2 py-3 flex flex-col items-center gap-0.5 flex-1 min-w-0 ${className}`}
    >
      <span className="font-accent text-xs sm:text-sm text-white tracking-widest uppercase truncate">
        {label}
      </span>
      <span
        className={`font-display text-[22.5px] sm:text-3xl font-bold tabular-nums leading-tight ${valueColor}`}
      >
        {value}
      </span>
      {unit && (
        <span className="font-accent text-[9px] sm:text-xs text-muted-foreground tracking-widest uppercase truncate">
          {unit}
        </span>
      )}
    </div>
  );
}
