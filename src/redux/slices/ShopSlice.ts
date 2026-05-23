import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, userApi, settingsApi } from "../../api/endpoints";
import { tokenStorage, ApiClientError } from "../../api/client";

export type Theme = "light" | "dark" | "tet" | "christmas" | "halloween";
const themeToApi = (t: Theme) => t.toUpperCase();
const themeFromApi = (t: string) => t.toLowerCase() as Theme;

type ShopState = {
  isLoggedIn: boolean;
  userId: number | null;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  balance: number;
  discountPercent: number;
  refCode: string;
  role: string;
  currency: "VND" | "USD";
  language: "vi" | "en";
  selectedCategory: string | "all";
  searchQuery: string;
  cart: { productId: number; qty: number }[];
  theme: Theme;
  compactMode: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  enableDecorations: boolean;
  fontScale: "sm" | "md" | "lg";
  authLoading: boolean;
  authError: string;
};

const STORAGE_KEY = "shop_settings_v1";

function loadSettings(): Partial<ShopState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(state: ShopState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme: state.theme,
      compactMode: state.compactMode,
      enableNotifications: state.enableNotifications,
      enableSound: state.enableSound,
      enableDecorations: state.enableDecorations,
      fontScale: state.fontScale,
      currency: state.currency,
      language: state.language,
    }));
  } catch { /* ignore */ }
}

const persisted = loadSettings();

const initialState: ShopState = {
  isLoggedIn: !!tokenStorage.getAccess(),
  userId: null,
  username: "",
  email: "",
  fullName: "",
  avatarUrl: "",
  balance: 0,
  discountPercent: 0,
  refCode: "",
  role: "USER",
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
  authLoading: false,
  authError: "",
};

export const loginThunk = createAsyncThunk<
  void,
  { usernameOrEmail: string; password: string },
  { rejectValue: string }
>("shop/login", async (req, { rejectWithValue, dispatch }) => {
  try {
    const res = await authApi.login(req.usernameOrEmail, req.password);
    tokenStorage.set(res.accessToken, res.refreshToken);
    dispatch(setUserInfo(res.user));
  } catch (e) {
    const msg = e instanceof ApiClientError ? e.message : "Đăng nhập thất bại";
    return rejectWithValue(msg);
  }
});

export const registerThunk = createAsyncThunk<
  void,
  { username: string; email: string; phone: string; password: string; refCode?: string },
  { rejectValue: string }
>("shop/register", async (req, { rejectWithValue, dispatch }) => {
  try {
    const res = await authApi.register(req);
    tokenStorage.set(res.accessToken, res.refreshToken);
    dispatch(setUserInfo(res.user));
  } catch (e) {
    const msg = e instanceof ApiClientError ? e.message : "Đăng ký thất bại";
    return rejectWithValue(msg);
  }
});

export const logoutThunk = createAsyncThunk<void>("shop/logout", async () => {
  try { await authApi.logout(); } catch { /* ignore */ }
  tokenStorage.clear();
});

export const fetchMeThunk = createAsyncThunk<void>(
  "shop/fetchMe",
  async (_, { dispatch }) => {
    try {
      const u = await userApi.me();
      dispatch(setUserInfo({
        id: u.id, username: u.username, email: u.email,
        fullName: u.fullName ?? "", role: u.role,
        balance: u.balance, discountPercent: u.discountPercent,
        refCode: u.refCode ?? "",
      }));
      try {
        const s = await settingsApi.get();
        dispatch(applyServerSettings(s));
      } catch { /* settings optional */ }
    } catch {
      tokenStorage.clear();
      dispatch(logoutLocal());
    }
  }
);

export const syncSettingsThunk = createAsyncThunk<
  void,
  Partial<{
    theme: Theme;
    language: ShopState["language"];
    currency: ShopState["currency"];
    fontScale: ShopState["fontScale"];
    compactMode: boolean;
    enableNotifications: boolean;
    enableSound: boolean;
    enableDecorations: boolean;
  }>
