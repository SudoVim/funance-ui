import React, { useCallback } from "react";
import { useSelector } from "react-redux";
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
  {
    key: "profit",
    name: "Profit",
  },
];

export const PositionTable: React.FC<Props> = ({}: Props) => {
  const account = useSelector(selectors.holdings.accounts.current);
  const sortedPositions = useSelector(selectors.holdings.positions.sorted);

  const getRow = useCallback(
    (result: AccountPosition) => ({
      key: result.ticker.symbol,
      link: `/app/accounts/${encodeURIComponent(
        account?.id || "",
      )}/positions/${encodeURIComponent(result.ticker.symbol)}`,
      cells: {
        symbol: result.ticker.symbol,
        shares: result.shares,
        costBasisPerShare: `$${result.costBasis.toFixed(2)}`,
        costBasis: `$${(result.shares * result.costBasis).toFixed(2)}`,
        profit: `$${result.profit.toFixed(2)}`,
      },
    }),
    [account],
  );

  if (!account || !sortedPositions) {
    throw new Error(
      "necessary current values must be configured to render PositionTable",
    );
  }

  return (
    <Table<AccountPosition>
      results={sortedPositions}
      headers={HEADERS}
      getRow={getRow}
    />
  );
};
