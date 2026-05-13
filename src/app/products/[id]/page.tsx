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

export const generateStaticParams = () => products.map((product) => ({ id: product.slug }));

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  return {
    title: product?.title || "Product",
    description: product?.description
  };
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  if (!product) notFound();
  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const originalPrice = getOriginalPrice(product.price, product.discount);

  return (
    <>
      <RecentlyViewedTracker product={product} />
      <main className="container-shell grid gap-10 py-12 lg:grid-cols-2">
        <ProductImageZoom alt={product.title} src={product.thumbnail} />
        <section>
          <p className="text-sm font-black uppercase text-brand-600">{product.category}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <FiStar className="fill-amber-400 text-amber-400" />
            {product.rating} rating from {product.reviews} reviews
          </div>
          <p className="mt-6 text-4xl font-black">
            {currency(product.price)}
            {product.discount ? <span className="ml-3 text-lg text-slate-400 line-through">{currency(originalPrice)}</span> : null}
          </p>
          <p className="mt-2 text-sm font-black text-emerald-600">{product.discount}% off</p>
          <p className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>
          <ul className="mt-6 grid gap-3">
            {product.features.map((feature) => (
              <li className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold dark:bg-slate-800" key={feature}>{feature}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-semibold text-slate-500">{product.stock} units in stock by {product.brand}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <Link href="/checkout"><Button icon={FiShoppingCart} variant="secondary">Buy now</Button></Link>
          </div>
        </section>
      </main>
      <RelatedProducts products={relatedProducts} />
      <RecentlyViewedSection currentProductId={product.id} />
    </>
  );
}
