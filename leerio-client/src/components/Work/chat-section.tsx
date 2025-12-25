"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Card } from "../ui/card";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

const ChatSection = () => {
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const chatContext = chat;
    const newQuery: ChatMessage = {
      role: "user",
      message: inputValue.trim(),
    };

    setChat([...chat, newQuery]);
    setInputValue("");
    setIsLoading(true);

    try {
      const query: { chatHistory: ChatMessage[]; query: string } = {
        chatHistory: chatContext,
        query: newQuery.message,
      };

      const response: { response: string } = await (
        await fetch(
          `http://localhost:8000/chat?username=${username}&projectId=${projectId}&query=${JSON.stringify(query)}`,
          {
            method: "POST",
          },
        )
      ).json();

      const aiResponse: ChatMessage = {
        role: "assistant",
        message: response.response,
      };

      setChat([...chat, newQuery, aiResponse]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background relative flex h-full w-full flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6 pb-32">
        {chat.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="p-4">
              <Sparkles className="text-primary h-12 w-12" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                Start a Conversation
              </h3>
              <p className="text-muted-foreground max-w-md">
                Ask me anything about your document. I can help you understand,
                analyze, and extract information.
              </p>
            </div>
          </div>
        ) : (
          chat.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <Bot className="text-primary h-5 w-5" />
                </div>
              )}
              <Card
                className={`max-w-[80%] p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </Card>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <User className="text-primary h-5 w-5" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Bot className="text-primary h-5 w-5" />
            </div>
            <Card className="bg-muted max-w-[80%] p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Thinking...
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-background absolute right-0 bottom-0 left-0 border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question about your document..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
