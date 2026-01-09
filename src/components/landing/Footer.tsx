import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-8 px-6 bg-foreground text-background border-t border-background/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-sm opacity-60">
                    © {new Date().getFullYear()} QuickEase. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link
                        href="/privacy"
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
