"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { Sidebar } from "@/components/layout/Sidebar";
import { QuickieGreetings } from "@/components/home/QuickieGreetings";
import { ContextualGuide } from "@/components/home/ContextualGuide";
import { Modal, ModalType } from "@/components/ui/Modal";
import { AuthButton } from "@/components/auth/AuthButton";
import { HomeTabs, TabType } from "@/components/home/HomeTabs";
import { TextInputSection } from "@/components/home/TextInputSection";
import { FileUploadSection } from "@/components/home/FileUploadSection";
import { Tooltip } from "@/components/ui/tooltip";

// Services & Utils
import { services } from "@/lib/api/services";
import { validateFiles } from "@/lib/utils/fileValidation";

export default function HomePage() {
    // State
    const [activeTab, setActiveTab] = useState<TabType>("text");
    const [inputText, setInputText] = useState("");
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
    const [fileError, setFileError] = useState("");
    const [textError, setTextError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    // Modal State
    const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: ModalType }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
    });

    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();

    const characterCount = inputText.length;
    const wordCount = inputText.split(/\s+/).filter(Boolean).length;
    const filesToDisplay = activeTab === "images" ? uploadedImages : uploadedDocuments;

    const handleSidebarToggle = useCallback((isExpanded: boolean) => {
        setIsSidebarExpanded(isExpanded);
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        if (text.length > 10000) setTextError("Text cannot exceed 10000 characters.");
        else setTextError("");
    };

    const handleFilesAdded = (newFiles: File[]) => {
        if (activeTab === "text") return;
        const { validFiles, error } = validateFiles(newFiles, activeTab);

        if (error) {
            setFileError(error);
            return;
        }

        setFileError("");
        if (activeTab === "images") {
            setUploadedImages((prev) => [...prev, ...validFiles]);
        } else {
            setUploadedDocuments((prev) => [...prev, ...validFiles]);
        }
    };

    const handleFileRemove = (index: number) => {
        if (activeTab === "images") {
            setUploadedImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            if (activeTab === "text") {
                if (wordCount < 10) {
                    setModal({ isOpen: true, title: "Insufficient Content", message: "Please enter at least 10 words.", type: "warning" });
                    setIsLoading(false);
                    return;
                }
                const response = await services.generateSummary(inputText);
                if (response?.id) router.push(`/Notes/${response.id}`);

            } else if (activeTab === "images") {
                if (uploadedImages.length === 0) {
                    setModal({ isOpen: true, title: "No Images", message: "Please upload at least one image.", type: "warning" });
                    setIsLoading(false);
                    return;
                }
                const extractedText = await services.extractTextFromImages(uploadedImages);
                const response = await services.generateSummary(extractedText);
                if (response?.id) router.push(`/Notes/${response.id}`);

            } else if (activeTab === "documents") {
                if (uploadedDocuments.length === 0) {
                    setModal({ isOpen: true, title: "No Documents", message: "Please upload at least one document.", type: "warning" });
                    setIsLoading(false);
                    return;
                }
                const textResults = await Promise.all(uploadedDocuments.map(doc => services.extractTextFromDocument(doc)));
                const combinedText = textResults.join("\n\n---\n\n");
                const response = await services.generateSummary(combinedText);
                if (response?.id) router.push(`/Notes/${response.id}`);
            }
        } catch (error: any) {
            console.error("Generation Error:", error);
            setModal({ isOpen: true, title: "Error", message: error.message || "An unexpected error occurred.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background w-full text-foreground selection:bg-primary/20 overflow-hidden">
            <Sidebar onToggle={handleSidebarToggle} />

            <main className={cn(
                "transition-all duration-300 flex-grow relative min-h-screen lg:h-screen lg:overflow-hidden",
                isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Background Ambient */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                </div>

                {/* Grid Layout - Bento Style (Compact & Spacious) */}
                <div className="h-auto lg:h-[calc(100vh-32px)] w-full max-w-[1920px] mx-auto p-4 lg:p-4 lg:pl-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-stretch overflow-visible lg:overflow-hidden">

                    {/* Left Column (Navigation & Greeting) */}
                    <div className="lg:col-span-4 flex flex-col gap-5 h-full">

                        {/* Greeting Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-6 flex-shrink-0"
                        >
                            <QuickieGreetings />
                        </motion.div>

                        {/* Guide Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-0 flex-grow overflow-hidden relative hidden lg:block"
                        >
                            <div className="absolute inset-0 overflow-y-auto p-6">
                                <ContextualGuide activeTab={activeTab} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (Workspace Studio) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-8 h-full"
                    >
                        <div className="bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl h-full flex flex-col overflow-hidden relative">

                            {/* Card Glow - Reduced Opacity */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                            {/* Header */}
                            <div className="flex-shrink-0 p-5 px-6 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight">Quickie</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">Start studying now.</p>
                                </div>
                                <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />
                            </div>

                            {/* Content Area - Scrollable */}
                            <div className="flex-grow overflow-y-auto p-6 relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        {activeTab === "text" && (
                                            <TextInputSection
                                                value={inputText}
                                                onChange={handleTextChange}
                                                error={textError}
                                                characterCount={characterCount}
                                            />
                                        )}

                                        {(activeTab === "images" || activeTab === "documents") && (
                                            <FileUploadSection
                                                files={filesToDisplay}
                                                onFilesAdded={handleFilesAdded}
                                                onFileRemove={handleFileRemove}
                                                activeTab={activeTab}
                                                error={fileError}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer / Actions */}
                            <div className="flex-shrink-0 p-5 px-6 bg-gradient-to-t from-white/50 to-transparent dark:from-zinc-950/50 flex justify-end">
                                <Tooltip content="Process your content to create summaries, flashcards, and quizzes" side="left">
                                    <div className="inline-block"> {/* Wrapper needed because Tooltip needs a ref or element, and AuthButton might be complex */}
                                        <AuthButton
                                            onClick={handleGenerate}
                                            isLoading={isLoading}
                                            loadingText="Processing..."
                                            disabled={
                                                (activeTab === "text" && wordCount < 10) ||
                                                (activeTab !== "text" && filesToDisplay.length === 0)
                                            }
                                            className="rounded-xl px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Generate Quickie
                                        </AuthButton>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}
