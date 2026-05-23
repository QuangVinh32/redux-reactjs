import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./slices/CounterSlice";
import dashboardReducer from "./slices/DashboardSlice";
import shopReducer from "./slices/ShopSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
    shop: shopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;