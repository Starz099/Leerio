"use client";

import { Button } from "@/components/ui/button";
import {
  AudioWaveform,
  FileText,
  MessageSquare,
  Mic,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function Mockup() {
  const [activeTab, setActiveTab] = useState("chat");

  const features = [
    {
      id: "chat",
      name: "AI Chat",
      icon: MessageSquare,
      description: "Chat with your documents",
    },
    {
      id: "Read Aloud",
      name: "Read Aloud",
      icon: AudioWaveform,
      description: "Listen to your PDFs",
    },
    {
      id: "summaries",
      name: "Summaries",
      icon: Sparkles,
      description: "Generate instant summaries",
    },
  ];

  return (
    <section
      id="features"
      className="bg-background relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* App Mockup */}
        <div className="relative mb-12">
          {/* macOS Window */}
          <div className="border-border/40 bg-muted/40 overflow-hidden rounded-xl border shadow-2xl">
            {/* Window Header */}
            <div className="bg-muted/80 border-border/40 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">
                leerio.app
              </p>
              <div className="w-12" />
            </div>

            {/* Window Content */}
            <div className="bg-background grid min-h-105 grid-cols-2 gap-0">
              {/* Left Panel - PDF List */}
              <div className="border-border/40 border-r p-6">
                <div className="space-y-4">
                  {/* PDF Item */}
                  <div className="border-border/40 bg-muted/30 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-foreground text-sm font-semibold">
                          research-paper.pdf
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          42 pages • 2.4 MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PDF Content Preview */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <div className="bg-muted/50 h-2 w-full rounded" />
                      <div className="bg-muted/50 h-2 w-5/6 rounded" />
                      <div className="bg-muted/50 h-2 w-4/5 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted/40 h-2 w-full rounded" />
                      <div className="bg-muted/40 h-2 w-5/6 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted/50 h-2 w-full rounded" />
                      <div className="bg-muted/50 h-2 w-4/5 rounded" />
                      <div className="bg-muted/50 h-2 w-3/5 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Dynamic Content */}
              <div className="border-border/40 flex flex-col border-l p-6">
                {activeTab === "chat" && (
                  <>
                    {/* Chat Header */}
                    <div className="border-border/40 mb-6 border-b pb-4">
                      <h3 className="text-foreground font-semibold">
                        Chat with PDF
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Content-aware responses
                      </p>
                    </div>

                    {/* Chat Messages */}
                    <div className="mb-6 flex-1 space-y-4 overflow-y-auto">
                      {/* Bot Message */}
                      <div className="mb-4 flex justify-end">
                        <div className="bg-foreground text-background max-w-xs rounded-2xl rounded-tr-sm px-4 py-2">
                          <p className="text-sm font-medium">
                            What are the main findings of this paper?
                          </p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="bg-muted/60 text-foreground max-w-xs rounded-2xl rounded-tl-sm px-4 py-2">
                          <p className="text-sm">
                            Based on the document, the main findings include
                            three key discoveries regarding...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input Field */}
                    <div className="bg-muted/30 flex items-center gap-2 rounded-full px-4 py-2">
                      <input
                        type="text"
                        placeholder="Ask a question..."
                        className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
                        disabled
                      />
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}

                {activeTab === "Read Aloud" && (
                  <>
                    {/* Read Aloud Header */}
                    <div className="border-border/40 mb-6 border-b pb-4">
                      <h3 className="text-foreground font-semibold">
                        Read Aloud
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Listen to your PDF content
                      </p>
                    </div>

                    {/* Read Aloud Content */}
                    <div className="mb-6 flex-1 space-y-6 overflow-y-auto">
                      <div className="space-y-3">
                        <p className="text-foreground text-sm leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua...
                        </p>
                        <p className="text-foreground text-sm leading-relaxed">
                          Ut enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo
                          consequat...
                        </p>
                      </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="bg-muted/30 flex items-center gap-4 rounded-lg px-4 py-3">
                      <button className="text-foreground hover:text-foreground/80 transition-colors">
                        <AudioWaveform className="h-5 w-5" />
                      </button>
                      <div className="bg-muted/50 h-1 flex-1 rounded-full">
                        <div className="bg-foreground h-full w-1/3 rounded-full" />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        2:15
                      </span>
                    </div>
                  </>
                )}

                {activeTab === "summaries" && (
                  <>
                    {/* Summaries Header */}
                    <div className="border-border/40 mb-6 border-b pb-4">
                      <h3 className="text-foreground font-semibold">
                        Document Summary
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        AI-generated summary
                      </p>
                    </div>

                    {/* Summary Content */}
                    <div className="mb-6 flex-1 space-y-4 overflow-y-auto">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="text-foreground mb-2 text-sm font-semibold">
                          Key Points
                        </h4>
                        <ul className="text-foreground space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>Main research findings and conclusions</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>Methodology and approach used</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>Important data and statistics</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted/20 rounded-lg p-4">
                        <p className="text-foreground text-sm leading-relaxed">
                          This research paper explores innovative methodologies
                          and presents significant findings in the field...
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Copy
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Button
                key={feature.id}
                variant={activeTab === feature.id ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveTab(feature.id)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{feature.name}</span>
                <span className="sm:hidden">{feature.icon.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
