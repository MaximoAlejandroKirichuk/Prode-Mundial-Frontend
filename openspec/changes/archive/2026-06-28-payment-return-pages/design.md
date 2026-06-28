# Design: Payment Return Pages

## Technical Approach

Use three Astro route shells for `/pago/exito`, `/pago/pendiente`, and `/pago/error`, each reusing `src/layouts/Layout.astro` for SEO and page chrome, and hydrate one shared `PaymentReturnIsland` with `client:load`. The island reads `registrationId` from `window.location.search`, calls the backend status endpoint through `getApiUrl()`, and resolves the final UI from backend status first, route variant second. If the query is incomplete, the endpoint is unavailable, or the response is unknown, the page stays useful by rendering the route’s static fallback state.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|---|---|---|---|
| State location | Local React state vs Redux slice | Local state in `PaymentReturnIsland` | The flow is route-scoped, read-only, and not reused elsewhere; this matches the existing “small island” pattern in `SignupIsland.tsx` without adding store boilerplate. |
| Source of truth | MP query params vs backend status vs route-only copy | Backend status authoritative; route variant fallback | MP params are inconsistent and static Astro cannot read them server-side. Backend status avoids false success/error states, while route fallback keeps pages shippable before backend readiness. |
| File granularity | Multiple payment components vs one shared island | One island + per-route config props | Minimal surface area, consistent UX, and easier backend contract changes while endpoint details stabilize. |

## Data Flow

Sequence:

    User -> Mercado Pago -> /pago/{variant}?registrationId=...
    Astro route -> Layout.astro + PaymentReturnIsland client:load
    PaymentReturnIsland -> URLSearchParams(window.location.search)
    PaymentReturnIsland -> GET /api/registrations/{registrationId}/status
    Backend -> { status: paid|pending|rejected|not_found }
    PaymentReturnIsland -> render resolved state or route fallback

Resolution order:
1. Missing `registrationId` → render `missing-id` fallback for the current route.
2. Request in flight → render loading card.
3. Valid backend status → map to `paid`, `pending`, or `rejected` UI.
4. `not_found`, network error, 5xx, CORS, invalid JSON, unknown status → render route fallback copy with retry/support CTA.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/pago/exito.astro` | Create | Success route shell with Spanish SEO metadata and `variant="success"`. |
| `src/pages/pago/pendiente.astro` | Create | Pending route shell with `variant="pending"`. |
| `src/pages/pago/error.astro` | Create | Error route shell with `variant="error"`. |
| `src/components/PaymentReturnIsland.tsx` | Create | Shared card UI, query parsing, fetch lifecycle, status mapping, CTAs, and safe fallback behavior. |
| `src/lib/backend.ts` | Modify | Reuse existing URL builder only; no new env var. |

## Interfaces / Contracts

```ts
type PaymentReturnVariant = "success" | "pending" | "error";
type RegistrationStatus = "paid" | "pending" | "rejected" | "not_found";

interface PaymentStatusResponse {
  status: RegistrationStatus;
  updatedAt?: string;
}
```

`PaymentReturnIsland` props:
- `variant: PaymentReturnVariant`
- `title`, `description`, and CTA labels can be defined by a small in-file config map keyed by variant.

Safe assumptions for v1:
- Backend appends `registrationId` to all Mercado Pago `back_urls`.
- Endpoint path is `GET /api/registrations/{registrationId}/status`.
- No polling; pending users get manual refresh plus support guidance.
- Unknown backend readiness must never block rendering.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | New routes and imports compile | `pnpm build` |
| Manual browser matrix | Each route with success/missing-id/fetch-failure/status variations | Visit `/pago/exito`, `/pago/pendiente`, `/pago/error` with mocked query strings and backend responses |
| Contract check | Status mapping stays aligned with backend | Compare frontend union type and fallback handling against backend response shape during integration |

No automated unit/integration/e2e runner exists yet.

## Migration / Rollout

No migration required. Roll out frontend first with fallback-safe behavior, then enable backend `back_urls`, CORS, and status endpoint. Until backend delivery is complete, the pages remain usable because route copy is self-sufficient.

## Open Questions

- [ ] Should backend return a distinct status for "approved but access email not yet sent", or is `paid` sufficient for v1?
- [ ] Will backend include `registrationId` in every manual-return URL, not only `auto_return` approved flows?
