import { AppBar, Box } from "@mui/material";
import React from "react";
import Sidebar from "../components/Sidebar";

export function DashboardNavigation({ children, navTitle }) {
  return (
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
      {children}
    </AppBar>
  );
}
export function DashboardMainContent({ children }) {
  return (
    <>
      <Box sx={{ p: 3 }}>{children}</Box>
    </>
  );
}
export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, overflow: "auto" }}
        className=""
      >
        {children}
      </Box>
    </Box>
  );
}
