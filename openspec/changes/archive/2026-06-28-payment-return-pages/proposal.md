# Proposal: Payment Return Pages

## Intent

Add Mercado Pago return pages so users never land on a dead end after checkout and can see a trustworthy post-payment state while backend status wiring is still stabilizing.

## Proposal question round

- Assumptions to confirm later: backend will append `registrationId` to every `back_url`; support remains `oficialprodelito@gmail.com`; pending users can manually refresh instead of auto-polling in v1.

## Scope

### In Scope
- Add `/pago/exito`, `/pago/pendiente`, and `/pago/error` Astro routes with Spanish Argentina SEO/copy.
- Add one shared React island for loading, query-param parsing, backend status lookup, and consistent CTA/support states.
- Define the frontend contract for `GET /api/registrations/{registrationId}/status` plus safe fallback behavior before backend alignment is complete.

### Out of Scope
- Changing checkout initiation, Mercado Pago preference creation, or webhook/email delivery flows.
- Polling, app-access deep links, or any post-payment logged-in experience.

## Capabilities

### New Capabilities
- `payment-return-pages`: Mercado Pago return routes with shared UI, runtime query parsing, backend-backed status resolution, and route-safe fallbacks.

### Modified Capabilities
- None.

## Approach

Keep Astro for route shells and SEO, hydrate a shared `PaymentReturnIsland` with `client:load`, parse `registrationId` plus optional MP params at runtime, and treat the backend status endpoint as authoritative when available. On missing `registrationId`, fetch failure, unknown response, or backend-not-ready states, render the route's static fallback message instead of blocking the user.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/pago/exito.astro` | New | Approved-payment shell |
| `src/pages/pago/pendiente.astro` | New | Pending-payment shell |
| `src/pages/pago/error.astro` | New | Rejected/error shell |
| `src/components/PaymentReturnIsland.tsx` | New | Shared state, fetch, fallback UI |
| `src/lib/backend.ts` | Modified | Reuse status endpoint URL builder |
| `openspec/specs/payment-return-pages/spec.md` | New | Capability spec for return-page behavior |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend omits `registrationId` or CORS | Med | Lock contract in spec/design before implementation |
| Success route shows before webhook settles | Med | Copy says access email may arrive in minutes |
| MP query params are inconsistent | Low | Use them only as non-authoritative context |

## Rollback Plan

Remove the three `/pago/*` routes and shared island, restore direct fallback to the landing/support flow, and drop the new capability spec if backend alignment is postponed.

## Dependencies

- Backend must configure Mercado Pago `back_urls` for the three routes with `registrationId` in the query string.
- Backend must expose `GET /api/registrations/{registrationId}/status` returning `paid | pending | rejected | not_found`.

## Success Criteria

- [ ] Users always land on a branded return page for approved, pending, or rejected checkout outcomes.
- [ ] Return pages share one UI/state model and handle missing params or backend failures safely.
- [ ] The frontend/backend contract is explicit enough for `sdd-spec` and implementation without inventing payment-state behavior later.
