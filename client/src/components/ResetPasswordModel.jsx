import React from "react";
import {
  TextField,
  Box,
} from "@mui/material";
import Model from "../shared/Model";

const ResetPasswordModel = ({
  isOpen,
  onClose,
  resetPassword,
  passwords,
  setPasswords,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  return (
    <Model
      openModal={isOpen}
      closeModal={onClose}
      aria-labelledby="reset-password-dialog"
      modelTitle="Reset Password"
      handleSubmit={resetPassword}
    >
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Current Password"
          name="oldPassword"
          value={passwords.oldPassword}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="New Password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
          variant="outlined"
        />
      </Box>
    </Model>
  );
};

export default ResetPasswordModel;
