import { authApi } from "@/lib/auth/api";

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data:image/...;base64, prefix
            const base64 = result.split(",")[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

export interface SummaryResponse {
    id: string;
    // Add other fields as per backend response
}

export const services = {
    /**
     * Process images using Google Vision API (via our proxy)
     */
    async extractTextFromImages(files: File[]): Promise<string> {
        try {
            const requests = await Promise.all(
                files.map(async (file) => {
                    const content = await fileToBase64(file);
                    return {
                        image: { content },
                        features: [{ type: "TEXT_DETECTION" }],
                    };
                })
            );

            const response = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requests }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Vision API failed");
            }

            const data = await response.json();

            // Extract text from responses
            const texts = data.responses.map((res: any) => {
                return res.textAnnotations?.[0]?.description || "";
            });

            // Join with a separator
            const combinedText = texts.filter(Boolean).join("\n\n---\n\n");

            if (!combinedText.trim()) {
                throw new Error("NO_TEXT_DETECTED");
            }

            return combinedText;

        } catch (error) {
            console.error("Text extraction failed:", error);
            throw error;
        }
    },

    /**
     * Generate summary from text
     */
    async generateSummary(text: string, userId: string | number): Promise<SummaryResponse> {
        // Use the proxy route
        const response = await fetch("/api/proxy/user-notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                notecontents: text,
                user: userId
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Summary generation failed");
        }

        return await response.json();
    },

    /**
     * Process document (PDF/DOC/PPT) via server-side conversion + OCR
     */
    async extractTextFromDocument(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/process-document", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Document processing failed");
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("Document extraction failed:", error);
            throw error;
        }
    }
};
