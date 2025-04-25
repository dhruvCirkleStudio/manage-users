import React, { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router";
import folderImage from "../assets/folder.svg";
import fileImage from "../assets/file.svg";
import Sidebar from "../components/Sidebar";
import { toast } from "../utils/ToastNotification";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Paper,
  TextareaAutosize,
  Tooltip,
  badgeClasses,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Files = () => {
  const navigate = useNavigate();
  const [directory, setDirectory] = useState();
  const [CurrentPath, setCurrentPath] = useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [fileContant, setFileContent] = useState("");
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    storageType: "",
  });

  const onOpen = () => {
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
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
      let response;
      const folderPath = !folderName
        ? currentPath
        : currentPath + "/" + folderName;

      response = await axiosInstance.post("/file", {
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

  const handleAddFolder = async (newFolderName) => {
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
  const handleAddFile = async (newFileName) => {
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
      await handleAddFolder(formData.name);
    } else {
      console.log(formData);
      await handleAddFile(formData.name);
    }
    onClose();
  };

  const handleChangingPath = (e, selectedPath) => {
    e.preventDefault();
    if (!selectedPath) {
      setCurrentPath((prev) => "");
      getAllfolders();
      return;
    }
    const currentPathArray = CurrentPath.split("/");
    const index = currentPathArray.indexOf(selectedPath);
    const UpdatedPath = currentPathArray.slice(0, index + 1).join("/");
    setCurrentPath(() => UpdatedPath);
    getAllfolders(null, UpdatedPath);
    // console.log(currentPathArray, index);
    // console.log(UpdatedPath)
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
      const oldPath = CurrentPath+'/'+oldName; 
      const newPath = CurrentPath+'/'+fileName;
      const response = await axiosInstance.post("/file/changeName", {oldPath,newPath});
      console.log("inside handlechangeName", fileName);
      setFolderNameEditing((prev) => {
        return { ...prev, [index]: false };
      });
      getAllfolders(null,CurrentPath)
    } catch (error) {
      console.log("error in handlechangeName:", error);
    }
  };
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, overflow: "auto" }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary">
                Your Files
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {/* FOLDER NAVIGATION AND ADD/DELETE BUTTONS  */}
          <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
            <Breadcrumbs aria-label="breadcrumb" separator="›">
              <Link
                underline="hover"
                color="inherit"
                className="pathItems"
                onClick={(e) => handleChangingPath(e)}
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
                      onClick={(e) => handleChangingPath(e, item)}
                    >
                      {item}
                    </Link>
                  );
                })}
            </Breadcrumbs>
            <Button
              onClick={onOpen}
              sx={{ marginLeft: "auto", border: "1px solid black" }}
              className="border"
            >
              Add New
            </Button>
            <Button
              onClick={handleDeleteFileFolder}
              sx={{ marginLeft: 2, border: "1px solid red", color: "red" }}
              className="border"
            >
              Delete
            </Button>
          </Box>

          {/* FOLDERS AND FILES */}
          {!isFileOpen ? (
            <Box>
              {directory?.files?.length > 0 ||
              directory?.folders?.length > 0 ? (
                <>
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
                          {folderNameEditing[index] ? (
                            <form
                              onSubmit={(e) => {
                                handleChangeFileOrFolderName(e, index, item);
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
                                    return { [index]: true };
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
                            console.log(`from file ${item}`);
                            handleOpenFile(item);
                          }}
                        />
                        <Tooltip title="double click to change Name">
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.primary"
                              sx={{ textAlign: "center" }}
                              onDoubleClick
                            >
                              {item}
                            </Typography>
                          </Box>
                        </Tooltip>
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
                <Typography sx={{ marginRight: "auto" }}>
                  todo 'filename'
                </Typography>
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
        </Box>
      </Box>

      <Dialog
        open={openModal}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="create-user-dialog"
      >
        <DialogTitle id="create-user-dialog">
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            select
          </Typography>
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="storage type"
              name="storageType"
              value={formData.storageType}
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
              value={formData.name}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Files;
