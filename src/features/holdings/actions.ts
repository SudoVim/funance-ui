import { endpoints } from "./endpoints";
import { current, currentPosition } from "./state";

export const actions = {
  accounts: {
    list: endpoints.accounts.list.actions,
    get: endpoints.accounts.get.actions,
    create: endpoints.accounts.create.actions,
    createPurchase: endpoints.accounts.createPurchase.actions,
    current: current.actions,
  },
  accountPurchases: {
    list: endpoints.accountPurchases.list.actions,
  },
  positions: {
    current: currentPosition.actions,
  },
};
