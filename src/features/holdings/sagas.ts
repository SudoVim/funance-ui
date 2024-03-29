import {
  endpoints,
  ListAccountPurchasesRequest,
  CreateAccountRequest,
  CreatePurchaseRequest,
  PurchaseRequest,
} from "./endpoints";
import { call, takeEvery, select, put } from "redux-saga/effects";
import { authRequest } from "features/api";
import {
  paginatedSearchParams,
  PaginatedEndpointAction,
  EndpointAction,
} from "features/api/endpoint";
import { APIResponse } from "features/api/request";
import { AccountRequest, HoldingAccount } from "./types";
import { selectors } from "./selectors";
import { actions } from "./actions";
import { PayloadAction } from "@reduxjs/toolkit";

export function* accountsPage({ payload: request }: PaginatedEndpointAction) {
  const searchParams = paginatedSearchParams(request);
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_accounts/?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.accounts.list.handleResponse, { request, response });
}

export function* getAccount({
  payload: request,
}: EndpointAction<AccountRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_accounts/${encodeURIComponent(id)}/`,
    method: "GET",
  });
  yield call(endpoints.accounts.get.handleResponse, { request, response });
}

export function* createAccount({
  payload: request,
}: EndpointAction<CreateAccountRequest>) {
  const { name } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_accounts/`,
    method: "POST",
    body: { name },
  });
  yield call(endpoints.accounts.create.handleResponse, { request, response });
}

export function* createAccountPurchase({
  payload: request,
}: EndpointAction<CreatePurchaseRequest>) {
  const { account, ticker, quantity, price, purchasedAt } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_accounts/${encodeURIComponent(account)}/create_purchase/`,
    method: "POST",
    body: { account, ticker, quantity, price, purchased_at: purchasedAt },
  });
  yield call(endpoints.accounts.createPurchase.handleResponse, {
    request,
    response,
  });
}

export function* accountPurchasesPage({
  payload: request,
}: PaginatedEndpointAction<ListAccountPurchasesRequest>) {
  const searchParams = paginatedSearchParams(request);

  const { holdingAccountId } = request;
  if (holdingAccountId) {
    searchParams.set("holding_account", holdingAccountId);
  }

  const { tickerSymbol } = request;
  if (tickerSymbol) {
    searchParams.set("ticker", tickerSymbol);
  }

  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_purchases/?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.accountPurchases.list.handleResponse, {
    request,
    response,
  });
}

export function* getPurchase({
  payload: request,
}: EndpointAction<PurchaseRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_purchases/${encodeURIComponent(id)}/`,
    method: "GET",
  });
  yield call(endpoints.accountPurchases.get.handleResponse, {
    request,
    response,
  });
}

export function* deletePurchase({
  payload: request,
}: EndpointAction<PurchaseRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_purchases/${encodeURIComponent(id)}/`,
    method: "DELETE",
  });
  yield call(endpoints.accountPurchases.delete.handleResponse, {
    request,
    response,
  });
}

export function* reloadPurchases({
  payload: accountId,
}: PayloadAction<string | undefined>) {
  let id = accountId;
  if (!id) {
    const account: HoldingAccount | undefined = yield select(
      selectors.accounts.current,
    );
    if (!account) {
      return;
    }

    id = account.id;
  }

  yield put(
    actions.accountPurchases.list.fetchPage({
      holdingAccountId: id,
      fetchAll: true,
    }),
  );
}

export function* sagas() {
  yield takeEvery("holdings.accounts.list/fetchPage", accountsPage);
  yield takeEvery("holdings.accounts.get/request", getAccount);
  yield takeEvery("holdings.accounts.create/request", createAccount);
  yield takeEvery(
    "holdings.accounts.createPurchase/request",
    createAccountPurchase,
  );
  yield takeEvery(
    "holdings.accountPurchases.list/fetchPage",
    accountPurchasesPage,
  );
  yield takeEvery("holdings.accountPurchases.get/request", getPurchase);
  yield takeEvery("holdings.accountPurchases.delete/request", deletePurchase);
  yield takeEvery("holdings.accountPurchases/reload", reloadPurchases);
}
