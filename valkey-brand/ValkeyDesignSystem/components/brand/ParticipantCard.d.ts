import type * as React from "react";

/** Participant tile from the homepage carousel: contained logo capped at 40px tall, centred name, short offering line. */
export interface ParticipantCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Path to a logo in assets/participants */
  logoSrc?: string;
  offering?: string;
  href?: string;
}
export function ParticipantCard(props: ParticipantCardProps): JSX.Element;
