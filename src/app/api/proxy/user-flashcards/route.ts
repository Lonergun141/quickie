import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        console.log("[user-flashcards proxy] All cookies:", cookieStore.getAll());
        console.log("[user-flashcards proxy] Access token:", access ? "EXISTS" : "MISSING");

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/user-flashcards/`, {
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
        });

        console.log("[user-flashcards proxy] Backend response status:", response.status);
        console.log("[user-flashcards proxy] Backend URL:", `${BACKEND_URL}/quickease/api/v1/user-flashcards/`);

        const responseText = await response.text();
        console.log("[user-flashcards proxy] Response preview:", responseText.substring(0, 200));

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("[user-flashcards proxy] Failed to parse JSON. Full response:", responseText);
            return NextResponse.json({ message: "Backend returned invalid response", error: responseText.substring(0, 500) }, { status: 500 });
        }

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
