import { PaginatedEndpointRequest } from "features/api/endpoint";
import {
  endpoints,
  AccountRequest,
  getAccountKeyFromRequest,
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
  },
};
