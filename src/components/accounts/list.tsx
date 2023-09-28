import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions, selectors } from "features";
import { PaginatedTable, SimpleMenu } from "components/utils";
import { PaginatedEndpointRequest } from "features/api/endpoint";
import { HoldingAccount } from "features/holdings/types";
import { endpoints } from "features";
import { Box } from "@mui/material";

export type Props = {
  page?: number;
};

const MENU_ITEMS = [
  {
    key: "create",
    label: "Create Account",
    link: "/app/accounts/create",
  },
];

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 2,
      }}
    >
      <SimpleMenu items={MENU_ITEMS} />
      <PaginatedTable<PaginatedEndpointRequest, HoldingAccount>
        page={page}
        slice={endpoints.holdings.accounts.list}
        endpoint={accountsEndpoint}
        headers={HEADERS}
        getRow={getRow}
      />
    </Box>
  );
};
