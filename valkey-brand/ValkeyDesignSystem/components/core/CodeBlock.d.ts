import type * as React from "react";

/** Code and terminal surface using the Valkey dark/light syntax themes and Cascadia Code with ligatures disabled. */
export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code?: string;
  theme?: "dark" | "light";
  /** Prefix each line with the valkey-cli prompt in ValkeyBlueAura */
  showPrompt?: boolean;
  lineNumbers?: boolean;
}
export function CodeBlock(props: CodeBlockProps): JSX.Element;
