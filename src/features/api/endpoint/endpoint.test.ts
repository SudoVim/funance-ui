import { vi, it, describe, expect } from "vitest";
import {
  emptyEndpoint,
  loadingEndpoint,
  createEndpointSlice,
  createIndirectEndpointSlice,
} from "./endpoint";
import { testSaga } from "redux-saga-test-plan";

const filledEndpoint = {
  isEmpty: false,
  isLoading: false,
  isFilled: true,
  success: true,
  data: undefined,
};

describe("test createEndpointSlice", () => {
  const slice = createEndpointSlice({ name: "test-slice" });
  describe("test clear action", () => {
    it("clears the state from empty", () => {
      const state = slice.reducer(
        emptyEndpoint,
        slice.actions.clear(undefined),
      );
      expect(state).toEqual(emptyEndpoint);
    });
    it("clears the state from filled", () => {
      const state = slice.reducer(
        filledEndpoint,
        slice.actions.clear(undefined),
      );
      expect(state).toEqual(emptyEndpoint);
    });
  });
  describe("test request action", () => {
    it("requests the endpoint from empty", () => {
      const state = slice.reducer(
        emptyEndpoint,
        slice.actions.request(undefined),
      );
      expect(state).toEqual(loadingEndpoint);
    });
    it("requests the endpoint from filled", () => {
      const state = slice.reducer(
        filledEndpoint,
        slice.actions.request(undefined),
      );
      expect(state).toEqual(loadingEndpoint);
    });
  });
  describe("test finish action", () => {
    it("finishes the endpoint unsuccessfully", () => {
      const state = slice.reducer(
        loadingEndpoint,
        slice.actions.finish({
          response: {
            success: false,
            data: "response-data",
          },
        }),
      );
      expect(state).toEqual({
        errorData: "response-data",
        isEmpty: false,
        isFilled: true,
        isLoading: false,
        success: false,
      });
    });
    it("finishes the endpoint successfully", () => {
      const state = slice.reducer(
        loadingEndpoint,
        slice.actions.finish({
          response: {
            success: true,
            data: "response-data",
          },
        }),
      );
      expect(state).toEqual({
        data: "response-data",
        isEmpty: false,
        isFilled: true,
        isLoading: false,
        success: true,
      });
    });
  });
  describe("test handleResponse", () => {
    it("finishes without callback", () => {
      const request = {};
      const response = {};
      const saga = slice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finish",
          payload: { request, response },
        })
        .next()
        .isDone();
    });
    it("finishes with callback", () => {
      const request = { callback: vi.fn() };
      const response = {};
      const saga = slice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finish",
          payload: { request, response },
        })
        .next()
        .call(request.callback, response)
        .next()
        .isDone();
    });
  });
});

type IndirectRequest = {
  key: string;
};

const getKeyFromRequest = ({ key }: IndirectRequest) => key;

describe("test createIndirectEndpointSlice", () => {
  const slice = createIndirectEndpointSlice<IndirectRequest>({
    name: "test-slice",
    getKeyFromRequest,
  });
  describe("test clear action", () => {
    it("clears the state from empty", () => {
      const state = slice.reducer({}, slice.actions.clear());
      expect(state).toEqual({});
    });
    it("clears the state from filled", () => {
      const state = slice.reducer(
        { "my-key": filledEndpoint },
        slice.actions.clear(),
      );
      expect(state).toEqual({});
    });
    it("clears the state of a single entry", () => {
      const state = slice.reducer(
        {
          "my-first-key": filledEndpoint,
          "my-second-key": filledEndpoint,
        },
        slice.actions.clear({ key: "my-first-key" }),
      );
      expect(state).toEqual({
        "my-first-key": emptyEndpoint,
        "my-second-key": filledEndpoint,
      });
    });
  });
  describe("test request action", () => {
    it("request the endpoint from empty", () => {
      const state = slice.reducer(
        {
          "my-first-key": filledEndpoint,
        },
        slice.actions.request({ key: "my-second-key" }),
      );
      expect(state).toEqual({
        "my-first-key": filledEndpoint,
        "my-second-key": loadingEndpoint,
      });
    });
    it("request the endpoint from filled", () => {
      const state = slice.reducer(
        {
          "my-first-key": filledEndpoint,
          "my-second-key": filledEndpoint,
        },
        slice.actions.request({ key: "my-second-key" }),
      );
      expect(state).toEqual({
        "my-first-key": filledEndpoint,
        "my-second-key": loadingEndpoint,
      });
    });
  });
  describe("test finish action", () => {
    it("finish the endpoint from empty", () => {
      const state = slice.reducer(
        {
          "my-first-key": filledEndpoint,
        },
        slice.actions.finish({
          request: { key: "my-second-key" },
          response: {
            success: false,
            data: "response-data",
          },
        }),
      );
      expect(state).toEqual({
        "my-first-key": filledEndpoint,
        "my-second-key": {
          errorData: "response-data",
          isEmpty: false,
          isFilled: true,
          isLoading: false,
          success: false,
        },
      });
    });
    it("finish the endpoint from loading", () => {
      const state = slice.reducer(
        {
          "my-first-key": filledEndpoint,
          "my-second-key": loadingEndpoint,
        },
        slice.actions.finish({
          request: { key: "my-second-key" },
          response: {
            success: true,
            data: "response-data",
          },
        }),
      );
      expect(state).toEqual({
        "my-first-key": filledEndpoint,
        "my-second-key": {
          data: "response-data",
          isEmpty: false,
          isFilled: true,
          isLoading: false,
          success: true,
        },
      });
    });
  });
  describe("test handleResponse", () => {
    it("finishes without callback", () => {
      const request = {};
      const response = {};
      const saga = slice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finish",
          payload: { request, response },
        })
        .next()
        .isDone();
    });
    it("finishes with callback", () => {
      const request = { callback: vi.fn() };
      const response = {};
      const saga = slice.handleResponse;
      testSaga(saga, { request, response })
        .next()
        .put({
          type: "test-slice/finish",
          payload: { request, response },
        })
        .next()
        .call(request.callback, response)
        .next()
        .isDone();
    });
  });
  describe("test getEndpoint", () => {
    it("gets empty endpoint from empty", () => {
      const state = {};
      const request = { key: "key" };
      expect(slice.getEndpoint(state, request)).toEqual(emptyEndpoint);
    });
    it("gets endpoint", () => {
      const state = {
        key: { filled: "endpoint" },
      };
      const request = { key: "key" };
      expect(slice.getEndpoint(state, request)).toEqual({ filled: "endpoint" });
    });
  });
});
