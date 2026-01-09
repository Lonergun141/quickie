import { NextRequest, NextResponse } from "next/server";

const CONVERT_API_SECRET = process.env.CONVERT_API_SECRET;
const GOOGLE_VISION_KEY = process.env.GOOGLE_VISION_API_KEY;

export async function POST(request: NextRequest) {
    if (!CONVERT_API_SECRET || !GOOGLE_VISION_KEY) {
        console.error("Missing API Keys: CONVERT_API_SECRET or GOOGLE_VISION_API_KEY");
        return NextResponse.json(
            { code: "CONFIG_ERROR", message: "Server configuration error" },
            { status: 500 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { code: "NO_FILE", message: "No file uploaded" },
                { status: 400 }
            );
        }

        // 1. Convert Document to PNGs using ConvertAPI
        let convertApiUrl = "";
        if (file.type === "application/pdf") {
            convertApiUrl = `https://v2.convertapi.com/convert/pdf/to/png?Secret=${CONVERT_API_SECRET}`;
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            file.type === "application/vnd.ms-powerpoint"
        ) {
            convertApiUrl = `https://v2.convertapi.com/convert/ppt/to/png?Secret=${CONVERT_API_SECRET}`;
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/msword"
        ) {
            convertApiUrl = `https://v2.convertapi.com/convert/docx/to/png?Secret=${CONVERT_API_SECRET}`;
        } else {
            return NextResponse.json(
                { code: "UNSUPPORTED_TYPE", message: "Unsupported file type" },
                { status: 400 }
            );
        }

        const convertFormData = new FormData();
        convertFormData.append("File", file);

        console.log(`[Process-Doc] Converting ${file.name} (${file.type})...`);
        const convertResponse = await fetch(convertApiUrl, {
            method: "POST",
            body: convertFormData,
        });

        if (!convertResponse.ok) {
            const errorText = await convertResponse.text();
            console.error("ConvertAPI Error:", errorText);
            throw new Error("Document conversion failed");
        }

        const convertData = await convertResponse.json();
        const files = convertData.Files; // Array of { FileData: base64, ... }

        if (!files || files.length === 0) {
            throw new Error("No images returned from conversion");
        }

        console.log(`[Process-Doc] Converted to ${files.length} pages. Starting OCR...`);

        // 2. Perform OCR on each page using Google Vision
        // We limit parallel requests to avoid hitting rate limits too hard if necessary
        const texts = await Promise.all(
            files.map(async (f: any, index: number) => {
                const base64Content = f.FileData; // ConvertAPI returns raw base64 usually

                const visionResponse = await fetch(
                    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            requests: [
                                {
                                    image: { content: base64Content },
                                    features: [{ type: "TEXT_DETECTION" }],
                                },
                            ],
                        }),
                    }
                );

                if (!visionResponse.ok) {
                    console.error(`Vision API Error on page ${index + 1}`);
                    return ""; // Skip this page on error
                }

                const visionData = await visionResponse.json();
                const text = visionData.responses[0]?.textAnnotations?.[0]?.description || "";
                return text;
            })
        );

        const combinedText = texts.join("\n\n---\n\n").trim();

        if (combinedText.length === 0) {
            return NextResponse.json(
                { code: "NO_TEXT", message: "No text found in document" },
                { status: 422 } // Unprocessable Entity
            );
        }

        console.log(`[Process-Doc] Complete. Extracted ${combinedText.length} chars.`);

        return NextResponse.json({ text: combinedText });

    } catch (error: any) {
        console.error("Process Document Error:", error);
        return NextResponse.json(
            { code: "PROCESSING_ERROR", message: error.message || "Failed to process document" },
            { status: 500 }
        );
    }
}
