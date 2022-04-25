import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "state/store";

const initialState: string[] = [];

export const poolListsSlice = createSlice({
  name: "poolLists",
  initialState: initialState,
  reducers: {
    setPoolLists: (_, action: { payload: string[] }) => action.payload,
  },
});

const { setPoolLists } = poolListsSlice.actions;

export const loadPoolLists = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/get-all-pool-list-names");
    dispatch(setPoolLists(response.data as string[]) ?? []);
  } catch (err) {
    console.error(err);
  }
};

export const poolListsReducer = poolListsSlice.reducer;
export const poolListsSelector = (state: RootState) => state.poolLists;
