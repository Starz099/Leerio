"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/features/theme/theme-switch";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-end gap-2 text-3xl font-bold">
            <Image
              src="/logo.png"
              alt="Leerio Logo"
              width={36}
              height={36}
              className="size-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggleButton
              className=""
              variant="rectangle"
              start="top-down"
              blur
            />

            {/* Clerk Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="hidden sm:inline-flex" variant="default">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 rounded-full",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-border/40 bg-background/95 space-y-2 border-t px-4 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-border/40 mt-3 space-y-2 border-t pt-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full" variant="default">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center py-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10 rounded-full",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
