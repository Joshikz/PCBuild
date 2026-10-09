import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return { theme: savedTheme, hasSavedPreference: true };
    }

    const legacyTheme = window.localStorage.getItem("isDarkMode");
    if (legacyTheme === "true" || legacyTheme === "false") {
      return {
        theme: legacyTheme === "true" ? "dark" : "light",
        hasSavedPreference: true,
      };
    }
  } catch (error) {
    console.error("Failed to read theme from localStorage.", error);
  }

  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return {
    theme: prefersDark ? "dark" : "light",
    hasSavedPreference: false,
  };
}

export default function ThemeProvider({ children }) {
  const [themeState, setThemeState] = useState(getInitialTheme);
  const { theme, hasSavedPreference } = themeState;

  useEffect(() => {
    if (hasSavedPreference || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event) => {
      setThemeState((current) => ({
        ...current,
        theme: event.matches ? "dark" : "light",
      }));
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [hasSavedPreference]);

  useEffect(() => {
    if (!hasSavedPreference) return;

    try {
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage.", error);
    }
  }, [theme, hasSavedPreference]);

  const toggleTheme = () => {
    setThemeState((current) => ({
      theme: current.theme === "dark" ? "light" : "dark",
      hasSavedPreference: true,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
