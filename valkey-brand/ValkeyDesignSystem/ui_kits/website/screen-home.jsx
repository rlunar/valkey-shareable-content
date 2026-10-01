const { Banner, SiteHeader, SiteFooter, Button, Card, ParticipantCard, ReadMoreLink, CodeBlock } = window.ValkeyDesignSystem_d3b98f;

const homeDocCards = [
  { title: "Install", description: "Step-by-step instructions on how to install and configure Valkey for first-time users.", cta: "See Installation Guide" },
  { title: "Usage guide", description: "Detailed documentation on the various datatype supported by Valkey and best practices.", cta: "Documentation by topic" },
  { title: "Valkey API", description: "View the full list of Valkey commands including first party modules.", cta: "Command Reference" },
  { title: "Clients", description: "Official Valkey client libraries include support for:", features: ["Python", "Java", "Go", "Node.js", "PHP", "C#", "Ruby"], cta: "Learn More" }
];

const homeParticipants = [
  { name: "Amazon Web Services", logo: "aws.svg", offering: "Amazon ElastiCache and Amazon MemoryDB offer Valkey-compatible in-memory services." },
  { name: "Google Cloud", logo: "gcp.svg", offering: "Memorystore for Valkey provides a fully managed Valkey service." },
  { name: "Aiven", logo: "aiven.svg", offering: "Aiven for Valkey is a fully managed in-memory datastore." },
  { name: "Percona", logo: "percona.svg", offering: "Percona provides support, services and packaging for Valkey." },
  { name: "Momento", logo: "momento.svg", offering: "Momento Cache offers a serverless Valkey-compatible cache." },
  { name: "Ericsson", logo: "ericsson.svg", offering: "Ericsson contributes to Valkey for telecom-scale workloads." },
  { name: "ByteDance", logo: "bytedance.svg", offering: "ByteDance runs and contributes to Valkey at large scale." },
  { name: "DigitalOcean", logo: "digitalocean.svg", offering: "DigitalOcean Managed Caching supports Valkey." },
  { name: "Heroku", logo: "heroku.svg", offering: "Heroku Key-Value Store is built on Valkey." }
];

const homeSidebar = [
  { title: "Featured repositories", links: ["valkey-io/valkey", "valkey-io/valkey-glide", "valkey-io/valkey-bloom", "valkey-io/valkey-json"], more: "All repos in the Valkey GitHub organization" }
];

function HomeHero() {
  return (
    <div style={{
      position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", padding: "100px 20px", textAlign: "center",
      backgroundColor: "#30186E",
      backgroundImage: "linear-gradient(to bottom, rgba(48,24,110,0.15), rgba(48,24,110,0.75)), url('../../assets/img/hero-bg.webp')",
      backgroundSize: "cover", backgroundPosition: "right center"
    }}>
      <div style={{ maxWidth: "1200px", zIndex: 1, color: "#fff" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "70px", fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: "2px", color: "#fff" }}>FAST. RELIABLE.</h1>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "70px", fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: "2px", color: "#fff" }}>OPEN SOURCE, FOREVER.</h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", fontWeight: 700, maxWidth: "800px", margin: "20px auto 40px", lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>
          Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever.
        </p>
        <Button variant="hero" size="lg" href="#" style={{ minWidth: "380px" }}>GET STARTED</Button>
      </div>
    </div>
  );
}

