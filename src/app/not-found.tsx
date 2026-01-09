"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 404 Number */}
                    <h1
                        className="text-[10rem] md:text-[14rem] font-bold text-primary/20 leading-none select-none"
                        style={{ fontFamily: 'var(--font-incompleeta)' }}
                    >
                        404
                    </h1>

                    {/* Message */}
                    <div className="-mt-12 md:-mt-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Page not found
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                            Oops! The page you're looking for seems to have wandered off.
                            Let's get you back on track.
                        </p>

                        {/* Back to Home Button */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                Back to Home
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
