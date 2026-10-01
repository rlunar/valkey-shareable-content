export function Blockquote({ children, cite, style, ...rest }) {
  return (
    <blockquote
      style={{
        margin: "1em 0", paddingLeft: "1.5em", borderLeft: "3px solid var(--valkey-blue-aura)",
        fontFamily: "var(--font-body)", fontSize: "18px", lineHeight: "var(--leading-body)",
        color: "var(--color-text)", ...style
      }}
      {...rest}
    >
      {children}
      {cite ? <footer style={{ marginTop: "8px", fontSize: "14px", color: "var(--color-text-muted)" }}>{cite}</footer> : null}
    </blockquote>
  );
}
