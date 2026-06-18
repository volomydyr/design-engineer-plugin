#!/usr/bin/env bash
# process_video.sh — one-shot pipeline for feedback-to-todos (video input).
# Probes a feedback video, transcribes it (timestamped), extracts frames every ~2s,
# and builds MAP.tsv (transcript segment -> frame numbers). Everything lands in a
# DURABLE work dir (never /tmp — macOS clears it on reboot).
#
# Usage:
#   process_video.sh <video-path> [work-dir]
# Default work-dir: ~/Desktop/<video-basename>-analysis
#
# Requires: ffmpeg/ffprobe, whisper.cpp (`whisper-cli`), and a ggml-large-v3-turbo
# model. If any is missing, this script STOPS with the exact install command and
# exits non-zero — it never silently produces a frames-only, ungrounded analysis.
set -euo pipefail

VIDEO="${1:?Usage: process_video.sh <video-path> [work-dir]}"
[ -f "$VIDEO" ] || { echo "ERROR: video not found: $VIDEO" >&2; exit 1; }

# ---- preflight: every required tool must be present, or STOP and ask the user ----
# Grounded video analysis needs ffmpeg/ffprobe (frames + audio), whisper-cli
# (transcription), and a ggml-large-v3-turbo model. A missing tool means we cannot
# produce a faithful, transcript-grounded list — so stop and prompt the user to
# install it. Never run the installer here; never continue frames-only.
command -v ffmpeg  >/dev/null || { echo "ERROR: ffmpeg not installed. Install it, then re-run:" >&2;  echo "   brew install ffmpeg" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ERROR: ffprobe not installed (ships with ffmpeg). Install it, then re-run:" >&2; echo "   brew install ffmpeg" >&2; exit 1; }
command -v whisper-cli >/dev/null || { echo "ERROR: whisper-cli not installed. Install whisper.cpp, then re-run:" >&2; echo "   brew install whisper-cpp" >&2; exit 1; }

MODEL="$(ls "$HOME/.whisper-models/"ggml-large-v3-turbo*.bin 2>/dev/null | head -1 || true)"
if [ -z "$MODEL" ]; then
  echo "ERROR: ggml-large-v3-turbo model not found in ~/.whisper-models/. Download it, then re-run:" >&2
  echo "   mkdir -p ~/.whisper-models && curl -L -o ~/.whisper-models/ggml-large-v3-turbo.bin \\" >&2
  echo "     https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin" >&2
  exit 1
fi

BASE="$(basename "${VIDEO%.*}" | tr ' ' '-')"
WORK="${2:-$HOME/Desktop/${BASE}-analysis}"
mkdir -p "$WORK/frames"
echo "=== work dir: $WORK"

echo "=== probing video"
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_type,width,height \
  -of default=noprint_wrappers=1 "$VIDEO" | tee "$WORK/probe.txt"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO" | cut -d. -f1)
echo "duration(s)=$DUR  (~$((DUR/60))m$((DUR%60))s)"

# Frames at near-native resolution + high JPEG quality: these get read for tiny
# on-screen text (spreadsheet cells, dialog labels), so detail matters more than
# disk. Keep native width up to 1920 (downscale only if the source is larger);
# q:v 2 is near-lossless JPEG.
echo "=== extracting frames (every 2s, up to 1920px wide, high quality) -> frames/f_%04d.jpg"
ffmpeg -y -i "$VIDEO" -vf "fps=1/2,scale='min(1920,iw)':-2" -q:v 2 "$WORK/frames/f_%04d.jpg" -loglevel error
echo "frames: $(ls "$WORK/frames" | wc -l | tr -d ' ')   (file-time of f_N = (N-1)*2 seconds)"

# ---- transcription ----
echo "=== extracting 16kHz mono audio"
ffmpeg -y -i "$VIDEO" -ar 16000 -ac 1 -c:a pcm_s16le "$WORK/audio.wav" -loglevel error
echo "=== transcribing with whisper.cpp ($MODEL) — this can take a few minutes"
whisper-cli -m "$MODEL" -f "$WORK/audio.wav" -oj -osrt -of "$WORK/transcript" -pp >/dev/null 2>&1
echo "wrote transcript.srt + transcript.json"

# ---- build MAP.tsv (segment -> frames) from whisper.cpp JSON ----
echo "=== building MAP.tsv"
python3 - "$WORK" <<'PY'
import json, sys, os
work = sys.argv[1]
d = json.load(open(os.path.join(work, "transcript.json")))
segs = d.get("transcription") or d.get("segments") or []
def span(o):
    if "offsets" in o: return o["offsets"]["from"]/1000.0, o["offsets"]["to"]/1000.0
    return o.get("start", 0.0), o.get("end", 0.0)
rows = []
for o in segs:
    a, b = span(o)
    fa, fb = int(a//2)+1, int(b//2)+1
    rows.append((a, b, fa, fb, (o.get("text") or "").strip()))
with open(os.path.join(work, "MAP.tsv"), "w") as f:
    f.write("start_s\tend_s\tframeA\tframeB\ttext\n")
    for a, b, fa, fb, t in rows:
        f.write(f"{a:.1f}\t{b:.1f}\tf_{fa:04d}\tf_{fb:04d}\t{t}\n")
print(f"segments={len(rows)}  last_end={rows[-1][1]:.0f}s" if rows else "no segments")
PY

echo "=== DONE. Artifacts in $WORK :"
echo "   keep:        audio.wav  transcript.srt  frames/   (+ FEEDBACK.md you write)"
echo "   scaffolding: probe.txt  MAP.tsv  transcript.json   (delete after presenting — SKILL step 9)"
echo "Next: read transcript.srt end-to-end, then VIEW frames at the mapped timestamps"
echo "(f_N file-time = (N-1)*2s). Do NOT trust the on-screen recorder timer."
