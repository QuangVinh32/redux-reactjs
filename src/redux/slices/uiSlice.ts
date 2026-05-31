import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  toast: { id: number; message: string; kind: "success" | "error" | "info" } | null;
};

const initialState: UiState = {
  sidebarOpen: false,
  cartDrawerOpen: false,
  toast: null,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (s) => {
      s.sidebarOpen = !s.sidebarOpen;
    },
    setSidebar: (s, a: PayloadAction<boolean>) => {
      s.sidebarOpen = a.payload;
    },
    toggleCart: (s) => {
      s.cartDrawerOpen = !s.cartDrawerOpen;
    },
    setCartDrawer: (s, a: PayloadAction<boolean>) => {
      s.cartDrawerOpen = a.payload;
    },
    showToast: (
      s,
      a: PayloadAction<{ message: string; kind?: "success" | "error" | "info" }>
    ) => {
      s.toast = {
        id: Date.now(),
        message: a.payload.message,
        kind: a.payload.kind ?? "info",
      };
    },
    clearToast: (s) => {
      s.toast = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebar,
  toggleCart,
  setCartDrawer,
  showToast,
  clearToast,
} = slice.actions;
export default slice.reducer;
