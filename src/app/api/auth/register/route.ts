import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const REGISTER_URL = `${BACKEND_URL}/api/v1/auth/users/`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, re_password, firstname, lastname } = body;

        // Validate input
        if (!email || !password || !firstname || !lastname) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        if (password !== re_password) {
            return NextResponse.json(
                { success: false, message: "Passwords do not match" },
                { status: 400 }
            );
        }

        // Register with Djoser backend
        const registerResponse = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                re_password,
                firstname,
                lastname,
            }),
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json().catch(() => ({}));

            // Handle specific error cases
            if (errorData.email) {
                return NextResponse.json(
                    { success: false, message: "This email is already registered." },
                    { status: 400 }
                );
            }

            if (errorData.password) {
                const passwordError = Array.isArray(errorData.password)
                    ? errorData.password[0]
                    : errorData.password;
                return NextResponse.json(
                    { success: false, message: passwordError },
                    { status: 400 }
                );
            }

            if (errorData.detail) {
                return NextResponse.json(
                    { success: false, message: errorData.detail },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: false, message: "Registration failed. Please try again." },
                { status: registerResponse.status }
            );
        }

        const userData = await registerResponse.json();

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful. Please check your email to activate your account.",
                data: {
                    user: {
                        id: userData.id?.toString() || "",
                        email: userData.email,
                        firstname: userData.firstname || firstname,
                        lastname: userData.lastname || lastname,
                    },
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
