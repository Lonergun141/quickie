import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
const LOGIN_URL = `${BACKEND_URL}/api/v1/auth/jwt/create/`;
const USER_INFO_URL = `${BACKEND_URL}/api/v1/auth/users/me/`;

// Cookie configuration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Authenticate with Djoser backend
        const authResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!authResponse.ok) {
            const errorData = await authResponse.json().catch(() => ({}));

            if (authResponse.status === 400) {
                return NextResponse.json(
                    {
                        success: false,
                        message: errorData.detail || "Invalid login credentials. Please check your email and password."
                    },
                    { status: 400 }
                );
            }

            if (authResponse.status === 401) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid email or password. Please ensure your account is activated."
                    },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                { success: false, message: "Login failed. Please try again." },
                { status: authResponse.status }
            );
        }

        const tokens = await authResponse.json();
        const { access, refresh } = tokens;

        // Fetch user info
        const userResponse = await fetch(USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        let user = { id: "", email, firstname: "", lastname: "" };
        if (userResponse.ok) {
            const userData = await userResponse.json();
            user = {
                id: userData.id?.toString() || "",
                email: userData.email,
                firstname: userData.firstname || "",
                lastname: userData.lastname || "",
            };
        }

        // Create response with user data
        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                data: {
                    user,
                },
            },
            { status: 200 }
        );

        // Set httpOnly cookies for tokens
        const cookieStore = await cookies();
        cookieStore.set("quickie_access_token", access, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60, // 1 hour
        });
        cookieStore.set("quickie_refresh_token", refresh, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
