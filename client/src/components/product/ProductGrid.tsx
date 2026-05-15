"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { FiSearch, FiLoader } from "react-icons/fi";
import { categories, SortOption, sortOptions } from "@/constants/filters";
import {
  fetchProducts,
  selectProducts,
  resetProducts,
} from "@/redux/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { filterProducts } from "@/utils/productFilters";
import { Product } from "@/types";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import {
  MotionSection,
  SkeletonGroup,
} from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";

export const ProductGrid = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { error, isLoading, items, page, pages } =
    useAppSelector(selectProducts);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  const debouncedQuery = useDebounce(query);

  // Initial fetch or fetch on filter change
  const loadInitialProducts = useCallback(() => {
    dispatch(resetProducts());
    dispatch(
      fetchProducts({
        keyword: debouncedQuery,
        category: category === "All" ? "" : category,
        pageNumber: 1,
      }),
    );
  }, [dispatch, debouncedQuery, category]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  const loadMore = () => {
    if (page < pages && !isLoading) {
      dispatch(
        fetchProducts({
          keyword: debouncedQuery,
          category: category === "All" ? "" : category,
          pageNumber: page + 1,
        }),
      );
    }
  };

  const filteredProducts = useMemo(
    () => filterProducts(items, debouncedQuery, category, sortBy),
    [category, debouncedQuery, items, sortBy],
  );

  const suggestions = query
    ? items
        .filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 4)
    : [];

  return (
    <MotionSection className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft md:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Input
              icon={FiSearch}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search laptops, audio, accessories..."
              value={query}
            />
            {suggestions.length ? (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                {suggestions.map((product) => (
                  <button
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    key={product._id || product.id}
                    onClick={() => setQuery(product.title)}
                  >
                    {product.title}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-brand-500/20"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-brand-500/20"
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            value={sortBy}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 && isLoading ? (
        <SkeletonGroup
          count={6}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        />
      ) : null}

      {error ? (
        <EmptyState title="Products unavailable" message={error} />
      ) : null}

      {!isLoading && !filteredProducts.length ? (
        <EmptyState
          title="No products found"
          message="Try a different search term, category, or sorting option."
        />
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product._id || product.id}
            onQuickView={setQuickViewProduct}
            product={product}
            staggerIndex={index % 6}
          />
        ))}
      </div>

      {page < pages && (
        <div className="flex justify-center pt-8">
          <Button
            variant="ghost"
            onClick={loadMore}
            isLoading={isLoading}
            className="group"
          >
            {isLoading ? "Loading products..." : "Load more products"}
          </Button>
        </div>
      )}

      {page === pages && items.length > 0 && (
        <p className="text-center text-sm font-semibold text-slate-400 py-8">
          You&apos;ve reached the end of our current catalog.
        </p>
      )}

      <QuickViewModal
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </MotionSection>
  );
};
