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
    async generateSummary(text: string): Promise<SummaryResponse> {
        // This should probably call your Python backend directly via proxy 
        // OR a new Next.js route if you want to hide the backend URL.
        // For now, assuming direct backend call via authApi proxy pattern or similar.
        // Based on legacy `openAiServices.js`: `axiosInstance.post('/usernotes/', formData)`

        // Let's create a proxy for this too in `/api/summary` to keep API keys/URLs hidden if needed,
        // or just use the pattern established in `auth/api.ts` (Next.js route -> External Backend)

        const response = await fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notecontents: text }),
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
