import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const ACTIVATE_URL = `${BACKEND_URL}/api/v1/auth/users/activation/`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, token } = body;

        // Validate input
        if (!uid || !token) {
            return NextResponse.json(
                { success: false, message: "Invalid activation link" },
                { status: 400 }
            );
        }

        // Activate account with Djoser backend
        const activateResponse = await fetch(ACTIVATE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, token }),
        });

        if (!activateResponse.ok) {
            const errorData = await activateResponse.json().catch(() => ({}));

            if (errorData.detail) {
                return NextResponse.json(
                    { success: false, message: errorData.detail },
                    { status: 400 }
                );
            }

            if (errorData.uid || errorData.token) {
                return NextResponse.json(
                    { success: false, message: "Invalid or expired activation link" },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: false, message: "Account activation failed. Please try again." },
                { status: activateResponse.status }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Account activated successfully! You can now sign in.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
