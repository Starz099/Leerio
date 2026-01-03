"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Start using Leerio
        </h2>
        <p className="text-muted-foreground mb-8 text-base sm:text-lg">
          Upload your first PDF in minutes. Your key, your control.
        </p>
        <SignInButton mode="modal">
          <Button size="xl" className="gap-2">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </SignInButton>
      </div>
    </section>
  );
}
