import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { Box } from "@mui/material";

import { Fund } from "./fund";

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useSelector: vi.fn(),
  };
});

function mockSelector({ fund }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return fund;
    }
  });
}

describe("Fund tests", () => {
  let props = null;
  beforeEach(() => {
    props = {};
    useSelector.mockReset();
  });
  it("renders nothing if the fund is not found", () => {
    mockSelector({});
    const component = shallow(<Fund {...props} />);
    expect(component.text()).toEqual("");
  });
  it("renders the page if the fund is found", () => {
    const fund = { name: "fund-name" };
    mockSelector({ fund });
    const component = shallow(<Fund {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box)).toHaveLength(2);
    expect(component.find(Box).at(1).text()).toEqual("fund-name");
  });
});
