import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "state/store";

interface State {
  pools: string[];
}

const initialState: State = { pools: [] };

export const poolsSlice = createSlice({
  name: "pools",
  initialState: initialState,
  reducers: {
    setPools: (state, action: { payload: string[] }) => {
      state.pools = action.payload;
    },
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
export const poolsSelector = (state: RootState) => state.pools.pools;
