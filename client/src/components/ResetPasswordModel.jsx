import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

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
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="reset-password-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="reset-password-dialog" sx={{ fontWeight: "bold" }}>
        Reset Password
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={resetPassword}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModel;