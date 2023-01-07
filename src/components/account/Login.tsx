import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions, selectors } from "features";
import { FormGrid, Submit } from "components/utils/forms";
import { EndpointAlert } from "components/utils/alerts";
import { useNavigate } from "react-router";

export type Props = {};

export const Login: React.FC<Props> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginState = useSelector(selectors.account.login);
  const hasAuth = useSelector(selectors.api.hasAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginDisabled = !username || !password;

  useEffect(() => {
    if (hasAuth) {
      navigate("/");
    }
  }, [hasAuth, navigate]);

  useEffect(() => {
    dispatch(actions.account.login.clear());
  }, [dispatch]);

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(
            actions.account.login.request({
              username,
              password,
            })
          );
        }}
      >
        <FormGrid>
          <Typography variant="h3" color={theme.palette.text.primary}>
            Login!
          </Typography>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            id="outlined-basic"
            label="Password"
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Submit disabled={loginDisabled} text="Login" />
        </FormGrid>
      </form>
      <EndpointAlert endpoint={loginState} />
    </Box>
  );
};

export default Login;
