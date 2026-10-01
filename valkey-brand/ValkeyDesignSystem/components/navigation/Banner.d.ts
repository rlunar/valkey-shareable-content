import type * as React from "react";

/** Dismissible announcement bar above the header (#2D2471). The real site remembers dismissal in localStorage for 24 hours. */
export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
}
export function Banner(props: BannerProps): JSX.Element | null;
