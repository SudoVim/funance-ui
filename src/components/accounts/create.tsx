import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions, selectors } from "features";
import { FormGrid, Submit } from "components/utils/forms";
import { EndpointAlert } from "components/utils/alerts";
import { useNavigate } from "react-router";

export type Props = {};

export const Create: React.FC<Props> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createState = useSelector(selectors.holdings.accounts.create);

  const [name, setName] = useState("");
  const createDisabled = !createState.isEmpty || !name;

  useEffect(() => {
    return () => {
      dispatch(actions.holdings.accounts.create.clear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!createState.isFilled || !createState.success) {
      return;
    }

    const { data: account } = createState;
    navigate(`/app/accounts/${encodeURIComponent(account.id)}`);
  }, [createState]);

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
          dispatch(actions.holdings.accounts.create.request({ name }));
        }}
      >
        <FormGrid>
          <Typography variant="h3" color={theme.palette.text.primary}>
            Create Holding Account
          </Typography>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Submit disabled={createDisabled} text="Create" />
        </FormGrid>
      </form>
      <EndpointAlert endpoint={createState} successMessage="Account created!" />
    </Box>
  );
};
