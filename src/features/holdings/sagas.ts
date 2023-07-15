import { endpoints } from "./endpoints";
import { call, takeEvery } from "redux-saga/effects";
import { authRequest } from "features/api";
import {
  paginatedSearchParams,
  PaginatedEndpointAction,
} from "features/api/endpoint";
import { APIResponse } from "features/api/request";

export function* accountsPage({ payload: request }: PaginatedEndpointAction) {
  const searchParams = paginatedSearchParams(request);
  const response: APIResponse = yield call(authRequest, {
    path: `/holding_accounts?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.accounts.list.handleResponse, { request, response });
}

export function* sagas() {
  yield takeEvery("holdings.accounts.list/fetchPage", accountsPage);
}
