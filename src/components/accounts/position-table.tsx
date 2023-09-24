import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors } from "features";
import { Table } from "components/utils";
import { AccountPosition } from "features/holdings/types";

export type Props = {};

const HEADERS = [
  {
    key: "symbol",
    name: "Symbol",
  },
  {
    key: "shares",
    name: "Shares",
  },
  {
    key: "costBasisPerShare",
    name: "Cost Basis / share",
  },
  {
    key: "costBasis",
    name: "Cost Basis",
  },
];

export const PositionTable: React.FC<Props> = ({}: Props) => {
  const sortedPositions = useSelector(
    selectors.holdings.accountPurchases.sortedPositions,
  );

  const getRow = useCallback(
    (result: AccountPosition) => ({
      key: result.ticker.symbol,
      cells: {
        symbol: result.ticker.symbol,
        shares: result.shares,
        costBasisPerShare: `$${result.costBasis.toFixed(2)}`,
        costBasis: `$${(result.shares * result.costBasis).toFixed(2)}`,
      },
    }),
    [],
  );

  return (
    <Table<AccountPosition>
      results={sortedPositions}
      headers={HEADERS}
      getRow={getRow}
    />
  );
};
