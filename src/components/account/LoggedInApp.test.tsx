import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";

import { LoggedInApp } from "./LoggedInApp";

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

function mockSelector({ accountEndpoint }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return accountEndpoint ?? emptyEndpoint;
    }
  });
}

describe("LoggedInApp tests", () => {
  let props = null;
  let dispatch = null;
  beforeEach(() => {
    props = {};
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
  });
  it("kicks off requireAccount on load", () => {
    mockSelector({});
    const component = shallow(<LoggedInApp {...props} />);
    expect(component.text()).toEqual("");

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "account.requireAccount",
    });
  });
  it("renders Outlet if account is filled", () => {
    const accountEndpoint = { isFilled: true };
    mockSelector({ accountEndpoint });
    const component = shallow(<LoggedInApp {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Outlet")).toHaveLength(1);
  });
});
