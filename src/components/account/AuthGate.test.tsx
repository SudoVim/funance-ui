import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useNavigate } from "react-router";

import { AuthGate } from "./AuthGate";

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

function mockSelector({ hasAuth }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return hasAuth;
    }
  });
}

describe("AuthGate tests", () => {
  let props = null;
  let dispatch = null;
  let navigate = null;
  beforeEach(() => {
    props = {};
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
    navigate = vi.fn();
    useNavigate.mockReset();
    useNavigate.mockReturnValue(navigate);
  });
  it("redirects to /login when there is no auth present", () => {
    const component = shallow(<AuthGate {...props}>children</AuthGate>);
    expect(component.text()).toEqual("");

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/login");
  });
  it("renders children if there is auth present", () => {
    mockSelector({ hasAuth: true });
    const component = shallow(<AuthGate {...props}>children</AuthGate>);
    expect(component.text()).toEqual("children");

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(0);
  });
  it("redirects to configured route if specified", () => {
    mockSelector({ hasAuth: true });
    const component = shallow(
      <AuthGate {...props} redirectHasAuth="/route">
        children
      </AuthGate>,
    );
    expect(component.text()).toEqual("");

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/route");
  });
});
