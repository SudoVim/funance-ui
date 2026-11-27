import React from "react";
import { PurchaseType } from "./common";
import { Box, useTheme } from "@mui/material";

export type Props = {
  purchaseType: PurchaseType;
  text: string;
};

export const ColoredText: React.FC<Props> = ({ purchaseType, text }) => {
  const theme = useTheme();
  const color =
    purchaseType === "BUY"
      ? theme.palette.primary.main
      : theme.palette.secondary.main;
  return (
    <Box color={color} sx={{ typography: "body2", fontWeight: "bold" }}>
      {text}
    </Box>
  );
};
