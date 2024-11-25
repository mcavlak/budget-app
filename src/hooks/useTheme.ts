import { useEffect, useState } from "react";

export const useTheme = () => {
  const localTheme = localStorage.getItem("theme") as "light" | "dark";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState<"light" | "dark">(
    localTheme || prefersDark || "light"
  );

  useEffect(() => {
    const initialTheme = localTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);

    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    localStorage.setItem("theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return { theme, toggleTheme };
};
