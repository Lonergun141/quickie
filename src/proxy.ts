import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Routes that require authentication
const protectedRoutes = [
    "/Home",
    "/Flashcard",
    "/Notes",
    "/Pomodoro",
    "/Profile",
    "/Quiz",
    "/Settings",
];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

// Routes that don't require auth checks (public routes)
const publicRoutes = ["/", "/activate"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for public routes
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/activate/"))) {
        return NextResponse.next();
    }

    // Get access token from httpOnly cookie
    const accessToken = request.cookies.get("quickie_access_token")?.value;
    let isAuthenticated = false;

    if (accessToken) {
        try {
            // Verify token is not expired (basic check without secret verification)
            // The actual verification happens on the backend
            const [, payloadBase64] = accessToken.split(".");
            if (payloadBase64) {
                const payload = JSON.parse(atob(payloadBase64));
                const exp = payload.exp;
                if (exp && Date.now() < exp * 1000) {
                    isAuthenticated = true;
                }
            }
        } catch {
            // Token is invalid or expired
            isAuthenticated = false;
        }
    }

    // Check if accessing a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if accessing an auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth route while authenticated
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/Home", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
