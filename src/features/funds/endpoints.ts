import {
  EndpointRequest,
  createPaginatedEndpointSlice,
  createIndirectEndpointSlice,
  PaginatedEndpointRequest,
  createEndpointSlice,
} from "features/api/endpoint";
import { FundReference, Fund, FundAllocation } from "./types";

export type CreateFundRequest = EndpointRequest & {
  name: string;
  shares?: number;
};

export type ListFundsRequest = PaginatedEndpointRequest & {};

export type FundRequest = EndpointRequest & FundReference;

export function getFundKeyFromRequest({ id }: FundReference) {
  return id;
}

export type UpdateFundRequest = FundRequest & {
  name?: string;
  shares?: number;
};

export type ListFundAllocationsRequest = PaginatedEndpointRequest &
  FundReference;

export type FundAllocationReference = {
  id: string;
};

export type FundAllocationRequest = EndpointRequest & FundAllocationReference;

export function getFundAllocationKeyFromRequest({ id }: FundAllocationRequest) {
  return id;
}

export type UpdateFundAllocationRequest = FundRequest & {
  shares?: number;
};

export const endpoints = {
  create: createEndpointSlice<CreateFundRequest, Fund>({
    name: "funds.create",
  }),
  list: createPaginatedEndpointSlice<ListFundsRequest, Fund>({
    name: "funds.list",
  }),
  get: createIndirectEndpointSlice<FundRequest, Fund>({
    name: "funds.get",
    getKeyFromRequest: getFundKeyFromRequest,
  }),
  update: createIndirectEndpointSlice<UpdateFundRequest, Fund>({
    name: "funds.update",
    getKeyFromRequest: getFundKeyFromRequest,
  }),
  allocations: {
    list: createPaginatedEndpointSlice<
      ListFundAllocationsRequest,
      FundAllocation
    >({
      name: "funds.allocations.list",
    }),
    get: createIndirectEndpointSlice<FundAllocationRequest, Fund>({
      name: "funds.allocations.get",
      getKeyFromRequest: getFundAllocationKeyFromRequest,
    }),
    update: createIndirectEndpointSlice<
      UpdateFundAllocationRequest,
      FundAllocation
    >({
      name: "funds.allocations.update",
      getKeyFromRequest: getFundAllocationKeyFromRequest,
    }),
    delete: createIndirectEndpointSlice<FundAllocationRequest>({
      name: "funds.allocations.delete",
      getKeyFromRequest: getFundAllocationKeyFromRequest,
    }),
  },
};
