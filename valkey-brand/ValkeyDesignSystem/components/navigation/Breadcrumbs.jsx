export function Breadcrumbs({ items = [], caretSrc = "../../assets/icons/caret-right.svg", style, ...rest }) {
  return (
    <nav style={{ borderRadius: "var(--radius-card)", background: "var(--valkey-pure-white)", marginBottom: "20px", ...style }} {...rest}>
      <ul style={{ display: "flex", alignItems: "center", padding: "10px 20px", listStyle: "none", margin: 0, gap: "5px", fontFamily: "var(--font-body)" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "var(--color-text)" }}>
            {i > 0 ? <img src={caretSrc} alt="" width="8" height="10" style={{ marginRight: "5px" }} /> : null}
            {item.href ? (
              <a href={item.href} style={{ color: "var(--valkey-link-blue)", textDecoration: "underline", fontWeight: "var(--weight-semibold)" }}>{item.label}</a>
            ) : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
