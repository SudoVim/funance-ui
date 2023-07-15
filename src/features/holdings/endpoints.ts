import {
  createPaginatedEndpointSlice,
  PaginatedEndpointRequest,
} from "features/api/endpoint";

export type ListRequest = PaginatedEndpointRequest & {};

type Holding = {
  id: string;
  name: string;
  currency: string;
  available_cash: number;
};

export const endpoints = {
  accounts: {
    list: createPaginatedEndpointSlice<ListRequest, Holding>({
      name: "holdings.accounts.list",
    }),
  },
};
