import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otp.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { ref, resourceUsage } from "process";

const saltRounds = 12;

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
      return res.status(400).json({ message: "email already exists" });
    }

    // const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // const refreshToken = await jwt.sign(
    //   { userName, email },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    // );

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

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Credentials are missing!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials!" });
    }

    const isUserMatch = await bcrypt.compare(password, user.password);

    if (!isUserMatch) {
      return res.status(401).json({ message: "invalid email or password!" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );

    user.token = refreshToken;
    await user.save();

    // Omit sensitive data from response
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    // Set secure HTTP-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 day
    });

    return res.status(200).json({
      message: "Authentication successful!",
      user: userData,
      accessToken,
    });
  } catch (error) {
    console.log("error in authenticating user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while authenticating User!" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "token does not Provided!" });
    }

    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decoded.userId) {
      return res.status(401).json({ message: "token invalid!" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (user.token !== refreshToken) {
      return res.status(403).json({ message: "Refresh token does not match!" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    return res
      .status(200)
      .json({ message: "token refreshed successfully", accessToken });
  } catch (error) {
    console.log("error in redreshAccessToken :", error);
    return res.status(500).json({ message: "error while refreshing token!" });
  }
};

export const resetPassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "credentials are missing!" });
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isUserMatch = await bcrypt.compare(oldPassword, user?.password);
    console.log(isUserMatch);

    if (!isUserMatch) {
      return res.status(401).json({ message: "Entered wrong password!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "password changed!" });
  } catch (error) {
    console.log("error in resetPassword:", error);
    return res.status(500).json({ message: "something went wrong!" });
  }
};

// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "email is required!" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User does not exist!" });
//     }

//     const newOtp = crypto?.randomInt(100000, 999999);
//     console.log(newOtp);

//     await Otp.findOneAndUpdate(
//       {
//         recieverId: user._id,
//         emailReciever: email,
//         Emailsender: process.env.EMAIL_SENDER_ADDESS,
//       },
//       {
//         otp: newOtp,
//       },
//       { upsert: true, new: true }
//     );

//     const sendOTP = async (otp, email) => {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_SENDER_ADDESS,
//           pass: process.env.EMAIL_SENDER_PASS_KEY, // Use app password if 2FA is enabled
//         },
//         connectionTimeout: 5000,
//         socketTimeout: 5000,
//       });
//       const mailOptions = {
//         from: process.env.EMAIL_SENDER_ADDESS,
//         to: email,
//         subject: "Your verification Code",
//         text: `Your OTP is: ${otp}\nThis code expires in 5 minutes, go to below website to reset password.\n http://localhost:5173/resetPassword/${user._id}`,
//       };
//       await transporter.verify();
//       await transporter.sendMail(mailOptions);
//       console.log("OTP email sent successfully");
//     };

//     await sendOTP(newOtp, email);
//     res.status(200).json({ message: "otp send successfull :" });
//   } catch (error) {
//     console.error("Error in sendOtp:", error);
//     res.status(500).json({ message: "error occured while sending otp!" });
//   }
// };

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     if (!otp || !newPassword || !email) {
//       return res.status(400).json({ message: "credentials are missing!" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const existingOtp = await Otp.findOne({ emailReciever: email });
//     if (!existingOtp) {
//       return res.status(400).json({ message: "otp expired!" });
//     }

//     if (existingOtp.otp !== otp) {
//       return res.status(401).json({ message: "Invalid OTP." });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//     user.password = hashedPassword;
//     await user.save();

//     //DELETE USED OTP
//     await Otp.deleteOne({ _id: existingOtp._id });

//     return res
//       .status(200)
//       .json({ message: "Password forgot successfully", existingOtp });
//   } catch (error) {
//     console.log("error in forgotPassword:", error);
//     return res.status(500).json({ message: "Faild to forget Password!" });
//   }
// };


export const forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!otp || !newPassword || !email) {
      return res.status(400).json({ message: "Credentials are missing!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingOtp = await Otp.findOne({ emailReciever: email });
    if (!existingOtp) {
      return res.status(400).json({ message: "OTP expired or not found!" });
    }

    // Optional: Check if OTP is expired (if you store expiresAt)
    const now = new Date();
    if (existingOtp.expiresAt && existingOtp.expiresAt < now) {
      await Otp.deleteOne({ _id: existingOtp._id });
      return res.status(401).json({ message: "OTP has expired." });
    }

    // Compare OTP
    if (existingOtp.otp != otp) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record
    await Otp.deleteOne({ _id: existingOtp._id });

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};
