import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createFeatured, deleteFeatureds, getFeatured, getFeatureds, updateFeatured } from "./featured.controller";

const router: Router = Router();

router.get("/featured", getFeatureds); // REMINDER: Removed Authorization.
router.get("/featured/:id", authorize, getFeatured);
router.post("/featured", authorize, createFeatured);
router.patch("/featured/:id", authorize, updateFeatured);
router.delete("/featured", authorize, deleteFeatureds);

export { router as featuredApi };
