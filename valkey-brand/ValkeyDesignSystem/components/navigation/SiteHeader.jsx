function HeaderLink({ item, active }) {
  const [hover, setHover] = React.useState(false);
  const hasSub = item.submenu && item.submenu.length > 0;
  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <a
        href={item.href} role="menuitem"
        style={{
          whiteSpace: "nowrap", color: "inherit", cursor: "pointer", padding: "10px 0",
          textDecoration: "none", borderBottom: "3px solid " + (active || hover ? "currentColor" : "transparent")
        }}
      >{item.label}</a>
      {hasSub && hover ? (
        <div style={{
          position: "absolute", top: "100%", left: 0, zIndex: 9, display: "flex", flexFlow: "column nowrap",
          background: "var(--valkey-pure-white)", minWidth: "100%", boxShadow: "var(--shadow-menu)", padding: "4px 0"
        }}>
          {item.submenu.map((s) => (
            <a key={s.label} href={s.href} role="menuitem" style={{ padding: "5px 16px", color: "inherit", textDecoration: "none", whiteSpace: "nowrap" }}>{s.label}</a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader({ items, active, logoSrc = "../../assets/logos/valkey-horizontal-color.png", starCount, style, ...rest }) {
  const nav = items || [
    { label: "Download", href: "/download/" },
    { label: "Documentation", href: "/docs/", submenu: [
      { label: "Command Reference", href: "/commands/" },
      { label: "Documentation by Topic", href: "/topics/" },
      { label: "Client Libraries", href: "/clients/" }
    ] },
    { label: "Blog", href: "/blog/" },
    { label: "Community", href: "/community/", submenu: [{ label: "Events", href: "/events/" }] },
    { label: "Participants", href: "/participants/" },
    { label: "Try Valkey", href: "/try-valkey/" }
  ];
  return (
    <div style={{ position: "relative", width: "100%", margin: "0 auto", borderBottom: "1px solid #DDDDDD", background: "var(--valkey-pure-white)", ...style }} {...rest}>
      <div style={{
        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        maxWidth: "var(--layout-max)", minHeight: "var(--header-height)", width: "100%", margin: "0 auto",
        padding: "0 20px", color: "var(--valkey-blue-aura)", fontFamily: "var(--font-body)",
        fontSize: "16px", fontWeight: "var(--weight-semibold)"
      }}>
        <a href="/" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <img src={logoSrc} alt="Valkey Logo" width="130" height="44" style={{ display: "block" }} />
        </a>
        <nav role="navigation" aria-label="Main" style={{ display: "flex", flexFlow: "row nowrap", gap: "30px", alignItems: "center" }}>
          {nav.map((item) => <HeaderLink key={item.label} item={item} active={active === item.label} />)}
          <a
            href="https://github.com/valkey-io" target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px",
              background: "#F8F9FA", border: "1px solid #DFE1E4", borderRadius: "6px",
              color: "#444444", textDecoration: "none", transition: "var(--transition-control)"
            }}
          >
            <img src="../../assets/icons/IconGithub.svg" alt="GitHub Icon" width="16" height="16" style={{ filter: "grayscale(1) brightness(0.3)" }} />
            GitHub
            {starCount ? (
              <span style={{ background: "#F1F5F9", color: "#64748B", fontSize: "12px", padding: "2px 6px", borderRadius: "10px", fontWeight: 500, border: "1px solid #E2E8F0" }}>{starCount}</span>
            ) : null}
          </a>
        </nav>
      </div>
    </div>
  );
}
