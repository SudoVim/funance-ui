import { selectors as accountSelectors } from "./account";
import { selectors as apiSelectors } from "./api";
export { actions } from "./actions";
export { sagas } from "./sagas";

export const selectors = {
  account: accountSelectors,
  api: apiSelectors,
};
