import { createContext, useContext } from "react";
import { useTheme } from "./use-theme";

type ThemeCtx = ReturnType<typeof useTheme>;

const ThemeContext = createContext<ThemeCtx>({
  theme: "light",
  toggle: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
