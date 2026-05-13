export default function AboutPage() {
  return (
    <main className="container-shell py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-black uppercase text-brand-600">About</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">TechNova is a frontend architecture showcase wrapped in a premium store.</h1>
        <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
          This app demonstrates how a scalable customer e-commerce frontend can be organized for junior developers while still using production-style patterns: route groups, typed Redux slices, protected checkout flows, reusable components, mock services, and persisted customer orders.
        </p>
      </section>
      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {["Modular", "Typed", "Responsive"].map((item) => (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900" key={item}>
            <h2 className="text-xl font-black">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Small files, clear ownership, and predictable data flow make the project easy to extend.</p>
          </div>
        ))}
      </section>
    </main>
  );
}
