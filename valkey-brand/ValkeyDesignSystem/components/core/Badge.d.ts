import type * as React from "react";

/** Pill label for blog post types and event categories. Colors come from the website's blog_type and event legend sets. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: "neutral" | "technical-deep-dive" | "community-highlight" | "how-to" | "announcements" | "events" | "first-party" | "third-party" | "meetup-hackathon";
  size?: "sm" | "md";
}
export function Badge(props: BadgeProps): JSX.Element;
