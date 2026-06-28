# Tasks: Payment Return Pages Contract Alignment

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 180–250 |
| 800-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Simplify component + update spec + verify | Single PR | main branch; includes all phases |

## Phase 1: Component Simplification

- [x] 1.1 Remove `getApiUrl` import; delete `RegistrationStatus`, `PaymentStatusResponse`, `UIState` types, and `confirmedCopy` map from `src/components/PaymentReturnIsland.tsx`
- [x] 1.2 Delete `useEffect` block (lines 101–173): `registrationId` param parsing and `/status` fetch logic
- [x] 1.3 Remove loading render (lines 232–245) and both confirmed-state renders (lines 251–291); keep fallback (lines 295–331) as the sole render, driven entirely by `variant`
- [x] 1.4 Strip unused imports: `useEffect`, `useState`; remove `Loader2` from lucide-react; remove `loading` case from `StatusIcon` icon/color maps

## Phase 2: Main Spec Update

- [x] 2.1 Rewrite `openspec/specs/payment-return-pages/spec.md` — remove R3/R4/R5/R6/R8; update R1/R2/R7/R9 to describe UX-only presentational contract matching delta spec and `api.md`

## Phase 3: Verification

- [x] 3.1 Run `pnpm build` — confirm zero type/build errors after removing `getApiUrl` dependency
- [x] 3.2 Smoke-check `/pago/exito`, `/pago/pendiente`, `/pago/error` in dev server; verify correct static copy and CTA per variant
- [x] 3.3 Confirm signup-slice and tournament-slice still compile (they import `getApiUrl` independently — unaffected)

## Phase 4: Cleanup

- [x] 4.1 Verify no dead references to removed types across the project
