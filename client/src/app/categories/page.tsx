"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { categories } from "@/constants/filters";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts, selectProducts } from "@/redux/features/productSlice";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

const CATEGORY_IMAGES: Record<string, string> = {
  "Laptops": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  "Mobile Phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  "Mobile Accessories": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  "Gaming Mouse": "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  "Smart Watches": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80",
  "Keyboards": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
  "Monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  "Speakers": "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
  "Cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
};

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(selectProducts);
  const visibleCategories = categories.filter((category) => category !== "All");

  useEffect(() => {
    // Fetch some products to get current catalog counts if needed
    if (items.length === 0) {
      dispatch(fetchProducts({ pageSize: 100 }));
    }
  }, [dispatch, items.length]);

  return (
    <MotionSection className="container-shell py-12">
      <MotionText className="text-sm font-black uppercase text-brand-600">
        Categories
      </MotionText>
      <MotionText delay={0.1} className="mt-2 text-4xl font-black">
        Shop by category
      </MotionText>
      <MotionGrid
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        delay={0.2}
      >
        {visibleCategories.map((category) => {
          const count = items.filter(p => p.category === category).length;
          const coverImage = CATEGORY_IMAGES[category] || (items.find(p => p.category === category)?.thumbnail);

          return (
            <MotionGridItem key={category}>
              <Link
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900"
                href={`/products?category=${encodeURIComponent(category)}`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {coverImage ? (
                    <Image
                      alt={category}
                      className="object-cover transition duration-500 group-hover:scale-110"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={coverImage}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-50 dark:bg-brand-500/10">
                       <span className="text-brand-600 font-bold">{category}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-black tracking-tight">{category}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500 flex items-center justify-between">
                    <span>Explore Collection</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                       {count > 0 ? `${count} items` : 'Browse'}
                    </span>
                  </p>
                </div>
              </Link>
            </MotionGridItem>
          );
        })}
      </MotionGrid>
    </MotionSection>
  );
}
