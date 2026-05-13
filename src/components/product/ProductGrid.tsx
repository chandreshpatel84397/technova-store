"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { categories, SortOption, sortOptions } from "@/constants/filters";
import { fetchProducts, selectProducts } from "@/redux/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { filterProducts } from "@/utils/productFilters";
import { Product } from "@/types";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";

export const ProductGrid = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { error, isLoading, items } = useAppSelector(selectProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [visibleCount, setVisibleCount] = useState(6);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const debouncedQuery = useDebounce(query);
  const filteredProducts = useMemo(() => filterProducts(items, debouncedQuery, category, sortBy), [category, debouncedQuery, items, sortBy]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const suggestions = query ? items.filter((product) => product.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];

  useEffect(() => {
    if (!items.length) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  useEffect(() => {
    setVisibleCount(6);
  }, [category, debouncedQuery, sortBy]);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom) setVisibleCount((count) => Math.min(count + 3, filteredProducts.length));
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [filteredProducts.length]);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft md:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Input icon={FiSearch} onChange={(event) => setQuery(event.target.value)} placeholder="Search laptops, audio, accessories..." value={query} />
            {suggestions.length ? (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                {suggestions.map((product) => (
                  <button className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" key={product.id} onClick={() => setQuery(product.title)}>
                    {product.title}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold dark:border-slate-700 dark:bg-slate-950" onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold dark:border-slate-700 dark:bg-slate-950" onChange={(event) => setSortBy(event.target.value as SortOption)} value={sortBy}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton className="h-96" key={index} />)}
        </div>
      ) : null}
      {error ? <EmptyState title="Products unavailable" message={error} /> : null}
      {!isLoading && !filteredProducts.length ? <EmptyState title="No products found" message="Try a different search term, category, or sorting option." /> : null}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => <ProductCard key={product.id} onQuickView={setQuickViewProduct} product={product} />)}
      </div>
      {visibleCount < filteredProducts.length ? <p className="text-center text-sm font-semibold text-slate-500">Scroll for more products</p> : null}
      <QuickViewModal onClose={() => setQuickViewProduct(null)} product={quickViewProduct} />
    </section>
  );
};
