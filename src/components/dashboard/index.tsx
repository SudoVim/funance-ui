import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectors } from "features";
import { useNavigate } from "react-router";

export type Props = {};

export const Dashboard: React.FC<Props> = () => {
  const navigate = useNavigate();
  const hasAuth = useSelector(selectors.api.hasAuth);

  useEffect(() => {
    if (!hasAuth) {
      navigate("/login");
    }
  }, [hasAuth, navigate]);

  return <div>Dashboard!</div>;
};

export default Dashboard;
