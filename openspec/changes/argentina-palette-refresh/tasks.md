# Tasks: Argentina Palette Refresh

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~140–220 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation — Theme Tokens & Utilities

- [x] 1.1 Update `src/styles/global.css` `--color-cancha-dark` from navy (`#0b2d4a`) to neutral graphite and update related comments
- [x] 1.2 Rename utility `.gold-accent-line` → `.accent-line` in `src/styles/global.css` and update inline comment

## Phase 2: Core — Section Restyling & Interaction Polish

- [x] 2.1 Create `src/components/landing/PrizesSection.astro` with graphite surfaces and celeste accents, preserving tier hierarchy (R10)
- [x] 2.2 Restyle card 4 in `src/components/landing/HowItWorks.astro` as single graphite emphasis card; keep cards 1–3 on light surfaces (R11)
- [x] 2.3 Update `src/components/landing/TrustBar.astro` class from `gold-accent-line` to `accent-line`
- [x] 2.4 Update `src/components/landing/SignupSkeleton.astro` to replace outdated gold class/comment references with `accent-line`
- [x] 2.5 Insert the prizes section and smooth CTA interaction in `src/pages/index.astro`

## Phase 3: Verification

- [x] 3.1 Visual check: prizes section renders graphite + celeste with tier hierarchy (spec R10)
- [x] 3.2 Visual check: How-It-Works card 4 distinct with graphite + celeste; cards 1–3 light (spec R11)
- [x] 3.3 Verify WCAG AA contrast on all text/background combinations, especially on graphite surfaces
- [x] 3.4 Verify mobile prizes layout stacks vertically with preserved hierarchy (spec R10 mobile)
- [x] 3.5 Verify reduced-motion fallback — emphasis via color/surface, not motion (spec R11 reduced-motion)
- [x] 3.6 Run `pnpm astro check` and `pnpm build` and confirm zero errors
