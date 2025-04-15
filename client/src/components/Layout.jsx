import { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet} from "react-router-dom";
// import { setNavigate } from "../utils/useNavigateHook";

export default function Layout() {

  //  const navigate = useNavigate();
  
  //   useEffect(() => {
  //       setNavigate(navigate);
  //   }, [navigate]);

  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
    </>
  );
}
