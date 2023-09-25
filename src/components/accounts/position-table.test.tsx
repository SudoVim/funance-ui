import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";

import { PositionTable } from "./position-table";

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useSelector: vi.fn(),
  };
});

function mockSelector({ account, sortedPositions }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 2;
    switch (iteration) {
      case 0:
        return account;
      case 1:
        return sortedPositions;
    }
  });
}

describe("PositionTable tests", () => {
  let dispatch = null;
  beforeEach(() => {
    useSelector.mockReset();
  });
  it("throws if current account not found", () => {
    const sortedPositions = [];
    mockSelector({ sortedPositions });
    expect(() => {
      shallow(<PositionTable />);
    }).toThrow(
      "necessary current values must be configured to render PositionTable",
    );
  });
  it("throws if current sortedPositions not found", () => {
    const account = {};
    const sortedPositions = undefined;
    mockSelector({ account, sortedPositions });
    expect(() => {
      shallow(<PositionTable />);
    }).toThrow(
      "necessary current values must be configured to render PositionTable",
    );
  });
  it("renders the table with expected values", () => {
    const account = {};
    const sortedPositions = [];
    mockSelector({ account, sortedPositions });
    const component = shallow(<PositionTable />);
    expect(component.find("Table")).toHaveLength(1);
    expect(component.find("Table").props().results).toEqual(sortedPositions);
  });
  it("renders a row as expected", () => {
    const account = { id: "account/id" };
    const sortedPositions = [];
    mockSelector({ account, sortedPositions });
    const component = shallow(<PositionTable />);
    expect(component.find("Table")).toHaveLength(1);
    const cmpRow = component
      .find("Table")
      .props()
      .getRow({
        ticker: {
          symbol: "$HEL",
        },
        shares: 3,
        costBasis: 63.479,
      });
    expect(cmpRow).toEqual({
      key: "$HEL",
      link: "/app/accounts/account%2Fid/positions/%24HEL",
      cells: {
        costBasis: "$190.44",
        costBasisPerShare: "$63.48",
        shares: 3,
        symbol: "$HEL",
      },
    });
  });
});
