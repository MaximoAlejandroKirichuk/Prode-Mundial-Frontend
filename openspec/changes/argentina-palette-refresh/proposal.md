# Proposal: Argentina Palette Refresh

## Intent

Formalize the landing refresh into a clean visual change. Replace Boca-coded dark navy + gold cues with a white, sky-blue, and graphite direction, while introducing a dedicated premium prizes section and improving the final "How It Works" card.

## Scope

### In Scope
- Refresh landing design tokens and accent utilities from gold/navy to sky-blue + graphite.
- Add a dedicated `PrizesSection.astro` and upgrade the final `HowItWorks.astro` card to feel more premium while avoiding official organizer logos/marks and keeping Selección-themed copy generic.
- Align the landing-page spec with the approved palette direction.

### Out of Scope
- Signup/payment/backend behavior changes.
- Broader landing redesign beyond palette, premium emphasis, and related copy-safe cleanup.
- Footer recolor unless contrast/visual consistency makes it necessary.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `landing-page`: Update visual requirements from sun-gold accents to sky-blue/celeste accents with graphite dark surfaces; preserve SEO, CTA, accessibility, and copy-safe branding constraints.

## Approach

Complete the palette migration as an isolated frontend pass: rename misleading gold-based utilities to neutral accent names, swap navy dark surfaces to graphite where needed, add the approved prizes section, and restyle premium sections with cleaner hierarchy and prize copy that avoids official organizer marks while preserving Selección-themed language. Keep public copy in Spanish and limit changes to landing presentation/spec behavior.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Replace gold/navy tokens and rename accent utilities. |
| `src/components/landing/PrizesSection.astro` | New | Premium prize presentation with Selección-themed copy that avoids official organizer logos/marks. |
| `src/components/landing/HowItWorks.astro` | Modified | Upgrade final card styling to graphite + celeste premium treatment. |
| `src/components/landing/TrustBar.astro` | Modified | Use renamed accent utility. |
| `src/components/landing/SignupSkeleton.astro` | Modified | Align accent utility naming with the new celeste line. |
| `openspec/specs/landing-page/spec.md` | Modified | Replace conflicting R1 palette requirement. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Contrast regressions on graphite surfaces | Med | Recheck key text/button combinations against WCAG AA. |
| Scope drift into broader redesign | Med | Keep branch limited to palette/premium landing surfaces only. |
| Prize copy slips into official organizer branding | Low | Keep reward language premium and football-focused without official organizer logos/marks. |

## Rollback Plan

Revert the palette-refresh commit(s) or this isolated change branch, restoring previous landing tokens/components and the prior landing-page spec wording.

## Dependencies

- Existing `landing-page` spec delta.
- Clean separation from unrelated backend-registration WIP.

## Success Criteria

- [ ] Landing no longer communicates Boca-coded navy + gold as its primary visual identity.
- [ ] Prizes section and final How It Works card feel more premium while staying free of official organizer logos/marks.
- [ ] `landing-page` spec matches the implemented white + sky-blue + graphite direction.
