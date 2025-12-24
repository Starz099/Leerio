"use client";
import { Button } from "../ui/button";
import { useState } from "react";
import ChatSection from "./chat-section";
import SummarySection from "./summary-section";
const Workbench = () => {
  const [selectedMode, setSelectedMode] = useState<
    "chat" | "read-aloud" | "summarise"
  >("chat");

  const handleModeChange = (mode: "chat" | "read-aloud" | "summarise") => {
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
            Read Aloud Component Placeholder
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
