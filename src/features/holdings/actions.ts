import { endpoints } from "./endpoints";
import { current } from "./state";

export const actions = {
  accounts: {
    list: endpoints.accounts.list.actions,
    get: endpoints.accounts.get.actions,
    create: endpoints.accounts.create.actions,
    current: current.actions,
  },
  account_purchases: {
    list: endpoints.account_purchases.list.actions,
  },
};
