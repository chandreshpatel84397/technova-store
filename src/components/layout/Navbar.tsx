"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiHeart,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiShoppingCart,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { publicNavItems, ROUTES } from "@/constants/routes";
import { logout } from "@/redux/features/authSlice";
import { selectCartCount } from "@/redux/features/cartSlice";
import { selectOrdersByEmail } from "@/redux/features/orderSlice";
import { selectTheme, toggleTheme } from "@/redux/features/themeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/classNames";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const mode = useAppSelector(selectTheme);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const orders = useAppSelector(selectOrdersByEmail(user?.email));
  const orderCount = orders.length;

  const closeMenuOnMobile = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.home);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <nav className="container-shell flex h-20 items-center justify-between">
        <Link className="flex items-center gap-3" href={ROUTES.home}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-blue-700 text-lg font-black text-white shadow-glass">
            TN
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">
              TechNova
            </span>
            <span className="block text-xs font-semibold text-slate-500">
              Premium tech marketplace
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {publicNavItems.map((item) => (
            <Link
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800",
                pathname === item.href &&
                  "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            aria-label="Toggle theme"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => dispatch(toggleTheme())}
          >
            {mode === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <Link
            aria-label="Wishlist"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            href={ROUTES.wishlist}
          >
            <FiHeart />
          </Link>
          <Link
            aria-label="Cart"
            className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            href={ROUTES.cart}
          >
            <FiShoppingCart />
            {cartCount ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                aria-label="Order history"
                className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                href={ROUTES.orders}
              >
                <FiPackage />
                {orderCount ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                    {orderCount}
                  </span>
                ) : null}
              </Link>
              <Link
                className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                href={ROUTES.profile}
              >
                <FiUser />
              </Link>
              <button
                aria-label="Logout"
                className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                onClick={handleLogout}
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <Link href={ROUTES.login}>
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 lg:hidden dark:border-slate-700"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {isOpen ? (
        <div className="container-shell pb-5 lg:hidden">
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            {publicNavItems.map((item) => (
              <Link
                className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                href={item.href}
                key={item.href}
                onClick={closeMenuOnMobile}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-bold dark:bg-slate-800"
                href={ROUTES.cart}
                onClick={closeMenuOnMobile}
              >
                Cart
              </Link>
              <Link
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-bold dark:bg-slate-800"
                href={ROUTES.wishlist}
                onClick={closeMenuOnMobile}
              >
                Wishlist
              </Link>
              <Link
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-bold dark:bg-slate-800"
                href={ROUTES.orders}
                onClick={closeMenuOnMobile}
              >
                Orders
              </Link>
              <button
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold dark:bg-slate-800"
                onClick={() => {
                  dispatch(toggleTheme());
                  closeMenuOnMobile();
                }}
              >
                Theme
              </button>
              <Link
                className="rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-bold text-white"
                href={isAuthenticated ? ROUTES.profile : ROUTES.login}
                onClick={closeMenuOnMobile}
              >
                {isAuthenticated ? "Profile" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
