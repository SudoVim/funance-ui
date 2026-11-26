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
  created_at: string;
  updated_at: string;
};

export type Ticker = {
  symbol: string;
};

// Wire shape of holdings.HoldingAccountAction. The UI still folds buys and
// sells into signed HoldingAccountPurchase rows after the response arrives.
export type HoldingAccountActionName = "buy" | "sell";

export type HoldingAccountAction = {
  id: string;
  ticker_symbol: string;
  action: HoldingAccountActionName;
  quantity: number | string;
  price: number | string;
  purchased_on: string;
  remaining_quantity?: number | string | null;
  created_at?: string;
  updated_at?: string;
};

export type HoldingAccountPurchase = {
  id: string;
  ticker: Ticker;
  price: number;
  quantity: number;
  purchased_at: string;
  created_at: string;
};

export type AccountRequest = EndpointRequest & {
  id: string;
};

export type CurrentState = {
  currentAccount?: AccountRequest;
};

export type CurrentPositionState = {
  currentPosition?: Ticker;
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
  delete: IndirectEndpoint;
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
  profit: number;
};

export type HoldingAccountPurchasesBySymbol = Record<
  string,
  HoldingAccountPurchase[]
>;

export type HoldingAccountPositionsBySymbol = Record<string, AccountPosition>;

export type AccountPositionsState = {
  current: {
    currentPosition?: Ticker;
  };
};

export type State = {
  accounts: AccountsState;
  accountPurchases: AccountPurchasesState;
  positions: AccountPositionsState;
};
