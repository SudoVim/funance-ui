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

  useEffect(() => {
    if (accountEndpoint?.isFilled && accountEndpoint.success) {
      dispatch(actions.holdings.accounts.list.fetchAllPages({}));
      dispatch(actions.holdings.account_purchases.list.fetchAllPages({}));
    }
  }, [dispatch, accountEndpoint]);

  if (!accountEndpoint.isFilled) {
    return null;
  }

  return (
    <Box>
      <RouterLink to="/app/accounts/create">
        <Button type="submit" variant="contained" disabled={false}>
          Create Account
        </Button>
      </RouterLink>
    </Box>
  );
};
