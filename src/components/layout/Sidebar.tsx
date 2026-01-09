"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Compass,
    Clock,
    StickyNote,
    Copy,
    Settings,
    ListTodo,
    UserCircle
} from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/hooks/useAuth";
import { LogoutModal } from "./LogoutModal";
import { MobileSidebar } from "./MobileSidebar";
import { DesktopSidebar } from "./DesktopSidebar";

interface SidebarProps {
    onToggle?: (isExpanded: boolean) => void;
    onNavigate?: (path: string) => void;
}

export function Sidebar({ onToggle, onNavigate }: SidebarProps) {
    const { t, sidebarCollapsed: isCollapsed, setSidebarCollapsed } = usePreferences();

    // Default to true for desktop (expanded) to match Home page default
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const router = useRouter();
    const { logout } = useAuth();

    // Hydration check & Mobile detection
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsMobileOpen(false); // Reset mobile menu on desktop
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sync state with parent
    useEffect(() => {
        if (onToggle) onToggle(!isCollapsed);
    }, [isCollapsed, onToggle]);

    const toggleCollapse = () => setSidebarCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        await logout();
        router.push("/login"); // Updated to match user request from previous steps if needed, generally /login is standard
    };

    const menuItems = [
        { icon: Compass, textKey: "sidebar.home", path: "/Home" },
        { icon: StickyNote, textKey: "sidebar.notes", path: "/Notes" },
        { icon: Copy, textKey: "sidebar.flashcards", path: "/Flashcards" },
        { icon: ListTodo, textKey: "sidebar.quiz", path: "/Quiz" },
        { icon: Clock, textKey: "sidebar.pomodoro", path: "/Pomodoro" },
        { icon: Settings, textKey: "sidebar.settings", path: "/Settings" },
        { icon: UserCircle, textKey: "sidebar.profile", path: "/Profile" },
    ];

    if (isMobile) {
        return (
            <>
                <MobileSidebar
                    isOpen={isMobileOpen}
                    onToggle={toggleMobileMenu}
                    menuItems={menuItems}
                    onNavigate={onNavigate}
                    onLogout={handleLogoutClick}
                    t={t}
                />
                <LogoutModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={handleLogoutConfirm}
                />
            </>
        );
    }

    return (
        <>
            <DesktopSidebar
                isCollapsed={isCollapsed}
                onToggle={toggleCollapse}
                menuItems={menuItems}
                onNavigate={onNavigate}
                onLogout={handleLogoutClick}
                t={t}
            />
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
}
