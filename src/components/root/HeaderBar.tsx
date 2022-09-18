import React from "react";
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { selectors } from "features";
import LoginButton from "./LoginButton";

export function HeaderBar() {
  const theme = useTheme();
  const hasAuth = useSelector(selectors.api.hasAuth);
  return (
    <Box
      sx={{
        width: "100%",
        height: "30px",
        padding: "5px",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.primary.main,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box
            sx={{
              fontSize: "large",
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Funance
          </Box>
        </Grid>
        <Grid item xs={8} />
        <Grid item xs={2}>
          <Box
            sx={{
              textAlign: "right",
              marginRight: "20px",
            }}
          >
            {hasAuth ? null : <LoginButton />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HeaderBar;
