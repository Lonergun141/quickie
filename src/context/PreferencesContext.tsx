"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { translations } from "@/lib/i18n/translations";

export type Language = "en" | "es" | "fr" | "de" | "ja" | "ko";
export type FontSize = "small" | "medium" | "large";
export type FontFamily = "sans" | "mono";

interface PreferencesContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontFamily: FontFamily;
    setFontFamily: (font: FontFamily) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    t: (key: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [fontSize, setFontSize] = useState<FontSize>("medium");
    const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedLang = localStorage.getItem("preferences-language") as Language | null;
        const storedFontSize = localStorage.getItem("preferences-font-size") as FontSize | null;
        const storedFontFamily = localStorage.getItem("preferences-font-family") as FontFamily | null;
        const storedSidebarCollapsed = localStorage.getItem("sidebarCollapsed");

        if (storedLang) setLanguage(storedLang);
        if (storedFontSize) setFontSize(storedFontSize);
        if (storedFontFamily) setFontFamily(storedFontFamily);
        if (storedSidebarCollapsed) setSidebarCollapsed(JSON.parse(storedSidebarCollapsed));
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("preferences-language", language);
            localStorage.setItem("preferences-font-size", fontSize);
            localStorage.setItem("preferences-font-family", fontFamily);
            localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));

            // Apply font size to document root for global scaling
            document.documentElement.setAttribute("data-font-size", fontSize);
            // Apply font family preference
            document.documentElement.setAttribute("data-font-family", fontFamily);
        }
    }, [language, fontSize, fontFamily, sidebarCollapsed, mounted]);

    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = translations[language];

        for (const k of keys) {
            if (current[k] === undefined) {
                // Fallback to English
                let fallback: any = translations['en'];
                for (const fk of keys) {
                    if (fallback[fk] === undefined) return key;
                    fallback = fallback[fk];
                }
                return fallback;
            }
            current = current[k];
        }
        return current;
    };

    return (
        <PreferencesContext.Provider value={{ language, setLanguage, fontSize, setFontSize, fontFamily, setFontFamily, sidebarCollapsed, setSidebarCollapsed, t }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error("usePreferences must be used within a PreferencesProvider");
    }
    return context;
}
