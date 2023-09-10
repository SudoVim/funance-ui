import { describe, it, expect } from "vitest";
import { slices } from "./slices";

describe("test slices.current", () => {
  it("sets current fund from undefined", () => {
    const state = {};
    const currentFund = { id: "fund-id" };
    const cmpState = slices.current.reducer(
      state,
      slices.current.actions.setCurrentFund(currentFund),
    );
    expect(cmpState).toEqual({ currentFund });
  });
  it("unsets current fund from undefined", () => {
    const state = {};
    const currentFund = undefined;
    const cmpState = slices.current.reducer(
      state,
      slices.current.actions.setCurrentFund(currentFund),
    );
    expect(cmpState).toEqual({ currentFund });
  });
  it("unsets current fund from defined", () => {
    const state = { currentFund: { id: "fund-id" } };
    const currentFund = undefined;
    const cmpState = slices.current.reducer(
      state,
      slices.current.actions.setCurrentFund(currentFund),
    );
    expect(cmpState).toEqual({ currentFund });
  });
  it("sets current fund from defined", () => {
    const state = { currentFund: { id: "fund-id" } };
    const currentFund = { id: "fund-id-2" };
    const cmpState = slices.current.reducer(
      state,
      slices.current.actions.setCurrentFund(currentFund),
    );
    expect(cmpState).toEqual({ currentFund });
  });
});
