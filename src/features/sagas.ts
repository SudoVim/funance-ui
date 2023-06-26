import { sagas as account } from "./account";
import { sagas as holdings } from "./holdings";
import { fork } from "redux-saga/effects";

export function* sagas() {
  yield fork(account);
  yield fork(holdings);
}
