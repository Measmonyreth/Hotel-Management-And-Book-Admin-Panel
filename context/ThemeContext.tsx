"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface ThemeTokens {
  isDark: boolean;
  toggle: () => void;
  bg: string;
  surface: string;
  surfaceAlt: string;
  tableHead: string;
  border: string;
  borderLight: string;
  text: string;
  textSub: string;
  textMuted: string;
  textFaint: string;
  inputBg: string;
  inputBorder: string;
  sidebarBg: string;
  topbarBg: string;
}

const LIGHT: Omit<ThemeTokens, "isDark" | "toggle"> = {
  bg:          "#f1f5f9",
  surface:     "#ffffff",
  surfaceAlt:  "#fafbfc",
  tableHead:   "#f8fafc",
  border:      "#e8edf3",
  borderLight: "#f0f4f8",
  text:        "#1e293b",
  textSub:     "#475569",
  textMuted:   "#64748b",
  textFaint:   "#94a3b8",
  inputBg:     "#f8fafc",
  inputBorder: "#e2e8f0",
  sidebarBg:   "#ffffff",
  topbarBg:    "#ffffff",
};

const DARK: Omit<ThemeTokens, "isDark" | "toggle"> = {
  bg:          "#0f172a",
  surface:     "#1e293b",
  surfaceAlt:  "#172033",
  tableHead:   "#162032",
  border:      "#334155",
  borderLight: "#263659",
  text:        "#e2e8f0",
  textSub:     "#94a3b8",
  textMuted:   "#6b7a99",
  textFaint:   "#4a5568",
  inputBg:     "#0f172a",
  inputBorder: "#334155",
  sidebarBg:   "#0f172a",
  topbarBg:    "#1e293b",
};

function getInitialDark(): boolean {
  // Only runs on client; reads the data-theme set by the blocking script in layout.tsx
  if (typeof window === "undefined") return false;
  try {
    return (
      document.documentElement.getAttribute("data-theme") === "dark" ||
      localStorage.getItem("theme") === "dark"
    );
  } catch {
    return false;
  }
}

const ThemeContext = createContext<ThemeTokens>({
  isDark: false,
  toggle: () => {},
  ...LIGHT,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from the DOM attribute set by the blocking script — no flash
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(getInitialDark());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } catch { /* ignore */ }
  }, [isDark, mounted]);

  const toggle = () => setIsDark((v) => !v);
  const tokens = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, ...tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
