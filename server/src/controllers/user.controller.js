import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { apiResponse, errorResponse } from "../utils/response.js";

const saltRounds = Number(process.env.SALTROUNDS);

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "_id email gender userName userType deviceType"
    );
    return apiResponse(res, 200, {
      status: true,
      message: "success",
      data: users,
    });
  } catch (error) {
    console.log("error in getting all user:", error);
    errorResponse(res, 500, { message: "something went wrong!" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { userName, email, password, gender, userType, deviceType } =
      req.body;
    if (
      !userName ||
      !email ||
      !password ||
      !gender ||
      !userType ||
      !deviceType
    ) {
      return errorResponse(res, 400, { error: "some fields are missing!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 401, { message: "email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await User.insertOne({
      userName: userName.trim(),
      email: email.trim(),
      password: hashedPassword,
      gender: gender.trim(),
      userType: userType.trim(),
      deviceType: deviceType.trim(),
      // token: refreshToken,
    });

    return apiResponse(res, 200, {
      status: true,
      message: "user added successfully!",
      data: null,
    });
  } catch (error) {
    console.log("error in creating user:", error);
    return errorResponse(res, 500, {
      message: "An error occurred while creating new User!",
    });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { userName, email, gender, userType, deviceType } = req.body;
    if (
      !userName ||
      !email ||
      // !password ||
      !gender ||
      !userType ||
      !deviceType
    ) {
      return errorResponse(res, 400, { error: "some fields are missing!" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return errorResponse(res, 400, { message: "email may not exists" });
    }
    existingUser.userName = userName;
    existingUser.gender = gender;
    existingUser.userType = userType;
    existingUser.deviceType = deviceType;

    await existingUser.save();
    return apiResponse(res, 200, {
      status: true,
      message: "user data updated successfully!",
      data: null,
    });
  } catch (error) {
    console.log("error in creating user:", error);
    return errorResponse(res, 500, {
      message: "An error occurred while creating new User!",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, 400, {
        status: false,
        message: "invalid credentias!", 
        data: null,
      });
    }
    const response = await User.findByIdAndDelete(id);
    if (!response) {
      return errorResponse(res, 404, {
        status: false,
        message: "User not found!",
        data: null,
      });
    }
    return apiResponse(res, 200, {
      status: true,
      message: "data deleted successfully!",
      data: response,
    });
  } catch (error) {
    console.log("error in delete use:", error);
    return errorResponse(res, 500, {
      message: "An error occured while deleting userdata",
    });
  }
};
