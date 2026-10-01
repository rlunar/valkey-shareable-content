export function Select({ options = [], value, onChange, label, style, ...rest }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...style }}>
      {label ? <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text)" }}>{label}</span> : null}
      <select
        value={value} onChange={onChange}
        style={{
          padding: "4px 10px", borderRadius: "var(--radius-control)", border: "1px solid #AAAAAA",
          background: "var(--valkey-pure-white)", color: "var(--color-text)",
          fontFamily: "var(--font-body)", fontSize: "13px", cursor: "pointer"
        }}
        {...rest}
      >
        {options.map((o, i) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={i} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </span>
  );
}
