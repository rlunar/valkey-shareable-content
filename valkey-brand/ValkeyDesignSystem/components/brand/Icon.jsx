const iconFiles = {
  github: "IconGithub.svg", slack: "IconSlack.svg", linkedin: "IconLinkedin.svg",
  mail: "IconMail.svg", x: "IconX.svg", youtube: "IconYoutube.svg",
  close: "icon-outline-close.svg", caret: "caret-right.svg",
  question: "icon-question.svg", bug: "icon-bug.svg", users: "icon-users.svg",
  bulb: "icon-bulb.svg", shield: "icon-sheild.svg", book: "icon-book.svg"
};

export function Icon({ name, size = 20, base = "../../assets/icons/", alt, style, ...rest }) {
  const file = iconFiles[name];
  if (!file) return null;
  return (
    <img
      src={base + file} alt={alt === undefined ? name + " icon" : alt}
      width={size} height={size}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...rest}
    />
  );
}

export const iconNames = Object.keys(iconFiles);
