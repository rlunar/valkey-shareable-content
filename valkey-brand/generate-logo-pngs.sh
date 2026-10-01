#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/logo-svgs"
OUTPUT_DIR="$SCRIPT_DIR/logo-pngs"
DEFAULT_HEIGHT=1024
HEIGHT=""
ASSUME_YES=false

usage() {
  cat <<'EOF'
Usage: ./generate-logo-pngs.sh [--height PIXELS] [--yes]

Convert every SVG in ./logo-svgs to a matching PNG in ./logo-pngs.
Only the output height is set, so each SVG keeps its original aspect ratio.
Nested source directories are mirrored in the output directory.

Options:
  --height PIXELS  Set PNG height without prompting (default prompt: 1024)
  --yes            Overwrite existing PNGs without confirmation
  -h, --help       Show this help
EOF
}

fail() {
  if command -v gum >/dev/null 2>&1; then
    gum style --foreground '#E0A2AF' "Error: $1" >&2
  else
    printf 'Error: %s\n' "$1" >&2
  fi
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --height)
      [[ $# -ge 2 ]] || fail "--height requires a pixel value"
      HEIGHT="$2"
      shift 2
      ;;
    --yes)
      ASSUME_YES=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

command -v gum >/dev/null 2>&1 || fail "gum is required (install with: brew install gum)"
command -v rsvg-convert >/dev/null 2>&1 || fail "rsvg-convert is required (install with: brew install librsvg)"
[[ -d "$SOURCE_DIR" ]] || fail "source directory not found: $SOURCE_DIR"

is_valid_height() {
  [[ "$1" =~ ^[1-9][0-9]*$ ]]
}

gum style \
  --border rounded \
  --border-foreground '#6983FF' \
  --foreground '#6983FF' \
  --padding '0 2' \
  --bold \
  'Valkey SVG → PNG'

if [[ -z "$HEIGHT" ]]; then
  while true; do
    HEIGHT="$(gum input \
      --header 'Output height in pixels (width is calculated automatically)' \
      --prompt 'Height: ' \
      --value "$DEFAULT_HEIGHT" \
      --char-limit 6)" || exit 0

    if is_valid_height "$HEIGHT"; then
      break
    fi

    gum style --foreground '#E0A2AF' 'Enter a positive whole number.'
  done
elif ! is_valid_height "$HEIGHT"; then
  fail "height must be a positive whole number"
fi

SVG_COUNT=0
while IFS= read -r -d '' _; do
  SVG_COUNT=$((SVG_COUNT + 1))
done < <(find "$SOURCE_DIR" -type f -iname '*.svg' -print0)

[[ "$SVG_COUNT" -gt 0 ]] || fail "no SVG files found in $SOURCE_DIR"

HAS_EXISTING_OUTPUT=false
while IFS= read -r -d '' SOURCE_FILE; do
  RELATIVE_PATH="${SOURCE_FILE#"$SOURCE_DIR"/}"
  OUTPUT_FILE="$OUTPUT_DIR/${RELATIVE_PATH%.*}.png"
  if [[ -e "$OUTPUT_FILE" ]]; then
    HAS_EXISTING_OUTPUT=true
    break
  fi
done < <(find "$SOURCE_DIR" -type f -iname '*.svg' -print0)

if [[ "$HAS_EXISTING_OUTPUT" == true && "$ASSUME_YES" != true ]]; then
  if ! gum confirm \
    --affirmative 'Overwrite' \
    --negative 'Cancel' \
    --selected.background '#6983FF' \
    "Some PNGs already exist. Overwrite matching files?"; then
    gum style --foreground '#BCB5E7' 'No files were changed.'
    exit 0
  fi
fi

CONVERTED=0
FAILED=0

while IFS= read -r -d '' SOURCE_FILE; do
  RELATIVE_PATH="${SOURCE_FILE#"$SOURCE_DIR"/}"
  OUTPUT_FILE="$OUTPUT_DIR/${RELATIVE_PATH%.*}.png"
  mkdir -p "$(dirname "$OUTPUT_FILE")"

  if gum spin \
    --spinner dot \
    --spinner.foreground '#6983FF' \
    --title "Converting $RELATIVE_PATH" \
    -- rsvg-convert \
      --keep-aspect-ratio \
      --height "$HEIGHT" \
      --output "$OUTPUT_FILE" \
      "$SOURCE_FILE"; then
    CONVERTED=$((CONVERTED + 1))
  else
    FAILED=$((FAILED + 1))
    gum style --foreground '#E0A2AF' "Failed: $RELATIVE_PATH" >&2
  fi
done < <(find "$SOURCE_DIR" -type f -iname '*.svg' -print0)

if [[ "$FAILED" -gt 0 ]]; then
  fail "$FAILED of $SVG_COUNT conversions failed"
fi

gum style \
  --border rounded \
  --border-foreground '#6983FF' \
  --padding '0 2' \
  "Generated $CONVERTED PNGs at ${HEIGHT}px high" \
  "$OUTPUT_DIR"
