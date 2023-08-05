import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { Box } from "@mui/material";

import { Account } from "./account";

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useSelector: vi.fn(),
  };
});

function mockSelector({ account }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return account;
    }
  });
}

describe("Account tests", () => {
  beforeEach(() => {
    useSelector.mockReset();
  });
  it("renders the component with no account", () => {
    mockSelector({});
    const component = shallow(<Account />);
    expect(component.text()).toEqual("");
  });
  it("renders the component as expected", () => {
    const account = { name: "Account Name" };
    mockSelector({ account });
    const component = shallow(<Account />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box).text()).toEqual("Account Name");
  });
});
