"use client";

import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { config } from "@/lib/config";

interface Project {
  owner: string;
  projectId: string;
  createdAt: Date;
  publicId: string;
}

const Projects = ({ username }: { username: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${config.backendUrl}/projects?username=${username}`,
          {
            method: "GET",
          },
        );
        const data = await res.json();
        const ps = data.projects.map((project: Project) => ({
          owner: project.owner,
          projectId: project.projectId,
          publicId: project.publicId,
          createdAt: project.createdAt,
        }));
        setProjects(ps);
        setFilteredProjects(ps);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, [username]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.publicId.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleClickOnProject = (projectId: string) => {
    router.push(`/${username}/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 h-24 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-muted-foreground/30 bg-card/50 border border-dashed backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
            <div className="bg-muted/50 rounded-full p-3">
              <FileText className="text-muted-foreground size-6" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">
                {searchQuery ? "No documents found" : "No documents yet"}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "Upload a PDF to get started"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.projectId}
              className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 cursor-pointer overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-lg"
              onClick={() => handleClickOnProject(project.projectId)}
            >
              <div className="space-y-3 p-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 w-fit rounded-lg p-3 transition-colors">
                  <FileText className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 truncate text-sm font-semibold">
                    {project.publicId}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Created At:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProjects.length > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          Showing {filteredProjects.length} of {projects.length} document
          {projects.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Projects;
