// Deterministic mock data for the predictive maintenance demo.
// All values simulated with rule-based scoring — no live ML backend.

export type EquipmentStatus = "ok" | "warn" | "crit" | "offline";
export type Severity = "low" | "medium" | "high" | "critical";

export interface Equipment {
  id: string;
  tag: string;
  name: string;
  type: string;
  location: string;
  status: EquipmentStatus;
  healthScore: number; // 0-100
  failureProbability: number; // 0-1 in next 30 days
  rul: number; // remaining useful life in days
  lastMaintenance: string;
  metrics: {
    temperature: number; // °C
    vibration: number; // mm/s
    pressure: number; // bar
    rpm: number;
  };
  thresholds: {
    tempMax: number;
    vibMax: number;
    presMax: number;
  };
}

export interface Anomaly {
  id: string;
  equipmentId: string;
  detectedAt: string;
  metric: string;
  observed: number;
  expected: number;
  deviation: number; // %
  severity: Severity;
  description: string;
  status: "open" | "acknowledged" | "resolved";
}

export interface Alert {
  id: string;
  equipmentId: string;
  createdAt: string;
  severity: Severity;
  title: string;
  message: string;
  channel: "dashboard" | "email" | "sms";
  acknowledged: boolean;
}

export interface Recommendation {
  id: string;
  equipmentId: string;
  action: string;
  priority: Severity;
  rationale: string;
  window: string;
  estimatedDowntimeHours: number;
  costAvoidanceUSD: number;
}

export interface TrendPoint {
  t: number; // hour offset
  value: number;
}

// -------- Seed --------

const equipmentSeed: Omit<Equipment, "healthScore" | "failureProbability" | "rul" | "status">[] = [
  {
    id: "eq-001", tag: "P-101A", name: "Feed Pump A", type: "Centrifugal Pump",
    location: "Unit 100 / Charge",
    lastMaintenance: "2026-04-12",
    metrics: { temperature: 78, vibration: 4.9, pressure: 12.4, rpm: 3540 },
    thresholds: { tempMax: 85, vibMax: 4.5, presMax: 14 },
  },
  {
    id: "eq-002", tag: "C-201", name: "Recycle Compressor", type: "Reciprocating Compressor",
    location: "Unit 200 / Reactor Loop",
    lastMaintenance: "2026-02-28",
    metrics: { temperature: 112, vibration: 7.8, pressure: 42.1, rpm: 1450 },
    thresholds: { tempMax: 105, vibMax: 6.5, presMax: 45 },
  },
  {
    id: "eq-003", tag: "HX-305", name: "Product Cooler", type: "Shell & Tube HX",
    location: "Unit 300 / Cooling",
    lastMaintenance: "2026-05-30",
    metrics: { temperature: 58, vibration: 0.8, pressure: 6.2, rpm: 0 },
    thresholds: { tempMax: 90, vibMax: 2, presMax: 8 },
  },
  {
    id: "eq-004", tag: "M-410", name: "Extruder Drive", type: "Induction Motor",
    location: "Unit 400 / Packaging",
    lastMaintenance: "2026-06-18",
    metrics: { temperature: 68, vibration: 2.1, pressure: 0, rpm: 1780 },
    thresholds: { tempMax: 90, vibMax: 4, presMax: 0 },
  },
  {
    id: "eq-005", tag: "T-502", name: "Cooling Tower Fan", type: "Axial Fan",
    location: "Unit 500 / Utilities",
    lastMaintenance: "2026-03-05",
    metrics: { temperature: 42, vibration: 3.2, pressure: 0, rpm: 890 },
    thresholds: { tempMax: 60, vibMax: 5, presMax: 0 },
  },
  {
    id: "eq-006", tag: "P-101B", name: "Feed Pump B (Standby)", type: "Centrifugal Pump",
    location: "Unit 100 / Charge",
    lastMaintenance: "2026-06-01",
    metrics: { temperature: 32, vibration: 0.3, pressure: 0, rpm: 0 },
    thresholds: { tempMax: 85, vibMax: 4.5, presMax: 14 },
  },
  {
    id: "eq-007", tag: "V-220", name: "Reactor Agitator", type: "Vertical Mixer",
    location: "Unit 200 / Reactor",
    lastMaintenance: "2026-05-11",
    metrics: { temperature: 74, vibration: 3.9, pressure: 3.1, rpm: 220 },
    thresholds: { tempMax: 90, vibMax: 5, presMax: 4 },
  },
  {
    id: "eq-008", tag: "G-601", name: "Emergency Generator", type: "Diesel Genset",
    location: "Unit 600 / Power",
    lastMaintenance: "2026-01-20",
    metrics: { temperature: 25, vibration: 0, pressure: 0, rpm: 0 },
    thresholds: { tempMax: 95, vibMax: 6, presMax: 8 },
  },
];

