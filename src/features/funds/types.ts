export type Fund = {
  id: string;
  name: string;
  shares: number;
  created_at: string;
  updated_at: string;
};

export type FundAllocation = {
  id: string;
  fund: string;
  ticker: {
    symbol: string;
  };
  shares: number;
  created_at: string;
  updated_at: string;
};

export type FundReference = {
  id: string;
};

export type CurrentState = {
  currentFund?: FundReference;
};
