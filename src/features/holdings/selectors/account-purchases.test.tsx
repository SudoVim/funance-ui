import { describe, it, expect } from "vitest";
import { getPurchases, getPurchasesBySymbol } from "./account-purchases";

describe("getPurchases tests", () => {
  it("returns empty list if no page is requested", () => {
    const endpoint = {
      isFilled: false,
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([]);
  });
  it("returns empty list if there is still a next page", () => {
    const endpoint = {
      isFilled: true,
      next: "next-page",
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([]);
  });
  it("returns empty list if there are no pages", () => {
    const endpoint = {
      isFilled: true,
      next: null,
      pages: {},
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([]);
  });
  it("skips purchases from empty pages", () => {
    const endpoint = {
      isFilled: true,
      next: null,
      pages: {
        "1": {
          isFilled: false,
        },
      },
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([]);
  });
  it("skips purchases from failed pages", () => {
    const endpoint = {
      isFilled: true,
      next: null,
      pages: {
        "1": {
          isFilled: true,
          success: false,
        },
      },
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([]);
  });
  it("returns purchases as expected", () => {
    const endpoint = {
      isFilled: true,
      next: null,
      pages: {
        "1": {
          isFilled: true,
          success: true,
          data: {
            results: [{ purchase: "a" }],
          },
        },
        "2": {
          isFilled: true,
          success: true,
          data: {
            results: [{ purchase: "b" }],
          },
        },
      },
    };

    const cmpPurchases = getPurchases.resultFunc(endpoint);
    expect(cmpPurchases).toEqual([{ purchase: "a" }, { purchase: "b" }]);
  });
});

describe("getPurchasesBySymbol tests", () => {
  it("returns empty set for empty results", () => {
    const purchases = [];
    const cmpResult = getPurchasesBySymbol.resultFunc(purchases);
    expect(cmpResult).toEqual({});
  });
  it("organizes purchases properly", () => {
    const purchases = [
      {
        ticker: { symbol: "MSFT" },
        quantity: 5,
        price: 123,
      },
      {
        ticker: { symbol: "AAPL" },
        quantity: 3,
        price: 234,
      },
      {
        ticker: { symbol: "MSFT" },
        quantity: 2,
        price: 121,
      },
    ];
    const cmpResult = getPurchasesBySymbol.resultFunc(purchases);
    expect(cmpResult).toEqual({
      AAPL: [
        {
          ticker: { symbol: "AAPL" },
          quantity: 3,
          price: 234,
        },
      ],
      MSFT: [
        {
          ticker: { symbol: "MSFT" },
          quantity: 5,
          price: 123,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 2,
          price: 121,
        },
      ],
    });
  });
});
