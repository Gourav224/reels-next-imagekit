import { NextResponse } from "next/server";
import { auth } from "./lib/auth"; // Assuming your auth function works here

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Allow auth-related routes
    if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/register"
    ) {
        return NextResponse.next();
    }

    // Public routes
    if (pathname === "/" || pathname.startsWith("/api/videos")) {
        return NextResponse.next();
    }

    // If user is not authenticated, redirect to login page
    if (!req.auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow the request if the user is authenticated
    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
