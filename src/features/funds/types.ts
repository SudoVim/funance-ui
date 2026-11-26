export type Fund = {
  id: string;
  name: string;
  shares: number;
  created_at: string;
  updated_at: string;
};

export type FundAllocationVersionAction =
  "FLOAT" | "HOLD" | "SELL_REALLOCATE_SHARES" | "SELL_REMOVE_SHARES" | "BUY";

// Allocation of an active fund version. funance stores these as
// FundVersionAllocation; the API that returns them is not implemented yet.
export type FundAllocation = {
  id: string;
  version: string;
  ticker: {
    symbol: string;
  };
  shares: number;
  weekly_confidence: number;
  monthly_confidence: number;
  quarterly_confidence: number;
  modifier: number;
  version_action: FundAllocationVersionAction;
  modify_shares: number;
  created_at: string;
  updated_at: string;
};

export type FundReference = {
  id: string;
};

export type CurrentState = {
  currentFund?: FundReference;
};
