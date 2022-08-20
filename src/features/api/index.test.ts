import { actions, APIResponse, rawRequest } from "./index";
import { testSaga } from "redux-saga-test-plan";

describe("test actions", () => {
  it("creates a request action", () => {
    const request = {
      url: "https://example.com",
      method: "GET",
      callback: (response: APIResponse) => {},
    };
    expect(actions.rawRequest(request)).toEqual({
      type: "API/REQUEST",
      request,
    });
  });
});

describe("request saga", () => {
  it("returns early on 204", () => {
    const saga = rawRequest;
    const request = {
      url: "https://example.com",
      method: "GET",
      callback: jest.fn(),
    };
    const action = actions.rawRequest(request);
    testSaga(saga, action)
      .next()
      .call(fetch, "https://example.com", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      })
      .next({ status: 204 })
      .isDone();
    expect(request.callback).toHaveBeenCalledTimes(1);
    expect(request.callback).toHaveBeenLastCalledWith({
      request,
      status: 204,
      success: true,
    });
  });
  it("returns json on success", () => {
    const saga = rawRequest;
    const request = {
      url: "https://example.com",
      method: "GET",
      callback: jest.fn(),
    };
    const action = actions.rawRequest(request);
    const data = { key: "val" };
    const json = jest.fn();
    testSaga(saga, action)
      .next()
      .call(fetch, "https://example.com", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      })
      .next({ status: 200, json })
      .call(json)
      .next(data)
      .isDone();
    expect(request.callback).toHaveBeenCalledTimes(1);
    expect(request.callback).toHaveBeenLastCalledWith({
      request,
      status: 200,
      success: true,
      data,
    });
  });
  it("returns json on failure", () => {
    const saga = rawRequest;
    const request = {
      url: "https://example.com",
      method: "GET",
      callback: jest.fn(),
    };
    const action = actions.rawRequest(request);
    const data = { key: "val" };
    const json = jest.fn();
    testSaga(saga, action)
      .next()
      .call(fetch, "https://example.com", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      })
      .next({ status: 409, json })
      .call(json)
      .next(data)
      .isDone();
    expect(request.callback).toHaveBeenCalledTimes(1);
    expect(request.callback).toHaveBeenLastCalledWith({
      request,
      status: 409,
      success: false,
      data,
    });
  });
});
