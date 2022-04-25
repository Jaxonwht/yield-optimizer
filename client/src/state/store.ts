import { configureStore } from "@reduxjs/toolkit";
import { poolsReducer } from "./features/poolsSlice";
import { lastQueryTimeReducer } from "./features/lastQueryTimeSlice";
import { poolListsReducer } from "./features/poolListsSlice";

const store = configureStore({
  reducer: {
    pools: poolsReducer,
    lastQueryTime: lastQueryTimeReducer,
    poolLists: poolListsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
