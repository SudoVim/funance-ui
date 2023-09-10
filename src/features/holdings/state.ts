import { combineReducers } from "redux";
import { endpoints } from "./endpoints";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentState, AccountRequest } from "./types";

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
  accountPurchases: combineReducers({
    list: endpoints.accountPurchases.list.reducer,
  }),
});
