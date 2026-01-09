import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
const SUMMARY_URL = `${BACKEND_URL}/api/v1/usernotes/`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("quickie_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(SUMMARY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body), // { notecontents: "...", user: id } 

            // Note: The backend expects 'user' ID in the body based on legacy code.
            // We might need to inject it here if the client doesn't send it, 
            // but for now let's assume client sends it or backend extracts from token.
            // Legacy code sent: { notecontents: inputText, user: userInfo.id }
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: error.detail || "Failed to generate summary" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Summary Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
