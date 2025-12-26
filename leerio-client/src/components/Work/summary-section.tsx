"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { config } from "@/lib/config";

const SummarySection = () => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const response: { response: string } = await (
        await fetch(
          `${config.backendUrl}/summary?username=${username}&projectId=${projectId}&api_key=${localStorage.getItem("groq_api_key")}`,
          {
            method: "POST",
          },
        )
      ).json();

      setSummary(response.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="text-primary h-12 w-12 opacity-75" />
              </div>
              <Sparkles className="text-primary relative h-12 w-12" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold">Generating Summary</h3>
              <p className="text-muted-foreground">
                Analyzing your document...
              </p>
            </div>
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (summary !== "") {
    return (
      <div className="h-full w-full overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2">
              <CheckCircle className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Document Summary</h2>
              <p className="text-muted-foreground text-sm">
                AI-generated overview of your document
              </p>
            </div>
          </div>

          {/* Summary Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSummary("")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate New Summary
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
          <div className="p-4">
            <FileText className="text-primary h-12 w-12" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">Ready to Summarize</h3>
            <p className="text-muted-foreground">
              Get a concise AI-generated summary of your entire document in
              seconds
            </p>
          </div>
          <ul className="text-muted-foreground w-full space-y-2 text-left text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span>Key points and main ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span>Important details highlighted</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span>Quick overview of content</span>
            </li>
          </ul>
          <Button
            className="mt-4 w-full gap-2"
            size="lg"
            onClick={handleSummarize}
          >
            <Sparkles className="h-5 w-5" />
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummarySection;
