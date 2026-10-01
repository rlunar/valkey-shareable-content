const cardSurfaces = {
  light: {
    background: "var(--color-surface-raised)", color: "var(--color-text)",
    borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)"
  },
  "light-bordered": {
    background: "var(--color-surface-raised)", color: "var(--color-text)",
    borderRadius: "var(--radius-inner)", border: "var(--border-hairline)"
  },
  "light-square": {
    background: "var(--color-surface-raised)", color: "var(--color-text)",
    borderRadius: 0, boxShadow: "none"
  },
  dark: {
    background: "var(--color-surface-card-dark)", color: "var(--valkey-pure-white)",
    borderRadius: "var(--radius-card)", boxShadow: "none"
  },
  indigo: {
    background: "var(--valkey-purple-indigo)", color: "var(--color-on-dark)",
    borderRadius: "var(--radius-card)", boxShadow: "none"
  },
  translucent: {
    background: "rgb(255 255 255 / 0.2)", color: "var(--valkey-pure-white)",
    borderRadius: "var(--radius-card)", boxShadow: "none"
  }
};

const cardPads = { sm: "20px", md: "30px", lg: "40px" };

export function Card({
  children, surface = "light", padding = "md", title, description, actions,
  iconSrc, iconAlt = "", raiseOnHover = false, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dark = surface === "dark" || surface === "indigo" || surface === "translucent";
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", gap: "8px", padding: cardPads[padding],
        fontFamily: "var(--font-body)", transition: "box-shadow var(--duration-base) var(--ease-standard)",
        ...cardSurfaces[surface],
        ...(raiseOnHover && hover ? { boxShadow: "var(--shadow-card-hover)" } : null),
        ...style
      }}
      {...rest}
    >
      {iconSrc ? <img src={iconSrc} alt={iconAlt} width="48" height="48" style={{ marginBottom: "12px", alignSelf: "center" }} /> : null}
      {title ? (
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "20px",
          lineHeight: "var(--leading-heading)", margin: "0 0 8px",
          color: dark ? "var(--valkey-pure-white)" : "var(--color-heading)",
          textAlign: dark ? "center" : "left"
        }}>{title}</h3>
      ) : null}
      {description ? <p style={{ margin: 0, fontSize: "17px", lineHeight: "var(--leading-body)" }}>{description}</p> : null}
      {children}
      {actions ? <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "auto", paddingTop: "20px" }}>{actions}</div> : null}
    </div>
  );
}
