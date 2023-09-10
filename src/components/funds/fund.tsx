import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Box } from "@mui/material";

export type Props = {};

export const Fund: React.FC<Props> = ({}) => {
  const fund = useSelector(selectors.funds.current);
  if (!fund) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <Box sx={{ typography: "h3" }}>{fund.name}</Box>
    </Box>
  );
};
