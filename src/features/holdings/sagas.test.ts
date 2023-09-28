import { describe, it, expect } from "vitest";
import { testSaga } from "redux-saga-test-plan";
import {
  accountsPage,
  getAccount,
  createAccount,
  accountPurchasesPage,
  createAccountPurchase,
  getPurchase,
  deletePurchase,
} from "./sagas";
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

describe("test getAccount", () => {
  it("fetches a page", () => {
    const request = { id: "account%id" };
    const response = {};
    const saga = getAccount;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_accounts/account%25id/",
        method: "GET",
      })
      .next(response)
      .call(endpoints.accounts.get.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test createAccount", () => {
  it("fetches a page", () => {
    const request = {
      name: "Account Name",
    };
    const response = {};
    const saga = createAccount;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_accounts/",
        method: "POST",
        body: { name: "Account Name" },
      })
      .next(response)
      .call(endpoints.accounts.create.handleResponse, { request, response })
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
      .call(endpoints.accountPurchases.list.handleResponse, {
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
      .call(endpoints.accountPurchases.list.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
});

describe("test createAccountPurchase", () => {
  it("fetches a page", () => {
    const request = {
      account: "account-id",
      ticker: "MSFT",
      quantity: 17,
      price: 1234.56,
      purchasedAt: "2023-08-19",
    };
    const response = {};
    const saga = createAccountPurchase;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_accounts/account-id/create_purchase/",
        method: "POST",
        body: {
          account: "account-id",
          ticker: "MSFT",
          quantity: 17,
          price: 1234.56,
          purchased_at: "2023-08-19",
        },
      })
      .next(response)
      .call(endpoints.accounts.createPurchase.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
});

describe("test getPurchase", () => {
  it("fetches a purchase", () => {
    const request = { id: "purchase%id" };
    const response = {};
    const saga = getPurchase;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_account_purchases/purchase%25id/",
        method: "GET",
      })
      .next(response)
      .call(endpoints.accountPurchases.get.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
});

describe("test deletePurchase", () => {
  it("fetches a purchase", () => {
    const request = { id: "purchase%id" };
    const response = {};
    const saga = deletePurchase;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/holding_account_purchases/purchase%25id/",
        method: "DELETE",
      })
      .next(response)
      .call(endpoints.accountPurchases.delete.handleResponse, {
        request,
        response,
      })
      .next()
      .isDone();
  });
});
