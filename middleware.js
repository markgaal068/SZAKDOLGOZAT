import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Ha a felhasználó nincs bejelentkezve és az admin oldalra próbál belépni, átirányítjuk a főoldalra
    if (!token && pathname.startsWith("/admin")) {
        return NextResponse.redirect(`${origin}/`);
    }

    // Ha a felhasználó be van jelentkezve és a login oldalt próbálja megnyitni, átirányítjuk az admin oldalra
    if (token && pathname === "/loginpage") {
        return NextResponse.redirect(`${origin}/admin`);
    }

    return NextResponse.next();
}

// Middleware konfiguráció a megfelelő útvonalakhoz
export const config = {
    matcher: ["/admin/:path*", "/loginpage"],
};
