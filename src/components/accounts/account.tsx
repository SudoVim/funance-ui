import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Box } from "@mui/material";

export type Props = {};

export const Account: React.FC<Props> = ({}) => {
  const account = useSelector(selectors.holdings.accounts.current);
  if (!account) {
    return null;
  }

  return <Box sx={{ typography: "h3" }}>{account.name}</Box>;
};
