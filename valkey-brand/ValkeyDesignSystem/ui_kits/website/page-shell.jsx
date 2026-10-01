const { Banner, SiteHeader, SiteFooter } = window.ValkeyDesignSystem_d3b98f;

function StyledTitle({ title, description }) {
  return (
    <div style={{ backgroundImage: "var(--valkey-gradient-page-title)", padding: "80px 20px", textAlign: "center", color: "#fff" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 700, lineHeight: 1, color: "#fff", margin: "0 auto", padding: 0 }}>{title}</h1>
      {description ? <p style={{ margin: "20px auto 0", maxWidth: "800px", color: "#fff", lineHeight: 1.4, fontSize: "18px" }}>{description}</p> : null}
    </div>
  );
}

/** Two-column page: white rounded content card on the #E2E8F0 field, #F1F0FA aside. */
function ArticleLayout({ children, aside, asideImage, squareInner = false }) {
  return (
    <div style={{ background: "var(--valkey-page-shade)" }}>
      <div style={{ display: "flex", maxWidth: "var(--layout-max)", margin: "0 auto", flexDirection: "row-reverse", alignItems: "stretch" }}>
        <aside style={{
          background: asideImage ? "transparent" : "var(--valkey-aside-shade)", padding: "20px", width: "100%", maxWidth: "420px",
          fontFamily: "var(--font-body)", fontSize: "15px", color: "#4C636F",
          ...(asideImage ? { backgroundImage: "url('" + asideImage + "')", backgroundColor: "var(--valkey-aside-shade)", backgroundSize: "cover", backgroundPosition: "center bottom" } : null)
        }}>{aside}</aside>
        <main style={{ flex: 1, padding: "20px", width: "67%" }}>
          <div style={{ width: "100%", background: "#fff", borderRadius: squareInner ? 0 : "20px", padding: "10px 20px 20px" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AsideLinkList({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
      {items.map((i) => (
        <li key={i}>
          <a href="#" style={{
            display: "block", background: "var(--valkey-aside-link)", padding: "12px", marginBottom: "10px",
            color: "#000", textTransform: "uppercase", cursor: "pointer", fontWeight: 600, textDecoration: "none", fontSize: "14px"
          }}>{i}</a>
        </li>
      ))}
    </ul>
  );
}

function AsideHeading({ children }) {
  return <h2 style={{ fontSize: "15px", margin: "0 0 4px", fontWeight: 700, color: "#000", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>{children}</h2>;
}

function PageChrome({ children, active }) {
  return (
    <div>
      <Banner><strong>Save Your Spot for ValkeyConf 2026</strong> | October 5, 2026 | Prague, Czechia</Banner>
      <SiteHeader active={active} logoSrc="../../assets/logos/valkey-horizontal-color.png" starCount="21.4k" />
      {children}
      <SiteFooter iconBase="../../assets/icons/" />
    </div>
  );
}

Object.assign(window, { StyledTitle, ArticleLayout, AsideLinkList, AsideHeading, PageChrome });
