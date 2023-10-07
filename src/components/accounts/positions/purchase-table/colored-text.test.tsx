import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { shallow } from "enzyme";
import { useTheme } from "@mui/material";

import { ColoredText } from "./colored-text";

vi.mock("@mui/material", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    useTheme: vi.fn(),
  };
});

describe("ColoredText tests", () => {
  beforeEach(() => {
    useTheme.mockReset();
    useTheme.mockReturnValue({
      palette: {
        primary: { main: "palette-primary-main" },
        secondary: { main: "palette-secondary-main" },
      },
    });
  });
  it("renders a buy component", () => {
    const component = shallow(<ColoredText purchaseType="BUY" text="text" />);
    expect(component.text()).toEqual("text");
    expect(component.props().color).toEqual("palette-primary-main");
  });
  it("renders a sell component", () => {
    const component = shallow(<ColoredText purchaseType="SELL" text="text" />);
    expect(component.text()).toEqual("text");
    expect(component.props().color).toEqual("palette-secondary-main");
  });
});
