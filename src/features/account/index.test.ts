import { describe, it } from "vitest";
import { account, requireAccount, selectors, accountSlice } from "./index";
import { testSaga } from "redux-saga-test-plan";
import { authRequest, selectors as apiSelectors } from "features/api";

describe("account saga", () => {
  it("finishes successfully", () => {
    const saga = account;
    const request = {};
    const response = {
      success: true,
    };
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/accounts/account",
        method: "GET",
      })
      .next(response)
      .call(accountSlice.handleResponse, { request, response })
      .next()
      .isDone();
  });
  it("finishes unsuccessfully", () => {
    const saga = account;
    const request = {};
    const response = {
      success: false,
      status: 500,
    };
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/accounts/account",
        method: "GET",
      })
      .next(response)
      .call(accountSlice.handleResponse, { request, response })
      .next()
      .isDone();
  });
  it("finishes unsuccessfully 401", () => {
    const saga = account;
    const request = {};
    const response = {
      success: false,
      status: 401,
    };
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/accounts/account",
        method: "GET",
      })
      .next(response)
      .call(accountSlice.handleResponse, { request, response })
      .next()
      .put({
        type: "api/setAuth",
        payload: {},
      })
      .next()
      .isDone();
  });
});

describe("requireAccount saga", () => {
  it("does not have auth", () => {
    const saga = requireAccount;
    const hasAuth = false;
    testSaga(saga).next().select(apiSelectors.hasAuth).next(hasAuth).isDone();
  });
  it("has auth, account loading", () => {
    const saga = requireAccount;
    const hasAuth = true;
    const account = {
      isLoading: true,
    };
    testSaga(saga)
      .next()
      .select(apiSelectors.hasAuth)
      .next(hasAuth)
      .select(selectors.account)
      .next(account)
      .isDone();
  });
  it("has auth, account filled", () => {
    const saga = requireAccount;
    const hasAuth = true;
    const account = {
      isLoading: false,
      isFilled: true,
    };
    testSaga(saga)
      .next()
      .select(apiSelectors.hasAuth)
      .next(hasAuth)
      .select(selectors.account)
      .next(account)
      .isDone();
  });
  it("has auth, account empty", () => {
    const saga = requireAccount;
    const hasAuth = true;
    const account = {
      isEmpty: true,
      isLoading: false,
      isFilled: false,
    };
    testSaga(saga)
      .next()
      .select(apiSelectors.hasAuth)
      .next(hasAuth)
      .select(selectors.account)
      .next(account)
      .put({
        type: "account.account/request",
        payload: {},
      })
      .next()
      .isDone();
  });
});
