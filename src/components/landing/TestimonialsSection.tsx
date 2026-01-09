"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { testimonials, type Testimonial } from "@/lib/constants";

interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}

function QuoteIcon() {
    return (
        <svg className="w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
    );
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative"
        >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10" />

            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 h-full transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                    <QuoteIcon />
                </div>

                {/* Testimonial text */}
                <p className="text-foreground mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg pr-6">
                    &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                    >
                        <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-primary/20"
                        />

                    </motion.div>
                    <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {/* Section header */}
                    <div className="text-center mb-10 sm:mb-16">
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                        >
                            Validated by Real{" "}
                            <span className="text-primary">User Testing</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeInUp}
                            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-2"
                        >
                            Feedback from our capstone defense panel and user testing sessions
                            that helped us achieve an &quot;Excellent&quot; 82.29 SUS score.
                        </motion.p>
                    </div>

                    {/* Testimonial cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} index={index} />
                        ))}
                    </div>

                    {/* Stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
                    >
                        {[
                            { value: "82.29", label: "SUS Score" },
                            { value: "Excellent", label: "Usability Rating" },
                            { value: "Commendable", label: "User Experience and Design" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="text-center px-4"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

