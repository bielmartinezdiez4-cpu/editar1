#!/usr/bin/env bash
# Viral TikTok edit v2: CapCut-style word captions, sticker overlays,
# constant pan motion. Generates PNG sticker cards on the fly with
# ImageMagick, then composites them with ffmpeg.
#
# Usage: ./scripts/edit_viral_v2.sh <input.mp4> [output.mp4]

set -euo pipefail

INPUT="${1:?input file required}"
OUTPUT="${2:-output/reventa_viral_v2.mp4}"
F="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"
CARDS_DIR="${CARDS_DIR:-/tmp/cards}"

mkdir -p "$(dirname "$OUTPUT")" "$CARDS_DIR"

# ---- 1) Generate sticker cards ---------------------------------------------
convert -size 900x250 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 900,250 25,25" \
  -fill "#FFE45E" -stroke black -strokewidth 5 -font "$F" -pointsize 90 -gravity center \
  -annotate +0+0 "▸ MERCADILLOS ◂" "$CARDS_DIR/mercadillo.png"

convert -size 720x230 xc:none \
  -fill "#1D3557" -draw "roundrectangle 0,0 720,230 25,25" \
  -fill "#FFE45E" -stroke black -strokewidth 5 -font "$F" -pointsize 100 -gravity center \
  -annotate +0+0 "▸ LOTES ◂" "$CARDS_DIR/lotes.png"

convert -size 850x280 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 850,280 30,30" \
  -fill white -stroke black -strokewidth 6 -font "$F" -pointsize 70 -gravity north \
  -annotate +0+25 "★ EMPEZAMOS ★" \
  -fill "#FFE45E" -pointsize 120 -gravity south \
  -annotate +0+25 "SEMANA 0" "$CARDS_DIR/semana0.png"

convert -size 600x180 xc:none \
  -fill "#09B1BA" -draw "roundrectangle 0,0 600,180 90,90" \
  -fill white -stroke black -strokewidth 4 -font "$F" -pointsize 110 -gravity center \
  -annotate +0+0 "VINTED" "$CARDS_DIR/vinted.png"

# ---- 2) Build caption chain -------------------------------------------------
CY=1450
FS=88
FH=96

caption() {
  # $1 text, $2 t0, $3 t1, $4 highlight(0|1)
  local text="$1" t0="$2" t1="$3" hi="${4:-0}"
  local color box bs
  if [[ "$hi" == "1" ]]; then
    color="#FFE45E"; box="red@0.85"; bs="$FH"
  else
    color="white";   box="black@0.70"; bs="$FS"
  fi
  printf "drawtext=fontfile=%s:text='%s':fontcolor=%s:fontsize=%s:borderw=7:bordercolor=black:box=1:boxcolor=%s:boxborderw=18:x=(w-text_w)/2:y=%s:enable='between(t,%s,%s)'" \
    "$F" "$text" "$color" "$bs" "$box" "$CY" "$t0" "$t1"
}

CAPS=(
  # Phrase 1: "Voy a hacer reventa pero no como todos"
  "$(caption 'Voy a'           0.00 0.45)"
  "$(caption 'hacer'           0.45 0.80)"
  "$(caption 'REVENTA'         0.80 1.55 1)"
  "$(caption 'pero NO'         1.55 2.10)"
  "$(caption 'como todos'      2.10 2.95)"

  # Phrase 2: "ahora todo el mundo está haciendo reventa"
  "$(caption 'ahora'           3.05 3.45)"
  "$(caption 'todo el mundo'   3.45 4.15)"
  "$(caption 'está haciendo'   4.15 4.85)"
  "$(caption 'REVENTA'         4.85 5.75 1)"

  # Phrase 3: "pero yo lo voy a hacer solo con ropa real"
  "$(caption 'pero YO'         5.85 6.40)"
  "$(caption 'lo voy a hacer'  6.40 7.05)"
  "$(caption 'solo con'        7.05 7.45)"
  "$(caption 'ropa REAL'       7.45 8.15 1)"

  # Phrase 4 (cards take over for keywords)
  "$(caption 'de...'           8.15 8.45)"
  # MERCADILLOS card  8.45 - 9.30  (overlay)
  # LOTES card        9.30 - 9.95  (overlay)
  "$(caption 'cosas que'       9.95 10.40)"
  "$(caption 'puedes vender'   10.40 11.10)"
  "$(caption 'en'              11.10 11.30)"
  # VINTED sticker    11.30 - 11.85 (overlay)

  # Phrase 5
  "$(caption 'esta es la'      11.90 12.30)"
  # SEMANA 0 big card 12.30 - 13.50 (overlay)
  "$(caption 'y voy a'         13.50 13.85)"
  "$(caption 'documentar'      13.85 14.45)"
  "$(caption 'TODO'            14.45 14.95 1)"
  "$(caption 'cada SEMANA'     14.95 15.70 1)"
)

CHAIN=""
for d in "${CAPS[@]}"; do CHAIN+=",${d}"; done

# ---- 3) Render --------------------------------------------------------------
ffmpeg -y -i "$INPUT" \
  -i "$CARDS_DIR/mercadillo.png" \
  -i "$CARDS_DIR/lotes.png" \
  -i "$CARDS_DIR/vinted.png" \
  -i "$CARDS_DIR/semana0.png" \
  -filter_complex "
[0:v]setpts=PTS/1.10,
eq=saturation=1.20:contrast=1.08:brightness=0.02:gamma=0.98,
vignette=PI/5,
scale=1180:2096:flags=lanczos,
crop=w=1080:h=1920:x='(in_w-1080)/2+25*sin(t*0.9)':y='(in_h-1920)/2+25*cos(t*0.7)',
setsar=1,
drawbox=x=0:y=0:w=iw:h=ih:color=white@1.0:t=fill:enable='between(t,0,0.08)'
${CHAIN}
[base];
[base][1:v]overlay=x=(W-w)/2:y=H/2-300+10*sin(t*8):enable='between(t,8.45,9.30)'[m1];
[m1][2:v]overlay=x=(W-w)/2:y=H/2-200+10*sin(t*8):enable='between(t,9.30,9.95)'[m2];
[m2][3:v]overlay=x=(W-w)/2:y=H/2-150:enable='between(t,11.30,11.85)'[m3];
[m3][4:v]overlay=x=(W-w)/2:y=H/2-300:enable='between(t,12.30,13.50)'[v];
[0:a]atempo=1.10,volume=0.78[a]
" -map "[v]" -map "[a]" \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 192k -ar 44100 -movflags +faststart "$OUTPUT"

echo "Done -> $OUTPUT"
