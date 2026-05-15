"use client";

import { FiShoppingCart } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/common/ToastProvider";
import { addToCart } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Product } from "@/types";

export const AddToCartButton = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  return (
    <Button
      icon={FiShoppingCart}
      onClick={() => {
        dispatch(addToCart(product));
        showToast(`${product.title} added to cart`);
      }}
      size="lg"
    >
      Add to cart
    </Button>
  );
};
