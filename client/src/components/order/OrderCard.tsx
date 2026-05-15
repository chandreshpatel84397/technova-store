"use client";

import Image from "next/image";
import { FiCheckCircle, FiClock, FiPackage, FiTruck, FiAlertCircle } from "react-icons/fi";
import { Order } from "@/types";
import { currency } from "@/utils/formatters";

// Map MongoDB statuses to our 3-step UI
const getStatusIndex = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "pending") return 0;
  if (s === "processing" || s === "shipped") return 1;
  if (s === "delivered") return 2;
  if (s === "cancelled") return -1;
  return -1;
};

const steps = [
  { label: "Pending", icon: FiClock },
  { label: "Processing", icon: FiTruck },
  { label: "Delivered", icon: FiCheckCircle },
];

export const OrderCard = ({ order }: { order: Order }) => {
  const orderId = order._id;
  const orderDate = order.createdAt;
  const totalPrice = order.totalPrice;
  const currentStatus = order.orderStatus;
  const activeIndex = getStatusIndex(currentStatus);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-brand-200">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center dark:border-slate-800">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-600">Order #{orderId.slice(-6).toUpperCase()}</p>
          <h2 className="mt-1 text-xl font-black">
            Placed on {orderDate ? new Date(orderDate).toLocaleDateString() : "Unknown Date"}
          </h2>
          <div className="mt-1 flex items-center gap-2">
             <p className="text-sm text-slate-500 font-medium">{order.paymentMethod} payment</p>
             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {order.paymentStatus || 'pending'}
             </span>
          </div>
        </div>
        <div className="rounded-2xl bg-brand-50 px-6 py-3 text-right dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-600">Order total</p>
          <p className="text-2xl font-black text-brand-700 dark:text-brand-400">{currency(totalPrice)}</p>
        </div>
      </div>

      <div className="grid gap-6 p-6">
        {order.items?.map((item, index: number) => (
          <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4" key={typeof item.product === 'string' ? item.product : item.product._id}>
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100 border border-slate-50 dark:border-slate-800">
              <Image alt={item.title} fill className="object-cover" src={item.thumbnail} />
            </div>
            <div>
              <p className="font-black text-lg line-clamp-1">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500 font-medium">Qty {item.quantity} x {currency(item.price)}</p>
            </div>
            <p className="font-black text-lg">{currency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {currentStatus?.toLowerCase() === "cancelled" ? (
        <div className="m-6 flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-rose-600">Order Cancelled</p>
            <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              Your payment is refunded in your account.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 bg-slate-50 p-6 md:grid-cols-3 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
          {steps.map((step, index) => {
            const isDone = index < activeIndex || (activeIndex === 2 && index === 2);
            const isCurrent = index === activeIndex && activeIndex !== 2;
            const Icon = step.icon;

            return (
              <div 
                key={step.label}
                className={`relative rounded-2xl border p-4 transition-all ${
                  isCurrent 
                    ? "border-brand-500 bg-white shadow-soft text-brand-700 dark:bg-slate-900" 
                    : isDone
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5"
                      : "border-slate-200 text-slate-400 dark:border-slate-800 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`grid h-8 w-8 place-items-center rounded-xl ${isDone || isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-black text-sm">{step.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-tighter">
                      {isDone ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
