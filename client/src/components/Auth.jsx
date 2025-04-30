import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { setNavigate } from "../utils/useNavigateHook";

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
      navigate("/users");
      localStorage.setItem("accessToken", response.data.data.accessToken);
    } catch (error) {
      console.log("error in the checkauthentication:", error);
      toast("error verifying user!");
      navigate("/Login");
    }
  };

  useEffect(() => {
    // const token = localStorage.getItem("accessToken");
    checkAuthentication();
  }, []);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Outlet />;
}
