import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions, selectors } from "features";
import { useNavigate } from "react-router";

export type Props = {};

export const Dashboard: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasAuth = useSelector(selectors.api.hasAuth);
  const accountEndpoint = useSelector(selectors.account.account);

  useEffect(() => {
    if (!hasAuth) {
      navigate("/login");
      return;
    }
  }, [hasAuth, navigate]);

  useEffect(() => {
    dispatch(actions.account.requireAccount());
  }, [dispatch]);

  useEffect(() => {
    if (accountEndpoint?.isFilled && accountEndpoint.success) {
      dispatch(actions.holdings.accounts.list.request({}));
    }
  }, [dispatch, accountEndpoint]);

  if (!accountEndpoint.isFilled) {
    return null;
  }

  return <div>Dashboard!</div>;
};

export default Dashboard;
