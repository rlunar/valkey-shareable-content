import type * as React from "react";

/** Uppercase 12px bold "read more" link with the › glyph appended, as used in asides and card footers. */
export interface ReadMoreLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href?: string;
}
export function ReadMoreLink(props: ReadMoreLinkProps): JSX.Element;
