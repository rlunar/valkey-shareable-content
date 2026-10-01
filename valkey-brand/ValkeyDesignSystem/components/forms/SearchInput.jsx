export function SearchInput({ label, placeholder = "Search commands...", value, onChange, size = "md", style, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", borderBottom: "1px solid rgb(104 147 238)", paddingBottom: size === "lg" ? "20px" : "10px", ...style }}>
      {label ? <label style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text)", whiteSpace: "nowrap" }}>{label}</label> : null}
      <input
        type="text" placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          flex: 1, minWidth: 0, outline: "none", background: "var(--valkey-pure-white)",
          padding: size === "lg" ? "11.5px" : "10px", borderRadius: "50px",
          border: "1px solid " + (focused ? "var(--valkey-blue-aura)" : "#CCCCCC"),
          fontFamily: "var(--font-body)", fontSize: size === "lg" ? "16px" : "14px",
          color: "var(--color-text)"
        }}
        {...rest}
      />
    </div>
  );
}
