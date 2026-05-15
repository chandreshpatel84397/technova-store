import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="container-shell py-24 text-center">
      <p className="text-sm font-black uppercase text-brand-600">404</p>
      <h1 className="mt-3 text-4xl font-black">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-500">That TechNova page is not available. Head back to the storefront.</p>
      <Link className="mt-6 inline-flex" href="/">
        <Button>Go home</Button>
      </Link>
    </main>
  );
}
