export const Spinner = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-sm font-semibold text-slate-500">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    <span>{label}</span>
  </div>
);
