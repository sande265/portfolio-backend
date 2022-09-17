import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createUser, deleteUsers, getUser, getUsers, updateUser } from "./user.controller";

const router: Router = Router();

router.post("/users", authorize, createUser);
router.patch("/users/:id", authorize, updateUser)
router.get("/users", authorize, getUsers);
router.get("/users/:id", authorize, getUser);
router.delete("/users", authorize, deleteUsers);

export {
    router as usersApi
}