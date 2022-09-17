import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export type AccountState = {
  initialized: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
};

const initialState: AccountState = {
  initialized: false,
  isLoggingIn: false,
  isLoggedIn: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    getAccount: (state) => {},
  },
});

export const selectors = {
  isLoggedIn: (state: RootState) => state.account.isLoggedIn,
  state: (state: RootState) => state.account,
};

export default accountSlice.reducer;
