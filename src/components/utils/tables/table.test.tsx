import React from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { shallow } from "enzyme";
import { TableHead, TableCell, TableBody, TableRow } from "@mui/material";

import { Table } from "./table";

describe("Table tests", () => {
  let props = null;
  beforeEach(() => {
    props = {
      results: [],
      headers: [],
      getRow: vi.fn(),
    };
  });
  it("renders the component with no headers", () => {
    expect(() => {
      shallow(<Table {...props} />);
    }).toThrowError("unexpectedly received empty headers array");
  });
  it("renders the component with empty results", () => {
    props.headers = [{ key: "a", name: "Column A" }];
    const component = shallow(<Table {...props} />);
    expect(component.text()).toEqual("No results");
  });
  it("renders a row with no cells", () => {
    props.headers = [{ key: "a", name: "Column A" }];
    props.getRow = (result: string) => {
      expect(result).toEqual("Result A");
      return {
        key: "1",
        cells: {},
      };
    };
    props.results = ["Result A"];
    const component = shallow(<Table {...props} />);
    const headers = component.find(TableHead);
    expect(headers).toHaveLength(1);
    const headerCells = headers.find(TableCell);
    expect(headerCells).toHaveLength(1);
    expect(headerCells.at(0).key()).toEqual("a");
    expect(headerCells.at(0).text()).toEqual("Column A");

    const body = component.find(TableBody);
    expect(body).toHaveLength(1);
    const bodyRows = body.find(TableRow);
    expect(bodyRows).toHaveLength(1);
    expect(bodyRows.at(0).key()).toEqual("1");
    const rowCells = bodyRows.at(0).find(TableCell);
    expect(rowCells).toHaveLength(1);
    expect(rowCells.at(0).key()).toEqual("a");
    expect(rowCells.at(0).text()).toEqual("");
  });
  it("renders a row with cells", () => {
    props.headers = [{ key: "a", name: "Column A" }];
    props.getRow = (result: string) => {
      expect(result).toEqual("Result A");
      return {
        key: "1",
        cells: {
          a: result,
        },
      };
    };
    props.results = ["Result A"];
    const component = shallow(<Table {...props} />);
    const headers = component.find(TableHead);
    expect(headers).toHaveLength(1);
    const headerCells = headers.find(TableCell);
    expect(headerCells).toHaveLength(1);
    expect(headerCells.at(0).key()).toEqual("a");
    expect(headerCells.at(0).text()).toEqual("Column A");

    const body = component.find(TableBody);
    expect(body).toHaveLength(1);
    const bodyRows = body.find(TableRow);
    expect(bodyRows).toHaveLength(1);
    expect(bodyRows.at(0).key()).toEqual("1");
    const rowCells = bodyRows.at(0).find(TableCell);
    expect(rowCells).toHaveLength(1);
    expect(rowCells.at(0).key()).toEqual("a");
    expect(rowCells.at(0).text()).toEqual("Result A");
  });
});
