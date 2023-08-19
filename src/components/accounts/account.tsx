import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type Props = {};

export const Account: React.FC<Props> = ({}) => {
  const account = useSelector(selectors.holdings.accounts.current);
  if (!account) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
        <RouterLink
          to={`/app/accounts/${encodeURIComponent(account.id)}/create_purchase`}
        >
          <Button type="submit" variant="contained">
            Create Purchase
          </Button>
        </RouterLink>
      </Box>
      <Box sx={{ typography: "h3" }}>{account.name}</Box>
    </Box>
  );
};
