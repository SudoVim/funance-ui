import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { actions, selectors } from "features";
import { EndpointAlert } from "components/utils";
import { Outlet } from "react-router-dom";

export type Props = {};

export const FundWrapper: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;

  if (!id) {
    throw new Error("FundWrapper component requires an 'id' parameter");
  }

  const request = useMemo(() => ({ id }), [id]);
  const endpoint = useSelector(selectors.funds.get(request));

  useEffect(() => {
    dispatch(actions.funds.get.request(request));
    dispatch(actions.funds.current.setCurrentFund(request));
    return () => {
      dispatch(actions.funds.get.clear(request));
      dispatch(actions.funds.current.setCurrentFund(undefined));
    };
  }, [dispatch, request]);

  return (
    <>
      {endpoint.isFilled && endpoint.success ? <Outlet /> : null}
      <EndpointAlert endpoint={endpoint} />
    </>
  );
};
