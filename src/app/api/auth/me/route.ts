import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
const USER_INFO_URL = `${BACKEND_URL}/api/v1/auth/users/me/`;

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("quickie_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to fetch user info" },
                { status: response.status }
            );
        }

        const userData = await response.json();

        // Transform to User interface
        const user = {
            id: userData.id?.toString() || "",
            email: userData.email,
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
        };

        return NextResponse.json(
            {
                success: true,
                data: { user },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
