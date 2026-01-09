"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p>gae</p>
            <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => logout()}>Logout</button>
        </div>
    );
}