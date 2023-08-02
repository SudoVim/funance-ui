import React, { useMemo, useCallback } from "react";
import { EndpointAlert } from "components/utils/alerts";
import {
  PaginatedEndpointRequest,
  PaginatedEndpointSlice,
  PaginatedEndpoint,
} from "features/api/endpoint";
import { Table, Row, Header } from "./table";

export type Props<R extends PaginatedEndpointRequest, P = undefined> = {
  page?: number;
  baseRequest?: R;
  slice: PaginatedEndpointSlice<R, P>;
  endpoint: PaginatedEndpoint<P>;
  headers: Header[];
  getRow: (result: P) => Row;
};

export function PaginatedTable<
  R extends PaginatedEndpointRequest,
  P = undefined,
>({ page, baseRequest, slice, endpoint, headers, getRow }: Props<R, P>) {
  const request = useMemo(
    () => ({ ...(baseRequest ?? {}), page }),
    [baseRequest, page],
  );
  const pageEndpoint = slice.getPage(endpoint, request);

  if (!endpoint.isFilled) {
    return null;
  }

  const renderTable = useCallback(() => {
    if (!pageEndpoint.isFilled || !pageEndpoint.success) {
      return null;
    }

    const results = pageEndpoint.data.results;
    return <Table<P> results={results} headers={headers} getRow={getRow} />;
  }, [pageEndpoint, headers, getRow]);

  // TODO: Render page buttons

  return (
    <>
      {renderTable()}
      <EndpointAlert endpoint={pageEndpoint} />
    </>
  );
}
