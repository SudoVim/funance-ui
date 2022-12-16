import { call } from "redux-saga/effects";

export const API_URL = process.env.API_URL ?? "http://localhost:8005/api/v1/";
export const API_CROSS_SITE = process.env.API_CROSS_SITE === "true";

function pathToURL(path: string): string {
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
  const headers: any = {
    Accept: "application/json",
  };
  const opts: any = {
    method,
    headers,
    // TODO: These need to be added for requests that include credentials.
    //credentials: "include",
  };

  if (API_CROSS_SITE) {
    headers["Sec-Fetch-Site"] = "cross-site";
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const response: Response = yield call(fetch, pathToURL(path), opts);

  const { status } = response;
  const success = status >= 200 && status < 300;
  if (status === 204) {
    return { request, status, success };
  }

  const data: Object = yield call(promiseJson, response);
  return { request, status, success, data };
}
