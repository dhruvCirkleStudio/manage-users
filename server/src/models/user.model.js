import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      userName: {
        type: String,
        require: String,
      },
      email: {
        type: String,
        unique: true,
        required:true,
      },
      password: {
        type: String,
        required: true,
      },
      gender:{
        type:String,
        enum: ['male','female','other'],
        required: true,
      },
      userType:{
        type:String,
        required:true
      },
      deviceType:{
        type:String,
        required:true
      },
      token:{
        type:String,
      }
    },
    { timestamps: true }
  );

export const User = mongoose.model('User',userSchema)