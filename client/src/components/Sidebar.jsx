import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import React from "react";
import { useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar sx={{ backgroundColor: "primary.main", color: "white" }}>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
        </Toolbar>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/Users");
              }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/files");
              }}
            >
              <FolderOpenIcon sx={{ mr: 1 }} />
              <ListItemText primary="files" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
