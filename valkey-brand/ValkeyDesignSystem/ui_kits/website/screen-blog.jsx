const { Badge, Select, Button } = window.ValkeyDesignSystem_d3b98f;

const blogPosts = [
  { type: "Announcements", tone: "announcements", title: "Valkey 9.0 is here", date: "Wednesday August 12, 2026", description: "Valkey 9.0 adds atomic slot migration, a smaller per-key memory footprint, and dual channel replication on by default." },
  { type: "Technical Deep Dive", tone: "technical-deep-dive", title: "Inside the Valkey cluster bus", date: "Tuesday July 28, 2026", description: "How nodes gossip, detect failure, and agree on slot ownership, with packet-level walkthroughs and the timeouts that matter." },
  { type: "How-to", tone: "how-to", title: "Migrating from a single node to a cluster", date: "Thursday July 9, 2026", description: "A step-by-step migration path that keeps reads available, including the client-side changes you need to plan for." },
  { type: "Community Highlight", tone: "community-highlight", title: "Meet the contributors behind valkey-glide", date: "Monday June 22, 2026", description: "The maintainers of the official multi-language client library on API design, testing across runtimes, and what they need help with." },
  { type: "Events", tone: "events", title: "ValkeyConf 2026 call for proposals", date: "Friday June 5, 2026", description: "Submit a talk for the Prague program. Sessions cover operations at scale, internals, client libraries, and migration stories." }
];

function BlogScreen() {
  const { StyledTitle, ArticleLayout, AsideHeading, PageChrome } = window;
  const [type, setType] = React.useState("All Types");
  const shown = type === "All Types" ? blogPosts : blogPosts.filter((p) => p.type === type);
  return (
    <PageChrome active="Blog">
      <StyledTitle title="Blog" description="News, deep dives and community stories from the Valkey project." />
      <ArticleLayout
        squareInner
        aside={
          <div>
            <AsideHeading>Featured</AsideHeading>
            {blogPosts.slice(0, 3).map((p) => (
              <div key={p.title} style={{ display: "flex", background: "#fff", borderRadius: "10px", marginBottom: "20px", overflow: "hidden" }}>
                <div style={{ flex: "1 1 100%", padding: "12.5px" }}>
                  <h4 style={{ margin: "0 0 12.5px", fontSize: "16px", fontFamily: "var(--font-display)" }}><a href="#" style={{ color: "#000", textDecoration: "none" }}>{p.title}</a></h4>
                  <p style={{ margin: "0 0 12.5px", fontSize: "14px", lineHeight: 1.45, color: "var(--color-text-muted)" }}>{p.description}</p>
                  <Button variant="outline" size="sm" style={{ float: "right" }}>Read more</Button>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <div style={{ marginBottom: "15px", paddingTop: "10px" }}>
          <Select label="Filter posts by type" value={type} onChange={(e) => setType(e.target.value)}
            options={["All Types", ...blogPosts.map((p) => p.type)]} />
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((p) => (
            <li key={p.title} style={{ background: "#fff", padding: "20px", marginBottom: "20px", borderBottom: "1px solid var(--color-border)" }}>
              <Badge tone={p.tone} size="sm">{p.type}</Badge>
              <h2 style={{ margin: "8px 0 0", fontSize: "24px", fontFamily: "var(--font-display)" }}><a href="#" style={{ color: "var(--color-heading)", textDecoration: "none" }}>{p.title}</a></h2>
              <div style={{ marginTop: "2px", fontSize: "14px", color: "var(--color-text-muted)" }}>{p.date}</div>
              <p style={{ fontSize: "18px", lineHeight: 1.6 }}>{p.description}</p>
              <a href="#" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700, color: "#747BFF", textDecoration: "none" }}>Read more ›</a>
            </li>
          ))}
        </ul>
        {shown.length === 0 ? <p>No posts match this filter.</p> : null}
      </ArticleLayout>
    </PageChrome>
  );
}

Object.assign(window, { BlogScreen });
