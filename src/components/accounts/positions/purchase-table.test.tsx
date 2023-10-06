import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";

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
  it("renders a row as expected", () => {
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
    const { delete: deleteEntry } = cmpRow.cells;
    expect(cmpRow).toEqual({
      key: "purchase-id",
      cells: {
        price: "$201.73",
        purchasedAt: "09/25/2023",
        quantity: 7,
        symbol: "TSLA",
        total: "$1412.14",
        delete: deleteEntry,
      },
    });
    expect(deleteEntry.props.id).toEqual("purchase-id");
  });
});
