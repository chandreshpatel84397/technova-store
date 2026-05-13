import Link from "next/link";
import { FiArrowRight, FiCpu, FiShield, FiTruck } from "react-icons/fi";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/Button";
import { FeaturedProductsSlider } from "@/components/product/FeaturedProductsSlider";
import { FlashSale } from "@/components/product/FlashSale";
import { TrendingSlider } from "@/components/product/TrendingSlider";
import { RecentOrdersBanner } from "@/components/order/RecentOrdersBanner";
import Image from "next/image";

export default function HomePage() {
  return (
    <PageTransition>
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(135deg,#f8fafc,#eef7ff)] py-20 dark:bg-[radial-gradient(circle_at_top_left,#0f3a5f,transparent_34%),linear-gradient(135deg,#020617,#0f172a)] md:py-28">
          <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-black uppercase text-brand-700 dark:text-brand-100">Next generation storefront</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">TechNova</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Premium laptops, audio, gaming, smart home, and desk gear with a polished shopping experience and a production-grade frontend architecture.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products"><Button icon={FiArrowRight} size="lg">Shop products</Button></Link>
                <Link className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900" href="/categories">Browse categories</Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/70 bg-white/50 p-4 shadow-glass backdrop-blur dark:border-white/10 dark:bg-white/10">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
  {
    name: "NovaBook Pro",
    copy: "Creator-grade performance",
    price: "$1,599",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "AuraPods Max",
    copy: "Adaptive noise control",
    price: "$349",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "PulseFit X2",
    copy: "Health tracking",
    price: "$229",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Arc Console S",
    copy: "4K gaming",
    price: "$499",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  },
].map((item) => (
  <div
    className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900"
    key={item.name}
  >
    <img
      src={item.image}
      alt={item.name}
      className="mb-5 h-32 w-full rounded-2xl object-cover"
    />

    <h3 className="font-black">{item.name}</h3>

    <p className="mt-1 text-sm text-slate-500">
      {item.copy}
    </p>

    <p className="mt-4 text-xl font-black">
      {item.price}
    </p>
  </div>
))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-5 py-12 md:grid-cols-3">
          {[
            { icon: FiTruck, title: "Fast fulfillment", copy: "Mock logistics states and order-ready UI patterns." },
            { icon: FiShield, title: "Customer account", copy: "Protected wishlist, cart, checkout, profile, and personal order history." },
            { icon: FiCpu, title: "Modern stack", copy: "Next.js 14, Redux Toolkit, Sass Modules, Framer Motion, and TailwindCSS." }
          ].map((item) => (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900" key={item.title}>
              <item.icon className="h-8 w-8 text-brand-600" />
              <h3 className="mt-4 text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</p>
            </div>
          ))}
        </section>

        <TrendingSlider />
        <RecentOrdersBanner />
        <FeaturedProductsSlider />
        <FlashSale />
      </main>
    </PageTransition>
  );
}
