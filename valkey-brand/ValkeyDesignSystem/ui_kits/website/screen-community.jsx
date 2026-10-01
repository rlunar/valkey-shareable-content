const { Card, Button, Icon } = window.ValkeyDesignSystem_d3b98f;

const communityCards = [
  { icon: "question", title: "Ask Questions", description: "If you have any inquiries about Valkey, feel free to join the conversation on our GitHub discussions or chat with us on Slack.", links: ["GitHub Repository", "Slack"] },
  { icon: "bug", title: "Report Bugs", description: "If you encounter any issues while using Valkey, please help us improve the project by filing a bug report at our GitHub repository.", links: ["GitHub Repository"] },
  { icon: "users", title: "Connect on Social Media", description: "Stay updated and connect with us on our social media platforms.", links: ["LinkedIn", "Bluesky", "Twitter"] },
  { icon: "bulb", title: "Suggest Features", description: "We value your ideas! If you have a suggestion for a new feature, please submit a feature request on our GitHub.", links: ["GitHub"] },
  { icon: "shield", title: "Security Concerns", description: "For any potential security issues, please refer to our Security Policy.", links: ["Learn more"] },
  { icon: "book", title: "Community Conduct", description: "If you experience any issues with community members behavior, kindly check our Code of Conduct for guidance.", links: ["Learn more"] }
];

const iconFileFor = { question: "icon-question.svg", bug: "icon-bug.svg", users: "icon-users.svg", bulb: "icon-bulb.svg", shield: "icon-sheild.svg", book: "icon-book.svg" };

function CommunityScreen() {
  const { PageChrome } = window;
  return (
    <PageChrome active="Community">
      <div style={{ background: "var(--valkey-community-shade)", textAlign: "center", paddingBottom: "60px" }}>
        <h1 style={{
          textAlign: "center", backgroundImage: "var(--valkey-gradient-page-title)", padding: "80px",
          margin: "0 0 50px", fontSize: "40px", fontWeight: 700, lineHeight: 1, color: "#fff", fontFamily: "var(--font-display)"
        }}>Community</h1>
        <h2 style={{ color: "var(--color-heading)", fontSize: "32.5px", fontWeight: 700, marginBottom: 0, fontFamily: "var(--font-display)" }}>How to Contribute with us?</h2>
        <p style={{ color: "var(--color-heading)", margin: "10px 0 0", fontSize: "18px" }}>We welcome your involvement in the Valkey community! Here are several ways you can contribute:</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", maxWidth: "1100px", margin: "30px auto 0", padding: "0 30px" }}>
          {communityCards.map((c) => (
            <Card key={c.title} surface="light" padding="md" raiseOnHover
              iconSrc={"../../assets/icons/" + iconFileFor[c.icon]}
              style={{ borderRadius: "18px", alignItems: "center" }}
              actions={
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                  {c.links.map((l) => <Button key={l} variant="outline-ink" size="sm">{l}</Button>)}
                </div>
              }>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--valkey-deep-purple)", margin: "0 0 7px", textAlign: "center", fontFamily: "var(--font-display)" }}>{c.title}</h3>
              <p style={{ color: "#3A3A4D", fontSize: "17.5px", margin: "0 0 15px", textAlign: "left", lineHeight: 1.6 }}>{c.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageChrome>
  );
}

Object.assign(window, { CommunityScreen });
