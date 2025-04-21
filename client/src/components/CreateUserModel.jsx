import React, { memo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { emailRegex } from "../shared/constants";

const CreateUserModel = ({
  title,
  isOpen,
  createUserModel,
  setCreateUserModel,
  getAllUsers,
}) => {
  const initialFormdata = {
    userName: "",
    email: "",
    password: "",
    gender: "",
    userType: "",
    deviceType: "",
  };

  const [formData, setFormData] = useState({ ...initialFormdata });
  const [error, setError] = useState({});
  // console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.userName.trim()) {
      errors.userName = "Please enter name!";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter email!";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format!";
    }

    if (!formData.password.trim()) {
      errors.password = "Please enter password!";
    }

    if (!formData.gender) {
      errors.gender = "Please select gender!";
    }

    if (!formData.userType) {
      errors.userType = "Please select user type!";
    }

    if (!formData.deviceType) {
      errors.deviceType = "Please select device type!";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };
  const handleCreateUser = async () => {
    try {
      if (!validate()) return;
      const response = await axiosInstance.post("/user/register", formData);
      toast.success(response?.data?.message);
      getAllUsers();
      onClose();
    } catch (error) {
      console.error("Error while registering user:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };
  const onClose = () => {
    setFormData({ ...initialFormdata });
    setCreateUserModel(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-user-dialog"
    >
      <DialogTitle id="create-user-dialog">
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField
            fullWidth
            margin="normal"
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            error={!!error.userName}
            helperText={error.userName}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!error.email}
            helperText={error.email}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!error.password}
            helperText={error.password}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth margin="normal" error={!!error.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="">select gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {error.gender && (
                <Typography variant="caption" color="error">
                  {error.gender}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!error.userType}>
              <InputLabel id="userType-label">User Type</InputLabel>
              <Select
                labelId="userType-label"
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="guest">Guest</MenuItem>
              </Select>
              {error.userType && (
                <Typography variant="caption" color="error">
                  {error.userType}
                </Typography>
              )}
            </FormControl>
          </Box>

          <FormControl fullWidth margin="normal" error={!!error.deviceType}>
            <InputLabel id="deviceType-label">Device Type</InputLabel>
            <Select
              labelId="deviceType-label"
              label="Device Type"
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
            >
              <MenuItem value="">Select Device Type</MenuItem>
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="pc">PC</MenuItem>
            </Select>
            {error.deviceType && (
              <Typography variant="caption" color="error">
                {error.deviceType}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreateUser} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModel;
