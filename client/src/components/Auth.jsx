import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";

export default function Auth() {
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/refreshAccessToken",
        {},
        { withCredentials: true }
      );
      console.log(response);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      console.log("hello from dashboard");
    } catch (error) {
      console.log("error in the checkauthentication:", error);
      toast("error verifying user!");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      checkAuthentication();
      // console.log("token is not provided!");
      // navigate("/login");
    }
  }, []);

  return <Outlet />;
}
