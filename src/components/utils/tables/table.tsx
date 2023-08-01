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

export type Row = {
  key: string;
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
  if (headers.length === 0) {
    throw new Error("unexpectedly received empty headers array");
  }

  if (results.length === 0) {
    return <Box sx={{ typography: "body2" }}>No results</Box>;
  }

  const renderRow = useCallback(
    (result: T) => {
      const { key, cells } = getRow(result);
      return (
        <TableRow key={key}>
          {headers.map(({ key: headerKey }) => {
            const cell = cells[headerKey] ?? undefined;
            return <TableCell key={headerKey}>{cell}</TableCell>;
          })}
        </TableRow>
      );
    },
    [getRow, headers],
  );

  return (
    <TableContainer component={Paper}>
      <MUITable>
        <TableHead>
          {headers.map(({ key, name }) => (
            <TableCell key={key}>
              <Box sx={{ typography: "body2", fontWeight: "bold" }}>{name}</Box>
            </TableCell>
          ))}
        </TableHead>
        <TableBody>{results.map(renderRow)}</TableBody>
      </MUITable>
    </TableContainer>
  );
}
