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
import { HookEp3 } from "./scenes/HookEp3";
import { Search } from "./scenes/Search";
import { Work } from "./scenes/Work";
import { Reveal } from "./scenes/Reveal";
import { Closing } from "./scenes/Closing";
import { COLORS, interFamily } from "../fonts";

export const EP3_FPS = 30;
export const EP3_DURATION_FRAMES = 1140; // 38s

const HOOK_START = 0;
const HOOK_LEN = 105; // 0 - 3.5s

const SEARCH_START = 105;
const SEARCH_LEN = 240; // 3.5 - 11.5s

const WORK_START = 345;
const WORK_LEN = 195; // 11.5 - 18s

const REVEAL_START = 540;
const REVEAL_LEN = 270; // 18 - 27s

const CLOSING_START = 810;
const CLOSING_LEN = 330; // 27 - 38s

// Subtitle cues — derived from ffmpeg silencedetect on the voiceover.
//   0.00 - 2.59  "Compré esto en un mercadillo por quince euros."
//   3.11 - 4.89  "Fui a uno de los sitios que te enseñé."
//   5.45 - 6.81  "Mercadillo de barrio."
//   7.67 - 9.52  "Estuve 40 minutos buscando,"
//   9.83 - 10.68 "hasta que vi esto."
//  11.56 - 12.72 "Le dediqué una tarde."
//  13.37 - 14.15 "Lo limpié,"
//  14.42 - 15.48 "hice fotos decentes,"
//  15.80 - 17.35 "y escribí un anuncio honesto."
//  17.99 - 19.06 "Tres días después…"
//  19.65 - 20.25 "vendido."
//  21.17 - 22.56 "Noventa y cinco euros."
//  23.31 - 25.32 "Beneficio, 80€, en una tarde."
//  25.62 - 26.99 "No fue suerte."
//  27.90 - 32.26 "Fue exactamente lo que te llevo contando 3 días."
//  33.13 - 34.87 "Esto es solo el principio."
//  35.70 - 37.19 "Sígueme para todo el viaje."
const SUBTITLES: SubtitleCue[] = [
  { from: 4, duration: 70, text: "Compré esto en un mercadillo…" },
  { from: 78, duration: 22, text: "…por 15€.", highlight: "15€" },

  { from: 95, duration: 54, text: "Fui a uno de los sitios que te enseñé.", highlight: "los sitios" },

  { from: 165, duration: 38, text: "Mercadillo de barrio.", highlight: "Mercadillo" },

  { from: 232, duration: 54, text: "Estuve 40 minutos buscando…", highlight: "40 minutos" },

  { from: 295, duration: 28, text: "…hasta que vi esto.", highlight: "esto" },

  { from: 349, duration: 38, text: "Le dediqué una tarde.", highlight: "una tarde" },

  { from: 403, duration: 25, text: "Lo limpié,", highlight: "limpié" },

  { from: 433, duration: 35, text: "hice fotos decentes,", highlight: "fotos decentes" },

  { from: 476, duration: 50, text: "y escribí un anuncio honesto.", highlight: "honesto" },

  { from: 541, duration: 35, text: "Tres días después…", highlight: "Tres días" },

  { from: 590, duration: 22, text: "Vendido.", highlight: "Vendido" },

  { from: 636, duration: 50, text: "95 euros.", highlight: "95" },

  { from: 700, duration: 80, text: "Beneficio · 80€ en una tarde.", highlight: "80€" },

  { from: 770, duration: 44, text: "No fue suerte.", highlight: "suerte" },

  { from: 838, duration: 65, text: "Fue lo que te llevo contando…", highlight: "te llevo contando" },
  { from: 905, duration: 64, text: "…tres días.", highlight: "tres días" },

  { from: 995, duration: 60, text: "Esto es solo el principio.", highlight: "el principio" },

  { from: 1072, duration: 60, text: "Sígueme para todo el viaje.", highlight: "todo el viaje" },
];

export const ReventaEp3Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Audio src={staticFile("ep3/voiceover.mp3")} />
      <Background />

      <Sequence from={HOOK_START} durationInFrames={HOOK_LEN}>
        <HookEp3 />
      </Sequence>
      <Sequence from={SEARCH_START} durationInFrames={SEARCH_LEN}>
        <Search />
      </Sequence>
      <Sequence from={WORK_START} durationInFrames={WORK_LEN}>
        <Work />
      </Sequence>
      <Sequence from={REVEAL_START} durationInFrames={REVEAL_LEN}>
        <Reveal />
      </Sequence>
      <Sequence from={CLOSING_START} durationInFrames={CLOSING_LEN}>
        <Closing />
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
  const w = interpolate(frame, [0, EP3_DURATION_FRAMES], [0, 100]);
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
          ● FINAL
        </span>
        <span>EP 03 / 03</span>
      </div>
    </AbsoluteFill>
  );
};

const SceneTransitions: React.FC = () => {
  const transitions = [
    HOOK_LEN,
    SEARCH_START + SEARCH_LEN,
    WORK_START + WORK_LEN,
    REVEAL_START + REVEAL_LEN,
  ];
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
