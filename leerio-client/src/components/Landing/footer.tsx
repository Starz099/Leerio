"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "GitHub", href: "https://github.com/Starz099/Leerio" },
  ];

  return (
    <footer className="border-border/40 bg-background border-t py-12 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-purple-600 font-bold text-white">
              L
            </div>
            <span className="text-foreground">Leerio</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            © {currentYear} Starz099
          </div>
        </div>
      </div>
    </footer>
  );
}
