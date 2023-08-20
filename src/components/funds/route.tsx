import { Outlet } from "react-router-dom";
import { List } from "./list";
import { Create } from "./create";

export const route = {
  path: "funds",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <List />,
    },
    {
      path: "create",
      element: <Create />,
    },
  ],
};
