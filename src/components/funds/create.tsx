import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { endpoints, selectors } from "features";
import { EndpointForm, SimpleField, AdornedField } from "components/utils";
import { useNavigate } from "react-router";
import { Fund } from "features/funds/types";
import { APIResponse } from "features/api/request";

export type Props = {};

export const Create: React.FC<Props> = ({}) => {
  const navigate = useNavigate();

  const endpoint = useSelector(selectors.funds.create);

  const [name, setName] = useState("");
  const [sharesRaw, setSharesRaw] = useState("1000");
  const shares = useMemo(() => parseInt(sharesRaw), [sharesRaw]);
  const callback = useCallback(
    ({ success, data }: APIResponse) => {
      if (!success) {
        return;
      }

      const fund = data as Fund;
      navigate(`/app/funds/${encodeURIComponent(fund.id)}`);
    },
    [navigate],
  );
  const request = useMemo(() => {
    return {
      name,
      shares,
      callback,
    };
  }, [name, shares, callback]);
  const submitDisabled = !name || isNaN(shares);

  return (
    <EndpointForm
      endpoint={endpoint}
      submitDisabled={submitDisabled}
      slice={endpoints.funds.create}
      request={request}
      successMessage="Fund created!"
      submitText="Create Fund"
    >
      <Box key="title" sx={{ typography: "h3" }}>
        Create Fund
      </Box>
      <SimpleField
        key="name"
        label="Name"
        onChange={(newName) => setName(newName)}
      />
      <AdornedField
        key="shares"
        id="shares"
        label="Total Shares"
        adornment="#"
        value={sharesRaw}
        onChange={(newShares) => {
          setSharesRaw(newShares);
        }}
      />
    </EndpointForm>
  );
};
