import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage is blocked: ignore it and use the fallback below
  }
  // First visit (or nothing valid saved): follow the system setting
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Light/dark theme state. The choice is saved in localStorage, and the theme
 * is applied as a "dark" class on <html>, which Tailwind's dark: variant and
 * the .dark color tokens in index.css both read.
 */
export function useTheme() {
  // Passing the function itself (not calling it) means it only runs on the
  // first render, so localStorage isn't read on every re-render.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Runs after render and whenever the theme changes. toggle(name, force) adds
  // the class when `force` is true and removes it when false.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage is blocked: the theme still works, it just won't be remembered
    }
  }, [theme]);

  // The updater form always works from the latest value, even if the toggle
  // fires twice before a re-render.
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
