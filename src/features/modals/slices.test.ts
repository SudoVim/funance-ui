import { describe, it, expect } from "vitest";
import { createModalSlice } from "./slices";

describe("tests createModalSlice", () => {
  const slice = createModalSlice<string>({ name: "model-slice" });
  const initialState = { isOpen: false };
  describe("tests closeModal", () => {
    it("closes from closed", () => {
      const state = initialState;
      const cmpState = slice.reducer(state, slice.actions.closeModal());
      expect(cmpState).toEqual(initialState);
    });
    it("closes from open", () => {
      const state = {
        isOpen: true,
        data: "some-data",
      };
      const cmpState = slice.reducer(state, slice.actions.closeModal());
      expect(cmpState).toEqual(initialState);
    });
  });
  describe("tests openModal", () => {
    it("opens from closed", () => {
      const state = initialState;
      const cmpState = slice.reducer(
        state,
        slice.actions.openModal("some-data"),
      );
      expect(cmpState).toEqual({
        isOpen: true,
        data: "some-data",
      });
    });
    it("opens from open", () => {
      const state = {
        isOpen: true,
        data: "some-data",
      };
      const cmpState = slice.reducer(
        state,
        slice.actions.openModal("some-other-data"),
      );
      expect(cmpState).toEqual({
        isOpen: true,
        data: "some-other-data",
      });
    });
  });
});
