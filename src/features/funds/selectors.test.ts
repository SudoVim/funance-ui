import { describe, it, expect } from "vitest";
import { getCurrentFund } from "./selectors";

describe("getCurrentFund tests", () => {
  it("returns undefined without a current fund", () => {
    const state = {
      funds: {
        current: {},
      },
    };
    const cmpFund = getCurrentFund(state);
    expect(cmpFund).toEqual(undefined);
  });
  it("returns a current fund", () => {
    const fund = { name: "my-fund" };
    const state = {
      funds: {
        current: {
          currentFund: { id: "fund-id" },
        },
        get: {
          "fund-id": {
            isFilled: true,
            success: true,
            data: fund,
          },
        },
      },
    };
    const cmpFund = getCurrentFund(state);
    expect(cmpFund).toEqual(fund);
  });
  it("has a currentFund but not found in indirect", () => {
    const state = {
      funds: {
        current: {
          currentFund: { id: "fund-id" },
        },
        get: {},
      },
    };
    const cmpFund = getCurrentFund(state);
    expect(cmpFund).toEqual(undefined);
  });
  it("has a currentFund but unsuccessful endpoint", () => {
    const state = {
      funds: {
        current: {
          currentFund: { id: "fund-id" },
        },
        get: {
          "fund-id": {
            isFilled: true,
            success: false,
          },
        },
      },
    };
    const cmpFund = getCurrentFund(state);
    expect(cmpFund).toEqual(undefined);
  });
});
