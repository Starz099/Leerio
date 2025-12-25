"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  owner: string;
  projectId: string;
  createdAt: Date;
  publicId: string;
}

const RecentProjects = ({ username }: { username: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/projects?username=${username}`,
          {
            method: "GET",
          },
        );
        const data = await res.json();
        const ps = data.projects.slice(0, 3).map((project: Project) => ({
          owner: project.owner,
          projectId: project.projectId,
          publicId: project.publicId,
          createdAt: project.createdAt,
        }));
        setProjects(ps);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    getProjects();

    // Listen for file upload events to refresh projects
    const handleFileUploaded = () => {
      getProjects();
    };

    window.addEventListener("fileUploaded", handleFileUploaded);
    return () => window.removeEventListener("fileUploaded", handleFileUploaded);
  }, [username]);

  const handleClickOnProject = (projectId: string) => {
    router.push(`/${username}/projects/${projectId}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-semibold">
          Recent Documents
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload and interact with your documents
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 h-16 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-muted-foreground/30 bg-card/50 border border-dashed backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
            <div className="bg-muted/50 rounded-full p-3">
              <FileText className="text-muted-foreground size-6" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">No documents yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Upload a PDF to get started
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {projects.map((project) => (
              <Card
                key={project.projectId}
                className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 cursor-pointer overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg"
                onClick={() => handleClickOnProject(project.projectId)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-3 transition-colors">
                    <FileText className="text-primary size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-sm font-semibold">
                      {project.publicId}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Created At:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-primary size-5 shrink-0 transition-colors" />
                </div>
              </Card>
            ))}
          </div>

          {projects.length > 0 && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="gap-2">
                <Link
                  href={`/${username}/projects`}
                  className="flex items-center"
                >
                  View All Documents
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
