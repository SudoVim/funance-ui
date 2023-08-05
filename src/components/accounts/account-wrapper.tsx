import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { actions, selectors } from "features";
import { EndpointAlert } from "components/utils";
import { Outlet } from "react-router-dom";

export type Props = {};

export const AccountWrapper: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;

  if (!id) {
    throw new Error("AccountWrapper component requires an 'id' parameter");
  }

  const request = useMemo(() => ({ id }), [id]);
  const endpoint = useSelector((state: any) =>
    selectors.holdings.accounts.get(state, request),
  );

  useEffect(() => {
    dispatch(actions.holdings.accounts.get.request(request));
    dispatch(actions.holdings.accounts.current.setCurrentAccount(request));
    return () => {
      dispatch(actions.holdings.accounts.get.clear(request));
      dispatch(actions.holdings.accounts.current.setCurrentAccount(undefined));
    };
  }, [dispatch, request]);

  return (
    <>
      {endpoint.isFilled && endpoint.success ? <Outlet /> : null}
      <EndpointAlert endpoint={endpoint} />
    </>
  );
};
