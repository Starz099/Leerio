"use client";

import { GraduationCap, Code2, FlaskConical, BookMarked } from "lucide-react";
import { useState, useEffect } from "react";

const useCases = [
  {
    title: "Students",
    description:
      "Study textbooks, understand complex topics, prepare for exams.",
    icon: GraduationCap,
  },
  {
    title: "Developers",
    description:
      "Navigate documentation, search API references, learn new frameworks.",
    icon: Code2,
  },
  {
    title: "Researchers",
    description:
      "Analyze papers, extract key findings, cross-reference studies.",
    icon: FlaskConical,
  },
  {
    title: "Readers",
    description:
      "Summarize books, highlight key ideas, revisit important passages.",
    icon: BookMarked,
  },
];

export default function UseCases() {
  const [activeCase, setActiveCase] = useState(0);

  // Auto-cycle through use cases every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCase((current) => (current + 1) % useCases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  return (
    <section id="use-cases" className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
            Use Cases
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for how you work
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-2xl border p-8 text-center shadow-sm transition-all duration-500 ${
                  activeCase === index
                    ? "border-border/70 bg-muted/30 scale-105"
                    : "border-border/40 bg-muted/20 hover:border-border/70 hover:bg-muted/30"
                }`}
              >
                <div className="mb-6 flex justify-center">
                  <div className="bg-muted/40 flex h-14 w-14 items-center justify-center rounded-full">
                    <Icon className="text-foreground h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-foreground mb-3 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
