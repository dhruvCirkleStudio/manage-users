import express from "express";
import { getAllUsers, userRegister } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/").get(authenticateUser,getAllUsers);
userRouter.route("/register").post(userRegister);

export default userRouter;
