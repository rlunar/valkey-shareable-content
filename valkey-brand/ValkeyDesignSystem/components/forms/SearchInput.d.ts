import type * as React from "react";

/** Pill search field used above the command reference and topic lists. Border turns ValkeyBlueAura on focus. */
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  /** md = 14px/10px padding (commands page); lg = 16px/11.5px (sidebar search) */
  size?: "md" | "lg";
}
export function SearchInput(props: SearchInputProps): JSX.Element;
