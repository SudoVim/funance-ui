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
          <Box typography="body2">
            {dayjs(result.purchased_at).format("MM/DD/YYYY")}
          </Box>
        ),
        type: <ColoredText text={purchaseType} purchaseType={purchaseType} />,
        quantity: <FixedNumber num={result.quantity} />,
        price: <FixedNumber prefix="$" num={result.price} fixed={2} />,
        total: (
          <FixedNumber
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
