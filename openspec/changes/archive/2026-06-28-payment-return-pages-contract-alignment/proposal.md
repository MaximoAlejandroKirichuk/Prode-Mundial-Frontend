# Proposal: Payment Return Pages Contract Alignment

## Intent

Align payment return pages with `api.md` as the source of truth. Remove undocumented frontend payment-status confirmation so `/pago/exito`, `/pago/error`, and `/pago/pendiente` stay browser-return UX routes while the backend webhook remains authoritative.

## Scope

### In Scope
- Simplify `PaymentReturnIsland` to render route-static UI from `variant` only.
- Remove undocumented `registrationId` parsing, status types, fetch flow, and loading state.
- Preserve existing Spanish Argentina copy, route CTAs, and Astro route shells.

### Out of Scope
- Adding new backend endpoints or extending `api.md`.
- Reworking page copy, SEO strategy, or signup/payment initiation flows.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `payment-return-pages`: remove spec-level requirements for query-param intake, backend status lookup, and loading; keep return pages as non-authoritative UX-only routes.

## Approach

Refactor `src/components/PaymentReturnIsland.tsx` into a pure presentational island. Each route keeps passing `variant`, and the island immediately renders the corresponding static card without backend calls or Mercado Pago param-based branching.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/PaymentReturnIsland.tsx` | Modified | Remove undocumented fetch/state machine; render static variant content only |
| `openspec/specs/payment-return-pages/spec.md` | Modified | Update contract from backend-assisted return states to UX-only routes |
| `api.md` | Referenced | Remains source of truth; no file change required |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stakeholders miss backend-confirmed states | Med | Document deliberate contract alignment in spec/design/apply artifacts |
| Future status endpoint returns | Low | Keep component small so confirmed-state logic can be reintroduced from a documented contract |

## Rollback Plan

Revert the `PaymentReturnIsland.tsx` simplification and restore the prior spec only if `api.md` is updated to document a status endpoint and authoritative frontend behavior.

## Dependencies

- Existing `api.md` guidance for payment return behavior
- Existing `payment-return-pages` capability spec

## Success Criteria

- [ ] Return pages make no backend status request.
- [ ] URL params do not influence displayed outcome.
- [ ] Existing route copy and CTAs still render correctly per variant.
- [ ] Spec and implementation both describe the pages as UX-only browser-return routes.
