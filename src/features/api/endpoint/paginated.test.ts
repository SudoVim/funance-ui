import { createPaginatedEndpointSlice } from "./paginated";
import { emptyEndpoint, loadingEndpoint } from "./endpoint";

describe("test createPaginatedEndpointSlice function", () => {
  const testSlice = createPaginatedEndpointSlice({ name: "test-slice" });
  const filledEndpoint = {
    isEmpty: false,
    isLoading: false,
    isFilled: true,
    next: "next-page",
    previous: "previous-page",
    count: 20,
    pages: {
      "2": {
        isEmpty: false,
        isLoading: false,
        isFilled: true,
        data: {},
      },
    },
  };
  describe("test fetchFirst", () => {
    it("fetches the first page from empty", () => {
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.fetchFirst(undefined)
      );
      expect(state).toEqual(loadingEndpoint);
    });
    it("fetches the first page from filled", () => {
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.fetchFirst(undefined)
      );
      expect(state).toEqual(loadingEndpoint);
    });
  });
  describe("test fetchPage", () => {
    it("fetches the first page from empty", () => {
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.fetchPage({ page: 5 })
      );
      expect(state).toEqual(loadingEndpoint);
    });
    it("fetches the first page from filled, no page", () => {
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.fetchPage({})
      );
      expect(state).toEqual({
        ...filledEndpoint,
        pages: {
          ...filledEndpoint.pages,
          "1": loadingEndpoint,
        },
      });
    });
    it("fetches the first page from filled", () => {
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.fetchPage({ page: 5 })
      );
      expect(state).toEqual({
        ...filledEndpoint,
        pages: {
          ...filledEndpoint.pages,
          "5": loadingEndpoint,
        },
      });
    });
  });
  describe("test finishPage", () => {
    it("finishes without page number", () => {
      const request = {};
      const response = {
        success: true,
        data: {
          next: "page-2",
          previous: "page-0",
          count: 27,
          results: [],
        },
      };
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.finishPage({
          request,
          response,
        })
      );
      expect(state).toEqual({
        isEmpty: false,
        isFilled: true,
        isLoading: false,
        count: 27,
        next: "page-2",
        previous: "page-0",
        pages: {
          "1": {
            isEmpty: false,
            isFilled: true,
            isLoading: false,
            success: true,
            data: response.data,
          },
        },
      });
    });
    it("finishes with page number", () => {
      const request = { page: 23 };
      const response = {
        success: true,
        data: {
          next: "page-2",
          previous: "page-0",
          count: 27,
          results: [],
        },
      };
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.finishPage({
          request,
          response,
        })
      );
      expect(state).toEqual({
        isEmpty: false,
        isFilled: true,
        isLoading: false,
        count: 27,
        next: "page-2",
        previous: "page-0",
        pages: {
          "23": {
            isEmpty: false,
            isFilled: true,
            isLoading: false,
            success: true,
            data: response.data,
          },
        },
      });
    });
  });
});
