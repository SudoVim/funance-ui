import React from "react";
import {
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

export type Props = {
  id: string;
  label: string;
  adornment: string;
  value: any;
  onChange: (value: string) => void;
};

export const AdornedField: React.FC<Props> = ({
  id,
  label,
  adornment,
  value,
  onChange,
}) => {
  const adornmentID = `outlined-adornment-${id}`;
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={adornmentID}>Total Shares</InputLabel>
      <OutlinedInput
        id={adornmentID}
        startAdornment={
          <InputAdornment position="start">{adornment}</InputAdornment>
        }
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
};
