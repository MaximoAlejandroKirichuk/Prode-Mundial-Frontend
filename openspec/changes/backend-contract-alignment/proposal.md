# Proposal: Backend Contract Alignment

## Intent

Align the landing registration flow with `api.md` so users register against the live backend contract, receive the correct Mercado Pago redirect, and avoid stale frontend-only assumptions.

## Proposal question round

- Review assumptions: one active tournament only; 404 means signup stays disabled; duplicate paid registrations remain blocked by backend.
- Open product question: should the landing show a generic outage message or a tournament-specific message for `503`?
- Open UX question: should the email continuity reminder live inside the form or below the submit button?

## Scope

### In Scope
- Fetch `GET /api/tournaments/active` on hydration and use its `tournamentId`, name, price, and currency.
- Submit `POST /api/registrations` with `{ name, email, tournamentId }` and redirect with `paymentUrl` instead of `init_point`.
- Add `.env.example` with `PUBLIC_BACKEND_REGISTRATION_URL`, typed env support, verification commands, remaining gaps report, and exact manual tests.

### Out of Scope
- Backend contract changes, webhook/payment confirmation, or admin tournament management.
- New post-payment UX beyond existing redirect behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `landing-page`: registration CTA behavior changes from local signup assumptions to backend-driven tournament fetch + registration redirect contract.

## Approach

Keep Astro as shell and separate concerns in Redux: add an active-tournament slice, keep registration POST in the signup slice, hydrate the fetch from `SignupIsland`, surface contract-aware loading/error states, and preserve Spanish UX copy.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/store/tournament-slice.ts` | New | Active tournament fetch/state |
| `src/store/signup-slice.ts` | Modified | `/api/registrations`, `paymentUrl`, error mapping |
| `src/components/SignupForm.tsx` | Modified | Tournament-aware submit/redirect UX |
| `src/components/SignupIsland.tsx` | Modified | Dispatch active tournament load |
| `.env.example`, `src/env.d.ts` | New | Backend URL documentation and typing |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CORS or backend outage blocks signup | Med | Validate against deployed backend; show explicit unavailable state |
| 404/no active tournament confuses users | Med | Disable submit and show clear empty-state copy |

## Rollback Plan

Revert the new tournament slice, restore previous signup endpoint/redirect field, remove env additions, and redeploy the prior landing flow.

## Dependencies

- Backend must expose `GET /api/tournaments/active` and `POST /api/registrations` with current CORS settings.

## Success Criteria

- [ ] `pnpm astro check` and `pnpm build` pass after contract alignment.
- [ ] Proposal consumers can verify exact manual tests: 200 active tournament, 404 no tournament, 201 redirect via `paymentUrl`, 409 duplicate paid email, 422 invalid/missing data, 503 provider unavailable, plus a remaining-gaps report for unresolved backend/frontend mismatches.
