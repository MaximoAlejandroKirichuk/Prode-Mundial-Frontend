# Payment Return Pages Specification

## Purpose

Mercado Pago post-checkout browser-return routes providing user-friendly status pages for approved, pending, and failed outcomes. A shared presentational React island renders route-static copy immediately from the `variant` prop with no backend requests, no query-param intake, and no loading state. Final payment confirmation belongs to the backend webhook per `api.md`.

## Requirements

| # | Requirement | MUST/SHOULD | Summary |
|---|---|---|---|
| R1 | Route shells with SEO | MUST | Three Astro routes render shells with Spanish Argentina `<title>` and `<meta>`. |
| R2 | Shared return island — pure presentational | MUST | Single `PaymentReturnIsland` renders immediately from `variant` prop only. No backend requests, no query-param parsing, no loading states. |
| R7 | Route-specific static CTA | MUST | Each route shows context-appropriate call-to-action determined solely by the route variant. |
| R9 | Query-param safety — contract-aligned | MUST | Mercado Pago query params SHALL NOT determine displayed outcome. Route variant is the sole authority. |

### R1: Route shells with SEO

The system MUST render three Astro pages — `/pago/exito`, `/pago/error`, `/pago/pendiente` — each with a Spanish Argentina `<title>`, `<meta description>`, and route-appropriate static copy. Pages MUST use the shared `Layout.astro` shell. These pages are UX navigation routes only; final payment state belongs to the backend webhook.

- **GIVEN** a user arrives at `/pago/exito` → **THEN** page renders with success-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/error` → **THEN** page renders with error-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/pendiente` → **THEN** page renders with pending-themed title, meta, and the shared `PaymentReturnIsland`.

### R2: Shared return island — pure presentational

The system MUST use a single `PaymentReturnIsland` React component (`client:load`) across all three routes, accepting a `variant` prop (`success` | `error` | `pending`). The component MUST render immediately on mount without any backend requests, query-param parsing, or loading states. The variant SHALL be the sole determinant of displayed copy and CTA.

- **GIVEN** `variant="success"` → **THEN** island renders "¡Gracias! Tu pago está siendo verificado…" copy and a home CTA.
- **GIVEN** `variant="error"` → **THEN** island renders "No se pudo completar el pago…" copy and a retry CTA.
- **GIVEN** `variant="pending"` → **THEN** island renders "Tu pago está siendo procesado…" copy and manual-refresh guidance.

### R7: Route-specific static CTA

The system MUST render a context-appropriate call-to-action per variant: success links home; error links back to signup; pending instructs manual refresh or support contact. The CTA SHALL be determined solely by the route variant and SHALL NOT depend on backend state.

- **GIVEN** success variant → **THEN** CTA directs user home.
- **GIVEN** error variant → **THEN** CTA offers retry / return to signup.
- **GIVEN** pending variant → **THEN** CTA suggests refreshing or contacting support.

### R9: Query-param safety — contract-aligned

The system MAY read documented Mercado Pago query parameters (`payment_id`, `status`, `merchant_order_id`, `preference_id`) for non-authoritative display or support context only. The system MUST NOT use any query parameter — including `registrationId`, `collection_status`, or any Mercado Pago param — to determine the displayed outcome. The route variant SHALL be the sole authority for displayed state. The system SHALL NOT parse `registrationId` from the URL.

- **GIVEN** URL contains `?payment_id=123&status=approved` → **THEN** island renders route-static content per variant; param values do not change the displayed outcome.
- **GIVEN** URL contains `?registrationId=abc123` → **THEN** island ignores `registrationId`; renders route-static content per variant without initiating any backend request.

## Removed Requirements

| # | Requirement | Reason |
|---|---|---|
| R3 | Query-param intake | `registrationId` is not a documented Mercado Pago return parameter per `api.md`. The frontend MUST NOT read or act on query params to determine outcome. |
| R4 | Backend status lookup | `GET /api/registrations/{registrationId}/status` is not a documented endpoint in `api.md`. Payment confirmation is the webhook's responsibility per `api.md` §5. |
| R5 | Fallback — missing registrationId | Superseded by R3 removal. Without `registrationId` parsing, this fallback is unnecessary. |
| R6 | Fallback — fetch failure | Superseded by R4 removal. Without backend status calls, fetch-failure fallback is unnecessary. |
| R8 | Loading state | Superseded by R4 removal. Without backend fetches, no loading state is needed. |
