import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export type AccountState = {
  isLoggedIn: boolean;
};

const initialState: AccountState = {
  isLoggedIn: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
});

export const selectors = {
  isLoggedIn: (state: RootState) => state.account.isLoggedIn,
  state: (state: RootState) => state.account,
};

export default accountSlice.reducer;
