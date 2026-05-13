"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { products } from "@/mock/products";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Product } from "@/types";
import { MotionSection } from "@/components/animations/MotionReveal";

export const TrendingSlider = () => {
  const [index, setIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const trending = products
    .filter((product) => product.tags.includes("trending") || product.badge)
    .slice(0, 5);
  const activeProducts = trending.slice(index, index + 3);

  return (
    <MotionSection className="container-shell py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-brand-600">
            Trending now
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            AI-era gear people actually want
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setIndex(Math.max(0, index - 1))}
          >
            <FiChevronLeft />
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setIndex(Math.min(trending.length - 3, index + 1))}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {activeProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            onQuickView={setQuickViewProduct}
            product={product}
            staggerIndex={index}
          />
        ))}
      </div>
      <QuickViewModal
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </MotionSection>
  );
};
