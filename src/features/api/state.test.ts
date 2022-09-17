import { apiSlice, selectors, APIState } from "./state";

export const initialState = {
  auth: {},
};

describe("api state tests", () => {
  it("has no auth", () => {
    expect(selectors.hasAuth({ api: initialState })).toBe(false);
  });
  it("sets auth from empty", () => {
    const cmpState = apiSlice.reducer(
      initialState,
      apiSlice.actions.setAuth({
        token: "api-token",
        expiry: "api-token-expiry",
      })
    );
    expect(cmpState).toEqual({
      auth: {
        token: "api-token",
        expiry: "api-token-expiry",
      },
    });
    expect(selectors.hasAuth({ api: cmpState })).toBe(true);
  });
  it("resets auth from auth", () => {
    const state = {
      auth: {
        token: "api-token",
        expiry: "api-token-expiry",
      },
    };
    const cmpState = apiSlice.reducer(
      state,
      apiSlice.actions.setAuth({
        token: "api-token-2",
        expiry: "api-token-expiry-2",
      })
    );
    expect(cmpState).toEqual({
      auth: {
        token: "api-token-2",
        expiry: "api-token-expiry-2",
      },
    });
    expect(selectors.hasAuth({ api: cmpState })).toBe(true);
  });
});
