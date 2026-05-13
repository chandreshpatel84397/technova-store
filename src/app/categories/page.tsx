import Image from "next/image";
import Link from "next/link";
import { categories } from "@/constants/filters";
import { products } from "@/mock/products";
import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function CategoriesPage() {
  const visibleCategories = categories.filter((category) => category !== "All");

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
          const categoryProducts = products.filter(
            (product) => product.category === category,
          );
          const count = categoryProducts.length;
          const coverImage = categoryProducts[0]?.thumbnail ?? null;

          return (
            <MotionGridItem key={category}>
              <Link
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
                href={`/products?category=${encodeURIComponent(category)}`}
              >
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-brand-100 to-blue-200 dark:from-brand-500/20 dark:to-blue-900/50">
                  {coverImage && (
                    <Image
                      alt={category}
                      className="object-cover transition duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={coverImage}
                    />
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-black">{category}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {count} curated product{count !== 1 ? "s" : ""}
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
