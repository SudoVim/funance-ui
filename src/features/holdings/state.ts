import { combineReducers } from "redux";
import { endpoints } from "./endpoints";

export const state = combineReducers({
  accounts: combineReducers({
    list: endpoints.accounts.list.reducer,
    get: endpoints.accounts.get.reducer,
    create: endpoints.accounts.create.reducer,
  }),
});
