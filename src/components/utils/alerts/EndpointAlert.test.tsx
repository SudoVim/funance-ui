import React from "react";
import { shallow } from "enzyme";
import { describe, it, expect } from "vitest";

import { EndpointAlert } from "./EndpointAlert";
import { emptyEndpoint, loadingEndpoint } from "features/api/endpoint";
import { Snackbar, Alert } from "@mui/material";

describe("EndpointAlert tests", () => {
  it("renders the component with empty endpoint", () => {
    const component = shallow(<EndpointAlert endpoint={emptyEndpoint} />);
    expect(component.find(Snackbar).props().open).toEqual(false);
  });
  it("renders the component with loading endpoint", () => {
    const component = shallow(<EndpointAlert endpoint={loadingEndpoint} />);
    expect(component.find(Snackbar).props().open).toEqual(false);
  });
  it("renders the component with unsuccessful endpoint with no error", () => {
    const component = shallow(
      <EndpointAlert
        endpoint={{
          isFilled: true,
          success: false,
          errorData: {
            non_field_errors: [],
          },
        }}
      />,
    );
    expect(component.find(Snackbar).props().open).toEqual(true);
    expect(component.find(Alert).props().severity).toEqual("error");
    expect(component.find(Alert).text()).toEqual("An error occurred.");
  });
  it("renders the component with unsuccessful endpoint with error", () => {
    const component = shallow(
      <EndpointAlert
        endpoint={{
          isFilled: true,
          success: false,
          errorData: {
            non_field_errors: ["Error text."],
          },
        }}
      />,
    );
    expect(component.find(Snackbar).props().open).toEqual(true);
    expect(component.find(Alert).props().severity).toEqual("error");
    expect(component.find(Alert).text()).toEqual("Error text.");
  });
  it("does not render successful message when there is not showSuccess", () => {
    const component = shallow(
      <EndpointAlert
        endpoint={{
          isFilled: true,
          success: true,
        }}
      />,
    );
    expect(component.find(Snackbar).props().open).toEqual(false);
  });
  it("renders the component with successful endpoint with no message", () => {
    const component = shallow(
      <EndpointAlert
        endpoint={{
          isFilled: true,
          success: true,
        }}
        showSuccess
      />,
    );
    expect(component.find(Snackbar).props().open).toEqual(true);
    expect(component.find(Alert).props().severity).toEqual("success");
    expect(component.find(Alert).text()).toEqual("Success!");
  });
  it("renders the component with successful endpoint with message", () => {
    const component = shallow(
      <EndpointAlert
        endpoint={{
          isFilled: true,
          success: true,
        }}
        successMessage="Endpoint succeeded!"
      />,
    );
    expect(component.find(Snackbar).props().open).toEqual(true);
    expect(component.find(Alert).props().severity).toEqual("success");
    expect(component.find(Alert).text()).toEqual("Endpoint succeeded!");
  });
});
