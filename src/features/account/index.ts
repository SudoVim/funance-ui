import { combineReducers } from "redux";
import { createEndpointSlice, rawRequest, authRequest } from "features/api";
import { EndpointAction } from "features/api/endpoint";
import { APIResponse } from "features/api/request";
import { call, takeEvery, put } from "redux-saga/effects";
import { actions as apiActions } from "features/api";

export type AccountState = {
  initialized: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  expiry: string;
  token: string;
};

const loginSlice = createEndpointSlice<LoginRequest, LoginResponse>(
  "account.login"
);
const logoutSlice = createEndpointSlice("account.logout");

export const accountState = combineReducers({
  login: loginSlice.reducer,
  logout: logoutSlice.reducer,
});

export const selectors = {
  isLoggedIn: (state: any) => state.account.isLoggedIn,
  state: (state: any) => state.account,
  login: (state: any) => state.account.login,
  logout: (state: any) => state.account.logout,
};

export type LoginAction = EndpointAction<LoginRequest>;

export const actions = {
  login: loginSlice.actions,
  logout: logoutSlice.actions,
};

export function* login({ payload: request }: LoginAction) {
  const response: APIResponse = yield call(rawRequest, {
    path: "/accounts/login",
    method: "POST",
    body: request,
  });
  yield put(loginSlice.actions.finish(response));
  if (response.success) {
    yield put(apiActions.setAuth(response.data));
  }
}

export function* logout() {
  const response: APIResponse = yield call(authRequest, {
    path: "/accounts/logout",
    method: "POST",
  });
  yield put(logoutSlice.actions.finish(response));
  yield put(apiActions.setAuth({}));
}

export function* sagas() {
  yield takeEvery("account.login/request", login);
  yield takeEvery("account.logout/request", logout);
}

export default accountState;
