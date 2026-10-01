const logoFiles = {
  "horizontal-color": { file: "valkey-horizontal-color.png", ratio: 3196 / 1080 },
  "horizontal-color-light": { file: "valkey-horizontal-color-light.png", ratio: 3196 / 1080 },
  "horizontal-black": { file: "valkey-horizontal-black.png", ratio: 3196 / 1080 },
  "horizontal-white": { file: "valkey-horizontal-white.png", ratio: 3196 / 1080 },
  "stacked-color": { file: "valkey-stacked-color.png", ratio: 1256 / 1080 },
  "stacked-color-light": { file: "valkey-stacked-color-light.png", ratio: 1256 / 1080 },
  "stacked-black": { file: "valkey-stacked-black.png", ratio: 1256 / 1080 },
  "stacked-white": { file: "valkey-stacked-white.png", ratio: 1256 / 1080 },
  "icon-periwinkle": { file: "valkey-icon-periwinkle.png", ratio: 1 },
  "icon-black": { file: "valkey-icon-black.png", ratio: 1 },
  "icon-white": { file: "valkey-icon-white.png", ratio: 1 }
};

const logoMinWidth = { horizontal: 120, stacked: 96, icon: 16 };

export function Logo({ variant = "horizontal-color", width = 260, base = "../../assets/logos/", href, clearSpace = false, style, ...rest }) {
  const entry = logoFiles[variant] || logoFiles["horizontal-color"];
  const family = variant.split("-")[0];
  const w = Math.max(width, logoMinWidth[family]);
  const img = (
    <img
      src={base + entry.file} alt="Valkey"
      width={w} height={Math.round(w / entry.ratio)}
      style={{ display: "block", ...(clearSpace ? { margin: family === "icon" ? w * 0.3 : w * 0.09 } : null), ...style }}
      {...rest}
    />
  );
  return href ? <a href={href} style={{ display: "inline-block" }}>{img}</a> : img;
}
