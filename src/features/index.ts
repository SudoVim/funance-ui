import {
  selectors as accountSelectors,
  actions as accountActions,
} from "./account";
import { selectors as apiSelectors, actions as apiActions } from "./api";
import { sagas as accountSagas } from "./account";
import { fork } from "redux-saga/effects";

export const selectors = {
  account: accountSelectors,
  api: apiSelectors,
};

export const actions = {
  account: accountActions,
  api: apiActions,
};

export function* sagas() {
  yield fork(accountSagas);
}
