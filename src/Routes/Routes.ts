import { Router, Request, Response } from "express";
import { aboutmeApi } from "../api/modules/About/aboutme.route";
import { getPublicFile } from "../api/modules/Attachment/attachment.controller";
import { AttachmentsApi } from "../api/modules/Attachment/attachment.route";
import { experienceApi } from "../api/modules/Experience/experience.route";
import { featuredApi } from "../api/modules/Featured/featured.route";
import { authApi } from "../api/modules/Oauth/oauth.route";
import { organizationsApi } from "../api/modules/Organization/organization.route";
import { projectsApi } from "../api/modules/Project/project.route";
import { usersApi } from "../api/modules/User/user.route";

const router: Router = Router();

router.use("/auth/v1/", authApi);
router.use("/user/v1/", usersApi);
router.use("/project/v1/", projectsApi);
router.use("/projects/v1/", featuredApi);
router.use("/attachment/v1/", AttachmentsApi);
router.use("/organization/v1/", organizationsApi)
router.use("/experience/v1/", experienceApi);
router.use("/about/v1/", aboutmeApi)
router.use("/media/:name", getPublicFile);

router.use("*", (req: Request, res: Response) => {
   res.status(404);
   if (req?.headers?.accept?.indexOf("html")) {
      // res.render('404', { url: req.protocol + '://' + req.get('host') + req.originalUrl })
      res.json({
         message: "Route not found",
      });
   } else res.send("URL cannot found");
});

export { router as routes };
