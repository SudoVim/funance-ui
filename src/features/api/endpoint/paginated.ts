import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  Slice,
  Reducer,
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
  Endpoint,
} from "./endpoint";
import { DefaultError, APIResponse } from "../request";
import { call, put } from "redux-saga/effects";

export type PaginatedEndpointRequest = EndpointRequest & {
  url?: string;
  page?: number;
  fetchAll?: boolean;
};

export type PaginatedEndpointAction<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest,
> = PayloadAction<R>;

export function paginatedSearchParams({ url, page }: PaginatedEndpointRequest) {
  if (url) {
    const parsedURL = new URL(url);
    return parsedURL.searchParams;
  }

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

export function getKeyFromRequest({ page }: PaginatedEndpointRequest) {
  return `${page || 1}`;
}

export type PageEndpoint<P = undefined, E = DefaultError> = Endpoint<
  PaginatedEndpointResponse<P>,
  E
>;

export type PaginatedEndpointActions<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest,
> = {
  clear: () => PayloadAction;
  fetchPage: (request: R) => PayloadAction<R>;
  fetchAllPages: () => PayloadAction<R>;
  finishPage: (
    response: EndpointResponse<R>,
  ) => PayloadAction<EndpointResponse<R>>;
};

export type PaginatedEndpointSlice<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest,
  P = undefined,
  E = DefaultError,
> = {
  slice: Slice<
    PaginatedEndpoint<P, E>,
    SliceCaseReducers<PaginatedEndpoint<P, E>>
  >;
  actions: PaginatedEndpointActions<R>;
  reducer: Reducer<PaginatedEndpoint<P, E>>;
  handleResponse: (endpointResponse: EndpointResponse<R>) => any;
  getPage: (
    state: PaginatedEndpoint<P, E>,
    request: PaginatedEndpointRequest,
  ) => PageEndpoint<P, E>;
};

export function createPaginatedEndpointSlice<
  R extends PaginatedEndpointRequest = PaginatedEndpointRequest,
  P = undefined,
  E = DefaultError,
>({ name }: PaginatedEndpointProps): PaginatedEndpointSlice<R, P, E> {
  const naiveIndirectSlice = createIndirectEndpointSlice<
    R,
    PaginatedEndpoint<P, E>,
    E
  >({
    name,
    getKeyFromRequest,
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
        action: PayloadAction<R>,
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
            naiveIndirectSlice.actions.request(request),
          ),
        };
      },
      finishPage: (
        state: any,
        action: PayloadAction<EndpointResponse<R>>,
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
          }),
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

  const actions = {
    clear: () => slice.actions.clear(undefined),
    fetchPage: (request: R) => slice.actions.fetchPage(request),
    fetchAllPages: () => slice.actions.fetchPage({ fetchAll: true }),
    finishPage: (response: EndpointResponse<R>) =>
      slice.actions.finishPage(response),
  };

  const reducer = slice.reducer;

  function* handleResponse({ request, response }: EndpointResponse<R>) {
    yield put(slice.actions.finishPage({ request, response }));

    const { fetchAll } = request;
    const { success, data } = response;
    if (fetchAll && success && data) {
      const { next } = data as PaginatedEndpointResponse;
      if (next) {
        yield put(
          slice.actions.fetchPage({
            ...request,
            url: next,
          }),
        );
      }
    }

    const { callback } = request;
    if (callback) {
      yield call(callback, response);
    }
  }

  function getPage(
    state: PaginatedEndpoint<P, E>,
    request: PaginatedEndpointRequest,
  ): PageEndpoint<P, E> {
    const pageKey = getKeyFromRequest(request);
    if (!state.isFilled) {
      return emptyEndpoint;
    }

    return state.pages[pageKey] ?? emptyEndpoint;
  }

  return {
    slice,
    actions,
    reducer,
    handleResponse,
    getPage,
  };
}
