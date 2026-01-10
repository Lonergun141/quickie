import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const { id } = await params;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/choice-answer-detail/${id}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        // Attempt json only if not 204, though DELETEs usually return 204.
        // If content-length > 0 or content-type json, parse.
        // Safer to just try text then parse if needed, but standard fetch behavior:

        let data = {};
        try {
            const text = await response.text();
            if (text) data = JSON.parse(text);
        } catch (e) {
            // ignore
        }

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error deleting quiz answer detail:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
