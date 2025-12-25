"use client";

import Projects from "@/components/Dashboard/projects";
import { use } from "react";

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-2">
          All your uploaded documents
        </p>
      </div>
      <Projects username={username} />
    </div>
  );
};

export default Page;
