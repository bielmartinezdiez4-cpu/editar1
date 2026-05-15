import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Background } from "./components/Background";
import { SubtitleTrack, SubtitleCue } from "./components/Subtitle";
import { Hook } from "./scenes/Hook";
import { Demand } from "./scenes/Demand";
import { Example } from "./scenes/Example";
import { Finale } from "./scenes/Finale";
import { COLORS, interFamily } from "./fonts";

export const FPS = 30;
export const DURATION_FRAMES = 40 * FPS; // 1200 frames

// Scene boundaries
const HOOK_START = 0;
const HOOK_LEN = 90; // 0-3s
const DEMAND_START = 90;
const DEMAND_LEN = 270; // 3-12s
const EXAMPLE_START = 360;
const EXAMPLE_LEN = 480; // 12-28s
const FINALE_START = 840;
const FINALE_LEN = 360; // 28-40s

const SUBTITLES: SubtitleCue[] = [
  // Para 1 (audio 0.00 - 4.56s): "La mayoría piensa que la reventa es solo comprar barato y vender caro."
  { from: 0, duration: 53, text: "La mayoría piensa que la reventa…" },
  {
    from: 60,
    duration: 74,
    text: "…es solo comprar barato y vender caro.",
    highlight: "barato",
  },

  // Para 2 (audio 5.21 - 8.68s): "Pero los que realmente ganan dinero, entienden algo diferente."
  {
    from: 156,
    duration: 50,
    text: "Pero los que ganan dinero…",
    highlight: "ganan dinero",
  },
  {
    from: 212,
    duration: 47,
    text: "…entienden algo diferente.",
    highlight: "diferente",
  },

  // Para 3 (audio 9.42 - 13.15s): "La clave es encontrar productos que la gente quiere antes que los demás."
  {
    from: 283,
    duration: 53,
    text: "La clave es encontrar productos…",
    highlight: "encontrar",
  },
  {
    from: 340,
    duration: 54,
    text: "…que la gente quiere antes que los demás.",
    highlight: "antes",
  },

  // Para 4 (audio 13.92 - 17.48s): "Alguien encuentra una cámara antigua por solo veinte euros."
  {
    from: 418,
    duration: 50,
    text: "Alguien encuentra una cámara antigua…",
    highlight: "cámara",
  },
  {
    from: 472,
    duration: 50,
    text: "…por solo 20 euros.",
    highlight: "20 euros",
  },

  // Para 5 (audio 17.98 - 22.14s): "La limpia, hace mejores fotos, y crea un anuncio mejor que el resto."
  {
    from: 539,
    duration: 55,
    text: "La limpia, hace mejores fotos…",
    highlight: "mejores fotos",
  },
  {
    from: 599,
    duration: 63,
    text: "…y crea un anuncio mejor que el resto.",
    highlight: "mejor",
  },

  // Para 6 (audio 22.79 - 25.77s): "Empiezan a llegar mensajes, uno tras otro."
  {
    from: 684,
    duration: 43,
    text: "Empiezan a llegar mensajes…",
    highlight: "mensajes",
  },
  {
    from: 731,
    duration: 41,
    text: "…uno tras otro.",
  },

  // Para 7 (audio 26.49 - 29.04s): "Días después, alguien la compra por ochenta."
  {
    from: 795,
    duration: 76,
    text: "Días después… la compra por 80.",
    highlight: "80",
  },

  // Para 8 (audio 29.52 - 31.33s): "La reventa no consiste en suerte."
  {
    from: 886,
    duration: 53,
    text: "La reventa no consiste en suerte.",
    highlight: "suerte",
  },

  // Para 9 (audio 31.82 - 34.44s): "Consiste en detectar valor, antes que los demás."
  {
    from: 955,
    duration: 45,
    text: "Consiste en detectar valor…",
    highlight: "valor",
  },
  {
    from: 1003,
    duration: 35,
    text: "…antes que los demás.",
    highlight: "antes",
  },

  // Para 10 (audio 34.78 - 36.55s): "Y yo voy a aprender cómo hacerlo."
  {
    from: 1043,
    duration: 52,
    text: "Y yo voy a aprender cómo hacerlo.",
    highlight: "aprender",
  },

  // Para 11 (audio 37.22 - 38.75s): "Parte 2. Mañana."
  {
    from: 1117,
    duration: 75,
    text: "Parte 2 · mañana.",
    highlight: "Parte 2",
  },
];

export const ReventaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("voiceover.mp3")} />
      <Background />

      <Sequence from={HOOK_START} durationInFrames={HOOK_LEN}>
        <Hook />
      </Sequence>
      <Sequence from={DEMAND_START} durationInFrames={DEMAND_LEN}>
        <Demand />
      </Sequence>
      <Sequence from={EXAMPLE_START} durationInFrames={EXAMPLE_LEN}>
        <Example />
      </Sequence>
      <Sequence from={FINALE_START} durationInFrames={FINALE_LEN}>
        <Finale />
      </Sequence>

      {/* Transitions between scenes - quick flashes */}
      <SceneTransitions />

      {/* Top progress bar */}
      <ProgressBar />

      {/* TikTok-style watermark / hashtag */}
      <TopBar />

      {/* Subtitles always on top */}
      <SubtitleTrack cues={SUBTITLES} />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, DURATION_FRAMES], [0, 100]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          height: 5,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            background: COLORS.green,
            boxShadow: `0 0 12px ${COLORS.greenGlow}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const TopBar: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: interFamily,
          color: COLORS.gray,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: COLORS.green }}>● EN VIVO</span>
        <span>EP 01 / 03</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneTransitions: React.FC = () => {
  const transitionFrames = [HOOK_LEN, DEMAND_START + DEMAND_LEN, EXAMPLE_START + EXAMPLE_LEN];
  return (
    <>
      {transitionFrames.map((f, i) => (
        <Sequence key={i} from={f - 4} durationInFrames={10} layout="none">
          <Flash />
        </Sequence>
      ))}
    </>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 3, 10], [0, 0.55, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.green,
        opacity: op,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
