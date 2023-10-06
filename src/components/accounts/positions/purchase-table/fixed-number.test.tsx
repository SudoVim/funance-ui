import React from "react";
import { describe, it, expect } from "vitest";
import { shallow } from "enzyme";
import { ColoredText } from "./colored-text";

import { FixedNumber } from "./fixed-number";

describe("FixedNumber tests", () => {
  it("renders the component with a positive number", () => {
    const component = shallow(<FixedNumber purchaseType="BUY" num={27} />);
    expect(component.type()).toEqual(ColoredText);
    expect(component.props().purchaseType).toEqual("BUY");
    expect(component.props().text).toEqual("27");
  });
  it("renders the component with a negative number", () => {
    const component = shallow(<FixedNumber purchaseType="SELL" num={-27} />);
    expect(component.type()).toEqual(ColoredText);
    expect(component.props().purchaseType).toEqual("SELL");
    expect(component.props().text).toEqual("27");
  });
  it("renders the component with a positive number with prefix and fixed", () => {
    const component = shallow(
      <FixedNumber purchaseType="BUY" prefix="#" num={27.207} fixed={2} />,
    );
    expect(component.type()).toEqual(ColoredText);
    expect(component.props().purchaseType).toEqual("BUY");
    expect(component.props().text).toEqual("#27.21");
  });
  it("renders the component with a negative number with prefix and fixed", () => {
    const component = shallow(
      <FixedNumber purchaseType="SELL" prefix="#" num={-27.207} fixed={2} />,
    );
    expect(component.type()).toEqual(ColoredText);
    expect(component.props().purchaseType).toEqual("SELL");
    expect(component.props().text).toEqual("#27.21");
  });
});
