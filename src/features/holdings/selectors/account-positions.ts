import {
  HoldingAccountPurchase,
  AccountPosition,
  HoldingAccountPurchasesBySymbol,
  Sale,
  HoldingAccountPositionsBySymbol,
} from "../types";
import { createSelector } from "@reduxjs/toolkit";
import { endpoints } from "../endpoints";
import { getPurchasesBySymbol } from "./account-purchases";
import { State } from "features/types";

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
        const update: any = {};
        for (const heldPurchase of heldPurchases) {
          if (heldPurchase.quantity <= remaining) {
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
          update.quantity = heldPurchase.quantity - remaining;
          if (heldPurchase.quantity === 0) {
            head++;
          }

          break;
        }

        heldPurchases = heldPurchases.slice(head);
        if (heldPurchases.length === 0) {
          continue;
        }

        heldPurchases[0] = {
          ...heldPurchases[0],
          ...update,
        };
      }

      let shares = 0;
      let cost = 0;
      for (const purchase of heldPurchases) {
        shares += purchase.quantity;
        cost += purchase.quantity * purchase.price;
      }

      let profit = 0;
      for (const sale of sales) {
        profit += (sale.sell.price - sale.buy.price) * sale.sell.quantity;
      }

      ret.push({
        ticker: { symbol },
        shares,
        costBasis: shares > 0 ? cost / shares : 0,
        rawPurchases,
        heldPurchases: heldPurchases.reverse(),
        sales,
        profit,
      });
    }

    return ret;
  },
);

export const getPositionsBySymbol = createSelector(
  getPositions,
  (positions: AccountPosition[]): HoldingAccountPositionsBySymbol => {
    const ret: HoldingAccountPositionsBySymbol = {};
    for (const position of positions) {
      ret[position.ticker.symbol] = position;
    }
    return ret;
  },
);

export function getPosition(
  state: State,
  symbol: string,
): AccountPosition | undefined {
  const positionsBySymbol = getPositionsBySymbol(state);
  return positionsBySymbol[symbol];
}

export function getCurrentPosition(state: State): AccountPosition | undefined {
  const currentPosition = state.holdings.positions.current.currentPosition;
  if (!currentPosition) {
    return undefined;
  }
  return getPosition(state, currentPosition.symbol);
}

export const getSortedPositions = createSelector(
  getPositions,
  (positions: AccountPosition[]): AccountPosition[] => {
    return positions.sort((a: AccountPosition, b: AccountPosition) =>
      a.ticker.symbol.localeCompare(b.ticker.symbol),
    );
  },
);

export const selectors = {
  get: (symbol: string) => (state: State) => getPosition(state, symbol),
  current: getCurrentPosition,
  sorted: getSortedPositions,
};
