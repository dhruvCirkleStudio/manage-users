import express from "express";
import { deleteUser, getAllUsers, userRegister, userUpdate } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/").get(authenticateUser,getAllUsers);
userRouter.route("/register").post(userRegister);
userRouter.route("/update").patch(authenticateUser,userUpdate);
userRouter.route("/delete/:id").delete(authenticateUser,deleteUser);

export default userRouter;
