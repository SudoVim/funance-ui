import React, { useCallback, useMemo } from "react";
import { Grid } from "@mui/material";

export type Item = {
  key: string;
  element: React.ReactNode;
};

export type Props = {
  children?: React.ReactNode | React.ReactNode[];
  items?: Item[];
};

export const FormGrid: React.FC<Props> = ({ children, items }) => {
  if (!children && !items) {
    return null;
  }

  const renderItems = useCallback((items: Item[]) => {
    return items.map(({ key, element }: Item) => (
      <Grid item xs={12} key={key}>
        <Grid container justifyContent="center" alignItems="center">
          {element}
        </Grid>
      </Grid>
    ));
  }, []);

  const childItems = useMemo(() => {
    if (!children) {
      return undefined;
    }

    if (!Array.isArray(children)) {
      return [
        {
          key: "0",
          element: children,
        },
      ];
    }

    return children.map((child, i) => ({
      key: i.toString(),
      element: child,
    }));
  }, [children]);

  const renderInner = useCallback(() => {
    if (items) {
      return renderItems(items);
    }

    if (childItems) {
      return renderItems(childItems);
    }

    return null;
  }, [items, childItems]);

  return (
    <Grid container spacing={2} p={2}>
      {renderInner()}
    </Grid>
  );
};

export default FormGrid;
