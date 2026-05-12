#!/usr/bin/env bash
# Viral TikTok edit v4 — modern creator style (2025).
#
# Minimal post. No big cards, no whooshes, no glitches. Just:
# - Subtle 1.10x pace
# - Clean ASS subtitles, white with thick black outline, one yellow keyword per chunk
# - 4 gentle position cuts every ~3s (small offset jumps, no drama)
# - Tiny saturation/contrast lift, no vignette
# - Voice audio kept clean (low gain, normalized)
#
# Usage: ./scripts/edit_viral_v4.sh <input.mp4> [output.mp4]

set -euo pipefail

INPUT="${1:?input file required}"
OUTPUT="${2:-output/reventa_viral_v4.mp4}"
ASS_FILE="${ASS_FILE:-/tmp/v4_captions.ass}"

mkdir -p "$(dirname "$OUTPUT")"

# ---- ASS subtitle file ------------------------------------------------------
# All times are in OUTPUT time domain (after 1.10x speedup).
cat > "$ASS_FILE" <<'ASS'
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Liberation Sans,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,5,2,2,40,40,380,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
; Phrase 1 -- "Voy a hacer reventa pero no como todos"
Dialogue: 0,0:00:00.05,0:00:00.65,Cap,,0,0,0,,Voy a hacer
Dialogue: 0,0:00:00.65,0:00:01.35,Cap,,0,0,0,,{\c&H00FFFF&}REVENTA
Dialogue: 0,0:00:01.35,0:00:01.95,Cap,,0,0,0,,pero no
Dialogue: 0,0:00:01.95,0:00:02.70,Cap,,0,0,0,,como todos

; Phrase 2 -- "ahora todo el mundo está haciendo reventa"
Dialogue: 0,0:00:02.78,0:00:03.18,Cap,,0,0,0,,ahora
Dialogue: 0,0:00:03.18,0:00:03.85,Cap,,0,0,0,,{\c&H00FFFF&}todo el mundo
Dialogue: 0,0:00:03.85,0:00:04.45,Cap,,0,0,0,,está haciendo
Dialogue: 0,0:00:04.45,0:00:05.25,Cap,,0,0,0,,reventa...

; Phrase 3 -- "pero yo lo hago solo con ropa real"
Dialogue: 0,0:00:05.32,0:00:05.78,Cap,,0,0,0,,pero {\c&H00FFFF&}YO
Dialogue: 0,0:00:05.78,0:00:06.30,Cap,,0,0,0,,lo hago
Dialogue: 0,0:00:06.30,0:00:06.75,Cap,,0,0,0,,con ropa
Dialogue: 0,0:00:06.75,0:00:07.45,Cap,,0,0,0,,{\c&H00FFFF&}REAL

; Phrase 4 -- "de mercadillos, lotes... cosas que se venden en Vinted"
Dialogue: 0,0:00:07.50,0:00:07.78,Cap,,0,0,0,,de
Dialogue: 0,0:00:07.78,0:00:08.50,Cap,,0,0,0,,{\c&H00FFFF&}mercadillos
Dialogue: 0,0:00:08.50,0:00:09.10,Cap,,0,0,0,,y {\c&H00FFFF&}lotes
Dialogue: 0,0:00:09.10,0:00:09.55,Cap,,0,0,0,,cosas que
Dialogue: 0,0:00:09.55,0:00:10.00,Cap,,0,0,0,,se venden
Dialogue: 0,0:00:10.00,0:00:10.70,Cap,,0,0,0,,en {\c&H00FFFF&}Vinted

; Phrase 5 -- "esta es la semana 0 y voy a documentar todo cada semana"
Dialogue: 0,0:00:10.78,0:00:11.20,Cap,,0,0,0,,esta es la
Dialogue: 0,0:00:11.20,0:00:12.10,Cap,,0,0,0,,{\c&H00FFFF&}semana 0
Dialogue: 0,0:00:12.10,0:00:12.60,Cap,,0,0,0,,voy a
Dialogue: 0,0:00:12.60,0:00:13.20,Cap,,0,0,0,,documentar
Dialogue: 0,0:00:13.20,0:00:13.65,Cap,,0,0,0,,{\c&H00FFFF&}todo
Dialogue: 0,0:00:13.65,0:00:14.35,Cap,,0,0,0,,cada semana
Dialogue: 0,0:00:14.45,0:00:15.40,Cap,,0,0,0,,{\c&H00FFFF&}sígueme la semana 1
ASS

# ---- Render -----------------------------------------------------------------
# Pre-scale 1.10x → canvas 1188x2112. crop 1080x1920 with subtle step offsets
# every ~3s (very small, "natural multi-take" feel).
CX="if(lt(t,3),54,if(lt(t,6),20,if(lt(t,9),88,if(lt(t,12),40,80))))"
CY_EXPR="if(lt(t,3),96,if(lt(t,6),40,if(lt(t,9),150,if(lt(t,12),60,120))))"

ffmpeg -y -i "$INPUT" \
  -filter_complex "
[0:v]setpts=PTS/1.10,
eq=saturation=1.10:contrast=1.04:brightness=0.01,
scale=1188:2112:flags=lanczos,
crop=w=1080:h=1920:x='${CX}':y='${CY_EXPR}',
setsar=1,
subtitles=${ASS_FILE}
[v];
[0:a]atempo=1.10,loudnorm=I=-16:LRA=11:TP=-1.5[a]
" -map "[v]" -map "[a]" \
  -t 15.5 \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 192k -ar 44100 -movflags +faststart "$OUTPUT"

echo "Done -> $OUTPUT"
