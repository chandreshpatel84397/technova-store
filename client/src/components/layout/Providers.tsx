"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ToastProvider } from "@/components/common/ToastProvider";
import { hydrateAuth } from "@/redux/features/authSlice";
import { hydrateTheme, selectTheme } from "@/redux/features/themeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { store } from "@/redux/store";

const ThemeHydrator = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectTheme);

  useEffect(() => {
    dispatch(hydrateTheme());
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return children;
};

export const Providers = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <ThemeHydrator>
      <ToastProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ToastProvider>
    </ThemeHydrator>
  </Provider>
);
