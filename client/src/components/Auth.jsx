import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function Auth() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("token is not provided!");
      navigate("/login");
    }
  }, []);

  return <Outlet />;
}
