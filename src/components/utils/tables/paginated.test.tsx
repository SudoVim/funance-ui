import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { shallow } from "enzyme";
import {
  createPaginatedEndpointSlice,
  PaginatedEndpointRequest,
  PaginatedEndpoint,
  emptyEndpoint,
} from "features/api/endpoint";

import { PaginatedTable } from "./paginated";

describe("PaginatedTable tests", () => {
  let props = null;
  const slice = createPaginatedEndpointSlice<PaginatedEndpointRequest, string>({
    name: "my-slice",
  });
  const endpoint = emptyEndpoint;
  const headers = [{ key: "a", name: "Column A" }];
  const getRow = (result: string) => {
    expect(result).toEqual("Result A");
    return {
      key: "1",
      cells: {},
    };
  };
  beforeEach(() => {
    props = {
      slice,
      endpoint,
      headers,
      getRow,
    };
  });
  it("renders the component with empty results", () => {
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).toEqual("");
  });
  it("does not renders the table without a filled page", () => {
    const endpointPage = {
      isEmpty: false,
      isLoading: true,
      isFilled: false,
    };
    props.endpoint = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      pages: {
        "1": endpointPage,
      },
    };
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Table")).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      endpointPage,
    );
  });
  it("does not render the table on unsuccessful query", () => {
    const endpointPage = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      success: false,
    };
    props.endpoint = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      pages: {
        "1": endpointPage,
      },
    };
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Table")).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      endpointPage,
    );
  });
  it("renders the table without a page specified", () => {
    const endpointPage = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      success: true,
      data: {
        results: ["Result A"],
      },
    };
    props.endpoint = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      pages: {
        "1": endpointPage,
      },
    };
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Table")).toHaveLength(1);
    expect(component.find("Table").props().results).toEqual(["Result A"]);
    expect(component.find("Table").props().headers).toEqual(headers);
    expect(component.find("Table").props().getRow).toEqual(getRow);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      endpointPage,
    );
  });
  it("does not render the table with the wrong page specified", () => {
    const endpointPage = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      success: true,
      data: {
        results: ["Result A"],
      },
    };
    props.endpoint = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      pages: {
        "1": endpointPage,
      },
    };
    props.page = 2;
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Table")).toHaveLength(0);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      emptyEndpoint,
    );
  });
  it("renders the table with a page specified", () => {
    const endpointPage = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      success: true,
      data: {
        results: ["Result A"],
      },
    };
    props.endpoint = {
      isEmpty: false,
      isLoading: false,
      isFilled: true,
      pages: {
        "2": endpointPage,
      },
    };
    props.page = 2;
    const component = shallow(<PaginatedTable {...props} />);
    expect(component.text()).not.toEqual("");
    expect(component.find("Table")).toHaveLength(1);
    expect(component.find("Table").props().results).toEqual(["Result A"]);
    expect(component.find("Table").props().headers).toEqual(headers);
    expect(component.find("Table").props().getRow).toEqual(getRow);
    expect(component.find("EndpointAlert")).toHaveLength(1);
    expect(component.find("EndpointAlert").props().endpoint).toEqual(
      endpointPage,
    );
  });
});
