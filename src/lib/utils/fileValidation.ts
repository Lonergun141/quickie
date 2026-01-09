export interface FileValidationResult {
    validFiles: File[];
    error?: string;
}

export const validateFiles = (
    newFiles: File[],
    activeTab: "images" | "documents"
): FileValidationResult => {
    const allowedExtensions =
        activeTab === "images"
            ? ["jpg", "jpeg", "png"]
            : ["pdf", "doc", "docx", "ppt", "pptx"];

    const invalidFiles = newFiles.filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        return !allowedExtensions.includes(ext);
    });

    const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
        return { validFiles: [], error: "One or more files exceed the 10MB limit." };
    } else if (invalidFiles.length > 0) {
        return { validFiles: [], error: "One or more files have invalid types." };
    }

    return { validFiles: newFiles };
};
