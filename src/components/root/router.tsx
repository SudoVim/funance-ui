import { createBrowserRouter } from "react-router-dom";
import Top from "./Top";
import Dashboard from "components/dashboard";
import Login from "components/account/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
