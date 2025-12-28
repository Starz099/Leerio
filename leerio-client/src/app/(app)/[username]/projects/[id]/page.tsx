"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ChatSection from "@/features/workspace/components/chat-section";
import SummarySection from "@/features/workspace/components/summary-section";
import ReadAloudSection from "@/features/workspace/components/read-aloud-section";
import { MessageSquare, FileText, Volume2 } from "lucide-react";

type Mode = "chat" | "read-aloud" | "summarise";

const ProjectWorkspace = () => {
  // Initialize state with saved mode from localStorage
  const [selectedMode, setSelectedMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("selectedMode");
      if (
        savedMode === "chat" ||
        savedMode === "read-aloud" ||
        savedMode === "summarise"
      ) {
        return savedMode as Mode;
      }
    }
    return "chat";
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedMode", selectedMode);
  }, [selectedMode]);

  const modes = [
    {
      id: "chat" as Mode,
      title: "AI Chat",
      description:
        "Ask questions and get intelligent answers about your document",
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      badge: "Interactive",
    },
    {
      id: "summarise" as Mode,
      title: "Summarize",
      description: "Get a concise summary of your entire document",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      badge: "Quick Insight",
    },
    {
      id: "read-aloud" as Mode,
      title: "Read Aloud",
      description: "Listen to your document with natural voice synthesis",
      icon: Volume2,
      gradient: "from-green-500 to-emerald-500",
      badge: "Audio",
    },
  ];

  const currentMode = modes.find((m) => m.id === selectedMode);
  const Icon = currentMode?.icon || MessageSquare;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header Bar */}
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2">
              <Icon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{currentMode?.title}</h2>
              <p className="text-muted-foreground text-sm">
                {currentMode?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMode(mode.id)}
                className="gap-2"
              >
                <mode.icon className="h-4 w-4" />
                {mode.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-2">
        {selectedMode === "chat" && <ChatSection />}
        {selectedMode === "summarise" && <SummarySection />}
        {selectedMode === "read-aloud" && <ReadAloudSection />}
      </div>
    </div>
  );
};

export default ProjectWorkspace;
