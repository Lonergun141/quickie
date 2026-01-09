"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/auth/api";

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!uid || !token) {
            setError("Invalid reset link");
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPasswordConfirm({ uid, token, new_password: password, re_new_password: confirmPassword });
            setIsSuccess(true);
        } catch (err) {
            setError("Failed to reset password. The link may have expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-success">
                <div className="success-icon">✓</div>
                <h3>Password Reset Successful</h3>
                <p>Your password has been changed successfully.</p>
                <Link href="/login" className="auth-submit-btn">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="auth-footer">
                <p>
                    <Link href="/login">Back to Sign In</Link>
                </p>
            </div>
        </form>
    );
}
