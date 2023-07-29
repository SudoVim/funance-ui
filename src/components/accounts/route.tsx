import { Outlet } from "react-router-dom";
import { Create } from "./create";

export const route = {
  path: "accounts",
  element: <Outlet />,
  children: [
    {
      path: "create",
      element: <Create />,
    },
  ],
};
