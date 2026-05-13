"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <FiCheckCircle className="text-brand-500" />
          {message}
        </motion.div>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
