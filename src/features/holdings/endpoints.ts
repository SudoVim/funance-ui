import {
  EndpointRequest,
  createPaginatedEndpointSlice,
  createIndirectEndpointSlice,
  PaginatedEndpointRequest,
  createEndpointSlice,
} from "features/api/endpoint";
import { HoldingAccount } from "./types";

export type ListAccountsRequest = PaginatedEndpointRequest & {};

export type ListAccountPurchasesRequest = PaginatedEndpointRequest & {
  holdingAccountId?: string;
  tickerSymbol?: string;
};

export type AccountRequest = EndpointRequest & {
  id: string;
};

export function getAccountKeyFromRequest({ id }: AccountRequest) {
  return id;
}

export type CreateAccountRequest = EndpointRequest & {
  name: string;
};

type HoldingAccountPurchase = {
  id: string;
};

export const endpoints = {
  accounts: {
    list: createPaginatedEndpointSlice<ListAccountsRequest, HoldingAccount>({
      name: "holdings.accounts.list",
    }),
    get: createIndirectEndpointSlice<AccountRequest, HoldingAccount>({
      name: "holdings.accounts.get",
      getKeyFromRequest: getAccountKeyFromRequest,
    }),
    create: createEndpointSlice<CreateAccountRequest, HoldingAccount>({
      name: "holdings.accounts.create",
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
