import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "state/store";

interface State {
  [key: string]: number;
}

const initialState: State = {};

export const lastQueryTimeSlice = createSlice({
  name: "lastQueryTime",
  initialState: initialState,
  reducers: {
    setLastQueryTime: (
      state: { [key: string]: number },
      action: { payload: [string, number] }
    ) => {
      state[action.payload[0]] = action.payload[1];
    },
  },
});

export const setLastQueryTime = (
  dispatch: AppDispatch,
  payload: [string, number]
) => {
  dispatch(lastQueryTimeSlice.actions.setLastQueryTime(payload));
};

export const lastQueryTimeReducer = lastQueryTimeSlice.reducer;

export const lastQueryTimeSelector = (queryKey: string) => (state: RootState) =>
  state.lastQueryTime[queryKey];
