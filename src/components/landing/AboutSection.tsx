"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function AboutSection() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Built for Students, By Students
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg"
                    >
                        QuickEase started as a capstone project to solve real student struggles—managing time, creating study materials, and staying motivated. Using OpenAI GPT-4o, Google Vision, and ConvertAPI, it transforms your uploads into summaries, flashcards, and quizzes. With a Pomodoro Timer and Gamified Badge System, it earned an &quot;Excellent&quot; 82.29 SUS score. Now we&apos;re taking it further.
                    </motion.p>
                    <motion.div variants={fadeInUp} className="relative">
                        <div className="p-8">
                            <Image
                                src="/images/Group 658.png"
                                alt="QuickEase Dashboard"
                                width={1000}
                                height={600}
                                className="mx-auto"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
