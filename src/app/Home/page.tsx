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
import { useToast } from "@/context/ToastContext";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

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
    const { toast } = useToast();

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
        if (!user?.id) {
            toast.error("You must be logged in to generate summaries.");
            return;
        }

        setIsLoading(true);
        try {
            if (activeTab === "text") {
                if (wordCount < 10) {
                    toast.warning("Please enter at least 10 words to generate a summary.");
                    setIsLoading(false);
                    return;
                }
                const response = await services.generateSummary(inputText, user.id);
                if (response?.id) router.push(`/Notes/${response.id}`);

            } else if (activeTab === "images") {
                if (uploadedImages.length === 0) {
                    toast.warning("Please upload at least one image.");
                    setIsLoading(false);
                    return;
                }
                const extractedText = await services.extractTextFromImages(uploadedImages);
                const response = await services.generateSummary(extractedText, user.id);
                if (response?.id) router.push(`/Notes/${response.id}`);

            } else if (activeTab === "documents") {
                if (uploadedDocuments.length === 0) {
                    toast.warning("Please upload at least one document.");
                    setIsLoading(false);
                    return;
                }
                const textResults = await Promise.all(uploadedDocuments.map(doc => services.extractTextFromDocument(doc)));
                const combinedText = textResults.join("\n\n---\n\n");
                const response = await services.generateSummary(combinedText, user.id);
                if (response?.id) router.push(`/Notes/${response.id}`);
            }
        } catch (error: any) {
            console.error("Generation Error:", error);
            toast.error(error.message || "An unexpected error occurred.");
            // Optional: Still show modal for very complex errors if desired, but toast is usually enough
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background w-full text-foreground selection:bg-foreground/10 overflow-hidden font-sans">
            <Sidebar onToggle={handleSidebarToggle} />

            <main className={cn(
                "transition-all duration-300 flex-grow relative min-h-screen lg:h-screen lg:overflow-hidden",
                isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Cinematic Background Ambience - Adapts to Mode */}
                <div className="absolute inset-0 pointer-events-none -z-10 bg-background transition-colors duration-500">
                    <div className="absolute top-0 right-0 w-[80vh] h-[80vh] bg-zinc-900/5 dark:bg-zinc-900/50 rounded-full blur-[150px] dark:mix-blend-screen opacity-40 transition-all duration-500" />
                    <div className="absolute bottom-0 left-[10%] w-[60vh] h-[60vh] bg-zinc-100/50 dark:bg-white/5 rounded-full blur-[120px] dark:mix-blend-screen opacity-20 transition-all duration-500" />
                </div>

                {/* Grid Layout */}
                <div className="h-auto lg:h-[calc(100vh)] w-full max-w-[1920px] mx-auto p-4 lg:p-6 lg:pl-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch overflow-visible lg:overflow-hidden">

                    {/* Left Column (Navigation & Greeting) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full py-2">

                        {/* Greeting Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-8 flex-shrink-0 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden relative"
                        >
                            <QuickieGreetings />
                        </motion.div>

                        {/* Guide Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                            className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-0 flex-grow overflow-hidden relative hidden lg:block shadow-2xl shadow-black/5 dark:shadow-black/20"
                        >
                            <div className="absolute inset-0 overflow-y-auto p-8">
                                <ContextualGuide activeTab={activeTab} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (Workspace Studio) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                        className="lg:col-span-8 h-full py-2"
                    >
                        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl h-full flex flex-col overflow-hidden relative shadow-2xl shadow-black/5 dark:shadow-black/40 text-foreground">

                            {/* Header */}
                            <div className="flex-shrink-0 p-6 px-8 border-b border-zinc-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">STUDIO</h2>
                                    <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Input Capture</p>
                                </div>
                                <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />
                            </div>

                            {/* Content Area - Scrollable */}
                            <div className="flex-grow overflow-y-auto p-8 relative">
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
                            <div className="flex-shrink-0 p-6 px-8 border-t border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-950/20 flex justify-end items-center gap-4">
                                <div className="text-xs text-muted-foreground tracking-widest hidden md:block">
                                    SYSTEM READY
                                </div>
                                <Tooltip content="Click this button to generate summary notes" side="left">
                                    <div className="inline-block"> {/* Wrapper needed */}
                                        <AuthButton
                                            onClick={handleGenerate}
                                            isLoading={isLoading}
                                            loadingText="PROCESSING..."
                                            disabled={
                                                (activeTab === "text" && wordCount < 10) ||
                                                (activeTab !== "text" && filesToDisplay.length === 0)
                                            }
                                            className="rounded-lg px-8 py-3 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Create Summary Notes
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

            <FullPageLoader
                isLoading={isLoading}
                text="Generating Summary..."
                subtext="Analyzing your content and extracting key insights..."
            />
        </div>
    );
}
