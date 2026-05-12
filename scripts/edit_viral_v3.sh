#!/usr/bin/env bash
# Viral TikTok edit v3 — AGGRESSIVE mode.
#
# - Speed 1.15x for tighter pace.
# - HOOK card (TODOS HACEN REVENTA …YO NO) in first 1.8s with boom SFX.
# - 9 fake "camera cuts" via stepwise crop (x,y) jumps on a 1.4x upscale,
#   each accompanied by a whoosh SFX.
# - Word-by-word CapCut-style subtitles with highlighted keywords.
# - Sticker cards: MERCADILLOS, LOTES, VINTED, SEMANA 0.
# - Persistent corner sticker SIGUE+ from t=10s.
#
# Usage: ./scripts/edit_viral_v3.sh <input.mp4> [output.mp4]

set -euo pipefail

INPUT="${1:?input file required}"
OUTPUT="${2:-output/reventa_viral_v3.mp4}"
F="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"
CARDS="${CARDS_DIR:-/tmp/cards}"
SFX="${SFX_DIR:-/tmp/sfx}"

mkdir -p "$(dirname "$OUTPUT")" "$CARDS" "$SFX"

# ---- Generate sticker cards -------------------------------------------------
convert -size 1000x420 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 1000,420 30,30" \
  -fill white -stroke black -strokewidth 6 -font "$F" -pointsize 90 -gravity north \
  -annotate +0+30 "TODOS HACEN" \
  -fill "#FFE45E" -pointsize 180 -gravity center \
  -annotate +0+10 "REVENTA" \
  -fill white -pointsize 80 -gravity south \
  -annotate +0+35 "...YO NO" "$CARDS/hook.png"

convert -size 900x250 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 900,250 25,25" \
  -fill "#FFE45E" -stroke black -strokewidth 5 -font "$F" -pointsize 90 -gravity center \
  -annotate +0+0 "▸ MERCADILLOS ◂" "$CARDS/mercadillo.png"

convert -size 720x230 xc:none \
  -fill "#1D3557" -draw "roundrectangle 0,0 720,230 25,25" \
  -fill "#FFE45E" -stroke black -strokewidth 5 -font "$F" -pointsize 100 -gravity center \
  -annotate +0+0 "▸ LOTES ◂" "$CARDS/lotes.png"

convert -size 850x280 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 850,280 30,30" \
  -fill white -stroke black -strokewidth 6 -font "$F" -pointsize 70 -gravity north \
  -annotate +0+25 "★ EMPEZAMOS ★" \
  -fill "#FFE45E" -pointsize 120 -gravity south \
  -annotate +0+25 "SEMANA 0" "$CARDS/semana0.png"

convert -size 600x180 xc:none \
  -fill "#09B1BA" -draw "roundrectangle 0,0 600,180 90,90" \
  -fill white -stroke black -strokewidth 4 -font "$F" -pointsize 110 -gravity center \
  -annotate +0+0 "VINTED" "$CARDS/vinted.png"

convert -size 380x140 xc:none \
  -fill "#E63946" -draw "roundrectangle 0,0 380,140 70,70" \
  -fill white -stroke black -strokewidth 4 -font "$F" -pointsize 70 -gravity center \
  -annotate +0+0 "SIGUE +" "$CARDS/sigue.png"

# ---- Generate SFX -----------------------------------------------------------
ffmpeg -y -hide_banner -loglevel error -f lavfi -i "anoisesrc=duration=0.28:color=brown:amplitude=0.7" \
  -af "highpass=f=200,lowpass=f=4500,volume=0.55,afade=t=in:st=0:d=0.04,afade=t=out:st=0.20:d=0.08" \
  "$SFX/whoosh.wav"

ffmpeg -y -hide_banner -loglevel error -f lavfi -i "sine=frequency=60:duration=0.4" \
  -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.10:d=0.30,volume=0.8" \
  "$SFX/boom.wav"

# ---- Captions chain ---------------------------------------------------------
CY=1480       # caption baseline y
FS=88
FH=104        # highlight bigger

caption() {
  local text="$1" t0="$2" t1="$3" hi="${4:-0}"
  local color box bs
  if [[ "$hi" == "1" ]]; then
    color="#FFE45E"; box="red@0.88"; bs="$FH"
  else
    color="white";   box="black@0.72"; bs="$FS"
  fi
  printf "drawtext=fontfile=%s:text='%s':fontcolor=%s:fontsize=%s:borderw=7:bordercolor=black:box=1:boxcolor=%s:boxborderw=20:x=(w-text_w)/2:y=%s:enable='between(t,%s,%s)'" \
    "$F" "$text" "$color" "$bs" "$box" "$CY" "$t0" "$t1"
}

