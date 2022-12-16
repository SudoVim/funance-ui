import { fork } from "redux-saga/effects";
import { sagas as featureSagas } from "features";

export function* sagas() {
  yield fork(featureSagas);
}
