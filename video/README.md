# Viral edit pipeline (Remotion)

Auto-edita un MP4 vertical (9:16) en estilo TikTok/Reels/Shorts 2026: subtítulos
word-by-word estilo Hormozi, auto-zoom con punch en keywords, pattern interrupts,
vignette dinámica, hook badges y barra de progreso.

## Estructura

- `public/input.mp4` — clip de origen 9:16.
- `src/captions.json` — transcripción word-level `{captions: [{text,startMs,endMs,timestampMs}]}`.
- `src/viral/` — composición y capas (AutoZoom, Subtitles, PatternInterrupt, HookBadge, Vignette, ProgressBar).
- `src/viral/classify.ts` — detector de keywords: money (`$`, `€`, `%`), multipliers (`20x`), profit (vendí, compré, beneficio, profit...), hooks (mira, hoy, secreto...).
- `scripts/transcribe.mjs` — pipeline whisper.cpp → captions.json.

## Ejecutar

```bash
npm install
# Coloca tu clip vertical en public/input.mp4
npm run viralize          # transcribe + render → out/viral.mp4
# o por separado:
npm run transcribe
npm run render
npm run dev               # Remotion Studio para previsualizar
```

## Tunear

- Cambia el modelo Whisper en `scripts/transcribe.mjs` (`tiny | base | small | medium | large-v3`).
- Ajusta keywords en `src/viral/constants.ts`.
- Cambia `VIDEO_DURATION_SECONDS` en `src/viral/constants.ts` si el input dura otra cosa.
- Edita los badges del hook en `src/viral/HookBadge.tsx`.

## Estado del render generado en esta sesión

Esta sesión generó `out/viral.mp4` (no commiteado, `.gitignore`) usando un
`captions.json` **placeholder** porque el sandbox bloquea HuggingFace y no se
pudieron descargar los modelos Whisper. Sustituye `src/captions.json` por la
transcripción real y vuelve a renderizar con `npm run render`.
