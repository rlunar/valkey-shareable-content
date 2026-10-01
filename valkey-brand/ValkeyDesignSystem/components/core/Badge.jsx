const badgeToneColors = {
  neutral: "var(--valkey-ink-soft)",
  "technical-deep-dive": "#6983FF",
  "community-highlight": "#1F9589",
  "how-to": "#692A84",
  announcements: "#CC9316",
  events: "#DD4A69",
  "first-party": "#6983FF",
  "third-party": "#CC9316",
  "meetup-hackathon": "#1F9589"
};

export function Badge({ children, tone = "neutral", size = "md", style, ...rest }) {
  const dims = size === "sm"
    ? { fontSize: "11px", padding: "2px 8px", borderRadius: "12px" }
    : { fontSize: "13px", padding: "3px 12px", borderRadius: "12px" };
  return (
    <span
      style={{
        display: "inline-block", fontFamily: "var(--font-body)",
        fontWeight: "var(--weight-semibold)", color: "var(--valkey-pure-white)",
        background: badgeToneColors[tone], lineHeight: 1.4, ...dims, ...style
      }}
      {...rest}
    >{children}</span>
  );
}
