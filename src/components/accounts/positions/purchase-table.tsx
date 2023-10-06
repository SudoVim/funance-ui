import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { Table } from "components/utils";
import dayjs from "dayjs";
import { HoldingAccountPurchase } from "features/holdings/types";
import { DeletePurchaseButton } from "./delete-purchase-button";

export type Props = {};

const HEADERS = [
  {
    key: "purchasedAt",
    name: "Purchased At",
  },
  {
    key: "symbol",
    name: "Symbol",
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

  const getRow = useCallback(
    (result: HoldingAccountPurchase) => ({
      key: result.id,
      cells: {
        purchasedAt: dayjs(result.purchased_at).format("MM/DD/YYYY"),
        symbol: result.ticker.symbol,
        quantity: result.quantity,
        price: `$${result.price.toFixed(2)}`,
        total: `$${(result.quantity * result.price).toFixed(2)}`,
        delete: <DeletePurchaseButton id={result.id} />,
      },
    }),
    [],
  );

  if (!position) {
    throw new Error(
      "cannot render PurchaseTable without a current position specified",
    );
  }

  return (
    <Table results={position.rawPurchases} headers={HEADERS} getRow={getRow} />
  );
};
