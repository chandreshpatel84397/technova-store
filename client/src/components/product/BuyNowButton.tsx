"use client";

import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Product } from "@/types";

export const BuyNowButton = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    router.push("/checkout");
  };

  return (
    <Button
      icon={FiArrowRight}
      onClick={handleBuyNow}
      variant="secondary"
      size="lg"
    >
      Buy now
    </Button>
  );
};
