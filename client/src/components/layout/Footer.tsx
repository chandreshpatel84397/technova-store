import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
    <div className="container-shell flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>TechNova - premium electronics, built as a scalable Next.js storefront.</p>
      <div className="flex gap-4 font-semibold text-slate-700 dark:text-slate-300">
        <Link href={ROUTES.about}>About</Link>
        <Link href={ROUTES.contact}>Contact</Link>
        <Link href={ROUTES.shop}>Shop</Link>
      </div>
    </div>
  </footer>
);
