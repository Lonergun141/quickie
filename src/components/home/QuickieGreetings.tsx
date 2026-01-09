"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function QuickieGreetings() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-1 mb-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                    <span className="text-foreground">Hello, </span>
                    <span className="text-primary/90">
                        {user?.firstname || "Creator"}
                    </span>
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-muted-foreground font-light"
            >
                Ready to transform your knowledge?
            </motion.p>
        </div>
    );
}
