import { APIResponse } from "features/api/request";
import {
  EndpointAction,
  PaginatedEndpointAction,
  paginatedSearchParams,
} from "features/api/endpoint";
import {
  endpoints,
  CreateFundRequest,
  FundRequest,
  UpdateFundRequest,
  ListFundAllocationsRequest,
  FundAllocationRequest,
  UpdateFundAllocationRequest,
} from "./endpoints";
import { call, takeEvery } from "redux-saga/effects";
import { authRequest } from "features/api";

export function* createFund({
  payload: request,
}: EndpointAction<CreateFundRequest>) {
  const { name, shares } = request;
  const body: Record<string, any> = { name };
  if (shares) {
    body.shares = shares;
  }
  const response: APIResponse = yield call(authRequest, {
    path: "/funds/",
    method: "POST",
    body,
  });
  yield call(endpoints.create.handleResponse, { request, response });
}

export function* getFundsPage({ payload: request }: PaginatedEndpointAction) {
  const searchParams = paginatedSearchParams(request);
  const response: APIResponse = yield call(authRequest, {
    path: `/funds/?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.list.handleResponse, { request, response });
}

export function* getFund({ payload: request }: EndpointAction<FundRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/funds/${encodeURIComponent(id)}/`,
    method: "GET",
  });
  yield call(endpoints.get.handleResponse, { request, response });
}

export function* updateFund({
  payload: request,
}: EndpointAction<UpdateFundRequest>) {
  const { id, name, shares } = request;
  const body: Record<string, any> = {};
  if (name) {
    body.name = name;
  }
  if (shares) {
    body.shares = shares;
  }
  const response: APIResponse = yield call(authRequest, {
    path: `/funds/${encodeURIComponent(id)}/`,
    method: "PATCH",
    body,
  });
  yield call(endpoints.update.handleResponse, { request, response });
}

export function* getFundAllocationsPage({
  payload: request,
}: PaginatedEndpointAction<ListFundAllocationsRequest>) {
  const searchParams = paginatedSearchParams(request);
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/funds/${encodeURIComponent(id)}/?${searchParams.toString()}`,
    method: "GET",
  });
  yield call(endpoints.list.handleResponse, { request, response });
}

export function* getFundAllocation({
  payload: request,
}: EndpointAction<FundAllocationRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/fund_allocations/${encodeURIComponent(id)}/`,
    method: "GET",
  });
  yield call(endpoints.allocations.get.handleResponse, { request, response });
}

export function* updateFundAllocation({
  payload: request,
}: EndpointAction<UpdateFundAllocationRequest>) {
  const { id, shares } = request;
  const body: Record<string, any> = {};
  if (shares) {
    body.shares = shares;
  }
  const response: APIResponse = yield call(authRequest, {
    path: `/fund_allocations/${encodeURIComponent(id)}/`,
    method: "PATCH",
    body,
  });
  yield call(endpoints.allocations.update.handleResponse, {
    request,
    response,
  });
}

export function* deleteFundAllocation({
  payload: request,
}: EndpointAction<FundAllocationRequest>) {
  const { id } = request;
  const response: APIResponse = yield call(authRequest, {
    path: `/fund_allocations/${encodeURIComponent(id)}/`,
    method: "DELETE",
  });
  yield call(endpoints.allocations.delete.handleResponse, {
    request,
    response,
  });
}

export function* sagas() {
  yield takeEvery("funds.create/request", createFund);
  yield takeEvery("funds.list/fetchPage", getFundsPage);
  yield takeEvery("funds.get/request", getFund);
  yield takeEvery("funds.update/request", updateFund);
  yield takeEvery("funds.allocations.list/fetchPage", getFundAllocationsPage);
  yield takeEvery("funds.allocations.get/request", getFundAllocation);
  yield takeEvery("funds.allocations.update/request", updateFundAllocation);
  yield takeEvery("funds.allocations.delete/request", deleteFundAllocation);
}
