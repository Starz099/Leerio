"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { redirect } from "next/navigation";

const Projects = ({ username }: { username: string }) => {
  const [projects, setProjects] = useState<
    { owner: string; projectId: string }[]
  >([]);
  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch(
        `http://localhost:8000/projects?username=${username}`,
        {
          method: "GET",
        },
      );
      const data = await res.json();
      const ps = [];
      for (const project of data.projects) {
        ps.push({
          owner: project.owner,
          projectId: project.projectId,
        });
      }
      setProjects(ps);
    };
    getProjects();
  }, [username]);

  const handleClickOnProject = (projectId: string) => {
    redirect(`/${username}/projects/${projectId}`);
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            onClick={() => handleClickOnProject(project.projectId)}
            className="p-2"
            key={project.projectId}
          >
            <h2>{project.projectId}</h2>
            <p>Owner: {project.owner}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
