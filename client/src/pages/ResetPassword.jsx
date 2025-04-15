import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "../utils/ToastNotification";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    otp: 0,
    password: "",
  });

  const validate = () => {
    const errors = {};

    // if (typeof formData.email !== "string" || formData.email.trim() === "") {
    //   errors.email = "Please enter email!";
    // } else {
    //   const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //   if (!emailRegex.test(formData.email)) {
    //     errors.email = "Invalid email format!";
    //   }
    // }
    if (!formData.otp) {
      errors.otp = "Please enter otp!";
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
      console.log(formData);
      const response = await axiosInstance.post("/auth/login", formData);
      console.log(response.data.accessToken);
      if (response.status === 200) navigate("/");
    } catch (error) {
      if (error?.status === 401) setError({ login: "Wrong email or password" });
      console.log("error while login in user", error.status);
    }
  };

  const getOtpDetail = ()=>{
    const response = axios.get()
  }
  useEffect(()=>{
    
  },[])

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-r from-blue-200 to-white">
      {/* <img src={login} alt="" className='w-auto h-screem'/> */}
      <div className="shadow-2xl p-12 rounded-3xl" style={{ width: "400px" }}>
        <form action="" onSubmit={handlesubmit} noValidate>
          <input
            type="number"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter OTP"
            name="otp"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error?.otp}</p>
          <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter password"
            name="password"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error?.password}</p>
          {/* <input
            type="Password"
            className="border my-2 border-gray-500 rounded  p-2 bg-transparent w-full"
            placeholder="Enter confirm password"
            name="password"
            onChange={(e) => {
              handlechange(e);
            }}
          /> */}

          <div className="text-center">
            <button
              className="mt-5 mb-2 border rounded bg-blue-500 px-4 py-2 font-bold text-white text-xl w-full"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
