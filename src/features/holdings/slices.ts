import { createModalSlice } from "features/modals";

export const slices = {
  accounts: {
    create: createModalSlice({ name: "holdings.accounts.create-modal" }),
  },
};
