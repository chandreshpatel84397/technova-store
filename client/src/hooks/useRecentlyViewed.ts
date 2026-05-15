"use client";

import { useCallback } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { Product } from "@/types";
import { readStorage, writeStorage } from "@/utils/storage";

export const useRecentlyViewed = () => {
  const getRecentlyViewed = useCallback(
    () => readStorage<Product[]>(STORAGE_KEYS.recentlyViewed, []).filter((product) => product.title && product.thumbnail),
    []
  );

  const addRecentlyViewed = useCallback((product: Product) => {
    const next = [product, ...getRecentlyViewed().filter((item) => item._id !== product._id)].slice(0, 4);
    writeStorage(STORAGE_KEYS.recentlyViewed, next);
  }, [getRecentlyViewed]);

  return { addRecentlyViewed, getRecentlyViewed };
};
