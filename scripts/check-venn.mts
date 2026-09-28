// Run: npm run check (Node >= 23 strips the types). Asserts every career.json item lands in the Venn region the spec expects.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { regionOf } from "../lib/venn.ts";

const career = JSON.parse(readFileSync(new URL("../data/career.json", import.meta.url), "utf8"));

const expected: Record<string, string> = {
  "amazon-swe": "mlinfra",
  "flashinfer-gpu-kernels": "mlinfra",
  "loadshift-scheduling": "mlinfra",
  "line-backend": "systems",
  "trend-micro-swe": "systems",
  "distributed-miner": "systems",
  "memory-allocator": "systems",
  "online-judge": "systems",
  "ntu-rating": "systems",
  "eva-air-mle": "ml",
  "data-quality-trust-ai": "ml",
  "cathay-ds": "ml",
  "ntu-productivity-lab": "ml",
  "ntu-decision-optimization-lab": "ml",
  "house-price-prediction": "ml",
};

const items = [
  ...career.experiences.filter((e: { category: string }) => e.category !== "Leadership"),
  ...career.projects,
];
for (const it of items) assert.equal(regionOf(it.domains), expected[it.slug], it.slug);
assert.equal(items.length, Object.keys(expected).length);

// Rule edges
assert.equal(regionOf(["de", "ds"]), "ml");
assert.equal(regionOf(["de"]), "systems");
assert.equal(regionOf(["backend", "mle"]), "mlinfra");
assert.equal(regionOf([]), "systems");

console.log(`venn ok: ${items.length} items`);
