import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions, selectors } from "features";
import { PaginatedTable } from "components/utils";
import { PaginatedEndpointRequest } from "features/api/endpoint";
import { HoldingAccount } from "features/holdings/types";
import { endpoints } from "features";

export type Props = {
  page?: number;
};

const HEADERS = [
  {
    key: "name",
    name: "Name",
  },
];

export const List: React.FC<Props> = ({ page }: Props) => {
  const dispatch = useDispatch();
  const request = useMemo(() => ({ page }), [page]);

  const accountsEndpoint = useSelector(
    selectors.holdings.accounts.list.endpoint,
  );

  useEffect(() => {
    return () => {
      dispatch(actions.holdings.accounts.list.clear());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(actions.holdings.accounts.list.fetchPage(request));
  }, [dispatch, request]);

  const getRow = useCallback(
    (result: HoldingAccount) => ({
      key: result.id,
      link: `/app/accounts/${result.id}`,
      cells: {
        name: result.name,
      },
    }),
    [],
  );

  return (
    <PaginatedTable<PaginatedEndpointRequest, HoldingAccount>
      page={page}
      slice={endpoints.holdings.accounts.list}
      endpoint={accountsEndpoint}
      headers={HEADERS}
      getRow={getRow}
    />
  );
};