// Rule-based scoring
function score(e: Omit<Equipment, "healthScore" | "failureProbability" | "rul" | "status">): Equipment {
  const { metrics, thresholds } = e;
  const tempRatio = metrics.temperature / thresholds.tempMax;
  const vibRatio = metrics.vibration / thresholds.vibMax;
  const presRatio = thresholds.presMax ? metrics.pressure / thresholds.presMax : 0;
  const worst = Math.max(tempRatio, vibRatio, presRatio);

  let status: EquipmentStatus;
  if (metrics.rpm === 0 && metrics.temperature < 40) status = "offline";
  else if (worst >= 1.05) status = "crit";
  else if (worst >= 0.9) status = "warn";
  else status = "ok";

  const healthScore = Math.max(2, Math.min(100, Math.round(100 - worst * 55)));
  const failureProbability = status === "offline" ? 0 : Math.min(0.97, Math.max(0.02, (worst - 0.5) * 0.9));
  const rul = status === "offline" ? 365 : Math.max(1, Math.round((1 - failureProbability) * 180));

  return { ...e, status, healthScore, failureProbability, rul };
}

export const equipment: Equipment[] = equipmentSeed.map(score);

export function getEquipment(id: string) {
  return equipment.find((e) => e.id === id);
}

// -------- Anomalies --------

export const anomalies: Anomaly[] = [
  {
    id: "an-001", equipmentId: "eq-002", detectedAt: "2026-07-17T09:12:00Z",
    metric: "vibration", observed: 7.8, expected: 5.4, deviation: 44,
    severity: "critical", status: "open",
    description: "Vibration exceeded 2σ upper bound for 14 consecutive minutes.",
  },
  {
    id: "an-002", equipmentId: "eq-002", detectedAt: "2026-07-17T08:45:00Z",
    metric: "temperature", observed: 112, expected: 98, deviation: 14,
    severity: "high", status: "open",
    description: "Discharge temperature trending upward — bearing degradation suspected.",
  },
  {
    id: "an-003", equipmentId: "eq-001", detectedAt: "2026-07-17T07:20:00Z",
    metric: "vibration", observed: 4.9, expected: 4.1, deviation: 20,
    severity: "high", status: "acknowledged",
    description: "Vibration drift outside baseline envelope.",
  },
  {
    id: "an-004", equipmentId: "eq-005", detectedAt: "2026-07-16T22:05:00Z",
    metric: "vibration", observed: 3.2, expected: 2.5, deviation: 28,
    severity: "medium", status: "open",
    description: "Blade imbalance signature detected in FFT spectrum.",
  },
  {
    id: "an-005", equipmentId: "eq-007", detectedAt: "2026-07-16T18:32:00Z",
    metric: "temperature", observed: 74, expected: 65, deviation: 14,
    severity: "medium", status: "acknowledged",
    description: "Seal temperature drift — possible lubrication issue.",
  },
  {
    id: "an-006", equipmentId: "eq-004", detectedAt: "2026-07-15T14:10:00Z",
    metric: "vibration", observed: 2.1, expected: 1.7, deviation: 24,
    severity: "low", status: "resolved",
    description: "Minor rotor imbalance — cleared after alignment.",
  },
];

// -------- Alerts --------

export const alerts: Alert[] = [
  {
    id: "al-001", equipmentId: "eq-002", createdAt: "2026-07-17T09:12:30Z",
    severity: "critical",
    title: "Critical: C-201 vibration limit exceeded",
    message: "Recycle Compressor vibration at 7.8 mm/s. Immediate inspection required.",
    channel: "dashboard", acknowledged: false,
  },
  {
    id: "al-002", equipmentId: "eq-002", createdAt: "2026-07-17T09:00:00Z",
    severity: "high",
    title: "High: C-201 predicted failure in 6 days",
    message: "Failure probability 82% over 30-day horizon. Plan intervention.",
    channel: "email", acknowledged: false,
  },
  {
    id: "al-003", equipmentId: "eq-001", createdAt: "2026-07-17T07:25:00Z",
    severity: "high",
    title: "High: P-101A vibration drift",
    message: "Sustained vibration drift — bearing wear likely.",
    channel: "dashboard", acknowledged: true,
  },
  {
    id: "al-004", equipmentId: "eq-005", createdAt: "2026-07-16T22:10:00Z",
    severity: "medium",
    title: "Medium: T-502 fan imbalance",
    message: "Blade imbalance signature detected. Schedule balancing.",
    channel: "dashboard", acknowledged: false,
  },
  {
    id: "al-005", equipmentId: "eq-007", createdAt: "2026-07-16T18:35:00Z",
    severity: "medium",
    title: "Medium: V-220 seal temperature",
    message: "Seal temperature trending — check lube system.",
    channel: "email", acknowledged: true,
  },
];

