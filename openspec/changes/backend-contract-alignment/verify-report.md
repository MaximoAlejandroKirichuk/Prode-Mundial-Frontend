## Verification Report

**Change**: backend-contract-alignment
**Version**: N/A
**Mode**: Standard

### Completeness
| Metric | Value |
|--------|-------|
| Tasks total | 11 |
| Tasks complete | 10 |
| Tasks incomplete | 1 |

Incomplete: 4.2 — Manual browser verification matrix (deferred to this verify phase).

### Build & Tests Execution

**Build (`pnpm build`)**: ✅ Passed
```text
[vite] ✓ built in 370ms
[vite] ✓ built in 186ms
generating static routes → /index.html (+979ms)
✓ Completed in 1.69s
1 page(s) built in 1.81s
Complete!
```

**Type Check (`pnpm astro check`)**: ✅ Passed (0 errors, 0 warnings, 1 pre-existing hint)
```text
src/components/SignupForm.tsx:69:40 - warning ts(6385): 'FormEvent' is deprecated.
Result (25 files): 0 errors, 0 warnings, 1 hint
```

**Tests**: ⚠️ No automated test suite exists. No Vitest/Jest configured.
**Coverage**: ➖ Not available (no test runner)

### Spec Compliance Matrix

| Requirement | Scenario | Static Evidence | Result |
|-------------|----------|-----------------|--------|
| Signup CTA Contract Alignment | Valid signup redirects to paymentUrl | `signup-slice.ts:50-67` POSTs `{name,email,tournamentId}` to `/api/registrations`, extracts `paymentUrl`; `SignupForm.tsx:94-95` redirects via `window.location.href` | ❌ UNTESTED |
| Signup CTA Contract Alignment | Existing checkout reused (isExisting:true) | `signup-slice.ts:66-67` extracts `paymentUrl` from any 2xx — `isExisting` field is present but not branched on; redirect is identical | ❌ UNTESTED |
| Signup CTA Contract Alignment | Submit blocked during tournament load | `SignupForm.tsx:103-108` `submitDisabled` includes `tournamentLoading`; button shows `<Loader2>` spinner at lines 246-249 | ❌ UNTESTED |
| Active Tournament Fetch on Hydration | Successful tournament load (200) | `tournament-slice.ts:29-47` fetches `/api/tournaments/active`, stores `tournamentId,name,priceAmount,currency`; `SignupForm.tsx:107-108` enables submit when not loading/unavailable | ❌ UNTESTED |
| Active Tournament Fetch on Hydration | Tournament fetch fails (network) | `tournament-slice.ts:48-54` catches network error, returns "El servicio no está disponible…"; `SignupForm.tsx:147-155` renders `failed` alert; submit stays disabled | ❌ UNTESTED |
| No-Active-Tournament State | 404 from active tournament endpoint | `tournament-slice.ts:31-36` returns 404 with "No hay torneo activo en este momento."; `SignupForm.tsx:137-145` renders `not_found` alert; tournament info card hidden (tournament is null); submit disabled | ❌ UNTESTED |
| Registration Error Mapping | 409 duplicate blocks re-submission | `signup-slice.ts:33-34` maps 409 → "Ya existe una inscripción paga…"; `signup-slice.ts:98-100` sets `isSubmitting=false` (re-enables); `SignupForm.tsx:226-233` renders `serverError` | ❌ UNTESTED |
| Registration Error Mapping | 422 validation error | `signup-slice.ts:36-37` maps 422 → "Revisá los datos ingresados…"; submit re-enabled via `isSubmitting=false` | ❌ UNTESTED |
| Registration Error Mapping | 503 Mercado Pago unavailable | `signup-slice.ts:39-40` maps 503 → "El servicio de pagos no está disponible…"; submit re-enabled | ❌ UNTESTED |
| Registration Error Mapping | Other/unknown error | `signup-slice.ts:43` falls back to `body.detail` or generic "Ocurrió un error…"; submit re-enabled | ❌ UNTESTED |

**Compliance summary**: 0/10 scenarios have runtime covering tests (no test suite exists). All 10 scenarios have correct static code paths traced through implementation.

