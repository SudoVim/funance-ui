import { selectors as accountSelectors } from "./account";
import { selectors as apiSelectors } from "./api";
import { actions as accountActions } from "./account";
import { sagas as accountSagas } from "./account";
import { fork } from "redux-saga/effects";

export const selectors = {
  account: accountSelectors,
  api: apiSelectors,
};

export const actions = {
  account: accountActions,
};

export function* sagas() {
  yield fork(accountSagas);
}
