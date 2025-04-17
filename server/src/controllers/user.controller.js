import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { apiResponse, errorResponse } from "../utils/response.js";

const saltRounds = 12;

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return apiResponse(res, 200, {
      status:true,
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
      status:true,
      message: "user added successfully!",
      data: null,
    });
  } catch (error) {
    console.log("error in creating user:", error);
    return errorResponse(res,500,{ message: "An error occurred while creating new User!" });
  }
};
