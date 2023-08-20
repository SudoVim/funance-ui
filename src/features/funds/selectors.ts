import { endpoints } from "./endpoints";

function getListEndpoint(state: any) {
  return state.funds.list;
}

function getCreate(state: any) {
  return state.funds.create;
}

export const selectors = {
  list: {
    endpoint: getListEndpoint,
  },
  create: getCreate,
};
