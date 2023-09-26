import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Box } from "@mui/material";
import { PurchaseTable } from "./purchase-table";

export type Props = {};

export const Position: React.FC<Props> = ({}) => {
  const position = useSelector(selectors.holdings.positions.current);
  if (!position) {
    throw new Error(
      "cannot render Position without a current position configured",
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <Box sx={{ typography: "h3" }}>{position.ticker.symbol}</Box>
      <PurchaseTable />
    </Box>
  );
};
