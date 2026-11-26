import * as React from "react";

const internals = (
  React as unknown as {
    __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: {
      H: object | null;
    };
  }
).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

(
  globalThis as {
    __FUNANCE_REACT_INTERNALS__?: { H: object | null };
  }
).__FUNANCE_REACT_INTERNALS__ = internals;
