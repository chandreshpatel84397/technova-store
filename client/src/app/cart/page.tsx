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

  const getItemId = (item: any) => item.product._id || item.product.id;

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
            <Link href="/products" className="mt-6 inline-block">
              <Button>Browse Products</Button>
            </Link>
          </MotionText>
        ) : (
          <MotionGrid
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
            delay={0.1}
          >
            <div className="grid gap-4">
              {items.map((item, index) => (
                <MotionGridItem key={getItemId(item)}>
                  <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:grid-cols-[1fr_auto] dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-brand-200">
                    <div className="grid grid-cols-[96px_1fr] gap-4">
                      <div className="relative h-24 overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 dark:border-slate-800">
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
                        <h2 className="mt-1 text-xl font-black line-clamp-1">
                          {item.product.title}
                        </h2>
                        <p className="mt-2 text-slate-500 font-medium">
                          {currency(item.product.price)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <button
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-90"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: getItemId(item),
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                        >
                          <FiMinus />
                        </button>
                        <span className="grid h-10 w-12 place-items-center font-black text-lg">
                          {item.quantity}
                        </span>
                        <button
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-90"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: getItemId(item),
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20 transition-all hover:bg-rose-600 hover:text-white"
                        onClick={() =>
                          dispatch(removeFromCart(getItemId(item)))
                        }
                        title="Remove from cart"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </article>
                </MotionGridItem>
              ))}
            </div>
            <MotionGridItem className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black tracking-tight">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-bold">{currency(total)}</span>
                </div>
                
                <div className="pt-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Promo Code
                    </span>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 transition-all"
                        onChange={(event) => setCouponCode(event.target.value)}
                        placeholder="Try NOVA10"
                        value={couponCode}
                      />
                    </div>
                  </label>
                </div>

                {couponSavings ? (
                  <div className="flex justify-between text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                    <span>Coupon savings</span>
                    <span>-{currency(couponSavings)}</span>
                  </div>
                ) : null}
                
                <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                
                <div className="mt-6 flex justify-between border-t border-slate-100 pt-6 text-2xl font-black dark:border-slate-800 tracking-tight">
                  <span>Total</span>
                  <span className="text-brand-600">{currency(finalTotal)}</span>
                </div>
                
                <Link className="mt-8 block" href="/checkout">
                  <Button className="w-full py-6 text-lg rounded-2xl shadow-brand">Checkout Now</Button>
                </Link>
                
                <p className="text-[10px] text-center text-slate-400 font-semibold uppercase tracking-widest mt-4">
                  Secure Checkout Guaranteed
                </p>
              </div>
            </MotionGridItem>
          </MotionGrid>
        )}
      </MotionSection>
    </ProtectedRoute>
  );
}
