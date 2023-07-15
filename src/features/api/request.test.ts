import { describe, it, expect } from "vitest";
import { APIResponse, rawRequest, promiseJson } from "./request";
import { testSaga } from "redux-saga-test-plan";

describe("request saga", () => {
  it("returns json on success", () => {
    const saga = rawRequest;
    const request = {
      path: "/some/api",
      method: "GET",
      body: undefined,
    };
    const data = { key: "val" };
    const response = { status: 200 };
    testSaga(saga, request)
      .next()
      .call(fetch, "http://localhost:8005/api/v1/some/api", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
      .next(response)
      .call(promiseJson, response)
      .next(data)
      .isDone();
  });
  it("returns json on failure", () => {
    const saga = rawRequest;
    const request = {
      path: "/some/api",
      method: "GET",
      body: undefined,
    };
    const data = { key: "val" };
    const response = { status: 409 };
    testSaga(saga, request)
      .next()
      .call(fetch, "http://localhost:8005/api/v1/some/api", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
      .next(response)
      .call(promiseJson, response)
      .next(data)
      .isDone();
  });
});
