import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { actions, selectors } from "features";
import { Outlet } from "react-router-dom";

export type Props = {};

export const PositionWrapper: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { symbol } = params;

  if (!symbol) {
    throw new Error("PositionWrapper component requires a 'symbol' parameter");
  }

  const position = useSelector(selectors.holdings.positions.current);

  useEffect(() => {
    dispatch(actions.holdings.positions.current.setCurrentPosition({ symbol }));
    return () => {
      dispatch(
        actions.holdings.positions.current.setCurrentPosition(undefined),
      );
    };
  }, [dispatch, symbol]);

  return <>{position ? <Outlet /> : null}</>;
};
