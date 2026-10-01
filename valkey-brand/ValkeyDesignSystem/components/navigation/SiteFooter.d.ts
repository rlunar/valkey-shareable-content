import type * as React from "react";

/** valkey.io footer: ValkeyBlackDenim bands, social icon row, underlined link row, and the trademark block. */
export interface SiteFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Relative path to assets/icons/ from the consuming page */
  iconBase?: string;
  showLegal?: boolean;
}
export function SiteFooter(props: SiteFooterProps): JSX.Element;
