import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PageTransition } from "@/components/common/PageTransition";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse TechNova products with search, filters, sorting, quick view, and infinite scroll."
};

export default function ProductsPage() {
  return (
    <PageTransition>
      <main className="container-shell py-12">
        <div className="mb-8">
          <p className="text-sm font-black uppercase text-brand-600">Shop</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Explore premium tech</h1>
          <p className="mt-3 max-w-2xl text-slate-500">Filter, sort, search, quick view, wishlist, and cart interactions are wired through typed Redux.</p>
        </div>
        <Suspense fallback={<Spinner label="Loading products" />}>
          <ProductGrid />
        </Suspense>
      </main>
    </PageTransition>
  );
}
