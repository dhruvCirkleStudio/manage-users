import { useCallback, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import ResetPasswordModel from "../components/ResetPasswordModel";
import { toast } from "react-toastify";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import UsersTable from "../components/UsersTable";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const [modelState, setModelState] = useState({
    resetPasswordModel: false,
    forgotPasswordModel: false,
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleResetPassword = useCallback(async () => {
    try {
      console.log("in the handleresetPassword");
      const response = await axiosInstance.patch("/auth/resetPassword", {
        ...passwords,
      });
      toast("password changed!");
      setModelState((prev) => {
        return {
          ...prev,
          resetPasswordModel: false,
        };
      });
    } catch (error) {
      console.log("error in resetPassword :", error);
      toast(error?.response?.data?.message);
    }
  },[passwords]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
              selected={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            >
              <DashboardIcon sx={{ mr: 1 }} />
              <ListItemText primary="User Management" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            >
              <AnalyticsIcon sx={{ mr: 1 }} />
              <ListItemText primary="Analytics" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Top navigation */}
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
                User Management
              </Typography>
            </Box>

            {/* Account Menu */}
            <div>
              <Button
                id="account-button"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleMenuClick}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<AccountCircleIcon />}
              >
                Account Settings
              </Button>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setModelState({ ...modelState, resetPasswordModel: true });
                    handleMenuClose();
                  }}
                >
                  Reset Password
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/forgotPassword");
                    handleMenuClose();
                  }}
                >
                  Forgot Password
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>Sign out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        {/* Main content area */}
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Manage your users and their permissions
          </Typography>

          {/* User Table */}
          <Paper sx={{ mt: 2 }}>
            <UsersTable />
          </Paper>
        </Box>
      </Box>

      <ResetPasswordModel
        isOpen={modelState.resetPasswordModel}
        onClose={() => {
          setModelState((prev) => {
            return {
              ...prev,
              resetPasswordModel: false,
            };
          });
          setPasswords({ newPassword: "", oldPassword: "" });
        }}
        resetPassword={handleResetPassword}
        passwords={passwords}
        setPasswords={setPasswords}
      />
    </Box>
  );
};

export default Dashboard;