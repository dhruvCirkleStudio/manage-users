import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

const saltRounds = 12;

export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({message:'success',users})
    } catch (error) {
        console.log('error in getting all user:',error)
        res.status(500).json({message:'something went wrong!'})
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
      return res.status(400).json({ error: "some fields are missing!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "email already exists" });
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

    return res.status(200).json({ status: "user added successfully!" });
  } catch (error) {
    console.log("error in creating user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating new User!" });
  }
};

