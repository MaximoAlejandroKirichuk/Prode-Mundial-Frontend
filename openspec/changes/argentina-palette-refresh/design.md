# Design: Argentina Palette Refresh

## Technical Approach

Complete the landing refresh as a token-first pass. Update shared theme values in `src/styles/global.css`, insert the dedicated prizes section in `src/pages/index.astro`, and restyle the premium surfaces called out by the spec delta: `PrizesSection.astro` and the final `HowItWorks.astro` card. This keeps signup/payment logic untouched while removing the remaining navy/gold cues.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice / Rationale |
|---|---|---|---|
| Token strategy | Rename every custom `cancha-*` token now; reuse current semantic tokens | Full renaming is cleaner, but widens diff and review noise | Keep shadcn/Tailwind semantic tokens (`primary`, `secondary`, `accent`, `border`, `ring`) as the source of truth. Change their values to celeste/graphite and only rename the misleading utility `gold-accent-line` to `accent-line`. |
| Premium dark surface | Keep Boca-like navy; switch to graphite | Navy preserves current classes but conflicts with branch intent | Replace `--color-cancha-dark` value with a neutral graphite used only for premium surfaces and footer, matching R1/R10/R11 without broader redesign. |
| Section refresh scope | Rebuild landing sections; add one dedicated section and restyle existing markup | Rebuild gives more freedom but risks scope drift | Preserve the current landing flow, add the approved prizes section between How It Works and Signup, and limit styling changes to the new section plus card 4 in `HowItWorks.astro`. |

## Data Flow

Palette behavior remains static and CSS-driven:

    global.css tokens/utilities
          ↓
    index.astro section wrappers
          ↓
    HowItWorks / PrizesSection / TrustBar / SignupSkeleton
          ↓
    Shared visual result with no JS or API changes

`SignupIsland`, Redux, and backend registration flow are unaffected.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Update theme values to white + celeste + graphite, keep neutral backgrounds dominant, rename `gold-accent-line` to `accent-line`, and retain existing texture utilities. |
| `src/components/landing/PrizesSection.astro` | Create | Build a dedicated prize section with graphite-led premium surfaces, celeste accents, and prize copy that avoids official organizer logos/marks while preserving Selección-themed language; preserve asymmetric hierarchy. |
| `src/components/landing/HowItWorks.astro` | Modify | Keep cards 1–3 on light surfaces; restyle card 4 as the single graphite emphasis card with celeste detail treatment. |
| `src/components/landing/TrustBar.astro` | Modify | Swap to `accent-line` so utility naming matches rendered color. |
| `src/components/landing/SignupSkeleton.astro` | Modify | Replace outdated gold naming with the renamed neutral accent utility. |
| `src/pages/index.astro` | Modify | Insert the prizes section and refine CTA motion/hero shadow for smoother interaction within the new palette. |

## Interfaces / Contracts

No API, Redux, or component-prop contract changes.

```css
/* semantic palette contract */
--color-primary: celeste CTA/action
--color-accent: lighter sky accent
--color-secondary: soft near-white blue surface
--color-cancha-dark: graphite premium surface
.accent-line: neutral celeste separator utility
```

Section contract:
- `PrizesSection.astro` uses graphite as the dominant premium surface.
- `HowItWorks.astro` reserves graphite for step 4 only.
- White/near-white remains the dominant page background.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | None added | No unit runner exists; avoid logic changes. |
| Integration | Palette utility consumers still render correctly | Run `pnpm build`; manually inspect TrustBar, SignupSkeleton accent line, prizes, and How-It-Works in dev. |
| E2E | Responsive hierarchy and accessibility | Manual mobile/desktop checks for stacked prize cards, final-card emphasis, focus visibility, and WCAG-safe text contrast on graphite surfaces. |

## Migration / Rollout

No migration required. Rollout is a reversible frontend-only visual change on this branch.

## Open Questions

- [ ] None.
