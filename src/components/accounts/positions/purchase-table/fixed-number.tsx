import React from "react";
import { ColoredText } from "./colored-text";
import { PurchaseType } from "./common";
import { Box } from "@mui/material";

export type Props = {
  num: number;
  fixed?: number;
  prefix?: string;
};

export const FixedNumber: React.FC<Props> = ({ num, fixed, prefix }) => {
  const fixedNum = num >= 0 ? num : -num;
  const text = `${prefix ?? ""}${
    fixed === undefined ? fixedNum : fixedNum.toFixed(fixed)
  }`;
  return <Box typography="body2">{text}</Box>;
};
