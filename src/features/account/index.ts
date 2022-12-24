import { combineReducers } from "redux";
import { createEndpointSlice, rawRequest } from "features/api";
import { EndpointAction } from "features/api/endpoint";
import { APIResponse } from "features/api/request";
import { call, takeEvery, put } from "redux-saga/effects";

export type AccountState = {
  initialized: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {};

const loginSlice = createEndpointSlice<LoginRequest>("account.login");

export const accountState = combineReducers({
  login: loginSlice.reducer,
});

export const selectors = {
  isLoggedIn: (state: any) => state.account.isLoggedIn,
  state: (state: any) => state.account,
  login: (state: any) => state.account.login,
};

export type LoginAction = EndpointAction<LoginRequest>;

export const actions = {
  login: loginSlice.actions,
};

export function* login({ payload: request }: LoginAction) {
  const response: APIResponse<any> = yield call(rawRequest, {
    path: "/accounts/login",
    method: "POST",
    body: request,
  });
  yield put(loginSlice.actions.finish(response));
}

export function* sagas() {
  yield takeEvery("account.login/request", login);
}

export default accountState;
