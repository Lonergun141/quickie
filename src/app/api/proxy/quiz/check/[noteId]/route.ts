import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// GET - Check if quiz exists for a note
export async function GET(
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

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest/questions/${noteId}/`, {
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ exists: false, questions: [] }, { status: 200 });
        }

        const data = await response.json();
        const exists = Array.isArray(data) && data.length > 0;

        return NextResponse.json({ exists, questions: data }, { status: 200 });
    } catch (error) {
        console.error("Error checking quiz:", error);
        return NextResponse.json({ exists: false, questions: [] }, { status: 200 });
    }
}
