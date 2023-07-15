import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";
import { Box } from "@mui/material";

import { LogoutButton } from "./LogoutButton";

vi.mock("react", () => {
  return {
    useEffect: vi.fn(),
  };
});

vi.mock("react-redux", () => {
  return {
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

function mockSelector({ loginState }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return loginState;
    }
  });
}

describe("LogoutButton tests", () => {
  let dispatch = null;
  beforeEach(() => {
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
  });
  it("renders the component and unmounts", () => {
    mockSelector({ loginState: emptyEndpoint });
    const component = shallow(<LogoutButton />);
    expect(useEffect).toHaveBeenCalledTimes(1);
    useEffect.mock.calls[0][0]()();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "account.logout/clear",
    });
  });
  it("clicks the button", () => {
    mockSelector({ loginState: emptyEndpoint });
    const component = shallow(<LogoutButton />);
    expect(component.find(Box)).toHaveLength(2);
    component.find(Box).at(1).props().onClick();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "account.logout/request",
    });
  });
});
