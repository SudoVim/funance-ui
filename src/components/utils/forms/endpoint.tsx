import React, { useEffect, ReactNode, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions } from "features";
import { EndpointAlert } from "components/utils/alerts";
import { Submit } from "./Submit";
import { FormGrid } from "./FormGrid";

export type Props<R extends EndpointRequest, T = unknown> = {
  endpoint: Endpoint<T>;
  children?: ReactNode | ReactNode[];
  submitDisabled?: boolean;
  slice: EndpointSlice<R, P>;
  request: R;
  successMessage?: string;
  submitText?: string;
};

export function EndpointForm<R extends EndpointRequest, T = unknown>({
  endpoint,
  children,
  submitDisabled,
  slice,
  request,
  successMessage,
  submitText,
}: Props<T>) {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(slice.actions.clear());
    };
  }, [dispatch]);

  const submit = useMemo(() => {
    return (
      <Submit
        key="submit"
        disabled={submitDisabled || endpoint.isLoading}
        text={submitText ?? "Submit"}
      />
    );
  }, [submitDisabled, endpoint.isLoading, submitText]);
  const formElements = useMemo(() => {
    if (!children) {
      return submit;
    }

    if (!Array.isArray(children)) {
      return [children, submit];
    }

    return [...children, submit];
  }, [children, submit]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "600px",
        justifyContent: "center",
        alignItems: "center",
        background: theme.palette.background.paper,
        border: "1px solid grey",
        borderRadius: "10px",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(slice.actions.request(request));
        }}
      >
        <FormGrid>{formElements}</FormGrid>
      </form>
      <EndpointAlert endpoint={endpoint} successMessage={successMessage} />
    </Box>
  );
}
