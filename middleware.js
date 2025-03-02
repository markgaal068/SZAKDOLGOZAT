import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const url = req.nextUrl.clone();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Ha nincs token és az admin oldalt próbálja elérni, visszairányítjuk a főoldalra
    if (!token && url.pathname.startsWith("/admin")) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // Ha van token, és a login oldalt próbálja megnyitni, irányítsuk át az admin panelre
    if (token && url.pathname === "/loginpage") {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Middleware konfiguráció az admin felületre és a login oldalra
export const config = {
    matcher: ["/admin/:path*", "/loginpage"],
};
