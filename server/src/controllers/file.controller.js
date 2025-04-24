import path from "node:path";
import { apiResponse, errorResponse } from "../utils/response.js";
import fs from "fs/promises";

export const getAllFolders = async (req, res) => {
  try {
    const { folderPath } = req.body;
    console.log(folderPath);

    const directoryPath = folderPath
      ? process.env.ROOT_FOLDER_PATH + "/" + folderPath
      : process.env.ROOT_FOLDER_PATH;

    const items = await fs.readdir(directoryPath);

    const files = [];
    const folders = [];
    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stats = await fs.stat(itemPath);
      if (stats.isFile()) {
        files.push(item);
      } else if (stats.isDirectory()) {
        folders.push(item);
      }
    }
    const directory = { files, folders };

    apiResponse(res, 200, {
      status: true,
      message: "folder recieved successfully!",
      data: { directory },
    }); 
  } catch (error) {
    console.log("error in getAllFolders:", error);
    errorResponse(res, 500, { message: "error in fetching data!" });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    console.log(folderName);
    const folderPath = path.join(process.env.ROOT_FOLDER_PATH, folderName);
    try {
      await fs.access(folderPath);
      errorResponse(res, 400, { message: "file or folder already exists!" });
    } catch (error) {}

    await fs.mkdir(folderPath);
    apiResponse(res, 200, {
      status: true,
      message: "folder created Successfully",
      data: { folderName },
    });
  } catch (error) {
    console.log("error in createFolder:", error);
    errorResponse(res, 500, { message: "folder does not created!" } );
  }
};

export const createFile = async (req, res) => {
  try {
    const { FileName } = req.body;
    // console.log(FileName)
    const filePath = path.join(process.env.ROOT_FOLDER_PATH, FileName);
    try {
      await fs.access(filePath);
      errorResponse(res, 400, { message: "file or folder already exists!" });
    } catch (error) {}

    await fs.writeFile(filePath, "");
    apiResponse(res, 200, {
      status: true,
      message: "folder created Successfully",
      data: { FileName },
    });
  } catch (error) {
    console.log("error in createFile:", error);
    errorResponse(res, 500, { message: "file does not created!" });
  }
};
