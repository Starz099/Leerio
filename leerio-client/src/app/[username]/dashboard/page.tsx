"use client";

import dynamic from "next/dynamic";
import UploadFile from "@/components/Dashboard/upload-file";
import { Suspense, use } from "react";

const RecentProjects = dynamic(
  () => import("@/components/Dashboard/recent-projects"),
  { ssr: false },
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="mb-6">
      <div className="bg-muted mb-2 h-8 w-40 animate-pulse rounded" />
      <div className="bg-muted h-4 w-56 animate-pulse rounded" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted/50 h-16 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage and interact with your documents
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-foreground text-lg font-semibold">
          Upload Document
        </h2>
        <UploadFile username={username} />
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <RecentProjects username={username} />
      </Suspense>
    </div>
  );
};

export default Page;
