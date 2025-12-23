import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";

export const getProjects = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  try {
    const projects = await Project.find({ owner: username });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
