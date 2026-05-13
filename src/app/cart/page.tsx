"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { EmptyState } from "@/components/common/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { currency } from "@/utils/formatters";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [couponCode, setCouponCode] = useState("");
  const couponSavings =
    couponCode.trim().toUpperCase() === "NOVA10" ? Math.round(total * 0.1) : 0;
  const finalTotal = Math.max(total - couponSavings, 0);

  return (
    <ProtectedRoute>
      <MotionSection className="container-shell py-12">
        <MotionText className="text-4xl font-black">Cart</MotionText>
        {items.length === 0 ? (
          <MotionText delay={0.1} className="mt-8">
            <EmptyState
              title="Your cart is empty"
              message="Add a few products from the shop to start checkout."
            />
          </MotionText>
        ) : (
          <MotionGrid
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
            delay={0.1}
          >
            <div className="grid gap-4">
              {items.map((item, index) => (
                <MotionGridItem key={item.product.id}>
                  <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:grid-cols-[1fr_auto] dark:border-slate-800 dark:bg-slate-900">
                    <div className="grid grid-cols-[96px_1fr] gap-4">
                      <div className="relative h-24 overflow-hidden rounded-2xl bg-slate-100">
                        <Image
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          src={item.product.thumbnail}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-600">
                          {item.product.category}
                        </p>
                        <h2 className="mt-1 text-xl font-black">
                          {item.product.title}
                        </h2>
                        <p className="mt-2 text-slate-500">
                          {currency(item.product.price)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product.id,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        <FiMinus />
                      </button>
                      <span className="grid h-10 w-12 place-items-center rounded-xl bg-slate-100 font-black dark:bg-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product.id,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        <FiPlus />
                      </button>
                      <button
                        className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 text-red-600"
                        onClick={() =>
                          dispatch(removeFromCart(item.product.id))
                        }
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                </MotionGridItem>
              ))}
            </div>
            <MotionGridItem className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm font-semibold">
                <span>Subtotal</span>
                <span>{currency(total)}</span>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-black uppercase text-slate-500">
                  Coupon code
                </span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Try NOVA10"
                  value={couponCode}
                />
              </label>
              {couponSavings ? (
                <div className="mt-3 flex justify-between text-sm font-semibold text-emerald-600">
                  <span>Coupon savings</span>
                  <span>-{currency(couponSavings)}</span>
                </div>
              ) : null}
              <div className="mt-3 flex justify-between text-sm font-semibold">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-xl font-black dark:border-slate-800">
                <span>Total</span>
                <span>{currency(finalTotal)}</span>
              </div>
              <Link className="mt-6 block" href="/checkout">
                <Button className="w-full">Checkout</Button>
              </Link>
            </MotionGridItem>
          </MotionGrid>
        )}
      </MotionSection>
    </ProtectedRoute>
  );
}
