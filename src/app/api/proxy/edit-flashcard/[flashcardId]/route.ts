import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ flashcardId: string }> }) {
    try {
        const { flashcardId } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/edit-flashcard/${flashcardId}/`, {
            method: 'PUT',
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[edit-flashcard] Failed: ${response.status} ${errorText}`);
            return NextResponse.json({ message: "Failed to edit flashcard" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error editing flashcard:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
