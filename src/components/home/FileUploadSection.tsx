"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Image as ImageIcon, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import { TabType } from "./HomeTabs";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadSectionProps {
    files: File[];
    onFilesAdded: (files: File[]) => void;
    onFileRemove: (index: number) => void;
    activeTab: TabType;
    error: string;
}

export function FileUploadSection({ files, onFilesAdded, onFileRemove, activeTab, error }: FileUploadSectionProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onFilesAdded,
        disabled: true, // Prevent file uploads
        accept: activeTab === "images"
            ? { "image/*": [] }
            : {
                "application/pdf": [],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
                "application/msword": [],
                "application/vnd.ms-powerpoint": [],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": []
            },
    });

    return (
        <div className="space-y-8">
            <div
                {...getRootProps()}
                className={cn(
                    "cursor-not-allowed relative h-[250px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 group rounded-xl",
                    "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 opacity-80"
                )}
            >
                <input {...getInputProps()} />

                {/* Corner Accents - Red for error/disabled */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/30 transition-colors rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/30 transition-colors rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/30 transition-colors rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/30 transition-colors rounded-br-lg" />

                <div className={cn(
                    "w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full",
                    "bg-red-500/10 text-red-500"
                )}>
                    <X size={20} />
                </div>

                <div className="text-center space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest text-red-500/80">
                        SYSTEM_QUOTA_EXCEEDED
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                        UPLOADS_DISABLED // INSUFFICIENT_CREDITS
                    </p>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-xs uppercase tracking-wider text-center border border-red-500/20 bg-red-500/5 py-2">
                    /// ERROR: {error}
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-3">
                        /// DATA_BUFFER [{files.length}]
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AnimatePresence>
                            {files.map((file, idx) => (
                                <motion.div
                                    key={`${file.name}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="group relative p-3 border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 flex items-center gap-4 hover:border-zinc-400 dark:hover:border-white/20 transition-colors rounded-lg"
                                >
                                    <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                        {activeTab === "images" ? <ImageIcon size={16} /> : <FileText size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate tracking-wide">{file.name}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onFileRemove(idx); }}
                                        className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
