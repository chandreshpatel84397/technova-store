import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_COOKIE, STORAGE_KEYS } from "@/constants/storage";
import { User } from "@/types";
import { deleteCookie, setCookie } from "@/utils/cookies";
import { removeStorage, writeStorage } from "@/utils/storage";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null
};

export const login = createAsyncThunk("auth/login", async (credentials: any, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const signup = createAsyncThunk("auth/signup", async (userData: any, { rejectWithValue }) => {
  try {
    const data = await authService.register(userData);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const user = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.authUser) || "null");
        const token = window.localStorage.getItem(STORAGE_KEYS.authToken);
        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(user && token);
      }
      state.isHydrated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeStorage(STORAGE_KEYS.authUser);
      removeStorage(STORAGE_KEYS.authToken);
      deleteCookie(AUTH_COOKIE);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        writeStorage(STORAGE_KEYS.authUser, action.payload);
        writeStorage(STORAGE_KEYS.authToken, action.payload.token);
        setCookie(AUTH_COOKIE, action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        writeStorage(STORAGE_KEYS.authUser, action.payload);
        writeStorage(STORAGE_KEYS.authToken, action.payload.token);
        setCookie(AUTH_COOKIE, action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { hydrateAuth, logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
