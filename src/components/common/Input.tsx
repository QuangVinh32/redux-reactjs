import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, icon, className = "", ...rest },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          {...rest}
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 disabled:bg-gray-50 ${icon ? "pl-10" : ""} ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""} ${className}`}
        />
      </div>
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-gray-400">{hint}</span>
      ) : null}
    </label>
  );
});

export default Input;
