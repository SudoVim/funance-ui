import { PaginatedEndpointRequest } from "features/api/endpoint";
import {
  endpoints,
  AccountRequest,
  getAccountKeyFromRequest,
  CreatePurchaseReference,
} from "./endpoints";
import { HoldingAccount } from "./types";

function getAccountsListEndpoint(state: any) {
  return state.holdings.accounts.list;
}

function getAccountsListPage(state: any, request: PaginatedEndpointRequest) {
  return endpoints.accounts.list.getPage(state.holdings.accounts.list, request);
}

function getAccount(state: any, request: AccountRequest) {
  return endpoints.accounts.get.getEndpoint(
    state.holdings.accounts.get,
    request,
  );
}

function getCurrentAccount(state: any) {
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

function getCreatePurchase(state: any, request: CreatePurchaseReference) {
  return endpoints.accounts.createPurchase.getEndpoint(
    state.holdings.accounts.createPurchase,
    request,
  );
}

function getCurrentCreatePurchase(state: any) {
  const account = getCurrentAccount(state);
  if (!account) {
    return undefined;
  }

  return getCreatePurchase(state, { account: account.id });
}

function getAccountsCreateEndpoint(state: any) {
  return state.holdings.accounts.create;
}

export const selectors = {
  accounts: {
    list: {
      endpoint: getAccountsListEndpoint,
      page: getAccountsListPage,
    },
    get: getAccount,
    create: getAccountsCreateEndpoint,
    createPurchase: getCreatePurchase,
    current: getCurrentAccount,
    currentCreatePurchase: getCurrentCreatePurchase,
  },
};
