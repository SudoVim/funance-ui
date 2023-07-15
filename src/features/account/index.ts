import { combineReducers } from "redux";
import {
  createEndpointSlice,
  rawRequest,
  authRequest,
  selectors as apiSelectors,
  actions as apiActions,
} from "features/api";
import {
  EndpointAction,
  Endpoint,
  EndpointRequest,
} from "features/api/endpoint";
import { APIResponse } from "features/api/request";
import { call, takeEvery, put, select } from "redux-saga/effects";

export type LoginRequest = EndpointRequest & {
  username: string;
  password: string;
};

export type LoginResponse = {
  expiry: string;
  token: string;
};

const loginSlice = createEndpointSlice<LoginRequest, LoginResponse>({
  name: "account.login",
});
const logoutSlice = createEndpointSlice({ name: "account.logout" });

export type Account = {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
};

export const accountSlice = createEndpointSlice<EndpointRequest, Account>({
  name: "account.account",
});

export const state = combineReducers({
  login: loginSlice.reducer,
  logout: logoutSlice.reducer,
  account: accountSlice.reducer,
});

export const selectors = {
  login: (state: any) => state.account.login,
  logout: (state: any) => state.account.logout,
  account: (state: any) => state.account.account,
};

export type LoginAction = EndpointAction<LoginRequest>;

export const actions = {
  login: loginSlice.actions,
  logout: logoutSlice.actions,
  account: accountSlice.actions,
  requireAccount: () => ({
    type: "account.requireAccount",
  }),
};

export function* login({ payload: request }: LoginAction) {
  const response: APIResponse = yield call(rawRequest, {
    path: "/accounts/login",
    method: "POST",
    body: request,
  });
  yield call(loginSlice.handleResponse, { request, response });
  if (response.success) {
    yield put(apiActions.setAuth(response.data));
  }
}

export function* logout({ payload: request }: EndpointAction) {
  const response: APIResponse = yield call(authRequest, {
    path: "/accounts/logout",
    method: "POST",
  });
  yield call(logoutSlice.handleResponse, { request, response });
  yield put(apiActions.setAuth({}));
}

export function* account({ payload: request }: EndpointAction) {
  const response: APIResponse = yield call(authRequest, {
    path: "/accounts/account",
    method: "GET",
  });
  yield call(accountSlice.handleResponse, { request, response });
  if (!response.success && response.status === 401) {
    yield put(apiActions.setAuth({}));
  }
}

export type RequireAccountAction = {
  type: "account.requireAccount";
};

export function* requireAccount() {
  const hasAuth: boolean = yield select(apiSelectors.hasAuth);
  if (!hasAuth) {
    return;
  }

  const account: Endpoint = yield select(selectors.account);
  if (account.isLoading || account.isFilled) {
    return;
  }

  yield put(actions.account.request({}));
}

export function* sagas() {
  yield takeEvery("account.login/request", login);
  yield takeEvery("account.logout/request", logout);
  yield takeEvery("account.account/request", account);
  yield takeEvery("account.requireAccount", requireAccount);
}
