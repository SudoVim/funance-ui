import { State } from "features/types";
import { PaginatedEndpoint } from "features/api/endpoint";
import {
  HoldingAccountPurchase,
  AccountPosition,
  HoldingAccountPurchasesBySymbol,
} from "../types";
import { createSelector } from "@reduxjs/toolkit";
import { endpoints } from "../endpoints";

export function getPurchasesEndpoint(
  state: State,
): PaginatedEndpoint<HoldingAccountPurchase> {
  return state.holdings.accountPurchases.list;
}

export const getPurchases = createSelector(
  getPurchasesEndpoint,
  (
    endpoint: PaginatedEndpoint<HoldingAccountPurchase>,
  ): HoldingAccountPurchase[] => {
    if (!endpoint.isFilled || endpoint.next) {
      return [];
    }

    let page = 1;
    const ret: HoldingAccountPurchase[] = [];
    while (true) {
      const pageEndpoint = endpoints.accountPurchases.list.getPage(endpoint, {
        page,
      });
      if (!pageEndpoint.isFilled || !pageEndpoint.success) {
        break;
      }

      ret.push(...pageEndpoint.data.results);
      page++;
    }

    return ret;
  },
);

export const getPurchasesBySymbol = createSelector(
  getPurchases,
  (purchases: HoldingAccountPurchase[]): HoldingAccountPurchasesBySymbol => {
    if (purchases.length === 0) {
      return {};
    }

    const purchasesBySymbol: HoldingAccountPurchasesBySymbol = {};
    for (const purchase of purchases) {
      const symbolPurchases = purchasesBySymbol[purchase.ticker.symbol] ?? [];
      symbolPurchases.push(purchase);
      purchasesBySymbol[purchase.ticker.symbol] = symbolPurchases;
    }

    return purchasesBySymbol;
  },
);

export const getPositions = createSelector(
  getPurchasesBySymbol,
  (purchasesBySymbol: HoldingAccountPurchasesBySymbol): AccountPosition[] => {
    const ret: AccountPosition[] = [];
    for (const symbol of Object.keys(purchasesBySymbol)) {
      let shares = 0;
      let cost = 0;
      const symbolPurchases = purchasesBySymbol[symbol];
      for (const purchase of symbolPurchases) {
        shares += purchase.quantity;
        cost += purchase.quantity * purchase.price;
      }

      ret.push({
        ticker: { symbol },
        shares,
        costBasis: cost / shares,
      });
    }

    return ret;
  },
);

export const getSortedPositions = createSelector(
  getPositions,
  (positions: AccountPosition[]): AccountPosition[] => {
    return positions.sort((a: AccountPosition, b: AccountPosition) =>
      a.ticker.symbol.localeCompare(b.ticker.symbol),
    );
  },
);

export const accountPurchases = {
  sortedPositions: getSortedPositions,
};
