# Tasks: Backend Contract Alignment

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~300-350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Create `src/lib/backend.ts` — normalize PUBLIC_BACKEND_REGISTRATION_URL, build absolute endpoint URLs, fail fast when env is missing
- [x] 1.2 Create `src/store/tournament-slice.ts` — fetchActiveTournament thunk, typed state including 404 vs outage handling
- [x] 1.3 Modify `src/store/index.ts` — import and register tournament reducer
- [x] 1.4 Create `src/env.d.ts` — type ImportMetaEnv.PUBLIC_BACKEND_REGISTRATION_URL
- [x] 1.5 Create `.env.example` — document PUBLIC_BACKEND_REGISTRATION_URL

## Phase 2: Core Logic

- [x] 2.1 Modify `src/store/signup-slice.ts` — POST /api/registrations via backend.ts, include tournamentId in payload, read paymentUrl on 201, map ProblemDetails per spec (409/422/503/other)
- [x] 2.2 Modify `src/components/SignupIsland.tsx` — add inner component that dispatches fetchActiveTournament() on mount via useEffect
- [x] 2.3 Modify `src/components/SignupForm.tsx` — read tournament state, render loading/empty/error states, show price/name, disable submit when tournament unavailable, redirect via paymentUrl, render email-continuity helper

## Phase 3: Polish

- [x] 3.1 Modify `src/pages/index.astro` — update FAQ and hero copy for backend-driven tournament + Mercado Pago redirect flow

## Phase 4: Verify

- [x] 4.1 Run `pnpm build` and `pnpm astro check` — fix any type or build errors
- [ ] 4.2 Manual browser verification matrix: 200 (tournament loaded, submit enabled), 404 (no tournament message, submit disabled), 409 (duplicate error), 422 (validation error), 503 (payment error), network error (service unavailable)
