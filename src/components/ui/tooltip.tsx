"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export function Tooltip({ content, children, className, side = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: "-top-10 left-1/2 -translate-x-1/2",
        bottom: "-bottom-10 left-1/2 -translate-x-1/2",
        left: "top-1/2 -left-2 -translate-x-full -translate-y-1/2",
        right: "top-1/2 -right-2 translate-x-full -translate-y-1/2",
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: side === 'top' ? 10 : -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none",
                            positions[side],
                            className
                        )}
                    >
                        {content}
                        {/* Arrow */}
                        <div
                            className={cn(
                                "absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rotate-45",
                                side === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
                                side === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
                                side === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
                                side === 'right' && "left-[-4px] top-1/2 -translate-y-1/2",
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </div>
    );
}

export const SimpleTooltip = Tooltip;
