import { Outlet } from "react-router-dom";
import { List } from "./list";

export const route = {
  path: "funds",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <List />,
    },
  ],
};
