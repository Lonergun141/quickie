import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = "https://d4ngk.pythonanywhere.com/quickease/api/v1/pomodoro/";

// GET - Fetch pomodoro settings
export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("quickie_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // First get the list
        const listResponse = await fetch(BACKEND_URL, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!listResponse.ok) {
            return NextResponse.json(
                { error: "Failed to fetch settings" },
                { status: listResponse.status }
            );
        }

        const listData = await listResponse.json();

        // If settings exist, get detailed settings
        if (listData && listData.length > 0) {
            const settingsId = listData[0].id;
            const detailResponse = await fetch(`${BACKEND_URL}${settingsId}/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!detailResponse.ok) {
                return NextResponse.json(
                    { error: "Failed to fetch settings detail" },
                    { status: detailResponse.status }
                );
            }

            const detailData = await detailResponse.json();
            return NextResponse.json(detailData);
        }

        // No settings exist
        return NextResponse.json(null);
    } catch (error) {
        console.error("Error fetching pomodoro settings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new pomodoro settings
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("quickie_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: "Failed to create settings", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating pomodoro settings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update existing pomodoro settings
export async function PUT(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("quickie_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...settings } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Settings ID is required" },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}${id}/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: "Failed to update settings", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating pomodoro settings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
