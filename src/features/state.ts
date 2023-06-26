import { state as api } from "./api";
import { state as account } from "./account";
import { state as holdings } from "./holdings";

// This value will be thrown into configureStore, which takes an object and not
// a store itself with "combineReducers".
export const state = {
  api,
  account,
  holdings,
};
