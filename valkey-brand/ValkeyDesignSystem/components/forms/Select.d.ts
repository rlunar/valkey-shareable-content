import type * as React from "react";

/** Native select styled to the website's blog type filter: 8px radius, #AAA border, 13px label. */
export interface SelectOption { value: string; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: (string | SelectOption)[];
  label?: string;
}
export function Select(props: SelectProps): JSX.Element;
