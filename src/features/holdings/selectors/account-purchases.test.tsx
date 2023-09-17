import { describe, it, expect } from "vitest";
import {
  getPurchases,
  getPurchasesBySymbol,
  getPositions,
  getSortedPositions,
} from "./account-purchases";

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

describe("getPositions tests", () => {
  it("returns results as expected", () => {
    const purchasesBySymbol = {
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
    };
    const cmpPositions = getPositions.resultFunc(purchasesBySymbol);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "AAPL",
        },
        shares: 3,
        costBasis: 234,
        rawPurchases: purchasesBySymbol.AAPL,
        heldPurchases: purchasesBySymbol.AAPL,
        sales: [],
      },
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 7,
        costBasis: (123 * 5 + 121 * 2) / 7,
        rawPurchases: purchasesBySymbol.MSFT,
        heldPurchases: purchasesBySymbol.MSFT,
        sales: [],
      },
    ]);
  });
  it("sells partial position", () => {
    const purchasesBySymbol = {
      MSFT: [
        {
          ticker: { symbol: "MSFT" },
          quantity: -2,
          price: 121,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 5,
          price: 123,
        },
      ],
    };
    const cmpPositions = getPositions.resultFunc(purchasesBySymbol);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 3,
        costBasis: 123,
        rawPurchases: purchasesBySymbol.MSFT,
        heldPurchases: [
          {
            ticker: { symbol: "MSFT" },
            quantity: 3,
            price: 123,
          },
        ],
        sales: [
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 123,
              quantity: 2,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 2,
              ticker: { symbol: "MSFT" },
            },
          },
        ],
      },
    ]);
  });
  it("sells full position", () => {
    const purchasesBySymbol = {
      MSFT: [
        {
          ticker: { symbol: "MSFT" },
          quantity: -5,
          price: 121,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 5,
          price: 123,
        },
      ],
    };
    const cmpPositions = getPositions.resultFunc(purchasesBySymbol);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 0,
        costBasis: 0,
        rawPurchases: purchasesBySymbol.MSFT,
        heldPurchases: [],
        sales: [
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 123,
              quantity: 5,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 5,
              ticker: { symbol: "MSFT" },
            },
          },
        ],
      },
    ]);
  });
  it("sells overlapping multiple purchases", () => {
    const purchasesBySymbol = {
      MSFT: [
        {
          ticker: { symbol: "MSFT" },
          quantity: -5,
          price: 121,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 2,
          price: 123,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 4,
          price: 122,
        },
      ],
    };
    const cmpPositions = getPositions.resultFunc(purchasesBySymbol);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 1,
        costBasis: 123,
        rawPurchases: purchasesBySymbol.MSFT,
        heldPurchases: [
          {
            ticker: { symbol: "MSFT" },
            price: 123,
            quantity: 1,
          },
        ],
        sales: [
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 122,
              quantity: 4,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 4,
              ticker: { symbol: "MSFT" },
            },
          },
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 123,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
          },
        ],
      },
    ]);
  });
  it("sells multiple of same purchase", () => {
    const purchasesBySymbol = {
      MSFT: [
        {
          ticker: { symbol: "MSFT" },
          quantity: -1,
          price: 121,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: -1,
          price: 121,
        },
        {
          ticker: { symbol: "MSFT" },
          quantity: 4,
          price: 122,
        },
      ],
    };
    const cmpPositions = getPositions.resultFunc(purchasesBySymbol);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 2,
        costBasis: 122,
        rawPurchases: purchasesBySymbol.MSFT,
        heldPurchases: [
          {
            ticker: { symbol: "MSFT" },
            price: 122,
            quantity: 2,
          },
        ],
        sales: [
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 122,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
          },
          {
            ticker: { symbol: "MSFT" },
            buy: {
              price: 122,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
            sell: {
              price: 121,
              quantity: 1,
              ticker: { symbol: "MSFT" },
            },
          },
        ],
      },
    ]);
  });
});

describe("getSortedPositions tests", () => {
  it("sorts them as expected", () => {
    const positions = [
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 7,
        costBasis: (123 * 5 + 121 * 2) / 7,
      },
      {
        ticker: {
          symbol: "AAPL",
        },
        shares: 3,
        costBasis: 234,
      },
    ];
    const cmpPositions = getSortedPositions.resultFunc(positions);
    expect(cmpPositions).toEqual([
      {
        ticker: {
          symbol: "AAPL",
        },
        shares: 3,
        costBasis: 234,
      },
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 7,
        costBasis: (123 * 5 + 121 * 2) / 7,
      },
    ]);
  });
});
