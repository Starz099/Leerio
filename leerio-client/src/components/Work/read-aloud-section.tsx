"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState, useRef } from "react";

const ReadAloudSection = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
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
      console.log("All chunks spoken");
      return;
    }

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
    console.log("Speech cancelled");
  };

  const testVoice = () => {
    stop();
    const utterance = new SpeechSynthesisUtterance("hello mayank");
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) utterance.voice = voices[0];
    utterance.onstart = () => console.log("Test speech started");
    utterance.onend = () => console.log("Test speech ended");
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
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

      setIsSpeaking(true);
      console.log(
        "Fetching from:",
        `http://localhost:8000/read-aloud?username=${username}&projectId=${projectId}`,
      );

      const response: { response: string } = await (
        await fetch(
          `http://localhost:8000/read-aloud?username=${username}&projectId=${projectId}`,
          {
            method: "POST",
          },
        )
      ).json();

      if (!response.response) {
        console.error("No response text received");
        setIsSpeaking(false);
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
    }
  };

  return (
    <div>
      <Button onClick={() => speak()}>Play</Button>
      <Button
        variant="secondary"
        onClick={() => stop()}
        style={{ marginLeft: 8 }}
      >
        Stop
      </Button>
      <Button
        variant="outline"
        onClick={() => testVoice()}
        style={{ marginLeft: 8 }}
      >
        Test Voice
      </Button>
    </div>
  );
};

export default ReadAloudSection;
