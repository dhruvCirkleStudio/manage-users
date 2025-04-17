import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "../utils/ToastNotification";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    otp:"",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.otp || formData.password.trim() === "") {
      errors.password = "Please enter otp!";
    }
    if (!formData.password || formData.password.trim() === "") {
      errors.password = "Please enter password!";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(typeof formData.otp);
    
  };

  const sendOTPmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/sendOtp", { email });
      console.log("otpApi response:", response);
      if (response.status === 200) {
        toast("OTP sent successfully! Check your email.");
      }
    } catch (error) {
      console.log("error in sendEmail:", error);
      toast.error("Failed to send OTP. Please try again later.");
    }
  };
  const resetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!email) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgotPassword`,
        { email, otp: formData.otp, newPassword: formData.password }
      );
      toast("password change successfully!");
      navigate("/login");
    } catch (error) {
      toast("Wrong otp!");
      console.log("error in forgotPassword:", error);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-r from-blue-200 to-white">
      {/* <img src={login} alt="" className='w-auto h-screem'/> */}
      <div className="shadow-2xl p-12 rounded-3xl" style={{ width: "400px" }}>
        <form action="" onSubmit={sendOTPmail} noValidate>
          <input
            type="email"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter email address"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            className={`mt-5 mb-2 border rounded px-4 py-2 font-bold text-white text-xl w-full ${
              email ? "bg-blue-500" : "bg-blue-400"
            }`}
            onClick={sendOTPmail}
            disabled={!email}
          >
            Generate OTP
          </button>
        </form>

        <form action="" onSubmit={resetPassword} noValidate>
          <input
            type="number"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter OTP"
            name="otp"
            value={formData.otp}
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error?.otp}</p>
          <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter new password"
            name="password"
            value={formData.password}
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className=" text-red-500 text-center font-bold">
            {error?.password}
          </p>

          <div className="text-center">
            <button
              className={`mt-5 mb-2 border rounded px-4 py-2 font-bold text-white text-xl w-full ${
                formData.otp && formData.password
                  ? "bg-blue-500"
                  : "bg-blue-400"
              }`}
              onClick={resetPassword}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
