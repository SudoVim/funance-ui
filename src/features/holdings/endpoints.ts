import {
  EndpointRequest,
  createPaginatedEndpointSlice,
  createIndirectEndpointSlice,
  PaginatedEndpointRequest,
  createEndpointSlice,
} from "features/api/endpoint";
import {
  HoldingAccount,
  HoldingAccountPurchase,
  AccountRequest,
} from "./types";

export type ListAccountsRequest = PaginatedEndpointRequest & {};

export type ListAccountPurchasesRequest = PaginatedEndpointRequest & {
  holdingAccountId?: string;
  tickerSymbol?: string;
};

export function getAccountKeyFromRequest({ id }: AccountRequest) {
  return id;
}

export type CreateAccountRequest = EndpointRequest & {
  name: string;
};

export type CreatePurchaseReference = {
  account: string;
};

export type CreatePurchaseRequest = EndpointRequest &
  CreatePurchaseReference & {
    ticker: string;
    quantity: number;
    price: number;
    purchasedAt: string;
  };

export function getCreatePurchaseKeyFromRequest({
  account,
}: CreatePurchaseReference) {
  return account;
}

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
    createPurchase: createIndirectEndpointSlice<
      CreatePurchaseRequest,
      HoldingAccountPurchase
    >({
      name: "holdings.accounts.createPurchase",
      getKeyFromRequest: getCreatePurchaseKeyFromRequest,
    }),
  },
  accountPurchases: {
    list: createPaginatedEndpointSlice<
      ListAccountPurchasesRequest,
      HoldingAccountPurchase
    >({
      name: "holdings.accountPurchases.list",
    }),
  },
};
