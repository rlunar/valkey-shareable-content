import type * as React from "react";

/** Docs breadcrumb strip: white 20px-radius bar, #2054B2 underlined links, caret-right.svg separators. */
export interface BreadcrumbItem { label: string; href?: string }
export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  caretSrc?: string;
}
export function Breadcrumbs(props: BreadcrumbsProps): JSX.Element;
