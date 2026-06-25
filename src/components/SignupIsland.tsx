import { StoreProvider } from "@/store/provider";
import { SignupForm } from "./SignupForm";

export function SignupIsland() {
  return (
    <StoreProvider>
      <SignupForm />
    </StoreProvider>
  );
}
