import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Table } from "components/utils";
import dayjs from "dayjs";
import { HoldingAccountPurchase } from "features/holdings/types";
import { DeletePurchaseButton } from "./delete-purchase-button";
import { Box } from "@mui/material";
import { ColoredText } from "./colored-text";
import { FixedNumber } from "./fixed-number";
import { purchaseTypeFromNumber } from "./common";

export type Props = {};

const HEADERS = [
  {
    key: "purchasedAt",
    name: "Purchased At",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "quantity",
    name: "Quantity",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "total",
    name: "Total",
  },
  {
    key: "delete",
    name: "",
  },
];

export const PurchaseTable: React.FC<Props> = ({}: Props) => {
  const position = useSelector(selectors.holdings.positions.current);

  const getRow = useCallback((result: HoldingAccountPurchase) => {
    const purchaseType = purchaseTypeFromNumber(result.quantity);
    return {
      key: result.id,
      cells: {
        purchasedAt: (
          <ColoredText
            text={dayjs(result.purchased_at).format("MM/DD/YYYY")}
            purchaseType={purchaseType}
          />
        ),
        type: <ColoredText text={purchaseType} purchaseType={purchaseType} />,
        quantity: (
          <FixedNumber purchaseType={purchaseType} num={result.quantity} />
        ),
        price: (
          <FixedNumber
            purchaseType={purchaseType}
            prefix="$"
            num={result.price}
            fixed={2}
          />
        ),
        total: (
          <FixedNumber
            purchaseType={purchaseType}
            prefix="$"
            num={result.quantity * result.price}
            fixed={2}
          />
        ),
        delete: <DeletePurchaseButton id={result.id} />,
      },
    };
  }, []);

  if (!position) {
    throw new Error(
      "cannot render PurchaseTable without a current position specified",
    );
  }

  return (
    <Table results={position.rawPurchases} headers={HEADERS} getRow={getRow} />
  );
};
