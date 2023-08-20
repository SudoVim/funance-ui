import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { endpoints } from "features";

import { List } from "./list";

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

function mockSelector({ endpoint }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return endpoint;
    }
  });
}

describe("List tests", () => {
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
  it("clears funds on umount", () => {
    mockSelector({});
    const component = shallow(<List {...props} />);
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "funds.list/clear",
      payload: undefined,
    });
  });
  it("fetches pages properly", () => {
    mockSelector({});
    const component = shallow(<List {...props} />);
    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "funds.list/fetchPage",
      payload: {
        page: undefined,
      },
    });
  });
  it("fetches subsequent pages properly", () => {
    mockSelector({});
    props.page = 5;
    const component = shallow(<List {...props} />);
    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "funds.list/fetchPage",
      payload: {
        page: 5,
      },
    });
  });
  it("renders the paginated table", () => {
    const endpoint = {};
    mockSelector({ endpoint });
    const component = shallow(<List {...props} />);
    expect(component.find("PaginatedTable")).toHaveLength(1);
    expect(component.find("PaginatedTable").props().page).toEqual(undefined);
    expect(component.find("PaginatedTable").props().slice).toEqual(
      endpoints.funds.list,
    );
    expect(component.find("PaginatedTable").props().endpoint).toEqual(endpoint);
  });
});
