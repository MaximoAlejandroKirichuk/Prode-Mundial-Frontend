import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiUrl } from "@/lib/backend";
import type { RootState } from "./index";

export interface ActiveTournament {
  tournamentId: string;
  name: string;
  priceAmount: number;
  currency: string;
}

interface TournamentState {
  tournament: ActiveTournament | null;
  /** idle = not yet fetched, loading = in-flight, succeeded = loaded, not_found = 404, failed = network/5xx/misconfig */
  status: "idle" | "loading" | "succeeded" | "not_found" | "failed";
  error: string | null;
}

const initialState: TournamentState = {
  tournament: null,
  status: "idle",
  error: null,
};

export const fetchActiveTournament = createAsyncThunk(
  "tournament/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(getApiUrl("/api/tournaments/active"));

      if (response.status === 404) {
        return rejectWithValue({
          status: 404,
          message: "No hay torneo activo en este momento.",
        });
      }

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message:
            "El servicio no está disponible. Intentá de nuevo en unos minutos.",
        });
      }

      const data: ActiveTournament = await response.json();
      return data;
    } catch {
      return rejectWithValue({
        status: 0,
        message:
          "El servicio no está disponible. Intentá de nuevo en unos minutos.",
      });
    }
  }
);

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveTournament.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActiveTournament.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tournament = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveTournament.rejected, (state, action) => {
        const payload = action.payload as
          | { status: number; message: string }
          | undefined;
        if (payload?.status === 404) {
          state.status = "not_found";
          state.error = payload.message;
        } else {
          state.status = "failed";
          state.error =
            payload?.message ??
            "El servicio no está disponible. Intentá de nuevo en unos minutos.";
        }
        state.tournament = null;
      });
  },
});

/** Convenience selector for the entire tournament state slice. */
export const selectTournament = (state: RootState) => state.tournament;

export default tournamentSlice.reducer;
