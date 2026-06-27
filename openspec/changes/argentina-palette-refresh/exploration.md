# Exploration: Argentina/Selección Palette Refresh

## Current State

The landing page currently mixes two visual directions:

- The **base/archived spec** (`openspec/specs/landing-page/spec.md` R1) prescribes an Argentina World Cup palette: light-blue primary, white surfaces, **sun-gold accents**.
- The **active WIP diff** (backend-registration-payment-url work in progress) already shifted several tokens away from gold toward celeste:
  - `--color-accent` changed from `#fbbf24` (sun-gold) to `#38bdf8` (celeste)
  - `--color-ring` changed from `#eab308` (gold) to `#0b7bc4` (primary blue)
  - `--color-cancha-gold` renamed to `--color-cancha-celeste`
  - `gold-accent-line` utility now renders celeste (but keeps the old class name)
  - HowItWorks step 4 "Competis en serio" changed from dark navy (`bg-cancha-dark`) + gold to secondary + celeste.
- A new `PrizesSection.astro` component was added, but it uses specific/trademark-adjacent prizes (River Plate season tickets, Copa Sudamericana, "campeona del mundo 2022", Selección jersey).
- The footer still uses `bg-cancha-dark` (`#0b2d4a`), a dark navy strongly associated with Boca Juniors.

So the WIP partially moves toward the user's new intent (away from gold/navy) but leaves a half-finished transition and introduces new issues.

## Affected Areas

| Path | Why it is affected |
|---|---|
| `src/styles/global.css` | Theme tokens still contain Boca-coded navy (`--color-cancha-dark`) and a misleading `gold-accent-line` class that now renders celeste. |
| `src/components/landing/HowItWorks.astro` | Step 4 "Competis en serio" was recolored but still feels flat; needs hierarchy and premium editorial treatment. |
| `src/components/landing/PrizesSection.astro` | Prize copy uses trademark-adjacent clubs/trophies and over-specific commitments. |
| `src/components/landing/TrustBar.astro` | Uses the `gold-accent-line` class; must be renamed and recolored. |
| `src/components/SignupForm.tsx` | Top accent line comment and class still reference "gold". |
| `src/pages/index.astro` | Footer uses `bg-cancha-dark`; signup section may need graphite/celeste adjustments. |
| `openspec/specs/landing-page/spec.md` | R1 explicitly requires sun-gold accents, which conflicts with the new white/sky-blue/graphite direction. |

## Approaches

### 1. Refine WIP direction (celeste + graphite, drop gold/navy)
Keep the WIP's move to celeste accents, but finish the job:
- Replace `--color-cancha-dark` with a graphite/ink token (e.g. `#1f2937` or `#2a2f35`) and update the footer.
- Rename `gold-accent-line` to `accent-line` and `top-stripe-gold` references to `top-stripe-celeste`.
- Convert "Competis en serio" into a dark graphite hero card with white text and celeste accents.
- Rewrite `PrizesSection` with generic, premium prize tiers (e.g. "Experiencia VIP", "Cena con vista", "Indumentaria oficial") without naming clubs, trophies, or tournaments.
- Update the landing-page spec R1 to remove the gold-accent requirement and add graphite as the dark surface.

- **Pros**: Builds on existing diff, keeps changes localized, minimal new files, preserves the premium feel.
- **Cons**: Still entangled with the unrelated backend-registration WIP; may require resolving that diff first.
- **Effort**: Medium

### 2. Revert palette to spec + soften gold
Return to the current spec's gold accents, but reduce their dominance and introduce graphite only as a footer/section dark surface, keeping navy out:
- Restore gold accent token, but use it sparingly (one underline, one icon stroke).
- Use graphite for footer and "Competis en serio" card instead of navy.
- Keep celeste as a secondary sky-blue.
- Rewrite prizes generically.

- **Pros**: Preserves spec compliance, lower risk of downstream spec drift.
- **Cons**: Does not match the user's explicit request to move away from gold; may feel like a compromise rather than a refresh.
- **Effort**: Low/Medium

### 3. Full white/sky-blue/graphite rebrand
Treat the refresh as a larger visual reset:
- New semantic tokens: `--color-graphite`, `--color-sky`, `--color-ink`.
- Replace all navy/gold references systematically.
- Add a light/dark section rhythm (e.g. graphite "Competis en serio" band).
- Possibly add a subtle Argentina flag-inspired gradient or stripe motif.

- **Pros**: Cleanest expression of user intent, strongest visual break from Boca identity.
- **Cons**: Larger diff, more review risk, may exceed 400-line budget if combined with backend WIP, needs careful contrast testing.
- **Effort**: Medium/High

## Recommendation

Adopt **Approach 1** but **decouple it from the backend-registration WIP first**:

1. Resolve or merge the backend-registration-payment-url change separately. The active diff already mixes signup/payment logic with palette shifts, which violates the review-budget guard and makes rollback harder.
2. On a clean branch, apply the palette-only refresh:
   - Replace `--color-cancha-dark: #0b2d4a` with a graphite token (suggest `#243442` or `#2a2f35`).
   - Rename `gold-accent-line` → `accent-line` and `top-stripe-gold` → `top-stripe-celeste`.
   - Update footer and "Competis en serio" to graphite surfaces with white/celeste text.
   - Rewrite `PrizesSection` with generic, premium, trademark-safe tiers.
3. Update `openspec/specs/landing-page/spec.md` R1 from "sun-gold accents" to "sky-blue/celeste accents, graphite dark surfaces" via a delta spec.

## Risks

- **WIP entanglement**: The current diff mixes backend API changes with palette changes. A palette-only review will be noisy unless separated.
- **Spec conflict**: Current spec R1 mandates gold accents. Changing palette requires a spec delta.
- **Trademark/advertising risk**: Current prize copy names River Plate, Copa Sudamericana, Monumental, "campeona del mundo 2022", and the Selección jersey. These need replacement with generic descriptions.
- **Contrast regression**: Replacing navy with graphite may affect white-text readability; WCAG AA must be rechecked.
- **Asset gap**: No real product/football photography exists; the page relies on CSS patterns and the existing SVG ball. A full rebrand may expose the lack of hero imagery.

## Ready for Proposal

**Yes, with a precondition.** The orchestrator should ask the user to choose:

- Should the active backend-registration WIP be merged/stashed before the palette refresh begins?
- Confirm the graphite hex (e.g. `#243442` / `#2a2f35`) and the exact sky-blue/celeste accent.
- Approve replacing specific prizes with generic premium tiers.

Once those are answered, the change can move to `sdd-propose`.
