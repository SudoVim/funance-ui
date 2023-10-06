import { State } from "features/types";
import { PaginatedEndpoint } from "features/api/endpoint";
import {
  HoldingAccountPurchase,
  HoldingAccountPurchasesBySymbol,
} from "../types";
import { createSelector } from "@reduxjs/toolkit";
import { endpoints, PurchaseReference } from "../endpoints";

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

export function getDeleteEndpoint(state: State) {
  return state.holdings.accountPurchases.delete;
}

export function getDeleteEndpointEntry(state: State, ref: PurchaseReference) {
  const endpoint = getDeleteEndpoint(state);
  return endpoints.accountPurchases.delete.getEndpoint(endpoint, ref);
}

export const selectors = {
  delete: {
    get: (ref: PurchaseReference) => (state: State) =>
      getDeleteEndpointEntry(state, ref),
  },
};
