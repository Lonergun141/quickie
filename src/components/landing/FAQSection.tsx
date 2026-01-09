"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { faqData, type FAQItem } from "@/lib/constants";

interface FAQItemProps {
    faq: FAQItem;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQAccordionItem({ faq, isOpen, onToggle }: FAQItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
            >
                <span className="font-medium pr-4 text-foreground">{faq.question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-primary flex-shrink-0"
                >
                    +
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 sm:left-20 w-36 sm:w-72 h-36 sm:h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid lg:grid-cols-2 gap-16 items-start"
                >
                    {/* Left side - Title */}
                    <motion.div variants={fadeInUp} className="lg:sticky lg:top-32 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                            Frequently Asked{" "}
                            <span className="text-primary">Questions</span>
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                            Common questions about QuickEase. This project is still evolving, so feel free to reach out with suggestions!
                        </p>
                    </motion.div>

                    {/* Right side - FAQ Accordion */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                        {faqData.map((faq, index) => (
                            <FAQAccordionItem
                                key={index}
                                faq={faq}
                                index={index}
                                isOpen={openFaq === index}
                                onToggle={() => handleToggle(index)}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

