import type * as React from "react";

/**
 * Official Valkey logo artwork. Always renders a supplied SVG file — never a retyped
 * wordmark, never recolored, never with an added outline or shadow. Width is clamped to
 * the guideline minimums (horizontal 120px, stacked 96px, icon 16px).
 */
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?:
    | "horizontal-color" | "horizontal-color-light" | "horizontal-black" | "horizontal-white"
    | "stacked-color" | "stacked-color-light" | "stacked-black" | "stacked-white"
    | "icon-periwinkle" | "icon-black" | "icon-white";
  /** Rendered width in px; height follows the artwork ratio */
  width?: number;
  /** Relative path to assets/logos/ from the consuming page */
  base?: string;
  href?: string;
  /** Adds approximately the 1X clear-space margin around the mark */
  clearSpace?: boolean;
}
export function Logo(props: LogoProps): JSX.Element;
