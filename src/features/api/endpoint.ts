import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIResponse } from "./request";

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

export type Endpoint<T, E = unknown> =
  | EmptyEndpoint
  | LoadingEndpoint
  | FilledEndpoint<T, E>;

export type EndpointAction<R> = PayloadAction<R>;

export const emptyEndpoint = {
  isEmpty: true,
  isLoading: false,
  isFilled: false,
};

export const loadingEndpoint = {
  isEmpty: false,
  isLoading: true,
  isFilled: false,
};

const filledEndpoint = {
  isEmpty: false,
  isLoading: false,
  isFilled: true,
};

export const initialEndpoint = emptyEndpoint;

export function createEndpointSlice<R>(name: string) {
  return createSlice({
    name,
    initialState: initialEndpoint,
    reducers: {
      clear: (state, action: PayloadAction<R>) => emptyEndpoint,
      request: (state, action: PayloadAction<R>) => loadingEndpoint,
      finish: (state, action: PayloadAction<APIResponse>) => {
        const { payload: response } = action;
        if (!response.success) {
          return {
            ...filledEndpoint,
            success: false,
            errorData: response.data,
          };
        }

        return {
          ...filledEndpoint,
          success: true,
          data: response.data,
        };
      },
    },
  });
}
