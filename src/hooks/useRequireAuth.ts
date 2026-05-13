"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/redux/hooks";

export const useRequireAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  return { isAuthenticated, isHydrated, user };
};
