"use client";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { useEffect, useRef } from "react";
import {
  saveGroqApiKey,
  clearGroqApiKey,
  getGroqApiKey,
} from "../../../lib/api_key.utils";

const Page = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = getGroqApiKey();
    if (inputRef.current) inputRef.current.value = existing;
  }, []);

  const saveKey = () => {
    const value = inputRef.current?.value?.trim();
    if (!value) {
      alert("Please enter an API key first.");
      return;
    }
    saveGroqApiKey(value);
    alert("API key saved to your browser.");
  };

  const clearKey = () => {
    clearGroqApiKey();
    if (inputRef.current) inputRef.current.value = "";
    alert("API key removed from your browser.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Groq API Key</CardTitle>
          <CardDescription>
            Your Groq API key is used to process documents and generate
            responses. We never store your key on our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="text-sm font-medium">Groq API Key</label>
          <p className="text-muted-foreground text-sm">
            Need one? Get a key from{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              Groq Console
            </a>
            .
          </p>
          <Input ref={inputRef} placeholder="sk-..." />
          <div className="flex items-center gap-2">
            <Button onClick={saveKey}>add Key</Button>
            <Button variant="outline" onClick={clearKey}>
              Remove Key
            </Button>
          </div>
          <Separator />
          <div className="text-muted-foreground text-sm">
            <p>
              Stored locally as encrypted data. Decrypted just-in-time for
              requests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
