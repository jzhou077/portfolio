import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null; // storage can be blocked (private mode, strict privacy settings)
  }
}

export function useTheme() {
  // index.html already set data-theme before first paint; start from that.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Follow OS theme changes, unless the visitor has explicitly picked one.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStoredTheme()) setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not persisted; still works for this visit */
    }
  };

  return { theme, toggle };
}
