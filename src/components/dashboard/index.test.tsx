import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useNavigate } from "react-router";

import { Dashboard } from "./index";

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

jest.mock("react-router", () => {
  const original = jest.requireActual("react-router");

  return {
    ...original,
    useNavigate: jest.fn(),
  };
});

function mockSelector({ hasAuth, accountEndpoint }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 2;
    switch (iteration) {
      case 0:
        return hasAuth ?? false;
      case 1:
        return accountEndpoint ?? { isFilled: false };
    }
  });
}

describe("Dashboard tests", () => {
  let dispatch = null;
  let navigate = null;
  beforeEach(() => {
    dispatch = jest.fn();
    navigate = jest.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReset();
    useNavigate.mockReturnValue(navigate);
    useSelector.mockReset();
    mockSelector({});
  });
  it("renders nothing if account is not populated", () => {
    const component = shallow(<Dashboard />);
    expect(component.text()).toEqual("");
  });
  it("renders dashboard if account is populated", () => {
    mockSelector({ accountEndpoint: { isFilled: true } });
    const component = shallow(<Dashboard />);
    expect(component.text()).not.toEqual("");
  });
  it("navigates to login if authentication is not configured", () => {
    const component = shallow(<Dashboard />);
    expect(useEffect).toHaveBeenCalledTimes(3);
    useEffect.mock.calls[0][0]();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/login");
  });
  it("does not navigate to login if authentication is configured", () => {
    mockSelector({ hasAuth: true });
    const component = shallow(<Dashboard />);
    expect(useEffect).toHaveBeenCalledTimes(3);
    useEffect.mock.calls[0][0]();
    expect(navigate).toHaveBeenCalledTimes(0);
  });
  it("requires account on mount", () => {
    const component = shallow(<Dashboard />);
    expect(useEffect).toHaveBeenCalledTimes(3);
    useEffect.mock.calls[1][0]();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "account.requireAccount",
    });
  });
  it("does not request holding accounts patterns on mount if account does not exist", () => {
    mockSelector({
      accountEndpoint: {
        isFilled: false,
      },
    });
    const component = shallow(<Dashboard />);
    expect(useEffect).toHaveBeenCalledTimes(3);
    useEffect.mock.calls[2][0]();
    expect(dispatch).toHaveBeenCalledTimes(0);
  });
  it("requests holding accounts patterns on mount if account exists", () => {
    mockSelector({
      accountEndpoint: {
        isFilled: true,
        success: true,
      },
    });
    const component = shallow(<Dashboard />);
    expect(useEffect).toHaveBeenCalledTimes(3);
    useEffect.mock.calls[2][0]();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.list/fetchPage",
      payload: {},
    });
  });
});
