import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createExperience, deleteExperiences, getExperience, getExperiences, updateExperience } from "./experience.controller";

const router: Router = Router();

router.post("/experiences", authorize, createExperience);
router.patch("/experiences/:id", authorize, updateExperience)
router.get("/experiences", getExperiences); // REMINDER: Removed Authorization.
router.get("/experiences/:id", authorize, getExperience);
router.delete("/experiences", authorize, deleteExperiences);

export {
    router as experienceApi
}