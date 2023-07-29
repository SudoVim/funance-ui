import { createBrowserRouter } from "react-router-dom";
import { Top } from "./Top";
import { Dashboard } from "components/dashboard";
import { Login, LoggedInApp, AuthGate } from "components/account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
    children: [
      {
        index: true,
        element: <AuthGate redirectHasAuth="/app" />,
      },
      {
        path: "app",
        element: (
          <AuthGate>
            <LoggedInApp />
          </AuthGate>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
