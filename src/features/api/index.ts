import { call, takeEvery } from "redux-saga/effects";
import { apiSlice } from "./state";

export type APIResponse = {
  request: APIRequest;
  status: number;
  success: boolean;
  data?: object;
};

export type APIRequest = {
  url: string;
  method: string;
  callback: (response: APIResponse) => void;
};

export type APIAction = {
  type: "API/REQUEST";
  request: APIRequest;
};

export function* rawRequest({ request }: APIAction) {
  const { url, method, callback } = request;
  const headers = { Accept: "application/json" };
  const response: Response = yield call(fetch, url, {
    method,
    headers,
    credentials: "include",
  });

  const { status } = response;
  const success = status >= 200 && status < 300;
  if (status === 204) {
    callback({ request, status, success });
    return;
  }

  const data: Object = yield call(response.json);
  callback({
    request,
    status,
    success,
    data,
  });
}

export const actions = {
  rawRequest: (request: APIRequest): APIAction => ({
    type: "API/REQUEST",
    request,
  }),
};

export function* sagas() {
  yield takeEvery("API/REQUEST", rawRequest);
}

export default apiSlice.reducer;
