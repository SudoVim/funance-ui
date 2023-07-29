import { describe, it, expect } from "vitest";
import { testSaga } from "redux-saga-test-plan";
import { accountsPage, accountPurchasesPage } from "./sagas";
import { authRequest } from "features/api";
import { endpoints } from "./endpoints";

describe("test accountsPage", () => {
  it("fetches a page", () => {
    const request = {};
    const response = {};
    const saga = accountsPage;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_accounts/?page=1",
        method: "GET",
      })
      .next(response)
      .call(endpoints.accounts.list.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test accountPurchasessPage", () => {
  it("fetches a page", () => {
    const request = {};
    const response = {};
    const saga = accountPurchasesPage;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_account_purchases/?page=1",
        method: "GET",
      })
      .next(response)
      .call(endpoints.account_purchases.list.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
  it("fetches a page with optional inputs", () => {
    const request = {
      holdingAccountId: "abc123",
      tickerSymbol: "MSFT",
    };
    const response = {};
    const saga = accountPurchasesPage;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_account_purchases/?page=1&holding_account=abc123&ticker=MSFT",
        method: "GET",
      })
      .next(response)
      .call(endpoints.account_purchases.list.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
});
