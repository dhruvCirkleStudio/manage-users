import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Auth from "../components/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import Users from "../pages/Users";
import Files from "../pages/Files";

export default function Router() {
  const routingArr = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
      children: [
        {
          path: "Users",
          element: <Users />,
        },
        {
          path: "Files",
          element: <Files />,
        },
      ],
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/ForgotPassword",
      element: <ForgotPassword />,
    },
  ]);

  return <RouterProvider router={routingArr} />;
}
