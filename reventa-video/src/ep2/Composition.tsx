import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Background } from "../components/Background";
import { SubtitleTrack, SubtitleCue } from "../components/Subtitle";
import { Hook2 } from "./scenes/Hook2";
import { Mainstream } from "./scenes/Mainstream";
import { Hidden } from "./scenes/Hidden";
import { Secret } from "./scenes/Secret";
import { COLORS, interFamily } from "../fonts";

export const EP2_FPS = 30;
export const EP2_DURATION_FRAMES = 1230; // 41s

const HOOK_START = 0;
const HOOK_LEN = 104; // 0 - 3.47s

const MAINSTREAM_START = 104;
const MAINSTREAM_LEN = 256; // 3.47 - 12s

const HIDDEN_START = 360;
const HIDDEN_LEN = 540; // 12 - 30s

const SECRET_START = 900;
const SECRET_LEN = 330; // 30 - 41s

// Timings derived from silencedetect on the ElevenLabs voiceover
const SUBTITLES: SubtitleCue[] = [
  // Para 1 (0.00 - 3.21s)  "Esto es donde los pros encuentran sus mejores gangas."
  {
    from: 4,
    duration: 44,
    text: "Esto es donde los pros…",
    highlight: "pros",
  },
  {
    from: 50,
    duration: 50,
    text: "…encuentran sus mejores gangas.",
    highlight: "gangas",
  },

  // Para 2 (3.47 - 7.42s)  "Wallapop, Vinted, eBay… aquí busca todo el mundo."
  {
    from: 105,
    duration: 70,
    text: "Wallapop, Vinted, eBay…",
    highlight: "Wallapop, Vinted, eBay",
  },
  {
    from: 180,
    duration: 42,
    text: "…aquí busca todo el mundo.",
    highlight: "todo el mundo",
  },

  // Para 3 (7.90 - 11.99s)  "Por eso aquí casi nadie gana dinero. El margen ya está apretado."
  {
    from: 237,
    duration: 50,
    text: "Aquí casi nadie gana dinero.",
    highlight: "casi nadie",
  },
  {
    from: 311,
    duration: 48,
    text: "El margen ya está apretado.",
    highlight: "apretado",
  },

  // Para 4 (12.64 - 15.24s)  "Donde sí se gana, es donde casi nadie mira."
  {
    from: 379,
    duration: 38,
    text: "Donde sí se gana…",
    highlight: "se gana",
  },
  {
    from: 419,
    duration: 38,
    text: "…es donde nadie está mirando.",
    highlight: "nadie",
  },

  // Para 5 (16.07 - 17.23s)  "Mercadillos de barrio."
  {
    from: 482,
    duration: 38,
    text: "Mercadillos de barrio.",
    highlight: "Mercadillos",
  },

  // Para 6 (17.59 - 18.73s)  "Vaciados de pisos."
  {
    from: 528,
    duration: 38,
    text: "Vaciados de pisos.",
    highlight: "Vaciados",
  },

  // Para 7 (19.02 - 20.27s)  "Lotes en subastas."
  {
    from: 571,
    duration: 40,
    text: "Lotes en subastas.",
    highlight: "Lotes",
  },

  // Para 8 (20.70 - 23.79s)  "Compras una caja por cien euros, con veinte objetos dentro."
  {
    from: 621,
    duration: 50,
    text: "Una caja por 100 €…",
    highlight: "100 €",
  },
  {
    from: 676,
    duration: 38,
    text: "…con 20 cosas dentro.",
    highlight: "20",
  },

  // Para 9 (24.24 - 26.22s)  "Y vendes cada uno, por separado."
  {
    from: 727,
    duration: 58,
    text: "Vendes cada uno, por separado.",
    highlight: "por separado",
  },

  // Para 10 (26.98 - 30.58s)  "El mismo objeto, en el sitio correcto, vale el doble."
  {
    from: 809,
    duration: 60,
    text: "Mismo objeto, sitio correcto…",
    highlight: "sitio correcto",
  },
  {
    from: 875,
    duration: 42,
    text: "…vale el doble.",
    highlight: "el doble",
  },

  // Para 11 (31.22 - 33.26s)  "El secreto no es comprar barato."
  {
    from: 937,
    duration: 60,
    text: "No es comprar barato.",
    highlight: "barato",
  },

  // Para 12 (33.69 - 35.80s)  "Es comprar donde nadie está mirando."
  {
    from: 1011,
    duration: 62,
    text: "Es comprar donde nadie mira.",
    highlight: "nadie mira",
  },

  // Para 13 (36.22 - 38.75s)  "Esta semana voy a probar uno de estos sitios."
  {
    from: 1087,
    duration: 80,
    text: "Esta semana lo pruebo.",
    highlight: "lo pruebo",
  },

  // Para 14 (39.14 - 40.51s)  "Parte 3, cuando lo haga."
  {
    from: 1175,
    duration: 50,
    text: "Parte 3 · mañana.",
    highlight: "Parte 3",
  },
];

export const ReventaEp2Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("ep2/voiceover.mp3")} />
      <Background />

      <Sequence from={HOOK_START} durationInFrames={HOOK_LEN}>
        <Hook2 />
      </Sequence>
      <Sequence from={MAINSTREAM_START} durationInFrames={MAINSTREAM_LEN}>
        <Mainstream />
      </Sequence>
      <Sequence from={HIDDEN_START} durationInFrames={HIDDEN_LEN}>
        <Hidden />
      </Sequence>
      <Sequence from={SECRET_START} durationInFrames={SECRET_LEN}>
        <Secret />
      </Sequence>

      <SceneTransitions />
      <ProgressBar />
      <TopBar />
      <SubtitleTrack cues={SUBTITLES} />

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
  const w = interpolate(frame, [0, EP2_DURATION_FRAMES], [0, 100]);
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
  const frame = useCurrentFrame();
  const pulse = (Math.sin(frame * 0.18) + 1) / 2;
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
        <span style={{ color: COLORS.green, opacity: 0.5 + pulse * 0.5 }}>
          ● EN VIVO
        </span>
        <span>EP 02 / 03</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneTransitions: React.FC = () => {
  const transitions = [HOOK_LEN, MAINSTREAM_START + MAINSTREAM_LEN, HIDDEN_START + HIDDEN_LEN];
  return (
    <>
      {transitions.map((f, i) => (
        <Sequence key={i} from={f - 4} durationInFrames={10} layout="none">
          <Flash />
        </Sequence>
      ))}
    </>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 3, 10], [0, 0.6, 0], {
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
