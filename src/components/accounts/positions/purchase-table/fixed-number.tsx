import React from "react";
import { ColoredText } from "./colored-text";
import { PurchaseType } from "./common";

export type Props = {
  purchaseType: PurchaseType;
  num: number;
  fixed?: number;
  prefix?: string;
};

export const FixedNumber: React.FC<Props> = ({
  purchaseType,
  num,
  fixed,
  prefix,
}) => {
  const fixedNum = num >= 0 ? num : -num;
  const text = `${prefix ?? ""}${
    fixed === undefined ? fixedNum : fixedNum.toFixed(fixed)
  }`;
  return <ColoredText purchaseType={purchaseType} text={text} />;
};
