import React, { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router";
import folderImage from "../assets/folder.svg";
import fileImage from "../assets/file.svg";
import Sidebar from "../components/Sidebar";

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
} from "@mui/material";

const Files = () => {
  const navigate = useNavigate();
  const [directory, setDirectory] = useState();
  const [CurrentPath, setCurrentPath] = useState("");

  const [open, setOpen] = React.useState(false);

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
    } catch (error) {
      console.log("error in getAllFolder:", error);
    }
  };

  useEffect(() => {
    getAllfolders();
  }, []);

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setFormData({ name: "", storageType: "" });
  };

  const [formData, setFormData] = useState({
    name: "",
    storageType: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleAddFolder = async (newFolderName) => {
    try {
      const fullFolderPath = CurrentPath + "/" + newFolderName;
      const response = await axiosInstance.post("/file/CreateFolder", {
        folderName: fullFolderPath,
      });
      // console.log(response.data);
      getAllfolders(null,CurrentPath);
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
      getAllfolders(null,CurrentPath);
    } catch (error) {
      console.log("error in create file :", error);
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
          <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
            {/* <ul className="pathItemList">
              <li className="pathItems" onClick={handleChangingPath}>
                Root Directory
              </li>
              {CurrentPath.split("/").map((item) => {
                return (
                  <>
                    <span className="">{">"}</span>
                    <li
                      className="pathItems"
                      onClick={() => handleChangingPath(item)}
                    >
                      {item}
                    </li>
                  </>
                );
              })}
            </ul> */}
            <Breadcrumbs aria-label="breadcrumb" separator="›">
              <Link
                underline="hover"
                color="inherit"
                className="pathItems"
                onClick={(e) => handleChangingPath(e)}
              >
                Root Directory
              </Link>
              {CurrentPath.split("/")
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
          </Box>
          {/* folders Table */}
          <Box>
            {directory?.files?.length > 0 || directory?.folders?.length > 0 ? (
              <>
                {directory?.folders?.map((item, index) => {
                  return (
                    <Box
                      sx={{ display: "inline-block", m: 2 }}
                      className=""
                      key={index}
                      onDoubleClick={() => {
                        getAllfolders(`${item}`, CurrentPath);
                      }}
                    >
                      <img
                        src={folderImage}
                        loading="lazy"
                        className="folderImage"
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        sx={{ textAlign: "center" }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
                {directory?.files?.map((item, index) => {
                  return (
                    <Box
                      sx={{ display: "inline-block", m: 2 }}
                      className=""
                      key={index}
                      onDoubleClick={() => {
                        console.log(`from file ${item}`);
                      }}
                    >
                      <img
                        src={fileImage}
                        loading="lazy"
                        className="folderImage"
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        sx={{ textAlign: "center" }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Typography variant="h6" color="text.primary">
                Empty Folder
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={open}
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
