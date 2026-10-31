import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "xs" | "icon";

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

// Base buttons style
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

// Buttons styles based on variants
const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-hover",
  ghost: "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
  danger: "bg-danger text-accent-foreground hover:opacity-90",
};

// Buttons styles based on size
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  icon: "p-2",
  xs: "p-1",
};

export default function AppButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  // Join all strings into one
  const classes = [base, sizes[size], variants[variant], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}
