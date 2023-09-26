import { describe, it, expect } from "vitest";
import {
  getPositions,
  getPositionsBySymbol,
  getSortedPositions,
} from "./account-positions";

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

describe("getPositionsBySymbol tests", () => {
  it("organizes the positions by symbol as expected", () => {
    const positions = [
      {
        ticker: {
          symbol: "AAPL",
        },
        shares: 27,
        costBasis: 152,
        rawPurchases: [],
        heldPurchases: [],
        sales: [],
      },
      {
        ticker: {
          symbol: "MSFT",
        },
        shares: 2,
        costBasis: 122,
        rawPurchases: [],
        heldPurchases: [],
        sales: [],
      },
    ];
    const cmp = getPositionsBySymbol.resultFunc(positions);
    expect(cmp).toEqual({
      AAPL: positions[0],
      MSFT: positions[1],
    });
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
