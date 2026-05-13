import { IconType } from "react-icons";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: IconType;
}

export const EmptyState = ({ title, message, icon: Icon = FiInbox }: EmptyStateProps) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <Icon className="mx-auto mb-4 h-10 w-10 text-brand-500" />
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
  </div>
);
