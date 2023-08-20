import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions, selectors } from "features";
import { useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type Props = {};

export const Dashboard: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasAuth = useSelector(selectors.api.hasAuth);
  const accountEndpoint = useSelector(selectors.account.account);

  useEffect(() => {
    if (!hasAuth) {
      navigate("/login");
      return;
    }
  }, [hasAuth, navigate]);

  useEffect(() => {
    dispatch(actions.account.requireAccount());
  }, [dispatch]);

  if (!accountEndpoint.isFilled) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 100 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
          alignItems: "center",
        }}
      >
        <RouterLink to="/app/accounts">
          <Button type="submit" variant="contained" disabled={false}>
            Accounts
          </Button>
        </RouterLink>
        <RouterLink to="/app/funds">
          <Button type="submit" variant="contained" disabled={false}>
            Funds
          </Button>
        </RouterLink>
      </Box>
    </Box>
  );
};
