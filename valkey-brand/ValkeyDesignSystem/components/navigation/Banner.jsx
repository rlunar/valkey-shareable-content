export function Banner({ children, onClose, dismissible = true, style, ...rest }) {
  const [closed, setClosed] = React.useState(false);
  if (closed) return null;
  return (
    <div style={{ position: "relative", background: "var(--valkey-deep-purple)", color: "var(--valkey-pure-white)", fontFamily: "var(--font-body)", fontSize: "16px", ...style }} {...rest}>
      <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto", padding: "10px 56px 10px 20px", textAlign: "center" }}>{children}</div>
      {dismissible ? (
        <a
          href="#" aria-label="Close banner"
          onClick={(e) => { e.preventDefault(); setClosed(true); if (onClose) onClose(); }}
          style={{ position: "absolute", top: "50%", right: "20px", marginTop: "-12px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img src="../../assets/icons/icon-outline-close.svg" alt="Icon Close" width="16" height="16" />
        </a>
      ) : null}
    </div>
  );
}
