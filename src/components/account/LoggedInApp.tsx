import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions, selectors } from "features";
import { Outlet } from "react-router-dom";

export type Props = {};

export const LoggedInApp: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const accountEndpoint = useSelector(selectors.account.account);

  useEffect(() => {
    dispatch(actions.account.requireAccount());
  }, [dispatch]);

  if (!accountEndpoint.isFilled) {
    return null;
  }

  return <Outlet />;
};
