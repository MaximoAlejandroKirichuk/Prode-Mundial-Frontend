## Exploration: payment-return-pages

### Current State

The registration flow now works end-to-end from the landing page to Mercado Pago:

- `src/components/SignupForm.tsx` posts to `POST /api/registrations` and receives `{ registrationId, paymentUrl, isExisting }`.
- It redirects the browser to `paymentUrl`.
- `src/store/tournament-slice.ts` already loads the active tournament and `src/lib/backend.ts` centralizes the backend base URL.
- There are no return routes yet, and no component that reads Mercado Pago query parameters or queries a payment status endpoint.
- The project uses Astro's default static output, so query parameters are only available at runtime in the browser.

The backend will add `back_urls` and `auto_return` to the Mercado Pago preference and expose an endpoint to retrieve the final status of a registration using `registrationId` as the internal key.

### Affected Areas

- `src/pages/pago/exito.astro` — new success return route (SEO shell + React island).
- `src/pages/pago/error.astro` — new error/rejected return route.
- `src/pages/pago/pendiente.astro` — new in-process/pending return route.
- `src/components/PaymentReturnIsland.tsx` — new React island to parse query params, fetch status, and render the right state.
- `src/lib/backend.ts` — reuse `getApiUrl()` for the status endpoint; no new env var needed.
- `src/components/ui/card.tsx`, `src/components/ui/button.tsx` — reuse existing shadcn primitives for the status card.
- Backend contract — must include `registrationId` in the `back_url` query string and expose a status endpoint.

### Approaches

1. **Static Astro pages with inline scripts**
   - Pros: No new dependencies, no JS bundle, works without React.
   - Cons: Hard to parse query params and update the DOM safely; cannot call the backend status endpoint in a typed way; inconsistent with the existing island + shadcn architecture.
   - Effort: Low

2. **Astro pages + shared React island with local state**
   - Pros: Matches the current Astro-shell / React-island pattern; reads `window.location.search` after hydration; can fetch and optionally poll the backend status endpoint; easy stub/fallback while the endpoint is missing; reuses `Card`, `Button`, and existing styling.
   - Cons: Requires JavaScript on the return pages (acceptable because users arrive from Mercado Pago after an interactive checkout); static prerender cannot personalize content server-side.
   - Effort: Low

3. **Astro pages + new Redux slice for payment status**
   - Pros: Consistent with the global Redux Toolkit pattern if status state needs to be reused elsewhere later.
   - Cons: Overkill for three read-only pages; adds a slice, store registration, and thunk boilerplate for a transient concern.
   - Effort: Medium

### Recommendation

Use **Approach 2**: three Astro routes that share a single `PaymentReturnIsland` React component.

Concrete implementation plan:

1. Create `src/pages/pago/exito.astro`, `src/pages/pago/error.astro`, and `src/pages/pago/pendiente.astro`.
   - Each page uses `Layout.astro` with Spanish SEO metadata and renders `<PaymentReturnIsland variant="success|error|pending" client:load />`.
2. Create `src/components/PaymentReturnIsland.tsx`.
   - Read `registrationId` from `URLSearchParams` on mount.
   - Call `GET ${BASE}/api/registrations/{registrationId}/status`.
   - Render `loading`, `success`, `pending`, `rejected/not_found`, and `missing registrationId` states.
   - On any fetch failure (`404`, `5xx`, network error), fall back to the route-based static message so the pages are safe to ship before the backend endpoint exists.
3. Keep state local to the island; do **not** add a Redux slice for this phase.
4. Reuse `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `Button` from `src/components/ui`.
5. Keep copy in Spanish for Argentina, aligned with the landing FAQ:
   - `/pago/exito`: "¡Listo! Tu inscripción fue procesada. En los próximos minutos recibís el acceso en el mismo email con el que te registraste."
   - `/pago/pendiente`: "Tu pago está siendo procesado. Si elegiste pagar en efectivo, acreditá en el local y volvé en un rato."
   - `/pago/error`: "No se pudo completar el pago. Volvé a intentarlo o escribinos a oficialprodelito@gmail.com."
6. Proposed backend contract for the status endpoint:
   - `GET /api/registrations/{registrationId}/status`
   - Response: `{ "status": "paid" | "pending" | "rejected" | "not_found", "updatedAt"?: string }`
   - The frontend treats the backend response as the only authoritative source; MP query params (`collection_status`, `payment_id`, etc.) are ignored for decision-making.

What can be stubbed safely now:
- The status fetch itself: any failure falls back to the route-based message.
- Polling on the pending page: replaced by a static message + manual refresh / support contact.
- Auto-redirect or deep "enter the app" CTAs: not needed until the access app exists.

### Risks

- **Backend must pass `registrationId` in `back_url` query params**; otherwise the frontend cannot look up the registration status. This needs explicit backend contract alignment.
- **CORS**: the status endpoint will be called from the browser; the backend must allow the frontend origin.
- **Status endpoint contract is undefined**: path and response shape must be agreed before implementation.
- **Static Astro output** means query params are client-only; SEO metadata on these pages is generic.
- **Mercado Pago `auto_return`** only automatically redirects on approved payments; for pending/error the user must click the return button, so the `back_url` for each state must be configured.
- **Stub fallback on `/pago/exito`** may show success before the webhook has processed the payment; copy must set the correct expectation (email may take a few minutes).
- **No automated tests** exist; verification will rely on `pnpm build` and a manual query-param matrix.

### Ready for Proposal

Yes. The scope is limited to three new static routes and one small React island with a stubbed status fetch. The orchestrator can move to `sdd-propose` and should tell the user that the backend needs to:
1. Configure Mercado Pago `back_urls` pointing to `/pago/exito`, `/pago/error`, and `/pago/pendiente` with `registrationId` as a query parameter.
2. Expose `GET /api/registrations/{registrationId}/status` returning `{ status: "paid" | "pending" | "rejected" | "not_found" }`.
