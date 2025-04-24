import express from "express";
import { createFile, createFolder, getAllFolders } from "../controllers/file.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const fileRoutes = express.Router();

fileRoutes.route("/").post(authenticateUser,getAllFolders);
fileRoutes.route("/CreateFolder").post(authenticateUser,createFolder);
fileRoutes.route("/CreateFile").post(authenticateUser,createFile);

export default fileRoutes;