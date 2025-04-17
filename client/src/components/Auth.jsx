import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { setNavigate } from "../utils/useNavigateHook";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("token is not provided!");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Outlet />;
}
