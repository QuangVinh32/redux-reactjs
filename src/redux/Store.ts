import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { authApi } from "../api/authApi";
import { catalogApi } from "../api/catalogApi";
import { cartApi } from "../api/cartApi";
import { orderApi } from "../api/orderApi";
import { miscApi } from "../api/miscApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [miscApi.reducerPath]: miscApi.reducer,
  },
  middleware: (gdm) =>
    gdm().concat(
      authApi.middleware,
      catalogApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      miscApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
