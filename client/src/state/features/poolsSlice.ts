import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "state/store";

const initialState: string[] = [];

export const poolsSlice = createSlice({
  name: "pools",
  initialState: initialState,
  reducers: {
    setPools: (_, action: { payload: string[] }) => action.payload,
  },
});

const { setPools } = poolsSlice.actions;

export const loadPools = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/get-all-pools");
    dispatch(setPools(response.data as string[]) ?? []);
  } catch (err) {
    console.error(err);
  }
};

export const poolsReducer = poolsSlice.reducer;
export const poolsSelector = (state: RootState) => state.pools;
