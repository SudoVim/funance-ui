import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions, selectors } from "features";
import { EndpointAlert } from "components/utils/alerts";

export function LogoutButton() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const logoutState = useSelector(selectors.account.logout);

  useEffect(
    () => () => {
      dispatch(actions.account.logout.clear());
    },
    [dispatch],
  );

  return (
    <Box>
      <Box
        sx={{
          color: theme.palette.text.primary,
          "&:hover": { cursor: "pointer" },
        }}
        onClick={() => dispatch(actions.account.logout.request({}))}
      >
        logout
      </Box>
      <EndpointAlert
        endpoint={logoutState}
        successMessage="Successfully logged out!"
      />
    </Box>
  );
}
