import type * as React from "react";

/**
 * Valkey button. Three real shapes exist in the brand source: the gradient hero pill,
 * the outlined pill, and the legacy solid rectangle.
 *
 * @startingPoint section="Core" subtitle="Gradient hero pill, outlined pills, solid CTA" viewport="700x150"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** hero = white→#B7C2F7 gradient pill; outline = hairline pill; outline-dark = on dark cards; outline-ink = community card; solid = legacy rectangle CTA */
  variant?: "hero" | "outline" | "outline-dark" | "outline-ink" | "solid" | "ghost";
  /** sm 14px, md 16px, lg 22px (hero scale) */
  size?: "sm" | "md" | "lg";
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Path to an SVG in assets/icons */
  iconSrc?: string;
  iconAlt?: string;
}
export function Button(props: ButtonProps): JSX.Element;
