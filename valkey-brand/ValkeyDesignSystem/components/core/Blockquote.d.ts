import type * as React from "react";

/** Pull quote in long-form docs and blog posts: 3px ValkeyBlueAura left rule, no italics, no decorative marks. */
export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children?: React.ReactNode;
  /** Attribution line rendered at 14px muted */
  cite?: string;
}
export function Blockquote(props: BlockquoteProps): JSX.Element;
