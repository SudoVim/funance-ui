import { endpoints } from "./endpoints";
import { slices } from "./slices";

export const actions = {
  list: endpoints.list.actions,
  get: endpoints.get.actions,
  current: slices.current.actions,
};
