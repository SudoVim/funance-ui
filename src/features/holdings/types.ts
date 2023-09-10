import {
  PaginatedEndpoint,
  Endpoint,
  IndirectEndpoint,
  EndpointRequest,
} from "features/api/endpoint";

export type HoldingAccount = {
  id: string;
  name: string;
  currency: string;
  available_cash: number;
};

export type HoldingAccountPurchase = {
  id: string;
};

export type AccountRequest = EndpointRequest & {
  id: string;
};

export type CurrentState = {
  currentAccount?: AccountRequest;
};

export type AccountsState = {
  list: PaginatedEndpoint<HoldingAccount>;
  get: IndirectEndpoint<HoldingAccount>;
  create: Endpoint<HoldingAccount>;
  createPurchase: IndirectEndpoint<HoldingAccountPurchase>;
  current: CurrentState;
};

export type AccountPurchasesState = {
  list: PaginatedEndpoint<HoldingAccountPurchase>;
};

export type State = {
  accounts: AccountsState;
  accountPurchases: AccountPurchasesState;
};
