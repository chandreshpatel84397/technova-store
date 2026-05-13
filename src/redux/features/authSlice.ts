import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_COOKIE, STORAGE_KEYS } from "@/constants/storage";
import { User } from "@/types";
import { deleteCookie, setCookie } from "@/utils/cookies";
import { readStorage, removeStorage, writeStorage } from "@/utils/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface LoginPayload {
  email: string;
  name?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false
};

const buildMockUser = ({ email, name }: LoginPayload): User => ({
  id: `customer-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name: name || email.split("@")[0] || "TechNova Customer",
  email
});

const persistSession = (user: User, token: string) => {
  writeStorage(STORAGE_KEYS.authUser, user);
  writeStorage(STORAGE_KEYS.authToken, token);
  setCookie(AUTH_COOKIE, token);
};

const clearSession = () => {
  removeStorage(STORAGE_KEYS.authUser);
  removeStorage(STORAGE_KEYS.authToken);
  deleteCookie(AUTH_COOKIE);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const user = buildMockUser(action.payload);
      const token = `mock-customer-token-${Date.now()}`;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isHydrated = true;
      persistSession(user, token);
    },
    signup: (state, action: PayloadAction<LoginPayload>) => {
      const user = buildMockUser(action.payload);
      const token = `mock-customer-token-${Date.now()}`;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isHydrated = true;
      persistSession(user, token);
    },
    hydrateAuth: (state) => {
      const user = readStorage<User | null>(STORAGE_KEYS.authUser, null);
      const token = window.localStorage.getItem(STORAGE_KEYS.authToken);

      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(user && token);
      state.isHydrated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
      clearSession();
    }
  }
});

export const { hydrateAuth, login, logout, signup } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
