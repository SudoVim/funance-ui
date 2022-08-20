import { sagas as apiSagas } from "features/api";
import { fork } from "redux-saga/effects";

export function* sagas() {
  yield fork(apiSagas);
}
