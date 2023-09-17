import { State } from "features/types";
import { PaginatedEndpoint } from "features/api/endpoint";
import {
  HoldingAccountPurchase,
  AccountPosition,
  HoldingAccountPurchasesBySymbol,
  Sale,
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
      let heldPurchases: HoldingAccountPurchase[] = [];
      const rawPurchases = purchasesBySymbol[symbol];
      const chronologicalPurchases = rawPurchases.slice().reverse();
      const sales: Sale[] = [];
      for (const purchase of chronologicalPurchases) {
        if (purchase.quantity > 0) {
          heldPurchases.push(purchase);
          continue;
        }

        let remaining = -1 * purchase.quantity;
        let head = 0;
        for (const heldPurchase of heldPurchases) {
          if (heldPurchase.quantity < remaining) {
            remaining -= heldPurchase.quantity;
            sales.push({
              ticker: { symbol },
              buy: heldPurchase,
              sell: {
                ...purchase,
                quantity: heldPurchase.quantity,
              },
            });
            head++;
            continue;
          }

          sales.push({
            ticker: { symbol },
            buy: {
              ...heldPurchase,
              quantity: remaining,
            },
            sell: {
              ...purchase,
              quantity: remaining,
            },
          });
          heldPurchase.quantity -= remaining;
          if (heldPurchase.quantity === 0) {
            head++;
          }

          break;
        }

        heldPurchases = heldPurchases.slice(head);
      }

      let shares = 0;
      let cost = 0;
      for (const purchase of heldPurchases) {
        shares += purchase.quantity;
        cost += purchase.quantity * purchase.price;
      }

      ret.push({
        ticker: { symbol },
        shares,
        costBasis: shares > 0 ? cost / shares : 0,
        rawPurchases,
        heldPurchases: heldPurchases.reverse(),
        sales,
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
