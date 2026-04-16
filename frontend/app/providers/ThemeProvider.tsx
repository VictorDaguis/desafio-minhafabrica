"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    // Carrega tema salvo no localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    // Atualiza classe e localStorage quando tema muda
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}