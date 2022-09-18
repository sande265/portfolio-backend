import { Router } from "express";
import { authorize } from "../../../middlewares";
import { createLibrary, getLibrary } from "./library.controller";

const router = Router();

router.post("/libraries", authorize, createLibrary);
router.get("/libraries", getLibrary); // REMINDER: Removed Authorization.

export { router as libraryApi }