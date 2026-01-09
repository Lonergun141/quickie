"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ColorTheme =
    | "quickease"
    | "shadcn"
    | "twitter"
    | "facebook"
    | "supabase"
    | "spotify"
    | "github"
    | "discord";

interface ColorThemeContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const colorThemes: { id: ColorTheme; name: string; color: string }[] = [
    { id: "quickease", name: "QuickEase", color: "#63A7FF" },
    { id: "shadcn", name: "Shadcn", color: "#000000" },
    { id: "twitter", name: "Twitter/X", color: "#1DA1F2" },
    { id: "facebook", name: "Facebook", color: "#1877F2" },
    { id: "supabase", name: "Supabase", color: "#3ECF8E" },
    { id: "spotify", name: "Spotify", color: "#1DB954" },
    { id: "github", name: "GitHub", color: "#6e5494" },
    { id: "discord", name: "Discord", color: "#5865F2" },
];

export function ColorThemeProvider({ children }: { children: ReactNode }) {
    const [colorTheme, setColorTheme] = useState<ColorTheme>("quickease");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("color-theme") as ColorTheme | null;
        if (stored && colorThemes.some(t => t.id === stored)) {
            setColorTheme(stored);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("color-theme", colorTheme);
            // Apply data attribute to html element
            document.documentElement.setAttribute("data-color-theme", colorTheme);
        }
    }, [colorTheme, mounted]);

    return (
        <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
            {children}
        </ColorThemeContext.Provider>
    );
}

export function useColorTheme() {
    const context = useContext(ColorThemeContext);
    if (!context) {
        throw new Error("useColorTheme must be used within a ColorThemeProvider");
    }
    return context;
}
