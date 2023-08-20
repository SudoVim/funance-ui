import React, { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Fund } from "features/funds/types";
import { PaginatedTable, SimpleMenu } from "components/utils";
import { PaginatedEndpointRequest } from "features/api/endpoint";
import { selectors, endpoints, actions } from "features";
import { Box } from "@mui/material";

export type Props = {
  page?: number;
};

const HEADERS = [
  {
    key: "name",
    name: "Name",
  },
];

const MENU_ITEMS = [
  {
    key: "create",
    label: "Create Fund",
    link: "/app/funds/create",
  },
];

export const List: React.FC<Props> = ({ page }) => {
  const dispatch = useDispatch();
  const request = useMemo(() => ({ page }), [page]);

  const endpoint = useSelector(selectors.funds.list.endpoint);

  useEffect(() => {
    return () => {
      dispatch(actions.funds.list.clear());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(actions.funds.list.fetchPage(request));
  }, [dispatch, request]);

  const getRow = useCallback(
    (result: Fund) => ({
      key: result.id,
      link: `/app/funds/${result.id}`,
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
        rowGap: 1,
      }}
    >
      <SimpleMenu items={MENU_ITEMS} />
      <PaginatedTable<PaginatedEndpointRequest, Fund>
        page={page}
        slice={endpoints.funds.list}
        endpoint={endpoint}
        headers={HEADERS}
        getRow={getRow}
      />
    </Box>
  );
};
