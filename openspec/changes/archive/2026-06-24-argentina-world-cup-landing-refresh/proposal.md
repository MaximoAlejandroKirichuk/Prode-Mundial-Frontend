# Proposal: Argentina World Cup Landing Refresh

## Intent

Refresh the landing so it feels unmistakably Argentinian and World-Cup-oriented without breaking the Astro shell, SEO posture, or the current signup/payment flow. The page should improve emotional relevance and scanability, not become a full rebrand.

## Scope

### In Scope
- Update `src/styles/global.css` to an Argentina-led palette with restrained sky-blue, white, and sun-gold accents.
- Restructure `src/pages/index.astro` into a stronger hero, compact trust/stats row, clearer section order, and sharper World Cup copy in Rioplatense Spanish.
- Refresh `src/components/SignupForm.tsx` copy/styling context only; keep Redux logic, validation, and redirect behavior unchanged.

### Out of Scope
- New payment behavior, signup fields, or backend/API changes.
- Asset-heavy redesign, custom illustrations, countdown islands, or official FIFA/AFA marks.

## Capabilities

### New Capabilities
- `landing-page`: SEO landing content, thematic styling, section hierarchy, and CTA continuity for the World Cup entry experience.

### Modified Capabilities
- None.

## Approach

Use a medium-scope theme-first refresh with light section restructuring. Favor Tailwind/theme tokens, badges, separators, and simple iconography over new assets. Keep rendering server-first in Astro; `SignupIsland` remains the only hydrated island. Use trademark-safe generic football language and avoid official logos, crests, trophy art, or protected branding.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Replace neutral-first tokens with Argentina-inspired palette and contrast-safe accents. |
| `src/pages/index.astro` | Modified | Rework hero, trust row, section sequencing, CTA framing, and SEO-facing copy emphasis. |
| `src/components/SignupForm.tsx` | Modified | Align title, helper text, and CTA copy with the new landing tone. |
| `src/components/landing/` | New | Optional small presentational sections if extraction keeps Astro page readable. |
| `src/layouts/Layout.astro` | Modified | Minor metadata refinement only if it strengthens SEO targeting. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Over-theming hurts readability | Med | Keep neutral surfaces; use blue/gold as accents only. |
| Review budget creep | Med | Limit to theme, copy, and 1-2 structural section changes. |
| Trademark confusion | Low | Use generic football wording; no official FIFA/AFA assets or marks. |

## Rollback Plan

Revert landing-focused changes in `global.css`, `index.astro`, and `SignupForm.tsx`; keep pre-refresh structure and current signup flow intact. Avoid data/model changes so rollback is file-level only.

## Dependencies

- Existing Astro + React island setup, shadcn/ui primitives, and current Spanish-for-Argentina copy conventions.

## Success Criteria

- [ ] Landing visually reads as Argentina + World Cup without using official marks.
- [ ] SEO shell and `SignupIsland` behavior remain intact.
- [ ] Refresh ships as a medium landing update, not a full redesign or asset-heavy rebuild.
