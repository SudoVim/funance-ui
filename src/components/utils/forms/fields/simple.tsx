import React from "react";
import { TextField } from "@mui/material";

export type Props = {
  label: string;
  onChange: (value: string) => void;
};

export const SimpleField: React.FC<Props> = ({ label, onChange }) => {
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      autoFocus
      fullWidth
    />
  );
};
