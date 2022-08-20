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
    >
      <Box
        sx={{
          width: "100%",
          height: "30px",
          padding: "5px",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.palette.primary.main,
          display: "flex",
          direction: "row",
        }}
      >
        <Box>
          <Box
            sx={{
              fontSize: "large",
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Funance
          </Box>
        </Box>
        <Box>
          <Box sx={{ color: theme.palette.text.primary }}>login</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
