import { PaginatedEndpointRequest } from "features/api/endpoint";
import {
  endpoints,
  getAccountKeyFromRequest,
  CreatePurchaseReference,
} from "../endpoints";
import { HoldingAccount, AccountRequest } from "../types";
import { State } from "features/types";

function getAccountsListEndpoint(state: State) {
  return state.holdings.accounts.list;
}

function getAccountsListPage(state: State, request: PaginatedEndpointRequest) {
  return endpoints.accounts.list.getPage(state.holdings.accounts.list, request);
}

function getAccount(state: State, request: AccountRequest) {
  return endpoints.accounts.get.getEndpoint(
    state.holdings.accounts.get,
    request,
  );
}

export function getCurrentAccount(state: State): HoldingAccount | undefined {
  const request = state.holdings.accounts.current.currentAccount;
  if (!request) {
    return undefined;
  }

  const endpoint = getAccount(state, request);
  if (!endpoint.isFilled || !endpoint.success) {
    return undefined;
  }

  return endpoint.data;
}

function getCreatePurchase(state: State, request: CreatePurchaseReference) {
  return endpoints.accounts.createPurchase.getEndpoint(
    state.holdings.accounts.createPurchase,
    request,
  );
}

export function getCurrentCreatePurchase(state: State) {
  const request = state.holdings.accounts.current.currentAccount;
  if (!request) {
    return undefined;
  }

  return getCreatePurchase(state, { account: request.id });
}

function getAccountsCreateEndpoint(state: State) {
  return state.holdings.accounts.create;
}

export const accounts = {
  list: {
    endpoint: getAccountsListEndpoint,
    page: (request: PaginatedEndpointRequest) => (state: State) =>
      getAccountsListPage(state, request),
  },
  get: (request: AccountRequest) => (state: State) =>
    getAccount(state, request),
  create: getAccountsCreateEndpoint,
  createPurchase: (request: CreatePurchaseReference) => (state: State) =>
    getCreatePurchase(state, request),
  current: getCurrentAccount,
  currentCreatePurchase: getCurrentCreatePurchase,
};
