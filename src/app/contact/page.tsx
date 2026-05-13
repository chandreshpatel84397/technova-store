import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <main className="container-shell grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
      <section>
        <p className="text-sm font-black uppercase text-brand-600">Contact</p>
        <h1 className="mt-2 text-4xl font-black">Let us help you choose better tech.</h1>
        <div className="mt-8 grid gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <p className="flex items-center gap-3"><FiMail /> support@technova.dev</p>
          <p className="flex items-center gap-3"><FiPhone /> +1 555 0184</p>
          <p className="flex items-center gap-3"><FiMapPin /> Remote-first commerce studio</p>
        </div>
      </section>
      <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" placeholder="Your name" />
          <Input label="Email" placeholder="you@example.com" type="email" />
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Message</span>
          <textarea className="min-h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950" placeholder="Tell us what you are looking for" />
        </label>
        <Button className="mt-5" type="button">Send message</Button>
      </form>
    </main>
  );
}
