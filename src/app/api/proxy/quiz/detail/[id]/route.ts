import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

async function resolveTestId(headers: any, id: string) {
    let testId = id;
    try {
        const quizzesRes = await fetch(`${BACKEND_URL}/quickease/api/v1/user-quizzes/`, { headers });
        if (quizzesRes.ok) {
            const quizzes = await quizzesRes.json();
            const match = quizzes.find((q: any) => String(q.note) === id || (q.note && String(q.note.id) === id));
            if (match && match.id) {
                testId = match.id;
            }
        }
    } catch (e) {
        console.warn("Failed to resolve UserTest ID, using Note ID.");
    }
    return testId;
}

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

        const headers = {
            "Authorization": `JWT ${access}`,
            "Content-Type": "application/json",
        };

        const testId = await resolveTestId(headers, id);

        let response = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${testId}/`, {
            method: 'DELETE',
            headers
        });

        // If 404 and we switched ID, try original
        if (response.status === 404 && testId !== id) {
            response = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${id}/`, {
                method: 'DELETE',
                headers
            });
        }

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

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
        console.error("Error deleting quiz:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const { id } = await params;
        const body = await request.json();

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const headers = {
            "Authorization": `JWT ${access}`,
            "Content-Type": "application/json",
        };

        const testId = await resolveTestId(headers, id);

        let response = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${testId}/`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        // If 404 and we switched ID, try original
        if (response.status === 404 && testId !== id) {
            response = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${id}/`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body),
            });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
