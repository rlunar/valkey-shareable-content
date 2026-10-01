const footerSocials = [
  { label: "Slack", href: "https://valkey.io/slack", icon: "IconSlack.svg", size: 20 },
  { label: "GitHub", href: "https://github.com/valkey-io", icon: "IconGithub.svg", size: 20 },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/valkey/", icon: "IconLinkedin.svg", size: 20 },
  { label: "X.com", href: "https://x.com/valkey_io", icon: "IconX.svg", size: 20 },
  { label: "YouTube", href: "https://www.youtube.com/@valkeyproject", icon: "IconYoutube.svg", size: 24 },
  { label: "Connect", href: "/connect", icon: "IconMail.svg", size: 20 }
];

const footerLinks = [
  { label: "Code of Conduct", href: "/code_of_conduct" },
  { label: "Meetup Groups", href: "/community/meetup-groups/" },
  { label: "Forum", href: "https://github.com/orgs/valkey-io/discussions" },
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "FAQ", href: "/topics/faq" }
];

export function SiteFooter({ iconBase = "../../assets/icons/", showLegal = true, style, ...rest }) {
  const band = { background: "var(--valkey-black-denim)", color: "var(--valkey-pure-white)", fontFamily: "var(--font-body)", fontSize: "14px", padding: "20px 0" };
  const row = { display: "flex", flexWrap: "wrap", margin: "0 auto", width: "100%", maxWidth: "var(--layout-max)" };
  return (
    <div style={style} {...rest}>
      <div style={band}>
        <div style={row}>
          <div style={{ flex: "1 1 50%", padding: "0 20px", display: "flex", flexDirection: "row", gap: "15px", flexWrap: "wrap" }}>
            {footerSocials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--valkey-pure-white)", textDecoration: "none" }}>
                <img src={iconBase + s.icon} alt={s.label + " Icon"} width={s.size} height={s.size} />
                {s.label}
              </a>
            ))}
          </div>
          <div style={{ flex: "1 1 50%", padding: "0 20px", display: "flex", flexDirection: "row", gap: "15px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            {footerLinks.map((l) => (
              <a key={l.label} href={l.href} style={{ color: "var(--valkey-pure-white)", textDecoration: "underline" }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
      {showLegal ? (
        <div style={{ ...band, borderTop: "1px solid rgb(255 255 255 / 0.08)" }}>
          <div style={{ width: "100%", padding: "20px", textAlign: "center" }}>
            <p style={{ maxWidth: "720px", margin: "8px auto" }}>&copy; Valkey contributors.</p>
            <p style={{ maxWidth: "720px", margin: "8px auto" }}>Valkey and the Valkey logo are trademarks of LF Projects, LLC.</p>
            <p style={{ maxWidth: "720px", margin: "8px auto" }}>
              <a href="https://lfprojects.org/policies/trademark-policy/" style={{ color: "var(--valkey-blue-aura)" }}>Trademark Policy</a>.{" "}
              <a href="https://lfprojects.org/policies/privacy-policy/" style={{ color: "var(--valkey-blue-aura)" }}>Privacy Policy</a>.{" "}
              <a href="https://lfprojects.org/policies/terms-of-use/" style={{ color: "var(--valkey-blue-aura)" }}>Terms of Use</a>.
            </p>
            <p style={{ maxWidth: "720px", margin: "8px auto" }}>Logo design by <a href="https://github.com/dizys" style={{ color: "var(--valkey-blue-aura)" }}>Ziyang.</a></p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
