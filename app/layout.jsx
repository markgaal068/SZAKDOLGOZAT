"use client";

import { SessionProvider } from "next-auth/react";
import { Open_Sans, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});

// Sportos, kondenzált betűtípus a játékosnevekhez (pl. PlayerPopup)
const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export default function Layout({ children }) {
  return (
    <html lang="hu">
      <body className={`${openSans.variable} ${oswald.variable}`}>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
