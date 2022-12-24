import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIResponse, DefaultError } from "./request";

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

export const initialEndpoint: Endpoint = emptyEndpoint;

export function createEndpointSlice<
  R = undefined,
  T = undefined,
  E = DefaultError
>(name: string) {
  return createSlice({
    name,
    initialState: initialEndpoint,
    reducers: {
      clear: (state: any): Endpoint<T, E> => emptyEndpoint,
      request: (state: any, action: PayloadAction<R>): Endpoint<T, E> =>
        loadingEndpoint,
      finish: (
        state: any,
        action: PayloadAction<APIResponse>
      ): Endpoint<T, E> => {
        const { payload: response } = action;
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
