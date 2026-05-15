"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiLogOut, FiPackage, FiUser } from "react-icons/fi";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { logout } from "@/redux/features/authSlice";
import { selectOrdersByEmail } from "@/redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { currency } from "@/utils/formatters";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector(selectOrdersByEmail(user?.email));
  const recentOrders = [...orders]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 3);

  return (
    <ProtectedRoute>
      <MotionSection className="container-shell py-12 grid gap-8">
        {/* Account info */}
        <MotionText
          delay={0.05}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <FiUser className="h-10 w-10 text-brand-600" />
          <h1 className="mt-4 text-4xl font-black">Profile</h1>
          <MotionGrid className="mt-6 grid gap-4 md:grid-cols-3" delay={0.1}>
            <MotionGridItem>
              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-black">{user?.name}</p>
              </div>
            </MotionGridItem>
            <MotionGridItem>
              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-black">{user?.email}</p>
              </div>
            </MotionGridItem>
            <MotionGridItem>
              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Account</p>
                <p className="mt-1 font-black">Customer</p>
              </div>
            </MotionGridItem>
          </MotionGrid>
          <Button
            className="mt-8"
            icon={FiLogOut}
            onClick={() => {
              dispatch(logout());
              router.push("/");
            }}
            variant="secondary"
          >
            Logout
          </Button>
        </MotionText>

        {/* Order history */}
        <MotionText
          delay={0.2}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiPackage className="h-7 w-7 text-brand-600" />
              <h2 className="text-2xl font-black">Order History</h2>
            </div>
            <Link href="/orders">
              <Button icon={FiArrowRight} size="sm" variant="secondary">
                View all
              </Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-950/40">
              <p className="font-semibold text-slate-500">No orders yet.</p>
              <Link className="mt-4 inline-block" href="/products">
                <Button size="sm">Start shopping</Button>
              </Link>
            </div>
          ) : (
            <MotionGrid className="mt-6 grid gap-4" delay={0.25}>
              {recentOrders.map((order) => (
                <MotionGridItem key={order.id}>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <div>
                      <p className="text-xs font-black uppercase text-brand-600">
                        {order.id}
                      </p>
                      <p className="mt-1 font-black">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                        <span className="ml-2 text-sm font-semibold text-slate-500">
                          · {new Date(order.date).toLocaleDateString()}
                        </span>
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-black ${
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
                    <p className="text-xl font-black">
                      {currency(order.total || (order as any).totalPrice)}
                    </p>
                  </div>
                </MotionGridItem>
              ))}

              {orders.length > 3 && (
                <p className="text-center text-sm text-slate-500">
                  +{orders.length - 3} more order
                  {orders.length - 3 !== 1 ? "s" : ""} —{" "}
                  <Link
                    className="font-bold text-brand-600 hover:underline"
                    href="/orders"
                  >
                    view all
                  </Link>
                </p>
              )}
            </MotionGrid>
          )}
        </MotionText>
      </MotionSection>
    </ProtectedRoute>
  );
}
