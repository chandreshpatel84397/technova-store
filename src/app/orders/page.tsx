"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { EmptyState } from "@/components/common/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { OrderCard } from "@/components/order/OrderCard";
import { Button } from "@/components/ui/Button";
import { selectOrdersByEmail } from "@/redux/features/orderSlice";
import { useAppSelector } from "@/redux/hooks";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function OrdersPage() {
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector(selectOrdersByEmail(user?.email));
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    [orders],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSuccessOrderId(
      params.get("success") === "1" ? params.get("orderId") : null,
    );
  }, []);

  return (
    <ProtectedRoute>
      <MotionSection className="container-shell py-12">
        {successOrderId ? (
          <MotionText
            delay={0.05}
            className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 shadow-soft dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
          >
            <FiCheckCircle className="h-9 w-9" />
            <h1 className="mt-4 text-3xl font-black">Checkout successful</h1>
            <p className="mt-2 text-sm font-semibold">
              Your order {successOrderId} is now saved in your customer order
              history.
            </p>
          </MotionText>
        ) : null}

        <MotionText
          delay={0.1}
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-black uppercase text-brand-600">
              My Orders
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Order history
            </h1>
            <p className="mt-2 text-slate-500">
              Only orders placed with {user?.email} appear here.
            </p>
          </div>
          <Link href="/products">
            <Button variant="secondary">Continue shopping</Button>
          </Link>
        </MotionText>

        {sortedOrders.length === 0 ? (
          <MotionText delay={0.15}>
            <EmptyState
              title="No orders yet"
              message="When you place an order, it will appear here and stay after refresh."
            />
          </MotionText>
        ) : (
          <MotionGrid className="grid gap-6" delay={0.15}>
            {sortedOrders.map((order) => (
              <MotionGridItem key={order.id}>
                <OrderCard order={order} />
              </MotionGridItem>
            ))}
          </MotionGrid>
        )}
      </MotionSection>
    </ProtectedRoute>
  );
}
