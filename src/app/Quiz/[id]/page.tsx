"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useQuizSession } from "@/hooks/useQuizSession";
import {
    QuizSessionHeader,
    QuizSessionNavigator,
    QuizSessionQuestionCard,
    QuizSessionNavigation,
    QuizSessionMobileBar,
    QuizSubmitModal
} from "@/components/Quiz/Session";

export default function QuizSessionPage() {
    const params = useParams();
    const router = useRouter();
    const noteId = params.id as string;
    const searchParams = useSearchParams();
    const retake = searchParams.get('retake') === 'true';

    const { state, stats, actions } = useQuizSession(noteId, retake);
    const { questions, answers, flags, currentIndex, loading, submitting, navigatorOpen, confirmModalOpen } = state;
    const { answeredCount, unansweredCount, flaggedCount, progressPercent } = stats;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm">Loading quiz...</p>
                </motion.div>
            </div>
        );
    }

    // Empty state
    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <X className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-muted-foreground">No questions found for this quiz.</p>
                <button
                    onClick={() => router.back()}
                    className="text-primary hover:underline text-sm font-medium"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] opacity-50" />
            </div>

            {/* Header */}
            <QuizSessionHeader
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                answeredCount={answeredCount}
                flaggedCount={flaggedCount}
                progressPercent={progressPercent}
                submitting={submitting}
                onBack={() => router.back()}
                onNavigatorOpen={() => actions.setNavigatorOpen(true)}
                onSubmit={actions.handleSubmitClick}
            />

            {/* Navigator Sidebar */}
            <QuizSessionNavigator
                isOpen={navigatorOpen}
                onClose={() => actions.setNavigatorOpen(false)}
                totalQuestions={questions.length}
                currentIndex={currentIndex}
                answers={answers}
                flags={flags}
                answeredCount={answeredCount}
                flaggedCount={flaggedCount}
                progressPercent={progressPercent}
                onJumpTo={actions.handleJumpTo}
            />

            {/* Main Content */}
            <main className="pt-24 md:pt-28 pb-32 md:pb-12 px-4 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Question Card */}
                            <QuizSessionQuestionCard
                                questionNumber={currentIndex + 1}
                                questionText={currentQuestion.TestQuestion}
                                choices={currentQuestion.choices || []}
                                selectedAnswer={answers[currentIndex]}
                                isFlagged={flags[currentIndex]}
                                onAnswer={actions.handleAnswer}
                                onFlag={actions.handleFlag}
                            />

                            {/* Navigation */}
                            <QuizSessionNavigation
                                currentIndex={currentIndex}
                                totalQuestions={questions.length}
                                answers={answers}
                                onPrevious={actions.handlePrevious}
                                onNext={actions.handleNext}
                                onJumpTo={actions.setCurrentIndex}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <QuizSessionMobileBar
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                submitting={submitting}
                onPrevious={actions.handlePrevious}
                onNext={actions.handleNext}
                onSubmit={actions.handleSubmitClick}
            />

            {/* Submit Confirmation Modal */}
            <QuizSubmitModal
                isOpen={confirmModalOpen}
                onClose={() => actions.setConfirmModalOpen(false)}
                onConfirm={actions.handleConfirmSubmit}
                answeredCount={answeredCount}
                unansweredCount={unansweredCount}
                flaggedCount={flaggedCount}
                totalQuestions={questions.length}
                submitting={submitting}
            />
        </div>
    );
}
