# Edit viral reventa

Script ffmpeg para convertir un vídeo vertical de reventa en un intro de canal con estilo TikTok/Reels.

## Qué hace

- Acelera 1.1× (más ritmo, dura ~15.7s).
- Boost de color (saturación + contraste) y viñeta sutil.
- Flash blanco de 0.08s al inicio para captar atención.
- 3 bloques de texto en pantalla:
  1. `BIENVENID@S A MI CANAL` + subtitulo `compraventa de ropa` (0–2.4s).
  2. `ESTO ES LO QUE VOY A VENDER` + footer `proximas drops` (2.5–11.5s).
  3. CTA: `SIGUE PARA NO PERDERTELAS` + `nuevas drops cada semana` (11.7s–fin).
- Audio original con volumen al 75% y atempo 1.1.

## Uso

```bash
./scripts/edit_viral.sh ruta/al/clip.mp4 output/reventa_viral.mp4
```

Requiere `ffmpeg` y la fuente DejaVu Sans Bold (en Ubuntu: `apt install fonts-dejavu`).

## Tunear

Edita `scripts/edit_viral.sh` para cambiar textos, colores (`#FFE45E` amarillo) y timings. Cada `enable='between(t,a,b)'` controla cuándo aparece cada rótulo.
