
import { Open_Sans } from "next/font/google";
import "./globals.css";


import Header from "@/components/Header";


const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
  variable: '--font-open-sans', 
});

export default function Layout({ children }) {
  return (
    <html lang="hu">
      <body className={openSans.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
