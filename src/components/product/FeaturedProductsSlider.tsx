"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { products } from "@/mock/products";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { MotionSection } from "@/components/animations/MotionReveal";

export const FeaturedProductsSlider = () => {
  const [index, setIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const featuredProducts = products
    .filter(
      (product) => product.tags.includes("featured") || product.rating >= 4.7,
    )
    .slice(0, 8);
  const activeProducts = featuredProducts.slice(index, index + 4);
  const maxIndex = Math.max(featuredProducts.length - 4, 0);

  return (
    <MotionSection className="container-shell py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-brand-600">
            Featured picks
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Premium electronics for everyday upgrades
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Previous featured products"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setIndex(Math.max(0, index - 1))}
          >
            <FiChevronLeft />
          </button>
          <button
            aria-label="Next featured products"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setIndex(Math.min(maxIndex, index + 1))}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
