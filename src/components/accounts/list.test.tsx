import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";

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

function mockSelector({ accountsPage }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return accountsPage ?? emptyEndpoint;
    }
  });
}

describe("List tests", () => {
  let dispatch = null;
  beforeEach(() => {
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReset();
  });
  it("clears the endpoint on unload", () => {
    mockSelector({});
    const component = shallow(<List />);
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.list/clear",
      payload: undefined,
    });
  });
  it("fetches the page when request updates", () => {
    mockSelector({});
    const component = shallow(<List />);
    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.list/fetchPage",
      payload: { page: undefined },
    });
  });
  it("renders the table and ensures proper functionality", () => {
    mockSelector({});
    const component = shallow(<List />);
    const table = component.find("PaginatedTable");
    expect(table).toHaveLength(1);
    expect(table.props().page).toEqual(undefined);
    expect(table.props().endpoint).toEqual(emptyEndpoint);
    expect(table.props().headers).toEqual([
      {
        key: "name",
        name: "Name",
      },
    ]);
    expect(
      table.props().getRow({
        id: "result-id",
        name: "result-name",
      }),
    ).toEqual({
      key: "result-id",
      cells: {
        name: "result-name",
      },
    });
  });
});
