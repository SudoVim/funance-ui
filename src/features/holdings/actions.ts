import { endpoints } from "./endpoints";

export const actions = {
  accounts: {
    list: endpoints.accounts.list.actions,
  },
  account_purchases: {
    list: endpoints.account_purchases.list.actions,
  },
};
