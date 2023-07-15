import { call } from "redux-saga/effects";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8005/api/v1/";
export const API_CROSS_SITE =
  import.meta.env.NODE_ENV !== "test" &&
  import.meta.env.VITE_API_CROSS_SITE === "true";

function pathToURL(path: string): string {
  if (path.startsWith(API_URL)) {
    return path;
  } else if (path.startsWith("/")) {
    return API_URL + path.slice(1);
  } else {
    return API_URL + path;
  }
}

export type DefaultError = {
  detail?: string;
  non_field_errors?: Array<string>;
};

export function getError(error: DefaultError): string | undefined {
  return error.detail ?? error.non_field_errors?.[0];
}

export type APIResponse = {
  status: number;
  success: boolean;
  data?: any;
};

export type APIRequest = {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: object;
};

export function promiseJson(response: Response) {
  return response.json();
}

export function* rawRequest(
  request: APIRequest
): Generator<any, APIResponse, any> {
  const { path, method, body } = request;
  const headers: Record<string, string> = request.headers ?? {};
  if (!headers.Accept) {
    headers.Accept = "application/json";
  }
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
  if (success && status === 204) {
    return { status, success };
  }

  const data = yield call(promiseJson, response);
  return { status, success, data };
}

export type APIAuth = {
  token?: string;
  expiry?: string;
};

export var apiAuth: APIAuth = {
  token: localStorage.getItem("auth.token") || undefined,
  expiry: localStorage.getItem("auth.expiry") || undefined,
};

export function setAuth(auth: APIAuth) {
  localStorage.setItem("auth.token", auth.token ?? "");
  localStorage.setItem("auth.expiry", auth.expiry ?? "");
  apiAuth = auth;
}

export function* authRequest(
  request: APIRequest
): Generator<any, APIResponse, any> {
  const headers: Record<string, string> = request.headers ?? {};
  if (!headers["Authorization"]) {
    headers["Authorization"] = `Token ${apiAuth.token}`;
  }
  return yield call(rawRequest, {
    ...request,
    headers,
  });
}
