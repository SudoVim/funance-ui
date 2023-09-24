import React, { ReactNode, useCallback } from "react";
import {
  Box,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material";

export type Row = {
  key: string;
  link?: string;
  cells: Record<string, ReactNode>;
};

export type Header = {
  key: string;
  name: string;
};

export type Props<T> = {
  results: T[];
  headers: Header[];
  getRow: (result: T) => Row;
};

export function Table<T>({ results, headers, getRow }: Props<T>) {
  const theme = useTheme();

  if (headers.length === 0) {
    throw new Error("unexpectedly received empty headers array");
  }

  const renderRow = useCallback(
    (result: T) => {
      const { key, link, cells } = getRow(result);
      const tableCells = headers.map(({ key: headerKey }) => {
        const cell = cells[headerKey] ?? undefined;
        if (!link) {
          return <TableCell key={headerKey}>{cell}</TableCell>;
        }

        return (
          <TableCell key={headerKey}>
            <RouterLink
              to={link}
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {cell}
            </RouterLink>
          </TableCell>
        );
      });

      return <TableRow key={key}>{tableCells}</TableRow>;
    },
    [getRow, headers],
  );

  if (results.length === 0) {
    return <Box sx={{ typography: "body2" }}>No results</Box>;
  }

  return (
    <TableContainer component={Paper}>
      <MUITable>
        <TableHead>
          <TableRow>
            {headers.map(({ key, name }) => (
              <TableCell key={key}>
                <Box sx={{ typography: "body2", fontWeight: "bold" }}>
                  {name}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{results.map(renderRow)}</TableBody>
      </MUITable>
    </TableContainer>
  );
}
