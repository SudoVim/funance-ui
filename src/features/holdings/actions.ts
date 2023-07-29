import { endpoints } from "./endpoints";

export const actions = {
  accounts: {
    list: endpoints.accounts.list.actions,
    create: endpoints.accounts.create.actions,
  },
  account_purchases: {
    list: endpoints.account_purchases.list.actions,
  },
};
