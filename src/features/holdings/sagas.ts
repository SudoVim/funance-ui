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
import {
  AccountRequest,
  HoldingAccount,
  HoldingAccountAction,
  HoldingAccountPurchase,
} from "./types";
import { selectors } from "./selectors";
import { actions } from "./actions";
import { PayloadAction } from "@reduxjs/toolkit";

function asNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function actionToPurchase(
  action: HoldingAccountAction,
): HoldingAccountPurchase {
  const quantity = asNumber(action.quantity);
  return {
    id: action.id,
    ticker: { symbol: action.ticker_symbol },
    price: asNumber(action.price),
    quantity: action.action === "sell" ? -quantity : quantity,
    purchased_at: action.purchased_on,
    created_at: action.created_at ?? action.purchased_on,
  };
}

function adaptActionResponse(response: APIResponse): APIResponse {
  if (!response.success || response.data == null) {
    return response;
  }
  const data = response.data as {
    results?: HoldingAccountAction[];
    action?: HoldingAccountAction["action"];
    ticker_symbol?: string;
  };
  if (Array.isArray(data.results)) {
    return {
      ...response,
      data: {
        ...response.data,
        results: data.results.map(actionToPurchase),
      },
    };
  }
  if (data.action && data.ticker_symbol) {
    return {
      ...response,
      data: actionToPurchase(response.data as HoldingAccountAction),
    };
  }
  return response;
}

function purchasedOn(purchasedAt: string): string {
  return purchasedAt.slice(0, 10);
}

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
    path: `/holding_accounts/${encodeURIComponent(account)}/actions/`,
    method: "POST",
    body: {
      ticker_symbol: ticker,
      action: quantity < 0 ? "sell" : "buy",
      quantity: Math.abs(quantity),
      price,
      purchased_on: purchasedOn(purchasedAt),
    },
  });
  yield call(endpoints.accounts.createPurchase.handleResponse, {
    request,
    response: adaptActionResponse(response),
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
    searchParams.set("ticker_symbol", tickerSymbol);
  }

  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_actions/?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.accountPurchases.list.handleResponse, {
    request,
    response: adaptActionResponse(response),
  });
}

export function* getPurchase({
  payload: request,
}: EndpointAction<PurchaseRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_actions/${encodeURIComponent(id)}/`,
    method: "GET",
  });
  yield call(endpoints.accountPurchases.get.handleResponse, {
    request,
    response: adaptActionResponse(response),
  });
}

export function* deletePurchase({
  payload: request,
}: EndpointAction<PurchaseRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_account_actions/${encodeURIComponent(id)}/`,
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
