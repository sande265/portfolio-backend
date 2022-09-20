import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createAbout, getAbout, getAbouts, updateAbout } from "./aboutme.controller";

const router: Router = Router();

router.get("/aboutme", getAbouts); // REMINDER: Removed Authorization.
router.get("/aboutme/:id", authorize, getAbout);
router.post("/aboutme", authorize, createAbout);
router.patch("/aboutme/:id", authorize, updateAbout);

export { router as aboutmeApi };
