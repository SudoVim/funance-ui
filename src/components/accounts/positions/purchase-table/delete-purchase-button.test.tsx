import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint, loadingEndpoint } from "features/api/endpoint";
import { Button } from "@mui/material";

import { DeletePurchaseButton } from "./delete-purchase-button";

vi.mock("react", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
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

function mockSelector({ endpoint }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return endpoint ?? emptyEndpoint;
    }
  });
}

describe("DeletePurchaseButton tests", () => {
  let props = null;
  let dispatch = null;
  beforeEach(() => {
    props = {
      id: "purchase-id",
    };
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
  });
  it("renders the component with empty endpoint and ensures it cleans up", () => {
    mockSelector({});
    const component = shallow(<DeletePurchaseButton {...props} />);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      emptyEndpoint,
    );
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(0);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accountPurchases.delete/clear",
      payload: { id: "purchase-id" },
    });
  });
  it("enables the button when empty", () => {
    const endpoint = emptyEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<DeletePurchaseButton {...props} />);
    expect(component.find(Button).props().disabled).toEqual(false);
  });
  it("disables the button when loading", () => {
    const endpoint = loadingEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<DeletePurchaseButton {...props} />);
    expect(component.find(Button).props().disabled).toEqual(true);
  });
  it("enables the button when filled", () => {
    const endpoint = { isEmpty: false, isLoading: false, isFilled: true };
    mockSelector({ endpoint });
    const component = shallow(<DeletePurchaseButton {...props} />);
    expect(component.find(Button).props().disabled).toEqual(true);
  });
  it("clicks the button and also executes the callback", () => {
    mockSelector({});
    const component = shallow(<DeletePurchaseButton {...props} />);
    component.find(Button).props().onClick();
    expect(dispatch).toHaveBeenCalledTimes(1);
    const { callback } = dispatch.mock.calls[0][0].payload;
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accountPurchases.delete/request",
      payload: {
        id: "purchase-id",
        callback,
      },
    });
    callback();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accountPurchases/reload",
    });
  });
});
