import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createProject, deleteProjects, getProject, getProjects, updateProject } from "./project.controller";

const router: Router = Router();

router.get("/projects", getProjects); // REMINDER: Removed Authorization.
router.get("/projects/:id", authorize, getProject);
router.post("/projects", authorize, createProject);
router.patch("/projects/:id", authorize, updateProject);
router.delete("/projects", authorize, deleteProjects);

export { router as projectsApi };
