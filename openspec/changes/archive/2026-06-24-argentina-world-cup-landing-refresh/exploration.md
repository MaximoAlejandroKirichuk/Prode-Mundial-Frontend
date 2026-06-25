# Exploration: Argentina + World Cup Landing Refresh

Refresh the landing page so it feels clearly Argentinian and more oriented to the FIFA World Cup, while preserving the existing Astro + React island architecture and Spanish-for-Argentina copy conventions.

## Current State

The landing page (`src/pages/index.astro`) is a single-page marketing shell with a neutral grayscale theme (`baseColor: neutral` in `components.json`). It already mentions "Mundial 2026" and Argentina/Latin-America audiences, but the visual identity is generic:

- Theme colors are monochrome (`--color-primary: #171717`, `--color-secondary: #f5f5f5`).
- Hero copy is functional (`Predecí el Mundial`) rather than emotionally World-Cup themed.
- No Argentina visual cues (light blue, white, sun-gold) or football iconography.
- Sections are: Hero → How It Works → Signup → FAQ → Footer.
- The only interactive element is the `SignupIsland` (`SignupForm` + Redux Toolkit) for name/email submission.
- No image assets exist in `src/assets/` or `public/` beyond the default favicons.
- shadcn/ui primitives available: `badge`, `button`, `card`, `input`, `label`, `separator`.
- SEO metadata is already in Spanish for Argentina and should remain so.

## Affected Areas

| Path | Why it is affected |
|------|--------------------|
| `src/styles/global.css` | Argentina color palette must be added/override current neutral theme variables. |
| `src/pages/index.astro` | Hero, sections, CTAs, and SEO copy need World Cup / Argentina reorientation. |
| `src/components/SignupForm.tsx` | Card header/description and submit button copy should match the refreshed tone. |
| `src/components/ui/button.tsx` / `badge.tsx` | May need Argentina-accented variants or just rely on updated CSS variables. |
| `src/components/` | New section components (e.g., stats/countdown, football content blocks, trust signals) are likely needed. |
| `public/` | New favicon / simple SVG illustration or decorative asset possible, but keep asset count low. |
| `src/layouts/Layout.astro` | Title/description may be refined for stronger SEO and World Cup focus. |

## Approaches

### 1. Theme-First Refresh
Update the Tailwind theme variables to Argentina World Cup colors (light blue primary, white background, sun-gold accents) and lightly rewrite the hero/subhead copy. Keep the existing section structure.

- **Pros**: Fast, low-risk, consistent with shadcn/ui variables, preserves SEO skeleton, easy to roll back.
- **Cons**: Limited visual impact; may feel like a "paint job" rather than a true World Cup reorientation.
- **Effort**: Low

### 2. Section Restructuring + Themed Components (Recommended)
Apply the Argentina color palette and restructure the landing with World-Cup-focused blocks: a stronger hero with a football/Argentina value proposition, a compact stats/trust bar (e.g., "48 partidos · 1 campeón"), a football-icon-driven "How It Works", and a more prominent signup CTA. Keep the existing signup flow untouched.

- **Pros**: Stronger conversion narrative, clearly Argentine + World Cup feel, modular components fit the existing Astro + React island model, fits within a 400-line PR if scoped tightly.
- **Cons**: More copy to maintain, slightly more responsive testing, risk of over-theming if not restrained.
- **Effort**: Medium

### 3. Full Brand Redesign
Commission/create custom illustrations, animated hero, dedicated Argentina imagery, and possibly a countdown timer island.

- **Pros**: Maximum visual impact.
- **Cons**: Requires original assets or licensed imagery, high risk of FIFA/Argentina trademark issues, exceeds the 400-line review budget, needs design assets that do not currently exist.
- **Effort**: High

## Recommendation

Adopt **Approach 2** with a tight scope:

1. Update `src/styles/global.css` to an Argentina World Cup palette: light blue `#6CACE4` as primary, white background, sun gold `#FFB81C` as accent. Verify contrast ratios.
2. Rewrite the hero in `src/pages/index.astro` to lead with a World Cup + Argentina angle (e.g., "Viví el Mundial 2026 como nunca" / "Predecí cada partido y competí con hinchas de todo el país").
3. Add a small stats/trust bar under the hero using shadcn `Badge` and Lucide football icons.
4. Refactor "How It Works" to use football-relevant icons and Argentina-centric copy.
5. Keep the `SignupForm` logic unchanged; only update its card title/description and button copy.
6. Avoid official FIFA, AFA, or World Cup trademarks; use generic football language and colors only.
7. Keep all changes server-rendered in Astro where possible; only the signup form remains a React island.

## Risks

- **Copy drift**: Generic "Mundial" copy and Argentina-specific copy can clash if not reviewed holistically.
- **Over-theming**: Excessive use of light blue/gold can reduce readability or cheapen the page. Use neutral surfaces with accents.
- **Responsive complexity**: New hero/sections must still work on mobile-first; avoid large decorative assets.
- **Asset gap**: No image pipeline exists; rely on CSS/Lucide icons rather than photographs.
- **Trademark / legal**: Official World Cup / AFA logos, trophy illustrations, or FIFA wording must not be used without rights.
- **Review budget**: Approach 2 can exceed 400 changed lines if not scoped; slice into theme + copy + sections if needed.

## Ready for Proposal

**Yes.** The codebase is simple enough and the change is well scoped. The orchestrator can move to `sdd-propose` with the recommended Approach 2, explicitly noting the trademark-avoidance guard and the 400-line review-budget constraint.
