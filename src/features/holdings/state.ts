import { combineReducers } from "redux";
import { endpoints, AccountRequest } from "./endpoints";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CurrentState = {
  currentAccount?: AccountRequest;
};

export const current = createSlice({
  name: "holdings.accounts.current",
  initialState: {},
  reducers: {
    setCurrentAccount: (
      state: CurrentState,
      { payload: currentAccount }: PayloadAction<AccountRequest | undefined>,
    ) => {
      state.currentAccount = currentAccount;
    },
  },
});

export const state = combineReducers({
  accounts: combineReducers({
    list: endpoints.accounts.list.reducer,
    get: endpoints.accounts.get.reducer,
    create: endpoints.accounts.create.reducer,
    createPurchase: endpoints.accounts.createPurchase.reducer,
    current: current.reducer,
  }),
});