### Correctness (Static Evidence)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Backend URL from `PUBLIC_BACKEND_REGISTRATION_URL` | ✅ Implemented | `backend.ts:1-11` reads env, normalizes trailing slashes, throws on missing |
| `GET /api/tournaments/active` on hydration | ✅ Implemented | `SignupIsland.tsx:15-17` dispatches `fetchActiveTournament()` in `useEffect` |
| Tournament state in Redux (tournamentId, name, priceAmount, currency) | ✅ Implemented | `tournament-slice.ts:5-10` typed `ActiveTournament` interface matches spec |
| POST `/api/registrations` with `{name, email, tournamentId}` | ✅ Implemented | `signup-slice.ts:46-54` sends exact payload shape |
| Redirect to `paymentUrl` on 201 | ✅ Implemented | `signup-slice.ts:66-67` extracts paymentUrl; `SignupForm.tsx:94-95` does `window.location.href` |
| Local validation preserved (name, email format, confirm match) | ✅ Implemented | `SignupForm.tsx:39-58` validates all three |
| Error mapping 409/422/503/other → Spanish messages | ✅ Implemented | `signup-slice.ts:29-44` exact messages match spec |
| `serverError` in Redux for error display | ✅ Implemented | `signup-slice.ts:100` sets `serverError`; `SignupForm.tsx:226-233` renders it |
| Submit re-enables after error | ✅ Implemented | `signup-slice.ts:99` sets `isSubmitting=false` on rejected |
| 404 tournament state: message + disable + hide price | ✅ Implemented | `tournament-slice.ts:31-36`; `SignupForm.tsx:105-108,137-145` |
| Network error state: "servicio no disponible" + disable | ✅ Implemented | `tournament-slice.ts:48-54`; `SignupForm.tsx:147-155` |
| Loading state: spinner + disable | ✅ Implemented | `SignupForm.tsx:127-135,246-249` |
| Email continuity helper | ✅ Implemented | `SignupForm.tsx:257-262` shown when tournament loaded |
| Price display with currency formatting | ✅ Implemented | `SignupForm.tsx:111-116` uses `Intl.NumberFormat` |

### Coherence (Design)

| Decision | Followed? | Notes |
|----------|-----------|-------|
| Separate tournament-slice (not extending signup-slice) | ✅ Yes | `src/store/tournament-slice.ts` created as independent slice |
| Shared `src/lib/backend.ts` helper | ✅ Yes | Both thunks import `getApiUrl()` |
| Email continuity reminder inline in form | ✅ Yes | `SignupForm.tsx:257-262` |
| `ActiveTournament` type matches design contract | ✅ Yes | `{tournamentId, name, priceAmount, currency}` |
| `RegistrationRequest` payload matches design | ✅ Yes | `{name, email, tournamentId}` |
| Redirect uses `paymentUrl` never `init_point` | ✅ Yes | `signup-slice.ts:66` reads `paymentUrl` |
| `priceAmount` formatted via `Intl.NumberFormat` | ✅ Yes | `SignupForm.tsx:112-116` |
| File changes match design file table | ✅ Yes | All 9 files accounted for |

### Issues Found

**CRITICAL**: None

**WARNING**:
1. **Task 4.2 incomplete — manual browser verification not executed.** The manual matrix (200/404/409/422/503/network) has not been run against a live backend. All spec scenarios remain UNTESTED at runtime. Static code analysis shows correct implementation paths, but no automated or manual runtime evidence exists.
2. **No automated test suite.** Project has no Vitest/Jest configured. Design acknowledged this and planned for manual verification. This is a project-level gap, not a change-level defect.

**SUGGESTION**:
1. `FormEvent` deprecation hint in `SignupForm.tsx:69` — consider migrating to `React.FormEvent` or the newer type alias when convenient (pre-existing, not introduced by this change).
2. Consider adding a Vitest setup with unit tests for `errorMessageForStatus()` and `getApiUrl()` — these are pure functions that are easy to test and would prevent regressions.

### Verdict

**PASS WITH WARNINGS**

All 10 implementation tasks are complete. Build and type-check pass cleanly. Static code analysis traces every spec scenario to a correct implementation path. Design decisions are fully followed. The single remaining task (4.2 — manual browser verification) and all 10 spec scenarios lack runtime test evidence because no automated test suite exists and manual verification against a live backend has not been performed. This is a known project-level limitation acknowledged in the design document.

### Manual Tests Still Needed

| # | Scenario | How to Test | Expected Result |
|---|----------|-------------|-----------------|
| M1 | Tournament 200 | Start backend with active tournament, load page | Tournament name + price shown, submit enabled |
| M2 | Tournament 404 | Start backend with no active tournament | "No hay torneo activo…" shown, submit disabled, price hidden |
| M3 | Network error | Start dev server WITHOUT backend running | "El servicio no está disponible…" shown, submit disabled |
| M4 | Valid signup → 201 | Fill form with valid data, backend returns 201 + paymentUrl | Browser redirects to paymentUrl |
| M5 | Duplicate → 409 | Submit with email that already has paid registration | "Ya existe una inscripción paga…" shown, submit re-enabled |
| M6 | Validation error → 422 | Submit with invalid data that passes client validation but fails server | "Revisá los datos ingresados…" shown, submit re-enabled |
| M7 | Payment down → 503 | Backend returns 503 during registration | "El servicio de pagos no está disponible…" shown, submit re-enabled |
| M8 | isExisting:true → 201 | Backend returns existing checkout with paymentUrl | Browser redirects to paymentUrl (same as M4) |
