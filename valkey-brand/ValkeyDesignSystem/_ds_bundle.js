/* @ds-bundle: {"format":4,"namespace":"ValkeyDesignSystem_d3b98f","components":[{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"ParticipantCard","sourcePath":"components/brand/ParticipantCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Blockquote","sourcePath":"components/core/Blockquote.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CodeBlock","sourcePath":"components/core/CodeBlock.jsx"},{"name":"DataTable","sourcePath":"components/core/DataTable.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Banner","sourcePath":"components/navigation/Banner.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"ReadMoreLink","sourcePath":"components/navigation/ReadMoreLink.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"0460abe62ddc","components/brand/Logo.jsx":"7e409810679c","components/brand/ParticipantCard.jsx":"10f331f07f1d","components/core/Badge.jsx":"d4dddb359028","components/core/Blockquote.jsx":"119a4c1649c0","components/core/Button.jsx":"2daecd57ea80","components/core/Card.jsx":"ccc23c074a46","components/core/CodeBlock.jsx":"10878eca32af","components/core/DataTable.jsx":"edb4085db9bc","components/forms/SearchInput.jsx":"94ffc0b5ce3c","components/forms/Select.jsx":"77e4e3829807","components/navigation/Banner.jsx":"d3025cb488d0","components/navigation/Breadcrumbs.jsx":"9b60696ffc71","components/navigation/ReadMoreLink.jsx":"6a70ccceacce","components/navigation/SiteFooter.jsx":"084bf256ac3b","components/navigation/SiteHeader.jsx":"e0704e9d8be5","doc-page.js":"f52ae9c02fca","ui_kits/website/app.jsx":"b5144dc17543","ui_kits/website/page-shell.jsx":"dc2127df88f5","ui_kits/website/screen-blog.jsx":"5bbdadf04b47","ui_kits/website/screen-commands.jsx":"1fee0b035a52","ui_kits/website/screen-community.jsx":"ddd252af50fd","ui_kits/website/screen-docs.jsx":"7589cf04d64a","ui_kits/website/screen-home.jsx":"a3690bffc908"},"inlinedExternals":[],"unexposedExports":[{"name":"iconNames","sourcePath":"components/brand/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.ValkeyDesignSystem_d3b98f = window.ValkeyDesignSystem_d3b98f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const iconFiles = {
  github: "IconGithub.svg",
  slack: "IconSlack.svg",
  linkedin: "IconLinkedin.svg",
  mail: "IconMail.svg",
  x: "IconX.svg",
  youtube: "IconYoutube.svg",
  close: "icon-outline-close.svg",
  caret: "caret-right.svg",
  question: "icon-question.svg",
  bug: "icon-bug.svg",
  users: "icon-users.svg",
  bulb: "icon-bulb.svg",
  shield: "icon-sheild.svg",
  book: "icon-book.svg"
};
function Icon({
  name,
  size = 20,
  base = "../../assets/icons/",
  alt,
  style,
  ...rest
}) {
  const file = iconFiles[name];
  if (!file) return null;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: base + file,
    alt: alt === undefined ? name + " icon" : alt,
    width: size,
    height: size,
    style: {
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    }
  }, rest));
}
const iconNames = Object.keys(iconFiles);
Object.assign(__ds_scope, { Icon, iconNames });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const logoFiles = {
  "horizontal-color": {
    file: "valkey-horizontal-color.png",
    ratio: 3196 / 1080
  },
  "horizontal-color-light": {
    file: "valkey-horizontal-color-light.png",
    ratio: 3196 / 1080
  },
  "horizontal-black": {
    file: "valkey-horizontal-black.png",
    ratio: 3196 / 1080
  },
  "horizontal-white": {
    file: "valkey-horizontal-white.png",
    ratio: 3196 / 1080
  },
  "stacked-color": {
    file: "valkey-stacked-color.png",
    ratio: 1256 / 1080
  },
  "stacked-color-light": {
    file: "valkey-stacked-color-light.png",
    ratio: 1256 / 1080
  },
  "stacked-black": {
    file: "valkey-stacked-black.png",
    ratio: 1256 / 1080
  },
  "stacked-white": {
    file: "valkey-stacked-white.png",
    ratio: 1256 / 1080
  },
  "icon-periwinkle": {
    file: "valkey-icon-periwinkle.png",
    ratio: 1
  },
  "icon-black": {
    file: "valkey-icon-black.png",
    ratio: 1
  },
  "icon-white": {
    file: "valkey-icon-white.png",
    ratio: 1
  }
};
const logoMinWidth = {
  horizontal: 120,
  stacked: 96,
  icon: 16
};
function Logo({
  variant = "horizontal-color",
  width = 260,
  base = "../../assets/logos/",
  href,
  clearSpace = false,
  style,
  ...rest
}) {
  const entry = logoFiles[variant] || logoFiles["horizontal-color"];
  const family = variant.split("-")[0];
  const w = Math.max(width, logoMinWidth[family]);
  const img = /*#__PURE__*/React.createElement("img", _extends({
    src: base + entry.file,
    alt: "Valkey",
    width: w,
    height: Math.round(w / entry.ratio),
    style: {
      display: "block",
      ...(clearSpace ? {
        margin: family === "icon" ? w * 0.3 : w * 0.09
      } : null),
      ...style
    }
  }, rest));
  return href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      display: "inline-block"
    }
  }, img) : img;
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/ParticipantCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ParticipantCard({
  name,
  logoSrc,
  offering,
  href,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "button",
    tabIndex: 0,
    onClick: () => href && window.open(href, "_blank"),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-label": "Visit " + name + " website",
    style: {
      minWidth: 0,
      borderRadius: "12px",
      padding: "40px",
      cursor: "pointer",
      background: hover ? "var(--valkey-cold-cream-3)" : "var(--valkey-pure-white)",
      transition: "all var(--duration-slow) var(--ease-standard)",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
      height: "40px"
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: name + " logo",
    loading: "lazy",
    style: {
      objectFit: "contain",
      maxHeight: "40px",
      maxWidth: "100%",
      margin: "0 auto"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: "60px",
      height: "60px",
      background: "var(--valkey-purple-indigo)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--valkey-pure-white)",
      fontSize: "24px",
      fontWeight: "var(--weight-bold)",
      textTransform: "uppercase"
    }
  }, String(name || "").slice(0, 2))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)",
      textAlign: "center",
      margin: "0 0 12px",
      lineHeight: 1.3
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      lineHeight: 1.5,
      color: "var(--color-text-muted)",
      margin: 0,
      textAlign: "center"
    }
  }, offering));
}
Object.assign(__ds_scope, { ParticipantCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ParticipantCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const badgeToneColors = {
  neutral: "var(--valkey-ink-soft)",
  "technical-deep-dive": "#6983FF",
  "community-highlight": "#1F9589",
  "how-to": "#692A84",
  announcements: "#CC9316",
  events: "#DD4A69",
  "first-party": "#6983FF",
  "third-party": "#CC9316",
  "meetup-hackathon": "#1F9589"
};
function Badge({
  children,
  tone = "neutral",
  size = "md",
  style,
  ...rest
}) {
  const dims = size === "sm" ? {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px"
  } : {
    fontSize: "13px",
    padding: "3px 12px",
    borderRadius: "12px"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-block",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--valkey-pure-white)",
      background: badgeToneColors[tone],
      lineHeight: 1.4,
      ...dims,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Blockquote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Blockquote({
  children,
  cite,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("blockquote", _extends({
    style: {
      margin: "1em 0",
      paddingLeft: "1.5em",
      borderLeft: "3px solid var(--valkey-blue-aura)",
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      lineHeight: "var(--leading-body)",
      color: "var(--color-text)",
      ...style
    }
  }, rest), children, cite ? /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: "8px",
      fontSize: "14px",
      color: "var(--color-text-muted)"
    }
  }, cite) : null);
}
Object.assign(__ds_scope, { Blockquote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Blockquote.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: "var(--font-body)",
  fontWeight: "var(--weight-semibold)",
  lineHeight: 1.2,
  textDecoration: "none",
  cursor: "pointer",
  transition: "var(--transition-control)",
  border: "1px solid transparent",
  boxSizing: "border-box"
};
const buttonSizes = {
  sm: {
    fontSize: "14px",
    padding: "8px 16px"
  },
  md: {
    fontSize: "16px",
    padding: "12px 24px"
  },
  lg: {
    fontSize: "22px",
    padding: "8px 15px"
  }
};
const buttonVariants = {
  hero: {
    background: "var(--valkey-gradient-cta-pill)",
    color: "var(--valkey-blue-aura)",
    borderRadius: "30px",
    boxShadow: "var(--shadow-pill)",
    transitionDuration: "var(--duration-slow)"
  },
  outline: {
    background: "transparent",
    color: "var(--valkey-ink-soft)",
    border: "1px solid var(--color-border-subtle)",
    borderRadius: "var(--radius-pill)"
  },
  "outline-dark": {
    background: "transparent",
    color: "var(--valkey-pure-white)",
    border: "1px solid currentColor",
    borderRadius: "24px"
  },
  "outline-ink": {
    background: "transparent",
    color: "#072150",
    border: "1px solid #072150",
    borderRadius: "24px"
  },
  solid: {
    background: "var(--valkey-purple-indigo)",
    color: "var(--valkey-best-white)",
    borderRadius: "var(--radius-control-sm)"
  },
  ghost: {
    background: "transparent",
    color: "var(--color-link)",
    border: "1px solid transparent",
    borderRadius: "var(--radius-pill)",
    textDecoration: "underline"
  }
};
const buttonHovers = {
  hero: {
    boxShadow: "0 6px 14px rgb(0 0 0 / 0.3)"
  },
  outline: {
    background: "var(--valkey-blue-aura)",
    color: "var(--valkey-pure-white)",
    borderColor: "var(--valkey-blue-aura)"
  },
  "outline-dark": {
    background: "var(--valkey-pure-white)",
    color: "var(--valkey-deep-purple)"
  },
  "outline-ink": {
    background: "#072150",
    color: "var(--valkey-pure-white)"
  },
  solid: {
    background: "var(--valkey-black-denim)"
  },
  ghost: {
    color: "var(--valkey-purple-indigo)"
  }
};
function Button({
  children,
  variant = "outline",
  size = "md",
  href,
  as,
  fullWidth = false,
  disabled = false,
  iconSrc,
  iconAlt = "",
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as || (href ? "a" : "button");
  const composed = {
    ...buttonBase,
    ...buttonSizes[size],
    ...buttonVariants[variant],
    ...(hover && !disabled ? buttonHovers[variant] : null),
    ...(fullWidth ? {
      width: "100%"
    } : null),
    ...(disabled ? {
      opacity: 0.4,
      cursor: "not-allowed",
      pointerEvents: "none"
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick,
    disabled: Tag === "button" ? disabled : undefined,
    style: composed,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: iconAlt,
    width: "16",
    height: "16"
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cardSurfaces = {
  light: {
    background: "var(--color-surface-raised)",
    color: "var(--color-text)",
    borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow-card)"
  },
  "light-bordered": {
    background: "var(--color-surface-raised)",
    color: "var(--color-text)",
    borderRadius: "var(--radius-inner)",
    border: "var(--border-hairline)"
  },
  "light-square": {
    background: "var(--color-surface-raised)",
    color: "var(--color-text)",
    borderRadius: 0,
    boxShadow: "none"
  },
  dark: {
    background: "var(--color-surface-card-dark)",
    color: "var(--valkey-pure-white)",
    borderRadius: "var(--radius-card)",
    boxShadow: "none"
  },
  indigo: {
    background: "var(--valkey-purple-indigo)",
    color: "var(--color-on-dark)",
    borderRadius: "var(--radius-card)",
    boxShadow: "none"
  },
  translucent: {
    background: "rgb(255 255 255 / 0.2)",
    color: "var(--valkey-pure-white)",
    borderRadius: "var(--radius-card)",
    boxShadow: "none"
  }
};
const cardPads = {
  sm: "20px",
  md: "30px",
  lg: "40px"
};
function Card({
  children,
  surface = "light",
  padding = "md",
  title,
  description,
  actions,
  iconSrc,
  iconAlt = "",
  raiseOnHover = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dark = surface === "dark" || surface === "indigo" || surface === "translucent";
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: cardPads[padding],
      fontFamily: "var(--font-body)",
      transition: "box-shadow var(--duration-base) var(--ease-standard)",
      ...cardSurfaces[surface],
      ...(raiseOnHover && hover ? {
        boxShadow: "var(--shadow-card-hover)"
      } : null),
      ...style
    }
  }, rest), iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: iconAlt,
    width: "48",
    height: "48",
    style: {
      marginBottom: "12px",
      alignSelf: "center"
    }
  }) : null, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-bold)",
      fontSize: "20px",
      lineHeight: "var(--leading-heading)",
      margin: "0 0 8px",
      color: dark ? "var(--valkey-pure-white)" : "var(--color-heading)",
      textAlign: dark ? "center" : "left"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "17px",
      lineHeight: "var(--leading-body)"
    }
  }, description) : null, children, actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "auto",
      paddingTop: "20px"
    }
  }, actions) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/CodeBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codeThemes = {
  dark: {
    bg: "var(--code-dark-bg)",
    text: "var(--code-dark-text)",
    keyword: "var(--code-dark-keyword)",
    def: "var(--code-dark-definition)",
    str: "var(--code-dark-string)",
    comment: "var(--code-dark-comment)"
  },
  light: {
    bg: "var(--code-light-bg)",
    text: "var(--code-light-text)",
    keyword: "var(--code-light-keyword)",
    def: "var(--code-light-definition)",
    str: "var(--code-light-string)",
    comment: "var(--code-light-comment)"
  }
};
const CODE_TOKEN = /("[^"]*")|(#[^\n]*)|\b(SET|GET|DEL|EXPIRE|HSET|HGETALL|LPUSH|LRANGE|ZADD|INCR|SUBSCRIBE|PUBLISH|CLUSTER|INFO|OK)\b|\b(\d+)\b/g;
function highlight(line, theme) {
  const out = [];
  let last = 0,
    m,
    i = 0;
  while ((m = CODE_TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const color = m[1] ? theme.str : m[2] ? theme.comment : m[3] ? theme.keyword : theme.def;
    out.push(/*#__PURE__*/React.createElement("span", {
      key: i++,
      style: {
        color
      }
    }, m[0]));
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
function CodeBlock({
  code = "",
  theme = "dark",
  showPrompt = false,
  lineNumbers = false,
  style,
  ...rest
}) {
  const t = codeThemes[theme];
  const lines = String(code).replace(/\n$/, "").split("\n");
  return /*#__PURE__*/React.createElement("pre", _extends({
    style: {
      margin: 0,
      padding: "20px 24px",
      overflowX: "auto",
      background: t.bg,
      color: t.text,
      borderRadius: "var(--radius-inner)",
      border: theme === "light" ? "1px solid var(--valkey-misty-ice)" : "1px solid transparent",
      font: "400 16px/1.6 var(--font-code)",
      fontVariantLigatures: "none",
      textAlign: "left",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("code", null, lines.map((line, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "block",
      minHeight: "1lh"
    }
  }, lineNumbers ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      userSelect: "none",
      minWidth: "3ch",
      marginRight: "0.4em",
      textAlign: "right",
      opacity: 0.8
    }
  }, i + 1) : null, showPrompt ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.def
    }
  }, "127.0.0.1:6379> ") : null, highlight(line, t)))));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DataTable({
  columns = [],
  rows = [],
  emphasis = "indigo",
  stickyFirstColumn = false,
  style,
  ...rest
}) {
  const headBg = emphasis === "indigo" ? "var(--valkey-purple-indigo)" : "#F4F4F4";
  const headColor = emphasis === "indigo" ? "var(--valkey-pure-white)" : "#555555";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-control)",
      overflowX: "auto",
      background: "#FAFAFA",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-body)",
      fontSize: "15px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: headBg,
      color: headColor,
      fontWeight: "var(--weight-bold)"
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: "10px 12px",
      textAlign: i === 0 ? "left" : "center",
      borderRight: "1px solid rgb(0 0 0 / 0.08)",
      position: "sticky",
      top: 0,
      background: headBg,
      zIndex: i === 0 ? 3 : 1
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, r) => /*#__PURE__*/React.createElement("tr", {
    key: r,
    style: {
      background: r % 2 ? "#F9F9F9" : "var(--valkey-pure-white)"
    }
  }, row.map((cell, c) => /*#__PURE__*/React.createElement("td", {
    key: c,
    style: {
      padding: "8px 12px",
      textAlign: c === 0 ? "left" : "center",
      borderRight: "1px solid #E0E0E0",
      borderBottom: "1px solid #E0E0E0",
      color: c === 0 ? "#555555" : "#444444",
      fontWeight: c === 0 ? "var(--weight-bold)" : "var(--weight-regular)",
      ...(stickyFirstColumn && c === 0 ? {
        position: "sticky",
        left: 0,
        background: "#FAFAFA",
        zIndex: 2
      } : null)
    }
  }, cell)))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchInput({
  label,
  placeholder = "Search commands...",
  value,
  onChange,
  size = "md",
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      borderBottom: "1px solid rgb(104 147 238)",
      paddingBottom: size === "lg" ? "20px" : "10px",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      color: "var(--color-text)",
      whiteSpace: "nowrap"
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    type: "text",
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      minWidth: 0,
      outline: "none",
      background: "var(--valkey-pure-white)",
      padding: size === "lg" ? "11.5px" : "10px",
      borderRadius: "50px",
      border: "1px solid " + (focused ? "var(--valkey-blue-aura)" : "#CCCCCC"),
      fontFamily: "var(--font-body)",
      fontSize: size === "lg" ? "16px" : "14px",
      color: "var(--color-text)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  options = [],
  value,
  onChange,
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--color-text)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    style: {
      padding: "4px 10px",
      borderRadius: "var(--radius-control)",
      border: "1px solid #AAAAAA",
      background: "var(--valkey-pure-white)",
      color: "var(--color-text)",
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      cursor: "pointer"
    }
  }, rest), options.map((o, i) => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: i,
      value: opt.value
    }, opt.label);
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Banner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Banner({
  children,
  onClose,
  dismissible = true,
  style,
  ...rest
}) {
  const [closed, setClosed] = React.useState(false);
  if (closed) return null;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: "var(--valkey-deep-purple)",
      color: "var(--valkey-pure-white)",
      fontFamily: "var(--font-body)",
      fontSize: "16px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "10px 56px 10px 20px",
      textAlign: "center"
    }
  }, children), dismissible ? /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Close banner",
    onClick: e => {
      e.preventDefault();
      setClosed(true);
      if (onClose) onClose();
    },
    style: {
      position: "absolute",
      top: "50%",
      right: "20px",
      marginTop: "-12px",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/icon-outline-close.svg",
    alt: "Icon Close",
    width: "16",
    height: "16"
  })) : null);
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Banner.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumbs({
  items = [],
  caretSrc = "../../assets/icons/caret-right.svg",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      borderRadius: "var(--radius-card)",
      background: "var(--valkey-pure-white)",
      marginBottom: "20px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      listStyle: "none",
      margin: 0,
      gap: "5px",
      fontFamily: "var(--font-body)"
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "var(--color-text)"
    }
  }, i > 0 ? /*#__PURE__*/React.createElement("img", {
    src: caretSrc,
    alt: "",
    width: "8",
    height: "10",
    style: {
      marginRight: "5px"
    }
  }) : null, item.href ? /*#__PURE__*/React.createElement("a", {
    href: item.href,
    style: {
      color: "var(--valkey-link-blue)",
      textDecoration: "underline",
      fontWeight: "var(--weight-semibold)"
    }
  }, item.label) : /*#__PURE__*/React.createElement("span", {
    "aria-current": "page"
  }, item.label)))));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ReadMoreLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ReadMoreLink({
  children = "Read more",
  href = "#",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      display: "inline-block",
      margin: "0.4em 0 0.8em",
      textDecoration: hover ? "underline" : "none",
      textTransform: "uppercase",
      fontWeight: "var(--weight-bold)",
      color: "var(--valkey-link-blue)",
      letterSpacing: "0.02em",
      ...style
    }
  }, rest), children, " \u203A");
}
Object.assign(__ds_scope, { ReadMoreLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ReadMoreLink.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const footerSocials = [{
  label: "Slack",
  href: "https://valkey.io/slack",
  icon: "IconSlack.svg",
  size: 20
}, {
  label: "GitHub",
  href: "https://github.com/valkey-io",
  icon: "IconGithub.svg",
  size: 20
}, {
  label: "LinkedIn",
  href: "https://www.linkedin.com/company/valkey/",
  icon: "IconLinkedin.svg",
  size: 20
}, {
  label: "X.com",
  href: "https://x.com/valkey_io",
  icon: "IconX.svg",
  size: 20
}, {
  label: "YouTube",
  href: "https://www.youtube.com/@valkeyproject",
  icon: "IconYoutube.svg",
  size: 24
}, {
  label: "Connect",
  href: "/connect",
  icon: "IconMail.svg",
  size: 20
}];
const footerLinks = [{
  label: "Code of Conduct",
  href: "/code_of_conduct"
}, {
  label: "Meetup Groups",
  href: "/community/meetup-groups/"
}, {
  label: "Forum",
  href: "https://github.com/orgs/valkey-io/discussions"
}, {
  label: "About",
  href: "/about"
}, {
  label: "Leadership",
  href: "/leadership"
}, {
  label: "FAQ",
  href: "/topics/faq"
}];
function SiteFooter({
  iconBase = "../../assets/icons/",
  showLegal = true,
  style,
  ...rest
}) {
  const band = {
    background: "var(--valkey-black-denim)",
    color: "var(--valkey-pure-white)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    padding: "20px 0"
  };
  const row = {
    display: "flex",
    flexWrap: "wrap",
    margin: "0 auto",
    width: "100%",
    maxWidth: "var(--layout-max)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: band
  }, /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 50%",
      padding: "0 20px",
      display: "flex",
      flexDirection: "row",
      gap: "15px",
      flexWrap: "wrap"
    }
  }, footerSocials.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      color: "var(--valkey-pure-white)",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: iconBase + s.icon,
    alt: s.label + " Icon",
    width: s.size,
    height: s.size
  }), s.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 50%",
      padding: "0 20px",
      display: "flex",
      flexDirection: "row",
      gap: "15px",
      justifyContent: "flex-end",
      flexWrap: "wrap"
    }
  }, footerLinks.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    style: {
      color: "var(--valkey-pure-white)",
      textDecoration: "underline"
    }
  }, l.label))))), showLegal ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...band,
      borderTop: "1px solid rgb(255 255 255 / 0.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      padding: "20px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "720px",
      margin: "8px auto"
    }
  }, "\xA9 Valkey contributors."), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "720px",
      margin: "8px auto"
    }
  }, "Valkey and the Valkey logo are trademarks of LF Projects, LLC."), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "720px",
      margin: "8px auto"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://lfprojects.org/policies/trademark-policy/",
    style: {
      color: "var(--valkey-blue-aura)"
    }
  }, "Trademark Policy"), ".", " ", /*#__PURE__*/React.createElement("a", {
    href: "https://lfprojects.org/policies/privacy-policy/",
    style: {
      color: "var(--valkey-blue-aura)"
    }
  }, "Privacy Policy"), ".", " ", /*#__PURE__*/React.createElement("a", {
    href: "https://lfprojects.org/policies/terms-of-use/",
    style: {
      color: "var(--valkey-blue-aura)"
    }
  }, "Terms of Use"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "720px",
      margin: "8px auto"
    }
  }, "Logo design by ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/dizys",
    style: {
      color: "var(--valkey-blue-aura)"
    }
  }, "Ziyang.")))) : null);
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HeaderLink({
  item,
  active
}) {
  const [hover, setHover] = React.useState(false);
  const hasSub = item.submenu && item.submenu.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("a", {
    href: item.href,
    role: "menuitem",
    style: {
      whiteSpace: "nowrap",
      color: "inherit",
      cursor: "pointer",
      padding: "10px 0",
      textDecoration: "none",
      borderBottom: "3px solid " + (active || hover ? "currentColor" : "transparent")
    }
  }, item.label), hasSub && hover ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 9,
      display: "flex",
      flexFlow: "column nowrap",
      background: "var(--valkey-pure-white)",
      minWidth: "100%",
      boxShadow: "var(--shadow-menu)",
      padding: "4px 0"
    }
  }, item.submenu.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    role: "menuitem",
    style: {
      padding: "5px 16px",
      color: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap"
    }
  }, s.label))) : null);
}
function SiteHeader({
  items,
  active,
  logoSrc = "../../assets/logos/valkey-horizontal-color.png",
  starCount,
  style,
  ...rest
}) {
  const nav = items || [{
    label: "Download",
    href: "/download/"
  }, {
    label: "Documentation",
    href: "/docs/",
    submenu: [{
      label: "Command Reference",
      href: "/commands/"
    }, {
      label: "Documentation by Topic",
      href: "/topics/"
    }, {
      label: "Client Libraries",
      href: "/clients/"
    }]
  }, {
    label: "Blog",
    href: "/blog/"
  }, {
    label: "Community",
    href: "/community/",
    submenu: [{
      label: "Events",
      href: "/events/"
    }]
  }, {
    label: "Participants",
    href: "/participants/"
  }, {
    label: "Try Valkey",
    href: "/try-valkey/"
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: "100%",
      margin: "0 auto",
      borderBottom: "1px solid #DDDDDD",
      background: "var(--valkey-pure-white)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: "var(--layout-max)",
      minHeight: "var(--header-height)",
      width: "100%",
      margin: "0 auto",
      padding: "0 20px",
      color: "var(--valkey-blue-aura)",
      fontFamily: "var(--font-body)",
      fontSize: "16px",
      fontWeight: "var(--weight-semibold)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    style: {
      display: "flex",
      gap: "10px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Valkey Logo",
    width: "130",
    height: "44",
    style: {
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("nav", {
    role: "navigation",
    "aria-label": "Main",
    style: {
      display: "flex",
      flexFlow: "row nowrap",
      gap: "30px",
      alignItems: "center"
    }
  }, nav.map(item => /*#__PURE__*/React.createElement(HeaderLink, {
    key: item.label,
    item: item,
    active: active === item.label
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/valkey-io",
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "5px 10px",
      background: "#F8F9FA",
      border: "1px solid #DFE1E4",
      borderRadius: "6px",
      color: "#444444",
      textDecoration: "none",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/IconGithub.svg",
    alt: "GitHub Icon",
    width: "16",
    height: "16",
    style: {
      filter: "grayscale(1) brightness(0.3)"
    }
  }), "GitHub", starCount ? /*#__PURE__*/React.createElement("span", {
    style: {
      background: "#F1F5F9",
      color: "#64748B",
      fontSize: "12px",
      padding: "2px 6px",
      borderRadius: "10px",
      fontWeight: 500,
      border: "1px solid #E2E8F0"
    }
  }, starCount) : null))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/website/app.jsx
try { (() => {
const screenForLabel = {
  Home: "home",
  Download: "home",
  Documentation: "docs",
  "Command Reference": "commands",
  "Documentation by Topic": "docs",
  "Client Libraries": "docs",
  Blog: "blog",
  Community: "community",
  Events: "community",
  Participants: "home",
  "Try Valkey": "home"
};
function WebsiteApp() {
  const [screen, setScreen] = React.useState(() => localStorage.getItem("valkey-uikit-screen") || "home");
  React.useEffect(() => {
    localStorage.setItem("valkey-uikit-screen", screen);
  }, [screen]);
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
    if (img) {
      e.preventDefault();
      setScreen("home");
    }
  }
  const Screen = {
    home: window.HomeScreen,
    docs: window.DocsScreen,
    commands: window.CommandsScreen,
    blog: window.BlogScreen,
    community: window.CommunityScreen
  }[screen];
  return /*#__PURE__*/React.createElement("div", {
    onClickCapture: handleLogo,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement(Screen, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(WebsiteApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/page-shell.jsx
try { (() => {
const {
  Banner,
  SiteHeader,
  SiteFooter
} = window.ValkeyDesignSystem_d3b98f;
function StyledTitle({
  title,
  description
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundImage: "var(--valkey-gradient-page-title)",
      padding: "80px 20px",
      textAlign: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: 1,
      color: "#fff",
      margin: "0 auto",
      padding: 0
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "20px auto 0",
      maxWidth: "800px",
      color: "#fff",
      lineHeight: 1.4,
      fontSize: "18px"
    }
  }, description) : null);
}

/** Two-column page: white rounded content card on the #E2E8F0 field, #F1F0FA aside. */
function ArticleLayout({
  children,
  aside,
  asideImage,
  squareInner = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--valkey-page-shade)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      flexDirection: "row-reverse",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: asideImage ? "transparent" : "var(--valkey-aside-shade)",
      padding: "20px",
      width: "100%",
      maxWidth: "420px",
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      color: "#4C636F",
      ...(asideImage ? {
        backgroundImage: "url('" + asideImage + "')",
        backgroundColor: "var(--valkey-aside-shade)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom"
      } : null)
    }
  }, aside), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: "20px",
      width: "67%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      background: "#fff",
      borderRadius: squareInner ? 0 : "20px",
      padding: "10px 20px 20px"
    }
  }, children))));
}
function AsideLinkList({
  items
}) {
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 20px"
    }
  }, items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "block",
      background: "var(--valkey-aside-link)",
      padding: "12px",
      marginBottom: "10px",
      color: "#000",
      textTransform: "uppercase",
      cursor: "pointer",
      fontWeight: 600,
      textDecoration: "none",
      fontSize: "14px"
    }
  }, i))));
}
function AsideHeading({
  children
}) {
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "15px",
      margin: "0 0 4px",
      fontWeight: 700,
      color: "#000",
      textTransform: "uppercase",
      fontFamily: "var(--font-body)"
    }
  }, children);
}
function PageChrome({
  children,
  active
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Banner, null, /*#__PURE__*/React.createElement("strong", null, "Save Your Spot for ValkeyConf 2026"), " | October 5, 2026 | Prague, Czechia"), /*#__PURE__*/React.createElement(SiteHeader, {
    active: active,
    logoSrc: "../../assets/logos/valkey-horizontal-color.png",
    starCount: "21.4k"
  }), children, /*#__PURE__*/React.createElement(SiteFooter, {
    iconBase: "../../assets/icons/"
  }));
}
Object.assign(window, {
  StyledTitle,
  ArticleLayout,
  AsideLinkList,
  AsideHeading,
  PageChrome
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/page-shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screen-blog.jsx
try { (() => {
const {
  Badge,
  Select,
  Button
} = window.ValkeyDesignSystem_d3b98f;
const blogPosts = [{
  type: "Announcements",
  tone: "announcements",
  title: "Valkey 9.0 is here",
  date: "Wednesday August 12, 2026",
  description: "Valkey 9.0 adds atomic slot migration, a smaller per-key memory footprint, and dual channel replication on by default."
}, {
  type: "Technical Deep Dive",
  tone: "technical-deep-dive",
  title: "Inside the Valkey cluster bus",
  date: "Tuesday July 28, 2026",
  description: "How nodes gossip, detect failure, and agree on slot ownership, with packet-level walkthroughs and the timeouts that matter."
}, {
  type: "How-to",
  tone: "how-to",
  title: "Migrating from a single node to a cluster",
  date: "Thursday July 9, 2026",
  description: "A step-by-step migration path that keeps reads available, including the client-side changes you need to plan for."
}, {
  type: "Community Highlight",
  tone: "community-highlight",
  title: "Meet the contributors behind valkey-glide",
  date: "Monday June 22, 2026",
  description: "The maintainers of the official multi-language client library on API design, testing across runtimes, and what they need help with."
}, {
  type: "Events",
  tone: "events",
  title: "ValkeyConf 2026 call for proposals",
  date: "Friday June 5, 2026",
  description: "Submit a talk for the Prague program. Sessions cover operations at scale, internals, client libraries, and migration stories."
}];
function BlogScreen() {
  const {
    StyledTitle,
    ArticleLayout,
    AsideHeading,
    PageChrome
  } = window;
  const [type, setType] = React.useState("All Types");
  const shown = type === "All Types" ? blogPosts : blogPosts.filter(p => p.type === type);
  return /*#__PURE__*/React.createElement(PageChrome, {
    active: "Blog"
  }, /*#__PURE__*/React.createElement(StyledTitle, {
    title: "Blog",
    description: "News, deep dives and community stories from the Valkey project."
  }), /*#__PURE__*/React.createElement(ArticleLayout, {
    squareInner: true,
    aside: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AsideHeading, null, "Featured"), blogPosts.slice(0, 3).map(p => /*#__PURE__*/React.createElement("div", {
      key: p.title,
      style: {
        display: "flex",
        background: "#fff",
        borderRadius: "10px",
        marginBottom: "20px",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "1 1 100%",
        padding: "12.5px"
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        margin: "0 0 12.5px",
        fontSize: "16px",
        fontFamily: "var(--font-display)"
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "#000",
        textDecoration: "none"
      }
    }, p.title)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 12.5px",
        fontSize: "14px",
        lineHeight: 1.45,
        color: "var(--color-text-muted)"
      }
    }, p.description), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      style: {
        float: "right"
      }
    }, "Read more")))))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "15px",
      paddingTop: "10px"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Filter posts by type",
    value: type,
    onChange: e => setType(e.target.value),
    options: ["All Types", ...blogPosts.map(p => p.type)]
  })), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, shown.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.title,
    style: {
      background: "#fff",
      padding: "20px",
      marginBottom: "20px",
      borderBottom: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.tone,
    size: "sm"
  }, p.type), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0",
      fontSize: "24px",
      fontFamily: "var(--font-display)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--color-heading)",
      textDecoration: "none"
    }
  }, p.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "2px",
      fontSize: "14px",
      color: "var(--color-text-muted)"
    }
  }, p.date), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, p.description), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: "12px",
      textTransform: "uppercase",
      fontWeight: 700,
      color: "#747BFF",
      textDecoration: "none"
    }
  }, "Read more \u203A")))), shown.length === 0 ? /*#__PURE__*/React.createElement("p", null, "No posts match this filter.") : null));
}
Object.assign(window, {
  BlogScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screen-blog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screen-commands.jsx
try { (() => {
const {
  SearchInput
} = window.ValkeyDesignSystem_d3b98f;
const commandGroups = [{
  id: "string",
  display: "String",
  description: "Commands that operate on string values.",
  entries: [["APPEND", "Appends a string to the value of a key. Returns the new length of the string."], ["GET", "Returns the string value of a key."], ["GETRANGE", "Returns a substring of the string stored at a key."], ["INCR", "Increments the integer value of a key by one. Uses 0 as initial value if the key doesn't exist."], ["SET", "Sets the string value of a key, ignoring its type. The key is created if it doesn't exist."]]
}, {
  id: "hash",
  display: "Hash",
  description: "Commands that operate on hash fields.",
  entries: [["HDEL", "Deletes one or more fields and their values from a hash. Deletes the hash if no fields remain."], ["HGETALL", "Returns all fields and values in a hash."], ["HSET", "Creates or modifies the value of a field in a hash."]]
}, {
  id: "cluster",
  display: "Cluster",
  description: "Commands for cluster management and introspection.",
  entries: [["CLUSTER INFO", "Returns information about the state of a node."], ["CLUSTER SHARDS", "Returns the mapping of cluster slots to shards."], ["CLUSTER MYID", "Returns the ID of a node."]]
}, {
  id: "pubsub",
  display: "Pub/Sub",
  description: "Commands for publish and subscribe messaging.",
  entries: [["PUBLISH", "Posts a message to a channel."], ["SUBSCRIBE", "Listens for messages published to channels."]]
}];
function CommandsScreen() {
  const {
    StyledTitle,
    ArticleLayout,
    AsideHeading,
    PageChrome
  } = window;
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const filtered = commandGroups.map(g => ({
    ...g,
    entries: g.entries.filter(([name]) => name.toLowerCase().includes(q))
  })).filter(g => g.entries.length > 0);
  return /*#__PURE__*/React.createElement(PageChrome, {
    active: "Documentation"
  }, /*#__PURE__*/React.createElement(StyledTitle, {
    title: "Documentation: Command Reference"
  }), /*#__PURE__*/React.createElement(ArticleLayout, {
    aside: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AsideHeading, null, "Command Categories"), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: "0 0 20px",
        lineHeight: 2
      }
    }, commandGroups.map(g => /*#__PURE__*/React.createElement("li", {
      key: g.id
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--valkey-link-blue)"
      }
    }, g.display)))), /*#__PURE__*/React.createElement(AsideHeading, null, "Alphabetical Command List"), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        lineHeight: 1.9,
        fontFamily: "var(--font-code)",
        fontSize: "14px"
      }
    }, commandGroups.flatMap(g => g.entries.map(([n]) => n)).sort().map(n => /*#__PURE__*/React.createElement("li", {
      key: n
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--valkey-link-blue)"
      }
    }, n)))))
  }, /*#__PURE__*/React.createElement(SearchInput, {
    label: "Search Commands:",
    placeholder: "Search commands...",
    value: query,
    onChange: e => setQuery(e.target.value),
    style: {
      margin: "10px 0 20px"
    }
  }), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--color-heading)",
      padding: "50px 20px 70px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "60px",
      fontWeight: 800,
      fontFamily: "var(--font-code)"
    }
  }, "</>"), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: "17.5px",
      margin: "7.5px 0",
      fontFamily: "var(--font-display)"
    }
  }, "We couldn't find any results matching your search"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "17.5px",
      margin: 0
    }
  }, "Check your spelling or try different keywords")) : filtered.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      borderBottom: "1px solid var(--color-border)",
      paddingBottom: "10px",
      margin: "0 0 0",
      fontSize: "24px",
      fontFamily: "var(--font-display)",
      color: "var(--color-heading)"
    }
  }, g.display, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      fontSize: "16px",
      fontFamily: "var(--font-body)",
      color: "var(--color-text-muted)"
    }
  }, g.description)), g.entries.map(([name, summary]) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      fontSize: "15px",
      borderBottom: "1px solid var(--color-border)",
      padding: "12.5px 0",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-code)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)",
      textDecoration: "underline"
    }
  }, name)), " ", summary)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)"
    }
  }, "Back to top")))))));
}
Object.assign(window, {
  CommandsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screen-commands.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screen-community.jsx
try { (() => {
const {
  Card,
  Button,
  Icon
} = window.ValkeyDesignSystem_d3b98f;
const communityCards = [{
  icon: "question",
  title: "Ask Questions",
  description: "If you have any inquiries about Valkey, feel free to join the conversation on our GitHub discussions or chat with us on Slack.",
  links: ["GitHub Repository", "Slack"]
}, {
  icon: "bug",
  title: "Report Bugs",
  description: "If you encounter any issues while using Valkey, please help us improve the project by filing a bug report at our GitHub repository.",
  links: ["GitHub Repository"]
}, {
  icon: "users",
  title: "Connect on Social Media",
  description: "Stay updated and connect with us on our social media platforms.",
  links: ["LinkedIn", "Bluesky", "Twitter"]
}, {
  icon: "bulb",
  title: "Suggest Features",
  description: "We value your ideas! If you have a suggestion for a new feature, please submit a feature request on our GitHub.",
  links: ["GitHub"]
}, {
  icon: "shield",
  title: "Security Concerns",
  description: "For any potential security issues, please refer to our Security Policy.",
  links: ["Learn more"]
}, {
  icon: "book",
  title: "Community Conduct",
  description: "If you experience any issues with community members behavior, kindly check our Code of Conduct for guidance.",
  links: ["Learn more"]
}];
const iconFileFor = {
  question: "icon-question.svg",
  bug: "icon-bug.svg",
  users: "icon-users.svg",
  bulb: "icon-bulb.svg",
  shield: "icon-sheild.svg",
  book: "icon-book.svg"
};
function CommunityScreen() {
  const {
    PageChrome
  } = window;
  return /*#__PURE__*/React.createElement(PageChrome, {
    active: "Community"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--valkey-community-shade)",
      textAlign: "center",
      paddingBottom: "60px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      textAlign: "center",
      backgroundImage: "var(--valkey-gradient-page-title)",
      padding: "80px",
      margin: "0 0 50px",
      fontSize: "40px",
      fontWeight: 700,
      lineHeight: 1,
      color: "#fff",
      fontFamily: "var(--font-display)"
    }
  }, "Community"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "var(--color-heading)",
      fontSize: "32.5px",
      fontWeight: 700,
      marginBottom: 0,
      fontFamily: "var(--font-display)"
    }
  }, "How to Contribute with us?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-heading)",
      margin: "10px 0 0",
      fontSize: "18px"
    }
  }, "We welcome your involvement in the Valkey community! Here are several ways you can contribute:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "25px",
      maxWidth: "1100px",
      margin: "30px auto 0",
      padding: "0 30px"
    }
  }, communityCards.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.title,
    surface: "light",
    padding: "md",
    raiseOnHover: true,
    iconSrc: "../../assets/icons/" + iconFileFor[c.icon],
    style: {
      borderRadius: "18px",
      alignItems: "center"
    },
    actions: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "7px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%"
      }
    }, c.links.map(l => /*#__PURE__*/React.createElement(Button, {
      key: l,
      variant: "outline-ink",
      size: "sm"
    }, l)))
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "20px",
      fontWeight: 700,
      color: "var(--valkey-deep-purple)",
      margin: "0 0 7px",
      textAlign: "center",
      fontFamily: "var(--font-display)"
    }
  }, c.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#3A3A4D",
      fontSize: "17.5px",
      margin: "0 0 15px",
      textAlign: "left",
      lineHeight: 1.6
    }
  }, c.description))))));
}
Object.assign(window, {
  CommunityScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screen-community.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screen-docs.jsx
try { (() => {
const {
  Breadcrumbs,
  CodeBlock,
  Blockquote,
  DataTable
} = window.ValkeyDesignSystem_d3b98f;
const topicIndex = ["ACL", "Bitmaps", "Client eviction", "Cluster tutorial", "Configuration", "Data types", "Distributed locks", "Expiration", "Functions", "Hashes", "Keyspace notifications", "Latency monitoring", "LRU cache", "Modules", "Pipelining", "Pub/Sub", "Quickstart", "Replication", "Sentinel", "Streams", "Transactions"];
function DocsScreen() {
  const {
    StyledTitle,
    ArticleLayout,
    AsideLinkList,
    AsideHeading,
    PageChrome
  } = window;
  return /*#__PURE__*/React.createElement(PageChrome, {
    active: "Documentation"
  }, /*#__PURE__*/React.createElement(StyledTitle, {
    title: "Documentation: Quickstart"
  }), /*#__PURE__*/React.createElement(ArticleLayout, {
    asideImage: "../../assets/img/aside-banner.webp",
    aside: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AsideHeading, null, "On this page"), /*#__PURE__*/React.createElement(AsideLinkList, {
      items: ["Install Valkey", "Start the server", "Connect with valkey-cli", "Next steps"]
    }), /*#__PURE__*/React.createElement(AsideHeading, null, "Alphabetical Index"), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        lineHeight: 1.9
      }
    }, topicIndex.map(t => /*#__PURE__*/React.createElement("li", {
      key: t
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--valkey-link-blue)"
      }
    }, t)))))
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    caretSrc: "../../assets/icons/caret-right.svg",
    items: [{
      label: "Topics",
      href: "#"
    }, {
      label: "Quickstart"
    }],
    style: {
      background: "var(--valkey-page-shade)"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "10px 0 5px",
      color: "var(--color-heading)",
      fontSize: "30px",
      fontWeight: 600,
      fontFamily: "var(--font-display)"
    }
  }, "Quickstart"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      display: "block",
      margin: "0 0 20px",
      color: "var(--color-text-muted)"
    }
  }, "Updated August 12, 2026"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, "This guide takes you from an empty machine to a running Valkey server with a client attached. It assumes you can run commands in a terminal and have permission to install packages."), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "40px 0 5px",
      color: "var(--color-heading)",
      fontSize: "24px",
      fontFamily: "var(--font-display)"
    }
  }, "Install Valkey"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, "Install from a container image, a package manager, or a release tarball. The container image is the fastest way to get started:"), /*#__PURE__*/React.createElement(CodeBlock, {
    code: "docker run --rm --name valkey -p 6379:6379 valkey/valkey:9"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "40px 0 5px",
      color: "var(--color-heading)",
      fontSize: "24px",
      fontFamily: "var(--font-display)"
    }
  }, "Connect with valkey-cli"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, "Open a second terminal and start the CLI. Every command echoes its reply, so you can confirm each step as you go."), /*#__PURE__*/React.createElement(CodeBlock, {
    showPrompt: true,
    code: "SET mykey \"Hello\"\nGET mykey\nEXPIRE mykey 60\nTTL mykey"
  }), /*#__PURE__*/React.createElement(Blockquote, {
    cite: "Valkey Brand Guidelines v2.0"
  }, "Preserve exact capitalization, commands, configuration keys, and output in technical examples."), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "40px 0 5px",
      color: "var(--color-heading)",
      fontSize: "24px",
      fontFamily: "var(--font-display)"
    }
  }, "Deployment modes"), /*#__PURE__*/React.createElement(DataTable, {
    columns: ["Mode", "Replication", "Automatic failover", "Slots"],
    rows: [["Standalone", "Optional", "No", "—"], ["Standalone + Sentinel", "Yes", "Yes", "—"], ["Cluster", "Yes", "Yes", "16384"]],
    style: {
      margin: "20px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid var(--color-border)",
      fontSize: "16px"
    }
  }, "See an error? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)"
    }
  }, "Update this Page on GitHub!"))));
}
Object.assign(window, {
  DocsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screen-docs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screen-home.jsx
try { (() => {
const {
  Banner,
  SiteHeader,
  SiteFooter,
  Button,
  Card,
  ParticipantCard,
  ReadMoreLink,
  CodeBlock
} = window.ValkeyDesignSystem_d3b98f;
const homeDocCards = [{
  title: "Install",
  description: "Step-by-step instructions on how to install and configure Valkey for first-time users.",
  cta: "See Installation Guide"
}, {
  title: "Usage guide",
  description: "Detailed documentation on the various datatype supported by Valkey and best practices.",
  cta: "Documentation by topic"
}, {
  title: "Valkey API",
  description: "View the full list of Valkey commands including first party modules.",
  cta: "Command Reference"
}, {
  title: "Clients",
  description: "Official Valkey client libraries include support for:",
  features: ["Python", "Java", "Go", "Node.js", "PHP", "C#", "Ruby"],
  cta: "Learn More"
}];
const homeParticipants = [{
  name: "Amazon Web Services",
  logo: "aws.svg",
  offering: "Amazon ElastiCache and Amazon MemoryDB offer Valkey-compatible in-memory services."
}, {
  name: "Google Cloud",
  logo: "gcp.svg",
  offering: "Memorystore for Valkey provides a fully managed Valkey service."
}, {
  name: "Aiven",
  logo: "aiven.svg",
  offering: "Aiven for Valkey is a fully managed in-memory datastore."
}, {
  name: "Percona",
  logo: "percona.svg",
  offering: "Percona provides support, services and packaging for Valkey."
}, {
  name: "Momento",
  logo: "momento.svg",
  offering: "Momento Cache offers a serverless Valkey-compatible cache."
}, {
  name: "Ericsson",
  logo: "ericsson.svg",
  offering: "Ericsson contributes to Valkey for telecom-scale workloads."
}, {
  name: "ByteDance",
  logo: "bytedance.svg",
  offering: "ByteDance runs and contributes to Valkey at large scale."
}, {
  name: "DigitalOcean",
  logo: "digitalocean.svg",
  offering: "DigitalOcean Managed Caching supports Valkey."
}, {
  name: "Heroku",
  logo: "heroku.svg",
  offering: "Heroku Key-Value Store is built on Valkey."
}];
const homeSidebar = [{
  title: "Featured repositories",
  links: ["valkey-io/valkey", "valkey-io/valkey-glide", "valkey-io/valkey-bloom", "valkey-io/valkey-json"],
  more: "All repos in the Valkey GitHub organization"
}];
function HomeHero() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "100px 20px",
      textAlign: "center",
      backgroundColor: "#30186E",
      backgroundImage: "linear-gradient(to bottom, rgba(48,24,110,0.15), rgba(48,24,110,0.75)), url('../../assets/img/hero-bg.webp')",
      backgroundSize: "cover",
      backgroundPosition: "right center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1200px",
      zIndex: 1,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "70px",
      fontWeight: 700,
      margin: 0,
      lineHeight: 1,
      letterSpacing: "2px",
      color: "#fff"
    }
  }, "FAST. RELIABLE."), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "70px",
      fontWeight: 700,
      margin: 0,
      lineHeight: 1,
      letterSpacing: "2px",
      color: "#fff"
    }
  }, "OPEN SOURCE, FOREVER."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      fontWeight: 700,
      maxWidth: "800px",
      margin: "20px auto 40px",
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.9)"
    }
  }, "Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever."), /*#__PURE__*/React.createElement(Button, {
    variant: "hero",
    size: "lg",
    href: "#",
    style: {
      minWidth: "380px"
    }
  }, "GET STARTED")));
}
function WhatsNew() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundImage: "var(--valkey-gradient-whats-new)",
      padding: "0 0 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      margin: "0 auto",
      width: "100%",
      maxWidth: "var(--layout-max)",
      padding: "40px 20px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      padding: "40px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 50%",
      padding: "0 20px",
      minWidth: "300px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#fff",
      fontSize: "27.5px",
      fontWeight: 700,
      width: "100%",
      margin: "0 0 10px",
      fontFamily: "var(--font-display)"
    }
  }, "Version 9.x.x"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      margin: "0 0 30px",
      fontSize: "16px",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Release Date:"), " 2026-08-12", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "GitHub Release:"), " ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)"
    }
  }, "9.0.0")), /*#__PURE__*/React.createElement("hr", {
    style: {
      margin: "20px 0",
      border: 0,
      height: "1px",
      background: "var(--color-border)"
    }
  }), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 10px",
      fontFamily: "var(--font-display)",
      fontSize: "16px",
      color: "var(--color-heading)"
    }
  }, "Docker Hub ", /*#__PURE__*/React.createElement("small", {
    style: {
      fontWeight: 400
    }
  }, "(valkey/valkey)")), /*#__PURE__*/React.createElement(CodeBlock, {
    theme: "light",
    code: "docker run --rm valkey/valkey:9",
    style: {
      fontSize: "14px"
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#fff",
      fontSize: "27.5px",
      fontWeight: 700,
      margin: "0 0 10px",
      fontFamily: "var(--font-display)"
    }
  }, "Latest supported version of past releases"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      fontSize: "16px",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 10px",
      fontFamily: "var(--font-display)",
      fontSize: "16px",
      color: "var(--color-heading)"
    }
  }, "Version 8.x.x"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Release Date:"), " 2026-04-02", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "GitHub Release:"), " ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)"
    }
  }, "8.1.4")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 25%",
      padding: "0 20px",
      minWidth: "240px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#fff",
      fontSize: "27.5px",
      fontWeight: 700,
      margin: "0 0 10px",
      fontFamily: "var(--font-display)"
    }
  }, "Performance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, [["Throughput dashboard", "Track operations per second across releases and instance types."], ["Latency dashboard", "Compare p50 and p99 latency for common command mixes."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "var(--shadow-raised)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "15px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 10px",
      fontSize: "16px",
      lineHeight: 1.3,
      fontFamily: "var(--font-display)",
      color: "#002A3A"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 15px",
      fontSize: "14px",
      lineHeight: 1.4,
      color: "#4A5568"
    }
  }, d), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    style: {
      alignSelf: "flex-start"
    }
  }, "Explore")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 25%",
      padding: "0 20px",
      minWidth: "240px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#fff",
      fontSize: "27.5px",
      fontWeight: 700,
      margin: "0 0 10px",
      fontFamily: "var(--font-display)"
    }
  }, "Latest Blog Posts"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginBottom: "30px"
    }
  }, [["Valkey 9.0 is here", "Dual channel replication, atomic slot migration, and a smaller memory footprint."], ["Inside the Valkey cluster bus", "How nodes gossip, fail over, and agree on slot ownership."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "var(--shadow-raised)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "15px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 10px",
      fontSize: "16px",
      lineHeight: 1.3,
      fontFamily: "var(--font-display)",
      color: "#002A3A"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 15px",
      fontSize: "14px",
      lineHeight: 1.4,
      color: "#4A5568"
    }
  }, d), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    style: {
      alignSelf: "flex-start"
    }
  }, "Read More"))))), homeSidebar.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat.title
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: "#fff",
      fontSize: "27.5px",
      fontWeight: 700,
      margin: "0 0 10px",
      fontFamily: "var(--font-display)"
    }
  }, cat.title), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      padding: "20px 30px",
      borderRadius: "10px"
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      paddingLeft: 0,
      listStyle: "none",
      margin: 0,
      fontSize: "16px",
      lineHeight: 2
    }
  }, cat.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--valkey-link-blue)"
    }
  }, l)))), /*#__PURE__*/React.createElement(ReadMoreLink, null, cat.more))))))));
}
function DocumentationBand() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "40px 20px 80px",
      background: "#6983FF",
      textAlign: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "890px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "60px",
      fontWeight: 700,
      lineHeight: 1.2,
      margin: "0 0 17.5px",
      color: "#fff"
    }
  }, "Documentation"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: "20px",
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, "Valkey can run as either a ", /*#__PURE__*/React.createElement("strong", null, "standalone"), " daemon or in a ", /*#__PURE__*/React.createElement("strong", null, "cluster"), ", with options for ", /*#__PURE__*/React.createElement("strong", null, "replication"), " and ", /*#__PURE__*/React.createElement("strong", null, "high availability"), ". Valkey natively supports a rich collection of datatypes, including ", /*#__PURE__*/React.createElement("strong", null, "strings"), ", ", /*#__PURE__*/React.createElement("strong", null, "numbers"), ", ", /*#__PURE__*/React.createElement("strong", null, "hashes"), ", ", /*#__PURE__*/React.createElement("strong", null, "lists"), ", ", /*#__PURE__*/React.createElement("strong", null, "sets"), ", ", /*#__PURE__*/React.createElement("strong", null, "sorted sets"), ", ", /*#__PURE__*/React.createElement("strong", null, "bitmaps"), ", ", /*#__PURE__*/React.createElement("strong", null, "hyperloglogs"), " and more."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, "Valkey also supports native extensibility with built-in scripting support for ", /*#__PURE__*/React.createElement("strong", null, "Lua"), " and supports ", /*#__PURE__*/React.createElement("strong", null, "module"), " plugins to create new commands, data types, and more.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      margin: "40px auto 0",
      maxWidth: "var(--layout-max)"
    }
  }, homeDocCards.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      flex: "1 1 25%",
      minWidth: "260px",
      padding: "0 20px 30px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    surface: "dark",
    padding: "lg",
    title: c.title,
    style: {
      minHeight: "100%"
    },
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "outline-dark",
      fullWidth: true
    }, c.cta)
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "left",
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, c.description), c.features ? /*#__PURE__*/React.createElement("ul", {
    style: {
      textAlign: "left",
      padding: "0 0 0 18px",
      margin: "10px 0 20px",
      fontSize: "18px",
      lineHeight: 1.6
    }
  }, c.features.map(ft => /*#__PURE__*/React.createElement("li", {
    key: ft
  }, ft))) : null)))));
}
function ParticipantsBand() {
  const [slide, setSlide] = React.useState(0);
  const slides = Math.ceil(homeParticipants.length / 3);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--valkey-gradient-participants)",
      padding: "80px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--layout-max)",
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "60px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#fff",
      fontFamily: "var(--font-display)",
      fontSize: "48px",
      fontWeight: 700,
      margin: "0 0 20px",
      letterSpacing: "-1px"
    }
  }, "Participants"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#fff",
      fontSize: "18px",
      lineHeight: 1.6,
      maxWidth: "800px",
      margin: "0 auto",
      opacity: 0.95
    }
  }, "The Valkey project participants are a diverse group of organizations that have come together to maintain and contribute to the project. Valkey participants are more than vendors, they are dedicated to continuously strengthening the long-term health and viability of this project so that everyone can benefit from it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "20px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      transition: "transform 0.5s ease-in-out",
      transform: "translateX(-" + slide * 100 + "%)"
    }
  }, homeParticipants.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      flex: "0 0 33.33%",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(ParticipantCard, {
    name: p.name,
    logoSrc: "../../assets/participants/" + p.logo,
    offering: p.offering
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: "12.5px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center"
    }
  }, Array.from({
    length: slides
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    "aria-label": "Go to slide " + (i + 1),
    "aria-current": i === slide,
    onClick: () => setSlide(i),
    style: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      border: "none",
      padding: 0,
      cursor: "pointer",
      background: i === slide ? "#000" : "rgba(0,0,0,0.25)",
      transform: i === slide ? "scale(1.2)" : "none",
      transition: "all 0.2s ease"
    }
  }))))));
}
function HomeScreen() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Banner, null, /*#__PURE__*/React.createElement("strong", null, "Save Your Spot for ValkeyConf 2026"), " | October 5, 2026 | Prague, Czechia"), /*#__PURE__*/React.createElement(SiteHeader, {
    active: "Home",
    logoSrc: "../../assets/logos/valkey-horizontal-color.png",
    starCount: "21.4k"
  }), /*#__PURE__*/React.createElement(HomeHero, null), /*#__PURE__*/React.createElement(WhatsNew, null), /*#__PURE__*/React.createElement(DocumentationBand, null), /*#__PURE__*/React.createElement(ParticipantsBand, null), /*#__PURE__*/React.createElement(SiteFooter, {
    iconBase: "../../assets/icons/"
  }));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screen-home.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ParticipantCard = __ds_scope.ParticipantCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Blockquote = __ds_scope.Blockquote;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.ReadMoreLink = __ds_scope.ReadMoreLink;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
