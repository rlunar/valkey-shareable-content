const { SearchInput } = window.ValkeyDesignSystem_d3b98f;

const commandGroups = [
  { id: "string", display: "String", description: "Commands that operate on string values.", entries: [
    ["APPEND", "Appends a string to the value of a key. Returns the new length of the string."],
    ["GET", "Returns the string value of a key."],
    ["GETRANGE", "Returns a substring of the string stored at a key."],
    ["INCR", "Increments the integer value of a key by one. Uses 0 as initial value if the key doesn't exist."],
    ["SET", "Sets the string value of a key, ignoring its type. The key is created if it doesn't exist."]
  ] },
  { id: "hash", display: "Hash", description: "Commands that operate on hash fields.", entries: [
    ["HDEL", "Deletes one or more fields and their values from a hash. Deletes the hash if no fields remain."],
    ["HGETALL", "Returns all fields and values in a hash."],
    ["HSET", "Creates or modifies the value of a field in a hash."]
  ] },
  { id: "cluster", display: "Cluster", description: "Commands for cluster management and introspection.", entries: [
    ["CLUSTER INFO", "Returns information about the state of a node."],
    ["CLUSTER SHARDS", "Returns the mapping of cluster slots to shards."],
    ["CLUSTER MYID", "Returns the ID of a node."]
  ] },
  { id: "pubsub", display: "Pub/Sub", description: "Commands for publish and subscribe messaging.", entries: [
    ["PUBLISH", "Posts a message to a channel."],
    ["SUBSCRIBE", "Listens for messages published to channels."]
  ] }
];

function CommandsScreen() {
  const { StyledTitle, ArticleLayout, AsideHeading, PageChrome } = window;
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const filtered = commandGroups
    .map((g) => ({ ...g, entries: g.entries.filter(([name]) => name.toLowerCase().includes(q)) }))
    .filter((g) => g.entries.length > 0);
  return (
    <PageChrome active="Documentation">
      <StyledTitle title="Documentation: Command Reference" />
      <ArticleLayout
        aside={
          <div>
            <AsideHeading>Command Categories</AsideHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", lineHeight: 2 }}>
              {commandGroups.map((g) => <li key={g.id}><a href="#" style={{ color: "var(--valkey-link-blue)" }}>{g.display}</a></li>)}
            </ul>
            <AsideHeading>Alphabetical Command List</AsideHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.9, fontFamily: "var(--font-code)", fontSize: "14px" }}>
              {commandGroups.flatMap((g) => g.entries.map(([n]) => n)).sort().map((n) => (
                <li key={n}><a href="#" style={{ color: "var(--valkey-link-blue)" }}>{n}</a></li>
              ))}
            </ul>
          </div>
        }
      >
        <SearchInput label="Search Commands:" placeholder="Search commands..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ margin: "10px 0 20px" }} />
        {filtered.length === 0 ? (
          <div style={{ color: "var(--color-heading)", padding: "50px 20px 70px", textAlign: "center" }}>
            <span style={{ fontSize: "60px", fontWeight: 800, fontFamily: "var(--font-code)" }}>&lt;/&gt;</span>
            <h4 style={{ fontSize: "17.5px", margin: "7.5px 0", fontFamily: "var(--font-display)" }}>We couldn't find any results matching your search</h4>
            <p style={{ fontSize: "17.5px", margin: 0 }}>Check your spelling or try different keywords</p>
          </div>
        ) : filtered.map((g) => (
          <div key={g.id} style={{ marginBottom: "20px" }}>
            <h2 style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "10px", margin: "0 0 0", fontSize: "24px", fontFamily: "var(--font-display)", color: "var(--color-heading)" }}>
              {g.display} <span style={{ fontWeight: 400, fontSize: "16px", fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}>{g.description}</span>
            </h2>
            {g.entries.map(([name, summary]) => (
              <div key={name} style={{ fontSize: "15px", borderBottom: "1px solid var(--color-border)", padding: "12.5px 0", lineHeight: 1.5 }}>
                <code style={{ fontFamily: "var(--font-code)" }}><a href="#" style={{ color: "var(--valkey-link-blue)", textDecoration: "underline" }}>{name}</a></code> {summary}
              </div>
            ))}
            <div style={{ padding: "8px 0" }}><small><a href="#" style={{ color: "var(--valkey-link-blue)" }}>Back to top</a></small></div>
          </div>
        ))}
      </ArticleLayout>
    </PageChrome>
  );
}

Object.assign(window, { CommandsScreen });
