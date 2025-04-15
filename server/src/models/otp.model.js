import mongoose, { Types } from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    recieverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emailReciever: {
      type: String,
      required: true,
    },
    Emailsender: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // expires in 5 minutes (300 seconds)
    },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
