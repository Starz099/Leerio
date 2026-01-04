"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import ReadAloudSection from "./read-aloud-section";
import ChatSection from "./chat-section";
import SummarySection from "./summary-section";
const Workbench = () => {
  const [selectedMode, setSelectedMode] = useState<
    "chat" | "read-aloud" | "summarise"
  >("chat");

  const stopSpeechIfNeeded = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
  };

  const handleModeChange = (mode: "chat" | "read-aloud" | "summarise") => {
    // Always stop any active speech when switching modes
    stopSpeechIfNeeded();
    setSelectedMode(mode);
  };

  return (
    <div className="h-full w-full">
      <div className="flex w-full justify-around">
        <Button
          onClick={() => handleModeChange("chat")}
          className={`cursor-pointer`}
        >
          Chat
        </Button>
        <Button
          onClick={() => handleModeChange("read-aloud")}
          className={`cursor-pointer`}
        >
          Read Aloud
        </Button>
        <Button
          onClick={() => handleModeChange("summarise")}
          className={`cursor-pointer`}
        >
          Summarise
        </Button>
      </div>

      <div className="mt-4 h-[80%] w-full">
        {selectedMode === "chat" && (
          <div className="h-full w-full border">
            <ChatSection />
          </div>
        )}
        {selectedMode === "read-aloud" && (
          <div className="h-full w-full border">
            <ReadAloudSection />
          </div>
        )}
        {selectedMode === "summarise" && (
          <div className="h-full w-full border">
            <SummarySection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Workbench;
