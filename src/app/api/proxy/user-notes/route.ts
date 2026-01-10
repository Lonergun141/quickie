import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "https://d4ngk.pythonanywhere.com";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usernotes/`, {
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Check if user ID is needed - currently forwarding whatever client sends
        // Ideally backend extracts user from token, but if legacy needs 'user' field,
        // client should ensure it's in the body or we might need to fetch it (inefficient here).
        // Let's assume forwarding body + adding Auth header is enough for now.

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usernotes/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend error creating note:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
