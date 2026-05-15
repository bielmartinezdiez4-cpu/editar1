# Reventa · Mini-doc TikTok 9:16

Vídeo vertical (1080×1920, 30 fps, 40 s) sobre "cómo funciona realmente la
reventa". Estética oscura + acentos verdes, motion-graphics modernos,
zooms suaves, transiciones con flash, subtítulos dinámicos siempre
visibles.

## Estructura del guion

| Tramo  | Tiempo    | Sección              |
| ------ | --------- | -------------------- |
| HOOK   | 0 – 3 s   | "Así funciona…"      |
| PARTE 2 | 3 – 12 s  | Demanda > Precio     |
| PARTE 3 | 12 – 28 s | Cámara 20 € → 80 €   |
| PARTE 4 | 28 – 40 s | No es suerte · Parte 2 mañana |

## Imágenes

Las 5 imágenes generadas por IA van en `public/` con los nombres
`image1.jpg` … `image5.jpg`. Ver `public/README.md` para el mapping. El
repo trae *placeholders* — sustitúyelos por las imágenes reales antes de
renderizar.

## Comandos

```bash
npm i                                         # instalar
npm run dev                                   # abrir Remotion Studio
npx remotion render Reventa out/reventa.mp4   # render final
```

Para añadir voz en off masculina/neutra, coloca `voiceover.mp3` en
`public/` y añade un `<Audio src={staticFile("voiceover.mp3")} />` desde
`@remotion/media` dentro de `Composition.tsx`.

## Arquitectura

```
src/
  Root.tsx            composición 1080×1920 · 30 fps · 1200 frames
  Composition.tsx     monta escenas + subtítulos + UI top
  fonts.ts            Inter + Bebas Neue + paleta
  components/
    Background.tsx    fondo oscuro con grid + glow verde
    AnimatedImage.tsx zoom/pan + overlays (fullbleed + card)
    Subtitle.tsx      subtítulos con highlight verde
    Tag.tsx           chips y price-tags
    BigText.tsx       títulos grandes con stagger
  scenes/
    Hook.tsx          0-3 s
    Demand.tsx        3-12 s
    Example.tsx       12-28 s
    Finale.tsx        28-40 s
```
