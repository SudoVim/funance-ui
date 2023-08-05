import React, { useEffect } from "react";
import { vi, describe, expect, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { selectors } from "features";

import { Account } from "./account";

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

describe("Account tests", () => {
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
      shallow(<Account {...props} />);
    }).toThrowError("Account component requires an 'id' parameter");
  });
  it("selects the endpoint", () => {
    mockSelector({});
    useParams.mockReturnValue({ id: "account-id" });
    shallow(<Account {...props} />);

    useSelector.mock.calls[0][0]({});
    expect(selectors.holdings.accounts.get).toHaveBeenCalledTimes(1);
    expect(selectors.holdings.accounts.get).toHaveBeenLastCalledWith(
      {},
      { id: "account-id" },
    );
  });
  it("fetches the entry on mount and cleans up on unmount", () => {
    mockSelector({});
    useParams.mockReturnValue({ id: "account-id" });
    shallow(<Account {...props} />);

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.get/request",
      payload: {
        id: "account-id",
      },
    });

    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.get/clear",
      payload: {
        id: "account-id",
      },
    });
  });
  it("renders nothing for empty endpoint", () => {
    mockSelector({});
    useParams.mockReturnValue({ id: "account-id" });
    const component = shallow(<Account {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box)).toHaveLength(0);
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
    const component = shallow(<Account {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box)).toHaveLength(0);
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
    const component = shallow(<Account {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find(Box)).toHaveLength(1);
    expect(component.find(Box).text()).toEqual("Account Name");
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(endpoint);
  });
});
