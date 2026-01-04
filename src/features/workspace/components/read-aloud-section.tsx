"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/http";

const ReadAloudSection = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef<number>(0);
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];

  // Load voices and cleanup on unmount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      // Set default to first English voice or first voice
      const defaultVoice =
        voices.find((v) => /English|en/i.test(v.lang)) || voices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voiceURI);
      }
    };

    if (window.speechSynthesis.getVoices().length) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      queueRef.current = [];
      indexRef.current = 0;
    };
  }, []);

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
      console.log("Fetching from:", `/read-aloud`);

      const { data: response } = await apiClient.post<{ response: string }>(
        "/read-aloud",
        undefined,
        { params: { username, projectId } },
      );

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

      // Get the selected voice
      const voice = availableVoices.find((v) => v.voiceURI === selectedVoice);
      speakChunk(voice);
    } catch (error) {
      console.error("Error in speak function:", error);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card/50 flex h-full items-center justify-center rounded-md border p-4 sm:p-6">
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
          {!isSpeaking && !isLoading && (
            <>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Voice</label>
                <Select
                  value={selectedVoice}
                  onValueChange={(value) => {
                    if (value) setSelectedVoice(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

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
              <Button
                className="flex-1 gap-2"
                size="lg"
                variant="secondary"
                onClick={stop}
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
            )}
          </div>

          {isSpeaking && (
            <p className="text-muted-foreground text-center text-xs">
              Progress: {progress}%
            </p>
          )}

          <p className="text-muted-foreground text-center text-xs">
            Use natural voice synthesis to listen to your document hands-free
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadAloudSection;
