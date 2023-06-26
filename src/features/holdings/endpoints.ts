import { createEndpointSlice } from "features/api/endpoint";

export type ListRequest = {};

type Holding = {
  id: string;
  name: string;
  currency: string;
  available_cash: number;
};

export const endpoints = {
  accounts: {
    list: createEndpointSlice<ListRequest, Holding>("holdings.accounts.list"),
  },
};
