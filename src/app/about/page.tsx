import {
  MotionSection,
  MotionText,
  MotionGrid,
  MotionGridItem,
} from "@/components/animations/MotionReveal";

export default function AboutPage() {
  return (
    <MotionSection className="container-shell py-16">
      <div className="max-w-3xl">
        <MotionText className="text-sm font-black uppercase text-brand-600">
          About
        </MotionText>
        <MotionText
          delay={0.1}
          className="mt-2 text-4xl font-black tracking-tight"
        >
          TechNova is a frontend architecture showcase wrapped in a premium
          store.
        </MotionText>
        <MotionText
          delay={0.2}
          className="mt-5 leading-8 text-slate-600 dark:text-slate-300"
        >
          This app demonstrates how a scalable customer e-commerce frontend can
          be organized for junior developers while still using production-style
          patterns: route groups, typed Redux slices, protected checkout flows,
          reusable components, mock services, and persisted customer orders.
        </MotionText>
      </div>
      <MotionGrid className="mt-12 grid gap-5 md:grid-cols-3" delay={0.3}>
        {["Modular", "Typed", "Responsive"].map((item, index) => (
          <MotionGridItem
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            key={item}
          >
            <h2 className="text-xl font-black">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Small files, clear ownership, and predictable data flow make the
              project easy to extend.
            </p>
          </MotionGridItem>
        ))}
      </MotionGrid>
    </MotionSection>
  );
}
