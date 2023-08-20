import React, { useEffect } from "react";
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { useDispatch } from "react-redux";
import { shallow } from "enzyme";
import { emptyEndpoint, createEndpointSlice, loadingEndpoint } from 'features/api/endpoint';
import { Box } from "@mui/material";

import { EndpointForm } from "./endpoint";

vi.mock("react", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useEffect: vi.fn(),
  };
});

vi.mock("react-redux", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useDispatch: vi.fn(),
  };
});

describe('EndpointForm tests', () => {
  let props = null;
  let dispatch = null;
  const slice = createEndpointSlice({
    name: "endpoint-name",
  });
  beforeEach(() => {
    props = {
      endpoint: emptyEndpoint,
      slice,
      request: { request: 'body' },
    };
    dispatch = vi.fn();
    useEffect.mockReset();
    useDispatch.mockReset();
    useDispatch.mockReturnValue(dispatch);
  });
  it('clears the endpoint on unmount', () => {
    const component = shallow(<EndpointForm {...props} />);
    const cleanup = useEffect.mock.calls[0][0]();
    expect(cleanup).not.toEqual(undefined);
    cleanup();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'endpoint-name/clear',
      payload: undefined,
    });
  });
  it('disables submit when requested', () => {
    props.submitDisabled = true;
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('Submit').props().disabled).toEqual(true);
  });
  it('disables submit when endpoint loading', () => {
    props.endpoint = loadingEndpoint;
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('Submit').props().disabled).toEqual(true);
  });
  it('uses the default submit text', () => {
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('Submit').props().text).toEqual("Submit");
  });
  it('overrides submit text', () => {
    props.submitText = "Custom submit text";
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('Submit').props().text).toEqual("Custom submit text");
  });
  it('only renders submit if no children are given', () => {
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('FormGrid').children()).toHaveLength(1);
    expect(component.find('FormGrid').childAt(0).key()).toEqual("submit");
    expect(component.find('FormGrid').childAt(0).name()).toEqual("Submit");
  });
  it('renders submit and the one child if given', () => {
    const component = shallow(
      <EndpointForm {...props}>
        <Box key="child">Child</Box>
      </EndpointForm>
    );
    expect(component.find('FormGrid').children()).toHaveLength(2);
    expect(component.find('FormGrid').childAt(0).key()).toEqual("child");
    expect(component.find('FormGrid').childAt(0).text()).toEqual("Child");
    expect(component.find('FormGrid').childAt(1).key()).toEqual("submit");
    expect(component.find('FormGrid').childAt(1).name()).toEqual("Submit");
  });
  it('renders submit and an array of children', () => {
    const component = shallow(
      <EndpointForm {...props}>
        <Box key="child1">Child 1</Box>
        <Box key="child2">Child 2</Box>
      </EndpointForm>
    );
    expect(component.find('FormGrid').children()).toHaveLength(3);
    expect(component.find('FormGrid').childAt(0).key()).toEqual("child1");
    expect(component.find('FormGrid').childAt(0).text()).toEqual("Child 1");
    expect(component.find('FormGrid').childAt(1).key()).toEqual("child2");
    expect(component.find('FormGrid').childAt(1).text()).toEqual("Child 2");
    expect(component.find('FormGrid').childAt(2).key()).toEqual("submit");
    expect(component.find('FormGrid').childAt(2).name()).toEqual("Submit");
  });
  it('dispatches request on submit', () => {
    props.submitText = "Custom submit text";
    const component = shallow(<EndpointForm {...props} />);
    const preventDefault = vi.fn();
    component.find('form').props().onSubmit({ preventDefault });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "endpoint-name/request",
      payload: props.request,
    });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenLastCalledWith();
  });
  it('renders endpoint alert with default props', () => {
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('EndpointAlert').props().endpoint).toEqual(props.endpoint);
    expect(component.find('EndpointAlert').props().successMessage).toEqual(undefined);
  });
  it('renders endpoint alert with alt props', () => {
    props.successMessage = "My success message";
    const component = shallow(<EndpointForm {...props} />);
    expect(component.find('EndpointAlert').props().endpoint).toEqual(props.endpoint);
    expect(component.find('EndpointAlert').props().successMessage).toEqual("My success message");
  });
});