>("shop/syncSettings", async (patch) => {
  const apiPatch: Record<string, unknown> = { ...patch };
  if (patch.theme) apiPatch.theme = themeToApi(patch.theme);
  if (patch.language) apiPatch.language = patch.language.toUpperCase();
  if (patch.currency) apiPatch.currency = patch.currency.toUpperCase();
  if (patch.fontScale) apiPatch.fontScale = patch.fontScale.toUpperCase();
  try { await settingsApi.update(apiPatch); } catch { /* offline OK */ }
});

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<{
      id: number; username: string; email: string;
      fullName?: string; role?: string;
      balance: number; discountPercent: number; refCode?: string;
    }>) {
      state.userId = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName ?? action.payload.username;
      state.balance = action.payload.balance;
      state.discountPercent = action.payload.discountPercent;
      state.refCode = action.payload.refCode ?? "";
      state.role = action.payload.role ?? "USER";
      state.isLoggedIn = true;
    },
    logoutLocal(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.username = "";
      state.email = "";
      state.fullName = "";
      state.avatarUrl = "";
      state.balance = 0;
      state.cart = [];
    },
    applyServerSettings(state, action: PayloadAction<{
      theme: string; language: string; currency: string;
      fontScale: string; compactMode: boolean;
      enableNotifications: boolean; enableSound: boolean; enableDecorations: boolean;
    }>) {
      const s = action.payload;
      state.theme = themeFromApi(s.theme);
      state.language = s.language.toLowerCase() as ShopState["language"];
      state.currency = s.currency.toUpperCase() as ShopState["currency"];
      state.fontScale = s.fontScale.toLowerCase() as ShopState["fontScale"];
      state.compactMode = s.compactMode;
      state.enableNotifications = s.enableNotifications;
      state.enableSound = s.enableSound;
      state.enableDecorations = s.enableDecorations;
      saveSettings(state);
    },
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
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
    setCategory(state, action: PayloadAction<string | "all">) {
      state.selectedCategory = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addToCartLocal(state, action: PayloadAction<number>) {
      const existing = state.cart.find((c) => c.productId === action.payload);
      if (existing) existing.qty += 1;
      else state.cart.push({ productId: action.payload, qty: 1 });
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter((c) => c.productId !== action.payload);
    },
    clearCart(state) { state.cart = []; },
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
    clearAuthError(state) { state.authError = ""; },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => { s.authLoading = true; s.authError = ""; })
     .addCase(loginThunk.fulfilled, (s) => { s.authLoading = false; })
     .addCase(loginThunk.rejected, (s, a) => { s.authLoading = false; s.authError = a.payload ?? "Lỗi"; })
     .addCase(registerThunk.pending, (s) => { s.authLoading = true; s.authError = ""; })
     .addCase(registerThunk.fulfilled, (s) => { s.authLoading = false; })
     .addCase(registerThunk.rejected, (s, a) => { s.authLoading = false; s.authError = a.payload ?? "Lỗi"; })
     .addCase(logoutThunk.fulfilled, (s) => {
        s.isLoggedIn = false; s.userId = null;
        s.username = ""; s.email = ""; s.fullName = "";
        s.balance = 0; s.cart = [];
     });
  },
});

export const {
  setUserInfo, logoutLocal, applyServerSettings,
  setBalance, addBalance,
  setCurrency, setLanguage,
  setCategory, setSearch,
  addToCartLocal, removeFromCart, clearCart,
  setTheme, setCompactMode, setNotifications, setSound, setDecorations, setFontScale,
  resetSettings, clearAuthError,
} = shopSlice.actions;

// Legacy aliases — keep so existing components vẫn chạy
export const login = setUserInfo;
export const logout = logoutLocal;
export const addToCart = addToCartLocal;

export default shopSlice.reducer;
