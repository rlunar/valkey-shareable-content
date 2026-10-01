const buttonBase = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
  fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", lineHeight: 1.2,
  textDecoration: "none", cursor: "pointer", transition: "var(--transition-control)",
  border: "1px solid transparent", boxSizing: "border-box"
};

const buttonSizes = {
  sm: { fontSize: "14px", padding: "8px 16px" },
  md: { fontSize: "16px", padding: "12px 24px" },
  lg: { fontSize: "22px", padding: "8px 15px" }
};

const buttonVariants = {
  hero: {
    background: "var(--valkey-gradient-cta-pill)", color: "var(--valkey-blue-aura)",
    borderRadius: "30px", boxShadow: "var(--shadow-pill)", transitionDuration: "var(--duration-slow)"
  },
  outline: {
    background: "transparent", color: "var(--valkey-ink-soft)",
    border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-pill)"
  },
  "outline-dark": {
    background: "transparent", color: "var(--valkey-pure-white)",
    border: "1px solid currentColor", borderRadius: "24px"
  },
  "outline-ink": {
    background: "transparent", color: "#072150",
    border: "1px solid #072150", borderRadius: "24px"
  },
  solid: {
    background: "var(--valkey-purple-indigo)", color: "var(--valkey-best-white)",
    borderRadius: "var(--radius-control-sm)"
  },
  ghost: {
    background: "transparent", color: "var(--color-link)", border: "1px solid transparent",
    borderRadius: "var(--radius-pill)", textDecoration: "underline"
  }
};

const buttonHovers = {
  hero: { boxShadow: "0 6px 14px rgb(0 0 0 / 0.3)" },
  outline: { background: "var(--valkey-blue-aura)", color: "var(--valkey-pure-white)", borderColor: "var(--valkey-blue-aura)" },
  "outline-dark": { background: "var(--valkey-pure-white)", color: "var(--valkey-deep-purple)" },
  "outline-ink": { background: "#072150", color: "var(--valkey-pure-white)" },
  solid: { background: "var(--valkey-black-denim)" },
  ghost: { color: "var(--valkey-purple-indigo)" }
};

export function Button({
  children, variant = "outline", size = "md", href, as, fullWidth = false,
  disabled = false, iconSrc, iconAlt = "", onClick, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as || (href ? "a" : "button");
  const composed = {
    ...buttonBase,
    ...buttonSizes[size],
    ...buttonVariants[variant],
    ...(hover && !disabled ? buttonHovers[variant] : null),
    ...(fullWidth ? { width: "100%" } : null),
    ...(disabled ? { opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" } : null),
    ...style
  };
  return (
    <Tag
      href={href} onClick={onClick} disabled={Tag === "button" ? disabled : undefined}
      style={composed} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {iconSrc ? <img src={iconSrc} alt={iconAlt} width="16" height="16" /> : null}
      {children}
    </Tag>
  );
}
