import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIAuth, apiAuth, setAuth } from "./request";

export type APIState = {
  auth: APIAuth;
};

const initialState: APIState = { auth: apiAuth };

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setAuth: (state: APIState, action: PayloadAction<APIAuth>) => {
      const { payload } = action;
      setAuth(payload);
      state.auth = payload;
    },
  },
});

export const { actions } = apiSlice;

export const selectors = {
  hasAuth: (state: any) => Boolean(state.api.auth.token),
};
