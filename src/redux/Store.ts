import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./slices/CounterSlice";
import dashboardReducer from "./slices/DashboardSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
  },
});