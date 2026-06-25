# Tasks: Argentina World Cup Landing Refresh

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 270–350 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

## Phase 1: Theme Foundation

- [x] 1.1 Replace neutral tokens in `src/styles/global.css` `@theme` with Argentina palette: sky-blue primary, white surfaces, deep-ink foreground, sun-gold accent/ring. Keep neutral backgrounds dominant.
- [x] 1.2 Verify WCAG AA contrast ratios (≥4.5:1) for all new token combinations (primary/foreground, accent/foreground, muted/foreground).

## Phase 2: Landing Page Restructure

- [x] 2.1 Rewrite `src/pages/index.astro` hero section with Argentina–World Cup h1 in Rioplatense Spanish, primary CTA to `#signup`, secondary link to `#how-it-works`.
- [x] 2.2 Add trust stats bar post-hero: Badge row with Lucide football icons (≥2 stats: match count, country reach). No official marks.
- [x] 2.3 Expand how-it-works to 4 steps (signup→pay→predict→compete) with distinct Lucide football icons; multi-col desktop, single-col ≤768px.
- [x] 2.4 Extract optional presentational Astro partials to `src/components/landing/` (e.g., `TrustBar.astro`, `HowItWorks.astro`) only if index.astro readability degrades.
- [x] 2.5 Refresh FAQ section copy and `#signup` anchor section heading to match landing campaign tone.

## Phase 3: Copy & Metadata

- [x] 3.1 Update `SignupForm.tsx` card title, description, and submit button copy to Argentina–World Cup context. Redux logic, validation, redirect unchanged.
- [x] 3.2 Refine `Layout.astro` default `title`/`description` for SEO keywords: Mundial, Argentina, predicciones. Optionally add Open Graph tags if scoped.

## Phase 4: Verification

- [x] 4.1 Run `pnpm build` and fix any errors.
- [x] 4.2 Manual responsive check at 375px, 768px, 1440px: no horizontal overflow, CTAs stack ≤640px, single-col ≤768px.
- [x] 4.3 Keyboard/accessibility audit: tab order follows visual layout, visible focus rings, ARIA labels on interactive elements.
- [x] 4.4 Verify signup flow: load SignupIsland, validate fields, confirm Redux `submitSignup` dispatch and redirect behavior are unchanged.
