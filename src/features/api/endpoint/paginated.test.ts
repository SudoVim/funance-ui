import { vi, it, describe, expect } from "vitest";
import { createPaginatedEndpointSlice } from "./paginated";
import { emptyEndpoint, loadingEndpoint } from "./endpoint";
import { testSaga } from "redux-saga-test-plan";

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
  describe("test clear from empty", () => {
    it("clears all pages from empty", () => {
      const state = testSlice.reducer(emptyEndpoint, testSlice.actions.clear());
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears all pages from loading", () => {
      const state = testSlice.reducer(
        loadingEndpoint,
        testSlice.actions.clear(),
      );
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears all pages from filled", () => {
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.clear(),
      );
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears single page from empty", () => {
      const request = { page: 2 };
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.clear(request),
      );
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears single page from loading", () => {
      const request = { page: 2 };
      const state = testSlice.reducer(
        loadingEndpoint,
        testSlice.actions.clear(request),
      );
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears single page from filled", () => {
      const request = { page: 2 };
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.clear(request),
      );
      expect(state).toEqual({
        ...filledEndpoint,
        pages: {
          "2": emptyEndpoint,
        },
      });
    });
    it("clears other single page from filled", () => {
      const request = { page: 1 };
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.clear(request),
      );
      expect(state).toEqual({
        ...filledEndpoint,
        pages: {
          ...filledEndpoint.pages,
          "1": emptyEndpoint,
        },
      });
    });
  });
  describe("test fetchPage", () => {
    it("fetches the first page from empty", () => {
      const state = testSlice.reducer(
        emptyEndpoint,
        testSlice.actions.fetchPage({ page: 5 }),
      );
      expect(state).toEqual(loadingEndpoint);
    });
    it("fetches the first page from filled, no page", () => {
      const state = testSlice.reducer(
        filledEndpoint,
        testSlice.actions.fetchPage({}),
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
        testSlice.actions.fetchPage({ page: 5 }),
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
        }),
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
        }),
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
  describe("test handleResponse", () => {
    it("runs handleResponse", () => {
      const request = {};
      const response = {
        success: true,
        data: { next: "next-url" },
      };
      const saga = testSlice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finishPage",
          payload: { request, response },
        })
        .next()
        .isDone();
    });
    it("runs handleResponse fetches next page", () => {
      const request = {
        fetchAll: true,
      };
      const response = {
        success: true,
        data: { next: "next-url" },
      };
      const saga = testSlice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finishPage",
          payload: { request, response },
        })
        .next()
        .put({
          type: "test-slice/fetchPage",
          payload: { ...request, url: "next-url" },
        })
        .next()
        .isDone();
    });
    it("runs handleResponse with a callback", () => {
      const request = {
        callback: vi.fn(),
      };
      const response = {};
      const saga = testSlice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finishPage",
          payload: { request, response },
        })
        .next()
        .call(request.callback, response)
        .next()
        .isDone();
    });
  });
  describe("test getPage", () => {
    it("empty pages", () => {
      const state = emptyEndpoint;
      const request = {};
      const page = testSlice.getPage(state, request);
      expect(page).toEqual(emptyEndpoint);
    });
    it("loading pages", () => {
      const state = loadingEndpoint;
      const request = {};
      const page = testSlice.getPage(state, request);
      expect(page).toEqual(emptyEndpoint);
    });
    it("page not found", () => {
      const state = filledEndpoint;
      const request = {};
      const page = testSlice.getPage(state, request);
      expect(page).toEqual(emptyEndpoint);
    });
    it("page found", () => {
      const state = filledEndpoint;
      const request = { page: 2 };
      const page = testSlice.getPage(state, request);
      expect(page).toEqual({
        data: {},
        isEmpty: false,
        isFilled: true,
        isLoading: false,
      });
    });
  });
});
