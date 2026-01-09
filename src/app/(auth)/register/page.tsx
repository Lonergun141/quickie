"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthMascot } from "@/components/auth/AuthMascot";

export default function RegisterPage() {
    return (
        <AuthSplitLayout leftContent={<AuthMascot />}>
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Create your account
                </h2>
                <p className="text-muted-foreground">
                    Start your learning journey today
                </p>
            </div>

            <RegisterForm />
        </AuthSplitLayout>
    );
}
