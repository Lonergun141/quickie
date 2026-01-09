import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const RESET_PASSWORD_URL = `${BACKEND_URL}/api/v1/auth/users/reset_password/`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate input
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Request password reset with Djoser backend
        const resetResponse = await fetch(RESET_PASSWORD_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        // Djoser returns 204 on success, but we want to return a generic message
        // to prevent email enumeration attacks
        if (!resetResponse.ok && resetResponse.status !== 204) {
            const errorData = await resetResponse.json().catch(() => ({}));

            if (errorData.email) {
                return NextResponse.json(
                    { success: false, message: "Please provide a valid email address." },
                    { status: 400 }
                );
            }
        }

        // Always return success to prevent email enumeration
        return NextResponse.json(
            {
                success: true,
                message: "If an account exists with this email, a password reset link has been sent.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send reset email. Please try again." },
            { status: 500 }
        );
    }
}
