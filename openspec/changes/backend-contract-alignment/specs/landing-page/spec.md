# Delta for Landing Page

## MODIFIED Requirements

### Requirement: Signup CTA Contract Alignment
(Previously: "Signup CTA Preservation")

The system MUST fetch the active tournament via `GET /api/tournaments/active` on hydration and MUST post registrations to `POST /api/registrations` with the contract payload `{ name, email, tournamentId }`. On 201, the system MUST redirect to `response.paymentUrl`. Local client-side validation (name required, email format, email confirmation match) MUST be preserved. The backend base URL MUST be read from `PUBLIC_BACKEND_REGISTRATION_URL`.

#### Scenario: Valid signup redirects to paymentUrl
- GIVEN active tournament loaded with `tournamentId`
- AND name, email, and confirmation are valid
- WHEN user submits form
- THEN system POSTs `{ name, email, tournamentId }` to `/api/registrations`
- AND on 201, redirects to `response.paymentUrl`

#### Scenario: Existing checkout reused (isExisting:true)
- GIVEN registration returns `isExisting: true` with 201
- WHEN response arrives
- THEN system redirects to `paymentUrl` (same behavior as new registration)

#### Scenario: Submit blocked during tournament load
- GIVEN tournament fetch is in progress
- WHEN user attempts to submit
- THEN submit button is disabled with loading indicator

## ADDED Requirements

### Requirement: Active Tournament Fetch on Hydration
| # | Condition | Behavior |
|---|-----------|----------|
| R10a | Island hydrates, fetch returns 200 | Store `tournamentId`, `name`, `priceAmount`, `currency` in Redux; enable submit |
| R10b | Fetch network error | Show "servicio no disponible", disable submit |
| R10c | Fetch pending | Show loading state, disable submit |

#### Scenario: Successful tournament load
- GIVEN `SignupIsland` hydrates
- WHEN `GET /api/tournaments/active` returns 200
- THEN `tournamentId`, `name`, `priceAmount`, `currency` stored in Redux
- AND submit button is enabled

#### Scenario: Tournament fetch fails (network)
- GIVEN backend unreachable
- WHEN `GET /api/tournaments/active` rejects
- THEN submit stays disabled, error message displayed

### Requirement: No-Active-Tournament State

When `GET /api/tournaments/active` returns 404, the system MUST disable submit and MUST display "No hay torneo activo en este momento." Tournament-dependent UI (price, name) MUST be hidden.

#### Scenario: 404 from active tournament endpoint
- GIVEN fetch returns 404 with no body
- WHEN state updates
- THEN submit disabled; message displayed; price hidden

### Requirement: Registration Error Mapping

| Status | Condition | Spanish Message |
|--------|-----------|-----------------|
| 409 | Duplicate paid registration | "Ya existe una inscripción paga para este torneo con ese email." |
| 422 | Validation or tournament invalid | "Revisá los datos ingresados o el torneo seleccionado." |
| 503 | Payment provider unavailable | "El servicio de pagos no está disponible. Intentá de nuevo en unos minutos." |
| other | Unknown server error | "Ocurrió un error. Intentá de nuevo en unos minutos." |

Error messages MUST surface via `serverError` in Redux. The submit button MUST re-enable after every error response.

#### Scenario: 409 duplicate blocks re-submission
- GIVEN existing paid registration for same email+tournament
- WHEN POST `/api/registrations` returns 409
- THEN system displays 409-specific message and re-enables submit

#### Scenario: 503 Mercado Pago unavailable
- GIVEN payment provider is temporarily down
- WHEN POST returns 503
- THEN system displays 503 message and allows retry
