"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function RegisterForm() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();

    const { register } = useAuth();

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        if (!firstname.trim()) { newErrors.firstname = "First name is required"; isValid = false; }
        if (!lastname.trim()) { newErrors.lastname = "Last name is required"; isValid = false; }

        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 12) {
            newErrors.password = "Password must be at least 12 characters";
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        if (!termsAccepted) {
            newErrors.terms = "You must accept the terms and conditions";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await register({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: email.trim(),
                password,
                re_password: confirmPassword,
            });
            setShowSuccessModal(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
            setErrors({ form: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push("/login");
    };

    // Filter non-letter characters from names
    const handleNameChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        setter(value);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="auth-form space-y-5" noValidate>
                {errors.form && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        {errors.form}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                    <AuthInput
                        id="firstname"
                        label="First Name"
                        value={firstname}
                        onChange={(e) => {
                            handleNameChange(setFirstname)(e);
                            if (errors.firstname) setErrors({ ...errors, firstname: undefined });
                        }}
                        placeholder="First name"
                        error={errors.firstname}
                        disabled={isLoading}
                    />
                    <AuthInput
                        id="lastname"
                        label="Last Name"
                        value={lastname}
                        onChange={(e) => {
                            handleNameChange(setLastname)(e);
                            if (errors.lastname) setErrors({ ...errors, lastname: undefined });
                        }}
                        placeholder="Last name"
                        error={errors.lastname}
                        disabled={isLoading}
                    />
                </div>

                <AuthInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    error={errors.email}
                    disabled={isLoading}
                    autoComplete="email"
                />

                <div className="space-y-2">
                    <AuthInput
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        placeholder="Create a password"
                        error={errors.password}
                        disabled={isLoading}
                        autoComplete="new-password"
                    />
                    <PasswordStrengthMeter password={password} />
                </div>

                <AuthInput
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    disabled={isLoading}
                    autoComplete="new-password"
                />

                <div className="space-y-2 py-5">
                    <div className="flex items-start gap-3">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => {
                                    setTermsAccepted(e.target.checked);
                                    if (errors.terms) setErrors({ ...errors, terms: undefined });
                                }}
                                disabled={isLoading}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                        <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-1">
                            I accept the <Link href="/terms" className="text-primary hover:underline">terms of use</Link> and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm text-red-500 font-medium ml-7">{errors.terms}</p>
                    )}
                </div>

                <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                >
                    Create Account
                </AuthButton>

                <div className="text-center py-5">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Welcome to Quickie!</h3>
                        <p>
                            Hi <strong>{firstname}</strong>, thank you for joining!
                        </p>
                        <p>
                            Please check your email inbox and click the activation link
                            to verify your account.
                        </p>
                        <div className="modal-status">
                            <span className="status-dot"></span>
                            Verification email sent to your inbox
                        </div>
                        <button
                            onClick={handleSuccessClose}
                            className="modal-button"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
