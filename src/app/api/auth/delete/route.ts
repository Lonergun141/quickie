import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password } = body;

        const cookieStore = await cookies();
        const access = cookieStore.get("access")?.value;

        if (!access) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/auth/users/me/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${access}`,
            },
            body: JSON.stringify({ current_password: password }),
        });

        if (!response.ok) {
            // Djoser delete user endpoint might behave differently depending on config.
            // Usually it requires "current_password".
            // If the above fails, we might need to check the exact Djoser requirement.
            // But for now, returning the error from backend.
            const errorData = await response.json().catch(() => ({}));
            // Djoser DELETE often returns 204 No Content on success, so json() might fail.

            return NextResponse.json(
                { message: errorData.detail || "Failed to deactivate account" },
                { status: response.status }
            );
        }

        // Cleanup cookies
        cookieStore.delete("access");
        cookieStore.delete("refresh");

        return NextResponse.json(
            { message: "Account deactivated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
