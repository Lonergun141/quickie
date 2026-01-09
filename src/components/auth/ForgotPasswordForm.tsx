"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/auth/api";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await authApi.forgotPassword(email);
            setIsSuccess(true);
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-success">
                <div className="success-icon">✓</div>
                <h3>Check your email</h3>
                <p>
                    We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Link href="/login" className="back-to-login">
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="auth-footer">
                <p>
                    Remember your password?{" "}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </form>
    );
}
