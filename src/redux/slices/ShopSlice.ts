import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "tet" | "christmas" | "halloween";

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
  // Settings
  theme: Theme;
  compactMode: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  enableDecorations: boolean;
  fontScale: "sm" | "md" | "lg";
};

const STORAGE_KEY = "shop_settings_v1";

function loadSettings(): Partial<ShopState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSettings(state: ShopState) {
  if (typeof window === "undefined") return;
  try {
    const subset = {
      theme: state.theme,
      compactMode: state.compactMode,
      enableNotifications: state.enableNotifications,
      enableSound: state.enableSound,
      enableDecorations: state.enableDecorations,
      fontScale: state.fontScale,
      currency: state.currency,
      language: state.language,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch {
    // ignore
  }
}

const persisted = loadSettings();

const initialState: ShopState = {
  isLoggedIn: false,
  username: "",
  balance: 0,
  discountPercent: 0,
  currency: (persisted.currency as ShopState["currency"]) ?? "VND",
  language: (persisted.language as ShopState["language"]) ?? "vi",
  selectedCategory: "all",
  searchQuery: "",
  cart: [],
  theme: (persisted.theme as Theme) ?? "light",
  compactMode: persisted.compactMode ?? false,
  enableNotifications: persisted.enableNotifications ?? true,
  enableSound: persisted.enableSound ?? false,
  enableDecorations: persisted.enableDecorations ?? true,
  fontScale: (persisted.fontScale as ShopState["fontScale"]) ?? "md",
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
      saveSettings(state);
    },
    setLanguage(state, action: PayloadAction<"vi" | "en">) {
      state.language = action.payload;
      saveSettings(state);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      saveSettings(state);
    },
    setCompactMode(state, action: PayloadAction<boolean>) {
      state.compactMode = action.payload;
      saveSettings(state);
    },
    setNotifications(state, action: PayloadAction<boolean>) {
      state.enableNotifications = action.payload;
      saveSettings(state);
    },
    setSound(state, action: PayloadAction<boolean>) {
      state.enableSound = action.payload;
      saveSettings(state);
    },
    setDecorations(state, action: PayloadAction<boolean>) {
      state.enableDecorations = action.payload;
      saveSettings(state);
    },
    setFontScale(state, action: PayloadAction<"sm" | "md" | "lg">) {
      state.fontScale = action.payload;
      saveSettings(state);
    },
    resetSettings(state) {
      state.theme = "light";
      state.compactMode = false;
      state.enableNotifications = true;
      state.enableSound = false;
      state.enableDecorations = true;
      state.fontScale = "md";
      saveSettings(state);
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
  setTheme,
  setCompactMode,
  setNotifications,
  setSound,
  setDecorations,
  setFontScale,
  resetSettings,
} = shopSlice.actions;

export default shopSlice.reducer;
