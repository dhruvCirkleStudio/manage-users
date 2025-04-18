import { RouterProvider, createBrowserRouter } from "react-router";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Auth from "../components/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export default function Router() {
  const routingArr = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
    // {
    //   path: "/Register",
    //   element: <Register />,
    // },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/ForgotPassword",
      element: <ForgotPassword />,
    },
    {
      path: "/ResetPassword",
      element: <ResetPassword />,
    },
  ]);

  return <RouterProvider router={routingArr} />;
}
