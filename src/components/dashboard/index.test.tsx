import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useNavigate } from "react-router";

import { Dashboard } from "./index";

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

vi.mock("react-router", () => {
  return {
    useNavigate: vi.fn(),
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
    dispatch = vi.fn();
    navigate = vi.fn();
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
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([
      {
        type: "holdings.accounts.list/fetchPage",
        payload: { fetchAll: true },
      },
    ]);
    expect(dispatch.mock.calls[1]).toEqual([
      {
        type: "holdings.account_purchases.list/fetchPage",
        payload: { fetchAll: true },
      },
    ]);
  });
});
