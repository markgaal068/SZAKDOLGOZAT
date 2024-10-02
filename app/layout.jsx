// layout.jsx
import { Open_Sans } from "next/font/google";
import "./globals.css";

// Importing the Header component
import Header from "@/components/Header";

// Define the Open Sans font loader at the module level
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
