"use client";

import Image from "next/image";
import { FiCheckCircle, FiClock, FiPackage } from "react-icons/fi";
import { Order } from "@/types";
import { currency } from "@/utils/formatters";

const statusSteps: Order["status"][] = ["Pending", "Confirmed", "Delivered"];

export const OrderCard = ({ order }: { order: Order }) => {
  const activeIndex = statusSteps.indexOf(order.status);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center dark:border-slate-800">
        <div>
          <p className="text-sm font-black uppercase text-brand-600">{order.id}</p>
          <h2 className="mt-1 text-xl font-black">Placed on {new Date(order.date).toLocaleDateString()}</h2>
          <p className="mt-1 text-sm text-slate-500">{order.paymentMethod} payment</p>
        </div>
        <div className="rounded-2xl bg-brand-50 px-5 py-3 text-right dark:bg-brand-500/10">
          <p className="text-xs font-black uppercase text-brand-600">Order total</p>
          <p className="text-2xl font-black">{currency(order.total)}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        {order.items.map((item) => (
          <div className="grid grid-cols-[72px_1fr_auto] items-center gap-4" key={item.productId}>
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-slate-100">
              <Image alt={item.title} fill className="object-cover" src={item.thumbnail} />
            </div>
            <div>
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">Qty {item.quantity} x {currency(item.price)}</p>
            </div>
            <p className="font-black">{currency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 bg-slate-50 p-5 md:grid-cols-3 dark:bg-slate-950/40">
        {statusSteps.map((status, index) => {
          const isActive = index <= activeIndex;
          const Icon = status === "Pending" ? FiClock : status === "Confirmed" ? FiCheckCircle : FiPackage;

          return (
            <div className={`rounded-2xl border p-4 ${isActive ? "border-brand-200 bg-white text-brand-700 dark:border-brand-500/30 dark:bg-slate-900" : "border-slate-200 text-slate-400 dark:border-slate-800"}`} key={status}>
              <Icon className="mb-2 h-5 w-5" />
              <p className="font-black">{status}</p>
              <p className="mt-1 text-xs font-semibold">{isActive ? "Updated" : "Upcoming"}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
};
