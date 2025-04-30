import express from "express";
import { changeFileOrFolderName, createFile, createFolder, deleteFileOrFolder, getAllFolders, readFile, saveFile } from "../controllers/file.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const fileRoutes = express.Router();

fileRoutes.route("/").post(authenticateUser,getAllFolders);
fileRoutes.route("/CreateFolder").post(authenticateUser,createFolder);
fileRoutes.route("/CreateFile").post(authenticateUser,createFile);
fileRoutes.route("/readFile").post(authenticateUser,readFile);
fileRoutes.route("/saveFile").post(authenticateUser,saveFile);
fileRoutes.route("/delete").post(authenticateUser,deleteFileOrFolder);
fileRoutes.route("/changeName").post(authenticateUser,changeFileOrFolderName);
fileRoutes.route("/changeName").post(authenticateUser,changeFileOrFolderName);

export default fileRoutes;