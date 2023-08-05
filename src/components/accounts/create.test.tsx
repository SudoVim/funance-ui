import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint, loadingEndpoint } from "features/api/endpoint";
import { TextField } from "@mui/material";
import { Submit } from "components/utils/forms";
import { useNavigate } from "react-router";

import { Create } from "./create";

vi.mock("react", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useEffect: vi.fn(),
  };
});

vi.mock("react-redux", () => {
  return {
    useDispatch: vi.fn(),
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

function mockSelector({ createState }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 1;
    switch (iteration) {
      case 0:
        return createState ?? emptyEndpoint;
    }
  });
}

describe("Create tests", () => {
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
  it("renders the initial component and walks through the form submission", () => {
    mockSelector({});
    const component = shallow(<Create {...props} />);
    expect(component.find(Submit)).toHaveLength(1);
    expect(component.find(Submit).props()).toHaveProperty("disabled", true);

    expect(component.find(TextField)).toHaveLength(1);
    component
      .find(TextField)
      .props()
      .onChange({
        target: { value: "Account Name" },
      });
    expect(component.find(Submit).props()).toHaveProperty("disabled", false);

    const preventDefault = vi.fn();
    component.find("form").props().onSubmit({ preventDefault });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.create/request",
      payload: {
        name: "Account Name",
      },
    });
  });
  it("disables submit button when loading", () => {
    mockSelector({ createState: loadingEndpoint });
    const component = shallow(<Create {...props} />);

    expect(component.find(TextField)).toHaveLength(1);
    component
      .find(TextField)
      .props()
      .onChange({
        target: { value: "Account Name" },
      });

    expect(component.find(Submit)).toHaveLength(1);
    expect(component.find(Submit).props()).toHaveProperty("disabled", true);
  });
  it("disables submit button when filled", () => {
    mockSelector({
      createState: {
        isEmpty: false,
      },
    });
    const component = shallow(<Create {...props} />);

    expect(component.find(TextField)).toHaveLength(1);
    component
      .find(TextField)
      .props()
      .onChange({
        target: { value: "Account Name" },
      });

    expect(component.find(Submit)).toHaveLength(1);
    expect(component.find(Submit).props()).toHaveProperty("disabled", true);
  });
  it("clears create endpoint on cleanup", () => {
    mockSelector({});
    const component = shallow(<Create {...props} />);
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.create/clear",
    });
  });
  it("redirects on completion", () => {
    mockSelector({
      createState: {
        isFilled: true,
        success: true,
        data: {
          id: "account-id",
        },
      },
    });
    const component = shallow(<Create {...props} />);
    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/app/accounts/account-id");
  });
  it("does not redirect when unsuccessful", () => {
    mockSelector({
      createState: {
        isFilled: true,
        success: false,
      },
    });
    const component = shallow(<Create {...props} />);
    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(0);
  });
});
