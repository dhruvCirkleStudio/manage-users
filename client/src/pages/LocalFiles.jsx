import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import folderImage from "../assets/folder.svg";
import fileImage from "../assets/file.svg";
import DashboardLayout, {
  DashboardMainContent,
  DashboardNavigation,
} from "../components/DashboardLayout";

export default function LocalFiles() {
  const [directory, setDirectory] = useState();
  const [CurrentPath, setCurrentPath] = useState("");

  async function handleFileOpen() {
    try {
      // Show file picker
      const [fileHandle] = await window.showOpenFilePicker();

      // Get the file
      const file = await fileHandle.getFile();
      const contents = await file.text();
      console.log("Original file contents:", contents);

      // Create a writable stream
      const writable = await fileHandle.createWritable();

      // Write new content
      await writable.write("This is the updated content!");

      // Close the writable stream to save changes
      await writable.close();

      console.log("File updated successfully!");
    } catch (err) {
      console.error("Error accessing file:", err);
    }
  }

  const openDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();

      console.log("Directory Handle:", dirHandle);
      const directoryInfo = [];
      for await (const [name, handle] of dirHandle.entries()) {
        console.log("Name:", name);
        console.log("Handle:", handle);
        directoryInfo.push({ name, handle });
      }
      setDirectory([...directoryInfo]);
      setCurrentPath(dirHandle.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ("showOpenFilePicker" in window) {
      console.log("compatible for file system");
    } else {
      alert("File System Access API is not supported in this browser.");
    }
  }, []);

  return (
    <>
      <DashboardLayout>
        <DashboardNavigation>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary">
                Your Local Files
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{ marginLeft: "auto" }}
                onClick={() => {
                  openDirectory();
                }}
              >
                Open directory
              </Button>
            </Box>
          </Toolbar>
        </DashboardNavigation>
        <DashboardMainContent>
          {/* MAIN CONTENT */}
          <Box sx={{ p: 3 }}>
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
            </Box>
            <Box>
              {directory?.length > 0 ? (
                <>
                  {/* FOLDERS */}
                  {directory?.map((item, index) => {
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
                        />

                        <Box>
                          <Tooltip title="double click to change Name">
                            <Typography
                              color="text.primary"
                              sx={{ textAlign: "center" }}
                            >
                              {item.name}
                            </Typography>
                          </Tooltip>
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
          </Box>
        </DashboardMainContent>
      </DashboardLayout>
    </>
  );
}
