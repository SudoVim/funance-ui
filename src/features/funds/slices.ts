import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentState, FundReference } from "./types";

export const slices = {
  current: createSlice({
    name: "funds.current",
    initialState: {},
    reducers: {
      setCurrentFund: (
        state: CurrentState,
        { payload: currentFund }: PayloadAction<FundReference | undefined>,
      ) => {
        state.currentFund = currentFund;
      },
    },
  }),
};
