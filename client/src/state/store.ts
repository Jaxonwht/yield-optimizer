import { configureStore } from "@reduxjs/toolkit";
import { poolsReducer } from "./features/poolsSlice";
import { lastQueryTimeReducer } from "./features/lastQueryTimeSlice";

const store = configureStore({
  reducer: {
    pools: poolsReducer,
    lastQueryTime: lastQueryTimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
