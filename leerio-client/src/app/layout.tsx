import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { AptabaseProvider } from "@aptabase/react";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Leerio",
  description: "Talk to your pdfs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={figtree.variable} suppressHydrationWarning>
        <body className={`antialiased`}>
          <AptabaseProvider appKey={process.env.NEXT_PUBLIC_APTABASE_APP_KEY!}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </AptabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
