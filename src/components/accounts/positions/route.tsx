import { Outlet } from "react-router-dom";
import { Position } from "./position";
import { PositionWrapper } from "./position-wrapper";

export const route = {
  path: "positions",
  element: <Outlet />,
  children: [
    {
      path: ":symbol",
      element: <PositionWrapper />,
      children: [
        {
          index: true,
          element: <Position />,
        },
      ],
    },
  ],
};
