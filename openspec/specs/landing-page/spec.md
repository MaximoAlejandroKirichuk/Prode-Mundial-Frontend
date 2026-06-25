# Landing Page Specification

## Purpose

SEO-first landing with Argentina–World Cup identity, hero value prop, prediction sections, and preserved signup CTA. Trademark-safe, accessible, responsive.

## Requirements

| # | Requirement | MUST/SHOULD | Summary |
|---|---|---|---|
| R1 | Argentina World Cup Palette | MUST | Light-blue primary, white surfaces, sun-gold accents. WCAG AA contrast. Neutral backgrounds dominant. |
| R2 | Hero Value Proposition | MUST | h1 with Argentina + World Cup hook (Rioplatense). Visible CTA to #signup. Secondary link to #how-it-works. |
| R3 | Trust Stats Bar | SHOULD | Badge row post-hero: ≥2 markers (match count, country reach) with Lucide icons. No official marks. |
| R4 | How-It-Works Steps | MUST | Signup→pay→predict→compete with football Lucide icons. Multi-col desktop, single-col mobile. |
| R5 | Signup CTA Preservation | MUST | Redux thunk + Mercado Pago redirect unchanged. Card copy refreshed to match landing tone. |
| R6 | Trademark Safety | MUST | No FIFA/AFA/CONMEBOL logos, trophies, slogans. Generic Spanish football terms only. |
| R7 | Accessibility | MUST | Semantic HTML, visible focus, keyboard nav, ARIA labels on inputs. Color not sole meaning. |
| R8 | Responsive 320px–2560px | MUST | Single-column ≤768px. Hero CTAs stack ≤640px. No horizontal scroll. |
| R9 | SEO Shell Preservation | MUST | Server `<title>`, `<meta>`, h1→h2→h3 hierarchy. Keywords: Mundial, prode, Argentina, predicciones. |

### R1: Argentina World Cup Palette

The system MUST apply light-blue primary, white surfaces, sun-gold accents via design tokens. MUST meet WCAG AA (≥4.5:1 normal text). Neutral backgrounds MUST dominate.

- **GIVEN** page load → **THEN** buttons/badges use light-blue, gold in separators/icons, body white/near-white.

### R2: Hero Value Proposition

The system MUST render an h1 with Argentina + World Cup excitement in Rioplatense Spanish and a visible signup CTA.

- **GIVEN** first visit → **THEN** h1 conveys World Cup hook, CTA visible without scroll, secondary link to #how-it-works.

### R3: Trust Stats Bar

The system SHOULD render ≥2 stat badges post-hero (e.g., "48 partidos", "+10 países") with Lucide football icons.

- **GIVEN** scroll past hero → **THEN** badges show quantifiable markers with football icons, no official marks.

### R4: How-It-Works Steps

The system MUST present steps (signup→pay→predict→compete) with football Lucide icons and Rioplatense copy.

- **GIVEN** #how-it-works section → **THEN** each step has distinct football icon; grid collapses to single-col on mobile.

### R5: Signup CTA Preservation

The system MUST keep Redux `submitSignup` thunk, validation, and Mercado Pago redirect unchanged. Copy SHOULD match refreshed tone.

- **GIVEN** valid name/email/confirmation → **THEN** thunk dispatches, success redirects to `init_point`. Card title uses World Cup context.

### R6: Trademark Safety

The system MUST NOT include FIFA, AFA, CONMEBOL logos, trophies, mascots, or registered slogans.

- **GIVEN** page rendered → **THEN** no official football-org mark present in text, images, or CSS content. Only generic terms (fútbol, Mundial, hinchas).

### R7: Accessibility

The system MUST provide semantic HTML, keyboard-reachable elements, visible focus, ARIA labels on inputs.

- **GIVEN** keyboard-only user → **THEN** tab order follows visual layout; all interactives receive visible focus.

### R8: Responsive Layout

The system MUST support 320px–2560px. Grids single-column ≤768px. CTAs stack ≤640px. No horizontal scroll.

- **GIVEN** 375px viewport → **THEN** single-column layout, no horizontal overflow, hero buttons stacked.

### R9: SEO Shell Preservation

The system MUST preserve server-rendered `<title>`, `<meta description>`, h1→h2→h3 hierarchy, and keyword relevance.

- **GIVEN** crawler fetch → **THEN** `<title>` + `<meta>` present in `<head>`, valid heading hierarchy without skips.
