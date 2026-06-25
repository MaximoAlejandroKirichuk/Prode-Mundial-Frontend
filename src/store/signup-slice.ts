import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
}

export const submitSignup = createAsyncThunk(
  "signup/submit",
  async (payload: SubmitSignupPayload, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(
          data.message || "Ocurrió un error. Intentá de nuevo en unos minutos."
        );
      }

      const { init_point } = (await response.json()) as { init_point: string };
      return { init_point };
    } catch {
      return rejectWithValue(
        "El servicio de pagos no está disponible. Intentá de nuevo en unos minutos."
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
        state.paymentUrl = action.payload.init_point;
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.serverError = (action.payload as string) ?? null;
      });
  },
});

export const { clearServerError, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
