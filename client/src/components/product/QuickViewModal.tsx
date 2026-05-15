"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/common/ToastProvider";
import { addToCart } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Product } from "@/types";
import { currency } from "@/utils/formatters";
import { getOriginalPrice } from "@/utils/pricing";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal = ({ onClose, product }: QuickViewModalProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  if (!product) return null;
  const originalPrice = getOriginalPrice(product.price, product.discount);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.div animate={{ opacity: 1, scale: 1 }} className="grid max-w-3xl overflow-hidden rounded-3xl bg-white shadow-soft md:grid-cols-2 dark:bg-slate-900" initial={{ opacity: 0, scale: 0.96 }}>
        <div className="relative aspect-square">
          <Image alt={product.title} fill className="object-cover" src={product.thumbnail} />
        </div>
        <div className="p-6">
          <button aria-label="Close quick view" className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800" onClick={onClose}>
            <FiX />
          </button>
          <p className="text-xs font-bold uppercase text-brand-600">{product.category}</p>
          <h2 className="mt-2 text-2xl font-black">{product.title}</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
          <p className="mt-5 text-3xl font-black">
            {currency(product.price)}
            {product.discount ? <span className="ml-2 text-base text-slate-400 line-through">{currency(originalPrice)}</span> : null}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              icon={FiShoppingCart}
              onClick={() => {
                dispatch(addToCart(product));
                showToast("Added to cart");
              }}
            >
              Add to cart
            </Button>
            <Link className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold dark:border-slate-700" href={`/products/${product.slug}`}>
              View details
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
