"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
        ),
        title: "Offline Mode",
        description: "Study anywhere without internet. Your materials sync automatically when you reconnect.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
        ),
        title: "Smart Capture",
        description: "Point your camera at any text, handwriting, or diagram. AI extracts and organizes it instantly.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
        ),
        title: "AI Magic",
        description: "Transform any content into flashcards, quizzes, and summaries with one tap.",
    },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative"
        >
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10" />
            <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-transparent group-hover:shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
        </motion.div>
    );
}

export function MobileAppSection() {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Animated gradient orbs - using primary color */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <motion.h2
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                        >
                            <span className="text-primary">Take learning</span>
                            <br />
                            <span className="text-foreground">everywhere</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            Originally built as an Android-only companion app, we&apos;re continuously improving
                            the mobile experience based on user feedback from our capstone defense.
                        </motion.p>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Phone Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative flex justify-center order-2 lg:order-1"
                        >
                            {/* Glow effect behind phone */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-80 h-80 bg-gradient-to-br from-primary/40 via-primary/30 to-primary/20 rounded-full blur-3xl" />
                            </div>

                            {/* Phone mockup */}
                            <div className="relative z-20">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Image
                                        src="/images/iPhone 16 Pro.png"
                                        alt="QuickEase Mobile App"
                                        width={600}
                                        height={600}
                                        className="drop-shadow-2xl"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right - Features & QR */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8 order-1 lg:order-2"
                        >
                            {/* Feature Cards */}
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <FeatureCard key={feature.title} feature={feature} index={index} />
                                ))}
                            </div>

                            {/* Download Section - Android Only */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-6 pt-4"
                            >
                                <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-700">
                                    <Image
                                        src="/images/qrCode.png"
                                        alt="Download QR Code"
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Scan to download</p>
                                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                        </svg>
                                        Scan to Download APK
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
