export function ReadMoreLink({ children = "Read more", href = "#", style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "12px", display: "inline-block",
        margin: "0.4em 0 0.8em", textDecoration: hover ? "underline" : "none",
        textTransform: "uppercase", fontWeight: "var(--weight-bold)",
        color: "var(--valkey-link-blue)", letterSpacing: "0.02em", ...style
      }}
      {...rest}
    >{children} ›</a>
  );
}
