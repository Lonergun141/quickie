import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// POST - Create flashcards for a note
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const { noteId } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/create-flashcards/${noteId}/`, {
            method: "POST",
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating flashcards:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
