import { Outlet } from "react-router-dom";
import { Create } from "./create";
import { List } from "./list";
import { Account } from "./account";

export const route = {
  path: "accounts",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <List />,
    },
    {
      path: ":id",
      element: <Account />,
    },
    {
      path: "create",
      element: <Create />,
    },
  ],
};
