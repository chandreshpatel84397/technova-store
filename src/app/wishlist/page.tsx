"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { selectWishlistItems } from "@/redux/features/wishlistSlice";
import { useAppSelector } from "@/redux/hooks";
import { Product } from "@/types";
import { useState } from "react";

export default function WishlistPage() {
  const products = useAppSelector(selectWishlistItems);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <ProtectedRoute>
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black">Wishlist</h1>
        {!products.length ? (
          <div className="mt-8"><EmptyState title="No saved products yet" message="Tap the heart on any product to save it here." /></div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} onQuickView={setQuickViewProduct} product={product} />)}
          </div>
        )}
        <QuickViewModal onClose={() => setQuickViewProduct(null)} product={quickViewProduct} />
      </main>
    </ProtectedRoute>
  );
}
