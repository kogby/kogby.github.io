# kogby.github.io

Personal site plus the job-search workspace around it. One repo, everything clones together:

```text
kogby.github.io (public, this repo)  — Next.js site
├── data/career.json                 — structured content the site renders (domains, tags, bullets)
├── resume-swe/    (private submodule) — LaTeX resume; main = base, tailor/<target> = per-application variants
└── career-ops/    (private submodule) — job-search pipeline (scan, score, track); cv.md lives here
```

## Source of truth

`career-ops/cv.md` is the superset of all career facts (every experience, project, and number ever shipped on a resume). Everything else is a curated subset rendered from it:

```text
career-ops/cv.md          (fact superset, private)
├──> resume-swe branches  (one-page renderings for applications)
└──> data/career.json     (public subset the website displays)
```

**Update order:** new facts go into `cv.md` first, then get selected into `career.json` (public display) and `resume-swe` (applications). Never edit only a downstream copy, or the superset drifts. No claim ships on a resume or the site unless it is backed by `cv.md`.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
