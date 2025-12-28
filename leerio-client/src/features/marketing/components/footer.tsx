"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "GitHub", href: "https://github.com/Starz099/Leerio" },
  ];

  return (
    <footer className="border-border/40 bg-background border-t py-12 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-end justify-between gap-8 sm:flex-row">
          <div className="text-muted-foreground flex items-end gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Leerio Logo"
                width={36}
                height={36}
                className="size-10"
              />
            </Link>
            Leerio
          </div>
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            © {currentYear}
            <Link
              href="https://starzz.dev"
              target="_blank"
              className="mx-1 hover:underline"
            >
              Starz099
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
