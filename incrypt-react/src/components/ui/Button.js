import React from "react";
import clsx from "clsx";

const baseClasses =
  "inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses = {
  primary:
    "bg-primary text-white border-transparent hover:bg-primary-hover focus:ring-primary",
  secondary:
    "bg-white text-text-main border-border-subtle hover:bg-bg-subtle focus:ring-primary",
  subtle:
    "bg-bg-subtle text-text-main border-transparent hover:bg-white focus:ring-primary",
  danger:
    "bg-customRed text-white border-transparent hover:bg-red-700 focus:ring-red-600",
  ghost:
    "bg-transparent text-text-main border-transparent hover:bg-bg-subtle focus:ring-primary",
};

const sizeClasses = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-2.5",
};

const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

