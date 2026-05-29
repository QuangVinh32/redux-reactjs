import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  full?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-rose-500 hover:bg-rose-600 text-white shadow-sm disabled:bg-rose-300",
  secondary:
    "bg-amber-400 hover:bg-amber-500 text-white shadow-sm disabled:bg-amber-200",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  full,
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {!loading && icon}
      {children}
    </button>
  );
}
