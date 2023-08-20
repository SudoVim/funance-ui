import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint } from "features/api/endpoint";
import { useNavigate } from "react-router";
import { endpoints } from "features";

import { Create } from "./create";

vi.mock("react-redux", async (importOriginal) => {
  const reactRedux = await importOriginal();

  return {
    ...reactRedux,
    useSelector: vi.fn(),
  };
});

vi.mock("react-router", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useNavigate: vi.fn(),
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

describe("Create tests", () => {
  let props = null;
  let navigate = null;
  beforeEach(() => {
    props = {};
    useSelector.mockReset();
    navigate = vi.fn();
    useNavigate.mockReset();
    useNavigate.mockReturnValue(navigate);
  });
  it("renders the component and walks through form updates", () => {
    const endpoint = emptyEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<Create {...props} />);
    expect(component.find("EndpointForm")).toHaveLength(1);
    expect(component.find("EndpointForm").props().endpoint).toEqual(endpoint);
    expect(component.find("EndpointForm").props().submitDisabled).toEqual(true);
    expect(component.find("EndpointForm").props().slice).toEqual(
      endpoints.funds.create,
    );
    let request = component.find("EndpointForm").props().request;
    expect(request).toEqual({
      name: "",
      shares: 1000,
      callback: request.callback,
    });
    expect(component.find("AdornedField").props().value).toEqual("1000");

    component.find("SimpleField").props().onChange("Fund Name");
    component.find("AdornedField").props().onChange("2000");

    request = component.find("EndpointForm").props().request;
    expect(request).toEqual({
      name: "Fund Name",
      shares: 2000,
      callback: request.callback,
    });
    expect(component.find("AdornedField").props().value).toEqual("2000");
    expect(component.find("EndpointForm").props().submitDisabled).toEqual(
      false,
    );
  });
  it("uses invalid shares", () => {
    const endpoint = emptyEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<Create {...props} />);
    component.find("AdornedField").props().onChange("invalid");

    const request = component.find("EndpointForm").props().request;
    expect(request).toEqual({
      name: "",
      shares: NaN,
      callback: request.callback,
    });
    expect(component.find("AdornedField").props().value).toEqual("invalid");
    expect(component.find("EndpointForm").props().submitDisabled).toEqual(true);
  });
  it("calls the callback with unsuccessful response", () => {
    const endpoint = emptyEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<Create {...props} />);
    const request = component.find("EndpointForm").props().request;
    const { callback } = request;
    callback({ success: false });
    expect(navigate).toHaveBeenCalledTimes(0);
  });
  it("calls the callback with successful response", () => {
    const endpoint = emptyEndpoint;
    mockSelector({ endpoint });
    const component = shallow(<Create {...props} />);
    const request = component.find("EndpointForm").props().request;
    const { callback } = request;
    callback({
      success: true,
      data: {
        id: "fund%id",
      },
    });
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/app/funds/fund%25id");
  });
});
