import { ButtonHTMLAttributes, ReactNode } from "react";
import { IconType } from "react-icons";
import { cn } from "@/utils/classNames";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: IconType;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ children, className, icon: Icon, size = "md", variant = "primary", ...props }: ButtonProps) => (
  <button className={cn(styles.button, styles[variant], styles[size], className)} {...props}>
    {Icon ? <Icon aria-hidden /> : null}
    {children}
  </button>
);
