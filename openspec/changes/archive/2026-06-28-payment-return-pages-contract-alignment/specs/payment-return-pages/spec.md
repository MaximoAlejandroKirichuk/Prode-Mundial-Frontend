# Delta for payment-return-pages

## MODIFIED Requirements

### R1: Route shells as UX-only browser-return routes

The system MUST render three Astro pages — `/pago/exito`, `/pago/error`, `/pago/pendiente` — each with a Spanish Argentina `<title>`, `<meta description>`, and route-appropriate static copy. Pages MUST use the shared `Layout.astro` shell. These pages are UX navigation routes only; final payment state belongs to the backend webhook.

(Previously: described as branded landing pages; did not explicitly state UX-only/non-authoritative role.)

- **GIVEN** a user arrives at `/pago/exito` → **THEN** page renders with success-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/error` → **THEN** page renders with error-themed title, meta, and the shared `PaymentReturnIsland`.
- **GIVEN** a user arrives at `/pago/pendiente` → **THEN** page renders with pending-themed title, meta, and the shared `PaymentReturnIsland`.

### R2: Shared return island — pure presentational

The system MUST use a single `PaymentReturnIsland` React component (`client:load`) across all three routes, accepting a `variant` prop (`success` | `error` | `pending`). The component MUST render immediately on mount without any backend requests, query-param parsing, or loading states. The variant SHALL be the sole determinant of displayed copy and CTA.

(Previously: island handled query-param parsing, backend status fetch, loading/confirmed/fallback state machine, and used variant only for fallback.)

- **GIVEN** `variant="success"` → **THEN** island renders "¡Listo! Tu inscripción fue procesada…" copy and a home CTA.
- **GIVEN** `variant="error"` → **THEN** island renders "No se pudo completar el pago…" copy and a retry CTA.
- **GIVEN** `variant="pending"` → **THEN** island renders "Tu pago está siendo procesado…" copy and manual-refresh guidance.

### R7: Route-specific static CTA

The system MUST render a context-appropriate call-to-action per variant: success links home; error links back to signup; pending instructs manual refresh or support contact. The CTA SHALL be determined solely by the route variant and SHALL NOT depend on backend state.

(Previously: SHOULD — now unconditional since no backend state affects CTA selection.)

- **GIVEN** success variant → **THEN** CTA directs user home.
- **GIVEN** error variant → **THEN** CTA offers retry / return to signup.
- **GIVEN** pending variant → **THEN** CTA suggests refreshing or contacting support.

### R9: Query-param safety — contract-aligned

The system MAY read documented Mercado Pago query parameters (`payment_id`, `status`, `merchant_order_id`, `preference_id`) for non-authoritative display or support context only. The system MUST NOT use any query parameter — including `registrationId`, `collection_status`, or any Mercado Pago param — to determine the displayed outcome. The route variant SHALL be the sole authority for displayed state. The system SHALL NOT parse `registrationId` from the URL.

(Previously: prohibited MP params from determining outcome but still allowed backend status endpoint as authoritative and required registrationId parsing.)

- **GIVEN** URL contains `?payment_id=123&status=approved` → **THEN** island renders route-static content per variant; param values do not change the displayed outcome.
- **GIVEN** URL contains `?registrationId=abc123` → **THEN** island ignores `registrationId`; renders route-static content per variant without initiating any backend request.

## REMOVED Requirements

### R3: Query-param intake

(Reason: `registrationId` is not a documented Mercado Pago return parameter per api.md. The frontend MUST NOT read or act on query params to determine outcome.)

### R4: Backend status lookup

(Reason: `GET /api/registrations/{registrationId}/status` is not a documented endpoint in api.md. Frontend payment confirmation is the backend webhook's responsibility per api.md §5.)

### R5: Fallback — missing registrationId

(Reason: superseded by R3 removal. Without registrationId parsing, this fallback is unnecessary.)

### R6: Fallback — fetch failure

(Reason: superseded by R4 removal. Without backend status calls, fetch-failure fallback is unnecessary.)

### R8: Loading state

(Reason: superseded by R4 removal. Without backend fetches, no loading state is needed.)
