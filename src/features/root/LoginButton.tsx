import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function LoginButton() {
  const theme = useTheme();
  return (
    <Box>
      <Box sx={{ color: theme.palette.text.primary }}>login</Box>
    </Box>
  );
}

export default LoginButton;
