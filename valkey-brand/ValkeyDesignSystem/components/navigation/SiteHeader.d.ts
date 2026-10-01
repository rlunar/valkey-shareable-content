import type * as React from "react";

/**
 * valkey.io site header: 130x46 horizontal logo, 16px semibold nav in ValkeyBlueAura,
 * hover submenus, and the grey GitHub button with an optional star count.
 *
 * @startingPoint section="Website" subtitle="valkey.io header with nav and GitHub button" viewport="1400x80"
 */
export interface SiteHeaderNavItem { label: string; href: string; submenu?: { label: string; href: string }[] }
export interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Defaults to the real valkey.io navigation */
  items?: SiteHeaderNavItem[];
  /** Label of the current section, gets a 3px underline */
  active?: string;
  logoSrc?: string;
  starCount?: string;
}
export function SiteHeader(props: SiteHeaderProps): JSX.Element;
