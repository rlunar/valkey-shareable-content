const screenForLabel = {
  Home: "home", Download: "home", Documentation: "docs", "Command Reference": "commands",
  "Documentation by Topic": "docs", "Client Libraries": "docs", Blog: "blog",
  Community: "community", Events: "community", Participants: "home", "Try Valkey": "home"
};

function WebsiteApp() {
  const [screen, setScreen] = React.useState(() => localStorage.getItem("valkey-uikit-screen") || "home");
  React.useEffect(() => { localStorage.setItem("valkey-uikit-screen", screen); }, [screen]);

  function handleClick(e) {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (/^https?:/.test(href)) return;
    const label = (a.textContent || "").trim();
    e.preventDefault();
    if (screenForLabel[label]) setScreen(screenForLabel[label]);
  }

  function handleLogo(e) {
    const img = e.target.closest("img[alt='Valkey Logo']");
    if (img) { e.preventDefault(); setScreen("home"); }
  }

  const Screen = { home: window.HomeScreen, docs: window.DocsScreen, commands: window.CommandsScreen, blog: window.BlogScreen, community: window.CommunityScreen }[screen];
  return (
    <div onClickCapture={handleLogo} onClick={handleClick}>
      <Screen />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WebsiteApp />);
