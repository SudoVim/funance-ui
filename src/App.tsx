import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function App() {
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
    ></Box>
  );
}

export default App;
