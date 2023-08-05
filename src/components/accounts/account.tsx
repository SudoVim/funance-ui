import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { actions, selectors } from "features";
import { Box } from "@mui/material";
import { EndpointAlert } from "components/utils";

export type Props = {};

export const Account: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;

  if (!id) {
    throw new Error("Account component requires an 'id' parameter");
  }

  const request = useMemo(() => ({ id }), [id]);
  const endpoint = useSelector((state: any) =>
    selectors.holdings.accounts.get(state, request),
  );

  useEffect(() => {
    dispatch(actions.holdings.accounts.get.request(request));
    return () => {
      dispatch(actions.holdings.accounts.get.clear(request));
    };
  }, [dispatch, request]);

  const accountComponent = useMemo(() => {
    if (!endpoint.isFilled || !endpoint.success) {
      return null;
    }

    const account = endpoint.data;
    return <Box sx={{ typography: "h3" }}>{account.name}</Box>;
  }, [endpoint]);

  return (
    <>
      {accountComponent}
      <EndpointAlert endpoint={endpoint} />
    </>
  );
};
