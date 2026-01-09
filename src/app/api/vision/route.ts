import { NextRequest, NextResponse } from "next/server";

const GOOGLE_VISION_KEY = process.env.GOOGLE_VISION_API_KEY;

export async function POST(request: NextRequest) {
    if (!GOOGLE_VISION_KEY) {
        return NextResponse.json(
            { code: "CONFIG_ERROR", message: "Vision API key not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { requests } = body;

        if (!requests || !Array.isArray(requests)) {
            return NextResponse.json(
                { code: "INVALID_REQUEST", message: "Invalid request format" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requests }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Vision API Error:", error);
            return NextResponse.json(
                { code: "VISIBLE_API_ERROR", message: error.error?.message || "Vision API failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Vision Proxy Error:", error);
        return NextResponse.json(
            { code: "SERVER_ERROR", message: "Failed to process image" },
            { status: 500 }
        );
    }
}
