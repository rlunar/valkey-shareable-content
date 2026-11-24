#!/usr/bin/env bash
#
# ffkit.sh — gum TUI over ffmpeg for the video files in the current folder.
#
# Flow (interactive):
#   1. Scope      : process ONE picked video, or ALL videos in the folder
#   2. Resize     : 8K / 4K / 2.7K / 1080p / keep original
#   3. Format     : mp4 or mkv
#   4. Color (LUT): optionally apply a 3D LUT (.cube); prompts for the path
#
# Resize + LUT are applied in one encode pass.
#
# Designed for Canon C-series MXF clips (4K H.264 10-bit, multiple PCM tracks)
# but works on any ffmpeg-readable video.
#
# Interactive by default; pass -y for non-interactive batch mode.

set -euo pipefail

# ---------------------------------------------------------------------------
# Defaults / config
# ---------------------------------------------------------------------------
DEFAULT_LUT="/Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/LUT/JFK14_CanonC2_Balanced.cube"
OUTDIR="out"              # outputs written here (relative to cwd)
CRF="18"                  # x264 quality (lower = better/larger)
PRESET="medium"           # x264 speed/efficiency tradeoff (default)
PRESET_SET=0              # 1 once chosen via flag, so the prompt is skipped
AUDIO_BITRATE="256k"      # AAC bitrate for the first audio track
LOG="$(pwd)/.ffkit.log"   # verbose ffmpeg output goes here

# Resolution presets (height-based; width keeps aspect ratio via -2)
res_for_preset() {
  case "$1" in
    8k|8K)       echo "7680x4320" ;;
    4k|4K)       echo "3840x2160" ;;
    2.7k|2.7K)   echo "2704x1520" ;;
    1080|1080p)  echo "1920x1080" ;;
    original|none|"") echo "" ;;
    *) echo "__INVALID__" ;;
  esac
}

# ---------------------------------------------------------------------------
# CLI flags
# ---------------------------------------------------------------------------
ASSUME_YES=0
FORCE=0
SCOPE=""                  # one | all
RES_CHOICE=""             # 8k | 4k | 2.7k | 1080 | original
FORMAT=""                 # mp4 | mkv
USE_LUT=""                # yes | no  (empty = ask)
LUT_PATH="$DEFAULT_LUT"
INPUT_DIR=""              # folder to scan (default: current dir)
OUTDIR_SET=0              # 1 if -d given on the CLI (skip the prompt)
FILE_ARGS=()

usage() {
  cat <<EOF
ffkit.sh — ffmpeg toolkit for videos in the current folder

Usage: ffkit.sh [options] [files/globs...]

Options:
  -a           Scope: ALL videos in the folder
  -1           Scope: ONE video (prompted to pick, unless a file is given)
  -S           Scope: SELECT videos with checkboxes (interactive)
  -i DIR       Folder to scan for videos (default: current folder)
  -r RES       Resize: 8k | 4k | 2.7k | 1080 | original   (prompted if omitted)
  -t FORMAT    Output format: mp4 | mkv                   (prompted if omitted)
  -L PATH      Apply a color LUT (.cube) from PATH
  -l           Apply the default LUT:
               $DEFAULT_LUT
  -d DIR       Output directory (prompted if omitted; default: $OUTDIR)
  -c CRF       x264 CRF quality, lower=better (default: $CRF)
  -p PRESET    x264 preset: ultrafast..veryslow      (prompted if omitted; default: $PRESET)
  -f           Force: overwrite existing outputs
  -y           Non-interactive: use defaults / flags, no prompts
  -h           This help

Examples:
  ffkit.sh                                       # fully interactive
  ffkit.sh -y -1 -l A061C699_261112XE_CANON.MXF  # one file, default LUT, mp4
  ffkit.sh -y -a -r 1080 -t mp4                  # all files -> 1080p mp4
  ffkit.sh -y -a -r 4k -t mkv -L /path/to.cube   # all -> 4k mkv with LUT
EOF
}

