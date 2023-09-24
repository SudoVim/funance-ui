import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { shallow } from "enzyme";
import { useNavigate } from "react-router";
import { TextField, OutlinedInput } from "@mui/material";
import { Submit } from "components/utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { CreatePurchase } from "./create-purchase";

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

vi.mock("react-router", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useNavigate: vi.fn(),
  };
});

vi.mock("dayjs", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    default: vi.fn(),
  };
});

function mockSelector({ account, endpoint }) {
  let iteration = -1;
  useSelector.mockImplementation(() => {
    iteration = (iteration + 1) % 2;
    switch (iteration) {
      case 0:
        return account;
      case 1:
        return endpoint;
    }
  });
}

describe("CreatePurchase tests", () => {
  let props = null;
  let dispatch = null;
  let navigate = null;
  let dayjsToISOString = null;
  let dateObj = null;
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
    dayjsToISOString = vi.fn();
    dayjs.mockReset();
    dateObj = {
      toISOString: dayjsToISOString,
    };
    dayjs.mockReturnValue(dateObj);
  });
  it("throws exception if there is no current account set", () => {
    mockSelector({});
    expect(() => {
      shallow(<CreatePurchase {...props} />);
    }).toThrow(
      "CreatePurchase can only be used with a current account configured",
    );
  });
  it("throws exception if there is no current account createPurchase endpoint set", () => {
    const account = {};
    mockSelector({ account });
    expect(() => {
      shallow(<CreatePurchase {...props} />);
    }).toThrow(
      "CreatePurchase can only be used with a current account configured",
    );
  });
  it("clears API on unmount", () => {
    const account = { id: "account-id" };
    const endpoint = {};
    mockSelector({ account, endpoint });
    const component = shallow(<CreatePurchase {...props} />);

    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    expect(dispatch).toHaveBeenCalledTimes(0);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.createPurchase/clear",
      payload: {
        account: "account-id",
      },
    });
  });
  it("does not navigate away if the API has not completed", () => {
    const account = { id: "account%id" };
    const endpoint = { isFilled: false };
    mockSelector({ account, endpoint });
    const component = shallow(<CreatePurchase {...props} />);

    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(0);
  });
  it("does not navigate away if the API was not successful", () => {
    const account = { id: "account%id" };
    const endpoint = { isFilled: true, succes: false };
    mockSelector({ account, endpoint });
    const component = shallow(<CreatePurchase {...props} />);

    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(0);
  });
  it("navigates away when API completes successfully", () => {
    const account = { id: "account%id" };
    const endpoint = { isFilled: true, success: true };
    mockSelector({ account, endpoint });
    const component = shallow(<CreatePurchase {...props} />);

    const cleanup = useEffect.mock.calls[1][0]();
    expect(cleanup).toEqual(undefined);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith("/app/accounts/account%25id");
  });
  it("walks through form submission", () => {
    const account = { id: "account%id" };
    const endpoint = { isFilled: false, isLoading: false };
    mockSelector({ account, endpoint });
    dayjsToISOString.mockReturnValue("2023-08-19");
    const component = shallow(<CreatePurchase {...props} />);

    expect(component.find(Submit).props().disabled).toEqual(true);

    component
      .find(TextField)
      .props()
      .onChange({ target: { value: "AAPL" } });
    component
      .find(OutlinedInput)
      .at(0)
      .props()
      .onChange({ target: { value: "13" } });
    component
      .find(OutlinedInput)
      .at(1)
      .props()
      .onChange({ target: { value: "123.45" } });
    expect(component.find(DatePicker).props().value).toEqual(dateObj);

    const newToString = vi.fn();
    newToString.mockReturnValue("2023-08-18");
    component.find(DatePicker).props().onChange({ toISOString: newToString });

    expect(component.find(Submit).props().disabled).toEqual(false);

    const preventDefault = vi.fn();
    component.find("form").props().onSubmit({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenLastCalledWith();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "holdings.accounts.createPurchase/request",
      payload: {
        account: "account%id",
        price: 123.45,
        purchasedAt: "2023-08-18",
        quantity: 13,
        ticker: "AAPL",
      },
    });
  });
  it("cannot submit form if endpoint is loading", () => {
    const account = { id: "account%id" };
    const endpoint = { isFilled: false, isLoading: true };
    mockSelector({ account, endpoint });
    dayjsToISOString.mockReturnValue("2023-08-19");
    const component = shallow(<CreatePurchase {...props} />);

    expect(component.find(Submit).props().disabled).toEqual(true);

    component
      .find(TextField)
      .props()
      .onChange({ target: { value: "AAPL" } });
    component
      .find(OutlinedInput)
      .at(0)
      .props()
      .onChange({ target: { value: "13" } });
    component
      .find(OutlinedInput)
      .at(1)
      .props()
      .onChange({ target: { value: "123.45" } });
    expect(component.find(DatePicker).props().value).toEqual(dateObj);

    const toISOString = vi.fn();
    toISOString.mockReturnValue("2023-08-18");
    component.find(DatePicker).props().onChange({ toISOString });

    expect(component.find(Submit).props().disabled).toEqual(true);
  });
});
