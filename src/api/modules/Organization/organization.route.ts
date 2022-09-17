import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createOrganization, deleteOrganizations, getOrganization, getOrganizations, updateOrganization } from "./organization.controller";

const router: Router = Router();

router.post("/organizations", authorize, createOrganization);
router.patch("/organizations/:id", authorize, updateOrganization)
router.get("/organizations", getOrganizations); // REMINDER: Removed Authorization.
router.get("/organizations/:id", authorize, getOrganization);
router.delete("/organizations", authorize, deleteOrganizations);

export {
    router as organizationsApi
}