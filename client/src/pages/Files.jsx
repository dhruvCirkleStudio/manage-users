import React, { useEffect } from "react";
import DashboardLayout, {
  DashboardNavigation,
  DashboardMainContent,
} from "../components/DashboardLayout";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import folderImage from "../assets/folder.svg";
import fileImage from "../assets/file.svg";
import { toast } from "../utils/ToastNotification";
import {
  Box,
  Toolbar,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Paper,
  TextareaAutosize,
  Tooltip,
  Link,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Model from "../components/Model";


const Files = () => {
  const [directory, setDirectory] = useState();
  const [CurrentPath, setCurrentPath] = useState("");
  const [fileContant, setFileContent] = useState("");
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    storageType: "",
  });
  const [modelState, setModelState] = useState({
    createFileFolder: false,
    uploadFileFolder: false,
  });

  const onModelOpen = (modelName) => {
    setModelState((prevState) => {
      return { ...prevState, [modelName]: true };
    });
  };
  const onModelClose = (modelName) => {
    setModelState((prevState) => {
      return { ...prevState, [modelName]: false };
    });
    setFormData({ name: "", storageType: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getAllfolders = async (folderName, currentPath) => {
    try {
      // console.log(folderPath);
      const folderPath = !folderName
        ? currentPath
        : currentPath + "/" + folderName;

      const response = await axiosInstance.post("/file", {
        folderPath,
      });

      if (folderName) {
        setCurrentPath(() => folderPath);
      }

      console.log(response.data.data.directory);
      // console.log(CurrentPath);
      setDirectory(response.data.data.directory);
      setIsFileOpen(false);
    } catch (error) {
      console.log("error in getAllFolder:", error);
    }
  };

  const handleCreateFolder = async (newFolderName) => {
    try {
      const fullFolderPath = CurrentPath + "/" + newFolderName;
      const response = await axiosInstance.post("/file/CreateFolder", {
        folderName: fullFolderPath,
      });
      // console.log(response.data);
      getAllfolders(null, CurrentPath);
    } catch (error) {
      console.log("error in add folder :", error);
    }
  };
  const handleCreateFile = async (newFileName) => {
    try {
      const fullFilePath = CurrentPath + "/" + newFileName;
      // console.log(fullFilePath)
      const response = await axiosInstance.post("/file/CreateFile", {
        FileName: fullFilePath,
      });
      // console.log(response.data);
      getAllfolders(null, CurrentPath);
    } catch (error) {
      console.log("error in create file :", error);
      toast.error(error.response.data.message);
    }
  };
  const handleSubmit = async () => {
    if (formData.storageType == "folder") {
      console.log(formData);
      await handleCreateFolder(formData.name);
    } else {
      console.log(formData);
      await handleCreateFile(formData.name);
    }
    onModelClose("createFileFolder");
  };

  const handleChangeDirectory = (e, selectedPath) => {
    e.preventDefault();
    if (!selectedPath) {
      setCurrentPath((prev) => "");
      getAllfolders();
      return;
    }
    const currentPathArray = CurrentPath.split("/");
    const index = currentPathArray.indexOf(selectedPath);

    if (index == currentPathArray.length - 1) return;

    const UpdatedPath = currentPathArray.slice(0, index + 1).join("/");
    setCurrentPath(() => UpdatedPath);
    getAllfolders(null, UpdatedPath);
  };

  const handleOpenFile = async (fileName) => {
    try {
      const fullFilePath = CurrentPath + "/" + fileName;
      const response = await axiosInstance.post("/file/readFile", {
        fileName: fullFilePath,
      });
      setCurrentPath(() => fullFilePath);
      setIsFileOpen(true);
      console.log(response.data.data);
      setFileContent(response.data.data.fileContent);
    } catch (error) {
      console.log("error in opening openFile:", error);
    }
  };
  const handleSaveFile = async () => {
    try {
      const fullFilePath = CurrentPath;
      const response = await axiosInstance.post("/file/saveFile", {
        fileName: fullFilePath,
        data: fileContant,
      });
      // setIsFileOpen(true);
      setIsEditing(false);
      console.log(response.data.message);
      setFileContent(response.data.fileContent);
      toast(response.data.message);
    } catch (error) {
      console.log("error in saving file:", error);
      toast(error.response.data.message);
    }
  };

  const handleDeleteFileFolder = async () => {
    try {
      const response = await axiosInstance.post("/file/delete", {
        currentPath: CurrentPath,
      });
      console.log(response);
      let updatedPath = CurrentPath?.split("/");
      updatedPath.pop();
      updatedPath = updatedPath.join("/");
      setCurrentPath(updatedPath);
      getAllfolders(null, updatedPath);
    } catch (error) {
      console.log("error in handleDeleteFileFolder:", error);
    }
  };
  useEffect(() => {
    getAllfolders();
  }, []);

  const [fileName, setFileName] = useState("");
  const [folderNameEditing, setFolderNameEditing] = useState({});
  const handleChangeFileOrFolderName = async (e, index, oldName) => {
    e.preventDefault();
    try {
      const newFIleName = fileName.split(".")[0];
      const oldPath = CurrentPath + "/" + oldName;
      // const newPath = CurrentPath + "/" + fileName;
      const newPath = CurrentPath + "/" + newFIleName;

      setFolderNameEditing((prev) => {
        return { ...prev, [oldName]: false };
      });
      if ((oldPath, newPath)) return;

      const response = await axiosInstance.post("/file/changeName", {
        oldPath,
        newPath,
      });
      console.log("inside handlechangeName", fileName);
      getAllfolders(null, CurrentPath);
    } catch (error) {
      console.log("error in handlechangeName:", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavigation>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary">
                Your Files
              </Typography>
            </Box>
          </Toolbar>
        </DashboardNavigation>
        <DashboardMainContent>
          {/* FOLDER STRUCTURE NAVIGATION AND ADD/DELETE/UPLOAD BUTTONS  */}
          <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
            <Breadcrumbs aria-label="breadcrumb" separator="›">
              <Link
                underline="hover"
                color="inherit"
                className="pathItems"
                onClick={(e) => handleChangeDirectory(e)}
              >
                Root Directory
              </Link>
              {CurrentPath?.split("/")
                .filter(Boolean)
                .map((item) => {
                  return (
                    <Link
                      underline="hover"
                      color="inherit"
                      className="pathItems"
                      onClick={(e) => handleChangeDirectory(e, item)}
                    >
                      {item}
                    </Link>
                  );
                })}
            </Breadcrumbs>
            <Box sx={{ marginLeft: "auto" }}>
              {!isFileOpen && (
                <>
                  <Button
                    onClick={() => {
                      onModelOpen("createFileFolder");
                    }}
                    sx={{ border: "1px solid black" }}
                    className="border"
                  >
                    Add New
                  </Button>
                  <Button
                    onClick={() => onModelOpen("uploadFileFolder")}
                    sx={{ border: "1px solid black", marginLeft: 2 }}
                    className="border"
                  >
                    Upload your Folder
                  </Button>
                </>
              )}
              <Button
                onClick={handleDeleteFileFolder}
                sx={{ marginLeft: 2, border: "1px solid red", color: "red" }}
                className="border"
              >
                Delete
              </Button>
            </Box>
          </Box>

          {/* FOLDERS AND FILES */}
          {!isFileOpen ? (
            <Box>
              {directory?.files?.length > 0 ||
              directory?.folders?.length > 0 ? (
                <>
                  {/* FOLDERS */}
                  {directory?.folders?.map((item, index) => {
                    return (
                      <Box
                        sx={{ display: "inline-block", m: 2 }}
                        className=""
                        key={index}
                      >
                        <img
                          src={folderImage}
                          loading="lazy"
                          className="folderImage"
                          onDoubleClick={() => {
                            getAllfolders(`${item}`, CurrentPath);
                          }}
                        />

                        <Box>
                          {folderNameEditing[item] ? (
                            <form
                              onSubmit={(e) => {
                                handleChangeFileOrFolderName(e, index, item);
                              }}
                              onBlur={() => {
                                setFolderNameEditing(() => {
                                  return { [item]: false };
                                });
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                // label="change name"
                                variant="standard"
                                sx={{ width: "80px", textAlign: "center" }}
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                              />
                            </form>
                          ) : (
                            <Tooltip title="double click to change Name">
                              <Typography
                                color="text.primary"
                                sx={{ textAlign: "center" }}
                                onDoubleClick={() => {
                                  setFolderNameEditing((prev) => {
                                    return { [item]: true };
                                  });
                                  setFileName(item);
                                }}
                              >
                                {item}
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                  {/* FILES */}
                  {directory?.files?.map((item, index) => {
                    return (
                      <Box
                        sx={{ display: "inline-block", m: 2 }}
                        className=""
                        key={index}
                      >
                        <img
                          src={fileImage}
                          loading="lazy"
                          className="folderImage"
                          onDoubleClick={() => {
                            handleOpenFile(item);
                          }}
                        />
                        <Box>
                          {folderNameEditing[item] ? (
                            <form
                              onSubmit={(e) => {
                                handleChangeFileOrFolderName(e, index, item);
                              }}
                              onBlur={() => {
                                console.log("hello in blur");
                                setFolderNameEditing(() => {
                                  return { [item]: false };
                                });
                              }}
                            >
                              <TextField
                                id="standard-basic"
                                // label="change name"
                                variant="standard"
                                sx={{ width: "80px", textAlign: "center" }}
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                              />
                            </form>
                          ) : (
                            <Tooltip title="double click to change Name">
                              <Typography
                                color="text.primary"
                                sx={{ textAlign: "center" }}
                                onDoubleClick={() => {
                                  setFolderNameEditing((prev) => {
                                    return { [item]: true };
                                  });
                                  setFileName(item);
                                }}
                              >
                                {item}
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography sx={{ textAlign: "center", color: "gray" }}>
                  This folder is empty.
                </Typography>
              )}
            </Box>
          ) : (
            <Paper elevation={3} sx={{ p: 2, whiteSpace: "pre-wrap" }}>
              <Box className="" sx={{ display: "flex", alignItems: "center" }}>
                {/* <Typography sx={{ marginRight: "auto" }}>
                  todo 'filename'
                </Typography> */}
                <Tooltip title="Copy File">
                  <ContentCopyIcon
                    sx={{ color: "gray", fontSize: 40, marginLeft: "auto" }}
                    onClick={() => {
                      navigator.clipboard.writeText(fileContant);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Edit File">
                  <EditSquareIcon
                    sx={{ color: "gray", fontSize: 40 }}
                    onClick={() => {
                      setIsEditing((prev) => !prev);
                    }}
                  />
                </Tooltip>
                <Tooltip title="save File">
                  <SaveTwoToneIcon
                    sx={{ color: "green", fontSize: 40 }}
                    onClick={handleSaveFile}
                  />
                </Tooltip>
              </Box>
              <TextareaAutosize
                minRows={2}
                style={{
                  border: isEditing && "2px solid #c3c2d1",
                  outline: "none",
                }}
                variant="plain"
                className="filearea"
                value={fileContant}
                onChange={(e) => {
                  setFileContent(e.target.value);
                }}
                disabled={!isEditing}
              />
            </Paper>
          )}
        </DashboardMainContent>
      </DashboardLayout>

      {/* FILE FOLDER CREATE MODEL */}
      <Model
        openModal={modelState.createFileFolder}
        closeModal={() => onModelClose("createFileFolder")}
        handleSubmit={handleSubmit}
        modelTitle="Select type"
      >
        <>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="storage type"
              name="storageType"
              value={formData?.storageType}
              onChange={handleChange}
            >
              <MenuItem value="">selecet Option</MenuItem>
              <MenuItem value="file">File</MenuItem>
              <MenuItem value="folder">Folder</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
            />
          </Box>
        </>
      </Model>
      {/* FILE FOLDER UPLOAD MODEL */}
      <Model
        openModal={modelState.uploadFileFolder}
        closeModal={() => {
          onModelClose("uploadFileFolder");
        }}
        // handleSubmit={handleSubmit}
        modelTitle="Upload File or Folder"
      >
        <>
          <Button>
            <input
              type="file"
              className="border"
              webkitdirectory="true"
              directory="true"
              multiple
            />
          </Button>
        </>
      </Model>
    </>
  );
};

export default Files;
