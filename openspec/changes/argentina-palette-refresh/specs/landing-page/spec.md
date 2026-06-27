# Delta for Landing Page

## ADDED Requirements

### R10: Premium Prize Hierarchy

The system MUST render the prizes section with graphite dark surface backgrounds and celeste primary accents. Prize tiers MUST use Spanish football reward descriptions that avoid official organizer logos/marks and preserve a neutral/premium tone. Selección-themed wording MAY appear when it does not imply official organizer branding. Visual hierarchy MUST communicate tier progression (1st > 2nd > 3rd) through size, position, or surface treatment.

(Previously: no explicit prize-section spec requirement existed.)

#### Scenario: Prize tiers rendered with premium palette

- **GIVEN** landing page scrolled to prizes section
- **WHEN** section renders
- **THEN** prize cards use graphite dark backgrounds with celeste accent elements; tier 1 visually dominates tiers 2 and 3; no official organizer logos/marks are referenced

#### Scenario: Mobile prize layout

- **GIVEN** viewport ≤768px
- **WHEN** prizes section renders
- **THEN** prize cards stack vertically; graphite + celeste treatment preserved; tier hierarchy still discernible

### R11: Final How-It-Works Card Emphasis

The system MUST render the final step card in the How-It-Works sequence (compete/competir) with a graphite dark surface and celeste accent treatment, visually distinct from the preceding steps. The preceding steps MUST remain lighter than the final card, and step 3 MAY retain a celeste highlight as long as card 4 remains the strongest emphasis.

(Previously: no distinct card-emphasis spec requirement existed.)

#### Scenario: Final card stands out

- **GIVEN** landing page scrolled to #how-it-works
- **WHEN** section renders
- **THEN** the last step card uses graphite background + celeste accent; cards 1–2 stay white/near-white and step 3 may use a lighter celeste highlight; visual distinction is clear without motion alone

#### Scenario: Reduced-motion fallback

- **GIVEN** user has prefers-reduced-motion enabled
- **WHEN** How-It-Works section renders
- **THEN** final-card emphasis conveyed solely through color/surface difference; no motion-dependent emphasis

## MODIFIED Requirements

### R1: Argentina World Cup Palette

The system MUST apply light-blue/celeste primary, white surfaces, sky-blue accents, and graphite dark surfaces via design tokens. MUST meet WCAG AA (≥4.5:1 normal text) on all text/background combinations. Neutral white backgrounds MUST dominate; graphite dark surfaces MUST be reserved for premium section accents (prizes, final How-It-Works card).
(Previously: light-blue primary, white surfaces, sun-gold accents; no graphite dark surfaces.)

#### Scenario: Palette applied on page load

- **GIVEN** page load
- **WHEN** landing renders
- **THEN** CTAs and interactive elements use celeste primary; separators and icons use sky-blue accent; premium sections (prizes, final How-It-Works card) use graphite dark backgrounds with WCAG AA contrast

#### Scenario: Neutral dominance preserved

- **GIVEN** landing rendered
- **THEN** white/near-white backgrounds dominate overall page; graphite surfaces limited to designated premium sections only
