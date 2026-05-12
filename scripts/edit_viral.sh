#!/usr/bin/env bash
# Viral TikTok/Insta edit for reventa intro video.
# Usage: ./scripts/edit_viral.sh <input.mp4> [output.mp4]

set -euo pipefail

INPUT="${1:?input file required}"
OUTPUT="${2:-output/reventa_viral.mp4}"
FONT="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"

mkdir -p "$(dirname "$OUTPUT")"

ffmpeg -y -i "$INPUT" -filter_complex "
[0:v]setpts=PTS/1.10,
eq=saturation=1.18:contrast=1.06:brightness=0.02:gamma=0.98,
vignette=PI/5,
scale=1080:1920:flags=lanczos,setsar=1,
drawbox=x=0:y=0:w=iw:h=ih:color=white@1.0:t=fill:enable='between(t,0,0.08)',
drawtext=fontfile=${FONT}:text='BIENVENID@S':fontcolor=white:fontsize=110:borderw=8:bordercolor=black:box=1:boxcolor=black@0.55:boxborderw=22:x=(w-text_w)/2:y=200:alpha='if(lt(t,0.15),0,if(lt(t,0.45),(t-0.15)/0.30,1))':enable='between(t,0.05,2.4)',
drawtext=fontfile=${FONT}:text='A MI CANAL':fontcolor=white:fontsize=110:borderw=8:bordercolor=black:box=1:boxcolor=black@0.55:boxborderw=22:x=(w-text_w)/2:y=330:alpha='if(lt(t,0.35),0,if(lt(t,0.65),(t-0.35)/0.30,1))':enable='between(t,0.3,2.4)',
drawtext=fontfile=${FONT}:text='compraventa de ropa':fontcolor=#FFE45E:fontsize=58:borderw=5:bordercolor=black:x=(w-text_w)/2:y=470:alpha='if(lt(t,0.7),0,if(lt(t,1.0),(t-0.7)/0.30,1))':enable='between(t,0.7,2.4)',
drawtext=fontfile=${FONT}:text='ESTO ES LO QUE':fontcolor=white:fontsize=80:borderw=7:bordercolor=black:box=1:boxcolor=black@0.6:boxborderw=18:x=(w-text_w)/2:y=160:enable='between(t,2.5,11.5)',
drawtext=fontfile=${FONT}:text='VOY A VENDER':fontcolor=#FFE45E:fontsize=86:borderw=7:bordercolor=black:box=1:boxcolor=black@0.6:boxborderw=18:x=(w-text_w)/2:y=260:enable='between(t,2.5,11.5)',
drawtext=fontfile=${FONT}:text='proximas drops':fontcolor=white:fontsize=46:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-220:enable='between(t,3.0,11.5)',
drawtext=fontfile=${FONT}:text='SIGUE':fontcolor=white:fontsize=180:borderw=10:bordercolor=black:box=1:boxcolor=red@0.85:boxborderw=26:x=(w-text_w)/2:y=(h/2)-300:alpha='if(lt(t-11.7,0),0,if(lt(t-11.7,0.30),(t-11.7)/0.30,1))':enable='gte(t,11.7)',
drawtext=fontfile=${FONT}:text='para no':fontcolor=white:fontsize=86:borderw=7:bordercolor=black:box=1:boxcolor=black@0.7:boxborderw=18:x=(w-text_w)/2:y=(h/2)-80:enable='gte(t,11.9)',
drawtext=fontfile=${FONT}:text='PERDERTELAS':fontcolor=#FFE45E:fontsize=120:borderw=9:bordercolor=black:box=1:boxcolor=black@0.7:boxborderw=22:x=(w-text_w)/2:y=(h/2)+40:alpha='if(lt(t-12.1,0),0,if(lt(t-12.1,0.30),(t-12.1)/0.30,1))':enable='gte(t,12.1)',
drawtext=fontfile=${FONT}:text='nuevas drops cada semana':fontcolor=white:fontsize=50:borderw=5:bordercolor=black:box=1:boxcolor=black@0.6:boxborderw=14:x=(w-text_w)/2:y=(h/2)+230:enable='gte(t,12.3)'
[v];
[0:a]atempo=1.10,volume=0.75[a]
" -map "[v]" -map "[a]" \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 192k -ar 44100 -movflags +faststart "$OUTPUT"

echo "Done -> $OUTPUT"
