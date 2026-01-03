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
  openGraph: {
    title: "Leerio: Talk to your pdfs",
    description:
      "An AI-powered platform to interact with your PDF documents effortlessly.",
    url: "https://leerio.vercel.app",
    siteName: "Leerio",
    images: [
      {
        url: "https://leerio.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Leerio cover image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leerio: Talk to your PDFs",
    description:
      "An AI-powered platform to interact with your PDF documents effortlessly.",
    images: ["https://leerio.vercel.app/og.png"],
  },
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