# Captions in output time (after 1.15x speedup).  No bottom captions during hook (0-1.8s).
CAPS=(
  # Phrase 2: ahora todo el mundo está haciendo REVENTA
  "$(caption 'ahora'           2.65 3.00)"
  "$(caption 'todo el mundo'   3.00 3.60)"
  "$(caption 'está haciendo'   3.60 4.22)"
  "$(caption 'REVENTA'         4.22 5.00 1)"

  # Phrase 3: pero YO lo voy a hacer solo con ropa REAL
  "$(caption 'pero YO'         5.09 5.55)"
  "$(caption 'lo voy a hacer'  5.55 6.10)"
  "$(caption 'solo con'        6.10 6.45)"
  "$(caption 'ropa REAL'       6.45 7.09 1)"

  # Phrase 4
  "$(caption 'de...'           7.09 7.35)"
  # MERCADILLOS card 7.35-8.09
  # LOTES card       8.09-8.65
  "$(caption 'cosas que'       8.65 9.04)"
  "$(caption 'puedes vender'   9.04 9.65)"
  "$(caption 'en'              9.65 9.83)"
  # VINTED card     9.83-10.30

  # Phrase 5
  "$(caption 'esta es la'      10.35 10.70)"
  # SEMANA 0 card   10.70-11.85
  "$(caption 'y voy a'         11.85 12.20)"
  "$(caption 'documentar'      12.20 12.75)"
  "$(caption 'TODO'            12.75 13.20 1)"
  "$(caption 'cada SEMANA'     13.20 14.00 1)"
  "$(caption 'no te lo pierdas' 14.10 15.02 1)"
)

CHAIN=""
for d in "${CAPS[@]}"; do CHAIN+=",${d}"; done

# Crop step expressions (1.4x upscale → canvas 1512x2688, crop 1080x1920)
# 9 cuts at 1.8, 3.0, 4.3, 5.5, 7.0, 8.5, 10.0, 11.5, 13.0
CX="if(lt(t,1.8),216,if(lt(t,3.0),40,if(lt(t,4.3),392,if(lt(t,5.5),100,if(lt(t,7.0),380,if(lt(t,8.5),216,if(lt(t,10.0),60,if(lt(t,11.5),216,if(lt(t,13.0),400,216)))))))))"
CY_EXPR="if(lt(t,1.8),384,if(lt(t,3.0),60,if(lt(t,4.3),60,if(lt(t,5.5),384,if(lt(t,7.0),700,if(lt(t,8.5),384,if(lt(t,10.0),720,if(lt(t,11.5),384,if(lt(t,13.0),100,384)))))))))"

# ---- Render -----------------------------------------------------------------
ffmpeg -y -i "$INPUT" \
  -i "$CARDS/hook.png" \
  -i "$CARDS/mercadillo.png" \
  -i "$CARDS/lotes.png" \
  -i "$CARDS/vinted.png" \
  -i "$CARDS/semana0.png" \
  -i "$CARDS/sigue.png" \
  -i "$SFX/boom.wav" \
  -i "$SFX/whoosh.wav" \
  -filter_complex "
[0:v]setpts=PTS/1.15,
eq=saturation=1.22:contrast=1.10:brightness=0.02:gamma=0.98,
vignette=PI/5,
scale=1512:2688:flags=lanczos,
crop=w=1080:h=1920:x='${CX}':y='${CY_EXPR}',
setsar=1,
drawbox=x=0:y=0:w=iw:h=ih:color=white@1.0:t=fill:enable='between(t,0,0.08)'
${CHAIN}
[base];

[base][1:v]overlay=x=(W-w)/2:y=H/2-220:enable='between(t,0.10,1.80)'[h1];

[h1][2:v]overlay=x=(W-w)/2:y=H/2-260+12*sin(t*10):enable='between(t,7.35,8.09)'[m1];
[m1][3:v]overlay=x=(W-w)/2:y=H/2-160+12*sin(t*10):enable='between(t,8.09,8.65)'[m2];
[m2][4:v]overlay=x=(W-w)/2:y=H/2-100:enable='between(t,9.83,10.30)'[m3];
[m3][5:v]overlay=x=(W-w)/2:y=H/2-300:enable='between(t,10.70,11.85)'[m4];
[m4][6:v]overlay=x=W-w-50:y=120:enable='gte(t,10.00)'[v];

[0:a]atempo=1.15,volume=0.78[voice];
[7:a]volume=0.6[boom];
[8:a]asplit=9[w0][w1][w2][w3][w4][w5][w6][w7][w8];
[w0]adelay=1800|1800[d0];
[w1]adelay=3000|3000[d1];
[w2]adelay=4300|4300[d2];
[w3]adelay=5500|5500[d3];
[w4]adelay=7000|7000[d4];
[w5]adelay=8500|8500[d5];
[w6]adelay=10000|10000[d6];
[w7]adelay=11500|11500[d7];
[w8]adelay=13000|13000[d8];
[voice][boom][d0][d1][d2][d3][d4][d5][d6][d7][d8]amix=inputs=11:normalize=0:duration=longest[a]
" -map "[v]" -map "[a]" \
  -t 15.05 \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 192k -ar 44100 -movflags +faststart "$OUTPUT"

echo "Done -> $OUTPUT"
