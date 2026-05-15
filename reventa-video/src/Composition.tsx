import {
  AbsoluteFill,
  Sequence,
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
  // HOOK 0-3s
  {
    from: 14,
    duration: 38,
    text: "La mayoría piensa que la reventa…",
  },
  {
    from: 52,
    duration: 38,
    text: "…es solo comprar barato y vender caro.",
    highlight: "barato",
  },

  // DEMAND 3-12s
  {
    from: 92,
    duration: 60,
    text: "Pero los que realmente ganan dinero…",
    highlight: "ganan dinero",
  },
  {
    from: 152,
    duration: 60,
    text: "…entienden algo diferente.",
    highlight: "diferente",
  },
  {
    from: 220,
    duration: 64,
    text: "La clave es encontrar productos…",
    highlight: "encontrar",
  },
  {
    from: 286,
    duration: 70,
    text: "…que la gente quiere antes que los demás.",
    highlight: "antes",
  },

  // EXAMPLE 12-28s
  {
    from: 366,
    duration: 60,
    text: "Alguien encuentra una cámara antigua…",
    highlight: "cámara",
  },
  {
    from: 426,
    duration: 50,
    text: "…por solo 20 euros.",
    highlight: "20 euros",
  },
  {
    from: 482,
    duration: 56,
    text: "La limpia y hace mejores fotos.",
    highlight: "mejores fotos",
  },
  {
    from: 540,
    duration: 56,
    text: "Crea un anuncio mejor que el resto.",
    highlight: "mejor",
  },
  {
    from: 604,
    duration: 56,
    text: "Y empiezan a llegar mensajes…",
    highlight: "mensajes",
  },
  {
    from: 666,
    duration: 50,
    text: "…uno tras otro.",
  },
  {
    from: 722,
    duration: 50,
    text: "Días después…",
  },
  {
    from: 774,
    duration: 60,
    text: "…alguien la compra por 80.",
    highlight: "80",
  },

  // FINALE 28-40s
  {
    from: 846,
    duration: 56,
    text: "La reventa no consiste en suerte.",
    highlight: "suerte",
  },
  {
    from: 906,
    duration: 50,
    text: "Consiste en detectar valor…",
    highlight: "valor",
  },
  {
    from: 958,
    duration: 56,
    text: "…antes que los demás.",
    highlight: "antes",
  },
  {
    from: 1020,
    duration: 60,
    text: "Y yo voy a aprender cómo hacerlo.",
    highlight: "aprender",
  },
  {
    from: 1082,
    duration: 100,
    text: "Parte 2 mañana.",
    highlight: "Parte 2",
  },
];

export const ReventaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
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
