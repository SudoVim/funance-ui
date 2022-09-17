import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function Root() {
  const theme = useTheme();
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
      <RouterProvider router={router} />
    </Box>
  );
}

export default Root;
