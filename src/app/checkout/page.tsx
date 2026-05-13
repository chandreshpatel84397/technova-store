"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/common/ToastProvider";
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from "@/redux/features/cartSlice";
import { placeOrder } from "@/redux/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { currency } from "@/utils/formatters";
import { Order } from "@/types";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Order["paymentMethod"]>("Card");
  const discountTotal =
    couponCode.trim().toUpperCase() === "NOVA10" ? Math.round(total * 0.1) : 0;
  const finalTotal = Math.max(total - discountTotal, 0);

  const submitOrder = (event: FormEvent) => {
    event.preventDefault();
    if (!user || !items.length) return;

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const orderAction = dispatch(
      placeOrder({
        customerEmail: user.email,
        cartItems: items,
        subtotal: total,
        discountTotal,
        total: finalTotal,
        couponCode: couponCode.trim() || undefined,
        paymentMethod,
        shippingAddress: {
          name: String(formData.get("name") || user.name),
          email: String(formData.get("email") || user.email),
          address: String(formData.get("address") || ""),
          city: String(formData.get("city") || ""),
          zip: String(formData.get("zip") || ""),
        },
      }),
    );

    dispatch(clearCart());
    showToast("Order placed successfully");
    router.push(`/orders?success=1&orderId=${orderAction.payload.id}`);
  };

  return (
    <ProtectedRoute>
      <MotionSection className="container-shell grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        {items.length === 0 ? (
          <MotionText delay={0.05} className="lg:col-span-2">
            <EmptyState
              title="Your cart is empty"
              message="Add products before starting checkout."
            />
            <Link className="mt-6 inline-flex" href="/products">
              <Button>Continue shopping</Button>
            </Link>
          </MotionText>
        ) : (
          <>
            <MotionText
              delay={0.05}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            >
              <form onSubmit={submitOrder}>
                <h1 className="text-3xl font-black">Checkout</h1>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Input
                    defaultValue={user?.name}
                    label="Full name"
                    name="name"
                    required
                  />
                  <Input
                    defaultValue={user?.email}
                    label="Email"
                    name="email"
                    required
                    type="email"
                  />
                  <Input
                    label="Address"
                    name="address"
                    wrapperClassName="md:col-span-2"
                    required
                  />
                  <Input label="City" name="city" required />
                  <Input label="ZIP code" name="zip" required />
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-black uppercase text-slate-500">
                    Payment method
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(
                      [
                        "Card",
                        "UPI",
                        "Cash on Delivery",
                      ] as Order["paymentMethod"][]
                    ).map((method) => (
                      <button
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${
                          paymentMethod === method
                            ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        type="button"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Coupon code
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Try NOVA10"
                    value={couponCode}
                  />
                </label>
                <Button className="mt-6 w-full md:w-auto" type="submit">
                  Place order
                </Button>
              </form>
            </MotionText>

            <MotionText
              delay={0.1}
              className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-xl font-black">Checkout summary</h2>
              <MotionGrid className="mt-5 grid gap-4" delay={0.15}>
                {items.map((item) => (
                  <MotionGridItem key={item.product.id}>
                    <div className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
                      <div className="relative h-14 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          src={item.product.thumbnail}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-black">
                        {currency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </MotionGridItem>
                ))}
              </MotionGrid>
              <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm font-semibold dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency(total)}</span>
                </div>
                {discountTotal ? (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon</span>
                    <span>-{currency(discountTotal)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>{currency(finalTotal)}</span>
                </div>
              </div>
            </MotionText>
          </>
        )}
      </MotionSection>
    </ProtectedRoute>
  );
}
