import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("eq-theme") as Theme) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("eq-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle, isDark: theme === "dark" };
};
