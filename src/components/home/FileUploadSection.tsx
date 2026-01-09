"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
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
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={cn(
                    "cursor-pointer relative overflow-hidden h-[300px] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                )}
            >
                <input {...getInputProps()} />

                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300",
                    isDragActive ? "scale-110 bg-primary/20 text-primary" : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                )}>
                    <Upload size={32} strokeWidth={1.5} />
                </div>

                <div className="text-center space-y-1">
                    <p className="text-lg font-medium">
                        {isDragActive ? "Drop files here" : `Upload ${activeTab}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {activeTab === "images" ? "JPEG, PNG, WEBP" : "PDF, DOCX, PPT"}
                    </p>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm font-medium text-center">{error}</div>
            )}

            {/* File List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                    {files.map((file, idx) => (
                        <motion.div
                            key={`${file.name}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/50 flex items-center gap-3"
                        >
                            <div className="p-2 rounded-lg bg-background shadow-sm">
                                {activeTab === "images" ? <ImageIcon size={18} /> : <FileText size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onFileRemove(idx); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
