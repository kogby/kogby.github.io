// Venn regions for the home-page map: Systems × ML, with ML Infra as the overlap.
// Derived from career.json `domains` so the resume data stays untouched.
export type Region = "mlinfra" | "systems" | "ml";

const SYSTEMS = ["backend", "distributed"]; // "de" alone never pulls an item into the overlap
const ML = ["ds", "mle"];

export function regionOf(domains: string[]): Region {
  const has = (set: string[]) => domains.some((d) => set.includes(d));
  if (domains.includes("mlinfra") || (has(SYSTEMS) && has(ML))) return "mlinfra";
  if (has(ML)) return "ml";
  return "systems";
}

export const REGIONS: { id: Region; label: string }[] = [
  { id: "mlinfra", label: "ML Infra" },
  { id: "systems", label: "Systems" },
  { id: "ml", label: "Machine Learning" },
];
