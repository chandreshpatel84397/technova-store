import Link from "next/link";
import { notFound } from "next/navigation";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { Button } from "@/components/ui/Button";
import { getProductBySlug, products } from "@/mock/products";
import { currency } from "@/utils/formatters";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { BuyNowButton } from "@/components/product/BuyNowButton";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getOriginalPrice } from "@/utils/pricing";
import {
  MotionImage,
  MotionSection,
  MotionText,
} from "@/components/animations/MotionReveal";
import { Product } from "@/types";

export const generateStaticParams = () =>
  products.map((product) => ({ id: product.slug }));

export async function generateMetadata({ params }: { params: { id: string } }) {
  const slug = params.id;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`);
    if (res.ok) {
      const product = await res.json();
      return {
        title: `${product.title} | TechNova`,
        description: product.description,
      };
    }
  } catch (e) {}

  const product = getProductBySlug(slug);
  return {
    title: product?.title || "Product",
    description: product?.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const slug = params.id;
  
  // Try to fetch from API first
  let product: any = null;
  let relatedProducts: Product[] = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      product = await res.json();
      
      // Fetch related products
      const relatedRes = await fetch(`${baseUrl}/api/products?category=${product?.category}&pageSize=5`, { next: { revalidate: 60 } });
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        relatedProducts = relatedData.products.filter((p: any) => p._id !== product?._id).slice(0, 4);
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  // Fallback to mock data if API fails or product not found
  if (!product) {
    product = getProductBySlug(slug) || null;
    if (product) {
      relatedProducts = products
        .filter((item) => item.category === product?.category && item._id !== product?._id)
        .slice(0, 4);
    }
  }

  if (!product) notFound();
  
  const originalPrice = getOriginalPrice(product.price, product.discount);
  const productId = product._id;
  
  // Normalize product for client components
  const normalizedProduct = {
    ...product,
    features: product.features || [],
    images: product.images || [product.thumbnail]
  };

  return (
    <>
      <RecentlyViewedTracker product={normalizedProduct} />
      <MotionSection className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <MotionImage>
            <ProductImageZoom alt={normalizedProduct.title} src={normalizedProduct.thumbnail} />
          </MotionImage>
          <MotionSection delay={0.1}>
            <MotionText
              delay={0.15}
              className="text-sm font-black uppercase text-brand-600"
            >
              {normalizedProduct.category}
            </MotionText>
            <MotionText
              delay={0.2}
              className="mt-2 text-4xl font-black tracking-tight md:text-5xl"
            >
              {normalizedProduct.title}
            </MotionText>
            <MotionText
              delay={0.25}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500"
            >
              <FiStar className="fill-amber-400 text-amber-400" />
              {normalizedProduct.rating} rating from {normalizedProduct.reviews} reviews
            </MotionText>
            <MotionText delay={0.3} className="mt-6 text-4xl font-black">
              {currency(normalizedProduct.price)}
              {normalizedProduct.discount ? (
                <span className="ml-3 text-lg text-slate-400 line-through">
                  {currency(originalPrice)}
                </span>
              ) : null}
            </MotionText>
            <MotionText
              delay={0.35}
              className="mt-2 text-sm font-black text-emerald-600"
            >
              {normalizedProduct.discount}% off
            </MotionText>
            <MotionText
              delay={0.4}
              className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300"
            >
              {normalizedProduct.description}
            </MotionText>
            <MotionText delay={0.45} className="mt-6 grid gap-3">
              {normalizedProduct.features.map((feature: string) => (
                <div
                  key={feature}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-slate-800"
                >
                  {feature}
                </div>
              ))}
            </MotionText>
            <MotionText
              delay={0.5}
              className="mt-5 text-sm font-semibold text-slate-500"
            >
              {normalizedProduct.stock} units in stock by {normalizedProduct.brand}
            </MotionText>
            <MotionText delay={0.55} className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton product={normalizedProduct} />
              <BuyNowButton product={normalizedProduct} />
            </MotionText>
          </MotionSection>
        </div>
      </MotionSection>
      <RelatedProducts products={relatedProducts} />
      <RecentlyViewedSection currentProductId={productId} />
    </>
  );
}
