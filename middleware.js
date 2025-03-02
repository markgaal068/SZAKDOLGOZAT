import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Ha a felhasználó nincs bejelentkezve és az admin oldalra próbál menni
    if (!token && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Middleware csak az /admin útvonalra
export const config = {
    matcher: "/admin/:path*",
};
