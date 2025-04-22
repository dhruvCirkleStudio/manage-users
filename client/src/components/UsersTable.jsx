import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Avatar,
  Chip,
  Box,
  // InputAdornment,
  Typography,
  Icon,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateUserModel from "./CreateUserModel";
import UpdateUserModel from "./UpdateUserModel";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
// import Loader from "./Loader";

const UsersTable = memo(() => {
  const [createUserModel, setCreateUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);

  const deleteUser = useCallback(async (id) => {
    try {
      // console.log(user);
      const response = await axiosInstance.delete(`/user/delete/${id}`);
      // console.log(response.data);
      toast(response.message || "user deleted successfully!");
      getAllUsers();
    } catch (error) {
      console.error("error in delete user :", error);
      toast("Error occured while deleting users data!");
    }
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/user");
      // console.log(response.data);
      setUsers(response?.data?.data);
    } catch (error) {
      console.error("error in getAllUser :", error);
      toast("Error while getting users data!");
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your users and their permissions
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Paper elevation={1} sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <TextField
              size="small"
              placeholder="Search users..."
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              onClick={() => setCreateUserModel(true)}
            >
              Add User
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Device type</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.main",
                            mr: 2,
                          }}
                        >
                          {user?.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user?.userName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user?.userType}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user?.deviceType}</TableCell>
                    <TableCell align="right">
                     
                      <IconButton
                        onClick={() => {
                          setUpdateUserModel(true);
                          setFormData({ ...user });
                        }}
                        color="primary"
                        aria-label="edit user"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                         onClick={() => {
                          deleteUser(user._id);
                        }}
                        color="error"
                        aria-label="delete user"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <CreateUserModel
          title="Create User"
          isOpen={createUserModel}
          createUserModel={createUserModel}
          setCreateUserModel={setCreateUserModel}
          getAllUsers={getAllUsers}
        />
        <UpdateUserModel
          title="Update User Details"
          isOpen={updateUserModel}
          updateUserModel={updateUserModel}
          setUpdateUserModel={setUpdateUserModel}
          formData={formData}
          setFormData={setFormData}
          getAllUsers={getAllUsers}
        />
      </Paper>
    </>
  );
});

export default UsersTable;
