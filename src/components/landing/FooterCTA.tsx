"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function FooterCTA() {
    return (
        <section className="py-24 px-6 bg-foreground text-background">
            <div className="max-w-7xl mx-auto text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-sm text-muted mb-4 opacity-60"
                    >
                        Ready to transform your studying?
                    </motion.p>
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl md:text-6xl font-bold mb-12"
                    >
                        Study Less. Learn More.
                    </motion.h2>
                    <motion.div

                        variants={fadeInUp}
                        className="text-[6rem] md:text-[10rem] font-black tracking-tight leading-none opacity-10"
                        style={{ fontFamily: 'var(--font-incompleeta)' }}
                    >
                        <span className="text-primary">QUICK</span>
                        <span>EASE</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
