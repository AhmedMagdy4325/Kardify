import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Builds a className string from any mix of strings, arrays, objects and
 * falsy values (`clsx`), then resolves conflicting Tailwind classes so the
 * last one wins (`twMerge`). For example, cn("px-2 py-1", "px-4") gives
 * "py-1 px-4", and cn("p-1", isActive && "p-3") works without extra checks.
 * Used by every shadcn/ui component, so a `className` passed to one can
 * override its default styles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
