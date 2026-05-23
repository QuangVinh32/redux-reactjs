import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ShopState = {
  isLoggedIn: boolean;
  username: string;
  balance: number;
  discountPercent: number;
  currency: "VND" | "USD";
  language: "vi" | "en";
  selectedCategory: string | "all";
  searchQuery: string;
  cart: { productId: string; qty: number }[];
};

const initialState: ShopState = {
  isLoggedIn: false,
  username: "",
  balance: 0,
  discountPercent: 0,
  currency: "VND",
  language: "vi",
  selectedCategory: "all",
  searchQuery: "",
  cart: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; balance: number }>) {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.balance = action.payload.balance;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = "";
      state.balance = 0;
      state.cart = [];
    },
    addBalance(state, action: PayloadAction<number>) {
      state.balance += action.payload;
    },
    setCurrency(state, action: PayloadAction<"VND" | "USD">) {
      state.currency = action.payload;
    },
    setLanguage(state, action: PayloadAction<"vi" | "en">) {
      state.language = action.payload;
    },
    setCategory(state, action: PayloadAction<string | "all">) {
      state.selectedCategory = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addToCart(state, action: PayloadAction<string>) {
      const existing = state.cart.find((c) => c.productId === action.payload);
      if (existing) existing.qty += 1;
      else state.cart.push({ productId: action.payload, qty: 1 });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((c) => c.productId !== action.payload);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  login,
  logout,
  addBalance,
  setCurrency,
  setLanguage,
  setCategory,
  setSearch,
  addToCart,
  removeFromCart,
  clearCart,
} = shopSlice.actions;

export default shopSlice.reducer;
