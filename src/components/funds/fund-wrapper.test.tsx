import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useParams } from "react-router-dom";
import { emptyEndpoint } from "features/api/endpoint";
import { Outlet } from "react-router-dom";

import { FundWrapper } from "./fund-wrapper";

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

vi.mock("react-router-dom", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useParams: vi.fn(),
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

describe("FundWrapper tests", () => {
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
  });
  it("renders the component with empty results", () => {
    const params = {};
    mockSelector({});
    useParams.mockReturnValue(params);
    expect(() => {
      shallow(<FundWrapper {...props} />);
    }).toThrow("FundWrapper component requires an 'id' parameter");
  });
  it("fetches the endpoint on mount and clears on unmount", () => {
    const params = { id: "fund-id" };
    mockSelector({});
    useParams.mockReturnValue(params);
    shallow(<FundWrapper {...props} />);

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([
      {
        type: "funds.get/request",
        payload: {
          id: "fund-id",
        },
      },
    ]);
    expect(dispatch.mock.calls[1]).toEqual([
      {
        type: "funds.current/setCurrentFund",
        payload: {
          id: "fund-id",
        },
      },
    ]);

    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch.mock.calls[2]).toEqual([
      {
        type: "funds.get/clear",
        payload: {
          id: "fund-id",
        },
      },
    ]);
    expect(dispatch.mock.calls[3]).toEqual([
      {
        type: "funds.current/setCurrentFund",
      },
    ]);
  });
  it("does not render Outlet on empty endpoint", () => {
    const params = { id: "fund-id" };
    mockSelector({});
    useParams.mockReturnValue(params);
    const component = shallow(<FundWrapper {...props} />);
    expect(component.find(Outlet)).toHaveLength(0);
  });
  it("does not render Outlet on failed endpoint", () => {
    const params = { id: "fund-id" };
    const endpoint = {
      isFilled: true,
      success: false,
    };
    mockSelector({ endpoint });
    useParams.mockReturnValue(params);
    const component = shallow(<FundWrapper {...props} />);
    expect(component.find(Outlet)).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(endpoint);
  });
  it("renders Outlet on successful endpoint", () => {
    const params = { id: "fund-id" };
    const endpoint = {
      isFilled: true,
      success: true,
    };
    mockSelector({ endpoint });
    useParams.mockReturnValue(params);
    const component = shallow(<FundWrapper {...props} />);
    expect(component.find(Outlet)).toHaveLength(1);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(endpoint);
  });
});
