import { ButtonHTMLAttributes, ReactNode } from "react";
import { IconType } from "react-icons";
import { FiLoader } from "react-icons/fi";
import { cn } from "@/utils/classNames";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: IconType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  className, 
  icon: Icon, 
  size = "md", 
  variant = "primary", 
  isLoading,
  disabled,
  ...props 
}: ButtonProps) => (
  <button 
    className={cn(styles.button, styles[variant], styles[size], className)} 
    disabled={isLoading || disabled}
    {...props}
  >
    {isLoading ? <FiLoader className="animate-spin" aria-hidden /> : Icon ? <Icon aria-hidden /> : null}
    {children}
  </button>
);
