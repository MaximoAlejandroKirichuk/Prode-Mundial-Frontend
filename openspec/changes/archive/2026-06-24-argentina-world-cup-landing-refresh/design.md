# Design: Argentina World Cup Landing Refresh

## Technical Approach

Deliver a theme-first landing refresh that keeps Astro as the page composer and `SignupIsland` as the only hydrated boundary. The work stays limited to visual tokens, section order, and copy emphasis so the signup/payment flow, Redux slice, and `/api/signup` contract remain unchanged.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice / Rationale |
|---|---|---|---|
| Page composition | Keep all content in `src/pages/index.astro`; split into React; add small Astro partials | More files improve scanability, but too much extraction adds ceremony for a medium refresh | Keep `index.astro` as the shell and allow at most 1-2 small `.astro` presentational partials in `src/components/landing/` only if readability suffers. This follows the current Astro-first pattern without adding client JS. |
| Theme implementation | Inline utility colors; replace shadcn tokens | Inline classes are faster short-term but drift from the shared system | Update `src/styles/global.css` `@theme` tokens only. Use Argentina-inspired values through existing tokens (`primary`, `secondary`, `accent`, `muted`, `ring`, `border`) so `Badge`, `Button`, `Card`, `Input`, and `Separator` inherit the palette automatically. |
| Signup boundary | Restyle by moving logic into page; keep current island | Moving logic could simplify layout coupling, but breaks the current shell/island contract | Keep `src/components/SignupIsland.tsx` unchanged. Refresh only `src/components/SignupForm.tsx` copy and surface styling so hydration scope and Redux behavior stay stable. |

## Data Flow

Static rendering and interactive flow stay separated:

    Layout.astro
         ↓
    index.astro (hero, stats, sections, SEO copy)
         ↓
    SignupIsland client:load
         ↓
    SignupForm → Redux submitSignup thunk → /api/signup → Mercado Pago redirect

Landing refresh changes only the `Layout.astro` metadata copy and the static section composition above the island.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Replace neutral-first theme tokens with contrast-safe Argentina colors: sky-blue primary, white surfaces, deep-ink foreground, and restrained sun-gold accent/ring values. Add no custom component CSS beyond base/body polish. |
| `src/pages/index.astro` | Modify | Reorder into hero → trust/stats row → how-it-works → signup CTA block → FAQ/support. Keep links anchored to `#signup` and `#how-it-works`, strengthen World Cup positioning, and use token-driven gradients/backgrounds. |
| `src/components/SignupForm.tsx` | Modify | Update heading, helper text, submit microcopy, and card emphasis to match the campaign while preserving validation, thunk dispatch, and redirect behavior. Add accessible descriptions only if needed. |
| `src/layouts/Layout.astro` | Modify | Optionally refine default `title`/`description` and add social/canonical metadata only if done without widening scope. |
| `src/components/landing/*.astro` | Create (optional) | Only if `index.astro` becomes hard to scan; keep these static and prop-light (for example, trust row or FAQ list). |

## Interfaces / Contracts

No API or Redux contract changes.

```ts
// preserved contract
submitSignup({ name, email }) => { init_point: string }
```

Theme contract:
- Prefer `bg-primary`, `text-primary-foreground`, `bg-accent`, `text-muted-foreground`, `border-border`, `ring-ring`.
- Do not introduce one-off hex colors in page/component classes unless a token cannot express the need.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Existing form validation and submit states | No new unit runner exists; keep logic unchanged and avoid refactors that would require new test infra. |
| Integration | Signup island still submits and redirects | Run `pnpm build` and manually verify the landing in `astro dev --background`, including loading, validation, disabled submit, and server error states. |
| E2E | Responsive landing flow and anchor navigation | Manual browser checks at mobile and desktop widths; verify CTA jumps, readable contrast, and focus visibility. |

## Migration / Rollout

No migration required. Rollout is file-level and reversible by restoring `global.css`, `index.astro`, `SignupForm.tsx`, and any optional landing partials. No persisted data or backend behavior changes.

## Open Questions

- [ ] Should `Layout.astro` add Open Graph/Twitter tags now, or keep this refresh limited to title/description only?
