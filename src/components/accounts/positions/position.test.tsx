import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { Box } from "@mui/material";

import { Position } from "./position";

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

describe("Position tests", () => {
  beforeEach(() => {
    useSelector.mockReset();
  });
  it("throws exception if the current position is not configured", () => {
    mockSelector({});
    expect(() => {
      shallow(<Position />);
    }).toThrow("cannot render Position without a current position configured");
  });
  it("renders the component as expected", () => {
    const position = {
      ticker: { symbol: "MSFT" },
    };
    mockSelector({ position });
    const component = shallow(<Position />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box)).toHaveLength(2);
    expect(component.find(Box).at(1).text()).toEqual("MSFT");
    expect(component.find("PurchaseTable")).toHaveLength(1);
  });
});
