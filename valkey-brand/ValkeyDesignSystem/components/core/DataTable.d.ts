import type * as React from "react";

/** Comparison / reference table with an indigo high-emphasis header, subtle alternating rows and optional sticky first column. */
export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: React.ReactNode[];
  rows?: React.ReactNode[][];
  /** indigo = ValkeyPurpleIndigo header with white text; neutral = the website's grey #F4F4F4 header */
  emphasis?: "indigo" | "neutral";
  stickyFirstColumn?: boolean;
}
export function DataTable(props: DataTableProps): JSX.Element;
