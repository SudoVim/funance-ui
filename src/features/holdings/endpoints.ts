import {
  createPaginatedEndpointSlice,
  PaginatedEndpointRequest,
} from "features/api/endpoint";

export type ListAccountsRequest = PaginatedEndpointRequest & {};

type HoldingAccount = {
  id: string;
  name: string;
  currency: string;
  available_cash: number;
};

export type ListAccountPurchasesRequest = PaginatedEndpointRequest & {
  holdingAccountId?: string;
  tickerSymbol?: string;
};

type HoldingAccountPurchase = {
  id: string;
};

export const endpoints = {
  accounts: {
    list: createPaginatedEndpointSlice<ListAccountsRequest, HoldingAccount>({
      name: "holdings.accounts.list",
    }),
  },
  account_purchases: {
    list: createPaginatedEndpointSlice<
      ListAccountPurchasesRequest,
      HoldingAccountPurchase
    >({
      name: "holdings.account_purchases.list",
    }),
  },
};