function WhatsNew() {
  return (
    <div style={{ backgroundImage: "var(--valkey-gradient-whats-new)", padding: "0 0 80px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", margin: "0 auto", width: "100%", maxWidth: "var(--layout-max)", padding: "40px 20px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%", padding: "40px", borderRadius: "20px", background: "rgba(255,255,255,0.2)" }}>
          <div style={{ flex: "1 1 50%", padding: "0 20px", minWidth: "300px" }}>
            <h3 style={{ color: "#fff", fontSize: "27.5px", fontWeight: 700, width: "100%", margin: "0 0 10px", fontFamily: "var(--font-display)" }}>Version 9.x.x</h3>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", margin: "0 0 30px", fontSize: "16px", lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}><strong>Release Date:</strong> 2026-08-12<br /><strong>GitHub Release:</strong> <a href="#" style={{ color: "var(--valkey-link-blue)" }}>9.0.0</a></p>
              <hr style={{ margin: "20px 0", border: 0, height: "1px", background: "var(--color-border)" }} />
              <h4 style={{ margin: "0 0 10px", fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--color-heading)" }}>Docker Hub <small style={{ fontWeight: 400 }}>(valkey/valkey)</small></h4>
              <CodeBlock theme="light" code="docker run --rm valkey/valkey:9" style={{ fontSize: "14px" }} />
            </div>
            <h3 style={{ color: "#fff", fontSize: "27.5px", fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>Latest supported version of past releases</h3>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", fontSize: "16px", lineHeight: 1.6 }}>
              <h4 style={{ margin: "0 0 10px", fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--color-heading)" }}>Version 8.x.x</h4>
              <p style={{ margin: 0 }}><strong>Release Date:</strong> 2026-04-02<br /><strong>GitHub Release:</strong> <a href="#" style={{ color: "var(--valkey-link-blue)" }}>8.1.4</a></p>
            </div>
          </div>
          <div style={{ flex: "1 1 25%", padding: "0 20px", minWidth: "240px" }}>
            <h3 style={{ color: "#fff", fontSize: "27.5px", fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>Performance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[["Throughput dashboard", "Track operations per second across releases and instance types."], ["Latency dashboard", "Compare p50 and p99 latency for common command mixes."]].map(([t, d]) => (
                <div key={t} style={{ background: "#fff", borderRadius: "10px", boxShadow: "var(--shadow-raised)", overflow: "hidden" }}>
                  <div style={{ padding: "15px", display: "flex", flexDirection: "column" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "16px", lineHeight: 1.3, fontFamily: "var(--font-display)", color: "#002A3A" }}>{t}</h4>
                    <p style={{ margin: "0 0 15px", fontSize: "14px", lineHeight: 1.4, color: "#4A5568" }}>{d}</p>
                    <Button variant="outline" size="sm" style={{ alignSelf: "flex-start" }}>Explore</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 25%", padding: "0 20px", minWidth: "240px" }}>
            <h3 style={{ color: "#fff", fontSize: "27.5px", fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>Latest Blog Posts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
              {[["Valkey 9.0 is here", "Dual channel replication, atomic slot migration, and a smaller memory footprint."], ["Inside the Valkey cluster bus", "How nodes gossip, fail over, and agree on slot ownership."]].map(([t, d]) => (
                <div key={t} style={{ background: "#fff", borderRadius: "10px", boxShadow: "var(--shadow-raised)", overflow: "hidden" }}>
                  <div style={{ padding: "15px", display: "flex", flexDirection: "column" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "16px", lineHeight: 1.3, fontFamily: "var(--font-display)", color: "#002A3A" }}>{t}</h4>
                    <p style={{ margin: "0 0 15px", fontSize: "14px", lineHeight: 1.4, color: "#4A5568" }}>{d}</p>
                    <Button variant="outline" size="sm" style={{ alignSelf: "flex-start" }}>Read More</Button>
                  </div>
                </div>
              ))}
            </div>
            {homeSidebar.map((cat) => (
              <div key={cat.title}>
                <h3 style={{ color: "#fff", fontSize: "27.5px", fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>{cat.title}</h3>
                <div style={{ background: "#fff", padding: "20px 30px", borderRadius: "10px" }}>
                  <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0, fontSize: "16px", lineHeight: 2 }}>
                    {cat.links.map((l) => <li key={l}><a href="#" style={{ color: "var(--valkey-link-blue)" }}>{l}</a></li>)}
                  </ul>
                  <ReadMoreLink>{cat.more}</ReadMoreLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentationBand() {
  return (
    <div style={{ padding: "40px 20px 80px", background: "#6983FF", textAlign: "center", color: "#fff" }}>
      <div style={{ maxWidth: "890px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "60px", fontWeight: 700, lineHeight: 1.2, margin: "0 0 17.5px", color: "#fff" }}>Documentation</h2>
        <p style={{ marginBottom: "20px", fontSize: "18px", lineHeight: 1.6 }}>
          Valkey can run as either a <strong>standalone</strong> daemon or in a <strong>cluster</strong>, with options for <strong>replication</strong> and <strong>high availability</strong>. Valkey natively supports a rich collection of datatypes, including <strong>strings</strong>, <strong>numbers</strong>, <strong>hashes</strong>, <strong>lists</strong>, <strong>sets</strong>, <strong>sorted sets</strong>, <strong>bitmaps</strong>, <strong>hyperloglogs</strong> and more.
        </p>
        <p style={{ margin: 0, fontSize: "18px", lineHeight: 1.6 }}>
          Valkey also supports native extensibility with built-in scripting support for <strong>Lua</strong> and supports <strong>module</strong> plugins to create new commands, data types, and more.
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", margin: "40px auto 0", maxWidth: "var(--layout-max)" }}>
        {homeDocCards.map((c) => (
          <div key={c.title} style={{ flex: "1 1 25%", minWidth: "260px", padding: "0 20px 30px" }}>
            <Card surface="dark" padding="lg" title={c.title} style={{ minHeight: "100%" }}
              actions={<Button variant="outline-dark" fullWidth>{c.cta}</Button>}>
              <p style={{ textAlign: "left", margin: 0, fontSize: "18px", lineHeight: 1.6 }}>{c.description}</p>
              {c.features ? (
                <ul style={{ textAlign: "left", padding: "0 0 0 18px", margin: "10px 0 20px", fontSize: "18px", lineHeight: 1.6 }}>
                  {c.features.map((ft) => <li key={ft}>{ft}</li>)}
                </ul>
              ) : null}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParticipantsBand() {
  const [slide, setSlide] = React.useState(0);
  const slides = Math.ceil(homeParticipants.length / 3);
  return (
    <section style={{ background: "var(--valkey-gradient-participants)", padding: "80px 0" }}>
      <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 700, margin: "0 0 20px", letterSpacing: "-1px" }}>Participants</h2>
          <p style={{ color: "#fff", fontSize: "18px", lineHeight: 1.6, maxWidth: "800px", margin: "0 auto", opacity: 0.95 }}>
            The Valkey project participants are a diverse group of organizations that have come together to maintain and contribute to the project. Valkey participants are more than vendors, they are dedicated to continuously strengthening the long-term health and viability of this project so that everyone can benefit from it.
          </p>
        </div>
        <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", width: "100%", transition: "transform 0.5s ease-in-out", transform: "translateX(-" + slide * 100 + "%)" }}>
              {homeParticipants.map((p) => (
                <div key={p.name} style={{ flex: "0 0 33.33%", minWidth: 0 }}>
                  <ParticipantCard name={p.name} logoSrc={"../../assets/participants/" + p.logo} offering={p.offering} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "12.5px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {Array.from({ length: slides }).map((_, i) => (
              <button key={i} aria-label={"Go to slide " + (i + 1)} aria-current={i === slide} onClick={() => setSlide(i)}
                style={{
                  width: "8px", height: "8px", borderRadius: "50%", border: "none", padding: 0, cursor: "pointer",
                  background: i === slide ? "#000" : "rgba(0,0,0,0.25)",
                  transform: i === slide ? "scale(1.2)" : "none", transition: "all 0.2s ease"
                }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeScreen() {
  return (
    <div>
      <Banner><strong>Save Your Spot for ValkeyConf 2026</strong> | October 5, 2026 | Prague, Czechia</Banner>
      <SiteHeader active="Home" logoSrc="../../assets/logos/valkey-horizontal-color.png" starCount="21.4k" />
      <HomeHero />
      <WhatsNew />
      <DocumentationBand />
      <ParticipantsBand />
      <SiteFooter iconBase="../../assets/icons/" />
    </div>
  );
}

Object.assign(window, { HomeScreen });
