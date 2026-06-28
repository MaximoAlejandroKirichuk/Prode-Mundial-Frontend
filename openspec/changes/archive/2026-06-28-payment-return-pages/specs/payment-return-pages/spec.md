# Payment Return Pages Specification

## Purpose

Mercado Pago post-checkout return routes providing trustworthy, branded landing pages for approved, pending, and rejected outcomes. A shared React island parses `registrationId` from query params, queries the backend status endpoint when reachable, and falls back to static route copy on missing data or fetch failure.

## Requirements

| # | Requirement | MUST/SHOULD | Summary |
|---|---|---|---|
| R1 | Route shells with SEO | MUST | Three Astro routes render branded shells with Spanish Argentina `<title>` and `<meta>`. |
| R2 | Shared return island | MUST | Single `PaymentReturnIsland` handles query-param parsing, status fetch, and UI state for all three routes. |
| R3 | Query-param intake | MUST | Read `registrationId` from URL search params on mount. |
| R4 | Backend status lookup | MUST | Call `GET /api/registrations/{registrationId}/status`; map response to UI state. |
| R5 | Fallback: missing registrationId | MUST | Render route-static fallback copy without attempting a fetch. |
| R6 | Fallback: fetch failure | MUST | On network error, 4xx, or 5xx, render route-static fallback copy without blocking the user. |
| R7 | Route-specific CTA | SHOULD | Each route shows context-appropriate action guidance. |
| R8 | Loading state | MUST | Show loading indicator while status fetch is in flight. |
| R9 | MP param safety | MUST | Mercado Pago query params SHALL NOT determine the displayed outcome. |

### R1: Route shells with SEO

The system MUST render three Astro pages — `/pago/exito`, `/pago/error`, `/pago/pendiente` — each with a Spanish Argentina `<title>`, `<meta description>`, and route-appropriate static fallback copy. Pages MUST use the shared `Layout.astro` shell.

- **GIVEN** a user arrives at `/pago/exito` → **THEN** page renders with success-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/error` → **THEN** page renders with error-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/pendiente` → **THEN** page renders with pending-themed title, meta, and the shared `PaymentReturnIsland`.

### R2: Shared return island

The system MUST use a single `PaymentReturnIsland` React component (`client:load`) across all three routes, accepting a `variant` prop (`success` | `error` | `pending`) that drives which static fallback message and CTA to display.

- **GIVEN** `variant="success"` → **THEN** island resolves fallback to "¡Listo! Tu inscripción fue procesada…" copy and a secondary home CTA.
- **GIVEN** `variant="error"` → **THEN** island resolves fallback to "No se pudo completar el pago…" copy and a retry CTA.
- **GIVEN** `variant="pending"` → **THEN** island resolves fallback to "Tu pago está siendo procesado…" copy and manual-refresh guidance.

### R3: Query-param intake

The system MUST read `registrationId` from `URLSearchParams` on mount. If absent, the island MUST enter fallback state immediately.

- **GIVEN** URL contains `?registrationId=abc123` → **THEN** island stores `abc123` and initiates the status fetch.
- **GIVEN** URL contains no `registrationId` param → **THEN** island skips fetch, renders route-static fallback.

### R4: Backend status lookup

The system MUST call `GET /api/registrations/{registrationId}/status` when `registrationId` is present. On a `200` response, it MUST map `status: "paid"` → success UI, `"rejected"` → error UI, `"pending"` or `"not_found"` → pending UI.

- **GIVEN** `registrationId` is present and backend returns `{ status: "paid" }` → **THEN** island renders success state with backend-confirmed messaging.
- **GIVEN** backend returns `{ status: "pending" }` → **THEN** island renders pending state with backend-confirmed copy.
- **GIVEN** backend returns `{ status: "rejected" }` → **THEN** island renders error state with rejected-specific guidance.

### R5: Fallback — missing registrationId

The system MUST render the route's static fallback message when `registrationId` is absent from the URL. No fetch attempt SHALL be made.

- **GIVEN** URL is `/pago/exito` with no query params → **THEN** island renders success-static copy; no backend call is initiated.

### R6: Fallback — fetch failure

The system MUST render the route's static fallback message on any fetch failure (network error, 4xx, 5xx). The user MUST NOT see a broken state or dead end.

- **GIVEN** `registrationId` is present but the status endpoint returns `404` → **THEN** island falls back to route-static copy.
- **GIVEN** status endpoint times out or returns `500` → **THEN** island falls back to route-static copy after request settles.

### R7: Route-specific CTA

The system SHOULD render a context-appropriate call-to-action per route: `/pago/exito` links home; `/pago/error` links back to signup; `/pago/pendiente` instructs manual refresh.

- **GIVEN** success state → **THEN** CTA directs user home.
- **GIVEN** error state → **THEN** CTA offers retry / return to signup.
- **GIVEN** pending state → **THEN** CTA suggests refreshing or contacting support.

### R8: Loading state

The system MUST display a loading indicator from mount until the status fetch resolves or fails.

- **GIVEN** island mounts with `registrationId` present → **THEN** loading indicator is visible; static fallback is hidden until fetch completes.

### R9: Mercado Pago param safety

The system MUST NOT use Mercado Pago query parameters (`collection_status`, `payment_id`, `merchant_order_id`, etc.) to determine or alter the displayed outcome. Only the backend status endpoint or the route-static fallback SHALL be authoritative.

- **GIVEN** URL contains `?collection_status=approved` but `registrationId` is absent → **THEN** island does not interpret `collection_status`; renders route-static fallback.
