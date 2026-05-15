"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiHeart, FiShoppingCart, FiStar, FiImage } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/common/ToastProvider";
import { addToCart } from "@/redux/features/cartSlice";
import { toggleWishlistLocal } from "@/redux/features/wishlistSlice";
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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80";

export const ProductCard = ({
  onQuickView,
  product,
  staggerIndex = 0,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [imgSrc, setImgSrc] = useState(product.thumbnail);
  const [imgError, setImgError] = useState(false);
  
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const currentProductId = product._id;
  const isWishlisted = wishlist.some((item) => item._id === currentProductId);
  const reduceMotion = useReducedMotion();

  const addProduct = () => {
    dispatch(addToCart(product));
    showToast(`${product.title} added to cart`);
  };

  const toggleFavorite = () => {
    dispatch(toggleWishlistLocal(product));
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
        {!imgError ? (
          <Image
            alt={product.title}
            className={styles.productImage}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={imgSrc || FALLBACK_IMAGE}
            onError={() => {
              setImgError(true);
              setImgSrc(FALLBACK_IMAGE);
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
            <FiImage size={40} />
            <span className="mt-2 text-xs font-bold">Image Unavailable</span>
          </div>
        )}
        
        {product.discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-[10px] font-black text-white shadow-lg">
            {product.badge || `-${product.discount}%`}
          </span>
        )}
        
        <button
          aria-label="Toggle wishlist"
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-glass transition-all hover:scale-110 active:scale-90 ${isWishlisted ? "text-rose-500" : "text-slate-700"}`}
          onClick={toggleFavorite}
        >
          <FiHeart className={isWishlisted ? "fill-current" : ""} />
        </button>
      </motion.div>
      
      <motion.div className="space-y-4 p-6" variants={bodyVariants}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-600">
            {product.category}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 text-lg font-black tracking-tight hover:text-brand-600 line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : ""} />
              ))}
            </div>
            <span>({product.reviews} reviews)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currency(product.price)}
            </span>
            {product.discount > 0 ? (
              <span className="ml-2 text-sm text-slate-400 line-through font-bold">
                {currency(originalPrice)}
              </span>
            ) : null}
          </div>
        </div>
        
        <div className="grid grid-cols-[1fr_auto] gap-2 pt-2">
          <Button icon={FiShoppingCart} onClick={addProduct} className="rounded-2xl font-black">
            Add to Cart
          </Button>
          <button
            aria-label="Quick view"
            className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900"
            onClick={() => onQuickView(product)}
          >
            <FiEye size={20} />
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
};
