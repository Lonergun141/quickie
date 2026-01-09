import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
const REFRESH_URL = `${BACKEND_URL}/api/v1/auth/jwt/refresh/`;

// Cookie configuration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("quickie_refresh_token")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: "No refresh token available" },
                { status: 401 }
            );
        }

        // Refresh token with Djoser backend
        const refreshResponse = await fetch(REFRESH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
            // Clear invalid tokens
            cookieStore.delete("quickie_access_token");
            cookieStore.delete("quickie_refresh_token");

            return NextResponse.json(
                { success: false, message: "Token refresh failed. Please log in again." },
                { status: 401 }
            );
        }

        const tokens = await refreshResponse.json();
        const { access } = tokens;

        // Update access token cookie
        cookieStore.set("quickie_access_token", access, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60, // 1 hour
        });

        return NextResponse.json(
            {
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken: access,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json(
            { success: false, message: "Token refresh failed" },
            { status: 500 }
        );
    }
}
