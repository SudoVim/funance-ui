import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions } from "features";

export type Props = {};

export const Login: React.FC<Props> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginDisabled = !username || !password;
  return (
    <Box
      sx={{
        display: "flex",
        width: "600px",
        justifyContent: "center",
        alignItems: "center",
        background: theme.palette.background.paper,
        border: "1px solid grey",
        borderRadius: "10px",
      }}
    >
      <Grid container spacing={2} p={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Typography variant="h3" color={theme.palette.text.primary}>
              Login!
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              disabled={loginDisabled}
              onClick={() => {
                dispatch(
                  actions.account.login({
                    username,
                    password,
                  })
                );
              }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
