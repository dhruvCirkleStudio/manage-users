import express from "express";
import {
  userRegister,
  userLogin,
  resetPassword,
  sendOtp,
  refreshAccessToken,
  forgotPassword
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.route("/register").post(userRegister);
authRouter.route("/login").post(userLogin);
authRouter.route("/refreshAccessToken").post(refreshAccessToken);

authRouter.route("/resetPassword").post(authenticateUser, resetPassword);
authRouter.route("/sendOtp").post(sendOtp);
authRouter.route("/forgotPassword").post(forgotPassword);

export default authRouter;
