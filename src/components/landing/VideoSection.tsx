"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
    };

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 sm:left-20 w-36 sm:w-72 h-36 sm:h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Section header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                        >
                            See QuickEase{" "}
                            <span className="text-primary">in Action</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeInUp}
                            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-2"
                        >
                            Watch how students use QuickEase to transform their study materials
                            into interactive learning experiences in seconds.
                        </motion.p>
                    </div>

                    {/* Video container */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative group"
                    >
                        {/* Glassmorphism frame */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                        <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Video */}
                            <div className="relative aspect-video">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    onEnded={handleVideoEnd}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    playsInline
                                    controls={isPlaying}
                                >
                                    <source src="/video/Promotional Video Final.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Play button overlay */}
                                {!isPlaying && (
                                    <motion.button
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePlayClick}
                                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                                        aria-label="Play video"
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 dark:bg-white/80 flex items-center justify-center shadow-2xl">
                                            <svg
                                                className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </motion.button>
                                )}
                            </div>

                            {/* Video info bar */}
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/50 dark:bg-white/5 border-t border-stone-200/50 dark:border-white/10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-foreground text-sm sm:text-base">QuickEase Product Demo</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground">See how AI transforms your study workflow</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>3 mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
