export const categories = [
  "All",
  "Laptops",
  "Mobile Phones",
  "Headphones",
  "Smart Watches",
  "Keyboards",
  "Gaming Mouse",
  "Monitors",
  "Speakers",
  "Mobile Accessories",
  "Cameras",
  "Tablets"
];

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Discount", value: "discount" }
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];
