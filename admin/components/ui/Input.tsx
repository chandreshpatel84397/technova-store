import { InputHTMLAttributes } from "react";
import { IconType } from "react-icons";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
  label?: string;
  wrapperClassName?: string;
}

export const Input = ({ icon: Icon, label, className = "", wrapperClassName = "", ...props }: InputProps) => (
  <label className={`block ${wrapperClassName}`}>
    {label ? <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span> : null}
    <span className="relative block">
      {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> : null}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-brand-500/20 ${Icon ? "pl-10" : ""} ${className}`}
        {...props}
      />
    </span>
  </label>
);
