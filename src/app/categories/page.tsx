import Image from "next/image";
import Link from "next/link";
import { categories } from "@/constants/filters";
import { products } from "@/mock/products";

export default function CategoriesPage() {
  const visibleCategories = categories.filter((category) => category !== "All");

  return (
    <main className="container-shell py-12">
      <p className="text-sm font-black uppercase text-brand-600">Categories</p>
      <h1 className="mt-2 text-4xl font-black">Shop by category</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => {
          const categoryProducts = products.filter((product) => product.category === category);
          const count = categoryProducts.length;
          // Pick the first product thumbnail as the category cover image
          const coverImage = categoryProducts[0]?.thumbnail ?? null;

          return (
            <Link
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
              href={`/products?category=${encodeURIComponent(category)}`}
              key={category}
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
                <p className="mt-1 text-sm text-slate-500">{count} curated product{count !== 1 ? "s" : ""}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
