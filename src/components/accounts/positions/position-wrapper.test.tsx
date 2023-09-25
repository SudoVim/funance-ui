import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useParams } from "react-router-dom";

import { PositionWrapper } from "./position-wrapper";

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal();

  return {
    ...react,
    useEffect: vi.fn(),
  };
});

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useDispatch: vi.fn(),
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

vi.mock("react-router-dom", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useParams: vi.fn(),
  };
});

describe("PositionWrapper tests", () => {
  let dispatch = null;
  beforeEach(() => {
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
    useParams.mockReset();
    useParams.mockReturnValue({});
  });
  it("throws an error when symbol is not given", () => {
    mockSelector({});
    expect(() => {
      shallow(<PositionWrapper />);
    }).toThrow("PositionWrapper component requires a 'symbol' parameter");
  });
  it("sets the current position on mount and clears it on unmount", () => {
    useParams.mockReturnValue({ symbol: "AAPL" });
    mockSelector({});
    const component = shallow(<PositionWrapper />);
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.positions.current/setCurrentPosition",
      payload: { symbol: "AAPL" },
    });

    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.positions.current/setCurrentPosition",
      payload: undefined,
    });
  });
  it("does not render outlet if no current position is configured", () => {
    useParams.mockReturnValue({ symbol: "AAPL" });
    const position = undefined;
    mockSelector({ position });
    const component = shallow(<PositionWrapper />);
    expect(component.text()).toEqual("");
  });
  it("renders outlet if current position is configured", () => {
    useParams.mockReturnValue({ symbol: "AAPL" });
    const position = {};
    mockSelector({ position });
    const component = shallow(<PositionWrapper />);
    expect(component.text()).not.toEqual("");
  });
});
