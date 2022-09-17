import { createBrowserRouter } from "react-router-dom";
import Top from "./Top";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
  },
]);
