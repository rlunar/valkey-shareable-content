const codeThemes = {
  dark: {
    bg: "var(--code-dark-bg)", text: "var(--code-dark-text)",
    keyword: "var(--code-dark-keyword)", def: "var(--code-dark-definition)",
    str: "var(--code-dark-string)", comment: "var(--code-dark-comment)"
  },
  light: {
    bg: "var(--code-light-bg)", text: "var(--code-light-text)",
    keyword: "var(--code-light-keyword)", def: "var(--code-light-definition)",
    str: "var(--code-light-string)", comment: "var(--code-light-comment)"
  }
};

const CODE_TOKEN = /("[^"]*")|(#[^\n]*)|\b(SET|GET|DEL|EXPIRE|HSET|HGETALL|LPUSH|LRANGE|ZADD|INCR|SUBSCRIBE|PUBLISH|CLUSTER|INFO|OK)\b|\b(\d+)\b/g;

function highlight(line, theme) {
  const out = [];
  let last = 0, m, i = 0;
  while ((m = CODE_TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const color = m[1] ? theme.str : m[2] ? theme.comment : m[3] ? theme.keyword : theme.def;
    out.push(<span key={i++} style={{ color }}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({ code = "", theme = "dark", showPrompt = false, lineNumbers = false, style, ...rest }) {
  const t = codeThemes[theme];
  const lines = String(code).replace(/\n$/, "").split("\n");
  return (
    <pre
      style={{
        margin: 0, padding: "20px 24px", overflowX: "auto",
        background: t.bg, color: t.text, borderRadius: "var(--radius-inner)",
        border: theme === "light" ? "1px solid var(--valkey-misty-ice)" : "1px solid transparent",
        font: "400 16px/1.6 var(--font-code)", fontVariantLigatures: "none",
        textAlign: "left", ...style
      }}
      {...rest}
    >
      <code>
        {lines.map((line, i) => (
          <span key={i} style={{ display: "block", minHeight: "1lh" }}>
            {lineNumbers ? (
              <span style={{ display: "inline-block", userSelect: "none", minWidth: "3ch", marginRight: "0.4em", textAlign: "right", opacity: 0.8 }}>{i + 1}</span>
            ) : null}
            {showPrompt ? <span style={{ color: t.def }}>{"127.0.0.1:6379> "}</span> : null}
            {highlight(line, t)}
          </span>
        ))}
      </code>
    </pre>
  );
}
