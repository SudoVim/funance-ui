import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import Unauthed from "./Unauthed";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type Props = {};

export const Top: React.FC<Props> = () => {
  const theme = useTheme();
  const hasAuth = useSelector(selectors.api.hasAuth);
  if (!hasAuth) {
    return <Unauthed />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        background: theme.palette.background.default,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default Top;
