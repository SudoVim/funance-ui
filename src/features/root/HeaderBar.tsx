import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { selectors } from "features";
import LoginButton from "./LoginButton";

export function HeaderBar() {
  const theme = useTheme();
  const isLoggedIn = useSelector(selectors.account.isLoggedIn);
  return (
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
      {isLoggedIn ? null : <LoginButton />}
    </Box>
  );
}

export default HeaderBar;
