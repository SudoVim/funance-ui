import React, { useEffect } from "react";
import { vi, describe, expect, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";
import { useParams } from "react-router-dom";
import { selectors } from "features";
import { Outlet } from "react-router-dom";

import { AccountWrapper } from "./account-wrapper";

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal("react");
  return {
    ...react,
    useEffect: vi.fn(),
  };
});

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal("react-redux");

  return {
    ...reactRedux,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const original = await importOriginal("react-router-dom");

  return {
    ...original,
    useParams: vi.fn(),
  };
});

vi.mock("features", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    selectors: {
      holdings: {
        accounts: { get: vi.fn() },
      },
    },
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

describe("AccountWrapper tests", () => {
  let props = null;
  let dispatch = null;
  beforeEach(() => {
    props = {};
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useParams.mockReset();
    useSelector.mockReset();
    selectors.holdings.accounts.get.mockReset();
  });
  it('throws an error if there is no "id" given', () => {
    mockSelector({});
    useParams.mockReturnValue({});
    expect(() => {
      shallow(<AccountWrapper {...props} />);
    }).toThrowError("AccountWrapper component requires an 'id' parameter");
  });
  it("fetches the entry and sets current account on mount and cleans up on unmount", () => {
    mockSelector({});
    useParams.mockReturnValue({ id: "account-id" });
    shallow(<AccountWrapper {...props} />);

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: "holdings.accounts.get/request",
      payload: {
        id: "account-id",
      },
    });
    expect(dispatch.mock.calls[1][0]).toEqual({
      type: "holdings.accounts.current/setCurrentAccount",
      payload: {
        id: "account-id",
      },
    });
    expect(dispatch.mock.calls[2][0]).toEqual({
      type: "holdings.accountPurchases/reload",
      payload: "account-id",
    });

    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(6);
    expect(dispatch.mock.calls[3][0]).toEqual({
      type: "holdings.accounts.get/clear",
      payload: {
        id: "account-id",
      },
    });
    expect(dispatch.mock.calls[4][0]).toEqual({
      type: "holdings.accounts.current/setCurrentAccount",
    });
    expect(dispatch.mock.calls[5][0]).toEqual({
      type: "holdings.accountPurchases.list/clear",
    });
  });
  it("renders nothing for empty endpoint", () => {
    mockSelector({});
    useParams.mockReturnValue({ id: "account-id" });
    const component = shallow(<AccountWrapper {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Outlet)).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      emptyEndpoint,
    );
  });
  it("renders nothing for unsuccessful endpoint", () => {
    const endpoint = {
      isFilled: true,
      success: false,
    };
    mockSelector({ endpoint });
    useParams.mockReturnValue({ id: "account-id" });
    const component = shallow(<AccountWrapper {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Outlet)).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(endpoint);
  });
  it("renders account for success endpoint", () => {
    const endpoint = {
      isFilled: true,
      success: true,
      data: {
        name: "Account Name",
      },
    };
    mockSelector({ endpoint });
    useParams.mockReturnValue({ id: "account-id" });
    const component = shallow(<AccountWrapper {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Outlet)).toHaveLength(1);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(endpoint);
  });
});
