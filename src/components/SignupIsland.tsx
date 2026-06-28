import { useEffect } from "react";
import { StoreProvider } from "@/store/provider";
import { SignupForm } from "./SignupForm";
import { useAppDispatch } from "@/store";
import { fetchActiveTournament } from "@/store/tournament-slice";

/**
 * Inner component that lives inside the Redux Provider.
 * Dispatches fetchActiveTournament() on mount so tournament data
 * is available before the user submits the form.
 */
function HydratedIsland() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActiveTournament());
  }, [dispatch]);

  return <SignupForm />;
}

/**
 * Top-level island wrapper.
 * Astro hydrates this with client:load; the StoreProvider wraps
 * the hydrated subtree so Redux hooks work inside HydratedIsland.
 */
export function SignupIsland() {
  return (
    <StoreProvider>
      <HydratedIsland />
    </StoreProvider>
  );
}
