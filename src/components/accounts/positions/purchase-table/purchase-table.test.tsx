import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { ColoredText } from "./colored-text";
import { FixedNumber } from "./fixed-number";
import { DeletePurchaseButton } from "./delete-purchase-button";
import { Box } from "@mui/material";

import { PurchaseTable } from "./purchase-table";

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useSelector: vi.fn(),
  };
});

function mockSelector({ position }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return position;
    }
  });
}

describe("PurchaseTable tests", () => {
  beforeEach(() => {
    useSelector.mockReset();
  });
  it("throws an error if current position is not found", () => {
    mockSelector({});
    expect(() => {
      shallow(<PurchaseTable />);
    }).toThrow(
      "cannot render PurchaseTable without a current position specified",
    );
  });
  it("renders table with the expected values", () => {
    const position = {
      rawPurchases: [],
    };
    mockSelector({ position });
    const component = shallow(<PurchaseTable />);
    expect(component.find("Table")).toHaveLength(1);
    expect(component.find("Table").props().results).toEqual(
      position.rawPurchases,
    );
  });
  it("renders a buy row as expected", () => {
    const position = {
      rawPurchases: [],
    };
    mockSelector({ position });
    const component = shallow(<PurchaseTable />);
    expect(component.find("Table")).toHaveLength(1);
    const result = {
      id: "purchase-id",
      purchased_at: "2023-09-25",
      ticker: { symbol: "TSLA" },
      quantity: 7,
      price: 201.734,
    };
    const cmpRow = component.find("Table").props().getRow(result);
    expect(Object.keys(cmpRow)).toEqual(["key", "cells"]);
    expect(cmpRow.key).toEqual("purchase-id");
    const { cells } = cmpRow;
    expect(Object.keys(cells)).toEqual([
      "purchasedAt",
      "type",
      "quantity",
      "price",
      "total",
      "delete",
    ]);
    const {
      purchasedAt,
      type: typeComp,
      quantity,
      price,
      total,
      delete: deleteComp,
    } = cells;
    expect(purchasedAt.type).toEqual(Box);
    expect(purchasedAt.props.children).toEqual("09/25/2023");
    expect(typeComp.type).toEqual(ColoredText);
    expect(typeComp.props).toEqual({
      purchaseType: "BUY",
      text: "BUY",
    });
    expect(quantity.type).toEqual(FixedNumber);
    expect(quantity.props).toEqual({
      num: 7,
    });
    expect(price.type).toEqual(FixedNumber);
    expect(price.props).toEqual({
      prefix: "$",
      num: 201.734,
      fixed: 2,
    });
    expect(total.type).toEqual(FixedNumber);
    expect(total.props).toEqual({
      prefix: "$",
      num: 1412.1380000000001,
      fixed: 2,
    });
    expect(deleteComp.type).toEqual(DeletePurchaseButton);
    expect(deleteComp.props).toEqual({ id: "purchase-id" });
  });
  it("renders a sell row as expected", () => {
    const position = {
      rawPurchases: [],
    };
    mockSelector({ position });
    const component = shallow(<PurchaseTable />);
    expect(component.find("Table")).toHaveLength(1);
    const result = {
      id: "purchase-id",
      purchased_at: "2023-09-25",
      ticker: { symbol: "TSLA" },
      quantity: -7,
      price: 201.734,
    };
    const cmpRow = component.find("Table").props().getRow(result);
    expect(Object.keys(cmpRow)).toEqual(["key", "cells"]);
    expect(cmpRow.key).toEqual("purchase-id");
    const { cells } = cmpRow;
    expect(Object.keys(cells)).toEqual([
      "purchasedAt",
      "type",
      "quantity",
      "price",
      "total",
      "delete",
    ]);
    const {
      purchasedAt,
      type: typeComp,
      quantity,
      price,
      total,
      delete: deleteComp,
    } = cells;
    expect(purchasedAt.type).toEqual(Box);
    expect(purchasedAt.props.children).toEqual("09/25/2023");
    expect(typeComp.type).toEqual(ColoredText);
    expect(typeComp.props).toEqual({
      purchaseType: "SELL",
      text: "SELL",
    });
    expect(quantity.type).toEqual(FixedNumber);
    expect(quantity.props).toEqual({
      num: -7,
    });
    expect(price.type).toEqual(FixedNumber);
    expect(price.props).toEqual({
      prefix: "$",
      num: 201.734,
      fixed: 2,
    });
    expect(total.type).toEqual(FixedNumber);
    expect(total.props).toEqual({
      prefix: "$",
      num: -1412.1380000000001,
      fixed: 2,
    });
    expect(deleteComp.type).toEqual(DeletePurchaseButton);
    expect(deleteComp.props).toEqual({ id: "purchase-id" });
  });
});
