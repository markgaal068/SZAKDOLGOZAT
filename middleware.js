import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    // Fetch the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If no token and the user is trying to access the admin page, redirect to the homepage
    if (!token && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // If the user is logged in and tries to access the login page, redirect to the admin page
    if (token && req.nextUrl.pathname === "/loginpage") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // If everything is fine, continue with the request
    return NextResponse.next();
}

// Middleware configuration to match only the /admin route and its subroutes
export const config = {
    matcher: "/admin/:path*",
};