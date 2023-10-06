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
    <Box typography="body2" color={color}>
      {text}
    </Box>
  );
};
