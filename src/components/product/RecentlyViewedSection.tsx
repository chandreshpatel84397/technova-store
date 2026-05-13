"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";

export const RecentlyViewedSection = ({ currentProductId }: { currentProductId?: string }) => {
  const { getRecentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(getRecentlyViewed().filter((product) => product.id !== currentProductId));
  }, [currentProductId, getRecentlyViewed]);

  if (!products.length) return null;

  return (
    <section className="container-shell border-t border-slate-200 py-12 dark:border-slate-800">
      <p className="text-sm font-black uppercase text-brand-600">Recently viewed</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight">Pick up where you left off</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} onQuickView={setQuickViewProduct} product={product} />
        ))}
      </div>
      <QuickViewModal onClose={() => setQuickViewProduct(null)} product={quickViewProduct} />
    </section>
  );
};
