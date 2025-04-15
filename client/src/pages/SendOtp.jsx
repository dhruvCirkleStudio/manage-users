import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "../utils/ToastNotification";

export default function SendOtp() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const errors = {};

    if (typeof formData.email !== "string" || formData.email.trim() === "") {
      errors.email = "Please enter email!";
    } else {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format!";
      }
    }

    if (!formData.password || formData.password.trim() === "") {
      errors.password = "Please enter password!";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value)

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlesubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validate()) return;
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      if (response.status === 200) navigate("/");
    } catch (error) {
      if (error?.status === 401) setError({ login: "Wrong email or password" });
      console.log("error while login in user", error.status);
    }
  };

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/sendOtp", { email });
      setEmail("");
      if (response.status === 200) {
        toast("OTP sent successfully! Check your email.");
        navigate("/login");
      }
    } catch (error) {
      console.log("error in sendEmail:", error);
      toast.error("Failed to send OTP. Please try again later.");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-r from-blue-200 to-white">
      {/* <img src={login} alt="" className='w-auto h-screem'/> */}
      <div className="shadow-2xl p-12 rounded-3xl" style={{ width: "400px" }}>
        <form action="" onSubmit={handlesubmit} noValidate>
          <input
            type="email"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter email address"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {/* <p className="text-red-500 text-sm">{error?.email}</p> */}
          <button
            className={`mt-5 mb-2 border rounded px-4 py-2 font-bold text-white text-xl w-full ${
              email ? "bg-blue-500" : "bg-blue-400"
            }`}
            onClick={sendEmail}
            disabled={!email}
          >
            Generate OTP
          </button>

          {/* <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter password"
            name="password"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter confirm password"
            name="password"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error?.password}</p>
          <p className=" text-red-500 text-center font-bold">{error?.login}</p>

          <div className="text-center">
            <button
              className="mt-5 mb-2 border rounded bg-blue-500 px-4 py-2 font-bold text-white text-xl w-full"
              type="submit"
            >
              Reset Password
            </button>
          </div> */}
          {/* <small className="font-bold text-gray-400">
            Back to <Link to="/login" className="text-blue-500 font-bold underline">
              Login!
            </Link>
          </small> */}
        </form>
      </div>
    </div>
  );
}
