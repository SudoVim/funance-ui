import { Outlet } from "react-router-dom";
import { Create } from "./create";
import { List } from "./list";
import { Account } from "./account";
import { AccountWrapper } from "./account-wrapper";
import { CreatePurchase } from "./create-purchase";

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
      element: <AccountWrapper />,
      children: [
        {
          index: true,
          element: <Account />,
        },
        {
          path: "create_purchase",
          element: <CreatePurchase />,
        },
      ],
    },
    {
      path: "create",
      element: <Create />,
    },
  ],
};
