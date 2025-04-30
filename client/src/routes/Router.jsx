import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Auth from "../components/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import Users from "../pages/Users";
import Files from "../pages/Files";
import LocalFiles from "../pages/LocalFiles";
import PageNotFound from "../pages/PageNotFound";

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
        {
          path: "LocalFiles",
          element: <LocalFiles />,
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
    {
      path:'*',
      element:<PageNotFound/>
    }
  ]);

  return <RouterProvider router={routingArr} />;
}
