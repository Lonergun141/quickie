"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthBranding } from "@/components/auth/AuthBranding";

export default function LoginPage() {
    return (
        <AuthSplitLayout leftContent={<AuthBranding />}>
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="text-muted-foreground">
                    Continue your learning journey
                </p>
            </div>

            <LoginForm />
        </AuthSplitLayout>
    );
}
