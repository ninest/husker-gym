import "./globals.css";
import { Inter } from "@next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.variable} font-sans text-gray-800`}>{children}</body>
    </html>
  );
}
