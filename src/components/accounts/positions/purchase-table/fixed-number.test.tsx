import React from "react";
import { describe, it, expect } from "vitest";
import { shallow } from "enzyme";
import { Box } from "@mui/material";

import { FixedNumber } from "./fixed-number";

describe("FixedNumber tests", () => {
  it("renders the component with a positive number", () => {
    const component = shallow(<FixedNumber num={27} />);
    expect(component.type()).toEqual(Box);
    expect(component.text()).toEqual("27");
  });
  it("renders the component with a negative number", () => {
    const component = shallow(<FixedNumber num={-27} />);
    expect(component.type()).toEqual(Box);
    expect(component.text()).toEqual("27");
  });
  it("renders the component with a positive number with prefix and fixed", () => {
    const component = shallow(
      <FixedNumber prefix="#" num={27.207} fixed={2} />,
    );
    expect(component.type()).toEqual(Box);
    expect(component.text()).toEqual("#27.21");
  });
  it("renders the component with a negative number with prefix and fixed", () => {
    const component = shallow(
      <FixedNumber prefix="#" num={-27.207} fixed={2} />,
    );
    expect(component.type()).toEqual(Box);
    expect(component.text()).toEqual("#27.21");
  });
});
