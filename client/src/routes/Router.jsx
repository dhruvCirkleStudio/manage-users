import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Auth from "../components/Auth";
import ForgotPassword from "../pages/ForgotPassword";

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
  ]);

  return <RouterProvider router={routingArr} />;
}
