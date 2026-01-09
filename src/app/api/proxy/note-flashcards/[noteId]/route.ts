import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest, { params }: { params: Promise<{ noteId: string }> }) {
    try {
        const { noteId } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/note-flashcards/${noteId}/`, {
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[note-flashcards] Fetch failed: ${response.status} ${errorText}`);
            return NextResponse.json({ message: "Failed to fetch flashcards" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching note flashcards:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
