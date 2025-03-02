import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    // Ellenőrizzük, hogy van-e érvényes token a sessionben
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Ha nincs token és az admin oldalra próbál menni, irányítsd át a főoldalra
    if (!token && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Ha be van jelentkezve és a login oldalon van, irányítsd át az admin oldalra
    if (token && req.nextUrl.pathname === "/loginpage") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Ha minden rendben van, folytatódik a kérés
    return NextResponse.next();
}

// Middleware csak az /admin útvonalra
export const config = {
    matcher: "/admin/:path*",
};
