import path from "node:path";
import { apiResponse, errorResponse } from "../utils/response.js";
import fs from "fs/promises";

// export const getAllFolders = async (req, res) => {
//   try {
//     const { folderPath } = req.body;
//     console.log(folderPath);

//     const directoryPath = folderPath
//       ? process.env.ROOT_FOLDER_PATH + "/" + folderPath
//       : process.env.ROOT_FOLDER_PATH;

//     const items = await fs.readdir(directoryPath);

//     const files = [];
//     const folders = [];
//     for (const item of items) {
//       const itemPath = path.join(directoryPath, item);
//       const stats = await fs.stat(itemPath);
//       if (stats.isFile()) {
//         files.push(item);
//       } else if (stats.isDirectory()) {
//         folders.push(item);
//       }
//     }
//     const directory = { files, folders };

//     apiResponse(res, 200, {
//       status: true,
//       message: "folder recieved successfully!",
//       data: { directory },
//     });
//   } catch (error) {
//     console.log("error in getAllFolders:", error);
//     errorResponse(res, 500, { message: "error in fetching data!" });
//   }
// };

export const getAllFolders = async (req, res) => {
  try {
    const { folderPath } = req.body;
    // console.log(folderPath);

    const directoryPath = folderPath
      ? path.join(process.env.ROOT_FOLDER_PATH, folderPath)
      : process.env.ROOT_FOLDER_PATH;

    const dirents = await fs.readdir(directoryPath, { withFileTypes: true });

    const files = [];
    const folders = [];

    for (const dirent of dirents) {
      if (dirent.isFile()) {
        files.push(dirent.name);
      } else if (dirent.isDirectory()) {
        folders.push(dirent.name);
      }
    }
    const directory = { files, folders };

    apiResponse(res, 200, {
      status: true,
      message: "Folder received successfully!",
      data: { directory },
    });
  } catch (error) {
    console.log("error in getAllFolders:", error);
    errorResponse(res, 500, { message: "Error in fetching data!" });
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
    errorResponse(res, 500, { message: "folder does not created!" });
  }
};

const allowFileExtesions = [".json", ".txt"];
export const createFile = async (req, res) => {
  try {
    const { FileName } = req.body;
    // console.log(FileName)
    let filePath = path.join(process.env.ROOT_FOLDER_PATH, FileName);
    filePath = filePath.trim();
    let fileExt = path.extname(filePath);
    if (!fileExt) {
      filePath += ".txt";
      fileExt = ".txt";
    }
    if (!allowFileExtesions.includes(fileExt)) {
      return errorResponse(res, 400, {
        message: "please provide valid file extension!",
      });
    }
    try {
      await fs.access(filePath);
      return errorResponse(res, 400, {
        message: "file or folder already exists!",
      });
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

export const readFile = async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(process.env.ROOT_FOLDER_PATH, fileName);
    const fileContent = await fs.readFile(filePath, "utf8");
    apiResponse(res, 200, {
      status: true,
      message: "file readed Successfully",
      data: { fileContent },
    });
  } catch (error) {
    console.log("error in readFile:", error);
    errorResponse(res, 500, { message: "can not get file!" });
  }
};

export const saveFile = async (req, res) => {
  try {
    const { fileName, data } = req.body;
    const filePath = path.join(process.env.ROOT_FOLDER_PATH, fileName);
    const fileExt = path.extname(filePath);
    let updatedData = data;

    if (fileExt === ".json") {
      try {
        const parsed = JSON.parse(data);
        updatedData = JSON.stringify(parsed, null, 2);
      } catch (error) {
        return errorResponse(res, 400, {
          message: "data ia not compatible json format!",
        });
      }
    }

    try {
      const existingContent = await fs.readFile(filePath, "utf-8");
      if (existingContent === data) {
        return errorResponse(res, 400, { message: "data ia not changed!" });
      }
    } catch (err) {
      // File doesn't exist, proceed to write
      if (err.code !== "ENOENT") throw err;
    }

    const fileContent = await fs.writeFile(filePath, updatedData);
    apiResponse(res, 200, {
      status: true,
      message: "file saved Successfully",
      data: null,
    });
  } catch (error) {
    console.log("error in saveFile:", error);
    errorResponse(res, 500, { message: "error in saving file!" });
  }
};

export const deleteFileOrFolder = async (req, res) => {
  try {
    const { currentPath } = req.body;
    if (!currentPath) {
      return errorResponse(res, 400, {
        message: "please specify the file or folder name!",
      });
    }
    const fullPath = await path.join(process.env.ROOT_FOLDER_PATH, currentPath);
    console.log(fullPath);

    const stats = await fs.stat(fullPath);
    if (stats.isFile()) {
      await fs.unlink(fullPath);
    }
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    }

    apiResponse(res, 200, {
      status: true,
      message: "file or folder removed successfully!",
      data: null,
    });
  } catch (error) {
    console.log("error in delete file or folder:", error);
    errorResponse(res, 500, { message: "error while deleting!" });
  }
};

export const changeFileOrFolderName = async (req, res) => {
  try {
    console.log("inside changefileorfoldername");
    // const { currentPath, newName } = req.body;
    const { oldPath, newPath } = req.body;
    console.log(oldPath, newPath);
    if (!oldPath && !newPath) {
      return apiResponse(res, 400, {
        status: false,
        message: "Both oldPath and newPath are required.",
        data: null,
      });
    }

    const fullOldPath = path.join(process.env.ROOT_FOLDER_PATH, oldPath);
    const oldPathExtName = path.extname(fullOldPath);
    const fullNewPath = oldPathExtName
      ? path.join(process.env.ROOT_FOLDER_PATH, newPath.trim() + oldPathExtName)
      : path.join(process.env.ROOT_FOLDER_PATH, newPath.trim());

    // const fullNewPath = newPathExt
    //   ? path.join(process.env.ROOT_FOLDER_PATH, newPath.trim() + newPathExt)
    //   : path.join(
    //       process.env.ROOT_FOLDER_PATH,
    //       newPath.trim() + oldPathExtName
    //     );

    try {
      await fs.access(fullOldPath); // Check if oldPath exists
    } catch (err) {
      return apiResponse(res, 404, {
        status: false,
        message: "The specified file or folder does not exist.",
        data: null,
      });
    }
    await fs.rename(fullOldPath, fullNewPath);

    apiResponse(res, 200, {
      status: true,
      message: "file or folder name change successfully!",
      data: null,
    });
  } catch (error) {
    console.log("error in changeFileOrFolderName controller:", error);
    return apiResponse(res, 500, {
      status: false,
      message: "Something went wrong. Please try again later.",
      data: null,
    });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully`);
  } catch (error) {
    console.log("error in upload file::", error);
    errorResponse(res, 500, {
      status: false,
      message:
        "Something went wrong while uploading file Please try again later.",
    });
  }
};
