import { call } from "redux-saga/effects";

export const API_URL = process.env.API_URL ?? "http://localhost:8005/api/v1/";
export const API_CROSS_SITE =
  process.env.NODE_ENV !== "test" && process.env.API_CROSS_SITE === "true";

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
  non_field_errors?: Array<string>;
};

export type APISuccessResponse<T = undefined> = {
  status: number;
  success: true;
  data: T;
};

export type APIErrorResponse<E = DefaultError> = {
  status: number;
  success: false;
  errorData: E;
};

export type APIResponse<T, E = DefaultError> =
  | APISuccessResponse<T>
  | APIErrorResponse<E>;

export type APIRequest<R = undefined> = {
  path: string;
  method: string;
  body: R;
};

export function promiseJson(response: Response) {
  return response.json();
}

export function* rawRequest<R = undefined, T = undefined, E = DefaultError>(
  request: APIRequest<R>
): Generator<any, APIResponse<T, E>, any> {
  const { path, method, body } = request;
  const headers: Record<string, string> = {
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
  if (!success) {
    const errorData: E = yield call(promiseJson, response);
    return { status, success, errorData };
  }

  const data: T = yield call(promiseJson, response);
  return { status, success, data };
}
