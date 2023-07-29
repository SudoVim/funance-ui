import { selectors as accountSelectors } from "./account";
import { selectors as apiSelectors } from "./api";
import { selectors as holdingsSelectors } from "./holdings";
export { actions } from "./actions";
export { sagas } from "./sagas";
export { state } from "./state";

export const selectors = {
  account: accountSelectors,
  api: apiSelectors,
  holdings: holdingsSelectors,
};
