## Exploration: payment-return-pages-contract-alignment

### Current State

The payment return pages (`/pago/exito`, `/pago/error`, `/pago/pendiente`) were shipped as UX routes that render a shared `PaymentReturnIsland`. The island currently tries to call a backend status endpoint before deciding what to show:

- On mount it reads `registrationId` from `window.location.search`.
- If `registrationId` is present, it calls `GET /api/registrations/{registrationId}/status`.
- It maps `paid`/`rejected` to a backend-confirmed UI, and treats `pending`, `not_found`, unknown statuses, network errors, or 4xx/5xx as route-static fallback.
- If `registrationId` is absent it renders the route-static fallback immediately.

The static fallback copy itself is already aligned with the product intent in `api.md`: the pages explain that final confirmation depends on the backend webhook, not only on the browser return.

### Affected Areas

- `src/components/PaymentReturnIsland.tsx` — contains the undocumented status lookup, the `RegistrationStatus`/`PaymentStatusResponse` contracts, and the loading/confirmed/fallback state machine that exceeds `api.md`.
- `src/pages/pago/exito.astro` — unchanged by the alignment, but its `PaymentReturnIsland variant="success"` currently drives a status-aware render path.
- `src/pages/pago/error.astro` — same as above for `variant="error"`.
- `src/pages/pago/pendiente.astro` — same as above for `variant="pending"`.
- `src/lib/backend.ts` — will no longer be imported by `PaymentReturnIsland`, but remains required by `signup-slice.ts` and `tournament-slice.ts`.

### Contract Mismatch

`api.md` documents only two public endpoints:

- `GET /api/tournaments/active`
- `POST /api/registrations`

The current implementation introduces the following items that are not in the documented contract:

1. **Undocumented endpoint** — `GET /api/registrations/{registrationId}/status` does not appear in `api.md`.
2. **Undocumented response contract** — `RegistrationStatus` (`paid`, `pending`, `rejected`, `not_found`) and `PaymentStatusResponse` are defined only in the frontend.
3. **Undocumented query param** — `registrationId` is read from the URL, but `api.md` lists only `payment_id`, `status`, `merchant_order_id`, and `preference_id` as Mercado Pago return params.
4. **Frontend payment confirmation** — `api.md` Section 5 explicitly says "Frontend should not try to confirm payment itself; payment confirmation is handled by the backend webhook." The current status lookup violates that guidance.
5. **Authoritative state from backend** — although the fallback mitigates failure, the happy path treats the undocumented status endpoint as authoritative, which `api.md` does not authorize.

### Approaches

1. **Strip the backend status lookup (recommended)**
   - Remove the status fetch, the `RegistrationStatus`/`PaymentStatusResponse` types, the loading/confirmed/missing_id states, and the `registrationId` query-param parsing.
   - Render the route-static card immediately from the `variant` prop.
   - Keep the existing Spanish Argentina copy and CTAs.
   - Pros:
     - Strictly aligned with `api.md` as the source of truth.
     - Eliminates dependency on an undocumented endpoint.
     - No loading state or fetch failure paths to maintain.
     - Smaller component surface and bundle.
   - Cons:
     - Loses the optional backend-confirmed UI enhancement.
     - If `api.md` is later extended to include the status endpoint, the feature must be reintroduced.
   - Effort: Low

2. **Keep the lookup but always render fallback immediately**
   - Leave the fetch in place but start in the fallback state and never show loading or confirmed states.
   - Pros:
     - Minimal line diff.
     - Could be re-enabled later by flipping a flag.
   - Cons:
     - Still ships dead code and an undocumented network call.
     - Does not actually align behavior with `api.md`, because the frontend is still "trying to confirm payment."
   - Effort: Low

3. **Replace status lookup with sanitized Mercado Pago param display**
   - Read `payment_id`, `status`, etc. from the URL and show them as reference text, without using them to determine the outcome.
   - Pros:
     - Uses params that `api.md` actually mentions.
     - Could help support requests.
   - Cons:
     - Adds UI complexity for a use case `api.md` says is non-authoritative.
     - Does not resolve the core mismatch around the status endpoint.
   - Effort: Low

### Recommendation

Take **Approach 1**: remove the backend status lookup entirely and render the route-static copy immediately. This is the smallest change that makes the pages strictly contract-aligned with `api.md`. The fallback copy already matches the documented intent: the browser return is UX navigation only, and final confirmation belongs to the backend webhook.

The change should be limited to `src/components/PaymentReturnIsland.tsx`. The three Astro route shells and `src/lib/backend.ts` can remain unchanged.

### Safe Contract-Aligned Fallback Behavior

After alignment, the component should behave as follows:

- Mount → render the card for the current `variant` immediately.
- Success route shows the "¡Listo! Tu inscripción fue procesada" message, the email reminder, and a home CTA.
- Error route shows the "No se pudo completar el pago" message and a retry/home CTA.
- Pending route shows the "Tu pago está siendo procesado" message and a manual-refresh CTA.
- No backend request is made.
- No `registrationId` parsing.
- No loading spinner.
- Mercado Pago query params are ignored for outcome determination.

### Risks

- **Product expectation gap**: Stakeholders may have expected the backend-confirmed "Pago confirmado" / "Pago rechazado" states. Removing them means all users see the softer route-static message until the contract is updated.
- **Future re-introduction cost**: If the status endpoint is later added to `api.md`, the component will need to be re-extended. Keeping the change small and well-documented mitigates this.
- **No automated tests**: The project has no test runner, so verification relies on `pnpm build` and manual checks.

### Ready for Proposal

Yes. The scope is well understood: remove the undocumented status lookup from `PaymentReturnIsland.tsx` and rely on route-static fallback copy. The orchestrator can tell the user that the current implementation exceeds `api.md` by calling an undocumented status endpoint, and the safe fix is to make the return pages pure UX routes as the contract intends.
