import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/utils/storage";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "light"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      writeStorage(STORAGE_KEYS.theme, state.mode);
    },
    hydrateTheme: (state) => {
      state.mode = readStorage<ThemeMode>(STORAGE_KEYS.theme, "light");
    }
  }
});

export const { hydrateTheme, toggleTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.mode;
export default themeSlice.reducer;
