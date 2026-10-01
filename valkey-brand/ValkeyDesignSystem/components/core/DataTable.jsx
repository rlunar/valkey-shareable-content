export function DataTable({ columns = [], rows = [], emphasis = "indigo", stickyFirstColumn = false, style, ...rest }) {
  const headBg = emphasis === "indigo" ? "var(--valkey-purple-indigo)" : "#F4F4F4";
  const headColor = emphasis === "indigo" ? "var(--valkey-pure-white)" : "#555555";
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", overflowX: "auto", background: "#FAFAFA", ...style }} {...rest}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "15px" }}>
        <thead>
          <tr style={{ background: headBg, color: headColor, fontWeight: "var(--weight-bold)" }}>
            {columns.map((c, i) => (
              <th key={i} style={{
                padding: "10px 12px", textAlign: i === 0 ? "left" : "center",
                borderRight: "1px solid rgb(0 0 0 / 0.08)", position: "sticky", top: 0, background: headBg,
                zIndex: i === 0 ? 3 : 1
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} style={{ background: r % 2 ? "#F9F9F9" : "var(--valkey-pure-white)" }}>
              {row.map((cell, c) => (
                <td key={c} style={{
                  padding: "8px 12px", textAlign: c === 0 ? "left" : "center",
                  borderRight: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0",
                  color: c === 0 ? "#555555" : "#444444", fontWeight: c === 0 ? "var(--weight-bold)" : "var(--weight-regular)",
                  ...(stickyFirstColumn && c === 0 ? { position: "sticky", left: 0, background: "#FAFAFA", zIndex: 2 } : null)
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
