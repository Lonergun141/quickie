import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_URL}/api/v1/auth/users/reset_password_confirm/`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, token, new_password, re_new_password } = body;

        // Validate input
        if (!uid || !token || !new_password) {
            return NextResponse.json(
                { success: false, message: "Invalid reset link or missing password" },
                { status: 400 }
            );
        }

        if (new_password !== re_new_password) {
            return NextResponse.json(
                { success: false, message: "Passwords do not match" },
                { status: 400 }
            );
        }

        // Reset password with Djoser backend
        const resetResponse = await fetch(RESET_PASSWORD_CONFIRM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, token, new_password, re_new_password }),
        });

        if (!resetResponse.ok) {
            const errorData = await resetResponse.json().catch(() => ({}));

            if (errorData.token || errorData.uid) {
                return NextResponse.json(
                    { success: false, message: "Invalid or expired reset link. Please request a new one." },
                    { status: 400 }
                );
            }

            if (errorData.new_password) {
                const passwordError = Array.isArray(errorData.new_password)
                    ? errorData.new_password[0]
                    : errorData.new_password;
                return NextResponse.json(
                    { success: false, message: passwordError },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: false, message: "Password reset failed. Please try again." },
                { status: resetResponse.status }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Password reset successful! You can now sign in with your new password.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
