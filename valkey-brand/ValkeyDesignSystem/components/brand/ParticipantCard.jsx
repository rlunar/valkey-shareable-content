export function ParticipantCard({ name, logoSrc, offering, href, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      role="button" tabIndex={0}
      onClick={() => href && window.open(href, "_blank")}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={"Visit " + name + " website"}
      style={{
        minWidth: 0, borderRadius: "12px", padding: "40px", cursor: "pointer",
        background: hover ? "var(--valkey-cold-cream-3)" : "var(--valkey-pure-white)",
        transition: "all var(--duration-slow) var(--ease-standard)", fontFamily: "var(--font-body)", ...style
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", height: "40px" }}>
        {logoSrc
          ? <img src={logoSrc} alt={name + " logo"} loading="lazy" style={{ objectFit: "contain", maxHeight: "40px", maxWidth: "100%", margin: "0 auto" }} />
          : <div style={{ width: "60px", height: "60px", background: "var(--valkey-purple-indigo)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--valkey-pure-white)", fontSize: "24px", fontWeight: "var(--weight-bold)", textTransform: "uppercase" }}>{String(name || "").slice(0, 2)}</div>}
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "var(--weight-bold)", color: "var(--color-text)", textAlign: "center", margin: "0 0 12px", lineHeight: 1.3 }}>{name}</h3>
      <p style={{ fontSize: "14px", lineHeight: 1.5, color: "var(--color-text-muted)", margin: 0, textAlign: "center" }}>{offering}</p>
    </div>
  );
}
