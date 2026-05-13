import Link from "next/link";
import { notFound } from "next/navigation";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { Button } from "@/components/ui/Button";
import { getProductBySlug, products } from "@/mock/products";
import { currency } from "@/utils/formatters";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getOriginalPrice } from "@/utils/pricing";
import {
  MotionImage,
  MotionSection,
  MotionText,
} from "@/components/animations/MotionReveal";

export const generateStaticParams = () =>
  products.map((product) => ({ id: product.slug }));

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  return {
    title: product?.title || "Product",
    description: product?.description,
  };
}

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductBySlug(params.id);
  if (!product) notFound();
  const relatedProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);
  const originalPrice = getOriginalPrice(product.price, product.discount);

  return (
    <>
      <RecentlyViewedTracker product={product} />
      <MotionSection className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <MotionImage>
            <ProductImageZoom alt={product.title} src={product.thumbnail} />
          </MotionImage>
          <MotionSection delay={0.1}>
            <MotionText
              delay={0.15}
              className="text-sm font-black uppercase text-brand-600"
            >
              {product.category}
            </MotionText>
            <MotionText
              delay={0.2}
              className="mt-2 text-4xl font-black tracking-tight md:text-5xl"
            >
              {product.title}
            </MotionText>
            <MotionText
              delay={0.25}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500"
            >
              <FiStar className="fill-amber-400 text-amber-400" />
              {product.rating} rating from {product.reviews} reviews
            </MotionText>
            <MotionText delay={0.3} className="mt-6 text-4xl font-black">
              {currency(product.price)}
              {product.discount ? (
                <span className="ml-3 text-lg text-slate-400 line-through">
                  {currency(originalPrice)}
                </span>
              ) : null}
            </MotionText>
            <MotionText
              delay={0.35}
              className="mt-2 text-sm font-black text-emerald-600"
            >
              {product.discount}% off
            </MotionText>
            <MotionText
              delay={0.4}
              className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300"
            >
              {product.description}
            </MotionText>
            <MotionText delay={0.45} className="mt-6 grid gap-3">
              {product.features.map((feature) => (
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
              {product.stock} units in stock by {product.brand}
            </MotionText>
            <MotionText delay={0.55} className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton product={product} />
              <Link href="/checkout">
                <Button icon={FiShoppingCart} variant="secondary">
                  Buy now
                </Button>
              </Link>
            </MotionText>
          </MotionSection>
        </div>
      </MotionSection>
      <RelatedProducts products={relatedProducts} />
      <RecentlyViewedSection currentProductId={product.id} />
    </>
  );
}
