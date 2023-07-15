import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import {
  emptyEndpoint,
  EmptyEndpoint,
  LoadingEndpoint,
  IndirectEndpoint,
  createIndirectEndpointSlice,
  EndpointResponse,
  loadingEndpoint,
  EndpointProps,
  EndpointRequest,
} from "./endpoint";
import { DefaultError } from "../request";
import { call, put } from "redux-saga/effects";

export type PaginatedEndpointRequest = EndpointRequest & {
  page?: number;
};

export type PaginatedEndpointAction<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest
> = PayloadAction<R>;

export function paginatedSearchParams({ page }: PaginatedEndpointRequest) {
  return new URLSearchParams({ page: `${page ?? 1}` });
}

export type PaginatedEndpointResponse<P = undefined> = {
  count: number;
  next: string;
  previous: string;
  results: P[];
};

export type EmptyPaginatedEndpoint = EmptyEndpoint;
export type LoadingPaginatedEndpoint = LoadingEndpoint;
export type FilledPaginatedEndpoint<P = undefined, E = DefaultError> = {
  isEmpty: false;
  isLoading: false;
  isFilled: true;
  count: number;
  next: string;
  previous: string;
  pages: IndirectEndpoint<PaginatedEndpointResponse<P>, E>;
  errorData?: E;
};

export type PaginatedEndpoint<P = undefined, E = DefaultError> =
  | EmptyPaginatedEndpoint
  | LoadingPaginatedEndpoint
  | FilledPaginatedEndpoint<P, E>;

export type PaginatedEndpointProps = EndpointProps;

export function createPaginatedEndpointSlice<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest,
  P = undefined,
  E = DefaultError
>({ name }: PaginatedEndpointProps) {
  const naiveIndirectSlice = createIndirectEndpointSlice<
    R,
    PaginatedEndpoint<P, E>,
    E
  >({
    name,
    getKeyFromRequest: ({ page }: PaginatedEndpointRequest) => `${page || 1}`,
  });
  const slice = createSlice<
    PaginatedEndpoint<P, E>,
    SliceCaseReducers<PaginatedEndpoint<P, E>>
  >({
    name,
    initialState: emptyEndpoint,
    reducers: {
      clear: (state: any): PaginatedEndpoint<P, E> => emptyEndpoint,
      fetchPage: (
        state: any,
        action: PayloadAction<R>
      ): PaginatedEndpoint<P, E> => {
        const { isFilled } = state;
        if (!isFilled) {
          return loadingEndpoint;
        }

        const { payload: request } = action;
        return {
          ...state,
          errorData: undefined,
          pages: naiveIndirectSlice.reducer(
            state.pages ?? {},
            naiveIndirectSlice.actions.request(request)
          ),
        };
      },
      finishPage: (
        state: any,
        action: PayloadAction<EndpointResponse<R>>
      ): PaginatedEndpoint<P, E> => {
        const { payload: endpointResponse } = action;
        const { request, response } = endpointResponse;

        state.isEmpty = false;
        state.isLoading = false;
        state.isFilled = true;
        state.errorData = response.success ? undefined : response.data;
        state.pages = naiveIndirectSlice.reducer(
          state.pages ?? {},
          naiveIndirectSlice.actions.finish({
            request,
            response,
          })
        );

        if (response.success) {
          const { count, next, previous } = response.data;
          state.count = count;
          state.next = next;
          state.previous = previous;
        }

        return state;
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