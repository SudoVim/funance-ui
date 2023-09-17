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

export type Ticker = {
  symbol: string;
};

export type HoldingAccountPurchase = {
  id: string;
  ticker: Ticker;
  price: number;
  quantity: number;
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

export type Sale = {
  ticker: Ticker;
  buy: HoldingAccountPurchase;
  sell: HoldingAccountPurchase;
};

export type AccountPosition = {
  ticker: Ticker;
  shares: number;
  costBasis: number;
  rawPurchases: HoldingAccountPurchase[];
  heldPurchases: HoldingAccountPurchase[];
  sales: Sale[];
};

export type HoldingAccountPurchasesBySymbol = Record<
  string,
  HoldingAccountPurchase[]
>;

export type State = {
  accounts: AccountsState;
  accountPurchases: AccountPurchasesState;
};
