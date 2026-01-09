import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// GET - Fetch single note
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usernotes/${id}/`, {
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
        console.error("Error fetching note:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// PUT - Update note
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const body = await req.json();

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usernotes/${id}/`, {
            method: "PUT",
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

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE - Delete note
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/quickease/api/v1/usernotes/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `JWT ${access}`,
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json({ message: "Note deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
