import { Router } from "express";
import { FileFilter } from "../../../middlewares";
import { authorize } from "../../../middlewares/auth.middleware";
import { createAttachment, deleteAttachments, getAttachment, getAttachments, updateAttachment } from "./attachment.controller";

const router: Router = Router();

router.get("/attachments", authorize, getAttachments);
router.get("/attachments/:id", authorize, getAttachment);
router.post("/attachments", FileFilter.single("image"), authorize, createAttachment);
router.patch("/attachments/:id", authorize, updateAttachment);
router.delete("/attachments", authorize, deleteAttachments);

export { router as AttachmentsApi };
