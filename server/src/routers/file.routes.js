import express from "express";

import {
  changeFileOrFolderName,
  createFile,
  createFolder,
  deleteFileOrFolder,
  getAllFolders,
  readFile,
  saveFile,
  uploadFile,
} from "../controllers/file.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { FolderUpload } from "../middlewares/file.middleware.js";

const fileRoutes = express.Router();

fileRoutes.route("/").post(authenticateUser, getAllFolders);
fileRoutes.route("/CreateFolder").post(authenticateUser, createFolder);
fileRoutes.route("/CreateFile").post(authenticateUser, createFile);
fileRoutes.route("/readFile").post(authenticateUser, readFile);
fileRoutes.route("/saveFile").post(authenticateUser, saveFile);
fileRoutes.route("/delete").post(authenticateUser, deleteFileOrFolder);
fileRoutes.route("/changeName").post(authenticateUser, changeFileOrFolderName);
fileRoutes
  .route("/uploadFile")
  .post(authenticateUser, FolderUpload, uploadFile);

export default fileRoutes;