// -------- Recommendations --------

export const recommendations: Recommendation[] = [
  {
    id: "rc-001", equipmentId: "eq-002", action: "Replace suction-side bearing assembly",
    priority: "critical",
    rationale: "Vibration + temperature co-drift consistent with bearing wear. Model attribution: bearing_temp 42%, vib_rms 31%, disch_temp 18%.",
    window: "Next 48 hours", estimatedDowntimeHours: 6, costAvoidanceUSD: 185000,
  },
  {
    id: "rc-002", equipmentId: "eq-001", action: "Inspect mechanical seal & align coupling",
    priority: "high",
    rationale: "Vibration drift outside baseline; failure probability 34% over 30 days.",
    window: "Within 7 days", estimatedDowntimeHours: 3, costAvoidanceUSD: 42000,
  },
  {
    id: "rc-003", equipmentId: "eq-005", action: "Field-balance fan blades",
    priority: "medium",
    rationale: "FFT signature indicates blade imbalance. Low-cost intervention.",
    window: "Next planned outage", estimatedDowntimeHours: 2, costAvoidanceUSD: 12000,
  },
  {
    id: "rc-004", equipmentId: "eq-007", action: "Top-up seal flush oil, sample for particulates",
    priority: "medium",
    rationale: "Seal temperature rising 0.4°C/day — lube contamination suspected.",
    window: "Within 14 days", estimatedDowntimeHours: 1, costAvoidanceUSD: 8500,
  },
];

// -------- Trend generator --------

export function trend(base: number, hours: number, drift: number, noise: number): TrendPoint[] {
  const out: TrendPoint[] = [];
  let v = base;
  for (let i = 0; i < hours; i++) {
    v += drift + (Math.sin(i / 3) * noise) + (Math.cos(i / 5.7) * noise * 0.6);
    out.push({ t: i - hours + 1, value: Number(v.toFixed(2)) });
  }
  return out;
}

// -------- KPIs --------

export function kpis() {
  const total = equipment.length;
  const critical = equipment.filter((e) => e.status === "crit").length;
  const warn = equipment.filter((e) => e.status === "warn").length;
  const ok = equipment.filter((e) => e.status === "ok").length;
  const offline = equipment.filter((e) => e.status === "offline").length;
  const avgHealth = Math.round(equipment.reduce((s, e) => s + e.healthScore, 0) / total);
  const openAlerts = alerts.filter((a) => !a.acknowledged).length;
  const openAnomalies = anomalies.filter((a) => a.status === "open").length;
  const avoidance = recommendations.reduce((s, r) => s + r.costAvoidanceUSD, 0);
  const mtbf = 412; // hours, simulated
  const mttr = 5.4;
  return { total, critical, warn, ok, offline, avgHealth, openAlerts, openAnomalies, avoidance, mtbf, mttr };
}

export function severityColor(s: Severity | EquipmentStatus): string {
  switch (s) {
    case "critical":
    case "crit":
      return "var(--color-status-crit)";
    case "high":
    case "warn":
      return "var(--color-status-warn)";
    case "medium":
      return "var(--color-status-info)";
    case "low":
    case "ok":
      return "var(--color-status-ok)";
    case "offline":
      return "var(--color-status-offline)";
    default:
      return "var(--color-muted-foreground)";
  }
}

// Explainability — feature contributions per prediction
export const featureImportance: Record<string, { feature: string; contribution: number }[]> = {
  "eq-002": [
    { feature: "Bearing temperature (7d slope)", contribution: 0.42 },
    { feature: "Vibration RMS", contribution: 0.31 },
    { feature: "Discharge temperature", contribution: 0.18 },
    { feature: "Oil pressure variance", contribution: 0.06 },
    { feature: "Hours since last overhaul", contribution: 0.03 },
  ],
  "eq-001": [
    { feature: "Vibration drift", contribution: 0.48 },
    { feature: "Motor current asymmetry", contribution: 0.22 },
    { feature: "Seal temperature", contribution: 0.17 },
    { feature: "Flow variance", contribution: 0.09 },
    { feature: "Run hours", contribution: 0.04 },
  ],
};
