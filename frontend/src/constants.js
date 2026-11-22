
export const TYPES = [
  { value: "itp", label: "ITP", badge: "badge-itp" },
  { value: "rca", label: "RCA", badge: "badge-rca" },
  { value: "rovinieta", label: "Road tax", badge: "badge-road-tax" },
  { value: "revizie", label: "Service", badge: "badge-service" },
];


export const TYPE_LABELS = Object.fromEntries(TYPES.map((t) => [t.value, t.label]));

export const TYPE_BADGES = Object.fromEntries(TYPES.map((t) => [t.value, t.badge]));

export const STATUS_LABELS = {
  overdue: "Overdue",
  soon: "Due in 30 days",
  ok: "Up to date",
  done: "Done",
};