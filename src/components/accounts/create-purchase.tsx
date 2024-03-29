import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "features";
import {
  Box,
  useTheme,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { FormGrid, Submit, EndpointAlert } from "components/utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

export type Props = {};

export const CreatePurchase: React.FC<Props> = ({}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector(selectors.holdings.accounts.current);
  const endpoint = useSelector(
    selectors.holdings.accounts.currentCreatePurchase,
  );

  if (!account || !endpoint) {
    throw new Error(
      "CreatePurchase can only be used with a current account configured",
    );
  }

  useEffect(() => {
    return () => {
      dispatch(
        actions.holdings.accounts.createPurchase.clear({ account: account.id }),
      );
    };
  }, [dispatch, account.id]);

  useEffect(() => {
    if (!endpoint.isFilled || !endpoint.success) {
      return;
    }

    dispatch(
      actions.holdings.accountPurchases.list.fetchPage({
        holdingAccountId: account.id,
        fetchAll: true,
      }),
    );
    navigate(`/app/accounts/${encodeURIComponent(account.id)}`);
  }, [endpoint, account.id]);

  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [purchasedAt, setPurchasedAt] = useState<string>(dayjs().toISOString());
  const createDisabled =
    ticker === "" ||
    quantity === 0 ||
    price === 0 ||
    purchasedAt === "" ||
    endpoint.isLoading;
  const purchasedAtDate = useMemo(() => dayjs(purchasedAt), [purchasedAt]);

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

          dispatch(
            actions.holdings.accounts.createPurchase.request({
              account: account.id,
              ticker,
              quantity,
              price,
              purchasedAt,
            }),
          );
        }}
      >
        <FormGrid>
          <Box sx={{ typography: "h3" }} color={theme.palette.text.primary}>
            Add Purchase
          </Box>
          <TextField
            id="outlined-basic"
            label="Ticker"
            variant="outlined"
            onChange={(e) => setTicker(e.target.value)}
            autoFocus
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-quantity">
              Quantity
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-quantity"
              startAdornment={
                <InputAdornment position="start">#</InputAdornment>
              }
              label="Quantity"
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-price">Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-price"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Price"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </FormControl>
          <DatePicker
            value={purchasedAtDate}
            onChange={(newPurchasedAt) =>
              setPurchasedAt(newPurchasedAt?.toISOString() || "")
            }
          />
          <Submit text="Create" disabled={createDisabled} />
        </FormGrid>
      </form>
      <EndpointAlert endpoint={endpoint} successMessage="Account created!" />
    </Box>
  );
};