while getopts ":a1Si:r:t:L:ld:c:p:fyh" opt; do
  case "$opt" in
    a) SCOPE="all" ;;
    1) SCOPE="one" ;;
    S) SCOPE="select" ;;
    i) INPUT_DIR="$OPTARG" ;;
    r) RES_CHOICE="$OPTARG" ;;
    t) FORMAT="$OPTARG" ;;
    L) USE_LUT="yes"; LUT_PATH="$OPTARG" ;;
    l) USE_LUT="yes"; LUT_PATH="$DEFAULT_LUT" ;;
    d) OUTDIR="$OPTARG"; OUTDIR_SET=1 ;;
    c) CRF="$OPTARG" ;;
    p) PRESET="$OPTARG"; PRESET_SET=1 ;;
    f) FORCE=1 ;;
    y) ASSUME_YES=1 ;;
    h) usage; exit 0 ;;
    \?) echo "Unknown option: -$OPTARG" >&2; usage; exit 2 ;;
    :)  echo "Option -$OPTARG requires a value" >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))
FILE_ARGS=("$@")

# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
for dep in ffmpeg ffprobe gum; do
  if ! command -v "$dep" >/dev/null 2>&1; then
    echo "Missing required tool: $dep" >&2
    exit 1
  fi
done

log()  { gum log --level info  -- "$@"; }
warn() { gum log --level warn  -- "$@"; }
err()  { gum log --level error -- "$@"; }

# ---------------------------------------------------------------------------
# Gather candidate video files in the current folder
# ---------------------------------------------------------------------------
VIDEO_EXT_RE='\.(mxf|mov|mp4|m4v|mkv|avi|mts|m2ts|mpg|mpeg|webm)$'

