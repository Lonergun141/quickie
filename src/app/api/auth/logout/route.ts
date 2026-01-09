import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear auth cookies
        cookieStore.delete("quickie_access_token");
        cookieStore.delete("quickie_refresh_token");

        return NextResponse.json(
            {
                success: true,
                message: "Logged out successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, message: "Logout failed" },
            { status: 500 }
        );
    }
}
