import { Outlet } from "react-router-dom";
import { List } from "./list";
import { Create } from "./create";
import { FundWrapper } from "./fund-wrapper";
import { Fund } from "./fund";

export const route = {
  path: "funds",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <List />,
    },
    {
      path: ":id",
      element: <FundWrapper />,
      children: [
        {
          index: true,
          element: <Fund />,
        },
      ],
    },
    {
      path: "create",
      element: <Create />,
    },
  ],
};
