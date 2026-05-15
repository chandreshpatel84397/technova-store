import { SortOption } from "@/constants/filters";
import { Product } from "@/types";

export const filterProducts = (products: Product[], query: string, category: string, sortBy: SortOption) => {
  const normalizedQuery = query.trim().toLowerCase();
  const productList = Array.isArray(products) ? products : [];

  const filtered = productList.filter((product) => {
    const matchesCategory = 
      category === "All" || 
      product.category.toLowerCase().trim() === category.toLowerCase().trim();
    
    const matchesQuery =
      !normalizedQuery ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.brand.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)));

    return matchesCategory && matchesQuery;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") return b.discount - a.discount;
    return Number(Boolean(b.badge)) - Number(Boolean(a.badge));
  });
};
