"use client";

import { ReactNode } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isHydrated } = useRequireAuth();

  if (!isHydrated || !isAuthenticated) {
    return <Spinner label="Checking access" />;
  }

  return children;
};
