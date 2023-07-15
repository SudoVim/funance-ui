import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { APIResponse, DefaultError } from "../request";
import { call, put } from "redux-saga/effects";

export type EmptyEndpoint = {
  isEmpty: true;
  isLoading: false;
  isFilled: false;
};

export type LoadingEndpoint = {
  isEmpty: false;
  isLoading: true;
  isFilled: false;
};

export type SuccessfulEndpoint<T> = {
  isEmpty: false;
  isLoading: false;
  isFilled: true;
  success: true;
  data: T;
};

export type ErrorEndpoint<E> = {
  isEmpty: false;
  isLoading: false;
  isFilled: true;
  success: false;
  errorData: E;
};

export type FilledEndpoint<T, E> = SuccessfulEndpoint<T> | ErrorEndpoint<E>;

export type Endpoint<T = unknown, E = DefaultError> =
  | EmptyEndpoint
  | LoadingEndpoint
  | FilledEndpoint<T, E>;

export const emptyEndpoint: EmptyEndpoint = {
  isEmpty: true,
  isLoading: false,
  isFilled: false,
};

export const loadingEndpoint: LoadingEndpoint = {
  isEmpty: false,
  isLoading: true,
  isFilled: false,
};

export type EndpointProps = {
  name: string;
};

export type EndpointRequest = {
  callback?: (response: APIResponse) => void;
};

export type EndpointAction<R extends EndpointRequest = EndpointRequest> =
  PayloadAction<R>;

export type EndpointResponse<R = undefined> = {
  request: R;
  response: APIResponse;
};

export function createEndpointSlice<
  R extends EndpointRequest = EndpointRequest,
  T = undefined,
  E = DefaultError
>({ name }: EndpointProps) {
  const slice = createSlice<Endpoint<T, E>, SliceCaseReducers<Endpoint<T, E>>>({
    name,
    initialState: emptyEndpoint,
    reducers: {
      clear: (state: any): Endpoint<T, E> => emptyEndpoint,
      request: (state: any, action: PayloadAction<R>): Endpoint<T, E> =>
        loadingEndpoint,
      finish: (
        state: any,
        action: PayloadAction<EndpointResponse<R>>
      ): Endpoint<T, E> => {
        const { payload: endpointResponse } = action;
        const { response } = endpointResponse;
        if (!response.success) {
          const { data } = response;
          return {
            isEmpty: false,
            isLoading: false,
            isFilled: true,
            success: false,
            errorData: data,
          };
        }

        const { data } = response;
        return {
          isEmpty: false,
          isLoading: false,
          isFilled: true,
          success: true,
          data,
        };
      },
    },
  });

  const { reducer, actions } = slice;
  function* handleResponse({ request, response }: EndpointResponse<R>) {
    yield put(actions.finish({ request, response }));

    const { callback } = request;
    if (callback) {
      yield call(callback, response);
    }
  }

  return { reducer, actions, handleResponse };
}

export type IndirectEndpointProps<R> = EndpointProps & {
  getKeyFromRequest: (request: R) => string;
};

export type IndirectEndpoint<T = undefined, E = DefaultError> = Record<
  string,
  Endpoint<T, E>
>;

export function createIndirectEndpointSlice<
  R extends EndpointRequest = EndpointRequest,
  T = undefined,
  E = DefaultError
>({ name, getKeyFromRequest }: IndirectEndpointProps<R>) {
  // This "naive" slice represents the state mechanism for each of the
  // underlying "indirect" items.
  const naiveSlice = createEndpointSlice<R, T, E>({ name });
  const slice = createSlice<
    IndirectEndpoint<T, E>,
    SliceCaseReducers<IndirectEndpoint<T, E>>
  >({
    name,
    initialState: {},
    reducers: {
      clear: (
        state: any,
        action: PayloadAction<R | undefined>
      ): IndirectEndpoint<T, E> => {
        const { payload: request } = action;
        if (!request) {
          return {};
        }

        const key = getKeyFromRequest(request);
        return {
          ...state,
          [key]: naiveSlice.reducer(state[key] ?? emptyEndpoint, action),
        };
      },
      request: (
        state: any,
        action: PayloadAction<R>
      ): IndirectEndpoint<T, E> => {
        const { payload: request } = action;
        const key = getKeyFromRequest(request);
        return {
          ...state,
          [key]: naiveSlice.reducer(state[key] ?? emptyEndpoint, action),
        };
      },
      finish: (
        state: any,
        action: PayloadAction<EndpointResponse<R>>
      ): IndirectEndpoint<T, E> => {
        const { payload: endpointResponse } = action;
        const { request } = endpointResponse;
        const key = getKeyFromRequest(request);
        return {
          ...state,
          [key]: naiveSlice.reducer(state[key] ?? emptyEndpoint, action),
        };
      },
    },
  });

  const { reducer, actions } = slice;
  function* handleResponse({ request, response }: EndpointResponse<R>) {
    yield put(actions.finish({ request, response }));

    const { callback } = request;
    if (callback) {
      yield call(callback, response);
    }
  }

  return { reducer, actions, handleResponse };
}