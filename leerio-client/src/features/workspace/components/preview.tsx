"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, Eye, Loader2, RefreshCw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { config } from "@/lib/config";
import { fileUrlToGoogleDocsPreview } from "@/lib/utils";

type ProjectPreview = {
  projectId: string;
  fileUrl: string;
  owner: string;
  publicId: string;
  createdAt: string;
};

type FetchState = "idle" | "loading" | "error" | "ready";

const Preview = ({
  projectId: overrideProjectId,
  username: overrideUsername,
}: {
  projectId?: string;
  username?: string;
}) => {
  const pathname = usePathname();
  const pathParts = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  const username = overrideUsername ?? pathParts[0];
  const projectId = overrideProjectId ?? pathParts[2];

  const [project, setProject] = useState<ProjectPreview | null>(null);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    if (!username || !projectId || !config.backendUrl) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `${config.backendUrl}/projects?username=${username}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to load preview (${res.status})`);
      }

      const data = await res.json();
      const allProjects = data.projects as ProjectPreview[];
      const current = allProjects.find((p) => p.projectId === projectId);

      if (!current) {
        setProject(null);
        setStatus("error");
        setError("Document not found for this workspace");
        return;
      }

      setProject(current);
      setStatus("ready");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Preview failed";
      setError(message);
      setStatus("error");
    }
  }, [projectId, username]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  const pdfUrl = useMemo(() => {
    if (project?.fileUrl) {
      return fileUrlToGoogleDocsPreview(project.fileUrl);
    }
    return null;
  }, [project]);

  const showPlaceholder = !username || !projectId;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="text-primary h-5 w-5" />
            <h3 className="leading-tight font-semibold">Document Preview</h3>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition"
            onClick={fetchPreview}
            disabled={status === "loading"}
          >
            <RefreshCw
              className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-muted/30 flex flex-1 items-center justify-center">
        <Card className="w-full max-w-5xl border shadow-sm">
          <div className="flex flex-col gap-4 p-2 sm:p-3">
            {showPlaceholder && (
              <div className="bg-muted/60 flex min-h-[420px] w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed text-center">
                <p className="text-lg font-semibold">No document selected</p>
                <p className="text-muted-foreground text-sm">
                  Open a document workspace to see its preview here.
                </p>
              </div>
            )}

            {!showPlaceholder && status === "loading" && (
              <div className="bg-muted/50 flex min-h-[420px] w-full flex-col items-center justify-center gap-3 rounded-md border text-center">
                <Loader2 className="text-primary h-7 w-7 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Loading preview...
                </p>
              </div>
            )}

            {!showPlaceholder && status === "error" && (
              <div className="bg-destructive/10 border-destructive/40 flex min-h-[420px] w-full flex-col items-center justify-center gap-2 rounded-md border text-center">
                <AlertCircle className="text-destructive h-6 w-6" />
                <p className="text-destructive text-sm font-medium">
                  {error ?? "Unable to load preview."}
                </p>
              </div>
            )}

            {!showPlaceholder && status === "ready" && pdfUrl && (
              <div className="relative w-full overflow-hidden rounded-lg border shadow-sm">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  className="h-[280px] w-full sm:h-[360px] [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none" }}
                  allow="fullscreen"
                />
              </div>
            )}

            {!showPlaceholder && status === "ready" && !pdfUrl && (
              <div className="bg-muted/50 flex min-h-[420px] w-full flex-col items-center justify-center gap-3 rounded-md border text-center">
                <p className="text-lg font-semibold">Preview unavailable</p>
                <p className="text-muted-foreground text-sm">
                  We could not find a Cloudinary URL for this document.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Preview;
