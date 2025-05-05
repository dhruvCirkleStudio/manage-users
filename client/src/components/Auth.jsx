import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { setNavigate } from "../utils/useNavigateHook";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthentication = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/refreshAccessToken",
        {},
        { withCredentials: true }
      );
      console.log(response);
      const currentPath = location.pathname;
      if(currentPath === '/'){
        navigate("/users");
      }
      localStorage.setItem("accessToken", response.data.data.accessToken);
    } catch (error) {
      navigate("/Login");
      console.log("error in the checkauthentication:", error);
      toast("error verifying user!");
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Outlet />;
}
