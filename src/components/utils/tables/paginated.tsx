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

  const results = useMemo(() => {
    if (!pageEndpoint.isFilled || !pageEndpoint.success) {
      return undefined;
    }

    return pageEndpoint.data.results;
  }, [pageEndpoint]);

  const renderTable = useCallback(() => {
    if (results === undefined) {
      return null;
    }

    return <Table<P> results={results} headers={headers} getRow={getRow} />;
  }, [results, headers, getRow]);

  // TODO: Render page buttons

  return (
    <>
      {renderTable()}
      <EndpointAlert endpoint={pageEndpoint} />
    </>
  );
}
