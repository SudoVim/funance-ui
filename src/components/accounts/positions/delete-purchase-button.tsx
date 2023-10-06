import React, { useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { actions, selectors } from "features";
import { EndpointAlert } from "components/utils";

export type Props = {
  id: string;
};

export const DeletePurchaseButton: React.FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const request = useMemo(() => ({ id }), [id]);
  const endpoint = useSelector(
    selectors.holdings.accountPurchases.delete.get(request),
  );
  const disabled = !endpoint.isEmpty;

  const onClick = useCallback(() => {
    const callback = () => {
      dispatch(actions.holdings.accountPurchases.reload());
    };
    dispatch(
      actions.holdings.accountPurchases.delete.request({
        ...request,
        callback,
      }),
    );
  }, [dispatch, request]);

  useEffect(() => {
    return () => {
      dispatch(actions.holdings.accountPurchases.delete.clear(request));
    };
  }, [request]);

  return (
    <>
      <Button
        type="submit"
        variant="contained"
        onClick={onClick}
        color="error"
        disabled={disabled}
      >
        Delete
      </Button>
      <EndpointAlert endpoint={endpoint} />
    </>
  );
};
