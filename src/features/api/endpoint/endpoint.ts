import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { APIResponse, DefaultError } from "../request";

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

export type EndpointAction<R> = PayloadAction<R>;

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

export type EndpointResponse<R = undefined> = {
  request: R;
  response: APIResponse;
};

export function createEndpointSlice<
  R = undefined,
  T = undefined,
  E = DefaultError
>({ name }: EndpointProps) {
  return createSlice<Endpoint<T, E>, SliceCaseReducers<Endpoint<T, E>>>({
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
}

export type IndirectEndpointProps<R> = EndpointProps & {
  getKeyFromRequest: (request: R) => string;
};

export type IndirectEndpoint<T = undefined, E = DefaultError> = Record<
  string,
  Endpoint<T, E>
>;

export function createIndirectEndpointSlice<
  R = undefined,
  T = undefined,
  E = DefaultError
>({ name, getKeyFromRequest }: IndirectEndpointProps<R>) {
  // This "naive" slice represents the state mechanism for each of the
  // underlying "indirect" items.
  const naiveSlice = createEndpointSlice<R, T, E>({ name });
  return createSlice<
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
}
