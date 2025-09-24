// src/App.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeContext.Provider");
  return ctx;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen grid place-items-center
                      bg-white text-gray-900
                      dark:bg-gray-900 dark:text-gray-100
                      transition-colors duration-300">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold">Dark / Light Mode</h1>
          <ThemeToggleButton />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl border px-4 py-2 transition-colors
                 bg-gray-200 text-gray-900 hover:bg-gray-300
                 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    >
      {theme === "dark" ? "라이트 모드로" : "다크 모드로"}
    </button>
  );
}
