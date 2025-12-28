"use client";

import { useRef, useState } from "react";
import {
  CheckCircle,
  Loader2,
  Music,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { config } from "@/lib/config";

const ReadAloudSection = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef<number>(0);
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];

  const sanitizeText = (text: string) => {
    const cleaned = text
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/[§ïÐ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned;
  };

  const splitIntoChunks = (text: string, maxLen = 300) => {
    const sentences = text.split(/(?<=[\.\!\?])\s+/);
    const chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
      if ((current + " " + s).trim().length <= maxLen) {
        current = (current ? current + " " : "") + s.trim();
      } else {
        if (current) chunks.push(current);
        if (s.length <= maxLen) {
          current = s.trim();
        } else {
          // Hard split very long sentence
          for (let i = 0; i < s.length; i += maxLen) {
            chunks.push(s.slice(i, i + maxLen));
          }
          current = "";
        }
      }
    }
    if (current) chunks.push(current);
    return chunks;
  };

  const speakChunk = (voice?: SpeechSynthesisVoice) => {
    const q = queueRef.current;
    const i = indexRef.current;

    if (i >= q.length) {
      setIsSpeaking(false);
      setProgress(100);
      console.log("All chunks spoken");
      return;
    }

    // Update progress
    setProgress(Math.round((i / q.length) * 100));

    const utterance = new SpeechSynthesisUtterance(q[i]);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => console.log(`Chunk ${i + 1}/${q.length} started`);
    utterance.onend = () => {
      console.log(`Chunk ${i + 1}/${q.length} ended`);
      indexRef.current = i + 1;
      speakChunk(voice);
    };
    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      // Skip problematic chunk and continue
      indexRef.current = i + 1;
      speakChunk(voice);
    };

    // In case the engine is paused
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    indexRef.current = 0;
    setIsSpeaking(false);
    setProgress(0);
    console.log("Speech cancelled");
  };

  const speak = async () => {
    try {
      console.log("Speak function called");

      // Prevent multiple concurrent speak calls
      if (isSpeaking) {
        console.log("Already speaking, ignoring new speak request");
        return;
      }

      // Check if SpeechSynthesis is supported
      if (!window.speechSynthesis) {
        console.error("SpeechSynthesis not supported in this browser");
        alert("Speech synthesis is not supported in your browser");
        return;
      }

      setIsLoading(true);
      setProgress(0);
      console.log(
        "Fetching from:",
        `${config.backendUrl}/read-aloud?username=${username}&projectId=${projectId}`,
      );

      const response: { response: string } = await (
        await fetch(
          `${config.backendUrl}/read-aloud?username=${username}&projectId=${projectId}`,
          {
            method: "POST",
          },
        )
      ).json();

      if (!response.response) {
        console.error("No response text received");
        setIsLoading(false);
        return;
      }

      console.log("Read aloud text response length:", response.response.length);
      console.log("First 100 chars:", response.response.substring(0, 100));

      // Prepare text
      const cleaned = sanitizeText(response.response);
      const chunks = splitIntoChunks(cleaned, 300);
      queueRef.current = chunks;
      indexRef.current = 0;
      console.log("Chunks prepared:", chunks.length);

      setIsLoading(false);
      setIsSpeaking(true);

      // Load voices reliably
      const selectVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices:", voices.length);
        const voice =
          voices.find((v) => /English|en/i.test(v.lang)) || voices[0];
        console.log("Selected voice:", voice?.name);
        speakChunk(voice);
      };
      if (window.speechSynthesis.getVoices().length) {
        selectVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = selectVoice;
      }
    } catch (error) {
      console.error("Error in speak function:", error);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3">
              <Volume2 className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Read Aloud</CardTitle>
              <p className="text-muted-foreground text-sm">
                Listen to your document with natural voice
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features List */}
          {!isSpeaking && !isLoading && (
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>Natural text-to-speech synthesis</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>Adjustable playback controls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>High-quality voice output</span>
              </li>
            </ul>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="relative">
                <Music className="text-primary h-12 w-12 animate-pulse" />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-medium">Preparing Audio</p>
                <p className="text-muted-foreground text-sm">
                  Loading your document...
                </p>
              </div>
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            {!isSpeaking ? (
              <Button
                className="flex-1 gap-2"
                size="lg"
                onClick={speak}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isLoading ? "Loading..." : "Start Reading"}
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1 gap-2"
                  size="lg"
                  variant="secondary"
                  onClick={stop}
                >
                  <Square className="h-5 w-5" />
                  Stop
                </Button>
              </>
            )}
          </div>

          {isSpeaking && (
            <p className="text-muted-foreground text-center text-xs">
              Progress: {progress}%
            </p>
          )}

          {/* Info */}
          <p className="text-muted-foreground text-center text-xs">
            Use natural voice synthesis to listen to your document hands-free
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadAloudSection;
