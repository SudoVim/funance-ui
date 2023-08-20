import React from "react";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type MenuItem = {
  key: string;
  label: string | React.ReactNode;
  link: string;
};

export type Props = {
  items: MenuItem[];
};

export const SimpleMenu: React.FC<Props> = ({ items }: Props) => {
  return (
    <Box sx={{ maxWidth: 100 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
          alignItems: "center",
        }}
      >
        {items.map(({ key, label, link }: MenuItem) => (
          <RouterLink key={key} to={link}>
            <Button type="submit" variant="contained">
              {label}
            </Button>
          </RouterLink>
        ))}
      </Box>
    </Box>
  );
};
