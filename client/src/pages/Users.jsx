import React, { lazy, Suspense } from "react";
import DashboardLayout, {
  DashboardNavigation,
  DashboardMainContent,
} from "../components/DashboardLayout";
import { useCallback, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import ResetPasswordModel from "../components/ResetPasswordModel";
import { toast } from "react-toastify";
const UsersTable = lazy(() => import("../components/UsersTable"));

import {
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

const Users = () => {
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
  }, [passwords]);

  const handleLogOut = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      navigate("/Login");
      toast("you have been logged out!");
    } catch (error) {
      console.log("error in logout function:", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavigation>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary">
                User Management
              </Typography>
            </Box>
            <Box>
              <Button
                id="account-button"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleMenuClick}
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
                <MenuItem
                  onClick={() => {
                    handleLogOut();
                    handleMenuClose();
                  }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </DashboardNavigation>
        <DashboardMainContent>
          <Suspense fallback={<div>Loading users...</div>}>
            <UsersTable />
          </Suspense>
        </DashboardMainContent>
      </DashboardLayout>

      {/* RESET PASSWORD MODEL */}
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
    </>
  );
};

export default Users;
