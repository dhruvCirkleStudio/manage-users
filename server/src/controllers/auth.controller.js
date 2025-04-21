import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otp.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { apiResponse, errorResponse } from "../utils/response.js";

const saltRounds = Number(process.env.SALTROUNDS);

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, { message: "Credentials are missing!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, { message: "invalid credentials!" });
    }

    const isUserMatch = await bcrypt.compare(password, user.password);

    if (!isUserMatch) {
      return errorResponse(res, 401, { message: "invalid email or password!" });
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
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2day
    });
    return apiResponse(res, 200, {
      status: true,
      message: "Authentication successful!",
      data: { user: userData, accessToken },
    });
  } catch (error) {
    console.log("error in authenticating user:", error);
    return errorResponse(res, 500, {
      message: "An error occurred while authenticating User!",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, 400, { message: "token does not Provided!" });
    }
    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decoded.userId) {
      return errorResponse(res, 401, { message: "token invalid!" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 401, { message: "User not found!" });
    }

    if (user.token !== refreshToken) {
      return errorResponse(res, 403, {
        message: "Refresh token does not match!",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    return apiResponse(res, 200, {
      status: true,
      message: "token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 401, { message: "Invalid token!" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 401, { message: "Refresh token expired!" });
    }
    return errorResponse(res, 500, {
      message: "error while refreshing token!",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return errorResponse(res, 400, { message: "passwords are missing!" });
    }
    if (oldPassword === newPassword) {
      return errorResponse(res, 400, {
        message: "New password must be different",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, { message: "User not found" });
    }

    const isUserMatch = await bcrypt.compare(oldPassword, user?.password);
    console.log(isUserMatch);

    if (!isUserMatch) {
      return errorResponse(res, 401, { message: "Old password is wrong!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    apiResponse(res, 200, {
      status: true,
      message: "password changed!",
      data: null,
    });
  } catch (error) {
    console.log("error in resetPassword:", error);
    return errorResponse(res, 500, { message: "something went wrong!" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, { message: "email is required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, { message: "User does not exist!" });
    }

    const newOtp = crypto?.randomInt(100000, 999999);
    console.log(newOtp);

    await Otp.findOneAndUpdate(
      {
        recieverId: user._id,
        emailReciever: email,
        Emailsender: process.env.EMAIL_SENDER_ADDESS,
      },
      {
        otp: newOtp,
      },
      { upsert: true, new: true }
    );

    const sendOTP = async (otp, email) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SENDER_ADDESS,
          pass: process.env.EMAIL_SENDER_PASS_KEY, // Use app password if 2FA is enabled
        },
        connectionTimeout: 5000,
        socketTimeout: 5000,
      });
      const mailOptions = {
        from: process.env.EMAIL_SENDER_ADDESS,
        to: email,
        subject: "Your verification Code",
        text: `Your OTP is: ${otp}\nThis code expires in 5 minutes.`,
      };
      await transporter.verify();
      await transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully");
    };

    await sendOTP(newOtp, email);
    apiResponse(res, 200, {
      status: true,
      message: "otp send successfull",
      data: null,
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    errorResponse(res, 500, { message: "error occured while sending otp!" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!otp || !newPassword || !email) {
      return errorResponse(res, 400, { message: "credentials are missing!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, { message: "User not found." });
    }

    const existingOtp = await Otp.findOne({ emailReciever: email });
    if (!existingOtp) {
      return errorResponse(res, 400, { message: "otp expired!" });
    }
    if (existingOtp.otp !== otp) {
      return errorResponse(res, 401, { message: "Invalid OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    //DELETE USED OTP
    await Otp.deleteOne({ _id: existingOtp._id });

    return apiResponse(res, 200, {
      status: true,
      message: "Password forgot successfully",
      data: null,
    });
  } catch (error) {
    console.log("error in forgotPassword:", error);
    return errorResponse(res, 500, { message: "Faild to forget Password!" });
  }
};
