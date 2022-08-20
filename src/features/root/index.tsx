import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderBar from "./HeaderBar";

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
      <HeaderBar />
    </Box>
  );
}

export default Root;
