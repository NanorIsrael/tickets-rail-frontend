import { severityColor, type EquipmentStatus, type Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const labels: Record<EquipmentStatus | Severity, string> = {
  ok: "NORMAL",
  warn: "WARNING",
  crit: "CRITICAL",
  offline: "OFFLINE",
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL",
};

export function StatusPill({
  status,
  className,
  pulse,
}: {
  status: EquipmentStatus | Severity;
  className?: string;
  pulse?: boolean;
}) {
  const color = severityColor(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[0.65rem] tracking-widest uppercase",
        className,
      )}
      style={{
        color,
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      <span
        className={cn("status-dot", pulse && status === "crit" && "pulse-crit")}
        style={{ backgroundColor: color, color }}
      />
      {labels[status]}
    </span>
  );
}
