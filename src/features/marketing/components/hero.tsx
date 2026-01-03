"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-130px)] items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <Badge
            variant="outline"
            className="gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Bring Your Own API Key
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          <span className="text-foreground">Talk to your PDFs.</span>
          <br />
          <span className="text-muted-foreground">On your own terms.</span>
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
          Upload PDFs, chat with them using AI, generate summaries, and listen
          aloud — all powered by your own API key.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SignInButton mode="modal">
            <Button size="xl" className="gap-2">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SignInButton>
          <Link href="#how-it-works">
            <Button size="xl" variant="outline">
              See how it works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
