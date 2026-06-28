## Exploration: Backend contract alignment for registration flow

### Current State

The landing page only wires the signup form to a stale, frontend-local endpoint:

- `src/store/signup-slice.ts` posts to `/api/signup`.
- It expects the response field `init_point` and returns it.
- `src/components/SignupForm.tsx` redirects to `result.payload.init_point`.
- No active tournament is fetched, so `tournamentId` is never collected or sent.
- No `.env.example` exists; the only env file is the git-ignored `.env`.

The real backend contract in `api.md` is:

- `GET /api/tournaments/active` returns `{ tournamentId, name, priceAmount, currency }`.
- `POST /api/registrations` expects `{ name, email, tournamentId }`.
- On success it returns `{ registrationId, paymentUrl, isExisting }`; the frontend must redirect to `paymentUrl`.
- Errors are `ProblemDetails` with status codes `400`, `422`, `409`, `503`, `500`.

### Affected Areas

- `src/store/signup-slice.ts` — endpoint, payload shape, response shape, and error mapping are all wrong.
- `src/components/SignupForm.tsx` — reads `init_point` from the fulfilled payload; must read `paymentUrl`.
- `src/components/SignupIsland.tsx` — best place to trigger the active-tournament fetch on hydration.
- `.env.example` — missing; must document `PUBLIC_BACKEND_REGISTRATION_URL`.
- `src/env.d.ts` — does not exist; Astro public env vars will work at runtime but TypeScript will complain without `ImportMetaEnv` types.
- `src/components/landing/SignupSkeleton.astro` — may need to keep showing while the tournament loads, not only while React hydrates.

### Approaches

1. **Extend the existing `signup` slice with a tournament thunk** — add `fetchActiveTournament` and `tournamentId`/`tournament` state to `signup-slice.ts`; `SignupIsland` dispatches the fetch on mount.
   - Pros: Minimal file changes; keeps all registration state in one place; matches the current Redux pattern.
   - Cons: The signup slice grows into a mixed registration+tournament concern; harder to reuse tournament data elsewhere later.
   - Effort: Low

2. **Add a dedicated `tournament` slice and keep signup pure** — create `src/store/tournament-slice.ts` for the active tournament; `SignupIsland` dispatches both slices; `SignupForm` reads `tournamentId` from the tournament slice.
   - Pros: Cleaner separation; tournament state is reusable for future pages/components.
   - Cons: Slightly more boilerplate for a one-page app.
   - Effort: Low

### Recommendation

Use **Approach 2** — a small `tournament` slice plus a corrected `signup` slice. The contract alignment is about two distinct resources (tournament vs registration), and separating them matches Redux Toolkit conventions and keeps the signup thunk focused on the POST.

Concrete implementation plan:

1. Create `.env.example` with `PUBLIC_BACKEND_REGISTRATION_URL=https://<backend-host>`.
2. Add `src/env.d.ts` declaring `ImportMetaEnv.PUBLIC_BACKEND_REGISTRATION_URL`.
3. Add `src/store/tournament-slice.ts`:
   - `fetchActiveTournament` thunk that calls `GET ${import.meta.env.PUBLIC_BACKEND_REGISTRATION_URL}/api/tournaments/active`.
   - State: `tournament`, `isLoading`, `error`, `hasLoaded`.
   - Handle `404` by storing a clear "no active tournament" error.
4. Update `src/store/signup-slice.ts`:
   - Change endpoint to `${import.meta.env.PUBLIC_BACKEND_REGISTRATION_URL}/api/registrations`.
   - Accept `tournamentId` in `SubmitSignupPayload` and include it in the body.
   - Parse `paymentUrl` from the response (drop `init_point`).
   - Map backend `ProblemDetails` to user-facing Spanish messages for `409`, `422`, `503`, and fallback.
5. Update `src/components/SignupForm.tsx`:
   - Read `paymentUrl` from the fulfilled payload.
   - Show the tournament info and disable submission while the tournament is loading or missing.
6. Update `src/components/SignupIsland.tsx` to dispatch `fetchActiveTournament` inside `StoreProvider`.
7. Verification: `pnpm astro check`, `pnpm build`, and a manual dev smoke test against the backend.

### Risks

- **CORS**: the frontend will call the backend directly from the browser; the backend must allow the frontend origin.
- **Static Astro output**: `GET /api/tournaments/active` cannot be fetched at build/SSR time (the project uses Astro's default static output), so the page must handle the loading state client-side.
- **Environment drift**: without `.env.example`, new environments may miss `PUBLIC_BACKEND_REGISTRATION_URL`; adding the example file fixes documentation but does not enforce it at runtime.
- **ProblemDetails shape**: the error parser must be defensive (`detail`, `title`, or a string fallback) because backend error payloads are not fully typed in the frontend yet.
- **Duplicate pending registrations**: the backend deduplicates within 5 minutes, but the frontend should still keep the submit button disabled until the redirect to avoid double submissions.

### Ready for Proposal

Yes. The contract mismatch is clear, the affected files are small, and the implementation path is straightforward. The orchestrator can move to `sdd-propose` with scope limited to the registration flow alignment described above.
