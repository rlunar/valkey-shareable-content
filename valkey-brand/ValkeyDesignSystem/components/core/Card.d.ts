import type * as React from "react";

/**
 * Content card. Light cards sit on the shaded page background; dark cards use the
 * website's #2D2471 or ValkeyPurpleIndigo.
 *
 * @startingPoint section="Core" subtitle="Light, dark and translucent card surfaces" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  surface?: "light" | "light-bordered" | "light-square" | "dark" | "indigo" | "translucent";
  /** sm 20px, md 30px, lg 40px internal padding */
  padding?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  /** 48px feature icon from assets/icons */
  iconSrc?: string;
  iconAlt?: string;
  /** Lift shadow from 0 4px 24px to 0 8px 32px on hover (community/leadership cards) */
  raiseOnHover?: boolean;
}
export function Card(props: CardProps): JSX.Element;
