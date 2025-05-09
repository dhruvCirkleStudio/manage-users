import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { emailRegex } from "../shared/constants";
import axiosInstance from "../utils/axiosInstance";

export default function Login() {
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
      localStorage.setItem("accessToken", response.data.data.accessToken);
      if (response.status === 200) navigate("/Users");
    } catch (error) {
      if (error?.status === 401) setError({ login: "Wrong email or password" });
      console.log("error while login in user", error.status);
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
            placeholder="Enter email"
            name="email"
            onChange={(e) => {
              handlechange(e);
            }}
          />
          <p className="text-red-500 text-sm">{error?.email}</p>

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
          <p className=" text-red-500 text-center font-bold">{error?.login}</p>

          <div className="text-center">
            <button
              className="mt-5 mb-2 border rounded bg-blue-500 px-4 py-2 font-bold text-white text-xl w-full"
              type="submit"
            >
              Login
            </button>
            <br />
          </div>
          {/* <small className="font-bold text-gray-400">
            Already Have Account?{" "}
            <Link to="/Register" className="text-blue-500 font-bold underline">
              Register!
            </Link>
          </small> */}
          <small className="font-bold text-gray-400">
            <Link
              to="/ForgotPassword"
              className="text-blue-500 font-bold underline"
            >
              Forgot Password!
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
}
