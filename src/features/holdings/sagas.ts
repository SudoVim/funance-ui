import { endpoints } from "./endpoints";
import { call, takeEvery, put } from "redux-saga/effects";
import { authRequest } from "features/api";
import { APIResponse } from "features/api/request";

export function* list() {
  const response: APIResponse = yield call(authRequest, {
    path: "/holding_accounts",
    method: "GET",
  });
  yield put(endpoints.accounts.list.actions.finish({ response }));
}

export function* sagas() {
  yield takeEvery("holdings.accounts.list/request", list);
}
