import React from "react";
import { Grid } from "@mui/material";

export type Props = {
  children: React.ReactNode[];
};

export const FormGrid: React.FC<Props> = ({ children }) => {
  return (
    <Grid container spacing={2} p={2}>
      {children.map((child: React.ReactNode, i: number) => (
        <Grid item xs={12} key={i}>
          <Grid container justifyContent="center" alignItems="center">
            {child}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default FormGrid;
