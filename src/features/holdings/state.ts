import { combineReducers } from "redux";
import { endpoints } from "./endpoints";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CurrentState,
  AccountRequest,
  Ticker,
  CurrentPositionState,
} from "./types";

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

export const currentPosition = createSlice({
  name: "holdings.accounts.positions.current",
  initialState: {},
  reducers: {
    setCurrentPosition: (
      state: CurrentPositionState,
      { payload: currentPosition }: PayloadAction<Ticker | undefined>,
    ) => {
      state.currentPosition = currentPosition;
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
    get: endpoints.accountPurchases.get.reducer,
    delete: endpoints.accountPurchases.delete.reducer,
  }),
  positions: combineReducers({
    current: currentPosition.reducer,
  }),
});
