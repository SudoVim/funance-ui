import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

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
    const account = { id: "account%id", name: "Account Name" };
    mockSelector({ account });
    const component = shallow(<Account />);
    expect(component.text()).not.toEqual("");
    expect(component.find(RouterLink)).toHaveLength(1);
    expect(component.find(RouterLink).props().to).toEqual(
      "/app/accounts/account%25id/create_purchase",
    );
    expect(component.find(Box)).toHaveLength(3);
    expect(component.find(Box).at(2).text()).toEqual("Account Name");
  });
});
