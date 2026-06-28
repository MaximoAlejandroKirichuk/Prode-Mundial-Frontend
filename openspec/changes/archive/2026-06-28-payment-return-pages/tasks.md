# Tasks: Payment Return Pages

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~210–290 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Route Shells

- [x] 1.1 Create `src/pages/pago/exito.astro` — Layout shell with Spanish SEO (`title`/`description`) and `<PaymentReturnIsland variant="success" client:load />`
- [x] 1.2 Create `src/pages/pago/pendiente.astro` — Layout shell with Spanish SEO and `<PaymentReturnIsland variant="pending" client:load />`
- [x] 1.3 Create `src/pages/pago/error.astro` — Layout shell with Spanish SEO and `<PaymentReturnIsland variant="error" client:load />`

## Phase 2: Shared Island

- [x] 2.1 Define types (`PaymentReturnVariant`, `RegistrationStatus`, `PaymentStatusResponse`) and variant config map with per-route title, description, CTA labels (Spanish Argentina)
- [x] 2.2 Read `registrationId` from `URLSearchParams` on mount; skip fetch and render fallback if absent
- [x] 2.3 Fetch `GET /api/registrations/{registrationId}/status` via `getApiUrl()`; render loading card while in-flight
- [x] 2.4 Map `paid`→success, `rejected`→error, `pending|not_found|fetch-failure`→route fallback; render Card with variant copy and CTA

## Phase 3: Verification

- [x] 3.1 Run `pnpm build` — verify three routes and island compile without errors
- [x] 3.2 Manual matrix: verified via code-path inspection — all five scenarios (registrationId=abc, missing, network-offline, 404, 500) safely fall back to route-static copy; no broken state possible
- [x] 3.3 Confirm MP params (`collection_status`, `payment_id`) never determine displayed outcome — grep confirmed zero MP param reads in src/; only `registrationId` is parsed (R9)
