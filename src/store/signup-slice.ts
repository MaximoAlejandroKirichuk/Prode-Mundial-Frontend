import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiUrl } from "@/lib/backend";

interface SignupState {
  isSubmitting: boolean;
  serverError: string | null;
  paymentUrl: string | null;
}

const initialState: SignupState = {
  isSubmitting: false,
  serverError: null,
  paymentUrl: null,
};

interface SubmitSignupPayload {
  name: string;
  email: string;
  tournamentId: string;
}

interface RegistrationError {
  title?: string;
  detail?: string;
  status?: number;
}

/** Map an HTTP status (and optional ProblemDetails body) to a Spanish error message. */
function errorMessageForStatus(
  status: number,
  body?: RegistrationError
): string {
  if (status === 409) {
    return "Ya existe una inscripción paga para este torneo con ese email.";
  }
  if (status === 422) {
    return "Revisá los datos ingresados o el torneo seleccionado.";
  }
  if (status === 503) {
    return "El servicio de pagos no está disponible. Intentá de nuevo en unos minutos.";
  }
  // Prefer the detail from the body if available, otherwise generic message.
  return body?.detail ?? "Ocurrió un error. Intentá de nuevo en unos minutos.";
}

export const submitSignup = createAsyncThunk(
  "signup/submit",
  async (payload: SubmitSignupPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(getApiUrl("/api/registrations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let body: RegistrationError | undefined;
        try {
          body = await response.json();
        } catch {
          // Response had no parseable JSON body — fall back to status-only mapping.
        }
        return rejectWithValue(errorMessageForStatus(response.status, body));
      }

      const data = (await response.json()) as { paymentUrl: string };
      return data.paymentUrl;
    } catch {
      return rejectWithValue(
        "Ocurrió un error. Intentá de nuevo en unos minutos."
      );
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    clearServerError(state) {
      state.serverError = null;
    },
    resetSignup() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSignup.pending, (state) => {
        state.isSubmitting = true;
        state.serverError = null;
        state.paymentUrl = null;
      })
      .addCase(submitSignup.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.paymentUrl = action.payload;
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.serverError = (action.payload as string) ?? null;
      });
  },
});

export const { clearServerError, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
