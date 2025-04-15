import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/").get(authenticateUser,getAllUsers);

export default userRouter;
