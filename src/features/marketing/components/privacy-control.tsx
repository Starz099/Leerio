"use client";

import { Shield, FileText, Lock, Eye } from "lucide-react";
import { useState, useEffect } from "react";

const PrivacyControl = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      icon: FileText,
      title: "Your files stay yours",
    },
    {
      icon: Lock,
      title: "Your API key is never exposed publicly",
    },
    {
      icon: Eye,
      title: "AI responses are limited to your documents",
    },
    {
      icon: Shield,
      title: "Designed with privacy in mind",
    },
  ];

  // Auto-cycle through features every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section id="privacy" className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              Privacy & Control
            </h2>
            <p className="text-muted-foreground text-lg">
              Your documents, your data, your rules.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 rounded-lg border p-6 transition-all duration-500 ${
                    activeFeature === index
                      ? "border-border/80 bg-muted/40 scale-105"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="text-foreground h-6 w-6" />
                  </div>
                  <p className="text-foreground text-base font-medium">
                    {feature.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyControl;
