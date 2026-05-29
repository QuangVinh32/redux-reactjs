import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "../../api/tokenStorage";
import type { LoginResponse, User } from "../../types/backend";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: Pick<User, "userId" | "username" | "fullName" | "email" | "role" | "image"> | null;
};

const persistedUser = tokenStorage.getUser();
const initialState: AuthState = {
  accessToken: tokenStorage.getAccess(),
  refreshToken: tokenStorage.getRefresh(),
  user: persistedUser,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<LoginResponse>) => {
      const p = action.payload;
      state.accessToken = p.token;
      state.refreshToken = p.refreshToken;
      state.user = {
        userId: p.userId,
        username: p.username,
        fullName: p.fullName,
        email: p.email,
        role: p.role,
        image: p.image,
      };
      tokenStorage.set(p.token, p.refreshToken);
      tokenStorage.setUser(state.user);
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      if (action.payload) tokenStorage.setUser(action.payload);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      tokenStorage.clear();
    },
  },
});

export const { setSession, setTokens, setUser, logout } = slice.actions;
export default slice.reducer;
