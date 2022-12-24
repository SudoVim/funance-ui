import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";
import { Box } from "@mui/material";

import { LogoutButton } from "./LogoutButton";

jest.mock("react", () => {
  const react = jest.requireActual("react");
  return {
    ...react,
    useEffect: jest.fn(),
  };
});

jest.mock("react-redux", () => {
  const reactRedux = jest.requireActual("react-redux");

  return {
    ...reactRedux,
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
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
    dispatch = jest.fn();
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
