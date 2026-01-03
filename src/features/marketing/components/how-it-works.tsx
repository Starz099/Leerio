"use client";

import {
  Upload,
  Settings,
  Database,
  MessageSquare,
  AudioWaveform,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      number: "01",
      title: "Upload your PDF",
      description:
        "Drop any PDF — books, research papers, notes, documentation. We handle the rest.",
      icon: Upload,
    },
    {
      number: "02",
      title: "Add your API key",
      description:
        "Connect your own AI provider key. You stay in control of your usage and costs.",
      icon: Settings,
    },
    {
      number: "03",
      title: "Automatic indexing",
      description:
        "Leerio indexes your document into a vector database for semantic search.",
      icon: Database,
    },
    {
      number: "04",
      title: "Start chatting",
      description:
        "Ask questions via text or voice. Get answers strictly from your document.",
      icon: MessageSquare,
    },
    {
      number: "05",
      title: "Read aloud",
      description:
        "Listen to your PDF content with our AI-powered text-to-speech feature.",
      icon: AudioWaveform,
    },
    {
      number: "06",
      title: "Generate summaries",
      description:
        "Get AI-generated summaries of your documents instantly. Perfect for quick insights.",
      icon: Sparkles,
    },
  ];

  // Auto-cycle through steps every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-14">
          <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-widest uppercase">
            How it works
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-4xl">
            Simple, transparent, effective
          </h2>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-3xl space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={index} className="relative pb-4">
                {/* Vertical Line - connecting steps */}
                {!isLast && (
                  <div className="bg-border/40 absolute top-12 left-20 h-8 w-px" />
                )}

                <div
                  className={`flex items-start gap-6 rounded-lg border px-4 py-3 transition-all duration-500 ${
                    activeStep === index
                      ? "border-border/40 bg-muted/30"
                      : "hover:border-border/40 hover:bg-muted/30 border-transparent"
                  }`}
                >
                  {/* Number */}
                  <div className="shrink-0 pt-0.5">
                    <span className="text-muted-foreground text-lg font-light">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon + Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="border-border/40 bg-muted/30 flex h-10 w-10 items-center justify-center rounded-lg border">
                        <Icon className="text-foreground h-5 w-5" />
                      </div>
                      <h3 className="text-foreground text-lg font-semibold">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-md text-muted-foreground ml-13 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
