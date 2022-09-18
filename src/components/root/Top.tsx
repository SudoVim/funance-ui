import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeaderBar from "./HeaderBar";

export type Props = {};

export const Top: React.FC<Props> = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        background: theme.palette.background.default,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HeaderBar />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              background: theme.palette.background.default,
            }}
          >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Top;
