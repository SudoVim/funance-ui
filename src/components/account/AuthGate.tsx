import React, { useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors } from "features";
import { useNavigate } from "react-router";

export type Props = {
  redirectHasAuth?: boolean;
  children?: ReactNode | ReactNode[];
};

export const AuthGate: React.FC<Props> = ({
  redirectHasAuth,
  children,
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasAuth = useSelector(selectors.api.hasAuth);

  useEffect(() => {
    if (!hasAuth) {
      navigate("/login");
      return;
    }

    if (redirectHasAuth) {
      navigate(redirectHasAuth);
    }
  }, [redirectHasAuth, hasAuth, navigate]);

  // If we're expecting the "useEffect" above to redirect, don't render
  // anything.
  if (!hasAuth || redirectHasAuth) {
    return null;
  }

  return children;
};
