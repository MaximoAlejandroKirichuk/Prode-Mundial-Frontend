# Design: Payment Return Pages Contract Alignment

## Technical Approach

Implement the smallest contract-aligned change by turning `src/components/PaymentReturnIsland.tsx` into a pure presentational React island. The three Astro route shells keep their current SEO metadata and continue passing `variant` (`success` | `pending` | `error`). The island will immediately render the existing route-specific card for that variant and will stop reading query params or calling any backend endpoint. This matches `api.md`, which treats browser return pages as UX-only and the webhook as the source of truth.

## Architecture Decisions

| Decision | Alternatives considered | Rationale |
|---|---|---|
| Remove `registrationId` parsing and `/status` fetch from `PaymentReturnIsland` | Keep dead fetch code hidden behind fallback-first rendering; display sanitized Mercado Pago params | `api.md` documents neither `GET /api/registrations/{registrationId}/status` nor `registrationId` as a required return param. Removing the logic is the smallest strict alignment. |
| Keep the shared island + three Astro shells unchanged | Split into three separate components/pages | The current Astro-shell + shared-island pattern already matches the codebase and preserves route-specific SEO/copy with the smallest diff. |
| Preserve current Spanish Argentina variant copy and CTA behavior | Rewrite copy during alignment | Proposal scope explicitly excludes copy/SEO rework. Preserving copy avoids unnecessary review churn. |

## Data Flow

Before:

    Browser -> /pago/{variant}
    PaymentReturnIsland -> URLSearchParams
    PaymentReturnIsland -> GET /api/registrations/{id}/status
    PaymentReturnIsland -> confirmed or fallback UI

After:

    Browser -> /pago/{variant}
    Astro page -> Layout.astro + PaymentReturnIsland client:load
    PaymentReturnIsland -> variantConfigMap[variant]
    PaymentReturnIsland -> static card + CTA

No request is made from the return page. Mercado Pago query params, if present, are ignored for outcome determination.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/PaymentReturnIsland.tsx` | Modify | Delete status-response types, `useEffect`, loading/confirmed/fallback state machine, and `getApiUrl` import; keep shared card rendering driven only by `variant`. |
| `src/pages/pago/exito.astro` | Keep | No functional change; continues rendering success shell and hydrating the shared island. |
| `src/pages/pago/pendiente.astro` | Keep | No functional change; preserves pending shell and UX copy. |
| `src/pages/pago/error.astro` | Keep | No functional change; preserves error shell and UX copy. |
| `openspec/specs/payment-return-pages/spec.md` | Follow-up modify | Update capability wording to remove query intake, backend lookup, and loading requirements so spec matches implementation and `api.md`. |

## Interfaces / Contracts

```ts
type PaymentReturnVariant = "success" | "pending" | "error";

interface PaymentReturnIslandProps {
  variant: PaymentReturnVariant;
}
```

Removed from the frontend contract:

- `RegistrationStatus`
- `PaymentStatusResponse`
- implicit dependency on `GET /api/registrations/{registrationId}/status`

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | N/A | No unit runner is installed in this repo. |
| Integration | `PaymentReturnIsland` renders the expected card per variant without network/query branching | Verify by code inspection and `pnpm build`; optional manual route smoke-check in browser. |
| E2E | `/pago/exito`, `/pago/pendiente`, `/pago/error` preserve shell metadata and UX copy | Manual visit to each route after build/dev run. |

## Migration / Rollout

No migration required. This is a frontend-only simplification with no backend dependency or data change.

## Open Questions

- [ ] None blocking. Spec delta still needs to be updated alongside implementation so the documented capability matches `api.md`.
