import React from "react";
import { Endpoint, DefaultError } from "features/api/endpoint";
import { Snackbar, Alert } from "@mui/material";

export type Props = {
  endpoint: Endpoint<unknown, DefaultError>;
  successMessage?: string;
};

export const EndpointAlert: React.FC<Props> = ({
  endpoint,
  successMessage,
}) => {
  const message = endpoint.isFilled
    ? endpoint.success
      ? successMessage
      : endpoint.errorData.non_field_errors?.[0]
    : undefined;
  const open = endpoint.isFilled && message !== undefined;
  const severity = endpoint.isFilled && endpoint.success ? "success" : "error";
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      message="Note archived"
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
