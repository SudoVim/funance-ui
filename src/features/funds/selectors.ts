import { endpoints } from "./endpoints";
import { Fund, FundReference } from "./types";
import { Endpoint } from "features/api/endpoint";

function getListEndpoint(state: any) {
  return state.funds.list;
}

function getCreate(state: any) {
  return state.funds.create;
}

function getGet(state: any) {
  return state.funds.get;
}

function getCurrentFundReference(state: any): FundReference | undefined {
  return state.funds.current.currentFund;
}

export function getFundFromRef(state: any, ref: FundReference): Endpoint<Fund> {
  const indirectState = getGet(state);
  return endpoints.get.getEndpoint(indirectState, ref);
}

export function getCurrentFund(state: any): Fund | undefined {
  const ref = getCurrentFundReference(state);
  if (!ref) {
    return undefined;
  }

  const endpoint = getFundFromRef(state, ref);
  if (!endpoint.isFilled || !endpoint.success) {
    return undefined;
  }

  return endpoint.data;
}

export const selectors = {
  list: {
    endpoint: getListEndpoint,
  },
  get: (ref: FundReference) => (state: any) => getFundFromRef(state, ref),
  create: getCreate,
  current: getCurrentFund,
};
