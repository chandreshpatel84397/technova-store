"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiPackage } from "react-icons/fi";
import { fetchMyOrders, selectOrdersByEmail } from "@/redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { currency } from "@/utils/formatters";

export const RecentOrdersBanner = () => {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const orders = useAppSelector(selectOrdersByEmail(user?.email));

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  // Don't render until mounted on client, auth is hydrated, logged in, and has orders
  if (!mounted || !isHydrated || !isAuthenticated || !orders || orders.length === 0) return null;

  const recentOrders = [...orders]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 3);

  return (
    <section className="container-shell py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiPackage className="h-6 w-6 text-brand-600" />
            <div>
              <p className="text-xs font-black uppercase text-brand-600">Your account</p>
              <h2 className="text-2xl font-black">Recent Orders</h2>
            </div>
          </div>
          <Link
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            href="/orders"
          >
            View all <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentOrders.map((order) => (
            <div
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
              key={(order as any)._id || order.id}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-black uppercase text-brand-600 truncate max-w-[120px]">
                  #{(order as any)._id?.slice(-8) || order.id?.slice(-8)}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                    order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : order.status === "Confirmed"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="mt-2 text-lg font-black">{currency(order.total || (order as any).totalPrice)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                {new Date((order as any).createdAt || order.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
