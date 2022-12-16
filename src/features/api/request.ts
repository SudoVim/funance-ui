import { call } from "redux-saga/effects";

export const API_URL = process.env.API_URL ?? "http://localhost:8005/api/v1/";

function normalizePath(path: string): string {
  if (path.startsWith(API_URL)) {
    return path;
  } else if (path.startsWith("/")) {
    return API_URL + path.slice(1);
  } else {
    return API_URL + path;
  }
}

export type APIResponse = {
  request: APIRequest;
  status: number;
  success: boolean;
  data?: object;
};

export type APIRequest = {
  path: string;
  method: string;
  body?: object;
};

export function promiseJson(response: Response) {
  return response.json();
}

export function* rawRequest(request: APIRequest) {
  const { path, method, body } = request;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Sec-Fetch-Site": "cross-site",
  };
  const response: Response = yield call(fetch, normalizePath(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    //credentials: "include",
  });

  const { status } = response;
  const success = status >= 200 && status < 300;
  if (status === 204) {
    return { request, status, success };
  }

  const data: Object = yield call(promiseJson, response);
  return { request, status, success, data };
}
