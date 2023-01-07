import React from "react";
import { Button } from "@mui/material";

export type Props = {
  disabled: boolean;
  onClick?: () => void;
  text: string;
};

export const Submit: React.FC<Props> = ({ disabled, onClick, text }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default Submit;
