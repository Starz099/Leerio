"use client";

import { Card } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";

const Preview = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="bg-muted/50 border-b p-4">
        <div className="flex items-center gap-2">
          <Eye className="text-primary h-5 w-5" />
          <h3 className="font-semibold">Document Preview</h3>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md p-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-muted rounded-full p-4">
              <FileText className="text-muted-foreground h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">PDF Preview</h3>
              <p className="text-muted-foreground text-sm">
                Your document will be displayed here
              </p>
            </div>
            <div className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-xs">
              PDF viewer integration coming soon
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Preview;
