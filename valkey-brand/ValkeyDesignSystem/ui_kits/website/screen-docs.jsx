const { Breadcrumbs, CodeBlock, Blockquote, DataTable } = window.ValkeyDesignSystem_d3b98f;

const topicIndex = ["ACL", "Bitmaps", "Client eviction", "Cluster tutorial", "Configuration", "Data types", "Distributed locks", "Expiration", "Functions", "Hashes", "Keyspace notifications", "Latency monitoring", "LRU cache", "Modules", "Pipelining", "Pub/Sub", "Quickstart", "Replication", "Sentinel", "Streams", "Transactions"];

function DocsScreen() {
  const { StyledTitle, ArticleLayout, AsideLinkList, AsideHeading, PageChrome } = window;
  return (
    <PageChrome active="Documentation">
      <StyledTitle title="Documentation: Quickstart" />
      <ArticleLayout
        asideImage="../../assets/img/aside-banner.webp"
        aside={
          <div>
            <AsideHeading>On this page</AsideHeading>
            <AsideLinkList items={["Install Valkey", "Start the server", "Connect with valkey-cli", "Next steps"]} />
            <AsideHeading>Alphabetical Index</AsideHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.9 }}>
              {topicIndex.map((t) => <li key={t}><a href="#" style={{ color: "var(--valkey-link-blue)" }}>{t}</a></li>)}
            </ul>
          </div>
        }
      >
        <Breadcrumbs caretSrc="../../assets/icons/caret-right.svg" items={[{ label: "Topics", href: "#" }, { label: "Quickstart" }]} style={{ background: "var(--valkey-page-shade)" }} />
        <h1 style={{ margin: "10px 0 5px", color: "var(--color-heading)", fontSize: "30px", fontWeight: 600, fontFamily: "var(--font-display)" }}>Quickstart</h1>
        <span style={{ fontSize: "14px", display: "block", margin: "0 0 20px", color: "var(--color-text-muted)" }}>Updated August 12, 2026</span>
        <p style={{ fontSize: "18px", lineHeight: 1.6 }}>This guide takes you from an empty machine to a running Valkey server with a client attached. It assumes you can run commands in a terminal and have permission to install packages.</p>
        <h2 style={{ margin: "40px 0 5px", color: "var(--color-heading)", fontSize: "24px", fontFamily: "var(--font-display)" }}>Install Valkey</h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6 }}>Install from a container image, a package manager, or a release tarball. The container image is the fastest way to get started:</p>
        <CodeBlock code={"docker run --rm --name valkey -p 6379:6379 valkey/valkey:9"} />
        <h2 style={{ margin: "40px 0 5px", color: "var(--color-heading)", fontSize: "24px", fontFamily: "var(--font-display)" }}>Connect with valkey-cli</h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6 }}>Open a second terminal and start the CLI. Every command echoes its reply, so you can confirm each step as you go.</p>
        <CodeBlock showPrompt code={"SET mykey \"Hello\"\nGET mykey\nEXPIRE mykey 60\nTTL mykey"} />
        <Blockquote cite="Valkey Brand Guidelines v2.0">Preserve exact capitalization, commands, configuration keys, and output in technical examples.</Blockquote>
        <h2 style={{ margin: "40px 0 5px", color: "var(--color-heading)", fontSize: "24px", fontFamily: "var(--font-display)" }}>Deployment modes</h2>
        <DataTable
          columns={["Mode", "Replication", "Automatic failover", "Slots"]}
          rows={[["Standalone", "Optional", "No", "—"], ["Standalone + Sentinel", "Yes", "Yes", "—"], ["Cluster", "Yes", "Yes", "16384"]]}
          style={{ margin: "20px 0" }}
        />
        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid var(--color-border)", fontSize: "16px" }}>
          See an error? <a href="#" style={{ color: "var(--valkey-link-blue)" }}>Update this Page on GitHub!</a>
        </div>
      </ArticleLayout>
    </PageChrome>
  );
}

Object.assign(window, { DocsScreen });
