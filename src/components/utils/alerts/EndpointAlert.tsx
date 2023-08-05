import React from "react";
import { Endpoint } from "features/api/endpoint";
import { Snackbar, Alert } from "@mui/material";
import { getError } from "features/api/request";

export type Props = {
  endpoint: Endpoint<unknown>;
  successMessage?: string;
  showSuccess?: boolean;
};

export const EndpointAlert: React.FC<Props> = ({
  endpoint,
  successMessage,
  showSuccess,
}) => {
  const message = endpoint.isFilled
    ? endpoint.success
      ? successMessage ?? "Success!"
      : getError(endpoint.errorData) ?? "An error occurred."
    : undefined;
  const open = Boolean(
    endpoint.isFilled &&
      (!endpoint.success || showSuccess || successMessage) &&
      message !== undefined,
  );
  const severity = endpoint.isFilled && endpoint.success ? "success" : "error";
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default EndpointAlert;
