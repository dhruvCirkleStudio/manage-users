import express from "express";
import {
  userLogin,
  resetPassword,
  sendOtp,
  refreshAccessToken,
  forgotPassword,
  userLogout,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.route("/login").post(userLogin);
authRouter.route("/refreshAccessToken").post(refreshAccessToken);
authRouter.route("/resetPassword").patch(authenticateUser, resetPassword);
authRouter.route("/forgotPassword").patch(forgotPassword);
authRouter.route("/sendOtp").post(sendOtp);
authRouter.route("/logout").post(authenticateUser, userLogout);

export default authRouter;
