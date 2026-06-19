import React from "react";

// Matches metric-like tokens: $1.1M+, 21M+, 1.32x, 70x, 67%, 74%+, 4.91/5, 1,200+, 20+ …
// Requires a unit suffix (%, x, M/K, /5) or a trailing + so bare counts ("team of 10",
// "5-minute SLA") are left un-highlighted.
const METRIC_RE =
  /(\$\d[\d,.]*M?\+?|\d[\d,.]*(?:%\+?|x|\/\d+|M\+?|K\+?|\+))/g;

// Wraps metric tokens in an accent-colored span so numbers pop on a quick recruiter scan.
// String.split with one capturing group alternates [text, match, text, …] — odd indices
// are the captured metrics, so we highlight by index parity (no stateful .test()).
export function highlightMetrics(text: string): React.ReactNode {
  return text.split(METRIC_RE).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-accent-primary">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
