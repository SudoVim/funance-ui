import { sagas as account } from "./account";
import { sagas as holdings } from "./holdings";
import { sagas as funds } from "./funds";
import { fork } from "redux-saga/effects";

export function* sagas() {
  yield fork(account);
  yield fork(holdings);
  yield fork(funds);
}
