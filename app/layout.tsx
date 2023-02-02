import "./globals.css";
import { Inter } from "@next/font/google";
import { ReactNode, useEffect } from "react";
import { ClientProvider } from "@/components/ClientProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <ClientProvider />
      <head />
      <body
        className={`${inter.variable} font-sans text-gray-800 dark:text-gray-200 dark:bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