collect_from_dir() {
  # list video files in a directory, skip macOS ._* resource forks
  local dir="$1" f
  for f in "$dir"/*; do
    [ -f "$f" ] || continue
    case "$(basename "$f")" in ._*) continue ;; esac
    if printf '%s\n' "$f" | grep -qiE "$VIDEO_EXT_RE"; then
      printf '%s\n' "$f"
    fi
  done
}

# ---------------------------------------------------------------------------
# 1. Scope: one or all
# ---------------------------------------------------------------------------
SELECTED=()

if [ "${#FILE_ARGS[@]}" -gt 0 ]; then
  # Explicit files on the command line win; scope is implied.
  for f in "${FILE_ARGS[@]}"; do
    case "$(basename "$f")" in ._*) continue ;; esac
    if [ -f "$f" ]; then
      SELECTED+=("$f")
    else
      warn "Not a file, skipping: $f"
    fi
  done
else
  # Scan a directory; start with the given dir or the current one. If it
  # has no videos, ask for another path (interactive) and rescan.
  SCAN_DIR="${INPUT_DIR:-$PWD}"
  SUGGEST_DIR="/Volumes/Extreme/CONTENTS/CLIPS001"   # handy default to offer
  ALL=()
  while :; do
    # Scan the directory. The scan writes to a temp file; a spinner is shown
    # around it purely as a visual cue (its own stdout/stderr go to the TTY,
    # never into the captured results), so gum's output routing can't corrupt
    # the file list.
    _scan_tmp="$(mktemp)"
    if [ "$ASSUME_YES" -ne 1 ]; then
      ( collect_from_dir "$SCAN_DIR" > "$_scan_tmp" ) &
      _scan_pid=$!
      gum spin --spinner dot --title "Reading videos in $SCAN_DIR ..." -- \
        bash -c 'while kill -0 '"$_scan_pid"' 2>/dev/null; do sleep 0.05; done' \
        >/dev/null 2>&1 || true
      wait "$_scan_pid" 2>/dev/null || true
    else
      collect_from_dir "$SCAN_DIR" > "$_scan_tmp"
    fi
    mapfile -t ALL < "$_scan_tmp"
    rm -f "$_scan_tmp"
    if [ "${#ALL[@]}" -gt 0 ]; then
      break
    fi
    if [ "$ASSUME_YES" -eq 1 ]; then
      err "No video files found in $SCAN_DIR"
      exit 1
    fi
    warn "No video files found in $SCAN_DIR"
    if ! gum confirm "Choose a different folder?" --default=yes; then
      err "No folder with videos selected."
      exit 1
    fi
    # Pre-fill with a useful suggestion (the clips folder), not the path that
    # just failed, so a quick Enter doesn't rescan the same empty folder.
    _default="$SUGGEST_DIR"
    [ "$SCAN_DIR" = "$SUGGEST_DIR" ] && _default="$PWD"
    _typed="$(gum input --header "Path to a folder containing videos" \
      --value "$_default" --width 100)"
    # trim leading/trailing whitespace first
    _typed="${_typed#"${_typed%%[![:space:]]*}"}"
    _typed="${_typed%"${_typed##*[![:space:]]}"}"
    # strip surrounding quotes, expand ~, drop a trailing slash
    _typed="${_typed#\"}"; _typed="${_typed%\"}"
    _typed="${_typed#\'}"; _typed="${_typed%\'}"
    _typed="${_typed/#\~/$HOME}"
    _typed="${_typed%/}"
    if [ -z "$_typed" ]; then
      err "No folder given."
      exit 1
    fi
    if [ ! -d "$_typed" ]; then
      warn "Not a directory: $_typed"
      # loop again, keeping the suggestion; don't overwrite with a bad value
      continue
    fi
    SCAN_DIR="$_typed"
  done
  log "Using folder: $SCAN_DIR"

  if [ -z "$SCOPE" ]; then
    if [ "$ASSUME_YES" -eq 1 ]; then
      SCOPE="all"
    else
      SCOPE="$(gum choose --header "Process how many videos? (found ${#ALL[@]})" \
        "one     (pick a single video)" \
        "all     (every video in this folder)" \
        "select  (tick the ones you want)")"
      case "$SCOPE" in
        one*)    SCOPE="one" ;;
        all*)    SCOPE="all" ;;
        select*) SCOPE="select" ;;
      esac
    fi
  fi

  case "$SCOPE" in
    one)
      if [ "$ASSUME_YES" -eq 1 ]; then
        SELECTED=("${ALL[0]}")
      else
        pick="$(printf '%s\n' "${ALL[@]}" | gum choose --header "Pick a video")"
        [ -n "$pick" ] && SELECTED=("$pick")
      fi
      ;;
    select)
      if [ "$ASSUME_YES" -eq 1 ]; then
        SELECTED=("${ALL[@]}")   # -y has no interactive picker; fall back to all
      else
        gum style --foreground 212 "Space to tick, Enter to confirm"
        mapfile -t SELECTED < <(printf '%s\n' "${ALL[@]}" | \
          gum choose --no-limit --header "Select videos to process (${#ALL[@]} found)")
      fi
      ;;
    all|*)
      SELECTED=("${ALL[@]}")
      ;;
  esac
fi

if [ "${#SELECTED[@]}" -eq 0 ]; then
  err "No files selected."
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. Resize
# ---------------------------------------------------------------------------
if [ -z "$RES_CHOICE" ]; then
  if [ "$ASSUME_YES" -eq 1 ]; then
    RES_CHOICE="original"
  else
    RES_CHOICE="$(gum choose --header "Resize to" \
      "8k        (7680x4320)" \
      "4k        (3840x2160)" \
      "2.7k      (2704x1520)" \
      "1080      (1920x1080)" \
      "original  (keep source size)")"
    RES_CHOICE="${RES_CHOICE%% *}"   # take the token before spaces
  fi
fi

RESIZE="$(res_for_preset "$RES_CHOICE")"
if [ "$RESIZE" = "__INVALID__" ]; then
  err "Invalid resolution: $RES_CHOICE (want 8k|4k|2.7k|1080|original)"
  exit 2
fi

# Filename suffix for the chosen resolution (appended before the extension).
# "original" keeps no suffix, since no target dimension was chosen.
res_suffix() {
  case "$1" in
    8k|8K)       echo "-8k" ;;
    4k|4K)       echo "-4k" ;;
    2.7k|2.7K)   echo "-2k" ;;
    1080|1080p)  echo "-1080" ;;
    *)           echo "" ;;
  esac
}
RES_SUFFIX="$(res_suffix "$RES_CHOICE")"

# ---------------------------------------------------------------------------
# 3. Output format
# ---------------------------------------------------------------------------
if [ -z "$FORMAT" ]; then
  if [ "$ASSUME_YES" -eq 1 ]; then
    FORMAT="mp4"
  else
    FORMAT="$(gum choose --header "Output format" "mp4" "mkv")"
  fi
fi
case "$FORMAT" in
  mp4|mkv) ;;
  *) err "Unknown format: $FORMAT (want mp4|mkv)"; exit 2 ;;
esac

# ---------------------------------------------------------------------------
# 3b. Encoder preset (x264 speed/efficiency; quality is set by CRF)
# ---------------------------------------------------------------------------
if [ "$PRESET_SET" -ne 1 ] && [ "$ASSUME_YES" -ne 1 ]; then
  PRESET="$(gum choose --header "Encoder preset (speed vs. file size; CRF sets quality)" \
    --selected "$PRESET" \
    "ultrafast" "superfast" "veryfast" "faster" "fast" \
    "medium" "slow" "slower" "veryslow")"
fi
case "$PRESET" in
  ultrafast|superfast|veryfast|faster|fast|medium|slow|slower|veryslow) ;;
  *) err "Unknown preset: $PRESET"; exit 2 ;;
esac

# ---------------------------------------------------------------------------
# 4. Color scheme (LUT)
# ---------------------------------------------------------------------------
if [ -z "$USE_LUT" ]; then
  if [ "$ASSUME_YES" -eq 1 ]; then
    USE_LUT="no"
  else
    if gum confirm "Apply a color scheme (LUT)?" --default=no; then
      USE_LUT="yes"
    else
      USE_LUT="no"
    fi
  fi
fi

if [ "$USE_LUT" = "yes" ]; then
  if [ "$ASSUME_YES" -ne 1 ]; then
    LUT_PATH="$(gum input --header "Path to LUT (.cube) file" --value "$LUT_PATH" --width 100)"
  fi
  if [ ! -f "$LUT_PATH" ]; then
    err "LUT file not found: $LUT_PATH"
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 5. Destination folder (default: out)
# ---------------------------------------------------------------------------
if [ "$OUTDIR_SET" -ne 1 ] && [ "$ASSUME_YES" -ne 1 ]; then
  _typed_out="$(gum input --header "Destination folder for the output files" \
    --value "$OUTDIR" --width 100)"
  # trim whitespace, strip surrounding quotes, expand ~, drop a trailing slash
  _typed_out="${_typed_out#"${_typed_out%%[![:space:]]*}"}"
  _typed_out="${_typed_out%"${_typed_out##*[![:space:]]}"}"
  _typed_out="${_typed_out#\"}"; _typed_out="${_typed_out%\"}"
  _typed_out="${_typed_out#\'}"; _typed_out="${_typed_out%\'}"
  _typed_out="${_typed_out/#\~/$HOME}"
  _typed_out="${_typed_out%/}"
  # empty input keeps the default
  [ -n "$_typed_out" ] && OUTDIR="$_typed_out"
fi

# ---------------------------------------------------------------------------
# Build the ffmpeg -vf filter chain
# ---------------------------------------------------------------------------
build_vf() {
  local vf=""
  if [ "$USE_LUT" = "yes" ]; then
    # lut3d needs an escaped path for the filtergraph
    local esc
    esc="$(printf '%s' "$LUT_PATH" | sed -e 's/\\/\\\\/g' -e "s/'/\\\\'/g" -e 's/:/\\:/g')"
    vf="lut3d='${esc}'"
  fi
  if [ -n "$RESIZE" ]; then
    local w="${RESIZE%x*}" h="${RESIZE#*x}"
    # -2 on width keeps the aspect ratio and even dimensions
    local scale="scale=-2:${h}:flags=lanczos"
    if [ -n "$vf" ]; then vf="${vf},${scale}"; else vf="$scale"; fi
  fi
  printf '%s' "$vf"
}

VF="$(build_vf)"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
mkdir -p "$OUTDIR"
: > "$LOG"

{
  echo "Videos|${#SELECTED[@]}"
  echo "Resize|${RES_CHOICE} ${RESIZE:+($RESIZE)}"
  echo "Format|$FORMAT"
  if [ "$USE_LUT" = "yes" ]; then echo "LUT|$LUT_PATH"; else echo "LUT|none"; fi
  echo "Output dir|$OUTDIR"
  echo "Encoder|libx264 crf=$CRF preset=$PRESET"
  echo "Audio|aac $AUDIO_BITRATE (first track)"
} | gum table --separator "|" --columns "Setting,Value" --print 2>/dev/null \
  || { echo; echo "Videos=${#SELECTED[@]} Resize=$RES_CHOICE Format=$FORMAT LUT=$USE_LUT Out=$OUTDIR"; }

if [ "$ASSUME_YES" -ne 1 ]; then
  if ! gum confirm "Process ${#SELECTED[@]} file(s)?"; then
    err "Cancelled."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Progress bar drawn in place (gum pink 212), redrawn with \r
# ---------------------------------------------------------------------------
draw_bar() {
  local pct="$1" label="$2" width=30
  local filled=$(( pct * width / 100 ))
  local empty=$(( width - filled ))
  local bar
  bar="$(printf '%*s' "$filled" '' | tr ' ' '#')"
  bar="${bar}$(printf '%*s' "$empty" '' | tr ' ' '-')"
  # \033[2K clears the line; \033[38;5;212m is gum-pink
  printf '\r\033[2K\033[38;5;212m[%s] %3d%%\033[0m %s' "$bar" "$pct" "$label" >&2
}

# Get duration in seconds (float) for progress math
probe_duration() {
  ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$1" 2>/dev/null || echo ""
}

# ---------------------------------------------------------------------------
# Process one file, in isolation (failures don't stop the batch)
# ---------------------------------------------------------------------------
process_one() {
  local in="$1"
  local base name out
  base="$(basename "$in")"
  name="${base%.*}"
  out="${OUTDIR%/}/${name}${RES_SUFFIX}.${FORMAT}"

  if [ -e "$out" ] && [ "$FORCE" -ne 1 ]; then
    warn "Exists, skipping (use -f to overwrite): $out"
    return 0
  fi

  local dur total_us=""
  dur="$(probe_duration "$in")"
  if [ -n "$dur" ]; then
    total_us="$(awk -v d="$dur" 'BEGIN{printf "%d", d*1000000}')"
  fi

  # Build ffmpeg args
  local -a args=(-hide_banner -loglevel error -progress pipe:1 -nostats -y -i "$in")
  if [ -n "$VF" ]; then
    args+=(-vf "$VF")
  fi
  # 10-bit source -> yuv420p for broad compatibility; map first video + first audio.
  args+=(-map 0:v:0 -map 0:a:0?
         -c:v libx264 -preset "$PRESET" -crf "$CRF" -pix_fmt yuv420p
         -c:a aac -b:a "$AUDIO_BITRATE")
  # faststart only matters for mp4
  [ "$FORMAT" = "mp4" ] && args+=(-movflags +faststart)
  args+=("$out")

  gum style --foreground 212 "→ $base"

  # Run ffmpeg, parse -progress output for a live bar
  set +e
  {
    ffmpeg "${args[@]}" 2>>"$LOG" | while IFS='=' read -r key val; do
      case "$key" in
        out_time_us|out_time_ms)
          # ffmpeg emits "N/A" at end of stream; only parse plain integers
          if [ -n "$total_us" ] && [ "$total_us" -gt 0 ] 2>/dev/null \
             && [ -n "$val" ] && [ "$val" -eq "$val" ] 2>/dev/null; then
            local cur="$val"
            local pct=$(( cur * 100 / total_us ))
            [ "$pct" -gt 100 ] && pct=100
            [ "$pct" -lt 0 ] && pct=0
            draw_bar "$pct" "$base"
          fi
          ;;
        progress)
          [ "$val" = "end" ] && draw_bar 100 "$base"
          ;;
      esac
    done
  }
  local rc=${PIPESTATUS[0]}
  set -e
  printf '\n' >&2

  if [ "$rc" -ne 0 ]; then
    err "FAILED: $base (see $LOG)"
    FAILED+=("$base")
    [ -e "$out" ] && rm -f "$out"
    return 0
  fi

  log "Done: $out"
  DONE+=("$base")
}

# ---------------------------------------------------------------------------
# Run the batch
# ---------------------------------------------------------------------------
DONE=()
FAILED=()
for f in "${SELECTED[@]}"; do
  process_one "$f"
done

# ---------------------------------------------------------------------------
# Final summary
# ---------------------------------------------------------------------------
echo
gum style --border normal --padding "0 1" --border-foreground 212 \
  "Finished: ${#DONE[@]} ok, ${#FAILED[@]} failed  →  $OUTDIR/"

if [ "${#FAILED[@]}" -gt 0 ]; then
  printf '%s\n' "${FAILED[@]}" | gum style --foreground 196
  exit 1
fi
