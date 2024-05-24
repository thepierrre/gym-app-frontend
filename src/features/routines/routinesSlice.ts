import axiosInstance from "../../util/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { routines } from "../../util/DUMMY_DATA";

import { Routine } from "../../interfaces/routine.interface";

export interface RoutinesState {
  routines: Routine[];
  loading: boolean;
  error: string | null;
}

interface EditRoutinePayload {
  routine: Routine;
  index: number;
}

const initialState: RoutinesState = {
  routines,
  loading: false,
  error: null,
};

export const fetchRoutines = createAsyncThunk<
  Routine[], // Return type of the fulfilled action
  void, // Argument type (not needed here, so void)
  { rejectValue: string } // Type of the reject value
>("routines/fetchRoutines", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("routines");
    return response.data;
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const addRoutine = createAsyncThunk<
  Routine, // Return type of the fulfilled action
  Omit<Routine, "id">, // Argument type (without id)
  { rejectValue: string } // Type of the reject value
>("routines/addRoutine", async (newRoutine, thunkAPI) => {
  try {
    console.log(newRoutine);
    const response = await axiosInstance.post("routines", newRoutine);
    return response.data;
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const routinesSlice = createSlice({
  name: "routinesSlice",
  initialState,
  reducers: {
    editRoutine(state, action: PayloadAction<EditRoutinePayload>) {
      const { routine, index } = action.payload;
      state.routines[index] = routine;
    },
    removeRoutine(state, action: PayloadAction<Routine>) {
      const routineToRemove = action.payload;
      state.routines = state.routines.filter(
        (routine) => routine.id !== routineToRemove.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRoutines.fulfilled,
        (state, action: PayloadAction<Routine[]>) => {
          state.loading = false;
          state.routines = action.payload;
        }
      )
      .addCase(
        fetchRoutines.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch routines.";
        }
      )
      .addCase(
        addRoutine.fulfilled,
        (state, action: PayloadAction<Routine>) => {
          state.routines.push(action.payload);
        }
      )
      .addCase(
        addRoutine.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to add the routine.";
        }
      );
  },
});

export const { editRoutine, removeRoutine } = routinesSlice.actions;
export default routinesSlice.reducer;
