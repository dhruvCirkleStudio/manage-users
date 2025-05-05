import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function Model({
  children,
  modelTitle,
  openModal,
  closeModal,
  handleSubmit,
}) {
  return (
    <Dialog
      open={openModal}
      closeModal={closeModal}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-user-dialog"
    >
      <DialogTitle id="create-user-dialog">
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {modelTitle}
        </Typography>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" color="error" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
