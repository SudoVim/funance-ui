import { combineReducers } from "redux";
import { endpoints } from "./endpoints";

export const state = combineReducers({
  create: endpoints.create.reducer,
  list: endpoints.list.reducer,
  get: endpoints.get.reducer,
  update: endpoints.update.reducer,
  allocations: combineReducers({
    list: endpoints.allocations.list.reducer,
    get: endpoints.allocations.get.reducer,
    update: endpoints.allocations.update.reducer,
    delete: endpoints.allocations.delete.reducer,
  }),
});
