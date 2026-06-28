# Design: Backend Contract Alignment

## Technical Approach

Keep Astro as the static shell and move contract-aware behavior into the hydrated signup island. On mount, the island will fetch `GET /api/tournaments/active` from the backend base URL defined by `PUBLIC_BACKEND_REGISTRATION_URL`. The form will read tournament state from Redux, submit `POST /api/registrations` with `{ name, email, tournamentId }`, and redirect with `paymentUrl`. This follows the proposal’s split: one slice for active-tournament state, one slice for registration submission.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|---|---|---|---|
| Tournament state ownership | Extend `signup-slice` / new slice | New `src/store/tournament-slice.ts` | Fetching tournament metadata is a separate resource from posting a registration; keeping slices separate matches the current Redux Toolkit pattern and avoids mixing read and write concerns. |
| Backend URL access | Inline env usage / shared helper | Shared `src/lib/backend.ts` helper | Both thunks need the same base URL normalization and missing-env guard; one helper avoids duplicated `replace(/\/$/, "")` and prevents `undefined/api/...` requests. |
| Email continuity reminder placement | Page copy only / inline form helper | Inline helper under the CTA | The backend contract ties access to the registration email; putting the reminder inside the form keeps it visible at the commitment point. |

## Data Flow

```text
Browser hydrates SignupIsland
  -> useEffect dispatches fetchActiveTournament()
  -> tournament-slice GET {BASE}/api/tournaments/active
     -> 200: store tournamentId, name, priceAmount, currency
     -> 404: store unavailable-empty state, keep submit disabled
     -> 5xx/network/misconfig: store outage state, keep submit disabled

User submits form
  -> SignupForm validates name/email/confirmEmail
  -> dispatch submitSignup({ name, email, tournamentId })
  -> signup-slice POST {BASE}/api/registrations
  -> 201: read paymentUrl, redirect browser
  -> 409/422/503/500: map ProblemDetails to Spanish inline error
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/store/tournament-slice.ts` | Create | Active tournament thunk, typed state, 404 vs outage handling. |
| `src/lib/backend.ts` | Create | Normalize `PUBLIC_BACKEND_REGISTRATION_URL`, build absolute endpoint URLs, fail fast when env is missing. |
| `src/store/signup-slice.ts` | Modify | Send `tournamentId`, consume `paymentUrl`, parse `ProblemDetails`, preserve submit lock until redirect/error. |
| `src/store/index.ts` | Modify | Register `tournament` reducer. |
| `src/components/SignupIsland.tsx` | Modify | Add an inner hydrated component that dispatches `fetchActiveTournament()` on mount. |
| `src/components/SignupForm.tsx` | Modify | Read tournament state, render loading/empty/error states, show tournament price/name and same-email helper, disable submit when tournament is unavailable. |
| `src/pages/index.astro` | Modify | Align nearby signup copy/FAQ text with backend-driven tournament and Mercado Pago redirect wording if needed. |
| `.env.example` | Create | Document `PUBLIC_BACKEND_REGISTRATION_URL`. |
| `src/env.d.ts` | Create | Type `ImportMetaEnv.PUBLIC_BACKEND_REGISTRATION_URL`. |

## Interfaces / Contracts

```ts
type ActiveTournament = {
  tournamentId: string;
  name: string;
  priceAmount: number;
  currency: string;
};

type RegistrationRequest = {
  name: string;
  email: string;
  tournamentId: string;
};

type RegistrationResponse = {
  registrationId: string;
  paymentUrl: string;
  isExisting: boolean;
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  status?: number;
};
```

Payload mapping: `priceAmount` stays numeric in state and is formatted in the form UI with `Intl.NumberFormat("es-AR", { style: "currency", currency })`. Redirect logic MUST use `paymentUrl`, never `init_point`.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Slice reducers, error mapping, backend URL helper | Add focused tests later if Vitest is introduced; not available today. |
| Integration | Hydration fetch -> disabled/enabled submit flow | Use `pnpm astro check` plus manual browser verification against the backend. |
| E2E | Success redirect and 404/409/422/503 states | Manual matrix from the proposal; no E2E runner is installed. |

## Migration / Rollout

No data migration required. Roll out with the backend URL configured in each environment before deploy; if the env is absent or CORS is blocked, the form remains visible but non-submittable with an explicit unavailable message.

## Open Questions

- [ ] For backend `503`, should the user see a generic outage message or a tournament-specific message?
- [ ] Should duplicate-paid (`409`) copy mention contacting support, or only explain that the email is already registered?
