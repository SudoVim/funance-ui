import { endpoints } from "./endpoints";

function getListEndpoint(state: any) {
  return state.funds.list;
}

export const selectors = {
  list: {
    endpoint: getListEndpoint,
  },
};
