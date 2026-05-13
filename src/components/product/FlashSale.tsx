import Link from "next/link";
import { FiZap } from "react-icons/fi";
import { products } from "@/mock/products";
import { currency } from "@/utils/formatters";
import { getOriginalPrice } from "@/utils/pricing";
import { Button } from "@/components/ui/Button";

export const FlashSale = () => {
  const saleProducts = products.filter((product) => product.discount >= 15).slice(0, 3);

  return (
    <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 text-white">
      <div className="container-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-sky-300"><FiZap /> Flash sale</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Limited-time tech upgrades</h2>
          </div>
          <Link href="/products"><Button variant="secondary">Shop all deals</Button></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {saleProducts.map((product) => (
            <Link className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15" href={`/products/${product.slug}`} key={product.id}>
              <p className="text-sm font-bold text-sky-200">{product.category}</p>
              <h3 className="mt-2 text-xl font-black">{product.title}</h3>
              <p className="mt-4 text-2xl font-black">
                {currency(product.price)} <span className="text-sm text-slate-300 line-through">{currency(getOriginalPrice(product.price, product.discount))}</span>
              </p>
              <p className="mt-2 text-sm font-bold text-sky-200">{product.discount}% off while stocks last</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
