import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export type APIAuth = {
  token?: string;
  expiry?: string;
};

export type APIState = {
  auth: APIAuth;
};

const initialState: APIState = {
  auth: {
    token: localStorage.getItem("auth.token", undefined),
    expiry: localStorage.getItem("auth.expiry", undefined),
  },
};

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setAuth: (state: APIState, action: PayloadAction<APIAuth>) => {
      const { payload } = action;
      localStorage.setItem("auth.token", payload.token);
      localStorage.setItem("auth.expiry", payload.expiry);
      state.auth = payload;
    },
  },
});

export const selectors = {
  hasAuth: (state: RootState) => Boolean(state.api.auth.token),
};
