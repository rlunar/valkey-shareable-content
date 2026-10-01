import type * as React from "react";

/**
 * Thin wrapper over the SVG files the website ships in assets/icons — intentional
 * addition so screens reference icons by name rather than by path. There is no icon
 * font or sprite in the source; if a needed glyph is not here, use a text label.
 *
 * @startingPoint section="Brand" subtitle="The 14 site SVG icons at interface and feature sizes" viewport="700x150"
 */
export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: "github" | "slack" | "linkedin" | "mail" | "x" | "youtube" | "close" | "caret" | "question" | "bug" | "users" | "bulb" | "shield" | "book";
  /** 16-24 for interface icons, 40-48 for feature cards */
  size?: number;
  /** Relative path to assets/icons/ from the consuming page */
  base?: string;
  alt?: string;
}
export function Icon(props: IconProps): JSX.Element | null;
export const iconNames: string[];
