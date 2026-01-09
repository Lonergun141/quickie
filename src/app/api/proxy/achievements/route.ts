import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user");

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const url = userId
            ? `${BACKEND_URL}/quickease/api/v1/achievements/?user=${userId}`
            : `${BACKEND_URL}/quickease/api/v1/achievements/`;

        const response = await fetch(url, {
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
        console.error("Error fetching achievements:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const body = await req.json();

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/achievements/`, {
            method: "POST",
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating achievement:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
