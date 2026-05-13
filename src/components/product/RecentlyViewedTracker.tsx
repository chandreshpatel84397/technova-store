"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Product } from "@/types";

export const RecentlyViewedTracker = ({ product }: { product: Product }) => {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    addRecentlyViewed(product);
  }, [addRecentlyViewed, product]);

  return null;
};
