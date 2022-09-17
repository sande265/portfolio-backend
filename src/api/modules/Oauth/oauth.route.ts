import { Router } from "express";
import { login } from "./oauth.controller";

const router: Router = Router();

router.post("/login", login)

export {
    router as authApi
}