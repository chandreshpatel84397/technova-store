"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/common/ToastProvider";
import { addToCart } from "@/redux/features/cartSlice";
import { toggleWishlist } from "@/redux/features/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Product } from "@/types";
import { currency } from "@/utils/formatters";
import { getOriginalPrice } from "@/utils/pricing";
import {
  getStaggerDelay,
  premiumEase,
  revealViewport,
} from "@/components/animations/MotionReveal";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  staggerIndex?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1 },
};

const bodyVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const ProductCard = ({
  onQuickView,
  product,
  staggerIndex = 0,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const reduceMotion = useReducedMotion();

  const addProduct = () => {
    dispatch(addToCart(product));
    showToast(`${product.title} added to cart`);
  };

  const toggleFavorite = () => {
    dispatch(toggleWishlist(product));
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };
  const originalPrice = getOriginalPrice(product.price, product.discount);
  const transitionDelay = getStaggerDelay(staggerIndex, 0.08, 0.04);

  return (
    <motion.article
      className={styles.card}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={{ duration: 0.7, ease: premiumEase, delay: transitionDelay }}
      variants={cardVariants}
      viewport={revealViewport}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -8,
              scale: 1.015,
              transition: { duration: 0.25, ease: premiumEase },
            }
      }
    >
      <motion.div className={styles.imageWrap} variants={imageVariants}>
        <Image
          alt={product.title}
          className={styles.productImage}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={product.thumbnail}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand-700 shadow">
          {product.badge || `${product.discount}% off`}
        </span>
        <button
          aria-label="Toggle wishlist"
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow ${isWishlisted ? "text-red-500" : "text-slate-700"}`}
          onClick={toggleFavorite}
        >
          <FiHeart />
        </button>
      </motion.div>
      <motion.div className="space-y-4 p-5" variants={bodyVariants}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 text-lg font-black tracking-tight hover:text-brand-600">
              {product.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <FiStar className="fill-amber-400 text-amber-400" />
            {product.rating} ({product.reviews})
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black">
              {currency(product.price)}
            </span>
            {product.discount ? (
              <span className="ml-2 text-sm text-slate-400 line-through">
                {currency(originalPrice)}
              </span>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button icon={FiShoppingCart} onClick={addProduct} size="sm">
            Add
          </Button>
          <button
            aria-label="Quick view"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => onQuickView(product)}
          >
            <FiEye />
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
};
